import asyncio
import edge_tts
import os

fotima_pages = [
    (1, "Quyosh zarrin nurlarini sochgan shirin yoz kuni edi. Erka qizalog'imiz — Fotimaxon oppoq ko'ylakchasida hovlida quvonch bilan yugurardi. Chunki bugun u intizorlik bilan kutgan sevimli nuryuzli buvijonisi kelishi kerak edi!"),
    (2, "Buvijonisi darvozadan kirib, mehr bilan quchoq ochdi: «Assalomu alaykum, ko'zlarimning nuri, erka Fotimaxonim! Qani topchi, senga Harflar O'lkasidan qanday shirin va sirli hadya olib keldim?»"),
    (3, "Buvijonisi zarhal kitobni ochdi: «Bu harflar — dunyodagi eng go'zal so'zlar, mehribon Robimizning ilohiy nuri bo'lgan Qur'oni Karim harflaridir! Ular orqali qalbimiz quyoshdek porlaydi», dedi erkalab."),
    (4, "Fotimaxon mitti qo'llari bilan kitobni quchoqlab: «Buvijon, biz Qur'on o'qisak, mehribon Alloh bilan dildan so'zlashayotgan bo'lamizmi?» deb so'radi. Buvisi uning sochlarini silab: «Albatta, jonim qizim, Robimiz doim bizni eshitadi», dedi."),
    (5, "Fotimaxon birma-bir harflarni mehr bilan chiza boshladi. «Alif» xuddi to'g'riso'z bahodirdek, «Ba» esa jilmayib turgan jajji do'stdek ko'rindi. U har bir harfni sevinch bilan qaytarib, shodlandi."),
    (6, "Kechki payt Fotimaxon dadasining bag'riga otilib, o'rgangan harflarini aytib berdi. Ota-onasi uning bu go'zal odobidan cheksiz quvonib, bag'irlariga bosdilar: «Sen bizning iftixorimizsan, qizalog'imiz!»"),
    (7, "Yotishdan oldin Fotimaxon buvijonisining yumshoq qo'llaridan tutib, shirin tili bilan pichirladi: «Yo Parvardigor! Qalbimizni Qur'on bilan nurlantir, ota-onamizni sog'-omon qilgin, bizga doim ezgulik ulashishni nasib et!»"),
    (8, "Oydin osmonda yulduzlar charaqlab, Fotimaxonga shirin alla aytdi. Qizaloq nurli kitobini quchoqlab, erkalangan holda orom oldi. Uning yuzida xotirjam tabassum porlardi. «Alhamdulillah!»")
]

