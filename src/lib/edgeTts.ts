import crypto from 'crypto';
// @ts-ignore
import WebSocket from 'ws';

export interface EdgeTtsOptions {
  voice?: string;
  rate?: string;
  pitch?: string;
}

/**
 * Generates the Sec-MS-GEC DRM anti-abuse token required by Microsoft Edge Read Aloud service.
 * Derived from Windows file time (100-nanosecond ticks since 1601) in a 5-minute window.
 */
export function getSecMsGec(): string {
  const unixSeconds = Math.floor(Date.now() / 1000);
  const windowsSeconds = unixSeconds + 11644473600;
  let ticks = BigInt(windowsSeconds) * BigInt(10000000);
  const windowSize = BigInt(3000000000); // 5 min interval
  ticks -= ticks % windowSize;
  const str = ticks.toString() + '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
  return crypto.createHash('sha256').update(str, 'ascii').digest('hex').toUpperCase();
}

/**
 * Synthesizes high-fidelity neural audio using Microsoft Edge Speech Services.
 * Features 100% native authentic Uzbek voices:
 * - uz-UZ-MadinaNeural (Warm, gentle mother voice - perfect for children's bedtime tales)
 * - uz-UZ-SardorNeural (Warm, expressive grandfatherly storyteller voice)
 */
export function synthesizeEdgeTts(
  text: string, 
  options: EdgeTtsOptions = {}
): Promise<Buffer> {
  const voice = options.voice || 'uz-UZ-MadinaNeural';
  const rate = options.rate || '-2%';
  const pitch = options.pitch || '+0Hz';

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
        'Accept-Language': 'uz-UZ,uz;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    const audioChunks: Buffer[] = [];
    let isFinished = false;

    ws.on('open', () => {
      const dateStr = new Date().toString();
      const configMsg = `X-Timestamp:${dateStr}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` + 
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
                outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
              },
            },
          },
        });
      ws.send(configMsg);

      const cleanText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      const lang = voice.startsWith('uz') ? 'uz-UZ' : (voice.startsWith('en') ? 'en-US' : 'uz-UZ');

      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'>` +
        `<voice name='${voice}'>` +
        `<prosody rate='${rate}' pitch='${pitch}'>${cleanText}</prosody>` +
        `</voice></speak>`;
      const ssmlMsg = `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${dateStr}Z\r\nPath:ssml\r\n\r\n${ssml}`;
      ws.send(ssmlMsg);
    });

    ws.on('message', (data: any, isBinary: boolean) => {
      if (!isBinary) {
        const textData = data.toString();
        if (textData.includes('Path:turn.end')) {
          isFinished = true;
          ws.close();
          resolve(Buffer.concat(audioChunks));
        }
      } else {
        const buf = Buffer.from(data as any);
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
      console.warn('Edge TTS WebSocket connection warning:', err?.message || err);
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
          reject(new Error('Edge TTS generation timed out'));
        }
      }
    }, 12000);
  });
}
