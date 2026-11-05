import os
import json
from openai import OpenAI

api_key = os.environ.get('OPENAI_API_KEY', '')
if not api_key:
    env_local = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_local):
        with open(env_local, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('OPENAI_API_KEY='):
                    api_key = line.split('=', 1)[1].strip()
                    break
client = OpenAI(api_key=api_key)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
audio_file_path = os.path.join(BASE_DIR, "data", "Nurqissa.m4a")

if not os.path.exists(audio_file_path):
    print(f"Audio fayl topilmadi: {audio_file_path}")
    exit(1)

with open(audio_file_path, "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        language="uz",
        response_format="verbose_json",
        timestamp_granularities=["word", "segment"]
    )

output_json = os.path.join(os.path.dirname(__file__), "transcript_uz.json")
with open(output_json, "w", encoding="utf-8") as f:
    json.dump(transcript.model_dump(), f, ensure_ascii=False, indent=2)

print("Transcription in Uzbek complete!")
