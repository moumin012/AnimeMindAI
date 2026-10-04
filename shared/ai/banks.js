/**
 * Content banks for the offline engine.
 *
 * Each bank holds many variants per occasion / feeling / style. The composer
 * picks a deterministic subset, so the same inputs always give the same letter
 * and "another letter" simply moves the seed.
 *
 * Everything here is written for the app (no third-party text), and every line
 * is deliberately gender-neutral in the second person so it can never produce
 * a grammatical mistake whatever the recipient's gender is.
 *
 * `i` = the intensity range the line belongs to (1 = very restrained … 5 = very heartfelt).
 */

const line = (t, i = [1, 5], s = null) => ({ t, i, s });

/* ------------------------------------------------------------------ Arabic (فصحى) */
export const arMsa = {
  dir: 'rtl',
  label: 'العربية الفصحى',

  greet: {
    named: ['{name}،', 'إلى {name}،'],
    nickname: ['{nickname}،', 'يا {nickname}،'],
    plain: ['مرحبًا،', 'أهلًا،', ''],
  },

  opening: {
    none: [
      line('أردت فقط أن أتوقف قليلًا وأقول لك شيئًا لم أقله من قبل.', [1, 3]),
      line('هناك أشياء نظل نؤجل قولها، واليوم قررت ألا أؤجلها.', [2, 4]),
      line('لا أعرف من أين أبدأ، لكنني أعرف أنني أريد أن أبدأ.', [1, 4]),
      line('فكرت فيك اليوم، ولم أستطع أن أترك الفكرة تمر دون أن أكتبها.', [2, 5]),
      line('أكتب لك هذه الأسطر لأن هناك كلامًا لا يُقال إلا بالكتابة.', [1, 4]),
    ],
    birthday: [
      line('كل سنة وأنت بخير، وأقرب مما تتمنى.', [1, 5]),
      line('في مثل هذا اليوم جاء إلى الدنيا شخص جعل حياتي أفضل.', [2, 5]),
      line('عيد ميلاد سعيد، وأتمنى لك سنة تشبهك: هادئة وجميلة.', [1, 4]),
      line('سنة جديدة تبدأ، وأنا سعيد لأنني سأكون فيها قريبًا منك.', [2, 5]),
    ],
    confession: [
      line('حملت هذا الكلام طويلًا، وأظن أن الوقت حان لأقوله.', [2, 5]),
      line('لن أطيل في المقدمات: هناك شيء أريد أن أعترف به.', [2, 5]),
      line('قد يبدو الكلام مفاجئًا، لكنه صادق تمامًا.', [2, 5]),
    ],
    love_letter: [
      line('أكتب لك وأنا أعرف أنني لن أستطيع قول كل شيء، لكنني سأحاول.', [2, 5]),
      line('هذه ليست رسالة عادية، هذه محاولة لأشرح لك ماذا يعني وجودك.', [3, 5]),
      line('أحيانًا تكفي كلمة، وأحيانًا نحتاج رسالة كاملة. اليوم أحتاج الرسالة.', [2, 4]),
    ],
    missing: [
      line('الأيام تمر، لكن غيابك لا يمر معها.', [2, 5]),
      line('لا أشتاق إليك في لحظة معينة، أشتاق إليك طوال الوقت.', [3, 5]),
      line('هناك فراغ بسيط في يومي لا يملؤه أحد غيرك.', [2, 4]),
    ],
    apology: [
      line('أعرف أنني أخطأت، ولا أريد أن أخفف مما فعلت.', [1, 5]),
      line('أريد أن أعتذر، دون أعذار ودون تبرير.', [1, 5]),
      line('فكرت كثيرًا فيما حدث، وأعرف أن الخطأ كان مني.', [1, 4]),
    ],
    reconciliation: [
      line('لا أحب أن يبقى بيننا شيء لم ننهه.', [1, 4]),
      line('الصمت أثقل من أي خلاف، ولهذا أكتب لك.', [2, 5]),
      line('الخلاف حدث، لكن ما بيننا أكبر منه.', [1, 5]),
    ],
    congrats: [
      line('أردت أن أكون من أوائل من يقولون لك: مبروك.', [1, 5]),
      line('عرفت بما فعلت، ولم أتفاجأ. أعرف جيدًا ما الذي تقدر عليه.', [1, 5]),
      line('هذا تستحقه، ولم يأتِ من فراغ.', [1, 4]),
    ],
    encouragement: [
      line('أعرف أن الفترة صعبة، وأعرف أيضًا أنك أقوى مما تظن.', [1, 5]),
      line('لست مضطرًا أن تكون قويًا طوال الوقت، لكنني أريد أن أذكّرك بشيء.', [1, 5]),
      line('رأيتك تتجاوز أصعب من هذا، ولهذا أنا مطمئن.', [1, 5]),
    ],
    morning: [
      line('صباح الخير، وأول فكرة في يومي كانت عنك.', [1, 4]),
      line('أردت أن يبدأ يومك بكلمة لطيفة مني.', [1, 3]),
      line('صباح هادئ لك، ويوم أخف من أمس.', [1, 3]),
    ],
    goodnight: [
      line('قبل أن ينتهي اليوم، أردت أن أترك لك هذه الكلمات.', [1, 4]),
      line('نومًا هادئًا، وأتمنى لك راحة تستحقها.', [1, 4]),
      line('أنهِ يومك دون حمل، واترك الباقي للغد.', [1, 3]),
    ],
    special: [
      line('هذه المناسبة لا تمر عاديًا، ولهذا أردت أن أكتب لك.', [1, 5]),
      line('في يوم كهذا، الكلام قليل لكنه صادق.', [1, 5]),
    ],
  },

  detailLead: [
    'ما أريد أن أقوله ببساطة هو:',
    'لأقولها كما هي:',
    'باختصار:',
    'وما في قلبي تحديدًا هذا:',
  ],

  feelings: {
    love: [
      line('أحبك، ولا أجد طريقة ألطف لقولها.', [3, 5]),
      line('معك عرفت أن الحب ليس كلامًا كبيرًا، بل حضورًا بسيطًا.', [2, 4]),
      line('ما أشعر به نحوك هادئ وثابت، وهذا أكثر ما أثق فيه.', [1, 3]),
      line('لا أطلب شيئًا، فقط أردت أن تعرف ما في قلبي.', [2, 5]),
    ],
    admiration: [
      line('طريقتك في التعامل مع الناس تعلمني أشياء لا تُقال.', [1, 4]),
      line('أعجبني فيك أنك لا تتصنع، وهذا نادر.', [1, 4]),
      line('هناك شيء فيك يجعل من حولك يطمئن.', [1, 5]),
    ],
    missing: [
      line('غيابك جعلني أنتبه إلى حجم حضورك.', [2, 5]),
      line('أشتاق إلى حديثنا، حتى أحاديثنا العادية.', [2, 4]),
      line('كلما رأيت شيئًا يعجبني، تمنيت أن أشاركه معك.', [2, 5]),
    ],
    gratitude: [
      line('شكرًا لأنك كنت موجودًا حين لم أطلب من أحد شيئًا.', [1, 4]),
      line('لم أقلها من قبل: وجودك في حياتي ليس تفصيلًا صغيرًا.', [2, 5]),
      line('أنا ممتن لكل مرة وقفت فيها بجانبي دون أن أسأل.', [1, 4]),
      line('شكرًا على صبرك معي، وعلى أنك لم تتغير.', [1, 4]),
    ],
    apology: [
      line('آسف، وهذه الكلمة ليست كافية لكنها صادقة.', [1, 5]),
      line('لم أقصد أن أجرحك، ومع ذلك أعرف أن ما حدث آلمك.', [1, 5]),
      line('لن أطلب منك أن تنسى، فقط أريد أن تعرف أنني فهمت خطئي.', [1, 4]),
    ],
    nostalgia: [
      line('أعود أحيانًا إلى أيامنا الأولى وأبتسم دون سبب.', [2, 5]),
      line('هناك أشياء صغيرة تذكرني بك، ولا أحكيها لأحد.', [2, 5]),
      line('كلما مر وقت، زاد تقديري لما عشناه.', [1, 4]),
    ],
    happiness: [
      line('بوجودك صار يومي العادي أجمل.', [2, 5]),
      line('أصبح عندي سبب بسيط لأفرح كل يوم.', [1, 4]),
      line('أنت من الأشياء القليلة التي تجعلني مطمئنًا.', [2, 5]),
    ],
    fear_of_loss: [
      line('لن أثقل عليك، لكنني أحتاج أن تعرف أنك مهم عندي.', [1, 3]),
      line('لا أريد أن أفقد ما بيننا، وسأفعل ما أستطيع للحفاظ عليه.', [3, 5]),
      line('أعرف أن كل شيء يمكن أن يتغير، ولهذا أقدّر وجودك الآن.', [2, 4]),
    ],
    appreciation: [
      line('أنا أقدر وجودك، حتى في الأيام التي لا نتكلم فيها.', [1, 4]),
      line('ما تفعله معي لا يمر دون أن أنتبه إليه.', [1, 4]),
      line('أنت شخص يستحق الاحترام، وأقولها دون مجاملة.', [1, 3]),
    ],
    pride: [
      line('أفتخر بك، وأتمنى لو تعرف كيف أراك حين تتحدث عن أحلامك.', [2, 5]),
      line('رأيتك تجتهد حين لم يكن هناك من يصفق، وهذا ما أحترمه فيك.', [1, 4]),
      line('ما وصلت إليه لم يكن سهلًا، وأنا شاهد على ذلك.', [1, 4]),
    ],
    support: [
      line('خذ وقتك، أنا لست في عجلة من أمري.', [1, 4]),
      line('لست مضطرًا أن تحكي كل شيء، يكفي أن تعرف أنني هنا.', [1, 5]),
      line('إن احتجت أحدًا، فأنا أول من يمكنك أن تتصل به.', [1, 5]),
      line('سأبقى بجانبك مهما طالت الفترة.', [2, 5]),
    ],
  },

  trait: [
    'أكثر ما أحب فيك: {trait}',
    'وهناك شيء فيك لا يتكرر: {trait}',
    'ومن الأشياء التي لا أنساها فيك أن {trait}',
  ],

  memory: [
    'ما زلت أذكر {memory}',
    'ولا أنسى {memory}',
    'وكلما تذكرت {memory} أبتسم وحدي.',
    'أذكر جيدًا {memory}',
  ],

  styleExtra: {
    poetic: [
      line('بعض الناس يأتون إلى حياتنا مثل المطر: بهدوء، ثم يغيّرون كل شيء.', [2, 5], 'poetic'),
      line('لو كان للوقت رائحة، لكان له رائحة الأيام التي جمعتنا.', [3, 5], 'poetic'),
    ],
    funny: [
      line('أعرف أنني لست بارعًا في الكلام، ولهذا أكتب لك بدل أن أتلعثم أمامك.', [1, 4], 'funny'),
      line('لو كان الحب بالوزن لاحتجت صندوقًا أكبر من هذه الرسالة.', [2, 5], 'funny'),
    ],
    deep: [
      line('أنا لا أؤمن بالكلام الكبير، أؤمن بالأشخاص الذين يبقون حين يصعب البقاء.', [1, 4], 'deep'),
      line('أصدق المشاعر هي التي لا تحتاج شرحًا، وهذا ما أشعر به.', [1, 4], 'deep'),
    ],
    mature: [
      line('لن أعدك بما لا أملك، لكنني أعدك بالصدق.', [1, 3], 'mature'),
      line('أعرف أن المشاعر وحدها لا تكفي، وأن الاحترام أهم منها.', [1, 3], 'mature'),
    ],
    cute: [
      line('أحيانًا تكفي رسالة قصيرة لتجعل اليوم أفضل، وهذه رسالتي.', [1, 3], 'cute'),
      line('لا شيء مهم اليوم، فقط أردت أن أبتسم وأنت تقرأ.', [1, 3], 'cute'),
    ],
  },

  closing: {
    generic: {
      low: [
        'هذا كل ما أردت قوله، والباقي يعرفه قلبي.',
        'أتمنى أن تصلك هذه الكلمات كما أرسلتها: ببساطة.',
        'لا تنتظر ردًا، أردت فقط أن تعرف.',
      ],
      mid: [
        'شكرًا لأنك موجود في حياتي، وهذا ليس كلامًا عابرًا.',
        'أتمنى أن تبقى الأيام القادمة ألطف علينا.',
        'هذا ما في قلبي، وأتركه بين يديك.',
      ],
      high: [
        'أحبك، وأتمنى أن تبقى دائمًا بهذا القرب.',
        'سأظل ممتنًا لأن طرقنا التقت.',
        'كل ما أتمناه أن تبقى بخير، وأن أبقى أنا قريبًا منك.',
      ],
    },
    birthday: [
      'سنة سعيدة، وأتمنى أن تحقق فيها ما تتمنى.',
      'كل عام وأنت أقرب إلى أحلامك.',
    ],
    apology: [
      'لن أستعجل ردك، خذ الوقت الذي تحتاجه.',
      'مهما كان قرارك، أردت أن تعرف أنني فهمت خطئي.',
    ],
    reconciliation: [
      'إن أردت أن نتحدث، فأنا هنا، دون عتاب.',
      'لنبدأ من جديد، بهدوء وبصدق.',
    ],
    congrats: ['مبروك من قلبي.', 'أتمنى لك المزيد، فأنت تستحقه.'],
    encouragement: ['لست وحدك، ولا تنسَ ذلك.', 'أنا هنا متى احتجتني.'],
    morning: ['يوم جميل لك.', 'أتمنى لك يومًا يشبهك.'],
    goodnight: ['نومًا هادئًا.', 'أحلام سعيدة.'],
    confession: ['لا أطلب جوابًا الآن، فقط أردت أن أكون صادقًا.', 'قل ما تشاء، المهم أنني قلتها.'],
    missing: ['أتمنى أن نلتقي قريبًا.', 'إلى أن أراك، اعتنِ بنفسك.'],
  },

  whatToSay: {
    openers: [
      'مرحبًا، أعرف أن الوقت قد لا يكون مناسبًا، لكنني أردت أن أتكلم بصدق.',
      'هل يمكنني أن أقول لك شيئًا؟ سأحاول أن أكون مختصرًا.',
      'لا أريد أن أزعجك، فقط أردت أن أوضح نقطة واحدة.',
      'أفكر منذ أيام في طريقة لأبدأ الحديث، ووجدت أن الأبسط هو الأصح.',
    ],
    avoid: [
      'تجنّب أن تبرر كل شيء دفعة واحدة أو أن تحمّل الطرف الآخر مسؤولية مشاعرك.',
      'لا تبدأ بـ"لكن"، ولا تقل "أنت دائمًا..." أو "أنت لم تفعل أبدًا...".',
      'لا تجعل الرسالة تهديدًا بالرحيل ولا محاولة لإشعاره بالذنب.',
      'لا تطلب ردًا فوريًا، ولا تحاسبه على صمته.',
    ],
  },
};

