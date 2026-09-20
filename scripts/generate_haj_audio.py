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
    
    # Select warm voice for teacher / storytelling
    selected_voice_id = voice_map.get('Sarah') or voice_map.get('Rachel') or voice_map.get('Lily') or (voices[0]['voice_id'] if voices else '')
    print(f"Selected voice ID: {selected_voice_id}")

    pages = [
        (1, "Quyosh zarrin nurlarini sochgan fayzli tongda bog'chamiz bolajonlarning quvnoq qahqahasiga to'ldi. Mehridaryo Nilufar opa bolalarni davraga chorlab: Bolajonlarim, bugun biz Islomning beshinchi buyuk rukni — muqaddas Haj ibodatiga xayolan sayohat qilamiz! Birinchi qadam — pokiza niyat qilib, oppoq ehrom kiyimini kiyishdir, dedi tabassum bilan."),
        (2, "Xonaning o'rtasida zarhal naqshli, mitti Ka'ba maketi charaqlab turardi. Nilufar opa bolajonlarni qo'llaridan tutib erkaladi: Hajga borgan hojilar Ka'bai muazzama atrofida mehr va hurmat bilan roppa-rosa yetti marta aylanadilar. Bu go'zal amal — Tavof deb ataladi! Biloljon va do'stlari quvonch bilan sanab yetti marta tavof qildilar."),
        (3, "So'ngra Nilufar opa polga yashil yo'lakcha to'shab, Safo va Marva belgilarini qo'ydi: Uchinchi bosqich — Sa'y amali! Qadimda Hojar onamiz jajji go'dagi Ismoilga suv izlab, Safo va Marva tepaliklari orasida yetti marta yugurgan. Shunda Alloh taolo shifobaxsh Zamzam bulog'ini ato etgan! Bolajonlar sabr sabog'ini o'rganib, quvnoq qadamlar bilan yurdilar."),
        (4, "To'rtinchi bosqichda Nilufar opa Arofat tog'i rasmini ko'rsatdi: Arofat — duolar qabul bo'ladigan eng ulug' joydir! Hojilar bu yerda qo'llarini ochib, tinchlik, ota-onalariga sog'lik va qalb pokligini so'rab duo qiladilar. Barcha bolajonlar yumshoq yostiqchalarda o'tirib, mitti qo'llarini ochib samimiy duo qildilar."),
        (5, "Quyosh botib oqshom tushgach, xonada miltillovchi yulduzchalar yondi. Beshinchi qadam — Muzdalifada oqshomni o'tkazishdir, dedi Nilufar opa sokin ovozda. Hojilar ochiq osmon ostida orom oladilar va kichkina toza toshchalar yig'adilar. Bolajonlar mitti xaltachalarga silliq toshchalarni terishdi."),
        (6, "Oltinchi bosqichda Nilufar opa bolajonlarga qiziqarli o'yin doskasini ko'rsatdi: Minoda shaytonga tosh otish — bu qalbimizdagi yomon odatlarni: jahl qilish, xasislik va dangasalikni o'zimizdan haydash demakdir! Bolajonlar yumshoq sharchalarni nishonga olib otib, faqat yaxshi xulqli bo'lishga ahd qildilar."),
        (7, "Va nihoyat, yettinchi bosqich — Ka'baga Xayrlashuv tavofini qilib, muqaddas Haj ibodatini bekam-ko'st yakunlashdir! Xonada Iyd bayrami yangradi. Nilufar opa har bir jajji bolajonning boshiga zarhal toj kiydirib, diplom va shirin xurmolarni hadya qildi. Bolajonlar shodlik bilan: Alhamdulillah, Haj qilishni o'rgandik! deb quvondilar.")
    ]

    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(BASE_DIR, 'public', 'stories', 'haj')
    os.makedirs(out_dir, exist_ok=True)
    for page_num, text in pages:
        output_path = os.path.join(out_dir, f"audio_{page_num}.mp3")
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
            print(f"Page {page_num} error: {r.status_code} {r.text}")

    print("All Hajj audio files generated successfully!")
except Exception as e:
    print("Audio generation error:", e)
