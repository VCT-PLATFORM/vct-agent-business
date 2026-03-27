require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_ID || '7736755169';

// Khởi tạo bot với polling: false (chỉ gửi tin nhắn 1 chiều, không lấy update để tránh đụng độ với bot đang chạy)
const bot = new TelegramBot(token, {polling: false});

bot.sendMessage(adminId, "🔔 *BÁO CÁO TỪ JEN*\n\nKính chào Chairman! Đây là tin nhắn test từ Jen. Đường truyền Telegram - VCT Platform đã được thông suốt 100%! 🚀\n\n(Lệnh bắn tin nhắn tự động hoạt động hoàn hảo thưa sếp ạ)", { parse_mode: 'Markdown' })
    .then(() => {
        console.log("✅ Đã gửi tin nhắn thành công qua Telegram!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Gửi tin nhắn thất bại:", err.message);
        process.exit(1);
    });
