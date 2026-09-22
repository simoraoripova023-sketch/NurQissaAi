const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = '8841612635:AAGaKyz6iAES2CxmpCg2Sff-N3jQwQA7zc4';
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;

function apiRequest(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(filePath, destPath) {
  return new Promise((resolve, reject) => {
    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
    const fileStream = fs.createWriteStream(destPath);
    https.get(fileUrl, (res) => {
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function startDaemon() {
  console.log("=== Telegram Audio Receiver Daemon Started ===");
  try {
    await apiRequest('deleteWebhook', { drop_pending_updates: 'false' });
  } catch {}

  const audiosDir = path.join(__dirname, '..', 'data', 'voice_samples');
  fs.mkdirSync(audiosDir, { recursive: true });

  let offset = null;

  while (true) {
    const params = { timeout: '20' };
    if (offset) params.offset = offset;

    try {
      const res = await apiRequest('getUpdates', params);
      const updates = res.result || [];

      for (const u of updates) {
        offset = u.update_id + 1;
        const msg = u.message || u.channel_post;
        if (!msg) continue;

        const from = msg.from || {};
        const senderName = `${from.first_name || ''} ${from.last_name || ''}`.trim() || from.username || 'user';
        
        const audioObj = msg.audio || msg.voice || msg.document;
        if (audioObj) {
          console.log(`\n🎉 [TELEGRAM AUDIO RECEIVED] From: ${senderName} (Chat: ${from.id})`);
          console.log(`File: ${audioObj.file_name || 'voice'}, Duration: ${audioObj.duration}s, Size: ${audioObj.file_size}b`);

          const fileInfo = await apiRequest('getFile', { file_id: audioObj.file_id });
          if (fileInfo.ok && fileInfo.result.file_path) {
            const ext = path.extname(fileInfo.result.file_path) || (msg.voice ? '.ogg' : '.mp3');
            const cleanSender = senderName.replace(/[^a-zA-Z0-9_]/g, '_');
            const saveName = `abubakr_${Date.now()}_${cleanSender}${ext}`;
            const destFile = path.join(audiosDir, saveName);

            console.log(`Downloading to ${destFile}...`);
            await downloadFile(fileInfo.result.file_path, destFile);
            console.log(`✅ Saved: ${saveName} (${fs.statSync(destFile).size} bytes)`);

            // Reply confirmation to sender on Telegram
            try {
              const replyUrl = new URL(`${BASE_URL}/sendMessage`);
              replyUrl.searchParams.append('chat_id', from.id);
              replyUrl.searchParams.append('text', '✅ Audio qabul qilindi! NurQissa AI ertak tizimiga ulanmoqda...');
              https.get(replyUrl, () => {});
            } catch {}
          }
        } else if (msg.text) {
          console.log(`[Text update] from ${senderName}: ${msg.text}`);
        }
      }
    } catch (e) {
      console.error("Daemon poll error:", e.message);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

startDaemon();
