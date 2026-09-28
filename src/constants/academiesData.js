// Language & Skill Academy Data for Algerian Secondary Students

export const LANGUAGE_COURSES = [
  {
    id: 'lang-eng-bac',
    title: 'اللغة الإنجليزية للتعليم الثانوي وتحضير البكالوريا',
    language: 'English',
    flag: '🇬🇧',
    level: 'Intermediate - B1/B2',
    description: 'تمكن من قواعد الإنجليزية، المصطلحات العلمية والتقنية، تقنيات كتابة الفقرة (Written Expression) وأسئلة فهم النص (Reading Comprehension).',
    modules: [
      {
        id: 'mod-eng-1',
        title: 'الوحدة 1: Ethics in Business & Science (الأخلاق في الأعمال والعلوم)',
        topics: [
          {
            id: 'top-eng-1-1',
            title: 'Vocabulary: Corruption, Counterfeiting, Fraud & Integrity',
            terms: [
              { term: 'Counterfeit', pos: 'adj / verb', meaning: 'مزوّر / يقلد بضائع غير أصلية', example: 'Counterfeiting medicines harms public health.' },
              { term: 'Bribery', pos: 'noun', meaning: 'الرشوة', example: 'The company was accused of bribery in public tenders.' },
              { term: 'Embezzlement', pos: 'noun', meaning: 'اختلاس الأموال العامة', example: 'He was convicted for embezzlement of school funds.' },
              { term: 'Integrity', pos: 'noun', meaning: 'النزاهة والاستقامة', example: 'Engineers must work with professional integrity.' }
            ],
            grammar: {
              rule: 'Conditionals & Wishing: "It is high time + past simple" & "I wish + past perfect"',
              examples: [
                'It is high time citizens fought fraud together.',
                'I wish I had prepared better for the engineering exam.'
              ]
            }
          },
          {
            id: 'top-eng-1-2',
            title: 'Grammar: Expressing Concession & Cause (Although, Despite, Because of)',
            grammar: {
              rule: 'Although / Even though + Subject + Verb | In spite of / Despite + Noun / Gerund',
              examples: [
                'Although the gears were worn, the machine kept running.',
                'Despite having low speed, the engine delivered immense torque.'
              ]
            }
          }
        ]
      },
      {
        id: 'mod-eng-2',
        title: 'الوحدة 2: Technology & Innovation (التكنولوجيا والابتكار الهندسي)',
        topics: [
          {
            id: 'top-eng-2-1',
            title: 'Technical Terminology for Algerian Engineers & Scientists',
            terms: [
              { term: 'Kinematics', pos: 'noun', meaning: 'علم الحركة (الحركيات)', example: 'Kinematics studies motion without considering its causes.' },
              { term: 'Thermodynamics', pos: 'noun', meaning: 'الديناميكا الحرارية', example: 'The engine efficiency is governed by the laws of thermodynamics.' },
              { term: 'Automation', pos: 'noun', meaning: 'الأتمتة والتشغيل الآلي', example: 'Industrial robots drive modern factory automation.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'lang-fr-bac',
    title: 'اللغة الفرنسية للثانوي والمنهجية الرسمية',
    language: 'Français',
    flag: '🇫🇷',
    level: 'Intermédiaire - B1/B2',
    description: 'إتقان النص التاريخي (Texte d\'histoire)، النص الحجاجي (Texte argumentatif)، وتقنية التلخيص والتقرير النقدي (Compte rendu objectif et critique).',
    modules: [
      {
        id: 'mod-fr-1',
        title: 'المحور 1: Le Texte d’Histoire (النص التاريخي وثورة التحرير الجزائرية)',
        topics: [
          {
            id: 'top-fr-1-1',
            title: 'Vocabulaire de l’histoire et de la mémoire',
            terms: [
              { term: 'Témoignage', pos: 'nom mas.', meaning: 'شهادة حية', example: 'Le témoignage du moudjahid apporte des détails précieux.' },
              { term: 'Exaction', pos: 'nom fém.', meaning: 'تجاوزات وجرائم استعمارية', example: 'Les exactions commises pendant la colonisation.' },
              { term: 'Chronologie', pos: 'nom fém.', meaning: 'التسلسل الزمني للأحداث', example: 'Respecter la chronologie des événements historiques.' }
            ],
            grammar: {
              rule: 'Le discours rapporté (Direct & Indirect) et la visée communicative',
              examples: [
                'Il déclare : « La révolution vaincra » → Il déclare que la révolution vaincra.',
                'La visée informative et testimoniale de l’auteur.'
              ]
            }
          }
        ]
      }
    ]
  }
];

export const SKILL_CATEGORIES = [
  {
    id: 'prog',
    category: 'البرمجة والتكنولوجيا (Programming & AI)',
    icon: 'Code2',
    color: '#3b82f6',
    skills: [
      {
        id: 'sk-py-1',
        title: 'بايثون للطلاب والمهندسين (Python for Science & AI)',
        level: 'مبتدئ إلى متوسط',
        duration: '12 ساعة',
        rating: 4.9,
        enrolledCount: 1240,
        tags: ['Python', 'Data Science', 'Automation'],
        description: 'تعلم لغة بايثون من الصفر مع تطبيقات مباشرة في حل معادلات الرياضيات والفيزياء ورسم المنحنيات البيانية.',
        modulesCount: 8,
        completedPercentage: 45
      },
      {
        id: 'sk-web-1',
        title: 'تطوير المواقع الحديثة (Full-Stack Web: React & Tailwind)',
        level: 'متوسط',
        duration: '20 ساعة',
        rating: 4.8,
        enrolledCount: 950,
        tags: ['React', 'JavaScript', 'CSS'],
        description: 'بناء تطبيقات ويب متكاملة، تصميم واجهات تفاعلية سريعة، وربطها بقواعد البيانات.',
        modulesCount: 10,
        completedPercentage: 20
      },
      {
        id: 'sk-ai-1',
        title: 'أساسيات الذكاء الاصطناعي وتعلم الآلة (AI & Machine Learning)',
        level: 'متوسط',
        duration: '15 ساعة',
        rating: 4.9,
        enrolledCount: 1420,
        tags: ['AI', 'Neural Networks', 'Algorithms'],
        description: 'فهم كيف تفكر الشبكات العصبية، نماذج اللغة LLMs، وتطبيقات الرؤية الحاسوبية في الصناعة.',
        modulesCount: 6,
        completedPercentage: 10
      },
      {
        id: 'sk-cyber-1',
        title: 'أساسيات الأمن السيبراني وحماية النظم (Cybersecurity Basics)',
        level: 'مبتدئ',
        duration: '10 ساعات',
        rating: 4.7,
        enrolledCount: 810,
        tags: ['Security', 'Cryptography', 'Networks'],
        description: 'التشفير، حماية البيانات، الشبكات، والوقاية من الهجمات الإلكترونية والهندسة الاجتماعية.',
        modulesCount: 5,
        completedPercentage: 0
      }
    ]
  },
  {
    id: 'creative',
    category: 'الإبداع والتصميم الرقمي (Creative & Media)',
    icon: 'Palette',
    color: '#ec4899',
    skills: [
      {
        id: 'sk-des-1',
        title: 'تصميم الواجهات وتجربة المستخدم (UI/UX Design with Figma)',
        level: 'مبتدئ',
        duration: '14 ساعة',
        rating: 4.8,
        enrolledCount: 680,
        tags: ['Figma', 'UI Design', 'UX Research'],
        description: 'مبادئ تصميم التطبيقات، التناسق اللوني، وتصميم تجارب مستخدم مريحة وجذابة.',
        modulesCount: 7,
        completedPercentage: 0
      },
      {
        id: 'sk-vid-1',
        title: 'مونتاج الفيديو وصناعة المحتوى التعليمي',
        level: 'مبتدئ إلى متوسط',
        duration: '12 ساعة',
        rating: 4.7,
        enrolledCount: 530,
        tags: ['Video Editing', 'Premiere', 'DaVinci'],
        description: 'تقطيع الفيديو، تصحيح الألوان، إضافة المؤثرات البصرية وتصميم شروحات تعليمية احترافية.',
        modulesCount: 6,
        completedPercentage: 0
      }
    ]
  },
  {
    id: 'practical',
    category: 'المهارات التطبيقية والهندسية (Engineering & Practical)',
    icon: 'Wrench',
    color: '#f59e0b',
    skills: [
      {
        id: 'sk-cad-1',
        title: 'الرسم والنمذجة ثلاثية الأبعاد 3D CAD (SolidWorks & Fusion 360)',
        level: 'متوسط',
        duration: '18 ساعة',
        rating: 4.9,
        enrolledCount: 1100,
        tags: ['SolidWorks', 'CAD', '3D Design', 'Mechanical'],
        description: 'تصميم القطع الميكانيكية ثلاثية الأبعاد، التجميع، إعداد المخططات التنفيذية والتحليل الحركي.',
        modulesCount: 9,
        completedPercentage: 60
      },
      {
        id: 'sk-ard-1',
        title: 'الإلكترونيات والتحكم بـ Arduino و Raspberry Pi',
        level: 'مبتدئ',
        duration: '14 ساعة',
        rating: 4.8,
        enrolledCount: 790,
        tags: ['Arduino', 'Robotics', 'IoT', 'Electronics'],
        description: 'برمجة الحساسات، المحركات الخطية والخطوية، وبناء مشاريع روبوتية وأنظمة ذكية.',
        modulesCount: 7,
        completedPercentage: 0
      }
    ]
  },
  {
    id: 'personal',
    category: 'المهارات الشخصية والتفوق الدراسي (Soft Skills)',
    icon: 'Sparkles',
    color: '#10b981',
    skills: [
      {
        id: 'sk-tm-1',
        title: 'إدارة الوقت والتركيز العميق والتغلب على التسويف',
        level: 'شامل',
        duration: '6 ساعات',
        rating: 4.9,
        enrolledCount: 2300,
        tags: ['Productivity', 'Deep Work', 'Habits'],
        description: 'تقنيات إدارة ساعات اليوم الدراسي، جلسات التركيز العميق، وجدولة المراجعات بكفاءة.',
        modulesCount: 4,
        completedPercentage: 80
      },
      {
        id: 'sk-ps-1',
        title: 'فن الإلقاء والتحدث أمام الجمهور (Public Speaking & Presentation)',
        level: 'شامل',
        duration: '8 ساعات',
        rating: 4.8,
        enrolledCount: 640,
        tags: ['Communication', 'Presentation'],
        description: 'تقديم العروض التقديمية في الثانوية والجامعة، لغة الجسد، ونبرة الصوت والإقناع.',
        modulesCount: 5,
        completedPercentage: 0
      }
    ]
  }
];
