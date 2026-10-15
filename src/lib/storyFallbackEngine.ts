import { ChildProfile, StoryBook, StoryPage } from './types';
import { ISLAMIC_STORY_ARCHETYPES, StoryArchetype } from './islamicLiteraryKnowledge';

export function getMatchingArchetype(goal?: string, context?: string): StoryArchetype {
  const normGoal = (goal || '').toLowerCase().trim();
  const normContext = (context || '').toLowerCase().trim();

  if (normContext === 'adventure' || normGoal.includes('adventure') || normGoal.includes('sarguzasht') || normGoal.includes('courage')) {
    const foundAdv = ISLAMIC_STORY_ARCHETYPES.find(a => a.id === 'nature_adventure' || a.id === 'caravan_discovery');
    if (foundAdv) return foundAdv;
  }
  if (normContext === 'nature' || normGoal.includes('nature') || normGoal.includes('tabiat')) {
    const foundNature = ISLAMIC_STORY_ARCHETYPES.find(a => a.id === 'nature_adventure');
    if (foundNature) return foundNature;
  }

  const found = ISLAMIC_STORY_ARCHETYPES.find(a => 
    a.matched_goals.some(mg => normGoal.includes(mg) || mg.includes(normGoal))
  );
  return found || ISLAMIC_STORY_ARCHETYPES[1]; // Default to kindness
}

interface PageTemplate {
  uz: string;
  en: string;
  sceneSummary: string;
  actionPrompt: string;
}

