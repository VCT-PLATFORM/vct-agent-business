/**
 * Facebook Graph API Publisher Script
 * Dành cho Chief Marketing Officer (CMO) / Social Media Manager
 * 
 * Cách cài đặt:
 * 1. Chạy: npm install axios dotenv
 * 2. file .env cần có:
 *    FB_PAGE_ID=ID_Cua_Fanpage
 *    FB_PAGE_TOKEN=Token_Truy_Cap_Trang_Kéo_Dài
 * 
 * Cách dùng bằng CLI:
 * node _agent/scripts/publish-facebook.js "Nội dung bài viết" "URL_Hình_Ảnh(Tùy chọn)"
 */

require('dotenv').config();
const axios = require('axios');

async function publishToFacebook(message, imageUrl = null) {
    const pageId = process.env.FB_PAGE_ID;
    const pageToken = process.env.FB_PAGE_TOKEN;

    if (!pageId || !pageToken) {
        console.error('❌ LỖI: Thiếu FB_PAGE_ID hoặc FB_PAGE_TOKEN trong file .env');
        return;
    }

    try {
        let endpoint = `https://graph.facebook.com/v19.0/${pageId}`;
        let response;

        if (imageUrl && imageUrl.trim() !== "") {
            endpoint += '/photos';
            if (imageUrl.startsWith('http')) {
                let payload = { access_token: pageToken, url: imageUrl, caption: message };
                response = await axios.post(endpoint, payload);
            } else {
                const FormData = require('form-data');
                const fs = require('fs');
                if (!fs.existsSync(imageUrl)) throw new Error('Không tìm thấy file ảnh: ' + imageUrl);
                
                const form = new FormData();
                form.append('access_token', pageToken);
                form.append('caption', message);
                form.append('source', fs.createReadStream(imageUrl));
                
                console.log('🚀 Đang tải ảnh lên và gửi Lệnh Đăng Bài...');
                response = await axios.post(endpoint, form, { headers: form.getHeaders() });
            }
        } else {
            endpoint += '/feed';
            let payload = { access_token: pageToken, message: message };
            console.log('🚀 Đang gửi Lệnh Đăng Bài text...');
            response = await axios.post(endpoint, payload);
        }

        console.log('✅ THÀNH CÔNG! Bài viết đã được lên sóng Fanpage VCT Platform.');
        console.log(`🔗 ID Bài Viết: ${response.data.id}`);
        // Log URL để Agent trả về cho Chairman
        if (response.data.id) {
            const [postPageId, postId] = response.data.id.split('_');
            const postUrl = postId ? `https://facebook.com/${postPageId}/posts/${postId}` : `https://facebook.com/${response.data.id}`;
            console.log(`🌍 Xem trực tiếp: ${postUrl}`);
        }

    } catch (error) {
        console.error('❌ LỖI KHI ĐĂNG BÀI FACEBOOK:');
        if (error.response && error.response.data) {
            console.error(error.response.data.error.message);
        } else {
            console.error(error.message);
        }
    }
}

// Bắt argument từ dòng lệnh
// Ví dụ: node publish-facebook.js "Chào mừng đến VCT" "https://imagelink.com/a.png"
const args = process.argv.slice(2);
const message = args[0];
const imageUrl = args[1];

if (!message) {
    console.error('❌ LỖI: Vui lòng truyền nội dung bài viết!');
    console.error('Cách dùng: node publish-facebook.js "Nội dung" "LinkẢnh"');
    process.exit(1);
}

publishToFacebook(message, imageUrl);
