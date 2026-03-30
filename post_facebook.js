/**
 * VCT Platform — Facebook Auto-Post Script
 * Đăng bài lên Fanpage và các Group đã join qua Graph API
 * 
 * Usage: node post_facebook.js
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const PAGE_ID = process.env.FB_PAGE_ID;
const PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const GRAPH_API = 'graph.facebook.com';
const API_VERSION = 'v21.0';

// ── Nội dung bài đăng (CMO-approved) ──
const POST_MESSAGE = `🔥 CHÍNH THỨC RA MẮT — VCT PLATFORM PHASE 2 🔥

Đã bao giờ bạn tự hỏi: Võ thuật cổ truyền Việt Nam sẽ trông như thế nào khi được Số hóa 100%?

Hôm nay, VCT Platform tự hào giới thiệu phiên bản nâng cấp toàn diện — Phase 2: "Go Global, Stay Local" 🌏

✅ Giao diện 6 lớp chuẩn quốc tế — Dark-mode siêu đẹp
✅ Hỗ trợ Đa ngôn ngữ (Tiếng Việt & English) — sẵn sàng vươn tầm thế giới
✅ Hệ thống quản trị CLB, VĐV, Giải đấu — tất cả trong một nền tảng
✅ Form liên hệ trực tiếp — kết nối ngay với đội ngũ hỗ trợ

📊 Hiện tại VCT Platform đang phục vụ:
• 63+ Tỉnh thành
• 1.200+ CLB / Võ đường
• 50.000+ Võ sinh trên toàn quốc

🎯 Dành cho: Vận động viên | Huấn luyện viên | Chủ nhiệm CLB | Liên đoàn Tỉnh

👉 Trải nghiệm ngay: https://vct-platform.vercel.app

Hãy cùng chúng tôi bảo tồn và phát triển di sản Võ thuật Việt Nam trên nền tảng công nghệ hiện đại nhất!

#VCTPlatform #VoCoTruyen #VoThuatVietNam #DigitalTransformation #Phase2Launch #GoGlobalStayLocal #LienDoanVoThuat #CLBVoThuat #VoDuong`;

const LOGO_PATH = path.join(__dirname, '_agent', 'shared_knowledge', 'logo', 'logo-vct.png');

// ── Helper: HTTPS Request (Promise-based) ──
function graphRequest(method, endpoint, data, isMultipart = false) {
  return new Promise((resolve, reject) => {
    const url = `/${API_VERSION}/${endpoint}`;
    
    if (method === 'GET' || (!isMultipart && method === 'POST')) {
      const postData = method === 'POST' ? JSON.stringify(data) : '';
      const queryString = method === 'GET' && data ? '?' + new URLSearchParams(data).toString() : '';
      
      const options = {
        hostname: GRAPH_API,
        path: url + queryString,
        method: method,
        headers: method === 'POST' ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        } : {},
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (json.error) {
              reject(new Error(`FB API Error: ${json.error.message} (code: ${json.error.code})`));
            } else {
              resolve(json);
            }
          } catch (e) {
            reject(new Error(`Parse error: ${body}`));
          }
        });
      });
      
      req.on('error', reject);
      if (method === 'POST') req.write(postData);
      req.end();
    }
  });
}

// ── Helper: Upload ảnh qua Multipart ──
function uploadPhoto(pageId, token, imagePath, caption) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Date.now();
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath);

    // Build multipart body
    let body = '';
    
    // Caption field
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="message"\r\n\r\n`;
    body += caption + '\r\n';
    
    // Access token field
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="access_token"\r\n\r\n`;
    body += token + '\r\n';

    // Image field header
    const imageHeader = `--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`;
    const imageFooter = `\r\n--${boundary}--\r\n`;

    const bodyBuffer = Buffer.concat([
      Buffer.from(body, 'utf-8'),
      Buffer.from(imageHeader, 'utf-8'),
      imageBuffer,
      Buffer.from(imageFooter, 'utf-8'),
    ]);

    const options = {
      hostname: GRAPH_API,
      path: `/${API_VERSION}/${pageId}/photos`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.error) {
            reject(new Error(`FB Photo Upload Error: ${json.error.message}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${responseBody}`));
        }
      });
    });

    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

// ── MAIN ──
async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  VCT PLATFORM — Facebook Campaign Launch');
  console.log('  Thời gian: ' + new Date().toLocaleString('vi-VN'));
  console.log('═══════════════════════════════════════════\n');

  if (!PAGE_ID || !PAGE_TOKEN) {
    console.error('❌ ERROR: Thiếu FB_PAGE_ID hoặc FB_PAGE_TOKEN trong file .env');
    process.exit(1);
  }

  // ── BƯỚC 1: Kiểm tra quyền truy cập ──
  console.log('🔍 [1/4] Kiểm tra quyền truy cập Page...');
  try {
    const pageInfo = await graphRequest('GET', PAGE_ID, {
      access_token: PAGE_TOKEN,
      fields: 'name,id,fan_count,category',
    });
    console.log(`   ✅ Fanpage: "${pageInfo.name}" (ID: ${pageInfo.id})`);
    console.log(`   📊 Fans: ${pageInfo.fan_count || 'N/A'} | Category: ${pageInfo.category || 'N/A'}`);
  } catch (err) {
    console.error(`   ❌ Lỗi xác thực: ${err.message}`);
    console.error('   → Kiểm tra lại FB_PAGE_TOKEN trong file .env');
    process.exit(1);
  }

  // ── BƯỚC 2: Đăng bài kèm ảnh lên Fanpage ──
  console.log('\n📸 [2/4] Đăng bài kèm ảnh Logo lên Fanpage...');
  let postId = null;
  try {
    if (fs.existsSync(LOGO_PATH)) {
      const result = await uploadPhoto(PAGE_ID, PAGE_TOKEN, LOGO_PATH, POST_MESSAGE);
      postId = result.post_id || result.id;
      console.log(`   ✅ ĐĂNG BÀI THÀNH CÔNG!`);
      console.log(`   🔗 Post ID: ${postId}`);
      console.log(`   🌐 URL: https://facebook.com/${postId}`);
    } else {
      console.log('   ⚠️ Không tìm thấy file logo, đăng bài text...');
      const result = await graphRequest('POST', `${PAGE_ID}/feed`, {
        message: POST_MESSAGE,
        access_token: PAGE_TOKEN,
      });
      postId = result.id;
      console.log(`   ✅ ĐĂNG BÀI TEXT THÀNH CÔNG!`);
      console.log(`   🔗 Post ID: ${postId}`);
    }
  } catch (err) {
    console.error(`   ❌ Lỗi đăng bài: ${err.message}`);
    // Fallback: thử đăng text only
    console.log('   🔄 Thử đăng bài text (không kèm ảnh)...');
    try {
      const result = await graphRequest('POST', `${PAGE_ID}/feed`, {
        message: POST_MESSAGE,
        access_token: PAGE_TOKEN,
      });
      postId = result.id;
      console.log(`   ✅ ĐĂNG BÀI TEXT THÀNH CÔNG (fallback)!`);
      console.log(`   🔗 Post ID: ${postId}`);
    } catch (err2) {
      console.error(`   ❌ Lỗi fallback: ${err2.message}`);
    }
  }

  // ── BƯỚC 3: Lấy danh sách Groups đã join ──
  console.log('\n📋 [3/4] Lấy danh sách Groups...');
  let groups = [];
  try {
    const groupsResult = await graphRequest('GET', 'me/groups', {
      access_token: PAGE_TOKEN,
      fields: 'name,id,member_count',
      limit: 20,
    });

    if (groupsResult.data && groupsResult.data.length > 0) {
      groups = groupsResult.data;
      console.log(`   ✅ Tìm thấy ${groups.length} group(s):`);
      groups.forEach((g, i) => {
        console.log(`      ${i+1}. ${g.name} (ID: ${g.id}, Members: ${g.member_count || 'N/A'})`);
      });
    } else {
      console.log('   ⚠️ Không tìm thấy group nào (API có thể không có quyền publish_to_groups).');
      console.log('   💡 Gợi ý: Chairman hãy đăng bài vào Group thủ công bằng cách Share bài từ Fanpage.');
    }
  } catch (err) {
    console.log(`   ⚠️ Không thể lấy danh sách group: ${err.message}`);
    console.log('   💡 Lưu ý: Facebook đã hạn chế API post vào Group từ 2024.');
    console.log('   → Chairman nên Share bài Fanpage vào các Group thủ công.');
  }

  // ── BƯỚC 4: Đăng vào từng Group (nếu có quyền) ──
  if (groups.length > 0) {
    console.log('\n📣 [4/4] Đăng bài vào các Groups...');
    for (const group of groups) {
      try {
        const result = await graphRequest('POST', `${group.id}/feed`, {
          message: POST_MESSAGE,
          access_token: PAGE_TOKEN,
        });
        console.log(`   ✅ ${group.name}: Post ID ${result.id}`);
      } catch (err) {
        console.log(`   ⚠️ ${group.name}: ${err.message}`);
      }
    }
  } else {
    console.log('\n📣 [4/4] Bỏ qua bước đăng Group (không có quyền API).');
  }

  // ── KẾT QUẢ ──
  console.log('\n═══════════════════════════════════════════');
  console.log('  📊 KẾT QUẢ CHIẾN DỊCH');
  console.log('═══════════════════════════════════════════');
  console.log(`  Fanpage Post: ${postId ? '✅ Thành công' : '❌ Thất bại'}`);
  if (postId) console.log(`  URL: https://facebook.com/${postId}`);
  console.log(`  Groups Posted: ${groups.length > 0 ? groups.length + ' group(s)' : '⚠️ Cần đăng thủ công'}`);
  console.log('═══════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
