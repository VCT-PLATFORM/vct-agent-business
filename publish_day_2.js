require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const THREADS_USER_ID = process.env.THREADS_USER_ID;
const THREADS_TOKEN = process.env.THREADS_TOKEN;
const GRAPH_API = 'graph.facebook.com';
const THREADS_API = 'graph.threads.net';
const API_VERSION = 'v21.0';

// GitHub Public Image URL
const IMAGE_URL = 'https://raw.githubusercontent.com/VCT-PLATFORM/vct-web-react/main/public/assets/images/news-day2.png';
const JSON_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '_agent/shared_knowledge/marketing/queue/day2_live_scoring.json'), 'utf-8'));

async function graphRequest(host, method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = method === 'POST' ? JSON.stringify(data) : '';
    const queryString = method === 'GET' && data ? '?' + new URLSearchParams(data).toString() : '';
    const options = {
      hostname: host,
      path: `/${API_VERSION}/${endpoint}${queryString}`,
      method: method,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (method === 'POST') req.write(postData);
    req.end();
  });
}

async function publishFB() {
  console.log('--- Publishing to Facebook ---');
  const res = await graphRequest(GRAPH_API, 'POST', `${FB_PAGE_ID}/feed`, {
    message: JSON_DATA.facebook.caption,
    link: 'https://vctplatform.vn/tin-tuc/bai-viet?id=giai-dau-live-scoring-vct',
    access_token: FB_PAGE_TOKEN
  });
  console.log('FB Response:', res);
}

async function publishIG() {
  console.log('--- Publishing to Instagram ---');
  const container = await graphRequest(GRAPH_API, 'POST', `${IG_USER_ID}/media`, {
    image_url: IMAGE_URL,
    caption: JSON_DATA.facebook.caption,
    access_token: FB_PAGE_TOKEN
  });
  if (container.id) {
    const pub = await graphRequest(GRAPH_API, 'POST', `${IG_USER_ID}/media_publish`, {
      creation_id: container.id,
      access_token: FB_PAGE_TOKEN
    });
    console.log('IG Response:', pub);
  }
}

async function publishThreads() {
  console.log('--- Publishing to Threads ---');
  const container = await graphRequest(THREADS_API, 'POST', `${THREADS_USER_ID}/threads`, {
    media_type: 'IMAGE',
    image_url: IMAGE_URL,
    text: JSON_DATA.threads.caption,
    access_token: THREADS_TOKEN
  });
  if (container.id) {
    await new Promise(r => setTimeout(r, 5000)); // Wait for processing
    const pub = await graphRequest(THREADS_API, 'POST', `${THREADS_USER_ID}/threads_publish`, {
      creation_id: container.id,
      access_token: THREADS_TOKEN
    });
    console.log('Threads Response:', pub);
  }
}

async function start() {
  try {
    await publishFB();
    await publishIG();
    await publishThreads();
    console.log('✅ ALL POSTS PUBLISHED!');
  } catch (err) {
    console.error('❌ PUBLISH FAILED:', err);
  }
}

start();
