/**
 * VCT Platform — Multi-Platform Social Publisher v2.0
 *
 * Publishes content to Facebook, Instagram, and Threads using Meta APIs.
 *
 * Usage:
 *   All platforms:   node publish_post.js --config "config.json" --platforms facebook,instagram,threads
 *   Facebook only:   node publish_post.js --message "Caption" --image "path/to/image.png"
 *   Verify token:    node publish_post.js --verify
 *   Discover IDs:    node publish_post.js --discover
 *
 * Config JSON format:
 *   {
 *     "message": "Your caption text",
 *     "image": "path/to/image.png",
 *     "platforms": ["facebook", "instagram", "threads"]
 *   }
 *
 * Required .env variables:
 *   FB_PAGE_ID        — Facebook Page ID
 *   FB_PAGE_TOKEN     — Facebook Page Access Token
 *   IG_USER_ID        — Instagram Business Account ID (run --discover to find)
 *   THREADS_USER_ID   — Threads User ID (optional)
 *   THREADS_TOKEN     — Threads Access Token (optional, uses FB_PAGE_TOKEN if empty)
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const https = require('https');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════
const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const THREADS_USER_ID = process.env.THREADS_USER_ID;
const THREADS_TOKEN = process.env.THREADS_TOKEN || FB_PAGE_TOKEN;

const LINKEDIN_TOKEN = process.env.LINKEDIN_TOKEN;
const LINKEDIN_PERSON_URN = process.env.LINKEDIN_PERSON_URN;
const LINKEDIN_ORG_URN = process.env.LINKEDIN_ORG_URN;

const GRAPH_API = 'graph.facebook.com';
const THREADS_API = 'graph.threads.net';
const LINKEDIN_API = 'api.linkedin.com';
const API_VERSION = 'v21.0';
const THREADS_API_VERSION = 'v1.0';
const LINKEDIN_VERSION = 'v2';

// ═══════════════════════════════════════
// ARGUMENT PARSING
// ═══════════════════════════════════════
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].replace('--', '');
    // Flags without values
    if (!args[i + 1] || args[i + 1].startsWith('--')) {
      params[key] = true;
    } else {
      params[key] = args[++i];
    }
  }
}

// ═══════════════════════════════════════
// HTTP HELPERS
// ═══════════════════════════════════════

/** Generic HTTPS JSON request to Graph API (Facebook) */
function graphRequest(method, endpoint, data, hostname = GRAPH_API, version = API_VERSION) {
  return new Promise((resolve, reject) => {
    const queryString = method === 'GET' ? '?' + new URLSearchParams(data).toString() : '';
    const options = {
      hostname,
      path: `/${version}/${endpoint}${queryString}`,
      method,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) reject(new Error(`[${json.error.code}] ${json.error.message}`));
          else resolve(json);
        } catch (e) {
          reject(new Error(body));
        }
      });
    });
    req.on('error', reject);
    if (method === 'POST') req.write(JSON.stringify(data));
    req.end();
  });
}

