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

const configs = [
        {
            name: 'main',
            prefix: 'email_report',
            imap: {
                user: process.env.IMAP_USER,
                password: process.env.IMAP_PASSWORD,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 3000,
                tlsOptions: { rejectUnauthorized: false }
            }
        },
        {
            name: 'invoice',
            prefix: 'invoice_report',
            imap: {
                user: process.env.INVOICE_IMAP_USER,
                password: process.env.INVOICE_IMAP_PASSWORD,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 3000,
                tlsOptions: { rejectUnauthorized: false }
            }
        }
    ];

    for (const context of configs) {
        if (!context.imap.user || !context.imap.password) {
            if (context.name === 'main') {
                console.error('❌ Lỗi: Chưa cấu hình IMAP_USER / IMAP_PASSWORD.');
            }
            continue; // Skip if config is missing (e.g. invoice not set up yet)
        }

        console.log(`\n🔄 Đang kết nối tới Hòm thư [${context.name.toUpperCase()}] (${context.imap.user})...`);
        
        try {
            const connection = await imaps.connect({ imap: context.imap });
            await connection.openBox('INBOX');

            const date = new Date();
            date.setDate(date.getDate() - 1);
            
            const searchCriteria = [['SINCE', date.toISOString()], ['UNSEEN']];
            const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };

            console.log(`📥 Đang quét email...`);
            const messages = await connection.search(searchCriteria, fetchOptions);
            
            if (messages.length === 0) {
                console.log(`✅ Hòm thư [${context.name.toUpperCase()}] không có email mới.`);
                connection.end();
                continue;
            }

            let markdownContent = `# 📬 BẢN TIN [${context.name.toUpperCase()}] (Tải về lúc ${new Date().toLocaleString()})\n\n`;

            for (const message of messages) {
                const allBytes = message.parts.find(p => p.which === '').body;
                const parsed = await simpleParser(allBytes);
                
                markdownContent += `## Từ: [${parsed.from.text}]\n`;
                markdownContent += `- **Chủ đề (Subject)**: ${parsed.subject}\n`;
                markdownContent += `- **Thời gian**: ${parsed.date}\n`;
                markdownContent += `### Nội dung:\n`;
                markdownContent += `${parsed.text ? parsed.text.trim().substring(0, 2000) : 'Không có nội dung text'}\n`;
                markdownContent += `---\n\n`;
            }

            const dirPath = path.join(__dirname, '../shared_knowledge/emails');
            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
            
            const filename = `${context.prefix}_${Date.now()}.md`;
            const filepath = path.join(dirPath, filename);
            
            fs.writeFileSync(filepath, markdownContent, 'utf-8');
            console.log(`🎉 Đã tải ${messages.length} email từ [${context.name.toUpperCase()}]. Lưu tại: ${filename}`);

            connection.end();
        } catch (err) {
            console.error(`❌ Lỗi kết nối hòm thư [${context.name}]:`, err.message);
        }
    }

}

fetchEmails();
