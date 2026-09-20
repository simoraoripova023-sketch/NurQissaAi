import requests
import json
import os

api_key = os.environ.get('ELEVENLABS_API_KEY', 'sk_a2f342ffaaf5d1c4a6c0c1585187cfd7baeca773a9de137b')
headers = {
    'xi-api-key': api_key,
    'Content-Type': 'application/json'
}

# 1. Fetch available voices
voices_res = requests.get('https://api.elevenlabs.io/v1/voices', headers=headers).json()
voices = voices_res.get('voices', [])
print(f"Total available voices: {len(voices)}")

# Find best warm storyteller voice
voice_map = {v['name']: v['voice_id'] for v in voices}
for name in ['George', 'Brian', 'Adam', 'Liam', 'Daniel', 'Charlie']:
    if name in voice_map:
        selected_name = name
        selected_voice_id = voice_map[name]
        print(f"Selected voice: {selected_name} ({selected_voice_id})")
        break
else:
    selected_name = voices[0]['name']
    selected_voice_id = voices[0]['voice_id']
    print(f"Default voice: {selected_name} ({selected_voice_id})")

# Pages to generate
pages = [
    (1, "Qadimiy hovlida mayin bahor yomg'iri shivirlab yog'ardi. Kichkintoy Yusuf deraza yonida o'tirib, tabiatning bu go'zalligiga qarab hayratda qoldi. 'Har bir tomchi bunchalar chiroyli va tartibli tushmoqda-ya!' deb o'yladi."),
    (2, "Buvijoni tabassum bilan dedi: 'Yusufjon, bilasanmi, osmondan tushayotgan har bir yomg'ir tomchisini yerga bittadan farishta tushiradi. Ular Allohning nuri va qudratiga guvoh bo'lgan pokiza bandalardir.'"),
    (3, "Buvijon davom etdi: 'Eng buyuk to'rtta farishta bor: Jabroil alayhissalom — payg'ambarlarga vahiylarni yetkazuvchi, Mikoil alayhissalom — yomg'ir va rizqqa mas'ul, Isrofil va Azroil alayhissalomlar ham Allohning amrida muntazirdir.'"),
    (4, "Yusuf qiziqib so'radi: 'Ular charchashmaydimi, buvijon?' Buvijoni uning boshini silab: 'Farishtalar doimo Allohga ibodat va itoatda bo'ladilar. Ular yeb-ichishga muhtoj emas, qanotlari nurlardan yaratilgan,' dedi."),
    (5, "Ertasi kuni Yusuf akasiga kitoblarini yig'ishga yordam berdi. Buvijon buni ko'rib: 'Har bir yaxshi amalingni o'ng yelkangdagi Kiraman Kotibin farishtasi oppoq nurlarda yozib bormoqda, barakalla!' deb duo qildi."),
    (6, "Kechki dasturxon atrofida dada o'g'liga qarab: 'Alloh bizni kechayu kunduz himoya qiladigan Mu'aqqibat — qo'riqchi farishtalarini ham tayinlagan. Biz duo qilganimizda, ular birgalikda Omin deb turishadi,' dedi."),
    (7, "Yusuf qalbiga iliqlik to'lganini his qildi: 'Demak, biz har doim ezgulik, ibodat va mehr ila yashasak, farishtalar xonadonimizga baraka va xotirjamlik olib kelishar ekan-da!'"),
    (8, "Kechasi Yusuf osmondagi porloq yulduzlarga qarab yotarkan, shirin orom oldi. Uning qalbida iymon, mehr va Parvardigorining yaratgan mo'jizalariga cheksiz muhabbat uyg'ongan edi.")
]

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
out_dir = os.path.join(BASE_DIR, 'public', 'stories', 'yusuf')
os.makedirs(out_dir, exist_ok=True)

for page_num, text in pages:
    output_path = os.path.join(out_dir, f"audio_{page_num}.mp3")
    print(f"Generating audio for Page {page_num}...")
    
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.60,
            "similarity_boost": 0.80,
            "style": 0.20,
            "use_speaker_boost": True
        }
    }
    
    r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{selected_voice_id}", headers=headers, json=payload)
    if r.status_code == 200:
        with open(output_path, 'wb') as f:
            f.write(r.content)
        print(f" -> Saved {output_path} ({len(r.content)} bytes)")
    else:
        print(f" -> Error on Page {page_num}: {r.status_code} {r.text}")
        break

print("All audio generation complete!")