/* ------------------------------------------------------------------ الدارجة الجزائرية */
export const arDz = {
  dir: 'rtl',
  label: 'الدارجة الجزائرية',

  greet: {
    named: ['{name}،', 'يا {name}،'],
    nickname: ['{nickname}،', 'يا {nickname}،'],
    plain: ['سلام،', 'أهلا،', ''],
  },

  opening: {
    none: [
      line('حبيت نقولك حاجة كنت شايّلها في قلبي من مدة.', [1, 4]),
      line('كاين كلام ما نقدرش نقوله في وجهك، لهذا كتبتهولك.', [1, 4]),
      line('راني نفكر فيك اليوم، وقلت لازم نكتبلك ولو كلمات قلال.', [2, 5]),
      line('ما راحش نطول عليك، بصح كاين حاجة لازم تعرفها.', [1, 3]),
      line('عرفت واش؟ كاين حاجات ما نقولوهاش حتى يفوت الوقت.', [2, 5]),
    ],
    birthday: [
      line('كل عام وأنت بخير، وعقبال مية سنة.', [1, 5]),
      line('اليوم عيد ميلادك، وما حبيتش يفوت بلا ما نقولك حاجة من قلبي.', [2, 5]),
      line('سنة جديدة عليك، ونتمنالك عام مليح كيما قلبك.', [1, 4]),
    ],
    confession: [
      line('شحال وأنا نحب نقولك ها الحاجة، واليوم قلت لازم.', [2, 5]),
      line('راح نقولها بصراحة وبلا مقدمات.', [2, 5]),
      line('يمكن تتفاجأ من كلامي، بصح هادي الحقيقة.', [2, 5]),
    ],
    love_letter: [
      line('ها الرسالة راهي من قلبي، ونتمنى توصلك كيما كتبتها.', [2, 5]),
      line('ما نعرفش نكتب بزاف، بصح اللي في قلبي كبير.', [2, 5]),
      line('حبيت نكتبلك باش تبقى هاد الكلمات معاك.', [2, 5]),
    ],
    missing: [
      line('وحشتيني بصح، وما نقدرش نخبّيها.', [2, 5]),
      line('الأيام راها تمشي، بصح غيابك بقا في بلاصته.', [2, 5]),
      line('كل يوم نلقى روحي نفكر فيك.', [2, 4]),
    ],
    apology: [
      line('نعرف بلي غلطت، وما حبيتش نبرر روحي.', [1, 5]),
      line('حبيت نطلب منك السماح، بلا أعذار.', [1, 5]),
      line('فكرت بزاف في اللي صار، والغلط كان من عندي.', [1, 4]),
    ],
    reconciliation: [
      line('ما نحبش يبقى بيننا حاجة ما سالييناش منها.', [1, 4]),
      line('السكوت تقيل بزاف، لهذا جيت نكلمك.', [2, 5]),
      line('صحيح تصرّفنا بزعل، بصح اللي بيناتنا أكبر من هاكا.', [1, 5]),
    ],
    congrats: [
      line('مبروك عليك، والله تستاهلها.', [1, 5]),
      line('سمعت باللي درته، وما تفاجأتش، نعرف واش تقدر دير.', [1, 5]),
      line('ها الحاجة جاتك من تعبك، ماشي بالساهل.', [1, 4]),
    ],
    encouragement: [
      line('نعرف بلي الأيام صعاب عليك، بصح راك أقوى مما تحس.', [1, 5]),
      line('ما لازمش تكون قوي في كل وقت، بصح حبّيت نفكّرك بحاجة.', [1, 5]),
      line('شفتك خرجت من حاجات أصعب من هاذه، لهذا راني مطمّن عليك.', [1, 5]),
    ],
    morning: [
      line('صباح الخير، وأول حاجة فكرت فيها اليوم هي أنت.', [1, 4]),
      line('حبيت نبدا نهارك بكلمة حلوة من عندي.', [1, 3]),
      line('صباحك نور، ونتمنى نهارك يكون أخف من أمس.', [1, 3]),
    ],
    goodnight: [
      line('قبل ما تسالي النهار، حبيت نخلي لك ها الكلمات.', [1, 4]),
      line('تصبح على خير، ورتاح شوية على روحك.', [1, 4]),
      line('خلي همومك لليوم، والباقي على ربي.', [1, 3]),
    ],
    special: [
      line('ها المناسبة ما تفوتش عادي، لهذا حبيت نكتبلك.', [1, 5]),
      line('في نهار كيما اليوم، الكلام قليل بصح صادق.', [1, 5]),
    ],
  },

  detailLead: [
    'بصراحة، اللي حبيت نقولو هو:',
    'باش نسهّلها عليك:',
    'باختصار:',
    'واللي في قلبي بالضبط هو:',
  ],

  feelings: {
    love: [
      line('نحبك، وما لقيتش طريقة أحسن باش نقولها.', [3, 5]),
      line('معاك فهمت بلي الحب ماشي كلام كبير، هو الحضور البسيط.', [2, 4]),
      line('اللي نحسو ناحيتك هادي وثابت، وهاذي الحاجة اللي نثق فيها.', [1, 3]),
      line('ما نطلب والو، غير حبيتك تعرف اللي في قلبي.', [2, 5]),
    ],
    admiration: [
      line('الطريقة اللي تتعامل بيها مع الناس تعلمني حاجات.', [1, 4]),
      line('عجبني فيك بلي راك طبيعي، وهاذي حاجة نادرة.', [1, 4]),
      line('كاين حاجة فيك تخلّي الناس ترتاح ليك.', [1, 5]),
    ],
    missing: [
      line('غيابك ورّاني قدّاش راك كبير في حياتي.', [2, 5]),
      line('توحشت هدرتنا، حتى الهضرة العادية اللي كنا نديروها.', [2, 4]),
      line('كلما نشوف حاجة تعجبني، نتمنى نشاركها معاك.', [2, 5]),
    ],
    gratitude: [
      line('صحيت على وقفتك معايا في وقت ما طلبت والو من حتى واحد.', [1, 4]),
      line('ما قلتهاش قبل: وجودك في حياتي ماشي تفصيل صغير.', [2, 5]),
      line('راني ممنون على كل مرة وقفت فيها جنبي بلا ما نطلب.', [1, 4]),
      line('صحيت على صبرك معايا، وعلى بلي ما تبدلتش.', [1, 4]),
    ],
    apology: [
      line('سمحلي، والكلمة هاذي قليلة بصح من قلبي.', [1, 5]),
      line('ما كان قصدي نجرحك، بصح نعرف بلي اللي صار وجّعك.', [1, 5]),
      line('ما راحش نطلب منك تنسى، غير حبيتك تعرف بلي فهمت غلطي.', [1, 4]),
    ],
    nostalgia: [
      line('نرجع بعض المرات لأيامنا اللولة ونبتسم وحدي.', [2, 5]),
      line('كاين حاجات صغار يفكروني فيك، وما نحكيهمش حتى لحد.', [2, 5]),
      line('كلما فات وقت، زاد تقديري للي عشناه مع بعض.', [1, 4]),
    ],
    happiness: [
      line('بيك ولّا نهاري العادي أحلى.', [2, 5]),
      line('ولا عندي سبب بسيط نفرح بيه كل يوم.', [1, 4]),
      line('أنت من الحاجات القلال اللي يريّحوني.', [2, 5]),
    ],
    fear_of_loss: [
      line('ما حبيتش نثقّل عليك، بصح لازم تعرف بلي راك مهم عندي.', [1, 3]),
      line('ما نحبش نخسر اللي بيناتنا، وراح ندير اللي نقدر عليه.', [3, 5]),
      line('نعرف بلي كل حاجة تقدر تتبدل، لهذا نقدّر وجودك دروك.', [2, 4]),
    ],
    appreciation: [
      line('نقدّر وجودك، حتى في الأيام اللي ما نهضروش فيها.', [1, 4]),
      line('اللي ديرُه معايا ما يفوتش عليا.', [1, 4]),
      line('راك إنسان يستاهل الاحترام، ونقولها بلا مجاملة.', [1, 3]),
    ],
    pride: [
      line('راني فخور بيك، ويا ريت تعرف كيفاش نشوفك وأنت تهدر على أحلامك.', [2, 5]),
      line('شفتك تخدم مليح في وقت ما كان حتى واحد يشجعك، وهاذي اللي نحترمها فيك.', [1, 4]),
      line('اللي وصلتله ما كانش ساهل، وأنا شاهد على هاذا.', [1, 4]),
    ],
    support: [
      line('خذ وقتك، أنا ماشي مستعجل.', [1, 4]),
      line('ما لازمش تحكي لي كل حاجة، يكفي تعرف بلي راني هنا.', [1, 5]),
      line('إذا احتجت واحد، راني أول واحد تقدر تعيط له.', [1, 5]),
      line('راح نبقى جنبك مهما طالت المدة.', [2, 5]),
    ],
  },

  trait: [
    'واللي نحبو فيك بزاف: {trait}',
    'وكاين حاجة فيك ما تتعاودش: {trait}',
    'ومن الحاجات اللي ما ننساهمش فيك: {trait}',
  ],

  memory: [
    'مازلت نتفكر {memory}',
    'وما ننساش {memory}',
    'وكلما نتفكر {memory} نبتسم وحدي.',
    'نتفكر مليح {memory}',
  ],

  styleExtra: {
    poetic: [
      line('كاين ناس يدخلوا لحياتنا كيما الشتا: بهدوء، ومن بعد يبدلوا كل حاجة.', [2, 5], 'poetic'),
      line('لو كان للوقت ريحة، كانت تكون ريحة الأيام اللي جمعاتنا.', [3, 5], 'poetic'),
    ],
    funny: [
      line('نعرف بلي ما نحسنش نهضر، لهذا نكتبلك خير من نتلعثم قدّامك.', [1, 4], 'funny'),
      line('لو كان الحب بالوزن، كنا احتجنا كارتونة أكبر من ها الرسالة.', [2, 5], 'funny'),
    ],
    deep: [
      line('ما نؤمنش بالكلام الكبير، نؤمن بالناس اللي يبقاو كيما يصعب البقاء.', [1, 4], 'deep'),
      line('أصدق المشاعر هي اللي ما تحتاجش شرح، وهاذي اللي نحس بيها.', [1, 4], 'deep'),
    ],
    mature: [
      line('ما راحش نعدك باللي ما نملكوش، بصح نعدك بالصدق.', [1, 3], 'mature'),
      line('نعرف بلي المشاعر وحدها ما تكفيش، والاحترام أهم منها.', [1, 3], 'mature'),
    ],
    cute: [
      line('بعض المرات رسالة قصيرة تكفي باش تحسّن النهار، وهاذي رسالتي.', [1, 3], 'cute'),
      line('ما كاين حتى حاجة مهمة اليوم، غير حبيت تبتسم وأنت تقرا.', [1, 3], 'cute'),
    ],
  },

  closing: {
    generic: {
      low: [
        'هاذا كلش اللي حبيت نقولو، والباقي في قلبي.',
        'نتمنى توصلك ها الكلمات كيما بعتّهم: ببساطة.',
        'ما تستنى جواب، غير حبيتك تعرف.',
      ],
      mid: [
        'صحيت على بلي راك في حياتي، وهاذا ماشي كلام فارغ.',
        'نتمنى الأيام الجاية تكون أحسن علينا.',
        'هاذا اللي في قلبي، وخليته بين يديك.',
      ],
      high: [
        'نحبك، ونتمنى تبقى ديما بهاد القرب.',
        'راح نبقى ممنون لأن طرقنا تلاقاو.',
        'كل اللي نتمناه تبقى بخير، ونبقى أنا قريب منك.',
      ],
    },
    birthday: ['عام سعيد عليك، ونتمنى تحقق اللي تتمناه.', 'كل عام وأنت أقرب لأحلامك.'],
    apology: ['ما راحش نستعجل جوابك، خذ الوقت اللي تحتاجو.', 'مهما كان قرارك، حبيتك تعرف بلي فهمت غلطي.'],
    reconciliation: ['إذا حبيت نهضرو، راني هنا، بلا عتاب.', 'نبدأو من جديد، بهدوء وبصدق.'],
    congrats: ['مبروك من قلبي.', 'نتمنى لك المزيد، راك تستاهل.'],
    encouragement: ['ما راكش وحدك، ما تنساش هاذا.', 'راني هنا في أي وقت تحتاجني.'],
    morning: ['نهارك زين.', 'نتمنى نهار يشبهلك.'],
    goodnight: ['تصبح على خير.', 'أحلام سعيدة.'],
    confession: ['ما نطلبش جواب دروك، غير حبيت نكون صادق معاك.', 'قول اللي تحب، المهم أنا قلتها.'],
    missing: ['نتمنى نتلاقاو قريب.', 'حتى نشوفك، خلي بالك من روحك.'],
  },

  whatToSay: {
    openers: [
      'سلام، نعرف بلي الوقت يمكن ما يكونش مناسب، بصح حبيت نهضر معاك بصدق.',
      'نقدر نقولك حاجة؟ راح نحاول نكون مختصر.',
      'ما حبيتش نزعجك، غير حبيت نوضّح نقطة وحدة.',
      'شحال وأنا نفكر كيفاش نبدا الهضرة، ولقيت بلي الأسهل هو الصح.',
    ],
    avoid: [
      'ما تبررش كل حاجة مرة وحدة، وما تحمّلش للطرف الآخر مسؤولية مشاعرك.',
      'ما تبداش بـ"بصح"، وما تقلش "أنت ديما..." أو "أنت عمرك ما...".',
      'ما تخليش الرسالة تكون تهديد بالمشي ولا محاولة باش تحسّسو بالذنب.',
      'ما تطلبش جواب فوري، وما تحاسبوش على السكوت تاعو.',
    ],
  },
};

