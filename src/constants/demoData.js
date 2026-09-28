// Demo Seed Data for StudentOS
// Notice: هذه بيانات تجريبية وليست بيانات حقيقية لغرض التجربة والتحقق من سير العمليات End-to-End.

export const DEMO_USERS = {
  student: {
    id: 'user-student-karim',
    role: 'student',
    name: 'كريم بوخالفة',
    email: 'karim.boukhalfa@studentos.dz',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    country: 'الجزائر',
    wilaya: '16 - الجزائر العاصمة',
    level: '2AS',
    stream: 'tech',
    specialization: 'meca',
    streamName: 'تقني رياضي',
    specializationName: 'هندسة ميكانيكية',
    schoolName: 'ثانوية الرياضيات بالقبة - الجزائر',
    familyCode: 'FAM-K7892',
    bio: 'طالب في السنة الثانية ثانوي تقني رياضي تخصص هندسة ميكانيكية، طموحي دراسة هندسة الطيران والروبوتات.',
    streakDays: 14,
    studyMinutesToday: 85,
    studyMinutesWeek: 420,
    totalPoints: 1350,
    levelProgress: 68,
    isDemo: true,
  },

  teacher: {
    id: 'user-teacher-ahmed',
    role: 'teacher',
    name: 'الأستاذ أحمد المنصوري',
    email: 'ahmed.mansouri@studentos.dz',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    country: 'الجزائر',
    wilaya: '16 - الجزائر العاصمة',
    schoolName: 'ثانوية عمر راسم - الجزائر',
    subjects: ['tech-meca', 'math'],
    verificationStatus: 'verified', // 'unverified' | 'pending' | 'verified'
    verificationDate: '2026-08-20',
    verificationDocument: 'شهادة عمل بيداغوجية مصدقة من مديرية التربية لولاية الجزائر وسط',
    bio: 'أستاذ رئيسي للتعليم الثانوي في مادة التكنولوجيا فرع هندسة ميكانيكية والرياضيات، خبرة 12 سنة في التدريس والتحضير للبكالوريا.',
    classesCreatedCount: 2,
    totalStudentsCount: 38,
    isDemo: true,
  },

  parent: {
    id: 'user-parent-mohamed',
    role: 'parent',
    name: 'محمد بوخالفة (ولي أمر)',
    email: 'mohamed.parent@studentos.dz',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    country: 'الجزائر',
    wilaya: '16 - الجزائر العاصمة',
    linkedStudentIds: ['user-student-karim'],
    relationship: 'الأب',
    phone: '+213 555 12 34 56',
    isDemo: true,
  },

  admin: {
    id: 'user-admin-system',
    role: 'admin',
    name: 'إدارة منصة StudentOS',
    email: 'admin@studentos.dz',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: 'Super Admin',
    isDemo: true,
  }
};

