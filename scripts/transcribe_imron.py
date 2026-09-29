import fitz
import base64
import requests
import json
import os
import glob

# Load GEMINI_API_KEY from .env.local
env_file = r'c:\Users\777\Desktop\projects\NurQissaAi\.env.local'
api_key = ''
if os.path.exists(env_file):
    with open(env_file, encoding='utf-8') as ef:
        for line in ef:
            if line.startswith('GEMINI_API_KEY='):
                api_key = line.split('=', 1)[1].strip()

if not api_key:
    api_key = os.environ.get('GEMINI_API_KEY', '')

print(f"API key length: {len(api_key)}", flush=True)

files = glob.glob(r'C:\Users\777\Desktop\adabiyotlar\*Imron*.pdf')
if not files:
    print("Imron PDF topilmadi!", flush=True)
    exit(1)

pdf_path = files[0]
doc = fitz.open(pdf_path)
print(f"File: {os.path.basename(pdf_path)} - {len(doc)} sahifa", flush=True)

import time

models = ['gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-2.5-flash']

extracted = []
for i in range(len(doc)):
    page = doc[i]
    pix = page.get_pixmap(dpi=120)
    img_bytes = pix.tobytes('jpeg')
    b64 = base64.b64encode(img_bytes).decode('utf-8')
    
    payload = {
        "contents": [{
            "parts": [
                {"inline_data": {"mime_type": "image/jpeg", "data": b64}},
                {"text": "Ushbu bolalar kitobi sahifasidagi barcha matnni aynan o'zbek tilida, birorta so'zini qoldirmasdan to'liq yozib ber. Hech qanday qo'shimcha izoh yozma, faqat kitob matnini chiqar."}
            ]
        }]
    }

    success = False
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        for attempt in range(2):
            try:
                res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=25)
                if res.ok:
                    data = res.json()
                    text = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '').strip()
                    print(f"=== SAHIFA {i+1} ({model}) ===", flush=True)
                    print(text[:120].replace('\n', ' '), flush=True)
                    extracted.append({'page': i + 1, 'text': text})
                    success = True
                    break
                else:
                    if res.status_code == 503 or res.status_code == 429:
                        time.sleep(1.5)
                        continue
                    else:
                        break
            except Exception as e:
                time.sleep(1)
        if success:
            break
    
    if not success:
        print(f"Sahifa {i+1} muvaffaqiyatsiz bo'ldi", flush=True)
        extracted.append({'page': i + 1, 'text': ''})
    
    time.sleep(0.5)

out_file = r'c:\Users\777\Desktop\projects\NurQissaAi\data\extracted_adabiyotlar\imron_transcribed.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(extracted, f, ensure_ascii=False, indent=2)

txt_file = r'c:\Users\777\Desktop\projects\NurQissaAi\data\extracted_adabiyotlar\imron_transcribed.txt'
with open(txt_file, 'w', encoding='utf-8') as f:
    for item in extracted:
        f.write(f"=== SAHIFA {item['page']} ===\n{item['text']}\n\n")

print("Imron kitobi muvaffaqiyatli transkripsiya qilindi!")
