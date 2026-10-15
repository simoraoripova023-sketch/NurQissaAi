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
    id: 'kindness_elders',
    theme: 'Kattalarga va Yaqinlarga Mehr-Oqibat, Buvijon va Bobojonga Xizmat',
    matched_goals: ['kindness', 'mercy', 'compassion', 'shafqat', 'mehr_oqibat', 'sila_i_rahm', 'qarindoshlik', 'buvijon'],
    core_conflict: 'Bolajon o\'yiniga yoki o\'yinchoqlariga berilib, xonadondagi keksa buvijonisining yoki yordamga muhtoj yaqinlarining holidan xabar olishga beparvo bo\'ladi.',
    prophetic_guidance: 'Payg\'ambarimiz sallallohu alayhi vasallam: «Kattalarimizni hurmat qilmagan, kichiklarimizga rahm-shafqat ko\'rsatmagan bizdan emasdir», deb ta\'lim berganlar. Nuroniy buvijon va bobojonlarning ko\'nglini olish, ularga issiq choy quyib berish, hassasini olib kelish va duolarini olish xonadonga Allohning ulug\' fayz va barakasini yog\'diradi.',
    hadith_sharif_uz: '«Kattalarimizni ulug\'lamagan va kichiklarimizga rahm-shafqat qilmagan kishi bizdan emasdir.» (Imom Termiziy rivoyati)',
    hadith_sharif_en: '«He is not one of us who does not show mercy to our young ones and respect to our elders.» (Tirmidhi)',
    inner_realization: 'Buvijonisining mehnatdan qavarib ketgan, ammo mehr to\'la nufuzli qo\'llarini ko\'rib, dunyodagi eng katta boylik — qariyalarning oq fotihasi va mehr-oqibat ekanligini yurakdan his qiladi.',
    action_resolution: 'O\'yinchoqlarini chetga surib, buvijonisining yoniga boradi, uning quchog\'iga bosh qo\'yadi, oyog\'iga issiq paypog\'ini kiygizib, qo\'llarini o\'padi va duolarini oladi.',
    dua_uz: 'Yo Robbim! Bizni kattalarni e\'zozlaydigan, ularning duolariga erishadigan, mehr-oqibatli va soliha/solih farzandlardan qilgin. Omin!',
    dua_arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ'
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
  },
  {
    id: 'nature_adventure',
    theme: 'Tabiat Mo\'jizalari, Qushlar va Jonivorlarga Shafqat, Yashil Bog\' Sarguzashti',
    matched_goals: ['adventure', 'nature', 'courage', 'kindness', 'tabiat', 'sarguzasht', 'qushlar', 'shafqat'],
    core_conflict: 'Bahoriy sayr vaqtida bolajon daraxt tagida qanoti shikastlangan yoki chanqagan mitti qushchani uchratadi va unga befarq o\'tib ketish yoki yordam berish tanlovi oldida qoladi.',
    prophetic_guidance: 'Payg\'ambarimiz sallallohu alayhi vasallam: «Yer yuzidagilarga rahm qiling, toki osmondagilar ham sizga rahm qilsin» deb ta\'lim berganlar. Jonivorlar va o\'simliklarga g\'amxo\'rlik qilish katta savobli yaxshilikdir.',
    hadith_sharif_uz: '«Har bir tirik jonga qilingan yaxshilikda ajr-mukofot bordir.» (Imom Buxoriy rivoyati)',
    hadith_sharif_en: '«There is a reward for serving any living being.» (Bukhari)',
    inner_realization: 'Hatto eng mitti jonzot ham Allohning mo\'jizaviy yaratig\'i ekanligini, mehr va g\'amxo\'rlik qalbga quvonch olib kelishini anglaydi.',
    action_resolution: 'Dadasining yordamida yog\'ochdan chiroyli qush uyasi yasab, unga toza suv va don sepadi, qushchaning sog\'ayib uchib ketganini ko\'rib cheksiz quvonadi.',
    dua_uz: 'Yo Rahmli Robbim! Qalbimizni butun borliqqa mehr-shafqatli ayla. Yaxshilik qilishda bizga quvvat ber! Omin!',
    dua_arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ'
  },
  {
    id: 'caravan_discovery',
    theme: 'Qadimiy Shaharlar, Buyuk Allomalar Me\'rosi va Ilm Izlash Sarguzashti',
    matched_goals: ['discovery', 'wisdom', 'travel', 'honesty', 'ilm', 'kashfiyot', 'sayohat', 'allomalar'],
    core_conflict: 'Sayohat yoki qadimiy kitob mutolaasi chog\'ida qiyin vaziyatga tushib, maqsadga erishishda sabrsizlik qilish yoki sinovdan chekinish istagi tug\'iladi.',
    prophetic_guidance: 'Ilm va ezgulik yo\'lidagi har bir qadam — ibodatdir. Payg\'ambarimiz sallallohu alayhi vasallam: «Beshikdan to qabrgacha ilm izlanglar» deb nasihat qilganlar. Ota-bobolarimiz sabot va sabr bilan buyuk kashfiyotlar qilganlar.',
    hadith_sharif_uz: '«Kim ilm izlash yo\'liga qadam qo\'ysa, Alloh unga jannat yo\'lini oson qilib qo\'yadi.» (Imom Muslim rivoyati)',
    hadith_sharif_en: '«Whoever takes a path upon which he procures knowledge, Allah will thereby make easy for him a path to Paradise.» (Muslim)',
    inner_realization: 'Qiyinchiliklar insonni kuchli va aqlli qilishini, ilm va halol mehnat orqali har qanday to\'siqni yengish mumkinligini anglaydi.',
    action_resolution: 'Oila a\'zolari bilan maslahatlashib, qat\'iyat bilan sirli vazifani yechadi, yangi foydali bilimlarni o\'zlashtirib, quvonch bilan Alhamdulillah deydi.',
    dua_uz: 'Ey Ilm beruvchi Robbim! Zehnumizni o\'tkir, ilmimni ziyoda va aqlimni komil qilgin. Omin!',
    dua_arabic: 'رَّبِّ زِدْنِي عِلْمًا'
  }
];
