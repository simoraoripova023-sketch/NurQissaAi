import sys
import io
import json

import os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

transcript_path = os.path.join(os.path.dirname(__file__), "transcript_nurqissa.json")
if not os.path.exists(transcript_path):
    print(f"Fayl topilmadi: {transcript_path}")
    sys.exit(1)

with open(transcript_path, "r", encoding="utf-8") as f:
    d = json.load(f)

print(f"Total duration: {d.get('duration')}s")
print(f"Full raw text: {d.get('text')}")
for s in d.get("segments", []):
    print(f"{s['start']:.1f}s -> {s['end']:.1f}s: {s['text']}")

