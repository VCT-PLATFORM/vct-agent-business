require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const https = require('https');
const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_TOKEN;

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
  const r = {};
  try {
    const p = await gql(PAGE_ID, { fields: 'name,id,instagram_business_account', access_token: TOKEN });
    r.page_name = p.name; r.page_id = p.id;
    r.ig_linked = !!p.instagram_business_account;
    if (p.instagram_business_account) r.ig_user_id = p.instagram_business_account.id;
    if (p.error) r.page_error = p.error.message;
  } catch(e) { r.page_error = e.message; }
  try {
    const d = await gql('debug_token', { input_token: TOKEN, access_token: TOKEN });
    if (d.data) { r.scopes = d.data.scopes; r.app_id = d.data.app_id; r.expires_at = d.data.expires_at; }
  } catch(e) { r.token_error = e.message; }
  process.stdout.write(JSON.stringify(r, null, 2));
})();
