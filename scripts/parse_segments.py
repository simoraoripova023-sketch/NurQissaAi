import sys
import io
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open("scripts/transcript_nurqissa.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print(f"Total duration: {d.get('duration')}s")
print(f"Full raw text: {d.get('text')}")
for s in d.get("segments", []):
    print(f"{s['start']:.1f}s -> {s['end']:.1f}s: {s['text']}")