export const DEMO_CLASSES = [
  {
    id: 'class-meca-2as-1',
    code: 'MEC-7K42',
    name: '2AS تقني رياضي – هندسة ميكانيكية',
    teacherId: 'user-teacher-ahmed',
    teacherName: 'الأستاذ أحمد المنصوري',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    teacherVerified: true,
    level: '2AS',
    stream: 'tech',
    specialization: 'meca',
    subjectId: 'tech-meca',
    subjectName: 'التكنولوجيا: هندسة ميكانيكية',
    academicYear: '2026/2027',
    description: 'الصف الرسمي لدروس وتمارين واختبارات الهندسة الميكانيكية للسنة الثانية ثانوي تقني رياضي.',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    studentIds: ['user-student-karim', 'std-02', 'std-03', 'std-04', 'std-05'],
    students: [
      { id: 'user-student-karim', name: 'كريم بوخالفة', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', joinedAt: '2026-09-05', completedAssignments: 2, averageScore: 17.5 },
      { id: 'std-02', name: 'ياسين بلحاج', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', joinedAt: '2026-09-06', completedAssignments: 2, averageScore: 16.0 },
      { id: 'std-03', name: 'سارة عماري', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', joinedAt: '2026-09-06', completedAssignments: 1, averageScore: 18.0 },
      { id: 'std-04', name: 'حمزة قادري', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', joinedAt: '2026-09-08', completedAssignments: 2, averageScore: 14.5 },
      { id: 'std-05', name: 'فاطمة الزهراء بن علي', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', joinedAt: '2026-09-10', completedAssignments: 0, averageScore: 0 }
    ],
    announcements: [
      {
        id: 'ann-1',
        title: 'مراجعة شاملة للوحدة الثالثة: أنظمة نقل الحركة بالعجلات المسننة',
        content: 'السلام عليكم أعزائي التلاميذ، سنقوم في الحصة القادمة بمراجعة تطبيقية لحساب نسب النقل وعزم الدوران. يُرجى مراجعة القوانين وحل المسألة رقم 3 من كراس التمارين.',
        createdAt: '2026-09-24',
        pinned: true,
      },
      {
        id: 'ann-2',
        title: 'تذكير بموعد تسليم الواجب المنزلي رقم 1',
        content: 'آخر أجل لتسليم حل دراسة آلية مخفض السرعة هو يوم الخميس القادم على الساعة 20:00 مساءً عبر المنصة.',
        createdAt: '2026-09-22',
        pinned: false,
      }
    ]
  },
  {
    id: 'class-math-2as-2',
    code: 'MTH-9X14',
    name: '2AS رياضيات وتقني رياضي – الرياضيات المتقدمة',
    teacherId: 'user-teacher-ahmed',
    teacherName: 'الأستاذ أحمد المنصوري',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    teacherVerified: true,
    level: '2AS',
    stream: 'tech',
    subjectId: 'math',
    subjectName: 'الرياضيات',
    academicYear: '2026/2027',
    description: 'دورة الدوال العددية، الاشتقاقية، والمتتاليات الحسابية والهندسية للتحضير المتين للبكالوريا.',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    studentIds: ['user-student-karim'],
    students: [
      { id: 'user-student-karim', name: 'كريم بوخالفة', joinedAt: '2026-09-08', completedAssignments: 1, averageScore: 16.5 }
    ],
    announcements: []
  }
];

export const DEMO_LESSONS = [
  {
    id: 'les-meca-detailed-1',
    classId: 'class-meca-2as-1',
    subjectId: 'tech-meca',
    title: 'نظام نقل الحركة بالعجلات المسننة (Engrenages) - التحليل الحركي وحساب نسبة النقل',
    status: 'published', // 'draft' | 'published'
    unitNumber: 3,
    unitTitle: 'الوحدة 3: نقل وتحويل الحركة',
    authorName: 'الأستاذ أحمد المنصوري',
    authorId: 'user-teacher-ahmed',
    createdAt: '2026-09-20',
    summary: 'شرح مبدأ عمل التروس الأسطوانية والمخروطية، عناصر المسنن (القطر الاسمي، الموديول، الخطوة)، وقوانين نسبة النقل r = Z1/Z2 = N2/N1 وعلاقة الاستطاعة الميكانيكية.',
    contentMarkdown: `### 1. مفهوم التروس ونقل الحركة (Systèmes d'engrenages)

التروس هي عناصر ميكانيكية مسننة تستعمل لنقل حركة دورانية بين محورين متقاربين أو متعامدين بدون انزلاق وبمردود طاقوي مرتفع يصل إلى 98%.

#### أنواع التروس الشائعة:
- **العجلات المسننة الأسطوانية ذات أسنان مستقيمة (Engrenages cylindriques à denture droite):** لنقل الحركة بين محورين متوازيين.
- **العجلات المسننة المخروطية (Engrenages coniques):** لنقل الحركة بين محورين متقاطعين (غالباً بزاوية 90°).
- **نظام لولب بدون نهاية وعجلة (Système roue et vis sans fin):** لنسب تخفيض كبيرة جداً ونقل الحركة بين محورين متعامدين غير متقاطعين.

---

### 2. المميزات الهندسية للترس الأسطواني المستقيم

| الخاصية | الرمز | القانون الرياضي | الوحدة |
| :--- | :---: | :---: | :---: |
| **الموديول (Module)** | $m$ | يُحدد من حساب المقاومة | $\\text{mm}$ |
| **عدد الأسنان (Nombre de dents)** | $Z$ | عدد صحيح طبيعي | - |
| **القطر الاسمي (Diamètre primitif)** | $d$ | $d = m \\times Z$ | $\\text{mm}$ |
| **الخطوة (Pas)** | $p$ | $p = \\pi \\times m$ | $\\text{mm}$ |
| **ارتفاع الرأس (Saillie)** | $h_a$ | $h_a = m$ | $\\text{mm}$ |
| **ارتفاع الجذر (Creux)** | $h_f$ | $h_f = 1.25 \\times m$ | $\\text{mm}$ |
| **الارتفاع الكلي للسن (Hauteur totale)** | $h$ | $h = 2.25 \\times m$ | $\\text{mm}$ |
| **قطر القمة (Diamètre de tête)** | $d_a$ | $d_a = d + 2m = m(Z + 2)$ | $\\text{mm}$ |
| **قطر الجذر (Diamètre de pied)** | $d_f$ | $d_f = d - 2.5m = m(Z - 2.5)$ | $\\text{mm}$ |
| **التباعد المحوري (Entraxe)** | $a$ | $a = \\frac{d_1 + d_2}{2} = \\frac{m(Z_1 + Z_2)}{2}$ | $\\text{mm}$ |

---

### 3. حساب نسبة النقل (Rapport de Transmission)

نسبة النقل $r$ بين العجلة القائدة (Meneuse 1) والعجلة المقتادة (Menée 2):

$$r = \\frac{N_2}{N_1} = \\frac{\\omega_2}{\\omega_1} = \\frac{Z_1}{Z_2} = \\frac{d_1}{d_2}$$

حيث:
- $N_1, N_2$: سرعة الدوران بـ $(\\text{tr/min})$.
- $\\omega_1, \\omega_2$: السرعة الزاوية بـ $(\\text{rad/s})$ مع $\\omega = \\frac{2\\pi N}{60}$.
- $Z_1, Z_2$: عدد أسنان العجلة 1 والعجلة 2.

#### ملاحظات هامة:
1. إذا كان $r < 1$: النظام مخفض للسرعة (Réducteur).
2. إذا كان $r > 1$: النظام مضاعف للسرعة (Multiplicateur).
3. عزم الدوران $C$ يتناسب عكساً مع السرعة: $C_2 = C_1 \\times \\frac{N_1}{N_2} \\times \\eta$ (حيث $\\eta$ هو المردود).`,
    keyTerms: [
      { ar: 'الموديول المعياري', fr: 'Module normalisé', en: 'Standard module', def: 'المقاس الأساسي المميز لأبعاد السن والمحدد لمقاومته للجهود' },
      { ar: 'نسبة النقل والتخفيض', fr: 'Rapport de transmission', en: 'Gear ratio', def: 'النسبة بين سرعة الخروج إلى سرعة الدخول' },
      { ar: 'التباعد المحوري', fr: 'Entraxe', en: 'Center distance', def: 'المسافة الخطية الفاصلة بين محوري الدوران' },
      { ar: 'القطر الاسمي', fr: 'Diamètre primitif', en: 'Pitch diameter', def: 'قطر الأسطوانة التخيلية التي تدور بدون انزلاق' }
    ],
    attachments: [
      { name: 'document-technique-engrenages-2as.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'schema-cinematique-reducteur.png', size: '850 KB', type: 'image' }
    ],
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoTitle: 'شرح آليات نقل الحركة وحساب نسبة التخفيض',
    flashcardsCount: 8,
    activeRecallCount: 6
  },
  {
    id: 'les-math-suites-1',
    classId: 'class-math-2as-2',
    subjectId: 'math',
    title: 'المتتاليات الحسابية: العبارة العامة، المجموع وخواص الحدود المتعاقبة',
    status: 'published',
    unitNumber: 3,
    unitTitle: 'الوحدة 3: المتتاليات العددية',
    authorName: 'الأستاذ أحمد المنصوري',
    authorId: 'user-teacher-ahmed',
    createdAt: '2026-09-18',
    summary: 'تعريف المتتالية الحسابية بالأساس r، عبارة الحد العام بدلالة n، المجموع والوسط الحسابي مع براهين ونماذج تطبيقية.',
    contentMarkdown: `### المتتاليات الحسابية (Suites Arithmétiques)

#### 1. التعريف:
تكون المتتالية $(U_n)$ حسابية إذا وفقط إذا وجد عدد حقيقي $r$ (يسمى الأساس) بحيث لكل $n$:
$$U_{n+1} = U_n + r$$

#### 2. عبارة الحد العام:
- بدلالة الحد الأول $U_0$:
  $$U_n = U_0 + n \\cdot r$$
- بدلالة حد كيفي $U_p$:
  $$U_n = U_p + (n - p) \\cdot r$$

#### 3. مجموع $n$ حداً متعاقباً:
$$S = \\frac{\\text{عدد الحدود}}{2} \\times (\\text{الحد الأول} + \\text{الحد الأخير})$$
$$\\text{عدد الحدود} = \\text{دليل النهاية} - \\text{دليل البداية} + 1$$`,
    keyTerms: [
      { ar: 'الأساس', fr: 'La raison', en: 'Common difference', def: 'العدد الثابت الذي يضاف للانتقال من حد إلى الحد الموالي' },
      { ar: 'الوسط الحسابي', fr: 'Moyenne arithmétique', en: 'Arithmetic mean', def: 'إذا كانت a, b, c حدود متعاقبة فإن a + c = 2b' }
    ],
    attachments: [],
    flashcardsCount: 6,
    activeRecallCount: 5
  }
];

export const DEMO_ASSIGNMENTS = [
  {
    id: 'asg-meca-1',
    classId: 'class-meca-2as-1',
    title: 'واجب منزلي: دراسة آلية مخفض السرعة لعلبة تروس صناعية',
    subjectId: 'tech-meca',
    description: 'المطلوب حساب نسبة النقل الشاملة لنظام تخفيض ذي مرحلتين، تحديد سرعة خروج المحور N_s، وحساب أبعاد الترس 1 و 2 (القطر الاسمي وقطر الرأس) إذا كان الموديول m = 2 mm.',
    dueDate: '2026-10-02T20:00:00',
    createdAt: '2026-09-21',
    maxScore: 20,
    status: 'active',
    submissionsCount: 4,
    totalStudents: 5,
    mySubmission: {
      studentId: 'user-student-karim',
      submittedAt: '2026-09-23T16:30:00',
      status: 'graded', // 'submitted' | 'graded'
      score: 18.5,
      teacherFeedback: 'عمل ممتاز ومنهجية واضحة في تطبيق قوانين التروس والموديول. انتبه فقط لوحدة عزم الدوران N.m في السؤال الأخير.',
      files: [{ name: 'حل_واجب_كريم_بوخالفة_هندسة_ميكانيكية.pdf', size: '1.8 MB' }]
    }
  }
];

export const DEMO_TESTS = [
  {
    id: 'test-meca-transmission-1',
    classId: 'class-meca-2as-1',
    title: 'اختبار تقييمي شامل: نقل الحركة والعجلات المسننة (Génie Mécanique)',
    subjectId: 'tech-meca',
    durationMinutes: 30,
    totalPoints: 20,
    mode: 'both', // 'practice' | 'exam' | 'both'
    description: 'اختبار تفاعلي يغطي الجوانب النظرية والحسابية والتطبيقية لعناصر التروس ونسب النقل.',
    questions: [
      {
        id: 'q-1',
        type: 'mcq',
        question: 'ما هو القانون الرياضي الصحيح لحساب القطر الاسمي (Diamètre primitif) $d$ لترس أسطواني ذي أسنان مستقيمة؟',
        options: [
          { id: 'opt-a', text: '$d = m \\times Z$ (حاصل ضرب الموديول في عدد الأسنان)', isCorrect: true },
          { id: 'opt-b', text: '$d = m \\times (Z + 2)$', isCorrect: false },
          { id: 'opt-c', text: '$d = \\frac{p}{\\pi} \\times (Z - 2.5)$', isCorrect: false },
          { id: 'opt-d', text: '$d = 2 \\times m \\times Z$', isCorrect: false }
        ],
        explanation: 'القطر الاسمي d هو أساس جميع الحسابات الهندسية للسن ويساوي دائمًا حاصل ضرب الموديول m في عدد الأسنان Z.'
      },
      {
        id: 'q-2',
        type: 'true_false',
        question: 'عندما تكون نسبة النقل $r < 1$، فإن النظام الميكانيكي يعتبر مضاعفاً للسرعة (Multiplicateur).',
        correctAnswer: false,
        explanation: 'خطأ؛ عندما تكون نسبة النقل $r < 1$ (أي سرعة الخروج أصغر من سرعة الدخول $N_2 < N_1$)، فإن النظام يعتبر مخفضاً للسرعة (Réducteur).'
      },
      {
        id: 'q-3',
        type: 'matching',
        question: 'صل بين كل عنصر ميكانيكي ووظيفته الأساسية في نقل الحركة:',
        pairs: [
          { left: 'التروس الأسطوانية المستقيمة', right: 'نقل الحركة بين محورين متوازيين' },
          { left: 'التروس المخروطية', right: 'نقل الحركة بين محورين متعامدين متقاطعين' },
          { left: 'نظام برغي وصامولة', right: 'تحويل الحركة الدورانية إلى حركة مستقيمة' },
          { left: 'المدحرجات ذات الكريات', right: 'التوجيه الدوراني والتقليل من الاحتكاك' }
        ],
        explanation: 'كل عنصر ميكانيكي صُمم هندسياً لتحقيق وظيفة تقنية محددة في السلسلة الحركية.'
      },
      {
        id: 'q-4',
        type: 'ordering',
        question: 'رتّب الخطوات المنهجية لحساب وتصميم نظام نقل حركة بالعجلات المسننة:',
        items: [
          'تحديد دفتر الشروط ونسبة التخفيض المطلوبة $r$',
          'اختيار موديول السن $m$ انطلاقاً من شرط مقاومة المواد RDM',
          'حساب أقطار التروس $d_1$ و $d_2$ والتباعد المحوري $a$',
          'التحقق من شرط عدم التدخل والتداخل بين الأسنان'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: 'يبدأ التصميم دائماً من دفتر الشروط ثم حساب المقاومة لاختيار الموديول، تليها الحسابات الهندسية وأخيراً التحقق الديناميكي.'
      },
      {
        id: 'q-5',
        type: 'calculation',
        question: 'محرك كهربائي يدور بسرعة $N_1 = 1500 \\text{ tr/min}$، يدير عجلة قائدة ذات $Z_1 = 20$ سناً، موصولة بعجلة مقتادة ذات $Z_2 = 60$ سناً. احسب نسبة النقل $r$ وسرعة دوران الخروج $N_2$ بـ (tr/min).',
        formulaHint: 'r = Z1 / Z2 = N2 / N1 => N2 = N1 * (Z1 / Z2)',
        correctNumericAnswer: 500,
        unit: 'tr/min',
        tolerance: 0.1,
        stepByStepSolution: `1. حساب نسبة النقل:
$$r = \\frac{Z_1}{Z_2} = \\frac{20}{60} = \\frac{1}{3} \\approx 0.333$$
2. حساب سرعة دوران الخروج $N_2$:
$$N_2 = N_1 \\times r = 1500 \\times \\frac{1}{3} = 500 \\text{ tr/min}$$
إذن سرعة الخروج هي 500 دورة في الدقيقة.`
      }
    ]
  }
];

export const DEMO_FLASHCARDS = [
  {
    id: 'fc-1',
    subjectId: 'tech-meca',
    subjectName: 'هندسة ميكانيكية',
    topic: 'العجلات المسننة',
    question: 'ما هو تعريف الموديول المعياري (Module m) في التروس؟',
    answer: 'هو البعد القياسي الهندسي الذي يعبر عن نسبة الخطوة إلى العدد π (m = p/π)، وتصنع العجلات المسننة المتوافقة لنفس الموديول لضمان التعشيق.',
    level: 4, // 1 -> 2 -> 4 -> 7 -> 14 -> 30
    nextReviewDate: '2026-09-28',
    masteryScore: 85,
    intervalDays: 4
  },
  {
    id: 'fc-2',
    subjectId: 'tech-meca',
    subjectName: 'هندسة ميكانيكية',
    topic: 'التحليل الوظيفي',
    question: 'ما هي أداة التعبير عن الحاجة (Bête à cornes) وما هي أسئلتها الثلاثة؟',
    answer: 'أداة بيانية تحدد جدوى المنتج بالإجابة عن: 1. لمن يقدم الخدمة؟ 2. على ماذا يؤثر؟ 3. في أي هدف (ما هي الغاية؟).',
    level: 7,
    nextReviewDate: '2026-10-03',
    masteryScore: 95,
    intervalDays: 7
  },
  {
    id: 'fc-3',
    subjectId: 'math',
    subjectName: 'الرياضيات',
    topic: 'المتتاليات الحسابية',
    question: 'اكتب عبارة الحد العام لمتتالية حسابية بدلالة حد كيفي Up والأساس r.',
    answer: 'Un = Up + (n - p) × r',
    level: 2,
    nextReviewDate: '2026-09-29',
    masteryScore: 70,
    intervalDays: 2
  },
  {
    id: 'fc-4',
    subjectId: 'phys',
    subjectName: 'العلوم الفيزيائية',
    topic: 'الطاقة الحركية',
    question: 'ما هي عبارة الطاقة الحركية لجسم صلب في حركة انسحابية كتلته m وسرعته v؟',
    answer: 'Ec = 1/2 × m × v² (بوحدة الجول Joule حيث m بالكيلوغرام و v بالمتر/ثانية)',
    level: 1,
    nextReviewDate: '2026-09-27',
    masteryScore: 50,
    intervalDays: 1
  }
];

export const DEMO_TASKS = [
  {
    id: 'task-1',
    title: 'مراجعة قوانين التروس والتحضير لاختبار الهندسة الميكانيكية',
    subjectId: 'tech-meca',
    subjectName: 'هندسة ميكانيكية',
    priority: 'high', // 'low' | 'medium' | 'high'
    dueDate: '2026-09-28',
    estimatedMinutes: 45,
    completed: false,
    category: 'revision'
  },
  {
    id: 'task-2',
    title: 'حل تمارين المتتاليات الحسابية من صفحة 42 في الكتاب المدرسي',
    subjectId: 'math',
    subjectName: 'الرياضيات',
    priority: 'medium',
    dueDate: '2026-09-29',
    estimatedMinutes: 60,
    completed: true,
    category: 'exercise'
  },
  {
    id: 'task-3',
    title: 'تسليم واجب دراسة آلية مخفض السرعة للأستاذ أحمد',
    subjectId: 'tech-meca',
    subjectName: 'هندسة ميكانيكية',
    priority: 'high',
    dueDate: '2026-10-02',
    estimatedMinutes: 30,
    completed: true,
    category: 'assignment'
  },
  {
    id: 'task-4',
    title: 'حفظ تواريخ الوحدة الأولى في مادة التاريخ (مؤتمر يالطا وحلف وارسو)',
    subjectId: 'hist',
    subjectName: 'التاريخ والجغرافيا',
    priority: 'low',
    dueDate: '2026-09-30',
    estimatedMinutes: 25,
    completed: false,
    category: 'memorization'
  }
];

export const DEMO_SCHEDULE_EVENTS = [
  { id: 'sch-1', day: 'الأحد', time: '08:00 - 10:00', title: 'التكنولوجيا: هندسة ميكانيكية (حصة تطبيقية)', type: 'school', color: '#f59e0b' },
  { id: 'sch-2', day: 'الأحد', time: '10:00 - 12:00', title: 'الرياضيات (درس وتمارين)', type: 'school', color: '#3b82f6' },
  { id: 'sch-3', day: 'الأحد', time: '17:30 - 18:30', title: 'جلسة تركيز StudentOS: حل تمارين التروس', type: 'study', color: '#1ea150' },
  { id: 'sch-4', day: 'الأحد', time: '19:00 - 19:30', title: 'مراجعة بطاقات Spaced Repetition', type: 'revision', color: '#8b5cf6' },
  { id: 'sch-5', day: 'الإثنين', time: '08:00 - 10:00', title: 'العلوم الفيزيائية (مخبر)', type: 'school', color: '#8b5cf6' },
  { id: 'sch-6', day: 'الإثنين', time: '10:00 - 12:00', title: 'اللغة الفرنسية والإنجليزية', type: 'school', color: '#6366f1' },
  { id: 'sch-7', day: 'الإثنين', time: '18:00 - 19:00', title: 'ورد القرآن ومراجعة التاريخ', type: 'spiritual', color: '#10b981' }
];
