import asyncio
import edge_tts
import os

pages = [
    (1, "Bahorning eng go'zal, fusunkor oqshomlaridan biri edi. Daraxtlar oppoq va pushti gullarga burkangan, havoda mayin maysalar ifori taralardi. Hovlidagi so'rida o'tirgan aqlli bola — Yusufjon osmonda charaqlagan yulduzlarni va shivalab yog'ayotgan barakali bahor yomg'irini tomosha qilib xayolga toldi: «Qiziq, bu cheksiz osmondagi yulduzlarni, yerga tushayotgan har bir yomg'ir tomchisini kim tartibga soladi?»"),
    (2, "Yusuf xonaga kirib, joynamoz ustida zikr qilayotgan buvisining yoniga o'tirdi. Buvisi nabirasini mehr bilan bag'riga bosib: «Bolajonim, Alloh taolo yaratgan eng mo'jizaviy maxluqotlar — Farishtalardir. Ular nurdan yaratilgan bo'lib, yemaydilar, ichmaydilar, uxlamaydilar va hech qachon gunoh qilmaydilar. Robbimiz qanday buyruq bersa, uni so'zsiz va bekam-ko'st bajaradilar», dedi."),
    (3, "Buvisi javondagi Qur'oni Karimga ehtirom bilan qaradi: «Eng ulug' farishta — Jabroil (alayhissalom)dir. U Allohning vahiysini payg'ambarlarga yetkazgan. Ikkinchi buyuk farishta esa — Mikoil (alayhissalom) bo'lib, u Allohning amri bilan tabiatni boshqaradi: bahor yomg'irlarini yog'diradi, shamollarni yo'naltiradi va barcha jonzotlarga rizq ulashadi»."),
    (4, "«Uchinchi ulug' farishta — Isrofil (alayhissalom) bo'lib, qiyomat kuni Allohning amri bilan Surni chaladi», deb davom etdi buvisi. «To'rtinchisi esa — Malakul mavt, ya'ni Azroil (alayhissalom)dir. U insonlarning ruhini oladi. Bu bizga har bir bahor, har bir kunimiz g'animat ekanini, vaqtimizni faqat ezgu amallar va yaxshilik bilan o'tkazishimiz kerakligini eslatadi»."),
    (5, "Shu payt kichik singlisi Maryam qalamlarini tushirib yubordi. Yusuf darhol qalamlarni mehr bilan terib berdi. Buvisi quvonib dedi: «Barakalla! Har bir insonning o'ng va chap yelkasida Kiroman va Katibin — hurmatli kotib farishtalar bor. O'ng yelkadagi farishta hozirgina singlingga qilgan yaxshiligingni savob qilib yozdi. Chapdagisi esa gunohlarni qayd etadi. Agar tavba qilsak, u yozishni kechiktiradi!»"),
    (6, "Dasturxon boshida dadasi ham suhbatga qo'shildi: «O'g'lim, Alloh bizni yolg'iz qoldirmaydi. Har bir mo'min bilan birga Muaqqibat — himoyachi farishtalar bo'ladi. Ular bizni oldimizdan, ortimizdan va har tarafdan Allohning izni bilan ofatlardan asraydi. Samoda esa Xamalatul Arsh farishtalari iymonli bandalar uchun Allohdan mag'firat so'rab duo qilib turadilar»."),
    (7, "Dadasi so'zida davom etdi: «Inson vafot etgach, qabrda Munkar va Nakir farishtalari: Robbing kim? Dining qaysi? Payg'ambaring kim? deb so'raydilar. Dunyoda yaxshi amal qilgan insonlar yorug' yuz bilan javob berishadi. So'ngra ularni Jannat darvozasida uning bosh posboni — Ridvan (alayhissalom) xushxabarlar bilan kutib oladi!»"),
    (8, "Kechasi Yusuf xonasiga kirib, Mushafdan Oyatul Kursi va Ixlos suralarini tilovat qildi. U yelkasidagi kotib farishtalarni va o'zini asrab turgan himoyachilarni qalban his qilib, cheksiz sakinat tuydi: «Allohim, o'ng yelkamdagi daftarni savoblar bilan to'ldir va bizni Jannatingda Ridvan farishta kutib oladigan bandalaringdan qil!» — deb shirin uyquga ketdi.")
]

async def generate_all():
    os.makedirs("public/stories/yusuf", exist_ok=True)
    voice = "uz-UZ-SardorNeural" # Sof o'zbekcha suxandon ovozi
    
    for page_num, text in pages:
        output_file = f"public/stories/yusuf/audio_{page_num}.mp3"
        print(f"Generating authentic Uzbek audio for Page {page_num}...")
        communicate = edge_tts.Communicate(text, voice, rate="-3%", pitch="+0Hz")
        await communicate.save(output_file)
        print(f" -> Saved {output_file}")

    print("All 8 pages generated with 100% native authentic Uzbek accent!")

if __name__ == "__main__":
    asyncio.run(generate_all())
