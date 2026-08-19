import os
import requests
import json

gemini_api_key = os.environ.get('GEMINI_API_KEY', 'AQ.Ab8RN6K4rio1jYr2XZANg-83Gr5ku75s5sv7ZmQ-14_o2fuN2A')

# Upload audio using Gemini File API
file_path = r"C:\Users\Shohruh\Downloads\Telegram Desktop\Nurqissa.m4a"
file_size = os.path.getsize(file_path)

print(f"Uploading {file_path} ({file_size} bytes)...")

# Step 1: Start resumable upload
upload_url_res = requests.post(
    f"https://generativelanguage.googleapis.com/upload/v1beta/files?key={gemini_api_key}",
    headers={
        "X-Goog-Upload-Protocol": "resumable",
        "X-Goog-Upload-Command": "start",
        "X-Goog-Upload-Header-Content-Length": str(file_size),
        "X-Goog-Upload-Header-Content-Type": "audio/mp4",
        "Content-Type": "application/json"
    },
    json={"file": {"display_name": "Nurqissa Audio"}}
)

upload_url = upload_url_res.headers.get("X-Goog-Upload-URL")
print("Upload URL obtained:", bool(upload_url))

# Step 2: Upload the actual audio bytes
with open(file_path, "rb") as f:
    audio_data = f.read()

upload_res = requests.post(
    upload_url,
    headers={
        "Content-Length": str(file_size),
        "X-Goog-Upload-Offset": "0",
        "X-Goog-Upload-Command": "upload, finalize"
    },
    data=audio_data
)

file_info = upload_res.json().get("file", {})
file_uri = file_info.get("uri")
print("File uploaded URI:", file_uri)

# Step 3: Generate content with gemini-2.5-flash or gemini-1.5-flash
prompt = """
Ushbu audio faylni diqqat bilan eshitib, aniq O'zbek tilida yozib ber (transcription).
Audio ichidagi har bir gap va bo'limning boshlanish va tugash vaqtlarini (masalan: [00:00 - 00:30]) ko'rsat.
Shuningdek, ushbu ovoz qaysi qahramon / ertak (Yusuf qissasi) bo'limlariga tegishli ekanligini izohla.
"""

gen_res = requests.post(
    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={gemini_api_key}",
    headers={"Content-Type": "application/json"},
    json={
        "contents": [{
            "parts": [
                {"file_data": {"mime_type": "audio/mp4", "file_uri": file_uri}},
                {"text": prompt}
            ]
        }]
    }
)

with open("scripts/gemini_audio_analysis.json", "w", encoding="utf-8") as f:
    json.dump(gen_res.json(), f, ensure_ascii=False, indent=2)

print("Gemini analysis completed!")
