require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const chrono = require('chrono-node');
const dvcqg = require('./dvcqg-agent');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_ID;

if (!token) {
    console.log("❌ LỖI KHỞI ĐỘNG: Chưa tìm thấy TELEGRAM_BOT_TOKEN trong file .env!");
    console.log("👉 Vui lòng tạo Bot qua @BotFather và thêm Token vào file .env");
    process.exit(1);
}

// Bật polling
const bot = new TelegramBot(token, {polling: true});

console.log('🤖 VCT Jen Bot (Executive Command Center) đã bật Radar trực chiến...');
if (adminId) {
    console.log(`👤 Đã nhận diện Admin ID: ${adminId}`);
}

// Biến lưu trữ lịch hẹn tạm thời (in-memory)
// Thực tế nên lưu vào Database (SQLite/PostgreSQL)
const reminders = [];

// ─── LỆNH BÁO CÁO NHANH ───
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    
    let text = `Kính chào Chairman ${userName}! 🎩\n\n`;
    text += `Jen đã chuyển nhà thành công lên mạng lưới Telegram.\n`;
    text += `🔑 ID Telegram của ngài là: \`${chatId}\`\n\n`;
    text += `Ngài có thể dùng các lệnh sau:\n`;
    text += `/status - Kiểm tra hệ thống\n`;
    text += `/remind [Nội dung] - Nhắc việc thông minh\n`;
    text += `/dvcqg [từ khóa] - Tra cứu Cổng DVC Quốc gia\n`;
    text += `\nVD: /remind chiều mai lúc 3h họp team dev\nVD: /dvcqg đăng ký kinh doanh`;

    bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

bot.onText(/\/status/, (msg) => {
    bot.sendMessage(msg.chat.id, "🟢 Máy chủ VCT Backend: Bình thường.\n🟢 Radar Telegram: Trực chiến 24/7.\n🟢 Hệ thống Nhắc việc (Emma): Đang chạy.\n🟢 Agent DVCQG: Sẵn sàng tra cứu.");
});

// ─── TRA CỨU CỔNG DVCQG ───
bot.onText(/\/dvcqg$/, (msg) => {
    bot.sendMessage(msg.chat.id, dvcqg.getMenuText(), { parse_mode: 'Markdown' });
});

bot.onText(/\/dvcqg (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1].trim();
    bot.sendMessage(chatId, `🔍 Đang tra cứu "${query}" trên Cổng DVCQG...`);
    try {
        const result = await dvcqg.handleQuery(query);
        bot.sendMessage(chatId, result, { parse_mode: 'Markdown' });
    } catch (err) {
        bot.sendMessage(chatId, `❌ Lỗi khi tra cứu: ${err.message}\n\nNgài thử lại sau hoặc gọi Tổng đài: 18001096`);
    }
});

// ─── HỆ THỐNG NHẮC VIỆC (EMMA) ───
bot.onText(/\/remind (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];

    // Phân tích thời gian từ câu nói tự nhiên (tiếng Việt & English support)
    const parsedDate = chrono.vi.parseDate(text) || chrono.parseDate(text);

    if (!parsedDate) {
        bot.sendMessage(chatId, `⚠️ Jen không nhận diện được thời gian trong câu: "${text}".\n\nNgài thử nói rõ hơn nhé (VD: "ngày mai lúc 15h", "thứ 6 tuần sau").`);
        return;
    }

    if (parsedDate < new Date()) {
        bot.sendMessage(chatId, `⚠️ Thời gian ngài chọn (${parsedDate.toLocaleString('vi-VN')}) đã qua rồi thưa ngài!`);
        return;
    }

    // Tính toán thời gian chờ
    const delayMs = parsedDate.getTime() - Date.now();
    const taskName = text.replace(chrono.vi.parse(text)[0]?.text, '').trim() || text;

    // Lưu vào danh sách (để theo dõi log)
    reminders.push({ text: taskName, time: parsedDate });

    // Set timeout nhúng thẳng vào memory
    setTimeout(() => {
        bot.sendMessage(chatId, `🕒 **BÁO CÁO ĐẾN HẠN**\n\nThưa Chairman, đã đến giờ thực hiện:\n👉 **${taskName}**`, { parse_mode: 'Markdown' });
    }, delayMs);

    bot.sendMessage(chatId, `✅ **ĐÃ GHI NHẬN LỊCH TRÌNH**\n\nJen đã lưu lại tác vụ:\n📌 "${taskName}"\n⏰ Thời gian nhắc: **${parsedDate.toLocaleString('vi-VN')}**`, { parse_mode: 'Markdown' });
});

// ─── CRONJOB: TỔNG KẾT ĐỊNH KỲ ───

if (adminId) {
    // 1. Daily Morning Brief (8:00 AM mỗi ngày)
    cron.schedule('0 8 * * *', () => {
        const text = `🌅 **BÁO CÁO ĐẦU NGÀY**\n\nKính chào Chairman! Hôm nay ngài có ${reminders.length} lịch hẹn đang chờ xử lý.\n\n*Chúc ngài một ngày làm việc hiệu suất. Cần gì cứ nhắn Jen nhé!*`;
        bot.sendMessage(adminId, text, { parse_mode: 'Markdown' });
        console.log("CRON: Đã gửi Morning Brief");
    }, { timezone: "Asia/Ho_Chi_Minh" });

    // 2. Daily Wrap-up (17:30 PM mỗi ngày)
    cron.schedule('30 17 * * *', () => {
        const text = `🌇 **TỔNG KẾT CUỐI NGÀY**\n\nThưa Chairman, ngày làm việc dần khép lại.\n\nNgài đã vất vả rồi. Hãy nghỉ ngơi, nạp lại năng lượng để chuẩn bị cho những trận đánh lớn ngày mai nhé! 🎩`;
        bot.sendMessage(adminId, text, { parse_mode: 'Markdown' });
        console.log("CRON: Đã gửi Daily Wrap-up");
    }, { timezone: "Asia/Ho_Chi_Minh" });
    
    console.log('⏰ Module Trợ lý Thời gian (Emma) đã kích hoạt Daily Brief (8:00) & Wrap-up (17:30)!');
}

// ─── FALLBACK ───
bot.on('message', (msg) => {
    if (msg.text && msg.text.startsWith('/')) return;
    bot.sendMessage(msg.chat.id, `Jen đã ghi nhận: "${msg.text}".\n\n(Nếu đây là nhiệm vụ cần nhắc nhở, ngài vui lòng dùng lệnh /remind nhé!) 🚀`);
});
