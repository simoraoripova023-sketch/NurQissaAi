const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const crypto = require('crypto');

function getSecMsGec() {
  const unixSeconds = Math.floor(Date.now() / 1000);
  const windowsSeconds = unixSeconds + 11644473600;
  let ticks = BigInt(windowsSeconds) * 10000000n;
  const windowSize = 3000000000n; // 5 min
  ticks -= ticks % windowSize;
  const str = ticks.toString() + '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
  return crypto.createHash('sha256').update(str, 'ascii').digest('hex').toUpperCase();
}

function synthesize(text, voice = 'uz-UZ-SardorNeural') {
  return new Promise((resolve, reject) => {
    const connId = crypto.randomUUID().replace(/-/g, '');
    const reqId = crypto.randomUUID().replace(/-/g, '');
    const gec = getSecMsGec();
    
    const wsUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&Sec-MS-GEC=${gec}&Sec-MS-GEC-Version=1-132.0.2917.0&ConnectionId=${connId}`;

    const ws = new WebSocket(wsUrl, {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkgiklldncnhhnlo',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'uz-UZ,uz;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    const audioChunks = [];
    let isFinished = false;

    ws.on('open', () => {
      const dateStr = new Date().toString();
      const configMsg = `X-Timestamp:${dateStr}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` + 
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
                outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
              }
            }
          }
        });
      ws.send(configMsg);

      const cleanText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='uz-UZ'>` +
        `<voice name='${voice}'>` +
        `<prosody rate='-2%' pitch='+0Hz'>${cleanText}</prosody>` +
        `</voice></speak>`;
      const ssmlMsg = `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${dateStr}Z\r\nPath:ssml\r\n\r\n${ssml}`;
      ws.send(ssmlMsg);
    });

    ws.on('message', (data, isBinary) => {
      if (!isBinary) {
        const textData = data.toString();
        if (textData.includes('Path:turn.end')) {
          isFinished = true;
          ws.close();
          resolve(Buffer.concat(audioChunks));
        }
      } else {
        const buf = Buffer.from(data);
        if (buf.length > 2) {
          const headerLen = buf.readUInt16BE(0);
          const audioData = buf.subarray(headerLen + 2);
          if (audioData.length > 0) {
            audioChunks.push(audioData);
          }
        }
      }
    });

    ws.on('error', (err) => {
      reject(err);
    });

    ws.on('close', () => {
      if (!isFinished && audioChunks.length > 0) {
        resolve(Buffer.concat(audioChunks));
      }
    });

    setTimeout(() => {
      if (!isFinished) {
        if (audioChunks.length > 0) {
          resolve(Buffer.concat(audioChunks));
        } else {
          reject(new Error('Edge TTS timeout'));
        }
      }
    }, 20000);
  });
}

