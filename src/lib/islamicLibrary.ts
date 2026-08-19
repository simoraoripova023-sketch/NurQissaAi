/**
 * NURQissa AI — Authentic Islamic Storytelling & Wisdom Knowledge Core
 * Synthesized from authenticated Islamic children's literature, prophet stories, and 40 hadith tales.
 */

export interface IslamicWisdomTheme {
  id: string;
  title_uz: string;
  title_en: string;
  prophet_or_source: string;
  virtue: string;
  core_lesson_uz: string;
  core_lesson_en: string;
  hadith_or_ayah_uz: string;
  hadith_or_ayah_en: string;
  bedtime_dua_uz: string;
  bedtime_dua_en: string;
  keywords: string[];
  suggested_settings: string[];
}

export const ISLAMIC_WISDOM_KNOWLEDGE_BASE: IslamicWisdomTheme[] = [
  {
    id: "generosity_ali_dates",
    title_uz: "Saxovat va Bo'lishish Fazilati",
    title_en: "Virtue of Generosity & Sharing",
    prophet_or_source: "40 Hadis Hikoyalari & Hadisi Sharif",
    virtue: "Saxovat, Mehr va Ehson",
    core_lesson_uz: "Saxovatli inson o'ziga yoqqan narsani boshqalar bilan samimiy baham ko'radi. Qalb saxovati insonni xotirjam va sevimli qiladi.",
    core_lesson_en: "True generosity is joyfully sharing what you love. A giving heart brings inner peace and divine love.",
    hadith_or_ayah_uz: "«Saxovatli inson — Allohga, odamlarga va jannatga yaqindir» (Termiziy)",
    hadith_or_ayah_en: "«The generous one is close to Allah, close to people, and close to Paradise.» (Tirmidhi)",
    bedtime_dua_uz: "«Allohim, qalbimizni saxovat va mehr nuri bilan to'ldirgin, bizni yaxshilik ulashuvchilardan ayla!»",
    bedtime_dua_en: "«O Allah, fill our hearts with generosity and kindness, and make us among those who bring good to others.»",
    keywords: ["saxovat", "ehson", "yulduz", "qushcha", "xurmo", "mehribonlik", "bo'lishish"],
    suggested_settings: ["magical_forest", "ancient_city", "starry_galaxy"]
  },
  {
    id: "patience_yusuf",
    title_uz: "Hazrati Yusufning Sabri va Oqilligi",
    title_en: "Prophet Yusuf: Wisdom & Beautiful Patience",
    prophet_or_source: "Aqilli bola Yusuf & Qissasul Anbiya",
    virtue: "Go'zal Sabr va Kechirimlilik",
    core_lesson_uz: "Qiyinchiliklarda sabr qilgan, ota-onasiga ehtirom ko'rsatgan va barchani kechira olgan inson yuksak darajalarga erishadi.",
    core_lesson_en: "Whoever practices patience, honors their parents, and forgives others will attain the highest honor and wisdom.",
    hadith_or_ayah_uz: "«Bas, go'zal sabr qil! Albatta, sabr qiluvchilarga mukofotlari hisobsiz berilur» (Zumar: 10)",
    hadith_or_ayah_en: "«So be patient with beautiful patience. Indeed, the patient will be given their reward without account.» (39:10)",
    bedtime_dua_uz: "«Allohim, bizga Yusuf alayhissalomdek go'zal sabr, oqillik va pokiza qalb ato etgin!»",
    bedtime_dua_en: "«O Allah, grant us beautiful patience, wisdom, and a pure heart like Prophet Yusuf!»",
    keywords: ["sabr", "oqillik", "odob", "kechirish", "nurli qalb", "ota-ona"],
    suggested_settings: ["ancient_city", "magical_forest"]
  },
  {
    id: "truth_ibrahim_friendship",
    title_uz: "Hazrati Ibrohim — Allohning Chin Do'sti",
    title_en: "Prophet Ibrahim: The Seeker of Truth",
    prophet_or_source: "Allohning chin do'sti & Ibrohim payg'ambar qissasi",
    virtue: "Tafakkur, Mehmondo'stlik va Tavakkul",
    core_lesson_uz: "Yulduzlar, oy va quyoshga boqib Haqiqatni topish; muhtojlarga eng yaxshi taomlarni ulashib mehmondo'st bo'lish fazilati.",
    core_lesson_en: "Reflecting upon the stars, moon, and nature to recognize the Creator; practicing warm hospitality and deep trust in God.",
    hadith_or_ayah_uz: "«Alloh Ibrohimni O'ziga xalil (eng yaqin do'st) qilib oldi» (Niso: 125)",
    hadith_or_ayah_en: "«And Allah took Ibrahim as an intimate friend.» (4:125)",
    bedtime_dua_uz: "«Allohim, bizni ham Ibrohim alayhissalom kabi O'zing suygan solih bandalaringdan qilgin!»",
    bedtime_dua_en: "«O Allah, make us among Your beloved, righteous servants just as Prophet Ibrahim was!»",
    keywords: ["ibrohim", "yulduzlar", "oy", "quyosh", "mehmondo'stlik", "ka'ba", "tavakkul"],
    suggested_settings: ["starry_galaxy", "ancient_city"]
  },
  {
    id: "compassion_creatures_hadith",
    title_uz: "Jonivorlarga va Tabiatga Mehr Ko'rsatish",
    title_en: "Compassion to All Living Creatures",
    prophet_or_source: "40 Hadis Hikoyalari (Tikon va Sher hikoyasi)",
    virtue: "Rahmdillik va Tabiatni Asrash",
    core_lesson_uz: "Kichik qushcha yoki jonivorga ko'rsatilgan kichik bir yaxshilik va marhamat Alloh huzurida ulkan mukofotga sabab bo'ladi.",
    core_lesson_en: "Every act of kindness towards birds, animals, and nature brings immense divine mercy.",
    hadith_or_ayah_uz: "«Siz yer yuzidagilarga rahm qiling, osmondagilar ham sizga rahm qilsin» (Termiziy)",
    hadith_or_ayah_en: "«Have mercy on those on the earth, and the One in the heavens will have mercy on you.» (Tirmidhi)",
    bedtime_dua_uz: "«Yo Rahmon, barcha jonzotlarga mehrli bo'lishni, tabiatni asrashni va ezgulik ulashishni nasib et!»",
    bedtime_dua_en: "«O Most Merciful, grant us gentle compassion toward all living beings and nature!»",
    keywords: ["rahm", "qushlar", "tikon", "sher", "daraxtlar", "mehr-oqibat", "suv"],
    suggested_settings: ["magical_forest", "tranquil_oasis"]
  },
  {
    id: "unity_strength_birds",
    title_uz: "Ahillik va Birlikning Qudrati",
    title_en: "The Power of Unity & Brotherhood",
    prophet_or_source: "40 Hadis Hikoyalari (Qushlar va To'r hikoyasi)",
    virtue: "Ahillik, Do'stlik va Hamjihatlik",
    core_lesson_uz: "Birgalikda, ahil bo'lib qilingan har bir ezgu ish oson kechadi. Do'stlik va birdamlik har qanday to'siqni yengadi.",
    core_lesson_en: "When hearts unite for good, every obstacle turns into victory. Unity brings divine strength.",
    hadith_or_ayah_uz: "«Bir-biringizdan ayrilmanglar, ahil bo'linglar; Allohning yordami jamoat bilandir» (Nasoiy)",
    hadith_or_ayah_en: "«Stay united, for indeed Allah's help is with the united community.» (Nasai)",
    bedtime_dua_uz: "«Allohim, do'stlarimiz va oilamiz bilan ahillik, tinchlik va totuvlikda yashashni nasib qil!»",
    bedtime_dua_en: "«O Allah, bless our family and friends with lifelong harmony, love, and peaceful unity!»",
    keywords: ["ahillik", "birlik", "do'stlik", "qushlar", "hamkorlik", "kuch"],
    suggested_settings: ["magical_forest", "ancient_city"]
  },
  {
    id: "angels_good_deeds",
    title_uz: "Farishtalar va Ezgu Amallar",
    title_en: "Angels and the Light of Good Deeds",
    prophet_or_source: "Farishtalar haqida bilaman & Jajji musulmon aqidasi",
    virtue: "Halollik, Tozalik va Yaxshi Amallar",
    core_lesson_uz: "Har bir yaxshi so'z, tabassum va yordam farishtalar tomonidan nurli daftarga yoziladi. Yaxshilik hech qachon unutilmaydi.",
    core_lesson_en: "Every kind smile, gentle word, and helpful act is lovingly recorded by noble angels.",
    hadith_or_ayah_uz: "«Albatta, sizlarning ustingizda kuzatuvchi muhtaram kotib farishtalar bordir» (Infitar: 10-11)",
    hadith_or_ayah_en: "«And indeed, over you are noble scribes recording your good deeds.» (82:10-11)",
    bedtime_dua_uz: "«Allohim, tilimizni shirin, qalbimizni pok, amallarimizni farishtalar havas qiladigan darajada go'zal ayla!»",
    bedtime_dua_en: "«O Allah, keep our words pure, our hearts luminous, and our deeds beloved to the angels!»",
    keywords: ["farishtalar", "nur", "kiroman kotibin", "yaxshilik", "tabassum", "savob"],
    suggested_settings: ["starry_galaxy", "magical_forest"]
  }
];

export function getWisdomByTheme(themeKey?: string): IslamicWisdomTheme {
  if (!themeKey) return ISLAMIC_WISDOM_KNOWLEDGE_BASE[0];
  const found = ISLAMIC_WISDOM_KNOWLEDGE_BASE.find(t => t.id === themeKey || t.keywords.includes(themeKey.toLowerCase()));
  return found || ISLAMIC_WISDOM_KNOWLEDGE_BASE[0];
}
