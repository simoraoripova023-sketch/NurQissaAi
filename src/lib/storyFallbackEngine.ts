import { ChildProfile, StoryBook, StoryPage } from './types';
import { ISLAMIC_STORY_ARCHETYPES, StoryArchetype } from './islamicLiteraryKnowledge';

export function getMatchingArchetype(goal?: string): StoryArchetype {
  const normGoal = (goal || '').toLowerCase().trim();
  const found = ISLAMIC_STORY_ARCHETYPES.find(a => 
    a.matched_goals.some(mg => normGoal.includes(mg) || mg.includes(normGoal))
  );
  return found || ISLAMIC_STORY_ARCHETYPES[1]; // Default to mercy to animals / kindness
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
  const animal = profile.favorite_animal || (isBoy ? 'oq kabutar' : 'mitti quyoncha');
  const color = profile.favorite_color || 'zumrad yashil va iliq tilla rang';
  const targetPageCount = Math.min(Math.max(Number(profile.page_count) || 6, 4), 10);
  const archetype = getMatchingArchetype(profile.parent_goal);
  const storyId = `story-${Date.now()}-${childName.toLowerCase().replace(/\s+/g, '-')}`;

  let templates: PageTemplate[] = [];

  if (archetype.id === 'food_gratitude') {
    templates = [
      {
        uz: `Shom quyoshi ufqqa bosh qo'yib, xonadon derazalariga iliq tillarang nurlarini taratar edi. ${childName} o'zining suyukli ${animal}i bilan xonada o'ynab o'tirarkan, oshxonadan yangi pishgan issiq taomning yoqimli hidi taraldi. Onajonisi jilmayib dasturxonga chorladi.`,
        en: `As the warm twilight sun set, casting golden hues through the windows, ${childName} played with their beloved ${animal} when the comforting aroma of a home-cooked meal called them to the dinner table.`,
        sceneSummary: `${childName}ning oqshomgi xursandchiligi va oshxona fayzi`,
        actionPrompt: `${masterAnchor}, sitting pleasantly on a cozy patterned floor rug near the window with beloved companion ${animal}, warm sunset glow casting amber light, traditional clean Uzbek home with wooden details`
      },
      {
        uz: `Dasturxonga kechagi mazali sho'rva va issiq non tortildi. Ammo ${childName} qoshlarini biroz chimirib: "Onajon, men kechagi taomni yegim kelmayapti. Menga yangi shirinlik yoki boshqa narsa pishirib bering", deb erkalik qildi.`,
        en: `Mother served a warm soup and fresh bread. But ${childName} frowned slightly, asking for a new sweet treat instead of the wholesome meal already prepared.`,
        sceneSummary: `Dasturxondagi injiqlik va kechagi taom masalasi`,
        actionPrompt: `${masterAnchor}, sitting at a low wooden dining table with a steaming ceramic bowl of soup, looking momentarily hesitant and pouting innocently, loving mother in modest pastel hijab looking gently`
      },
      {
        uz: `Onasi ${childName}ning mayin qo'llaridan mehr bilan ushlab, ko'zlariga boqdi: "Ko'zimning oqi, bilasanmi, dunyoda qancha bolalar bir burda qotgan nonga ham zor bo'lib yashashadi. Payg'ambarimiz sallallohu alayhi vasallam hech qachon dasturxondagi taomni ayblamaganlar. Har bir luqma — Robbizmizning bizga yuborgan ulug' omonati va barakasidir", dedilar.`,
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
        actionPrompt: `${masterAnchor}, happily eating from a colorful ceramic bowl with a spoon, joyful bright radiant smile, mother smiling proudly, ${animal} looking up cheerfully beside table`
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
        actionPrompt: `${masterAnchor}, sleeping peacefully in a comfortable bed under a soft quilt, gentle innocent smile, ${animal} curled up quietly by the bed, soft nightlight glow`
      }
    ];
  } else if (archetype.id === 'tidiness_sharing') {
    templates = [
      {
        uz: `${childName}ning xonasi har xil ajoyib o'yinchoqlar, rang-barang kubiklar va kitoblar bilan to'la edi. U o'zining yaxshi ko'rgan ${animal}i bilan gilam ustida baland qal'alar qurar, mashinalarni quvlab zavqlanardi.`,
        en: `${childName}'s room was filled with colorful toy blocks, cars, and storybooks. Together with beloved ${animal}, they spent the afternoon happily building grand towers on the soft carpet.`,
        sceneSummary: `${childName}ning o'yinchoqlar bilan to'la xonasi`,
        actionPrompt: `${masterAnchor}, sitting cross-legged on a patterned carpet surrounded by colorful wooden toy blocks and miniature toy cars, holding a toy happily, bright room with sunlight`
      },
      {
        uz: `Biroq o'yin tugagach, butun xona ostin-ustun bo'lib yotardi. Onasi eshikdan mo'ralab: "${childName}jon, o'ynab bo'lganingdan so'ng o'yinchoqlaringni sandiqqa yig'ishtirib qo'ygin", dedi. Ammo ${childName} erinib: "Ertaga yig'aman, bugun charchadim", deya joyiga yotib oldi.`,
        en: `When playtime ended, toys were scattered all over the floor. Mother gently reminded them to tidy up, but ${childName} felt too lazy, saying they would clean it tomorrow instead.`,
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
        actionPrompt: `${masterAnchor}, happily carrying a clear storage box filled with neat toy cars and blocks, organizing wooden shelves with an energetic joyful smile, sunlit bright clean bedroom`
      },
      {
        uz: `Onasi ${childName}ning peshonasidan mehr bilan o'pdi: "Bilasanmi, Payg'ambarimiz sallallohu alayhi vasallam: «Poklik iymondandir» deganlar. Lekin o'yinchoqlarning haddan tashqari ko'p bo'lib har yerda yotishi isrofga olib keladi. Kel, o'zing kam o'ynaydigan o'yinchoqlaringni va ortiqcha kiyimlaringni mahallamizdagi muhtoj yetim bolalarga hadya qilamiz", dedi.`,
        en: `Mother kissed their forehead warmly: "Cleanliness is half of faith. But keeping too many unused things is waste. Let's gather toys and clothes you rarely use and gift them to orphans in need."`,
        sceneSummary: `Onaning isrof va saxovat haqidagi hikmatli darsi`,
        actionPrompt: `${masterAnchor}, sitting beside mother holding a large cardboard box labeled for donation, packing colorful clothes and toys together with deep compassion and understanding`
      },
      {
        uz: `${childName} xursand bo'lib, o'zi yaxshi ko'rgan bir nechta eng chiroyli mashinasi va kiyimlarini alohida chiroyli qutiga joyladi. Ular mahalladagi kamtargina xonadonga borib, dadasi vafot etgan jajji bolakayga ushbu hadyalarni ulashdilar. U bolakayning ko'zlaridagi quvonchni ko'rib, ${childName}ning qalbi iliq nurlarga to'ldi.`,
        en: `With a generous heart, ${childName} picked their best items and gifted them to a fatherless child nearby. Seeing the orphan boy's eyes light up with immense joy filled ${childName} with radiant bliss.`,
        sceneSummary: `Muhtoj bolaga hadya ulashish va saxovat quvonchi`,
        actionPrompt: `${masterAnchor}, handing a beautifully wrapped gift box to a smiling humble neighbor child, both smiling warmly outside a modest courtyard house, beautiful golden sunshine`
      },
      {
        uz: `Uyga qaytayotganda ${childName} onasining qo'lidan tutib: "Oyijon, birovga yaxshilik qilish qanchalar shirin bo'larkan! Endi ortiqcha narsalar olib bering deb xarxasha qilmayman, boriga shukr qilib, boshqalar bilan baham ko'raman", dedi. Onasi unga faxr bilan boqdi.`,
        en: `Walking home hand-in-hand, ${childName} said: "Sharing brings the greatest joy! I will always keep my room neat, appreciate what I have, and share with those who have less."`,
        sceneSummary: `Qalb saxovati va o'zgarish xulosasi`,
        actionPrompt: `${masterAnchor}, walking happily hand in hand with mother along a peaceful street, smiling up lovingly, ${animal} trotting cheerfully along, heartwarming sunset atmosphere`
      },
      {
        uz: `Kechqurun ${childName} xotirjam qalb bilan joynamoz ustiga tiz cho'kib duo qildi: "Yo Robbim! Qo'limni saxiy, qalbimni pokiza ayla. Ota-onamni jannat bog'larida siyla. Omin!". So'ng shirin tushlar ko'rib, farishtalar panohida orom oldi.`,
        en: `That evening, ${childName} made heartfelt prayer thanking Allah for generosity and clean manners, drifting into deep, peaceful sleep under angelic protection.`,
        sceneSummary: `Pokiza xonadagi sokin va barakali uyqu`,
        actionPrompt: `${masterAnchor}, sleeping peacefully under a cozy clean blanket in an immaculately organized bedroom, gentle moonbeams through window, pure tranquility`
      }
    ];
  } else {
    // Default / Mercy to Animals archetype (Zahro / Payg'ambarimiz shafqatlari)
    templates = [
      {
        uz: `Quyosh botib, hovliga mayin shabada esar edi. ${childName} o'zining suyukli ${animal}i bilan birga yashil maysazorda quvnoq o'yinlar o'ynab o'tirardi. Atrof sokin, daraxtlar bargi mayin shivirlardi.`,
        en: `The evening breeze rustled gently through the courtyard trees as ${childName} played joyful games with their beloved ${animal} on the soft green lawn.`,
        sceneSummary: `${childName}ning oqshomgi mayin o'yini va tabiat go'zalligi`,
        actionPrompt: `${masterAnchor}, kneeling happily on lush green courtyard grass playing with cute companion ${animal}, warm golden sunset, blooming flowers and vine trellis background`
      },
      {
        uz: `Birdan uzoqdan zaif, ingroqli bir ovoz eshitildi: "Miyov... miyov...". ${childName} darhol o'yinini to'xtatdi. Qulog'ini ding qilib, ovoz kelgan yog'och so'ri tagiga sekin qaradi. Qorong'u burchakda mitti, sovuqdan qaltirab turgan nochor mushukcha o'tirardi.`,
        en: `Suddenly, a faint trembling cry broke the silence. Pausing their play, ${childName} peeked under the wooden bench and discovered a tiny, helpless kitten shivering alone in the cold.`,
        sceneSummary: `Mitti jonzotning nidosi va so'ri tagidagi kashfiyot`,
        actionPrompt: `${masterAnchor}, gently bending down looking under a traditional wooden supa bench, discovering a tiny shivering kitten with wide expressive eyes, caring gentle posture`
      },
      {
        uz: `Mushukchaning ko'zlarida cheksiz g'amginlik va qo'rquv bor edi. ${childName} unga asta yaqinlashib: "Qo'rqma mitti do'stginam, men senga zarar bermayman", deb shivirladi. Darhol oshxonaga yugurib, bir piyola iliq sut va toza suv olib chiqdi.`,
        en: `The tiny kitten looked terrified and frail. Whispering soothing words: "Don't be afraid, little one, I won't hurt you," ${childName} gently brought a warm bowl of milk and fresh water.`,
        sceneSummary: `Mehrli taskin va mitti jonzotga suv tutish`,
        actionPrompt: `${masterAnchor}, gently placing a small ceramic bowl of milk before the timid little kitten, holding open comforting hands, warm compassionate expression on face`
      },
      {
        uz: `Mushukcha avval cho'chib turdi, so'ng ochlikdan shoshib sutni icha boshladi. ${childName} onasini chaqirdi. Onasi kelib: "Ko'zimning nuri, Payg'ambarimiz sallallohu alayhi vasallam: «Yer yuzidagilarga rahm qiling, osmondagilar ham sizga rahm qilsin» deganlar. U Zot kiyiklarni, qushlarni ozod qilib, jonzotlarga mehr ko'rsatganlar. Bu mitti jon onasini yo'qotganga o'xshaydi, kel, onasini topamiz", dedilar.`,
        en: `The kitten eagerly drank the milk. Mother arrived and taught the Prophetic wisdom: "Show mercy to those on earth, and Allah will show mercy to you. Let us help this kitten find its mother."`,
        sceneSummary: `Onaning Sunnat haqidagi ta'limi va mehr sabog'i`,
        actionPrompt: `${masterAnchor}, standing beside loving mother in garden, pointing gently at the kitten, mother smiling tenderly with hand resting on child's shoulder`
      },
      {
        uz: `Ular hovlini va bog'ni aylanib qidira boshladilar. Bog' chetidagi eski omborxona ortidan katta ona mushukning bezovta miyovlagan ovozi keldi. ${childName} mitti mushukchani ehtiyotkorlik bilan ko'tarib, uning onasi yoniga olib bordi.`,
        en: `Searching through the garden, they heard an anxious mother cat calling near the garden shed. ${childName} gently carried the kitten to reunite the family.`,
        sceneSummary: `Ona mushukni qidirib topish va intizorlik`,
        actionPrompt: `${masterAnchor}, carefully cradling the small kitten in both hands walking through a sunlit courtyard garden, mother walking beside encouragingly`
      },
      {
        uz: `Mushukcha onasini ko'rib, sevinchdan uning bag'riga yugurdi. Ona mushuk bolasi boshini mehr bilan yaladi, so'ng ${childName}ga minnatdorchilik bilan qarab, oyoqlariga asta suykaldi. ${childName}ning ko'zlari quvonchdan porlab ketdi: "Allohimga shukr, topdik! Endi u yolg'iz emas!"`,
        en: `The kitten rushed happily into its mother's paws. The mother cat lovingly nuzzled her baby, then rubbed against ${childName}'s legs in deep gratitude.`,
        sceneSummary: `Ona-bolaning visoli va beqiyos quvonch`,
        actionPrompt: `${masterAnchor}, kneeling joyfully as the mother cat hugs the tiny kitten, pure innocent happiness radiating on child's smiling face, magical soft sunset light`
      },
      {
        uz: `Kechki payt ${childName} onasining yoniga o'tirib o'ychan bo'lib qoldi: "Onajon, agar men uni ko'rmay o'tib ketganimda nima bo'lardi?". Onasi uning sochlarini silab: "Bilmayman, bolajonim. Lekin sen befarq bo'lmading. Kichkina yordam ham kim uchundir eng katta yaxshilik bo'ladi", dedilar.`,
        en: `Later, ${childName} asked: "Mother, what if I hadn't stopped to help?" Mother gently stroked their hair: "You chose compassion, and even the smallest kindness can be a world of mercy to someone."`,
        sceneSummary: `Ibratli suhbat va qalbiy mehrning ildiz otishi`,
        actionPrompt: `${masterAnchor}, sitting cozily on a sofa beside mother, drinking warm tea, deep thoughtful expression turning into a peaceful serene smile`
      },
      {
        uz: `Oqshom o'z pardasini yoydi. ${childName} joynamozda ixlos bilan duo qildi: "Yo Mehribon Robbim! Qalbimni barcha maxluqotingga rahm-shafqatli qilgin, ota-onamni asragin. Omin!". So'ng shirin tushlar og'ushida, maloikalar qanoti ostida xotirjam uyquga ketdi.`,
        en: `Night fell in complete peace. ${childName} prayed with sincere cupped hands for a merciful heart, then fell into the sweetest sleep under the watchful care of angels.`,
        sceneSummary: `Mehribon qalbning sokin oromi va tunda farishtalar panohi`,
        actionPrompt: `${masterAnchor}, sleeping peacefully under a warm quilt with an angelic innocent smile, glowing crescent moon visible through window, ultimate bedtime calm`
      }
    ];
  }

  const selectedPages: StoryPage[] = templates.slice(0, targetPageCount).map((t, idx) => {
    const fullPrompt = `${t.actionPrompt}, ${stylePrompt}, ${negativeEnhancers}`;
    return {
      page_number: idx + 1,
      text_uz: t.uz,
      text_en: t.en,
      image_prompt: fullPrompt,
      image_url: `/api/story-image?storyId=${encodeURIComponent(storyId)}&page=${idx + 1}&prompt=${encodeURIComponent(fullPrompt)}&style=${encodeURIComponent(profile.illustration_style || 'pixar_3d')}`,
      scene_summary: t.sceneSummary
    };
  });

  const coverPrompt = `${masterAnchor}, smiling radiantly with beloved companion ${animal} in cozy warm glowing ${color} room, soft ambient sunlight, title banner, 8k resolution, cinematic lighting, masterpiece, ${stylePrompt}, ${negativeEnhancers}`;

  return {
    id: storyId,
    created_at: new Date().toISOString(),
    child_profile: profile,
    title_uz: `${childName} va Nurli Hikmat Sayohati`,
    title_en: `${childName} and the Radiant Tale of Wisdom`,
    prologue_uz: `Erka farzandimiz — ${childName}ning sevimli ${animal}i bilan birgalikdagi ibratli, mehr-oqibat va ezgulik bilan yo'g'rilgan nurli oqshom qissasi...`,
    prologue_en: `A heartwarming bedtime journey of young ${childName} discovering the profound beauty of noble Islamic character and deeds...`,
    cover_image_url: `/api/story-image?storyId=${encodeURIComponent(storyId)}&page=0&prompt=${encodeURIComponent(coverPrompt)}&style=${encodeURIComponent(profile.illustration_style || 'pixar_3d')}`,
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
