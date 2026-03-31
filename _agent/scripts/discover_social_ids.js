/**
 * VCT Platform — Discover linked Instagram & Threads accounts
 * Usage: node _agent/scripts/discover_social_ids.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const https = require('https');

const PAGE_ID = process.env.FB_PAGE_ID;
const PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

function graphRequest(method, endpoint, params) {
  return new Promise((resolve, reject) => {
    const qs = '?' + new URLSearchParams(params).toString();
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v21.0/${endpoint}${qs}`,
      method: method,
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) reject(new Error(JSON.stringify(json.error)));
          else resolve(json);
        } catch (e) {
          reject(new Error(body));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('==============================================');
  console.log('  🔍 VCT Social Account Discovery Tool');
  console.log('==============================================\n');

  if (!PAGE_ID || !PAGE_TOKEN) {
    console.error('❌ FB_PAGE_ID and FB_PAGE_TOKEN must be set in .env');
    process.exit(1);
  }

  // 1. Facebook Page info
  console.log('📘 Facebook Page:');
  try {
    const page = await graphRequest('GET', PAGE_ID, {
      fields: 'name,id,instagram_business_account',
      access_token: PAGE_TOKEN,
    });
    console.log(`   Name: ${page.name}`);
    console.log(`   ID:   ${page.id}`);

    // 2. Instagram Business Account
    if (page.instagram_business_account) {
      const igId = page.instagram_business_account.id;
      console.log(`\n📸 Instagram Business Account:`);
      try {
        const ig = await graphRequest('GET', igId, {
          fields: 'name,username,id,profile_picture_url,followers_count,media_count',
          access_token: PAGE_TOKEN,
        });
        console.log(`   Username:  @${ig.username || 'N/A'}`);
        console.log(`   ID:        ${ig.id}`);
        console.log(`   Followers: ${ig.followers_count || 0}`);
        console.log(`   Posts:     ${ig.media_count || 0}`);
        console.log(`\n   ✅ Add to .env: IG_USER_ID=${ig.id}`);
      } catch (err) {
        console.log(`   ID: ${igId}`);
        console.log(`   ⚠️ Could not fetch details: ${err.message}`);
        console.log(`\n   ✅ Add to .env: IG_USER_ID=${igId}`);
      }
    } else {
      console.log('\n⚠️ No Instagram Business Account linked to this Facebook Page.');
      console.log('   To link:');
      console.log('   1. Go to your Instagram app → Settings → Account → Switch to Professional Account');
      console.log('   2. Go to Facebook Page Settings → Linked Accounts → Instagram');
      console.log('   3. Connect your Instagram account');
    }
  } catch (err) {
    console.error(`❌ Error querying Facebook Page: ${err.message}`);
  }

  // 3. Check token permissions
  console.log('\n🔑 Token Permissions:');
  try {
    const debug = await graphRequest('GET', 'debug_token', {
      input_token: PAGE_TOKEN,
      access_token: PAGE_TOKEN,
    });
    const perms = debug.data?.scopes || [];
    console.log(`   Granted: ${perms.join(', ')}`);

    const needed = ['pages_manage_posts', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish'];
    const missing = needed.filter((p) => !perms.includes(p));
    if (missing.length > 0) {
      console.log(`\n   ⚠️ Missing permissions for IG publishing: ${missing.join(', ')}`);
      console.log('   → Go to Meta App Dashboard → App Review → Request these permissions');
    } else {
      console.log('   ✅ All required permissions for IG publishing are granted!');
    }
  } catch (err) {
    console.log(`   ⚠️ Could not debug token: ${err.message}`);
  }

  // 4. Threads info
  console.log('\n🧵 Threads:');
  console.log('   Threads API requires a separate OAuth token.');
  console.log('   Steps to set up:');
  console.log('   1. Add "Threads" product to your Meta App (developers.facebook.com)');
  console.log('   2. Complete Threads OAuth authorization flow');
  console.log('   3. Add THREADS_USER_ID and THREADS_TOKEN to .env');
  console.log('   4. Run this script again to verify');

  if (process.env.THREADS_USER_ID && process.env.THREADS_TOKEN) {
    console.log(`\n   ✅ Threads credentials found in .env!`);
    console.log(`   User ID: ${process.env.THREADS_USER_ID}`);
  }

  console.log('\n==============================================');
}

main().catch((err) => {
  console.error(`❌ Fatal: ${err.message}`);
  process.exit(1);
});