zubayr_pages = [
    (1, "Quyosh charaqlab kulgan yorug' ertalab edi. 3 yoshli jajji bolajon — Zubayrxon bog'da qanot qoqayotgan rang-barang kapalaklar ortidan quvonib chopardi: «Qarang, bobojon, kapalak uchdi!» Nuryuzli bobosi nabirasini erkalab, mehr bilan chaqirdi: «Qo'zichog'im mening, bilasanmi, bu chiroyli gullar-u kapalaklarni kim yaratgan?»"),
    (2, "Bobosi unga ko'kka cho'zilgan nurli nurlarni ko'rsatib dedi: «Bizni va butun dunyoni Mehribon Alloh yaratgan. Alloh bittagina so'z: «BO'L!» («Kun!») desa, shundoq darhol hamma narsa paydo bo'ladi! Qara, charaqlagan nurlar, qushchalar va gullar ham Allohning 'Bo'l!' degan amri bilan yaralgan!» Zubayrjon hayratlanib: «Bo'l!» deb takrorladi va quvonib kuldi."),
    (3, "Bobosi davom etdi: «Dunyodagi eng birinchi insonni ham Alloh taolo tuproqdan yaratgan. Uning ismi — Odam Ato edi. Odam Ato yolg'iz qolmasin deb, Alloh unga Momo Havoni do'st va juft qilib berdi. Ular bir-birlariga mehr berib, baxtiyor yashashdi». Zubayr jajji ko'zlarini ochib: «Odam Ato bizning bobomizmi?» deb so'radi."),
    (4, "«Ha, bolajonim!» dedi bobosi. «Odam Ato bilan Momo Havo jannatda yashashardi. U yerda shildirab oqqan zilol daryolar, sharsharalar, xushbo'y gullar va shirin mevali daraxtlar bor edi. Ular bu go'zal bog'larda xotirjam va quvnoq hayot kechirishdi»."),
    (5, "Bobosi nabirasini yoniga o'tqazib, mehr bilan tushuntirdi: «Jannatda xushbo'y mevalar juda ko'p edi. Alloh ularga: 'Faqat bittagina daraxtga tegmang', dedi. Ammo quloqsiz shayton ularga hasad qildi. U yashirincha kelib: 'Bu mevadan yesangiz, doim jannatda qolasiz', deb yolg'on gapirdi». Zubayrjon xafalanib: «Yolg'on gapirish judayam yomon-a?» dedi."),
    (6, "Zubayr xafa bo'lib labini burganida, bobosi uni mehr bilan ovutib, quchoqladi: «Odam Ato bilan Momo Havo xato qilganlarini biliboq, darhol: 'Allohim, biz adashdik, bizni kechirgin!' deb yig'lab kechirim so'rashdi. Mehribon Alloh esa kechirishni yaxshi ko'radi, shuning uchun ularni kechirdi». Zubayr: «Men ham xato qilsam, 'kechirasiz' deyman!» dedi."),
    (7, "«Keyin ular yer yuziga tushdilar», deb tushuntirdi bobosi. «Alloh Odam Atoga yerga bug'doy ekishni va loy tandirda issiqqina, xushbo'y shirin nonlar pishirishni o'rgatdi. Ular peshona teri bilan halol mehnat qilib, har bir luqma non uchun 'Alhamdulillah' deyishdi». Zubayrjon: «Men ham issiq nonni yaxshi ko'raman!» deb jilmaydi."),
    (8, "Bog'da bobosi va buvisi Zubayrjonni o'rtaga olib, mahkam bag'irlariga bosdilar: «Zubayrjonim, dunyodagi barcha insonlar Odam Atoning avlodlarimiz. Demak, hammamiz bitta katta, ahil oilamiz! Biz bir-birimizga doim g'amxo'r bo'lishimiz va mehribonlik ulashishimiz kerak»."),
    (9, "Zubayrxon mitti qo'lchalarini ochib, shirin tili bilan chin dildan duo qildi: «Allohim! Bobojonimni, buvijonimni, oyijonim va dadajonimni asragin! Menga doim odobli, yaxshi va shirinso'z bola bo'lishni nasib et! Omin!»"),
    (10, "Bobosi nabirasini erkalab, yuzidan o'pdi va quchoqladi: «Ilohim umring ziyoda bo'lsin, aqlli bolam!» Zubayrjon bobosining bag'rida o'zini eng baxtiyor his qilib, qalbida xotirjamlik va shukronalik bilan: «Alhamdulillah!» deb shirin uyquga ketdi.")
]

async def generate_audios():
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    # 1. Fotima Story (Madina Voice - Warm, gentle female narrator)
    fotima_dir = os.path.join(BASE_DIR, 'public', 'stories', 'fotima')
    os.makedirs(fotima_dir, exist_ok=True)
    print("--- Generating Fotima Audios (uz-UZ-MadinaNeural) ---")
    for page_num, text in fotima_pages:
        output_file = os.path.join(fotima_dir, f"audio_{page_num}.mp3")
        communicate = edge_tts.Communicate(text, "uz-UZ-MadinaNeural", rate="-2%", pitch="+1Hz")
        await communicate.save(output_file)
        print(f"Fotima Page {page_num} -> {output_file}")

    # 2. Zubayr Story (Sardor Voice - Warm storytelling male narrator)
    zubayr_dir = os.path.join(BASE_DIR, 'public', 'stories', 'zubayr')
    os.makedirs(zubayr_dir, exist_ok=True)
    print("--- Generating Zubayr Audios (uz-UZ-SardorNeural) ---")
    for page_num, text in zubayr_pages:
        output_file = os.path.join(zubayr_dir, f"audio_{page_num}.mp3")
        communicate = edge_tts.Communicate(text, "uz-UZ-SardorNeural", rate="-3%", pitch="+0Hz")
        await communicate.save(output_file)
        print(f"Zubayr Page {page_num} -> {output_file}")

    print("All audio files for Fotima and Zubayr generated perfectly with exact matching text!")

if __name__ == "__main__":
    asyncio.run(generate_audios())
