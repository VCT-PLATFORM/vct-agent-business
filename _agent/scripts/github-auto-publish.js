const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function run() {
    const pageId = process.env.FB_PAGE_ID;
    const pageToken = process.env.FB_PAGE_TOKEN;

    if (!pageId || !pageToken) {
        console.error("❌ LỖI: Thiếu FB_PAGE_ID hoặc FB_PAGE_TOKEN trong Secrets!");
        process.exit(1);
    }

    // Lấy ngày hôm nay (Theo giờ Việt Nam)
    const today = new Date();
    const vnTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));
    const dateString = vnTime.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const queueDir = path.join(__dirname, '..', 'shared_knowledge', 'marketing', 'queue');
    const postFilePath = path.join(queueDir, `${dateString}.json`);

    if (!fs.existsSync(postFilePath)) {
        console.log(`✅ Không có bài đăng nào được lên lịch cho hôm nay (${dateString}). Ngủ ngon!`);
        return;
    }

    console.log(`🚀 Đã tìm thấy bài đăng lên lịch cho ${dateString}. Bắt đầu đăng...`);
    
    try {
        const postData = JSON.parse(fs.readFileSync(postFilePath, 'utf8'));
        const { caption, image_path } = postData;
        
        let endpoint = `https://graph.facebook.com/v19.0/${pageId}`;
        let response;

        if (image_path && image_path.trim() !== '') {
            // Xác minh đường dẫn ảnh
            const absoluteImagePath = path.join(__dirname, '..', '..', image_path);
            if (!fs.existsSync(absoluteImagePath)) {
                throw new Error(`Không tìm thấy file ảnh tại: ${absoluteImagePath}`);
            }

            endpoint += '/photos';
            const form = new FormData();
            form.append('access_token', pageToken);
            form.append('caption', caption);
            form.append('source', fs.createReadStream(absoluteImagePath));
            
            console.log('🖼️ Đang đẩy ảnh và text lên Graph API...');
            response = await axios.post(endpoint, form, { headers: form.getHeaders() });
        } else {
            endpoint += '/feed';
            console.log('📝 Đang đẩy text lên Graph API...');
            response = await axios.post(endpoint, { access_token: pageToken, message: caption });
        }

        console.log(`✅ ĐĂNG THÀNH CÔNG! Post ID: ${response.data.id}`);

        // Đổi tên file để đánh dấu đã đăng (Tránh trường hợp bị chạy lặp)
        fs.renameSync(postFilePath, path.join(queueDir, `${dateString}_PUBLISHED.json`));
        console.log('🔄 Đã lưu trữ file vào trạng thái PUBLISHED.');

    } catch (e) {
        console.error("❌ LỖI TRONG QUÁ TRÌNH ĐĂNG BÀI:", e.response?.data || e.message);
        process.exit(1);
    }
}

run();
