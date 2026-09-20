import asyncio
import os
import edge_tts

async def list_uzbek():
    voices = await edge_tts.list_voices()
    uz_voices = [v for v in voices if 'uz' in v['Locale'].lower() or 'uzbek' in v['FriendlyName'].lower()]
    print("Found native Uzbek voices:")
    for v in uz_voices:
        print(f"- {v['ShortName']} ({v['Gender']}) - {v['FriendlyName']}")
    return uz_voices

async def generate_sample():
    text = "Bahorning eng go'zal, fusunkor oqshomlaridan biri edi. Daraxtlar oppoq va pushti gullarga burkangan, havoda mayin maysalar ifori taralardi. Hovlidagi so'rida o'tirgan aqlli bola — Yusufjon osmonda charaqlagan yulduzlarni va shivalab yog'ayotgan barakali bahor yomg'irini tomosha qilib xayolga toldi."
    
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(BASE_DIR, 'public', 'stories', 'yusuf')
    os.makedirs(out_dir, exist_ok=True)

    # Sardor (Male storyteller) and Madina (Female storyteller)
    for voice in ["uz-UZ-SardorNeural", "uz-UZ-MadinaNeural"]:
        output_file = os.path.join(out_dir, f"sample_{voice}.mp3")
        # -4% rate and +2Hz pitch for gentle bedtime storytelling feel
        communicate = edge_tts.Communicate(text, voice, rate="-4%", pitch="+0Hz")
        await communicate.save(output_file)
        print(f"Saved: {output_file}")

async def main():
    await list_uzbek()
    await generate_sample()

if __name__ == "__main__":
    asyncio.run(main())
