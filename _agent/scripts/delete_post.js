/**
 * VCT Platform — Emergency Post Deletion Tool
 * 
 * Usage: node delete_post.js --id [POST_ID]
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const https = require('https');

const PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const GRAPH_API = 'graph.facebook.com';
const API_VERSION = 'v21.0';

const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  params[key] = value;
}

const POST_ID = params.id;

async function run() {
  if (!POST_ID) {
    console.error('❌ Error: --id is required.');
    process.exit(1);
  }

  console.log(`⚠️ [Jon - CTO] Attempting to delete post: ${POST_ID}...`);
  
  try {
    const res = await request('DELETE', POST_ID, { access_token: PAGE_TOKEN });
    if (res.success) {
      console.log(`✅ SUCCESS: Post ${POST_ID} has been removed from the platform.`);
    } else {
      console.log(`⚠️ Response: ${JSON.stringify(res)}`);
    }
  } catch (err) {
    console.error(`❌ FAILED: ${err.message}`);
    process.exit(1);
  }
}

function request(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const queryString = '?' + new URLSearchParams(data).toString();
    const options = {
      hostname: GRAPH_API,
      path: `/${API_VERSION}/${endpoint}${queryString}`,
      method: method,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) reject(new Error(json.error.message));
          else resolve(json);
        } catch (e) { reject(new Error(body)); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

run().catch(err => {
  console.error(`❌ FATAL ERROR: ${err.message}`);
  process.exit(1);
});
