import requests
import json
import os

api_key = os.environ.get('ELEVENLABS_API_KEY', 'sk_a2f342ffaaf5d1c4a6c0c1585187cfd7baeca773a9de137b')
headers = {
    'xi-api-key': api_key,
    'Content-Type': 'application/json'
}

try:
    voices_res = requests.get('https://api.elevenlabs.io/v1/voices', headers=headers).json()
    voices = voices_res.get('voices', [])
    voice_map = {v['name']: v['voice_id'] for v in voices}
    selected_voice_id = voice_map.get('Sarah') or voice_map.get('Rachel') or voice_map.get('Lily') or (voices[0]['voice_id'] if voices else '')

    pages = [
        (1, "Oydin oqshomda osmonda kumushdek yaltirab yangi nozik Hilol oy ko'rindi! Alijon deraza yoniga yugurib, zavq bilan qichqirdi: Oyijon, dadajon, qaranglar, muborak Ramazon oyi kirdi! Butun xonadonga iliqlik va baraka taraldi."),
        (2, "Tong yorishmasdan oldin xonadonda chiroqlar yoqildi. Onajonisi dasturxonga issiq non, asal va xushbo'y choy tortdilar. Bolajonlarim, bu vaqt Saharlik deb ataladi, dedi dadasi. Saharlikda katta baraka bor, u bizga kun bo'yi quvvat beradi."),
        (3, "Kunduzi Alijon singlisi Oyshaning xafa bo'lib turganini ko'rdi. U darhol eng sevimli rangli qalamlari va o'yinchoqlarini singlisiga berib: Kel, birga chizamiz, Oyshaxon! dedi. Ramazon — bu boshqalarga mehr va quvonch ulashish oyidir!"),
        (4, "Tushdan keyin Alijonning biroz qorni ochdi va suvsadi. Dadasi uning yoniga o'tirib erkaladi: O'g'lim, sabr — bu qiyinchilikka chidash va kuchli bo'lishdir. Qachon sabr qilsang, qalbing nurga to'ladi. Alijon sabr qilib, go'zal rasm chizdi."),
        (5, "Nihoyat quyosh botdi va mayin azon ovozi yangradi: Allohu Akbar! Alijon bir qultum obihayot suv va shirin xurmo bilan og'iz ochdi. Alhamdulillah, bu dunyodagi eng mazali taom! deb shukr qildi."),
        (6, "Kechasi Alijon dadasi bilan oppoq do'ppilarini kiyib, chiroqlari charaqlagan muhtasham masjidga bordilar. U yerda barcha insonlar bir safda mehr bilan Taroveh namozini o'qidilar. Alijon o'zini bepoyon baxtiyor his qildi."),
        (7, "Ramazon oyi Alijon va Oyshaga sabr, saxovat va shukronalikni o'rgatdi. Xonadonda kutilgan Hayit bayrami tongi otdi! Hamma yangi kiyimlarini kiyib, bir-birlarini tabrikladilar: Alhamdulillah, Ramazon muborak bo'lsin!")
    ]

    os.makedirs('public/stories/ramazon', exist_ok=True)
    for page_num, text in pages:
        output_path = f"public/stories/ramazon/audio_{page_num}.mp3"
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.65, "similarity_boost": 0.85}
        }
        r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{selected_voice_id}", headers=headers, json=payload)
        if r.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(r.content)
            print(f"Saved {output_path} ({len(r.content)} bytes)")
        else:
            print(f"Page {page_num} audio error: {r.status_code}")

    print("All Ramadan audio files generated successfully!")
except Exception as e:
    print("Audio generation error:", e)
