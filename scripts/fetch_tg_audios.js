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

async function main() {
  try {
    console.log("1. Checking webhook info...");
    const webhookInfo = await apiRequest('getWebhookInfo');
    console.log("Current Webhook Info:", webhookInfo);

    const oldWebhookUrl = webhookInfo?.result?.url || '';

    console.log("2. Temporarily deleting webhook (keeping pending updates)...");
    await apiRequest('deleteWebhook', { drop_pending_updates: 'false' });

    console.log("3. Fetching getUpdates...");
    const updatesRes = await apiRequest('getUpdates', { limit: '100' });
    const updates = updatesRes.result || [];
    console.log(`Found ${updates.length} updates.`);

    const audiosDir = path.join(__dirname, '..', 'data', 'telegram_audios');
    fs.mkdirSync(audiosDir, { recursive: true });

    const downloaded = [];

    for (const u of updates) {
      const msg = u.message || u.channel_post;
      if (!msg) continue;
      const from = msg.from || {};
      const senderName = `${from.first_name || ''} ${from.last_name || ''}`.trim() || from.username || 'user';
      
      const audioObj = msg.audio || msg.voice || msg.document;
      if (audioObj) {
        console.log(`\nFound audio/voice from [${senderName}] (Chat: ${from.id}, File: ${audioObj.file_name || 'voice'})`);
        const fileInfo = await apiRequest('getFile', { file_id: audioObj.file_id });
        if (fileInfo.ok && fileInfo.result.file_path) {
          const ext = path.extname(fileInfo.result.file_path) || (msg.voice ? '.ogg' : '.mp3');
          const cleanSender = senderName.replace(/[^a-zA-Z0-9_]/g, '_');
          const saveName = `${u.update_id}_${cleanSender}_${path.basename(fileInfo.result.file_path, ext)}${ext}`;
          const destFile = path.join(audiosDir, saveName);

          console.log(`Downloading: ${fileInfo.result.file_path} -> ${saveName}`);
          await downloadFile(fileInfo.result.file_path, destFile);
          console.log(`Downloaded successfully: ${destFile} (${fs.statSync(destFile).size} bytes)`);

          downloaded.push({
            updateId: u.update_id,
            sender: senderName,
            senderId: from.id,
            filePath: destFile,
            fileName: saveName,
            caption: msg.caption || '',
            duration: audioObj.duration || 0,
            mimeType: audioObj.mime_type
          });
        }
      } else if (msg.text) {
        console.log(`Text from [${senderName}]: ${msg.text}`);
      }
    }

    // Save metadata
    fs.writeFileSync(path.join(audiosDir, 'metadata.json'), JSON.stringify(downloaded, null, 2), 'utf-8');

    // Restore webhook if it was set
    if (oldWebhookUrl) {
      console.log(`\n4. Restoring webhook to ${oldWebhookUrl}...`);
      await apiRequest('setWebhook', { url: oldWebhookUrl });
      console.log("Webhook restored.");
    }

    console.log(`\n=== SUCCESS: ${downloaded.length} audio/voice files downloaded to data/telegram_audios ===`);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
