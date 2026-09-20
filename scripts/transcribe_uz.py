import os
import json
from openai import OpenAI

api_key = os.environ.get('OPENAI_API_KEY', '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')
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