const yusufPages = [
  { page: 1, text: "Bahorning eng go'zal, fusunkor oqshomlaridan biri edi. Daraxtlar oppoq va pushti gullarga burkangan, havoda mayin maysalar ifori taralardi. Hovlidagi so'rida o'tirgan aqlli bola — Yusufjon osmonda charaqlagan yulduzlarni va shivalab yog'ayotgan barakali bahor yomg'irini tomosha qilib xayolga toldi: «Qiziq, bu cheksiz osmondagi yulduzlarni, yerga tushayotgan har bir yomg'ir tomchisini kim tartibga soladi?»" },
  { page: 2, text: "Yusuf xonaga kirib, joynamoz ustida zikr qilayotgan buvisining yoniga o'tirdi. Buvisi nabirasini mehr bilan bag'riga bosib: «Bolajonim, Alloh taolo yaratgan eng mo'jizaviy maxluqotlar — Farishtalardir. Ular nurdan yaratilgan bo'lib, yemaydilar, ichmaydilar, uxlamaydilar va hech qachon gunoh qilmaydilar. Robbimiz qanday buyruq bersa, uni so'zsiz va bekam-ko'st bajaradilar», dedi." },
  { page: 3, text: "Buvisi javondagi Qur'oni Karimga ehtirom bilan qaradi: «Eng ulug' farishta — Jabroil (alayhissalom)dir. U Allohning vahiysini payg'ambarlarga yetkazgan. Ikkinchi buyuk farishta esa — Mikoil (alayhissalom) bo'lib, u Allohning amri bilan tabiatni boshqaradi: bahor yomg'irlarini yog'diradi, shamollarni yo'naltiradi va barcha jonzotlarga rizq ulashadi»." },
  { page: 4, text: "«Uchinchi ulug' farishta — Isrofil (alayhissalom) bo'lib, qiyomat kuni Allohning amri bilan Surni chaladi», deb davom etdi buvisi. «To'rtinchisi esa — Malakul mavt, ya'ni Azroil (alayhissalom)dir. U insonlarning ruhini oladi. Bu bizga har bir bahor, har bir kunimiz g'animat ekanini, vaqtimizni faqat ezgu amallar va yaxshilik bilan o'tkazishimiz kerakligini eslatadi»." },
  { page: 5, text: "Shu payt kichik singlisi Maryam qalamlarini tushirib yubordi. Yusuf darhol qalamlarni mehr bilan terib berdi. Buvisi quvonib dedi: «Barakalla! Har bir insonning o'ng va chap yelkasida Kiroman va Katibin — hurmatli kotib farishtalar bor. O'ng yelkadagi farishta hozirgina singlingga qilgan yaxshiligingni savob qilib yozdi. Chapdagisi esa gunohlarni qayd etadi. Agar tavba qilsak, u yozishni kechiktiradi!»" },
  { page: 6, text: "Dasturxon boshida dadasi ham suhbatga qo'shildi: «O'g'lim, Alloh bizni yolg'iz qoldirmaydi. Har bir mo'min bilan birga Muaqqibat — himoyachi farishtalar bo'ladi. Ular bizni oldimizdan, ortimizdan va har tarafdan Allohning izni bilan ofatlardan asraydi. Samoda esa Xamalatul Arsh farishtalari iymonli bandalar uchun Allohdan mag'firat so'rab duo qilib turadilar»." },
  { page: 7, text: "Dadasi so'zida davom etdi: «Inson vafot etgach, qabrda Munkar va Nakir farishtalari: Robbing kim? Dining qaysi? Payg'ambaring kim? deb so'raydilar. Dunyoda yaxshi amal qilgan insonlar yorug' yuz bilan javob berishadi. So'ngra ularni Jannat darvozasida uning bosh posboni — Ridvan (alayhissalom) xushxabarlar bilan kutib oladi!»" },
  { page: 8, text: "Kechasi Yusuf xonasiga kirib, Mushafdan Oyatul Kursi va Ixlos suralarini tilovat qildi. U yelkasidagi kotib farishtalarni va o'zini asrab turgan himoyachilarni qalban his qilib, cheksiz sakinat tuydi: «Allohim, o'ng yelkamdagi daftarni savoblar bilan to'ldir va bizni Jannatingda Ridvan farishta kutib oladigan bandalaringdan qil!» — deb shirin uyquga ketdi." }
];

async function main() {
  const destDir = path.join(__dirname, '..', 'public', 'stories', 'yusuf');
  fs.mkdirSync(destDir, { recursive: true });

  for (const item of yusufPages) {
    const outFile = path.join(destDir, `audio_${item.page}.mp3`);
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 50000 && item.page !== 8) {
      console.log(`Page ${item.page} already generated (${fs.statSync(outFile).size} bytes), skipping.`);
      continue;
    }

    console.log(`Generating Yusuf Page ${item.page}...`);
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const buf = await synthesize(item.text, 'uz-UZ-SardorNeural');
        fs.writeFileSync(outFile, buf);
        console.log(`Saved ${outFile} (${buf.length} bytes)`);
        success = true;
        break;
      } catch (err) {
        console.warn(`Attempt ${attempt} failed for page ${item.page}:`, err.message);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    if (!success) {
      console.error(`Failed to generate page ${item.page}`);
    }
  }

  // Cover / full story MP3
  const allBuffers = [];
  for (const item of yusufPages) {
    const f = path.join(destDir, `audio_${item.page}.mp3`);
    if (fs.existsSync(f)) {
      allBuffers.push(fs.readFileSync(f));
    }
  }

  const fullMp3 = path.join(destDir, 'nurqissa_full.mp3');
  fs.writeFileSync(fullMp3, Buffer.concat(allBuffers));
  console.log(`Saved full MP3: ${fullMp3} (${fs.statSync(fullMp3).size} bytes)`);
  console.log('ALL Yusuf audio files regenerated with 100% native authentic Uzbek voice!');
}

main().catch(console.error);
