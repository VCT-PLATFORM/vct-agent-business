/**
 * Publish helper — Đọc caption từ file text để tránh lỗi escape shell
 * Chạy từ thư mục project (vct-agent-business) để dùng node_modules
 */
const path = require('path');

// Load dotenv từ thư mục gốc project
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const fs = require('fs');
const axios = require('axios');

const captionPath = process.argv[2];
const imagePath = process.argv[3];

if (!captionPath || !fs.existsSync(captionPath)) {
    console.error('❌ Thiếu file caption hoặc file không tồn tại:', captionPath);
    process.exit(1);
}

const message = fs.readFileSync(captionPath, 'utf-8').trim();
console.log(`📝 Đọc caption thành công (${message.length} ký tự)`);

async function publish() {
    const pageId = process.env.FB_PAGE_ID;
    const pageToken = process.env.FB_PAGE_TOKEN;

    if (!pageId || !pageToken) {
        console.error('❌ LỖI: Thiếu FB_PAGE_ID hoặc FB_PAGE_TOKEN trong file .env');
        return;
    }

    try {
        let endpoint = `https://graph.facebook.com/v19.0/${pageId}`;
        let response;

        if (imagePath && imagePath.trim() !== '' && fs.existsSync(imagePath)) {
            endpoint += '/photos';
            const FormData = require('form-data');
            const form = new FormData();
            form.append('access_token', pageToken);
            form.append('caption', message);
            form.append('source', fs.createReadStream(imagePath));

            console.log('🚀 Đang tải ảnh lên và gửi Lệnh Đăng Bài...');
            console.log(`📸 Ảnh: ${imagePath}`);
            response = await axios.post(endpoint, form, { headers: form.getHeaders() });
        } else {
            endpoint += '/feed';
            console.log('🚀 Đang gửi Lệnh Đăng Bài text (không ảnh)...');
            response = await axios.post(endpoint, { access_token: pageToken, message });
        }

        console.log('✅ THÀNH CÔNG! Bài viết đã được lên sóng Fanpage VCT Platform.');
        console.log(`🔗 ID Bài Viết: ${response.data.id}`);
        if (response.data.id) {
            const parts = response.data.id.split('_');
            const postUrl = parts.length > 1
                ? `https://facebook.com/${parts[0]}/posts/${parts[1]}`
                : `https://facebook.com/${response.data.id}`;
            console.log(`🌍 Xem trực tiếp: ${postUrl}`);
        }
    } catch (error) {
        console.error('❌ LỖI KHI ĐĂNG BÀI FACEBOOK:');
        if (error.response && error.response.data) {
            const errData = error.response.data;
            console.error(errData.error ? errData.error.message : JSON.stringify(errData));
        } else {
            console.error(error.message);
        }
    }
}

publish();
