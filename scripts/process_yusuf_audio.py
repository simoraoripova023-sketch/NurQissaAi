import subprocess
import os

ffmpeg_bin = r"C:\Users\Shohruh\Desktop\NURQissaAI\ffmpeg.exe"
src_audio = r"C:\Users\Shohruh\Downloads\Telegram Desktop\Nurqissa.m4a"
dest_dir = r"C:\Users\Shohruh\Desktop\NURQissaAI\public\stories\yusuf"

os.makedirs(dest_dir, exist_ok=True)

# 1. Full recording copy & conversion
full_m4a = os.path.join(dest_dir, "nurqissa_full.m4a")
full_mp3 = os.path.join(dest_dir, "nurqissa_full.mp3")

# Copy m4a directly
with open(src_audio, "rb") as fsrc, open(full_m4a, "wb") as fdst:
    fdst.write(fsrc.read())
print(f"Copied full m4a to {full_m4a}")

# Convert full to mp3
subprocess.run([
    ffmpeg_bin, "-y",
    "-i", src_audio,
    "-codec:a", "libmp3lame",
    "-qscale:a", "2",
    full_mp3
], check=True)
print(f"Created full mp3: {full_mp3}")

# 2. Slice Page 1 (0 to 48.0s)
audio_1 = os.path.join(dest_dir, "audio_1.mp3")
subprocess.run([
    ffmpeg_bin, "-y",
    "-ss", "00:00:00",
    "-to", "00:00:48.0",
    "-i", src_audio,
    "-af", "afade=t=out:st=47.0:d=1.0",
    "-codec:a", "libmp3lame",
    "-qscale:a", "2",
    audio_1
], check=True)
print(f"Created Page 1 audio: {audio_1}")

# 3. Slice Page 2 (51.5s to end)
audio_2 = os.path.join(dest_dir, "audio_2.mp3")
subprocess.run([
    ffmpeg_bin, "-y",
    "-ss", "00:00:51.5",
    "-to", "00:01:40.95",
    "-i", src_audio,
    "-af", "afade=t=in:st=0:d=0.5,afade=t=out:st=48.5:d=1.0",
    "-codec:a", "libmp3lame",
    "-qscale:a", "2",
    audio_2
], check=True)
print(f"Created Page 2 audio: {audio_2}")

print("Audio processing complete!")