/* ------------------------------------------------------------------ Français */
export const fr = {
  dir: 'ltr',
  label: 'Français',

  greet: {
    named: ['{name},', 'Pour {name},'],
    nickname: ['{nickname},', 'Salut {nickname},'],
    plain: ['Salut,', 'Coucou,', ''],
  },

  opening: {
    none: [
      line('Je voulais juste m’arrêter un instant et te dire quelque chose que je n’ai jamais dit.', [1, 3]),
      line('Il y a des choses qu’on repousse, et aujourd’hui j’ai décidé de ne plus repousser.', [2, 4]),
      line('Je ne sais pas par où commencer, mais je sais que je veux commencer.', [1, 4]),
      line('J’ai pensé à toi aujourd’hui, et je n’ai pas voulu laisser passer cette pensée.', [2, 5]),
      line('Il y a des choses qui ne se disent bien qu’à l’écrit.', [1, 4]),
    ],
    birthday: [
      line('Joyeux anniversaire, et que cette année te ressemble : douce et belle.', [1, 4]),
      line('Aujourd’hui, le monde a gagné quelqu’un qui rend ma vie meilleure.', [2, 5]),
      line('Une année de plus, et je suis content d’être encore là pour la voir.', [2, 5]),
    ],
    confession: [
      line('Je porte ces mots depuis longtemps, et je crois que c’est le moment.', [2, 5]),
      line('Je ne vais pas tourner autour : il y a quelque chose que je dois t’avouer.', [2, 5]),
      line('Ça va peut-être te surprendre, mais c’est sincère.', [2, 5]),
    ],
    love_letter: [
      line('Je sais que je ne dirai pas tout, mais je vais essayer.', [2, 5]),
      line('Ce n’est pas un message ordinaire : j’essaie d’expliquer ce que ta présence change.', [3, 5]),
      line('Parfois un mot suffit. Aujourd’hui, il me faut tout un message.', [2, 4]),
    ],
    missing: [
      line('Les jours passent, mais ton absence, elle, ne passe pas.', [2, 5]),
      line('Tu ne me manques pas à un moment précis : tu me manques tout le temps.', [3, 5]),
      line('Il y a un petit vide dans ma journée que personne d’autre ne remplit.', [2, 4]),
    ],
    apology: [
      line('Je sais que j’ai eu tort, et je ne cherche pas à minimiser ce que j’ai fait.', [1, 5]),
      line('Je veux m’excuser, sans excuse et sans justification.', [1, 5]),
      line('J’ai beaucoup repensé à ce qui s’est passé, et l’erreur venait de moi.', [1, 4]),
    ],
    reconciliation: [
      line('Je n’aime pas laisser quelque chose d’inachevé entre nous.', [1, 4]),
      line('Le silence pèse plus lourd qu’une dispute, alors je t’écris.', [2, 5]),
      line('On s’est disputés, mais ce qu’il y a entre nous est plus grand que ça.', [1, 5]),
    ],
    congrats: [
      line('Je voulais être parmi les premiers à te dire : bravo.', [1, 5]),
      line('J’ai appris ce que tu as fait, et je ne suis pas surpris. Je sais de quoi tu es capable.', [1, 5]),
      line('Tu l’as mérité, et ce n’est pas arrivé par hasard.', [1, 4]),
    ],
    encouragement: [
      line('Je sais que la période est dure, et je sais aussi que tu es plus fort que tu ne le crois.', [1, 5]),
      line('Tu n’as pas à être fort tout le temps, mais laisse-moi te rappeler une chose.', [1, 5]),
      line('Je t’ai vu traverser plus difficile que ça, alors je suis rassuré.', [1, 5]),
    ],
    morning: [
      line('Bonjour, et ma première pensée du jour était pour toi.', [1, 4]),
      line('Je voulais que ta journée commence par un mot doux.', [1, 3]),
      line('Bonne matinée, et une journée plus légère qu’hier.', [1, 3]),
    ],
    goodnight: [
      line('Avant que la journée se termine, je voulais te laisser ces mots.', [1, 4]),
      line('Dors bien, tu mérites du repos.', [1, 4]),
      line('Finis ta journée sans poids, le reste attendra demain.', [1, 3]),
    ],
    special: [
      line('Cette occasion ne passe pas inaperçue, alors je t’écris.', [1, 5]),
      line('Un jour comme celui-ci, les mots sont courts mais sincères.', [1, 5]),
    ],
  },

  detailLead: [
    'Ce que je veux dire, simplement :',
    'Pour le dire tel quel :',
    'En résumé :',
    'Ce que j’ai sur le cœur, exactement :',
  ],

  feelings: {
    love: [
      line('Je t’aime, et je ne trouve pas de façon plus simple de le dire.', [3, 5]),
      line('Avec toi j’ai compris que l’amour, ce n’est pas de grands mots, c’est une présence simple.', [2, 4]),
      line('Ce que je ressens pour toi est calme et constant, et c’est ce en quoi j’ai le plus confiance.', [1, 3]),
      line('Je ne demande rien, je voulais seulement que tu saches.', [2, 5]),
    ],
    admiration: [
      line('Ta façon d’être avec les gens m’apprend des choses.', [1, 4]),
      line('Ce que j’admire chez toi, c’est que tu ne joues aucun rôle.', [1, 4]),
      line('Il y a quelque chose en toi qui met les gens en confiance.', [1, 5]),
    ],
    missing: [
      line('Ton absence m’a montré à quel point ta présence compte.', [2, 5]),
      line('Nos conversations banales me manquent aussi.', [2, 4]),
      line('Quand je vois quelque chose de beau, j’ai envie de le partager avec toi.', [2, 5]),
    ],
    gratitude: [
      line('Merci d’avoir été là quand je ne demandais rien à personne.', [1, 4]),
      line('Je ne l’ai jamais dit : ta présence rend mes journées plus belles.', [2, 5]),
      line('Je te suis reconnaissant pour chaque fois où tu es resté sans que je le demande.', [1, 4]),
      line('Merci pour ta patience, et pour le fait que tu n’as pas changé.', [1, 4]),
    ],
    apology: [
      line('Pardon. Ce mot ne suffit pas, mais il est sincère.', [1, 5]),
      line('Je ne voulais pas te blesser, et pourtant je sais que ça t’a fait mal.', [1, 5]),
      line('Je ne te demande pas d’oublier, juste de savoir que j’ai compris mon erreur.', [1, 4]),
    ],
    nostalgia: [
      line('Je repense parfois à nos débuts et je souris tout seul.', [2, 5]),
      line('Il y a des petits détails qui me font penser à toi, et je n’en parle à personne.', [2, 5]),
      line('Plus le temps passe, plus je mesure ce qu’on a vécu.', [1, 4]),
    ],
    happiness: [
      line('Avec toi, mes journées ordinaires sont devenues plus belles.', [2, 5]),
      line('J’ai maintenant une raison simple d’être content chaque jour.', [1, 4]),
      line('Tu fais partie des rares choses qui m’apaisent.', [2, 5]),
    ],
    fear_of_loss: [
      line('Je ne veux pas peser, mais tu dois savoir que tu comptes.', [1, 3]),
      line('Je ne veux pas perdre ce qu’il y a entre nous, et je ferai ce que je peux.', [3, 5]),
      line('Je sais que tout peut changer, alors j’apprécie ta présence maintenant.', [2, 4]),
    ],
    appreciation: [
      line('J’apprécie ta présence, même les jours où on ne se parle pas.', [1, 4]),
      line('Ce que tu fais pour moi ne passe pas inaperçu.', [1, 4]),
      line('Tu es quelqu’un qui mérite le respect, et ce n’est pas une formule.', [1, 3]),
    ],
    pride: [
      line('Je suis fier de toi, et j’aimerais que tu te voies quand tu parles de tes rêves.', [2, 5]),
      line('Je t’ai vu travailler quand personne n’applaudissait, et c’est ce que je respecte.', [1, 4]),
      line('Ce que tu as accompli n’était pas facile, et j’en ai été témoin.', [1, 4]),
    ],
    support: [
      line('Prends ton temps, je ne suis pas pressé.', [1, 4]),
      line('Tu n’as pas à tout raconter, sache juste que je suis là.', [1, 5]),
      line('Si tu as besoin de quelqu’un, je suis le premier que tu peux appeler.', [1, 5]),
      line('Je resterai à tes côtés, aussi longtemps qu’il faudra.', [2, 5]),
    ],
  },

  trait: [
    'Ce que j’aime le plus chez toi : {trait}',
    'Il y a un truc chez toi qu’on ne retrouve nulle part : {trait}',
    'Et je n’oublie pas que {trait}',
  ],

  memory: [
    'Je repense encore à {memory}',
    'Et je n’oublie pas {memory}',
    'Chaque fois que je repense à {memory}, je souris.',
    'Je me souviens très bien de {memory}',
  ],

  styleExtra: {
    poetic: [
      line('Certaines personnes entrent dans une vie comme la pluie : doucement, puis elles changent tout.', [2, 5], 'poetic'),
      line('Si le temps avait une odeur, il aurait celle des jours qu’on a passés ensemble.', [3, 5], 'poetic'),
    ],
    funny: [
      line('Je ne suis pas doué avec les mots, alors je t’écris au lieu de bafouiller devant toi.', [1, 4], 'funny'),
      line('Si l’amour se pesait, il faudrait une boîte plus grande que ce message.', [2, 5], 'funny'),
    ],
    deep: [
      line('Je ne crois pas aux grandes déclarations, je crois aux gens qui restent quand c’est difficile.', [1, 4], 'deep'),
      line('Les sentiments les plus vrais sont ceux qui n’ont pas besoin d’explication.', [1, 4], 'deep'),
    ],
    mature: [
      line('Je ne promets pas ce que je n’ai pas, mais je promets l’honnêteté.', [1, 3], 'mature'),
      line('Les sentiments seuls ne suffisent pas, le respect compte davantage.', [1, 3], 'mature'),
    ],
    cute: [
      line('Parfois un petit message suffit à rendre la journée meilleure. Voilà le mien.', [1, 3], 'cute'),
      line('Rien d’important aujourd’hui, juste envie que tu souries en lisant.', [1, 3], 'cute'),
    ],
  },

  closing: {
    generic: {
      low: [
        'C’est tout ce que je voulais dire, le reste, mon cœur le sait.',
        'J’espère que ces mots t’arrivent comme je les ai écrits : simplement.',
        'N’attends pas de réponse, je voulais juste que tu saches.',
      ],
      mid: [
        'Merci d’être dans ma vie, et ce n’est pas une phrase en l’air.',
        'J’espère que les jours à venir seront plus doux pour nous.',
        'Voilà ce que j’ai sur le cœur, je te le confie.',
      ],
      high: [
        'Je t’aime, et j’espère te garder tout près.',
        'Je resterai reconnaissant que nos chemins se soient croisés.',
        'Tout ce que je souhaite, c’est que tu ailles bien.',
      ],
    },
    birthday: ['Bonne année à toi, et que tes vœux se réalisent.', 'Chaque année te rapproche un peu plus de tes rêves.'],
    apology: ['Je ne presse pas ta réponse, prends le temps qu’il te faut.', 'Quelle que soit ta décision, je voulais que tu saches que j’ai compris.'],
    reconciliation: ['Si tu veux qu’on se parle, je suis là, sans reproche.', 'Recommençons, calmement et sincèrement.'],
    congrats: ['Bravo, du fond du cœur.', 'Je te souhaite la suite, tu le mérites.'],
    encouragement: ['Tu n’es pas seul, ne l’oublie pas.', 'Je suis là quand tu veux.'],
    morning: ['Belle journée à toi.', 'Une journée qui te ressemble.'],
    goodnight: ['Dors bien.', 'Fais de beaux rêves.'],
    confession: ['Je ne demande pas de réponse maintenant, je voulais être honnête.', 'Dis ce que tu veux, l’important c’est que je l’ai dit.'],
    missing: ['J’espère qu’on se verra bientôt.', 'Prends soin de toi.'],
  },

  whatToSay: {
    openers: [
      'Salut, je sais que ce n’est peut-être pas le bon moment, mais je voulais te parler franchement.',
      'Je peux te dire quelque chose ? Je vais faire court.',
      'Je ne veux pas te déranger, juste clarifier un point.',
      'Je cherche depuis des jours comment commencer, et le plus simple reste le meilleur.',
    ],
    avoid: [
      'Évite de tout justifier d’un coup ou de rendre l’autre responsable de tes émotions.',
      'Ne commence pas par « mais », et n’utilise jamais « tu fais toujours… » ou « tu ne fais jamais… ».',
      'Ne transforme pas le message en menace de départ ni en culpabilisation.',
      'N’exige pas de réponse immédiate et ne reproche pas son silence.',
    ],
  },
};

