import os
import json
from openai import OpenAI

api_key = os.environ.get('OPENAI_API_KEY', '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')
client = OpenAI(api_key=api_key)

audio_file_path = r"C:\Users\Shohruh\Downloads\Telegram Desktop\Nurqissa.m4a"
print(f"Loading {audio_file_path}...")

with open(audio_file_path, "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="verbose_json",
        timestamp_granularities=["segment"]
    )

print("Language:", transcript.language)
print("Duration:", transcript.duration)
with open("scripts/transcript_nurqissa.json", "w", encoding="utf-8") as f:
    json.dump(transcript.model_dump(), f, ensure_ascii=False, indent=2)

print("Transcription saved successfully!")

