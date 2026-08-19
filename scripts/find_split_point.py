import subprocess
import os

ffmpeg_bin = r"C:\Users\Shohruh\Desktop\NURQissaAI\ffmpeg.exe"
src_audio = r"C:\Users\Shohruh\Downloads\Telegram Desktop\Nurqissa.m4a"

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