/* ------------------------------------------------------------------ English */
export const en = {
  dir: 'ltr',
  label: 'English',

  greet: {
    named: ['{name},', 'To {name},'],
    nickname: ['{nickname},', 'Hey {nickname},'],
    plain: ['Hey,', 'Hi,', ''],
  },

  opening: {
    none: [
      line('I just wanted to stop for a second and say something I never said out loud.', [1, 3]),
      line('There are things we keep postponing. Today I decided not to.', [2, 4]),
      line('I don’t know where to start, but I know I want to start.', [1, 4]),
      line('I thought about you today, and I didn’t want the thought to just pass.', [2, 5]),
      line('Some things are easier to write than to say.', [1, 4]),
    ],
    birthday: [
      line('Happy birthday, and I hope this year looks like you: calm and beautiful.', [1, 4]),
      line('On this day the world got someone who made my life better.', [2, 5]),
      line('Another year of you, and I’m glad I get to see it.', [2, 5]),
    ],
    confession: [
      line('I have been carrying these words for a while, and I think it’s time.', [2, 5]),
      line('I won’t build up to it: there is something I need to admit.', [2, 5]),
      line('This might surprise you, but it is completely honest.', [2, 5]),
    ],
    love_letter: [
      line('I know I won’t say everything, but I want to try.', [2, 5]),
      line('This isn’t an ordinary message. I’m trying to explain what your presence changes.', [3, 5]),
      line('Sometimes one word is enough. Today I need a whole letter.', [2, 4]),
    ],
    missing: [
      line('Days go by, but your absence doesn’t.', [2, 5]),
      line('I don’t miss you at one particular moment — I miss you all the time.', [3, 5]),
      line('There is a small gap in my day that nobody else fills.', [2, 4]),
    ],
    apology: [
      line('I know I was wrong, and I’m not going to soften what I did.', [1, 5]),
      line('I want to apologize, without excuses and without justification.', [1, 5]),
      line('I thought a lot about what happened, and the mistake was mine.', [1, 4]),
    ],
    reconciliation: [
      line('I don’t like leaving something unfinished between us.', [1, 4]),
      line('Silence is heavier than any argument, so I’m writing.', [2, 5]),
      line('We fought, but what we have is bigger than that.', [1, 5]),
    ],
    congrats: [
      line('I wanted to be one of the first to say: congratulations.', [1, 5]),
      line('I heard what you did, and I wasn’t surprised. I know what you’re capable of.', [1, 5]),
      line('You earned this, and it didn’t come out of nowhere.', [1, 4]),
    ],
    encouragement: [
      line('I know this period is hard, and I also know you’re stronger than you think.', [1, 5]),
      line('You don’t have to be strong all the time, but let me remind you of something.', [1, 5]),
      line('I have seen you get through harder things, so I’m not worried.', [1, 5]),
    ],
    morning: [
      line('Good morning, and you were my first thought today.', [1, 4]),
      line('I wanted your day to start with something kind.', [1, 3]),
      line('Good morning, and a lighter day than yesterday.', [1, 3]),
    ],
    goodnight: [
      line('Before the day ends, I wanted to leave you these words.', [1, 4]),
      line('Sleep well, you deserve the rest.', [1, 4]),
      line('End the day without carrying anything, the rest can wait.', [1, 3]),
    ],
    special: [
      line('An occasion like this doesn’t pass quietly, so I’m writing.', [1, 5]),
      line('On a day like today, words are short but honest.', [1, 5]),
    ],
  },

  detailLead: ['Simply put:', 'To say it as it is:', 'In short:', 'And here is exactly what I feel:'],

  feelings: {
    love: [
      line('I love you, and I can’t find a simpler way to say it.', [3, 5]),
      line('With you I learned that love isn’t big words, it’s simple presence.', [2, 4]),
      line('What I feel for you is calm and steady, and that’s what I trust most.', [1, 3]),
      line('I’m not asking for anything, I just wanted you to know.', [2, 5]),
    ],
    admiration: [
      line('The way you treat people teaches me things.', [1, 4]),
      line('What I admire about you is that you never pretend.', [1, 4]),
      line('There is something about you that makes people feel safe.', [1, 5]),
    ],
    missing: [
      line('Your absence showed me how much your presence matters.', [2, 5]),
      line('I miss our ordinary conversations too.', [2, 4]),
      line('Whenever I see something nice, I wish I could share it with you.', [2, 5]),
    ],
    gratitude: [
      line('Thank you for being there when I wasn’t asking anyone for anything.', [1, 4]),
      line('I never said it: you make my days better.', [2, 5]),
      line('I’m grateful for every time you stayed without me asking.', [1, 4]),
      line('Thank you for your patience, and for not changing.', [1, 4]),
    ],
    apology: [
      line('I’m sorry. The word isn’t enough, but it’s honest.', [1, 5]),
      line('I didn’t mean to hurt you, and I know I did.', [1, 5]),
      line('I’m not asking you to forget, only to know that I understood my mistake.', [1, 4]),
    ],
    nostalgia: [
      line('Sometimes I go back to our first days and smile on my own.', [2, 5]),
      line('There are small things that remind me of you, and I tell nobody about them.', [2, 5]),
      line('The more time passes, the more I value what we lived.', [1, 4]),
    ],
    happiness: [
      line('With you, my ordinary days became nicer.', [2, 5]),
      line('I now have a simple reason to be happy every day.', [1, 4]),
      line('You are one of the few things that calm me down.', [2, 5]),
    ],
    fear_of_loss: [
      line('I don’t want to be heavy, but you should know that you matter to me.', [1, 3]),
      line('I don’t want to lose what we have, and I’ll do what I can for it.', [3, 5]),
      line('I know everything can change, so I appreciate you being here now.', [2, 4]),
    ],
    appreciation: [
      line('I appreciate you, even on the days we don’t talk.', [1, 4]),
      line('What you do for me doesn’t go unnoticed.', [1, 4]),
      line('You deserve respect, and that isn’t just a nice phrase.', [1, 3]),
    ],
    pride: [
      line('I’m proud of you, and I wish you could see yourself when you talk about your dreams.', [2, 5]),
      line('I watched you work when nobody was clapping, and that’s what I respect.', [1, 4]),
      line('What you reached wasn’t easy, and I was there to see it.', [1, 4]),
    ],
    support: [
      line('Take your time, I’m not in a hurry.', [1, 4]),
      line('You don’t have to tell me everything, just know I’m here.', [1, 5]),
      line('If you need someone, I’m the first person you can call.', [1, 5]),
      line('I’ll stay by your side however long it takes.', [2, 5]),
    ],
  },

  trait: [
    'What I love most about you: {trait}',
    'There is one thing about you that nobody else has: {trait}',
    'And I won’t forget that {trait}',
  ],

  memory: [
    'I still remember {memory}',
    'And I haven’t forgotten {memory}',
    'Every time I think about {memory}, I smile.',
    'I remember clearly {memory}',
  ],

  styleExtra: {
    poetic: [
      line('Some people enter a life like rain: quietly, and then they change everything.', [2, 5], 'poetic'),
      line('If time had a smell, it would smell like the days we shared.', [3, 5], 'poetic'),
    ],
    funny: [
      line('I’m not good with words, so I write instead of stumbling in front of you.', [1, 4], 'funny'),
      line('If love could be weighed, I’d need a bigger box than this letter.', [2, 5], 'funny'),
    ],
    deep: [
      line('I don’t believe in big declarations, I believe in people who stay when it’s hard.', [1, 4], 'deep'),
      line('The truest feelings are the ones that need no explanation.', [1, 4], 'deep'),
    ],
    mature: [
      line('I won’t promise what I don’t have, but I promise honesty.', [1, 3], 'mature'),
      line('Feelings alone aren’t enough; respect matters more.', [1, 3], 'mature'),
    ],
    cute: [
      line('Sometimes a short message is enough to make a day better. This is mine.', [1, 3], 'cute'),
      line('Nothing important today, I just wanted you to smile while reading.', [1, 3], 'cute'),
    ],
  },

  closing: {
    generic: {
      low: [
        'That’s all I wanted to say, the rest my heart already knows.',
        'I hope these words reach you the way I wrote them: simply.',
        'No need to answer, I just wanted you to know.',
      ],
      mid: [
        'Thank you for being in my life, and that isn’t an empty phrase.',
        'I hope the coming days are kinder to us.',
        'That’s what I feel, and I’m leaving it with you.',
      ],
      high: [
        'I love you, and I hope to keep you close.',
        'I’ll stay grateful that our paths crossed.',
        'All I wish is that you are okay, and that I stay close to you.',
      ],
    },
    birthday: ['A happy year to you, and may you get what you wish for.', 'Every year brings you a little closer to your dreams.'],
    apology: ['I won’t rush your answer, take the time you need.', 'Whatever you decide, I wanted you to know I understood my mistake.'],
    reconciliation: ['If you want to talk, I’m here, without blame.', 'Let’s start again, calmly and honestly.'],
    congrats: ['Congratulations, from the heart.', 'I wish you more of this, you deserve it.'],
    encouragement: ['You are not alone, don’t forget that.', 'I’m here whenever you need me.'],
    morning: ['Have a beautiful day.', 'A day that feels like you.'],
    goodnight: ['Sleep well.', 'Sweet dreams.'],
    confession: ['I’m not asking for an answer now, I just wanted to be honest.', 'Say whatever you want, what matters is that I said it.'],
    missing: ['I hope we meet soon.', 'Take care of yourself until then.'],
  },

  whatToSay: {
    openers: [
      'Hey, I know this might not be the best time, but I wanted to speak honestly.',
      'Can I tell you something? I’ll keep it short.',
      'I don’t want to bother you, I just want to clear up one thing.',
      'I spent days looking for how to start, and the simplest way turned out to be the right one.',
    ],
    avoid: [
      'Don’t justify everything at once, and don’t make the other person responsible for your feelings.',
      'Don’t start with “but”, and never say “you always…” or “you never…”.',
      'Don’t turn the message into a threat to leave or an attempt to make them feel guilty.',
      'Don’t demand an immediate answer, and don’t punish their silence.',
    ],
  },
};

/**
 * Arabic + French: we reuse the Darija bank and sprinkle in French phrases,
 * which is exactly how young people in the Maghreb actually write.
 */
export const arFr = {
  ...arDz,
  dir: 'rtl',
  label: 'عربي + فرنسي',
  sprinkle: [
    'Franchement,',
    'vraiment,',
    'tu sais,',
    'c’est vrai,',
    'merci pour tout,',
    'sincèrement,',
  ],
  sprinkleLines: [
    'Franchement, je ne trouve pas les mots, mais je voulais te le dire.',
    'Tu sais quoi ? C’est rare de trouver quelqu’un comme toi.',
    'Merci pour tout, vraiment.',
    'Sincèrement, tu comptes beaucoup pour moi.',
  ],
};

export const BANKS = {
  'ar-msa': arMsa,
  'ar-dz': arDz,
  'ar-fr': arFr,
  fr,
  en,
};

export const getBank = (language) => BANKS[language] || arMsa;
