/**
 * Quick test: Can we access IG API with current token?
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const https = require('https');

const TOKEN = process.env.FB_PAGE_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;
const IG_ID = process.env.IG_USER_ID;

function gql(ep, p) {
  return new Promise((r, j) => {
    const qs = '?' + new URLSearchParams(p).toString();
    https.get({ hostname: 'graph.facebook.com', path: '/v21.0/' + ep + qs }, res => {
      let b = ''; res.on('data', d => b += d);
      res.on('end', () => { try { r(JSON.parse(b)); } catch(e) { j(e); } });
    }).on('error', j);
  });
}

(async () => {
  const results = {};

  // Test 1: Can we query the IG account?
  console.log('--- Test 1: Query IG User ID directly ---');
  try {
    const ig = await gql(IG_ID, { fields: 'id,username,name,profile_picture_url', access_token: TOKEN });
    results.ig_query = ig;
  } catch(e) { results.ig_query_error = e.message; }

  // Test 2: Can we see IG through the page?
  console.log('--- Test 2: Query IG via Page ---');
  try {
    const page = await gql(PAGE_ID, { fields: 'instagram_business_account{id,username}', access_token: TOKEN });
    results.page_ig = page;
  } catch(e) { results.page_ig_error = e.message; }

  // Test 3: Check token info
  console.log('--- Test 3: Token type ---');
  try {
    const debug = await gql('debug_token', { input_token: TOKEN, access_token: TOKEN });
    results.token_type = debug.data?.type;
    results.token_expires = debug.data?.expires_at;
    results.is_valid = debug.data?.is_valid;
    results.has_ig_basic = (debug.data?.scopes || []).includes('instagram_basic');
    results.has_ig_publish = (debug.data?.scopes || []).includes('instagram_content_publish');
  } catch(e) { results.token_error = e.message; }

  process.stdout.write(JSON.stringify(results, null, 2));
})();
