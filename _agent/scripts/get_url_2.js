require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const https = require('https');
const fs = require('fs');
const path = require('path');

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

function uploadPhoto(filePath) {
  return new Promise((r, j) => {
    const boundary = '----FormBoundary' + Date.now();
    const imageBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    let head = `--${boundary}\r\nContent-Disposition: form-data; name="access_token"\r\n\r\n${FB_PAGE_TOKEN}\r\n`;
    head += `--${boundary}\r\nContent-Disposition: form-data; name="published"\r\n\r\nfalse\r\n`;
    head += `--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`;
    const tail = `\r\n--${boundary}--\r\n`;

    const body = Buffer.concat([Buffer.from(head, 'utf-8'), imageBuffer, Buffer.from(tail, 'utf-8')]);

    const req = https.request({
      hostname: 'graph.facebook.com',
      path: `/v21.0/${FB_PAGE_ID}/photos`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    }, (res) => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => r(JSON.parse(b)));
    });
    req.on('error', j);
    req.write(body);
    req.end();
  });
}

function getPhotoCdnUrl(photoId) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'graph.facebook.com',
      path: `/v21.0/${photoId}?fields=images&access_token=${FB_PAGE_TOKEN}`,
      method: 'GET'
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
         const json = JSON.parse(body);
         resolve(json.images[0].source);
      });
    });
    req.end();
  });
}

(async () => {
  const photo = await uploadPhoto('C:/Users/hbtun/.gemini/antigravity/brain/9f414a89-fbae-4277-8813-928e9e9e4524/media__1774954941387.png');
  const url = await getPhotoCdnUrl(photo.id);
  fs.writeFileSync('url.txt', url);
})();
