import subprocess
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ffmpeg_bin = os.environ.get("FFMPEG_BIN", "ffmpeg")
src_audio = os.path.join(BASE_DIR, "data", "Nurqissa.m4a")

if not os.path.exists(src_audio):
    print(f"Audio fayl topilmadi: {src_audio}")
    exit(1)

# Test silence detection around 45s - 55s
cmd = [
    ffmpeg_bin,
    "-ss", "45",
    "-t", "10",
    "-i", src_audio,
    "-af", "silencedetect=noise=-30dB:d=0.3",
    "-f", "null",
    "-"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Stderr output:\n", res.stderr)
