require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_ID || '7736755169';
const bot = new TelegramBot(token, {polling: false});

const msg = `🏢 HỌP KHẨN BAN LÃNH ĐẠO — VCT PLATFORM
📅 27/03/2026 | Chủ trì: Chairman Tùng

Jen đã soạn xong biên bản họp và kế hoạch hành động cho 8 phòng ban (32 action items). Deadline: 31/03/2026.

📊 PHÂN BỔ THEO PHÒNG BAN:
🏛️ Strategy Office — OKR Q2, Budget Q2
📣 Marketing & Sales — Content Plan, Sales Pipeline
💰 Finance — HĐĐT, Thuế GTGT T3
💻 Technology — Bug fixes, Website UI, Security audit
⚙️ Operations — KPI, SLA, Process review
👥 HR — BHXH, Hiring Plan Q2
⚖️ Legal — Hợp đồng mẫu, Data Protection
📈 Data — CEO Dashboard, Market Analysis

⏰ Deadline nộp kế hoạch: 12:00 trưa 28/03
📍 File đầy đủ: knowledge/meetings/

— Jen, Chief of Staff`;

bot.sendMessage(adminId, msg)
    .then(() => { console.log("✅ Đã gửi!"); process.exit(0); })
    .catch((err) => { console.error("❌ Lỗi:", err.message); process.exit(1); });
