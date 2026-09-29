/**
 * NURQISSA AI — Islomiy Bolalar Adabiyoti va Hikmatlar Bazasi
 * 
 * Ushbu modul tahlil qilingan manbalar asosida tuzilgan:
 * 1. "Payg'ambarimiz nima qilgan bo'lardilar" (Mo'tabar Xamrayeva)
 * 2. "Zahro va yo'qolgan mushukcha" (Ummu Zahro)
 * 3. "Onajon bugun nima ovqat yeymiz" (Ummu Zakariyya)
 * 4. "Imron va xafa bo'lgan o'yinchoqlar" (Umida Bahodir qizi)
 * 5. "Aqilli bola Yusuf" (Nuur.uz)
 * 6. "Bolalar uchun 40 hadis hikoyalari" (Doktor Yashar Kandemir)
 * 7. "Farishtalar haqida bilaman" (Siddiqa)
 */

export interface StoryArchetype {
  id: string;
  theme: string;
  matched_goals: string[];
  core_conflict: string;
  prophetic_guidance: string;
  hadith_sharif_uz: string;
  hadith_sharif_en: string;
  inner_realization: string;
  action_resolution: string;
  dua_uz: string;
  dua_arabic: string;
}

export const ISLAMIC_STORY_ARCHETYPES: StoryArchetype[] = [
  {
    id: 'food_gratitude',
    theme: 'Taom Odobi, Shukronalik va Isrof qilmaslik',
    matched_goals: ['gratitude', 'shukr', 'table_manners', 'eating', 'taom_odobi', 'qanoat'],
    core_conflict: 'Bolakay dasturxondagi tayyor ne\'matni mensimay, injiqlik qilib boshqa narsa xohlaydi yoki taomni to\'kib-sochadi.',
    prophetic_guidance: 'Payg\'ambarimiz sallallohu alayhi vasallam hech qachon taomni ayblamaganlar, yoqsa yeganlar, yoqmasa indamay qo\'yganlar. Dunyoda bir burda nonga zor qancha bolalar borligini eslash, «Bismillah» bilan boshlab, oxirida «Alhamdulillah» deb shukr qilish ne\'matni ziyoda qiladi.',
    hadith_sharif_uz: '«Payg\'ambarimiz sallallohu alayhi vasallam hech qachon biror taomni ayblamas edilar. Agar yoqsa yer, yoqmasa qo\'yib qo\'yardilar.» (Imom Buxoriy rivoyati)',
    hadith_sharif_en: '«The Prophet (pbuh) never criticized any food. If he liked it he ate it, and if not, he left it.» (Bukhari)',
    inner_realization: 'Otasining va onasining peshona teri bilan topilgan har bir luqma ulug\' ne\'mat ekanligini, isrof qilish qalb nurini o\'chirishini tushunib yetadi.',
    action_resolution: 'Dasturxon oldida qo\'llarini yuvib, odob bilan o\'tiradi, «Bismillah» deb taomni mehr bilan yeydi va ota-onasining haqqiga duo qiladi.',
    dua_uz: 'Yo Allohim! Bizga ato etgan shirin ne\'matlaringga behisob shukrlar bo\'lsin. Rizqimizga baraka ber, och-yupun bolajonlarga ham O\'zing keng rizq ato etgin. Omin!',
    dua_arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ'
  },
  {
    id: 'mercy_animals',
    theme: 'Mitti Jonzotlarga Shafqat va Mehribonlik',
    matched_goals: ['kindness', 'mercy', 'compassion', 'animals', 'tabiat', 'shafqat', 'mehr_oqibat'],
    core_conflict: 'O\'ynab yurgan paytda kutilmaganda sovuqda titrab turgan, adashib qolgan yoki qutiga tushib qiynalayotgan mitti jonzotni (mushukcha, qushcha, kiyikcha) uchratadi.',
    prophetic_guidance: '«Payg\'ambarimiz sallallohu alayhi vasallam bu vaziyatda nima qilgan bo\'lardilar?» U Zot daraxtga bog\'langan kiyikni bolasining oldiga qo\'yib yuborganlar, yo\'ldan adashgan qushchani onasiga qaytarganlar, chanqagan itga suv bergan odamning barcha gunohlari kechirilganini aytganlar.',
    hadith_sharif_uz: '«Siz yer yuzidagilarga rahm-shafqat qilingki, osmondagilar ham sizga rahm qilsin!» (Imom Termiziy rivoyati)',
    hadith_sharif_en: '«Be merciful to those on the earth, and the One in the heavens will have mercy upon you.» (Tirmidhi)',
    inner_realization: '«Ba\'zan juda kichkina yordam ham kim uchundir eng katta yaxshilik bo\'lishi mumkin. Men uni ko\'rib, befarq o\'tib keta olmayman!» degan oliyjanoblik tuyg\'usi jo\'sh uradi.',
    action_resolution: 'O\'yinini chetga surib, jonzotga suv va taom beradi, uning onasini qidirib topib bag\'riga topshiradi va qalbida cheksiz halovat topadi.',
    dua_uz: 'Ey mehribon Parvardigorim! Qalbimizni barcha maxluqotingga nisbatan shafqatli va mehrli qilgin, bizni O\'zing suygan solih bandalaring safiga qo\'shgin. Omin!',
    dua_arabic: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا'
  },
  {
    id: 'tidiness_sharing',
    theme: 'Tartib-intizom, Isrofga chek qo\'yish va Saxovat',
    matched_goals: ['discipline', 'tidiness', 'generosity', 'sharing', 'saranjomlik', 'saxovat', 'isrof'],
    core_conflict: 'O\'yinchoqlarini yoki xonasini betartib qilib tashlab, yig\'ishga erinadi («Ertaga qilaman, bugun kech bo\'ldi»), xarxasha qilib yangi buyumlar talab qiladi.',
    prophetic_guidance: 'Poklik va tartib iymondandir. Haddan tashqari ko\'p narsa yig\'ish va ularni qadrlamaslik isrofdir. Mo\'min kishi o\'zi yaxshi ko\'rgan narsasini muhtoj tengdoshlariga hadya qilsa, qalbi barakaga to\'ladi.',
    hadith_sharif_uz: '«O\'zingiz yaxshi ko\'rgan narsalardan ehson qilmaguningizcha, hargiz yaxshilikka (haqiqiy baxtga) erisha olmaysiz.» (Oli Imron surasi, 92-oyat)',
    hadith_sharif_en: '«You will not attain righteousness until you give of that which you love.» (Quran 3:92)',
    inner_realization: 'O\'yinchoqlarining xafa bo\'lib ketmoqchi ekanligini, qanchadan-qancha yetim va muhtoj bolalarda bitta ham o\'yinchoq yo\'qligini his qilib, dangasalikni yengadi.',
    action_resolution: 'Ertalab qunt bilan butun xonasini saranjom qiladi, o\'zi yaxshi ko\'rgan o\'yinchoq va kiyimlardan saralab, maxsus «Yaxshilik qutisi»ga solib, qo\'shni yetim bolalarga olib boradi.',
    dua_uz: 'Allohim! Qalbimizdan baxillik va dangasalikni uzoq qilgin. Qo\'limizni saxiy, xonadonimizni pokiza va qut-barakali ayla. Omin!',
    dua_arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ'
  },
  {
    id: 'sakinat_worship',
    theme: 'Qalb Sakinati, Namoz va Tashqi Chalg\'uvlardan Yiroq Bo\'lish',
    matched_goals: ['worship', 'prayer', 'identity', 'peace', 'ibodat', 'namoz', 'sakinat', 'iymon'],
    core_conflict: 'Ko\'chadagi yoki televizordagi baland musiqalar, shovqin-suronli bayramlar va yaltiroq narsalarga havasi ketib, nega biz bunday qilmaymiz deb ikkilanadi.',
    prophetic_guidance: 'Mo\'min kishi Alloh rozi bo\'ladigan ish bilan qalb halovati topadi. Shovqin-suron va behuda o\'yin-kulgilar qalbni toliqtiradi, azon va Qur\'oni Karim qiroati esa xonadonga maloikalar barakasini va tengsiz sakinat olib keladi.',
    hadith_sharif_uz: '«Albatta, Allohni zikr qilish bilan qalblar orom olur.» (Ra\'d surasi, 28-oyat)',
    hadith_sharif_en: '«Unquestionably, by the remembrance of Allah hearts are assured.» (Quran 13:28)',
    inner_realization: 'Haqiqiy shodlik va xotirjamlik qimmatbaho shovqinlarda emas, balki joynamoz ustida, Qur\'on varaqlarida va oila mehrida ekanligini anglaydi.',
    action_resolution: 'Tahorat olib, ota-onasi bilan bir safda shukrona namozini o\'qiydi, xushovozlik bilan Qur\'on tilovat qilib, qalbida beqiyos sokinlik tuyadi.',
    dua_uz: 'Robbim! Qalbimizga O\'zingning sakinatingni yog\'dirgin. Bizni namozini to\'kis ado etuvchi, Qur\'on nuri bilan yashaydigan solihlardan qilgin. Omin!',
    dua_arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ'
  },
  {
    id: 'honoring_parents',
    theme: 'Ota-onani E\'zozlash, Shirin So\'z va Odob',
    matched_goals: ['respect_parents', 'family', 'obedience', 'ota_ona', 'mehr', 'odob', 'sabr'],
    core_conflict: 'Charchab yoki o\'yinga berilib, ota-onasining chaqirig\'iga darhol javob bermaydi yoki biroz erinib gap qaytaradi.',
    prophetic_guidance: 'Ota-onaga «Uff» ham demaslik, ularning ko\'ziga mehr bilan boqish eng savobli amallardandir. Payg\'ambarimiz sallallohu alayhi vasallam: «Allohning roziligi ota-onaning roziligidadir» deb ta\'lim berganlar.',
    hadith_sharif_uz: '«Robbingiz faqat Uning O\'zigagina ibodat qilishingizni va ota-onaga yaxshilik qilishni amr etdi.» (Isro surasi, 23-oyat)',
    hadith_sharif_en: '«And your Lord has decreed that you not worship except Him, and to parents, good treatment.» (Quran 17:23)',
    inner_realization: 'Onasining charchagan nigohini, otasining mehr to\'la tabassumini ko\'rib, o\'zining erinchoqligidan qattiq xijolat tortadi.',
    action_resolution: 'Darhol borib onasining quchog\'iga otiladi, uning qo\'llaridan o\'pib uzr so\'raydi, uydagi yumushlarda ota-onasiga ko\'maklashadi.',
    dua_uz: 'Yo Allohim! Ota-onam meni go\'dakligimda qanday mehribonlik bilan tarbiya qilgan bo\'lsalar, Sen ham ularga shunday rahm ayla. Omin!',
    dua_arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا'
  }
];
