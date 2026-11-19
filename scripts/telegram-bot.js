/**
 * NurQissa AI — Telegram Bot Runner (Long Polling)
 * Ishga tushirish: node scripts/telegram-bot.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read .env.local if exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val.trim();
      }
    }
  });
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.WEB_APP_URL || 'https://nurqissa.uz';

if (!BOT_TOKEN) {
  console.error('\x1b[31m%s\x1b[0m', 'Xatolik: TELEGRAM_BOT_TOKEN .env.local faylida topilmadi!');
  console.log('Iltimos, @BotFather dan olingan bot tokenni .env.local fayliga TELEGRAM_BOT_TOKEN=... ko\'rinishida yozing.');
  process.exit(1);
}

function callTelegramApi(method, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function initBot() {
  console.log('\x1b[36m%s\x1b[0m', '🚀 NurQissa Telegram Mini App Boti ishga tushmoqda...');
  
  try {
    const me = await callTelegramApi('getMe', {});
    if (!me.ok) {
      console.error('Bot token yaroqsiz:', me);
      return;
    }
    console.log(`✅ Bot muvaffaqiyatli ulandi: @${me.result.username} (${me.result.first_name})`);
    console.log(`🔗 Mini App URL: ${WEB_APP_URL}`);

    // Set Menu Button for instant 1-click launch
    await callTelegramApi('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: '📖 NurQissa',
        web_app: { url: WEB_APP_URL }
      }
    });
    console.log('✅ Telegram pastki Menyu tugmasi Web App ga sozlandi.');

    // Long polling loop
    let offset = 0;
    while (true) {
      try {
        const updates = await callTelegramApi('getUpdates', {
          offset: offset,
          timeout: 25,
          allowed_updates: ['message', 'callback_query']
        });

        if (updates.ok && updates.result.length > 0) {
          for (const update of updates.result) {
            offset = update.update_id + 1;
            await handleUpdate(update);
          }
        }
      } catch (pollErr) {
        console.warn('Polling xatosi, 3 soniyadan so\'ng qayta uriniladi:', pollErr.message);
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  } catch (err) {
    console.error('Botni ishga tushirishda xatolik:', err);
  }
}

async function handleUpdate(update) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const text = update.message.text;
  const firstName = update.message.from?.first_name || 'Aziz doʻstim';

  if (text.startsWith('/start')) {
    const welcome = `✨ <b>Assalomu alaykum va rahmatullohi va barakatuh, ${firstName}!</b>\n\n` +
      `🌟 <b>NurQissa AI</b> — farzandingiz bosh qahramon bo'lgan ibratli va mehrli bolalar ertaklari platformasiga xush kelibsiz!\n\n` +
      `📖 Bu yerda siz:\n` +
      `• Farzandingiz ismiga mos maxsus 3D Pixar ertak kitoblar yaratishingiz;\n` +
      `• Oʻzbek tilidagi samimiy audio ertaklarni tinglashingiz;\n` +
      `• Montessori taʼlimiy oʻyinlari va boʻyash studiyasidan foydalanishingiz;\n` +
      `• Yaxshi amallar daraxtini birgalikda oʻstirishingiz mumkin! 🌱\n\n` +
      `👇 Quyidagi tugmani bosing va ertaklar olamiga kiring:`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '📖 NurQissa Mini App ni ochish 🚀',
            web_app: { url: WEB_APP_URL }
          }
        ],
        [
          {
            text: '✨ Ertak yaratish',
            web_app: { url: `${WEB_APP_URL}/create` }
          },
          {
            text: '🎮 Oʻyinlar',
            web_app: { url: `${WEB_APP_URL}/games` }
          }
        ]
      ]
    };

    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: welcome,
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }
}

initBot();