export function generateDynamicIslamicStory(
  profile: ChildProfile,
  masterAnchor: string,
  stylePrompt: string,
  negativeEnhancers: string
): StoryBook {
  const childName = profile.child_name || 'Farzandimiz';
  const isBoy = profile.gender === 'boy';
  const age = profile.age || 6;
  const color = profile.favorite_color || 'zumrad yashil va iliq tilla rang';
  const targetPageCount = Math.min(Math.max(Number(profile.page_count) || 6, 4), 10);
  const archetype = getMatchingArchetype(profile.parent_goal, profile.reading_time_context);
  const storyId = `story-${Date.now()}-${childName.toLowerCase().replace(/\s+/g, '-')}`;

  let templates: PageTemplate[] = [];

  if (archetype.id === 'food_gratitude') {
    templates = [
      {
        uz: `Shom quyoshi ufqqa bosh qo'yib, xonadon derazalariga iliq tillarang nurlarini taratar edi. ${childName} xonada chiroyli kitob varoqlab o'tirarkan, oshxonadan yangi pishgan issiq taomning yoqimli hidi taraldi. Onajonisi jilmayib dasturxonga chorladi.`,
        en: `As the warm twilight sun set, casting golden hues through the windows, ${childName} was reading a lovely picture book when the comforting aroma of a home-cooked meal called them to the dinner table.`,
        sceneSummary: `${childName}ning oqshomgi xursandchiligi va oshxona fayzi`,
        actionPrompt: `${masterAnchor}, sitting pleasantly on a cozy patterned floor rug near the window reading an open illustrated book, warm sunset glow casting amber light, traditional clean Uzbek home with wooden details`
      },
      {
        uz: `Dasturxonga kechagi mazali sho'rva va issiq non tortildi. Ammo ${childName} qoshlarini biroz chimirib: "Onajon, men kechagi taomni yegim kelmayapti. Menga yangi shirinlik yoki boshqa narsa pishirib bering", deb erkalik qildi.`,
        en: `Mother served a warm soup and fresh bread. But ${childName} frowned slightly, asking for a new sweet treat instead of the wholesome meal already prepared.`,
        sceneSummary: `Dasturxondagi injiqlik va kechagi taom masalasi`,
        actionPrompt: `${masterAnchor}, sitting at a low wooden dining table with a steaming ceramic bowl of soup, looking momentarily hesitant and pouting innocently, loving mother in modest pastel hijab looking gently`
      },
      {
        uz: `Onasi ${childName}ning mayin qo'llaridan mehr bilan ushlab, ko'zlariga boqdi: "Ko'zimning oqi, bilasanmi, dunyoda qancha bolalar bir burda qotgan nonga ham zor bo'lib yashashadi. Payg'ambarimiz sallallohu alayhi vasallam hech qachon dasturxondagi taomni ayblamaganlar. Har bir luqma — Robbimizning bizga yuborgan ulug' omonati va barakasidir", dedilar.`,
        en: `Mother held ${childName}'s hand gently: "My darling, many children in the world yearn for a single bite of bread. Our Prophet (pbuh) never criticized food; every bite is Allah's precious blessing."`,
        sceneSummary: `Onaning mehr to'la o'giti va Payg'ambarimiz sunnatlari`,
        actionPrompt: `${masterAnchor}, sitting attentively beside loving mother who is holding hands gently and speaking with immense warmth and tenderness, warm ambient dining room light`
      },
      {
        uz: `Onasining bu samimiy so'zlari ${childName}ning mitti yuragiga yetib bordi. U o'zining noo'rin injiqligidan qattiq xijolat bo'ldi. O'sha onda u ochlikda qiynalayotgan bolalarni va ota-onasining mehnatini chuqur his qildi: "Meni kechiring, onajon! Men xatoyimni tushundim. Har bir luqmaga shukr qilaman", dedi.`,
        en: `Mother's gentle wisdom deeply touched ${childName}'s heart. Realizing the immense blessing of food and thinking of needy children, they softly apologized with sincere gratitude.`,
        sceneSummary: `${childName}ning xatosini anglab yetishi va samimiy uzri`,
        actionPrompt: `${masterAnchor}, with sparkling remorseful yet enlightened eyes, softly smiling and leaning affectionately into mother's embrace, feeling immense love and respect`
      },
      {
        uz: `${childName} qo'llarini ko'ksiga qo'yib, xushovozlik bilan: "Bismillahir Rohmanir Rohiym!" dedi-da, taomdan bir qoshiq ichdi. Mo'jizadek tuyuldi — taom shu qadar totli va xushbo'y ediki, ${childName} uning har bir luqmasidan huzur oldi va onasining yuzidan o'pib: "Alhamdulillah, dunyodagi eng mazzali taom ekan!" dedi.`,
        en: `Saying 'Bismillah', ${childName} tasted the soup. It tasted miraculously delicious. With a shining smile, they hugged mother saying 'Alhamdulillah, this is truly delicious!'`,
        sceneSummary: `Bismillah bilan boshlangan taom va shukrona lazzati`,
        actionPrompt: `${masterAnchor}, happily eating from a colorful ceramic bowl with a spoon, joyful bright radiant smile, mother smiling proudly beside table`
      },
      {
        uz: `Taomdan so'ng ${childName} onasiga dasturxonni yig'ishtirishda yordamlashdi. Ota-onasi uning odobidan quvonib, boshini siladilar: "Alloh senga ikki dunyo saodatini bersin, qobil bolam!" deya duo qildilar. Xonadonga maloikalar qanot qoqib, beqiyos fayz va baraka yog'ildi.`,
        en: `After dinner, ${childName} politely helped clear the table. Parents blessed their well-mannered child with loving prayers, filling the home with angelic peace and barakah.`,
        sceneSummary: `Dasturxonga xizmat va ota-ona fotihasi`,
        actionPrompt: `${masterAnchor}, carrying a neat small tray helping mother, proud beaming face, warm glowing home interior with soft Persian rug and ambient lantern light`
      },
      {
        uz: `Oqshom tushib, xona derazasidan yarim oy va miltillagan yulduzlar ko'rina boshladi. ${childName} toza kiyimlarini kiyib, jajji kaftlarini ochdi: "Ey saxiy Robbim! Menga bergan shirin rizqlaring uchun shukr. Dunyodagi barcha muhtoj bolalarga ham qorinlarini to'ydiradigan ne'matlar bergin. Omin!", deya yuziga fotiha tortdi.`,
        en: `As the crescent moon illuminated the sky, ${childName} cupped little hands in heartfelt bedtime prayer, thanking Allah for the nourishment and praying for needy children everywhere.`,
        sceneSummary: `${childName}ning shukrona va muhtojlar haqqiga duosi`,
        actionPrompt: `${masterAnchor}, kneeling peacefully on a soft emerald prayer mat with open cupped hands making sincere Dua, soft moonlight through window, serene spiritual bedtime ambiance`
      },
      {
        uz: `${childName} yostig'iga bosh qo'yar ekan, qalbida cheksiz halovat va qanoat his qildi. U endi aslo taom tanlamaslikka, har bir luqmani e'zozlashga ahd qildi. Shirin tushlar og'ushida, farishtalar himoyasida orom oldi. Xayrli tun, shukr qiluvchi aziz ${childName}!`,
        en: `Resting on soft pillows with a peaceful heart, ${childName} promised never to complain about food again, drifting into deep sweet sleep under the protection of angels.`,
        sceneSummary: `Shukr ila orom olgan shirin uyqu`,
        actionPrompt: `${masterAnchor}, sleeping peacefully in a comfortable bed under a soft quilt, gentle innocent smile, soft nightlight glow, peaceful atmosphere`
      }
    ];
  } else if (archetype.id === 'tidiness_sharing') {
    templates = [
      {
        uz: `${childName}ning xonasi ajoyib kitoblar, rang-barang kubiklar va o'yinchoqlar bilan to'la edi. U gilam ustida chiroyli minoralar qurar, kitoblarini tartiblamasdan quvnoq o'ynab o'tirardi.`,
        en: `${childName}'s room was filled with colorful toy blocks, puzzles, and storybooks. They spent the afternoon building grand towers on the soft carpet.`,
        sceneSummary: `${childName}ning o'yinchoqlar bilan to'la xonasi`,
        actionPrompt: `${masterAnchor}, sitting cross-legged on a patterned carpet surrounded by colorful wooden toy blocks and books, holding a toy happily, bright room with sunlight`
      },
      {
        uz: `Biroq o'yin tugagach, butun xona ostin-ustun bo'lib yotardi. Onasi eshikdan mo'ralab: "${childName}jon, o'ynab bo'lganingdan so'ng buyumlaringni sandiqqa yig'ishtirib qo'ygin", dedi. Ammo ${childName} erinib: "Ertaga yig'aman, bugun charchadim", deya joyiga yotib oldi.`,
        en: `When playtime ended, things were scattered all over the floor. Mother gently reminded them to tidy up, but ${childName} felt too lazy, saying they would clean it tomorrow instead.`,
        sceneSummary: `Betartib xona va bolaning erinchoqligi`,
        actionPrompt: `${masterAnchor}, climbing into bed with toys still scattered messily across the bedroom rug, looking sleepy and hesitant, mother standing at the doorway with a gentle caring expression`
      },
      {
        uz: `Shu kecha ${childName} ajoyib bir tush ko'rdi. Tushida uning sevimli o'yinchoqlari va chiroyli kiyimlari g'amgin bo'lib, xonadan chiqib ketishayotgan emish. Ular: "Egamiz bizni asramadi, burchaklarda tashlab qo'ydi. Biz endi bu yerda qolmaymiz", deyishardi. ${childName} tushida qo'rquv bilan uyg'onib ketdi: "Hayriyat, bu tushim ekan!"`,
        en: `That night ${childName} had a vivid dream: the neglected toys were sadly packing up to leave because they were left uncared for. ${childName} woke up with a start, relieved it was only a dream.`,
        sceneSummary: `Ibratli tush va xafa bo'lgan o'yinchoqlar nidosi`,
        actionPrompt: `${masterAnchor}, sitting up in bed in soft pajamas with wide surprised eyes, morning sunlight streaming in, looking around the room at the scattered toys with sudden realization`
      },
      {
        uz: `${childName} darhol o'rnidan turib, mehr bilan har bir o'yinchoqni artib, chiroyli qilib javonlarga terib qo'ydi. Xona ko'z ochib yumguncha ozoda va sarishta bo'lib qoldi. Onasi kirib kelib, bu go'zal tartibni ko'rgach, cheksiz quvondi.`,
        en: `Quickly getting out of bed, ${childName} lovingly picked up every single toy, neatly placing them into organizers and shelves until the whole room sparkled with cleanliness.`,
        sceneSummary: `Tezkor saranjomlik va xonadagi pokiza tartib`,
        actionPrompt: `${masterAnchor}, happily carrying a clear storage box filled with neat toys and books, organizing wooden shelves with an energetic joyful smile, sunlit bright clean bedroom`
      },
      {
        uz: `Onasi ${childName}ning peshonasidan mehr bilan o'pdi: "Bilasanmi, Payg'ambarimiz sallallohu alayhi vasallam: «Poklik iymondandir» deganlar. Lekin o'yinchoqlarning haddan tashqari ko'p bo'lib har yerda yotishi isrofga olib keladi. Kel, o'zing kam o'ynaydigan o'yinchoqlaringni va ortiqcha kiyimlaringni mahallamizdagi muhtoj yetim bolalarga hadya qilamiz", dedi.`,
        en: `Mother kissed their forehead warmly: "Cleanliness is half of faith. But keeping too many unused things is waste. Let's gather toys and clothes you rarely use and gift them to orphans in need."`,
        sceneSummary: `Onaning isrof va saxovat haqidagi hikmatli darsi`,
        actionPrompt: `${masterAnchor}, sitting beside mother holding a large cardboard box labeled for donation, packing colorful clothes and toys together with deep compassion and understanding`
      },
      {
        uz: `${childName} xursand bo'lib, o'zi yaxshi ko'rgan bir nechta eng chiroyli buyumlari va kiyimlarini alohida chiroyli qutiga joyladi. Ular mahalladagi kamtargina xonadonga borib, dadasi vafot etgan jajji bolakayga ushbu hadyalarni ulashdilar. U bolakayning ko'zlaridagi quvonchni ko'rib, ${childName}ning qalbi iliq nurlarga to'ldi.`,
        en: `With a generous heart, ${childName} picked their best items and gifted them to a fatherless child nearby. Seeing the orphan boy's eyes light up with immense joy filled ${childName} with radiant bliss.`,
        sceneSummary: `Muhtoj bolaga hadya ulashish va saxovat quvonchi`,
        actionPrompt: `${masterAnchor}, handing a beautifully wrapped gift box to a smiling humble neighbor child, both smiling warmly outside a modest courtyard house, beautiful golden sunshine`
      },
      {
        uz: `Uyga qaytayotganda ${childName} onasining qo'lidan tutib: "Oyijon, birovga yaxshilik qilish qanchalar shirin bo'larkan! Endi ortiqcha narsalar olib bering deb xarxasha qilmayman, boriga shukr qilib, boshqalar bilan baham ko'raman", dedi. Onasi unga faxr bilan boqdi.`,
        en: `Walking home hand-in-hand, ${childName} said: "Sharing brings the greatest joy! I will always keep my room neat, appreciate what I have, and share with those who have less."`,
        sceneSummary: `Qalb saxovati va o'zgarish xulosasi`,
        actionPrompt: `${masterAnchor}, walking happily hand in hand with mother along a peaceful street, smiling up lovingly, heartwarming sunset atmosphere`
      },
      {
        uz: `Kechqurun ${childName} xotirjam qalb bilan joynamoz ustiga tiz cho'kib duo qildi: "Yo Robbim! Qo'limni saxiy, qalbimni pokiza ayla. Ota-onamni jannat bog'larida siyla. Omin!". So'ng shirin tushlar ko'rib, farishtalar panohida orom oldi.`,
        en: `That evening, ${childName} made heartfelt prayer thanking Allah for generosity and clean manners, drifting into deep, peaceful sleep under angelic protection.`,
        sceneSummary: `Pokiza xonadagi sokin va barakali uyqu`,
        actionPrompt: `${masterAnchor}, sleeping peacefully under a cozy clean blanket in an immaculately organized bedroom, gentle moonbeams through window, pure tranquility`
      }
    ];
  } else if (archetype.id === 'nature_adventure' || archetype.id === 'caravan_discovery') {
    templates = [
      {
        uz: `Quyosh charaqlab, bahoriy mayin shabada esib turgan ajoyib kun edi. ${childName} dadasi bilan birga yam-yashil daraxtzor va gullagan bog' bo'ylab qiziqarli kashfiyot sayohatiga otlandi. Bog'da qushlar sayrar, gullar ifori anqir edi.`,
        en: `It was a glorious sunlit day with a gentle spring breeze. ${childName} set out on an exciting nature discovery walk with father through a lush blooming garden and wooded path.`,
        sceneSummary: `Quyoshli kunda bog' bo'ylab kashfiyot sayohati`,
        actionPrompt: `${masterAnchor}, happily walking along a flower-lined garden path holding hands with smiling father, sunny golden daylight, blooming apricot trees and green hills`
      },
      {
        uz: `Qadimiy tut daraxti yonidan o'tayotganda, ${childName} maysalar orasida mitti qanotlari pirpirab turgan jajji qushchani payqab qoldi. Qushchaning oyog'i nozik novdaga o'ralib, ucholmay qolgan, mitti ko'zchalari bilan najot kutardi.`,
        en: `Passing an old mulberry tree, ${childName} noticed a tiny songbird fluttering helplessly in the tall grass, its little wing tangled in a twig, looking up with fragile hopeful eyes.`,
        sceneSummary: `Maysalar orasidagi mitti yarador qushcha`,
        actionPrompt: `${masterAnchor}, kneeling gently on the soft grass looking with compassionate wide eyes at a tiny fluffy injured bird, father kneeling beside encouragingly`
      },
      {
        uz: `${childName} darhol to'xtab, unga mehr bilan qaradi: "Dadajon, bu qushchaga qanday yordam bersak bo'ladi?", deb so'radi. Dadasi qizining/o'g'lining mehr to'la nigohiga boqib: "Payg'ambarimiz sallallohu alayhi vasallam: «Yer yuzidagilarga rahm qiling, toki osmondagilar ham sizga rahm qilsin» deganlar. Jonivorlarga mehr ko'rsatish — ulug' ezgulikdir", dedilar.`,
        en: `${childName} gently asked how to help. Father smiled warmly: "Our Prophet (pbuh) taught that showing mercy to all living beings brings divine mercy upon us. Helping this fragile creature is a noble deed."`,
        sceneSummary: `Dadasining jonivorlarga shafqat haqidagi sabog'i`,
        actionPrompt: `${masterAnchor}, holding the tiny bird with utmost tenderness in soft cupped hands, loving father smiling proudly, warm sunny garden ambiance`
      },
      {
        uz: `Ular darhol ustaxonaga oshiqdilar. Dadasi bilan birgalikda toza silliq taxtalardan jajji yog'och in yasadilar. ${childName} qush uyasining ichiga yumshoq quruq o'tlar to'shadi va unga mayda donlar hamda toza suv qo'ydi.`,
        en: `Together they crafted a lovely wooden bird shelter from smooth planks. ${childName} lined it with soft hay, fresh water, and scattered nourishing seeds with immense care.`,
        sceneSummary: `Mitti qushcha uchun chiroyli yog'och in yasash`,
        actionPrompt: `${masterAnchor}, happily painting and assembling a small wooden birdhouse on an outdoor workbench with father, bright natural daylight, sawdust and colorful tools`
      },
      {
        uz: `Ular mitti qushchaning qanotini ohista ozod qilib, jarohatini ehtiyotkorlik bilan davoladilar. Qushcha qornini to'ydirib, toza suvdan ichgach, ko'zlari chaqnab, kutilmaganda quvnoq ohangda chug'urlay boshladi!`,
        en: `Gently freeing its wing, they tended to the little bird. Nourished with water and seeds, the bird perked up, chirping a cheerful melodious tune as if saying thank you!`,
        sceneSummary: `Qushchaning shifo topishi va quvonchli chug'urlashi`,
        actionPrompt: `${masterAnchor}, smiling radiantly as the healed little bird sits comfortably on their finger, sparkling eyes, glowing sunbeams through leaves`
      },
      {
        uz: `Qushcha qanotlarini keng yozib, moviy osmon bag'riga baland parvoz qildi. U ${childName}ning boshi uzra bir necha bor aylanib, minnatdorchilik bildirgandek sayradi. ${childName} quvonchdan sakrab: "Biz uddaladik! U sog'ayib ketdi!", deya dadasining qo'liga chapak urdi.`,
        en: `Spreading wings, the bird soared into the bright blue sky, circling gratefully overhead before flying into the tree canopy. Overjoyed, ${childName} jumped with happiness, high-fiving father!`,
        sceneSummary: `Moviy osmonga parvoz va g'alaba quvonchi`,
        actionPrompt: `${masterAnchor}, with arms raised enthusiastically looking up at the bird soaring into the clear blue sky, laughing joyfully with father, open sunny meadow`
      },
      {
        uz: `Uyga qaytishgach, ${childName} yuzida yorug' tabassum bilan onajonisi va buvijonisiga bugungi qahramonlik sarguzashtini aytib berdi. Buvijonisi quvonchdan nabirasining peshonasidan o'pdi: "Barakalla, mitti qutqaruvchim! Qalbingdagi mehr doimo charaqlab tursin", dedi.`,
        en: `Returning home with glowing smiles, ${childName} excitedly recounted the heroic adventure to mother and grandmother. Grandmother kissed their forehead with immense love and pride.`,
        sceneSummary: `Oilaviy faxr va onajonning iliq quchog'i`,
        actionPrompt: `${masterAnchor}, being warmly hugged by mother and grandmother in a sunny Uzbek courtyard with tea and sweets on a tapchan, radiant happy faces`
      },
      {
        uz: `Dasturxon atrofida jam bo'lgan oila a'zolari birgalikda kaftlarini ochdilar: "Yo Rahmli Allohim! Bizni barcha jonzotlarga mehr-shafqatli, yurtimizga va oilamizga foydali farzandlardan qilgin. Omin!", deya yuzlariga fotiha tortdilar. Bugungi sarguzasht ${childName}ning qalbida o'chmas ezgulik nuri bo'lib qoldi!`,
        en: `Gathered together, the family raised hands in joyful gratitude: "O Allah, grant us compassionate hearts to bring mercy and kindness everywhere. Ameen!" The adventure became a cherished memory of noble deeds.`,
        sceneSummary: `Shukrona duosi va ezgu sarguzasht yakuni`,
        actionPrompt: `${masterAnchor}, sitting with loving family around a tea table with open cupped hands making heartfelt Dua, pure joy and warm golden sunshine filling the courtyard`
      }
    ];
  } else {
    // Default: Kindness to Grandparents, Elders & Quranic Family Guidance
    templates = [
      {
        uz: `Fayzli oqshom pallasi edi. Xonadonda sokin va iliq muhit hukm surar, pechdan issiq non va rayhon ifori taralardi. ${childName} xonada o'z yumushlari bilan mashg'ul bo'lib o'tirarkan, so'rida o'tirgan nuroniy buvijonisi asta yo'talib qo'ydi.`,
        en: `It was a peaceful blessed evening. The home was warm with the scent of basil and fresh bread. As ${childName} sat engaged in their tasks, their dear grandmother softly coughed from the low seating area.`,
        sceneSummary: `Oqshomgi xonadon fayzi va buvijonning huzuri`,
        actionPrompt: `${masterAnchor}, sitting respectfully in a warm traditional Uzbek living room with oriental carpet, soft glowing lamp, elderly grandmother wearing a modest white scarf seated gently on cushions`
      },
      {
        uz: `Buvijonisi mehribon nigoh bilan nabirasiga boqib: "${childName}jon, ko'zimning nuri, menga bir piyola issiq damlama quyib bera olasanmi, oyog'im biroz zirqirab turibdi", deb iltimos qildi. Ammo ${childName} o'ynayotgan narsasidan ajralgisi kelmay: "Hozir, buvijon, yana ozgina o'ynab olay", deya biroz paysalga soldi.`,
        en: `Grandmother smiled gently: "${childName}, light of my eyes, could you pour me a warm cup of herbal tea? My legs feel a bit tired today." But ${childName}, absorbed in play, hesitated, asking to play a little longer.`,
        sceneSummary: `Buvijonning iltimosi va bolaning biroz erinishi`,
        actionPrompt: `${masterAnchor}, looking momentarily torn between a colorful puzzle and grandmother, grandmother smiling patiently with loving wrinkled face`
      },
      {
        uz: `Shu payt xonaga kirib kelgan dadasi ${childName}ning yoniga o'tirdi va mehr bilan qo'lidan tutdi: "Qobil bolam, bilasanmi, Payg'ambarimiz sallallohu alayhi vasallam: «Kattalarimizni hurmat qilmagan, kichiklarimizga shafqat ko'rsatmagan bizdan emasdir», deb o'rgatganlar. Oila kattalariga qilingan xizmat — eng ulug' ibodatlardandir", dedilar.`,
        en: `Father entered, sat beside ${childName}, and gently taught: "My child, the Prophet (pbuh) said: 'He is not of us who does not respect our elders and show mercy to our young.' Serving our grandparents is one of the highest virtues."`,
        sceneSummary: `Dadasining ibratli nasihati va Sunnat o'giti`,
        actionPrompt: `${masterAnchor}, looking attentively at loving father who has a gentle encouraging hand on child's shoulder, atmosphere of deep spiritual warmth and respect`
      },
      {
        uz: `Dadasining bu o'giti ${childName}ning qalbini larzaga soldi. U buvijonisining yoshligidan buyon oilasi uchun qilgan cheksiz zahmatlarini, unga aytib bergan ibratli ertaklarini esladi. Uning ko'zlaridan yosh qalqib chiqdi: "Meni kechiring, buvijon! Sizga xizmat qilish — mening eng katta baxtim-ku!", dedi.`,
        en: `Father's words resonated deeply. Remembering grandmother's lifelong sacrifices and loving bedtime stories, tears of realization welled in ${childName}'s eyes as they hurried to apologize.`,
        sceneSummary: `${childName}ning qalbiy uyg'onishi va xatosini tushunishi`,
        actionPrompt: `${masterAnchor}, with eyes full of tenderness and realization, quickly getting up with sincere love and devotion on their face`
      },
      {
        uz: `${childName} darhol oshxonaga oshiqdi. Chinni choynakda xushbo'y tog' giyohlari bilan choy damlab, piyolaga quyib olib keldi. Buvijonisining oyog'iga issiq jun paypog'ini kiydirib, ustiga yumshoq ko'rpa yopdi va uning qo'llaridan ehtirom bilan o'pdi.`,
        en: `${childName} rushed to brew fresh fragrant tea in an ornate porcelain teapot, carefully carried it to grandmother, wrapped her feet in warm woolen socks and a soft quilt, and kissed her hands with utmost respect.`,
        sceneSummary: `Buvijonga mehr bilan xizmat qilish`,
        actionPrompt: `${masterAnchor}, kneeling respectfully offering a steaming traditional tea bowl in both hands to smiling grandmother, grandmother's eyes shining with deep gratitude and love`
      },
      {
        uz: `Buvijonisining quvonchdan yuzlari charaqlab ketdi. U nabirasining boshini silab, kaftlarini duoga ochdi: "Allohim! Ushbu aqlli zurriyotimni ikki dunyoda aziz qilgin, qalbini Qur'on nuri bilan to'ldirgin, har qadamiga farishtalar hamroh bo'lsin. Omin!", deya uzoq duo qildi.`,
        en: `Grandmother's face lit up with radiant joy. Stroking the child's head, she raised cupped hands in prolonged heartfelt blessings, praying for ${childName}'s success, faith, and happiness in both worlds.`,
        sceneSummary: `Buvijonning oq fotihasi va barakali duosi`,
        actionPrompt: `${masterAnchor}, sitting closely beside grandmother who is making Dua with raised hands, soft golden ambient light bathing them both in serenity and divine peace`
      },
      {
        uz: `Azon yangradi. ${childName} dadasi bilan birgalikda tahorat olib, joynamoz ustiga turdilar. Buvijonisi ham ularning ortidan namozga iqtido qildi. Xonadonga maloikalar yog'ilib, butun uyni ajib bir sakinat va qut-baraka qamrab oldi.`,
        en: `The evening Adhan called. ${childName} performed ablution alongside father, and they stood in prayer together while grandmother joined from behind. Angelic serenity filled the blessed home.`,
        sceneSummary: `Oilaviy namoz va maloikalar sakinatlari`,
        actionPrompt: `${masterAnchor}, standing respectfully on an embroidered green prayer rug in prayer posture beside father, peaceful serene expression, soft glowing lantern light`
      },
      {
        uz: `Namozdan so'ng ${childName} o'rniga yotar ekan, qalbida beqiyos halovat his qildi. U endi har kuni buvijonisi va ota-onasining duolarini olishga, ularning ko'ngliga quvonch ulashishga ahd qildi. Shirin tushlar og'ushida, farishtalar panohida orom oldi. Xayrli tun, aziz ${childName}!`,
        en: `Tucking into bed with a heart full of light, ${childName} resolved to always bring joy to grandparents and parents, falling asleep in divine tranquility under the protection of angels.`,
        sceneSummary: `Iymon nuri bilan yo'g'rilgan shirin uyqu`,
        actionPrompt: `${masterAnchor}, sleeping peacefully under a warm quilt with a sweet innocent smile, moonlight softly filtering through curtain, ultimate peace and calm`
      }
    ];
  }

  const selectedPages: StoryPage[] = templates.slice(0, targetPageCount).map((t, idx) => {
    return {
      page_number: idx + 1,
      text_uz: t.uz,
      text_en: t.en,
      image_prompt: t.actionPrompt,
      image_url: `/api/story-image?storyId=${encodeURIComponent(storyId)}&page=${idx + 1}&prompt=${encodeURIComponent(t.actionPrompt)}&style=${encodeURIComponent(profile.illustration_style || 'pixar_3d')}&gender=${encodeURIComponent(profile.gender || 'girl')}`,
      scene_summary: t.sceneSummary
    };
  });

  const coverPrompt = `${masterAnchor}, smiling radiantly with loving family in cozy warm glowing ${color} room, soft ambient sunlight, title banner, crisp clean children picturebook illustration, masterpiece`;

  return {
    id: storyId,
    created_at: new Date().toISOString(),
    child_profile: profile,
    title_uz: `${childName} va Nurli Hikmat Sayohati`,
    title_en: `${childName} and the Radiant Tale of Wisdom`,
    prologue_uz: `Farzandimiz — ${childName}ning Islomiy odoblar, kattalarga hurmat va ezgulik bilan yo'g'rilgan nurli oqshom qissasi...`,
    prologue_en: `A heartwarming bedtime journey of young ${childName} discovering the profound beauty of noble Islamic character and deeds...`,
    cover_image_url: `/api/story-image?storyId=${encodeURIComponent(storyId)}&page=0&prompt=${encodeURIComponent(coverPrompt)}&style=${encodeURIComponent(profile.illustration_style || 'pixar_3d')}&gender=${encodeURIComponent(profile.gender || 'girl')}`,
    theme_color: isBoy ? "#013E37" : "#D97706",
    pages: selectedPages,
    reflection: {
      todays_lesson_uz: archetype.inner_realization,
      todays_lesson_en: "Practicing sincere mercy, gratitude, and good deeds brings eternal light to our hearts.",
      hadith_sharif_uz: archetype.hadith_sharif_uz,
      hadith_sharif_en: archetype.hadith_sharif_en,
      little_dua_uz: archetype.dua_uz,
      little_dua_en: "O Allah! Bless our home with peace, grant us grateful hearts, and protect our beloved parents. Ameen!",
      arabic_dua: archetype.dua_arabic,
      discussion_questions_uz: [
        `${childName} bugungi qissada qanday ibratli fazilatni namoyon etdi?`,
        `Payg'ambarimiz sallallohu alayhi vasallam bunday vaziyatda qanday yo'l tutishni o'rgatganlar?`,
        `Bugun sen qaysi yaxshi amaling bilan Allohni va ota-onangni xursand qilding?`
      ],
      discussion_questions_en: [
        `What noble lesson did ${childName} learn today?`,
        `How did the Prophet (pbuh) guide us to act in such moments?`,
        `What good deed will you do tomorrow to please Allah and your parents?`
      ],
      good_deed_task_uz: `Ertaga ertalab ota-onangizga shirin tabassum bilan "Assalomu alaykum!" deng va ularga bir yaxshilik qiling.`,
      good_deed_task_en: `Greet your parents tomorrow morning with a bright smile saying "Assalamu Alaykum!" and help them.`
    },
    quiz: [
      {
        id: 'q1',
        question_uz: `Qissada ${childName} qanday muhim xulosaga keldi?`,
        question_en: `What important realization did ${childName} reach?`,
        options: [
          { id: 'o1', text_uz: 'Kichik bo\'lsa ham har bir yaxshilik ulug\' savob keltirishini bildi', text_en: 'Even the smallest good deed brings immense reward', isCorrect: true },
          { id: 'o2', text_uz: 'Faqat o\'zi haqida o\'ylash kerak deb bildi', text_en: 'That one should only think about oneself', isCorrect: false },
          { id: 'o3', text_uz: 'O\'yinchoqlarni yig\'ishtirmaslik kerak deb o\'yladi', text_en: 'That toys should never be tidied', isCorrect: false }
        ],
        explanation_uz: `Payg'ambarimiz sallallohu alayhi vasallam doimo yaxshilik qilishga va shukrli bo'lishga chaqirganlar.`,
        explanation_en: `The Prophet (pbuh) always encouraged continuous kindness and gratitude.`
      }
    ]
  };
}
