/**
 * VCT Platform — Telegram Social Bot Manager
 * Option B: Queue Management via Telegram Bot
 * 
 * Usage: node _agent/scripts/social_manager_bot.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_ID;

if (!token || !adminId) {
  console.error("❌ Telegram Token or Admin ID is missing in .env");
  process.exit(1);
}

const BOARD_DIR = path.join(__dirname, '..', 'shared_knowledge', 'marketing', 'social_board');
const DRAFTS_DIR = path.join(BOARD_DIR, 'drafts');
const APPROVED_DIR = path.join(BOARD_DIR, 'approved');
const REJECTED_DIR = path.join(BOARD_DIR, 'rejected');

const bot = new TelegramBot(token, { polling: true });

console.log('🤖 VCT Social Media Telegram Bot is running...');

// Setup Watcher for drafts folder
fs.watch(DRAFTS_DIR, (eventType, filename) => {
  if (filename && filename.endsWith('.json') && eventType === 'rename') {
    const filePath = path.join(DRAFTS_DIR, filename);
    if (fs.existsSync(filePath)) {
      notifyAdmin(filePath, filename);
    }
  }
});

function notifyAdmin(filePath, filename) {
  try {
    const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const messageBase = `⚠️ *THÔNG BÁO TỪ JEN*
Bạn có 1 bài đăng chuẩn bị lên sóng!
    
*File*: \`${filename}\`
*Caption*:
${config.message}
`;
    // If there is an image, we could sendPhoto, but for now we send text to keep it simple.
    // If needed, we can expand to sendPhoto.
    const opts = {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Duyệt Đăng Ngay', callback_data: `approve_${filename}` },
            { text: '❌ Từ Chối', callback_data: `reject_${filename}` }
          ]
        ]
      }
    };

    if (config.image && fs.existsSync(config.image)) {
        bot.sendPhoto(adminId, fs.createReadStream(config.image), { caption: messageBase, ...opts });
    } else {
        bot.sendMessage(adminId, messageBase, opts);
    }

  } catch (e) {
    console.error(`❌ Error parsing ${filename}:`, e.message);
  }
}

bot.on('callback_query', async (callbackQuery) => {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;

  if (action.startsWith('approve_')) {
    const filename = action.replace('approve_', '');
    const draftPath = path.join(DRAFTS_DIR, filename);
    const approvedPath = path.join(APPROVED_DIR, filename);

    if (fs.existsSync(draftPath)) {
      fs.renameSync(draftPath, approvedPath);
      bot.answerCallbackQuery(callbackQuery.id, { text: '✅ Đã Di chuyển sang Cấu hình Đăng.' });
      
      bot.sendMessage(adminId, `🚀 Bắt đầu publish bài viết: \`${filename}\`...`, { parse_mode: 'Markdown' });

      // Run publish_post.js
      const scriptPath = path.join(__dirname, 'publish_post.js');
      const child = spawn('node', [scriptPath, '--config', approvedPath]);
      
      let out = '';
      child.stdout.on('data', d => out += d);
      child.stderr.on('data', d => out += d);
      
      child.on('close', (code) => {
        if (code === 0) {
          bot.sendMessage(adminId, `🎉 *ĐĂNG BÀI THÀNH CÔNG!*\n\n${out.substring(0, 1000)}`, { parse_mode: 'Markdown' });
        } else {
          bot.sendMessage(adminId, `❌ *LỖI KẾT NỐI FACEBOOK:*\n\n${out}`, { parse_mode: 'Markdown' });
        }
      });

    } else {
      bot.answerCallbackQuery(callbackQuery.id, { text: '⚠️ Bài nháp không còn tồn tại.' });
    }
  }

  if (action.startsWith('reject_')) {
    const filename = action.replace('reject_', '');
    const draftPath = path.join(DRAFTS_DIR, filename);
    const rejectPath = path.join(REJECTED_DIR, filename);

    if (fs.existsSync(draftPath)) {
      fs.renameSync(draftPath, rejectPath);
      bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Đã chuyển vào thùng rác.' });
      bot.sendMessage(adminId, `🗑️ Bài viết \`${filename}\` đã bị TỪ CHỐI.`);
    }
  }
});
