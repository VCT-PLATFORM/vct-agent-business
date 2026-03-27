/**
 * Fetch Emails Script for VCT Platform (IMAP Client)
 * 
 * Cách cài đặt:
 * 1. Chạy: npm install imap-simple mailparser dotenv
 * 2. Tạo file .env ở thư mục gốc (vct-agent-business/.env) và thêm:
 *    IMAP_USER=email.cua.ban@gmail.com
 *    IMAP_PASSWORD=MatKhauUngDung_KhongPhaiMatKhauGoc
 * 3. Chạy: node _agent/scripts/fetch-emails.js
 */

require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

const config = {
    imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        host: 'imap.gmail.com', // Cấu hình cho Gmail
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

async function fetchEmails() {
    if (!process.env.IMAP_USER || !process.env.IMAP_PASSWORD) {
        console.error('❌ Lỗi: Chưa cung cấp IMAP_USER hoặc IMAP_PASSWORD trong file .env');
        console.error('Hướng dẫn tạo App Password: https://myaccount.google.com/apppasswords');
        return;
    }

    console.log('🔄 Đang kết nối tới Gmail của Chủ tịch...');
    
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // Tìm email trong 24h qua (hoặc 1 tuần tùy nhu cầu)
        const date = new Date();
        date.setDate(date.getDate() - 1); // 1 ngày trước
        
        const searchCriteria = [
            ['SINCE', date.toISOString()],
            ['UNSEEN'] // Chỉ đọc email chưa đọc
        ];
        
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: false // Không đánh dấu là đã đọc để bảo vệ mailbox của sếp
        };

        console.log(`📥 Đang quét email (từ ${date.toLocaleDateString()})...`);
        const messages = await connection.search(searchCriteria, fetchOptions);
        
        if (messages.length === 0) {
            console.log('✅ Không có email mới nào cần xử lý.');
            connection.end();
            return;
        }

        let markdownContent = `# 📬 BẢN TIN EMAIL (Tự động tải về lúc ${new Date().toLocaleString()})\n\n`;

        for (const message of messages) {
            const allBytes = message.parts.find(p => p.which === '').body;
            const parsed = await simpleParser(allBytes);
            
            markdownContent += `## Lệnh: Nhận từ [${parsed.from.text}]\n`;
            markdownContent += `- **Chủ đề (Subject)**: ${parsed.subject}\n`;
            markdownContent += `- **Thời gian**: ${parsed.date}\n`;
            markdownContent += `### Nội dung:\n`;
            markdownContent += `${parsed.text ? parsed.text.trim().substring(0, 2000) : 'Không có nội dung text'}\n`; // Cắt 2000 ký tự tránh tràn ram
            markdownContent += `---\n\n`;
        }

        // Lưu vào file Markdown
        const dirPath = path.join(__dirname, '../shared_knowledge/emails');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        const filename = `email_report_${Date.now()}.md`;
        const filepath = path.join(dirPath, filename);
        
        fs.writeFileSync(filepath, markdownContent, 'utf-8');
        console.log(`\n🎉 THÀNH CÔNG! Đã tải ${messages.length} email mới.`);
        console.log(`📁 Nội dung đã được lưu tại: ${filepath}`);
        console.log(`👉 Chuyển qua chat và gõ "/email-triage" để Jen (Chief of Staff) xử lý!`);

        connection.end();
    } catch (err) {
        console.error('❌ Lỗi xử lý IMAP:', err.message);
        if(err.message.includes('Web login required')) {
            console.error('💡 Chủ tịch phải dùng Mật khẩu Ứng dụng (App Password), KHÔNG ĐƯỢC dùng mật khẩu gốc Gmail.');
        }
    }
}

fetchEmails();