/** Upload photo via multipart/form-data (for Facebook) */
function uploadPhoto(pageId, token, filePath, caption, published = true) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Date.now();
    const imageBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    let head = `--${boundary}\r\nContent-Disposition: form-data; name="message"\r\n\r\n${caption}\r\n`;
    head += `--${boundary}\r\nContent-Disposition: form-data; name="access_token"\r\n\r\n${token}\r\n`;
    head += `--${boundary}\r\nContent-Disposition: form-data; name="published"\r\n\r\n${published}\r\n`;
    head += `--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`;
    const tail = `\r\n--${boundary}--\r\n`;

    const body = Buffer.concat([Buffer.from(head, 'utf-8'), imageBuffer, Buffer.from(tail, 'utf-8')]);

    const options = {
      hostname: GRAPH_API,
      path: `/${API_VERSION}/${pageId}/photos`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    };

    const req = https.request(options, (res) => {
      let resBody = '';
      res.on('data', (d) => (resBody += d));
      res.on('end', () => {
        try {
          const json = JSON.parse(resBody);
          if (json.error) reject(new Error(`[${json.error.code}] ${json.error.message}`));
          else resolve(json);
        } catch (e) {
          reject(new Error(resBody));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Get public CDN URL of a Facebook photo */
async function getPhotoCdnUrl(photoId) {
  const result = await graphRequest('GET', photoId, {
    fields: 'images',
    access_token: FB_PAGE_TOKEN,
  });
  if (result.images && result.images.length > 0) {
    // Return the largest image
    const sorted = result.images.sort((a, b) => b.width - a.width);
    return sorted[0].source;
  }
  throw new Error('Could not retrieve photo CDN URL');
}

/** Sleep helper */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Generic HTTPS Request to LinkedIn */
function linkedinRequest(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: LINKEDIN_API,
      path: `/${LINKEDIN_VERSION}/${endpoint}`,
      method,
      headers: {
        'Authorization': `Bearer ${LINKEDIN_TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    };
    if (method === 'POST' || method === 'PUT') options.headers['Content-Type'] = 'application/json';

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        try {
          const json = JSON.parse(body || '{}');
          if (res.statusCode >= 400) reject(new Error(`[${res.statusCode}] ${json.message || body}`));
          else resolve(json);
        } catch (e) {
          if (res.statusCode >= 400) reject(new Error(`[${res.statusCode}] ${body}`));
          else resolve({ body });
        }
      });
    });
    req.on('error', reject);
    if (data && (method === 'POST' || method === 'PUT')) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

/** Upload image binary to LinkedIn */
function uploadBinaryToUrl(uploadUrl, filePath) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(uploadUrl);
    const options = {
      hostname: urlParts.hostname,
      path: urlParts.pathname + urlParts.search,
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
         if (res.statusCode >= 400) reject(new Error(`Binary upload failed [${res.statusCode}]: ${body}`));
         else resolve(true);
      });
    });
    req.on('error', reject);
    fs.createReadStream(filePath).pipe(req);
  });
}

// ═══════════════════════════════════════
// PLATFORM PUBLISHERS
// ═══════════════════════════════════════

/** Publish to LinkedIn */
async function publishLinkedIn(message, imagePath, authorUrn) {
  const authorType = String(authorUrn).includes('organization') ? 'ORGANIZATION' : 'PERSON';
  console.log(`\n💼 [LINKEDIN ${authorType}] Publishing...`);

  if (!LINKEDIN_TOKEN) {
    console.log('   ⚠️ SKIPPED — LINKEDIN_TOKEN not set in .env');
    return { platform: `linkedin_${authorType.toLowerCase()}`, success: false, error: 'LINKEDIN_TOKEN not configured' };
  }
  if (!authorUrn) {
    console.log('   ⚠️ SKIPPED — ID not set in .env');
    return { platform: `linkedin_${authorType.toLowerCase()}`, success: false, error: 'AUTHOR_URN not configured' };
  }

  try {
    let assetUrn = null;

    if (imagePath) {
      const absPath = path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), imagePath);
      if (fs.existsSync(absPath)) {
        console.log(`   📦 Registering image upload with LinkedIn...`);
        const registerBody = {
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: authorUrn,
            serviceRelationships: [{ relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }]
          }
        };
        const registerRes = await linkedinRequest('POST', 'assets?action=registerUpload', registerBody);
        const uploadUrl = registerRes.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
        assetUrn = registerRes.value.asset;

        console.log(`   📸 Uploading image binary...`);
        await uploadBinaryToUrl(uploadUrl, absPath);
        console.log(`   ✅ Image uploaded to LinkedIn Assets`);
      } else {
        console.log(`   ⚠️ Image not found: ${absPath}. Publishing text-only...`);
      }
    }

    console.log('   🚀 Publishing UGC Post...');
    const postBody = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: message },
          shareMediaCategory: assetUrn ? "IMAGE" : "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    if (assetUrn) {
      postBody.specificContent["com.linkedin.ugc.ShareContent"].media = [{ status: "READY", media: assetUrn }];
    }

    const postRes = await linkedinRequest('POST', 'ugcPosts', postBody);
    console.log(`   ✅ SUCCESS — LinkedIn ID: ${postRes.id}`);
    return { platform: `linkedin_${authorType.toLowerCase()}`, success: true, postId: postRes.id };

  } catch (err) {
    console.log(`   ❌ FAILED — ${err.message}`);
    return { platform: `linkedin_${authorType.toLowerCase()}`, success: false, error: err.message };
  }
}

/** Publish to Facebook Fanpage */
async function publishFacebook(message, imagePath) {
  console.log('\n📘 [FACEBOOK] Publishing...');

  if (imagePath) {
    const absPath = path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), imagePath);
    if (fs.existsSync(absPath)) {
      console.log(`   📸 Uploading image: ${path.basename(absPath)}`);
      const result = await uploadPhoto(FB_PAGE_ID, FB_PAGE_TOKEN, absPath, message, true);
      const postId = result.post_id || result.id;
      console.log(`   ✅ SUCCESS — https://facebook.com/${postId}`);
      return { platform: 'facebook', success: true, postId, photoId: result.id };
    } else {
      console.log(`   ⚠️ Image not found: ${absPath}. Publishing text-only...`);
    }
  }

  // Text-only fallback
  const result = await graphRequest('POST', `${FB_PAGE_ID}/feed`, {
    message,
    access_token: FB_PAGE_TOKEN,
  });
  console.log(`   ✅ SUCCESS — https://facebook.com/${result.id}`);
  return { platform: 'facebook', success: true, postId: result.id };
}

/** Publish to Instagram via Content Publishing API */
async function publishInstagram(message, imageUrl) {
  console.log('\n📸 [INSTAGRAM] Publishing...');

  if (!IG_USER_ID) {
    console.log('   ⚠️ SKIPPED — IG_USER_ID not set in .env');
    console.log('   → Run: node publish_post.js --discover');
    return { platform: 'instagram', success: false, error: 'IG_USER_ID not configured' };
  }

  if (!imageUrl) {
    console.log('   ⚠️ SKIPPED — Instagram requires an image. Text-only posts not supported.');
    return { platform: 'instagram', success: false, error: 'Image required' };
  }

  try {
    // Step 1: Create media container
    console.log('   📦 Creating media container...');
    const container = await graphRequest('POST', `${IG_USER_ID}/media`, {
      image_url: imageUrl,
      caption: message,
      access_token: FB_PAGE_TOKEN,
    });
    const containerId = container.id;
    console.log(`   📦 Container ID: ${containerId}`);

    // Step 2: Wait for container to be ready (poll status)
    console.log('   ⏳ Waiting for processing...');
    let status = 'IN_PROGRESS';
    let attempts = 0;
    while (status === 'IN_PROGRESS' && attempts < 30) {
      await sleep(2000);
      const check = await graphRequest('GET', containerId, {
        fields: 'status_code',
        access_token: FB_PAGE_TOKEN,
      });
      status = check.status_code;
      attempts++;
      process.stdout.write('.');
    }
    console.log('');

    if (status === 'ERROR') {
      throw new Error('Instagram rejected the media container');
    }

    // Step 3: Publish
    console.log('   🚀 Publishing...');
    const result = await graphRequest('POST', `${IG_USER_ID}/media_publish`, {
      creation_id: containerId,
      access_token: FB_PAGE_TOKEN,
    });
    console.log(`   ✅ SUCCESS — https://instagram.com/p/${result.id}`);
    return { platform: 'instagram', success: true, postId: result.id };
  } catch (err) {
    console.log(`   ❌ FAILED — ${err.message}`);
    return { platform: 'instagram', success: false, error: err.message };
  }
}

/** Publish to Threads via Threads API */
async function publishThreads(message, imageUrl) {
  console.log('\n🧵 [THREADS] Publishing...');

  if (!THREADS_USER_ID) {
    console.log('   ⚠️ SKIPPED — THREADS_USER_ID not set in .env');
    return { platform: 'threads', success: false, error: 'THREADS_USER_ID not configured' };
  }

  try {
    const mediaType = imageUrl ? 'IMAGE' : 'TEXT';
    const containerParams = {
      media_type: mediaType,
      text: message,
      access_token: THREADS_TOKEN,
    };
    if (imageUrl) {
      containerParams.image_url = imageUrl;
    }

    // Step 1: Create thread container
    console.log(`   📦 Creating ${mediaType} container...`);
    const container = await graphRequest(
      'POST',
      `${THREADS_USER_ID}/threads`,
      containerParams,
      THREADS_API,
      THREADS_API_VERSION
    );
    const containerId = container.id;
    console.log(`   📦 Container ID: ${containerId}`);

    // Step 2: Wait for processing
    console.log('   ⏳ Waiting for processing...');
    let status = 'IN_PROGRESS';
    let attempts = 0;
    while (status === 'IN_PROGRESS' && attempts < 30) {
      await sleep(2000);
      try {
        const check = await graphRequest(
          'GET',
          containerId,
          { fields: 'status', access_token: THREADS_TOKEN },
          THREADS_API,
          THREADS_API_VERSION
        );
        status = check.status;
      } catch (e) {
        // Some statuses may not be queryable, continue
      }
      attempts++;
      process.stdout.write('.');
    }
    console.log('');

    // Step 3: Publish
    console.log('   🚀 Publishing...');
    const result = await graphRequest(
      'POST',
      `${THREADS_USER_ID}/threads_publish`,
      { creation_id: containerId, access_token: THREADS_TOKEN },
      THREADS_API,
      THREADS_API_VERSION
    );
    console.log(`   ✅ SUCCESS — Thread ID: ${result.id}`);
    return { platform: 'threads', success: true, postId: result.id };
  } catch (err) {
    console.log(`   ❌ FAILED — ${err.message}`);
    return { platform: 'threads', success: false, error: err.message };
  }
}

// ═══════════════════════════════════════
// VERIFY TOKEN
// ═══════════════════════════════════════
async function verifyToken() {
  console.log('🔍 Verifying Facebook Token...');
  try {
    const res = await graphRequest('GET', FB_PAGE_ID, {
      access_token: FB_PAGE_TOKEN,
      fields: 'name,id',
    });
    console.log(`✅ Token valid. Page: ${res.name} (${res.id})`);

    // Check IG link
    const page = await graphRequest('GET', FB_PAGE_ID, {
      access_token: FB_PAGE_TOKEN,
      fields: 'instagram_business_account',
    });
    if (page.instagram_business_account) {
      console.log(`📸 Instagram linked: ID ${page.instagram_business_account.id}`);
    } else {
      console.log('⚠️ Instagram NOT linked to this Facebook Page');
    }
  } catch (err) {
    console.error(`❌ Invalid Token: ${err.message}`);
    process.exit(1);
  }
}

// ═══════════════════════════════════════
// DISCOVER LINKED ACCOUNTS
// ═══════════════════════════════════════
async function discover() {
  console.log('🔍 Discovering linked social accounts...\n');

  // Page info
  const page = await graphRequest('GET', FB_PAGE_ID, {
    fields: 'name,id,instagram_business_account',
    access_token: FB_PAGE_TOKEN,
  });
  console.log(`📘 Facebook Page: ${page.name} (${page.id})`);

  if (page.instagram_business_account) {
    const igId = page.instagram_business_account.id;
    console.log(`📸 Instagram Business Account ID: ${igId}`);
    console.log(`   → Add to .env: IG_USER_ID=${igId}`);
  } else {
    console.log('⚠️ No Instagram Business Account linked.');
  }

  // Token scopes
  const debug = await graphRequest('GET', 'debug_token', {
    input_token: FB_PAGE_TOKEN,
    access_token: FB_PAGE_TOKEN,
  });
  if (debug.data) {
    const scopes = debug.data.scopes || [];
    const igPerms = ['instagram_basic', 'instagram_content_publish'];
    const missing = igPerms.filter((p) => !scopes.includes(p));
    if (!missing.length) console.log('✅ Instagram publishing permissions OK');
  }

  // LinkedIn Info
  if (LINKEDIN_TOKEN) {
    try {
       console.log('\n💼 LinkedIn Profile Data...');
       const me = await linkedinRequest('GET', 'userinfo');
       console.log(`   ✅ LinkedIn Person Found: urn:li:person:${me.sub}`);
       console.log(`   → Add to .env: LINKEDIN_PERSON_URN=urn:li:person:${me.sub}`);
       
       const orgs = await linkedinRequest('GET', 'organizationAcls?q=roleAssignee');
       if (orgs.elements && orgs.elements.length > 0) {
          const orgUrn = orgs.elements[0].organization;
          console.log(`   ✅ LinkedIn Organization Found: ${orgUrn}`);
          console.log(`   → Add to .env: LINKEDIN_ORG_URN=${orgUrn}`);
       } else {
          console.log('   ⚠️ No LinkedIn Organization pages found for this user.');
       }
    } catch(e) {
       console.log(`   ❌ LinkedIn API Error: ${e.message}`);
    }
  }
}

// ═══════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════
async function run() {
  // Handle flags
  if (params.verify) return await verifyToken();
  if (params.discover) return await discover();

  // Load config or CLI args
  let finalMessage = params.message;
  let finalImagePath = params.image;
  let platforms = params.platforms ? params.platforms.split(',').map((s) => s.trim().toLowerCase()) : ['facebook'];

  if (params.config) {
    const configPath = path.isAbsolute(params.config) ? params.config : path.join(process.cwd(), params.config);
    if (fs.existsSync(configPath)) {
      console.log(`📂 Loading config: ${configPath}`);
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      finalMessage = config.message || config.caption || finalMessage;
      finalImagePath = config.image || config.image_path || finalImagePath;
      if (config.platforms) platforms = config.platforms;
    } else {
      console.error(`❌ Config file not found: ${configPath}`);
      process.exit(1);
    }
  }

  // Sanitize
  if (finalMessage) {
    finalMessage = finalMessage.replace(/\\$/g, '').trim();
  }

  if (!finalMessage) {
    console.error('❌ Error: --message, --config, or config with "message" field is required.');
    console.log('\nUsage:');
    console.log('  node publish_post.js --message "Caption" --image "img.png"');
    console.log('  node publish_post.js --config "config.json" --platforms facebook,instagram,threads');
    console.log('  node publish_post.js --verify');
    console.log('  node publish_post.js --discover');
    process.exit(1);
  }

  console.log('══════════════════════════════════════════');
  console.log('  🚀 VCT Multi-Platform Publisher v2.0');
  console.log('══════════════════════════════════════════');
  console.log(`📝 Platforms: ${platforms.join(', ')}`);
  console.log(`📝 Message: ${finalMessage.substring(0, 80)}...`);
  if (finalImagePath) console.log(`🖼️  Image: ${finalImagePath}`);

  const results = [];
  let publicImageUrl = null;

  // ── STEP 1: Facebook (always first, to get CDN URL for IG/Threads) ──
  if (platforms.includes('facebook')) {
    try {
      const fbResult = await publishFacebook(finalMessage, finalImagePath);
      results.push(fbResult);

      // If we published a photo, get its CDN URL for IG/Threads
      if (fbResult.photoId && (platforms.includes('instagram') || platforms.includes('threads'))) {
        console.log('\n🔗 Retrieving public image URL for cross-posting...');
        try {
          publicImageUrl = await getPhotoCdnUrl(fbResult.photoId);
          console.log(`   ✅ CDN URL ready`);
        } catch (e) {
          console.log(`   ⚠️ Could not get CDN URL: ${e.message}`);
        }
      }
    } catch (err) {
      console.log(`   ❌ Facebook FAILED: ${err.message}`);
      results.push({ platform: 'facebook', success: false, error: err.message });
    }
  } else if ((platforms.includes('instagram') || platforms.includes('threads')) && finalImagePath) {
    // If Facebook is NOT in the platform list but we need a public URL,
    // upload as unpublished photo to get CDN URL
    const absPath = path.isAbsolute(finalImagePath) ? finalImagePath : path.join(process.cwd(), finalImagePath);
    if (fs.existsSync(absPath)) {
      console.log('\n🔗 Uploading image to get public URL (unpublished)...');
      try {
        const photo = await uploadPhoto(FB_PAGE_ID, FB_PAGE_TOKEN, absPath, '', false);
        publicImageUrl = await getPhotoCdnUrl(photo.id);
        console.log(`   ✅ CDN URL ready`);
      } catch (e) {
        console.log(`   ⚠️ Could not upload: ${e.message}`);
      }
    }
  }

  // ── STEP 2: Instagram ──
  if (platforms.includes('instagram')) {
    const igResult = await publishInstagram(finalMessage, publicImageUrl);
    results.push(igResult);
  }

  // ── STEP 3: Threads ──
  if (platforms.includes('threads')) {
    const threadsResult = await publishThreads(finalMessage, publicImageUrl);
    results.push(threadsResult);
  }

  // ── STEP 4: LinkedIn ──
  if (platforms.includes('linkedin')) {
    if (LINKEDIN_PERSON_URN) {
      const pResult = await publishLinkedIn(finalMessage, finalImagePath, LINKEDIN_PERSON_URN);
      results.push(pResult);
    }
    if (LINKEDIN_ORG_URN) {
      const oResult = await publishLinkedIn(finalMessage, finalImagePath, LINKEDIN_ORG_URN);
      results.push(oResult);
    }
  }

  // ── SUMMARY ──
  console.log('\n══════════════════════════════════════════');
  console.log('  📊 PUBLISH SUMMARY');
  console.log('══════════════════════════════════════════');
  results.forEach((r) => {
    const icon = r.success ? '✅' : '❌';
    const detail = r.success ? r.postId : r.error;
    console.log(`  ${icon} ${r.platform.toUpperCase().padEnd(12)} ${detail}`);
  });
  console.log('══════════════════════════════════════════');

  // Exit with error if any platform failed
  const hasFailure = results.some((r) => !r.success);
  if (hasFailure) process.exit(1);
}

run().catch((err) => {
  console.error(`❌ FATAL ERROR: ${err.message}`);
  process.exit(1);
});
