// Curriculum database with authentic Algerian Ministry structure & units
// Sources: 'official' (وزارة التربية الوطنية), 'studentos_reviewed' (قاعدة بيانات StudentOS), 'user_uploaded' (مرفوع)

export const CURRICULA_DATABASE = {
  // 2AS Génie Mécanique (هندسة ميكانيكية)
  '2AS-tech-meca-tech-meca': {
    id: 'curr-2as-meca',
    subjectId: 'tech-meca',
    subjectName: 'التكنولوجيا: هندسة ميكانيكية',
    levelId: '2AS',
    streamId: 'tech',
    specId: 'meca',
    title: 'المنهاج الرسمي للهندسة الميكانيكية - السنة الثانية ثانوي',
    source: 'official', // 'official' | 'studentos_reviewed' | 'user_uploaded'
    sourceLabel: 'وزارة التربية الوطنية - المفتشية العامة للبيداغوجيا',
    verifiedDate: '2026-09-01',
    description: 'البرنامج السنوي المعتمد لمادة التكنولوجيا فرع هندسة ميكانيكية',
    units: [
      {
        id: 'unit-meca-1',
        number: 1,
        title: 'الوحدة 1: التحليل الوظيفي والنظام الآلي (Analyse Fonctionnelle & Système Automatisé)',
        lessons: [
          { id: 'les-meca-1-1', title: 'دفتر الشروط الوظيفي وأداة التعبير عن الحاجة (Bête à cornes)', status: 'mastered' },
          { id: 'les-meca-1-2', title: 'مخطط الوظائف وأداة التفاعل (Pieuvre)', status: 'mastered' },
          { id: 'les-meca-1-3', title: 'التحليل التنازلي ونمذجة الأنظمة SADT', status: 'review' },
          { id: 'les-meca-1-4', title: 'بنية النظام الآلي (الجزء الآمر وجزء التحكم وجزء العمليات)', status: 'mastered' }
        ]
      },
      {
        id: 'unit-meca-2',
        number: 2,
        title: 'الوحدة 2: الرسم التقني وقراءة المخططات الصناعية (Dessin Technique & DAO)',
        lessons: [
          { id: 'les-meca-2-1', title: 'المساقط العمودية والمقاطع والمستويات المقطوعة (Coupes et Sections)', status: 'mastered' },
          { id: 'les-meca-2-2', title: 'الترقيم والأبعاد الوظيفية (Cotation Fonctionnelle)', status: 'review' },
          { id: 'les-meca-2-3', title: 'سلسلة الأبعاد والتسامحات الهندسية والشكلية (Tolérances)', status: 'weak' },
          { id: 'les-meca-2-4', title: 'حالات عدم التوافق وحساب الخلوص (Jeux et Ajustements ISO)', status: 'weak' }
        ]
      },
      {
        id: 'unit-meca-3',
        number: 3,
        title: 'الوحدة 3: نقل وتحويل الحركة (Transmission et Transformation de Mouvement)',
        lessons: [
          { id: 'les-meca-3-1', title: 'نقل الحركة بالعجلات المسننة والتروس الإسطوانية والمخروطية (Engrenages)', status: 'mastered' },
          { id: 'les-meca-3-2', title: 'حساب نسبة النقل والسرعة الزاوية والاستطاعة (Rapport de transmission)', status: 'review' },
          { id: 'les-meca-3-3', title: 'نقل الحركة بالسيور والبكرات وسلاسل الدفع (Courroies et Chaînes)', status: 'not_studied' },
          { id: 'les-meca-3-4', title: 'أنظمة تحويل الحركة (نظام برغي-صامولة، نظام حدبة، نظام ذراع-مرفق)', status: 'not_studied' }
        ]
      },
      {
        id: 'unit-meca-4',
        number: 4,
        title: 'الوحدة 4: الوصلات الميكانيكية والتوجيه الحركي (Guidage et Liaisons)',
        lessons: [
          { id: 'les-meca-4-1', title: 'التوجيه الدوراني بالمدحرجات (Roulements à billes)', status: 'not_studied' },
          { id: 'les-meca-4-2', title: 'التوجيه الخطي بالانزلاق والوسادات (Coussinets)', status: 'not_studied' },
          { id: 'les-meca-4-3', title: 'الوصلات الثابتة القابلة للتفكيك وغير القابلة للتفكيك', status: 'not_studied' }
        ]
      },
      {
        id: 'unit-meca-5',
        number: 5,
        title: 'الوحدة 5: مقاومة المواد الميكانيكية RDM والجهود البسيطة',
        lessons: [
          { id: 'les-meca-5-1', title: 'الشد البسيط والانضغاط البسيط (Traction et Compression)', status: 'not_studied' },
          { id: 'les-meca-5-2', title: 'القص البسيط وعزم الالتواء (Cisaillement et Torsion)', status: 'not_studied' },
          { id: 'les-meca-5-3', title: 'شرط المقاومة ومعامل الأمان (Condition de résistance & Sécurité)', status: 'not_studied' }
        ]
      }
    ]
  },

  // 2AS Math / Tech Math - Mathematics (الرياضيات)
  '2AS-tech-math': {
    id: 'curr-2as-math',
    subjectId: 'math',
    subjectName: 'الرياضيات',
    levelId: '2AS',
    streamId: 'tech',
    title: 'البرنامج السنوي لمادة الرياضيات - 2AS تقني رياضي ورياضيات',
    source: 'official',
    sourceLabel: 'وزارة التربية الوطنية - اللجنة الوطنية للمناهج',
    verifiedDate: '2026-09-01',
    description: 'البرنامج السنوي الرسمي لمادة الرياضيات لشعبتي الرياضيات والتقني رياضي',
    units: [
      {
        id: 'unit-math-1',
        number: 1,
        title: 'الوحدة 1: الدوال العددية وعموميات حول الدوال',
        lessons: [
          { id: 'les-math-1-1', title: 'تركيب الدوال والعمليات الجبرية على الدوال', status: 'mastered' },
          { id: 'les-math-1-2', title: 'اتجاه التغير وشفعية الدوال والدوال المرجعية', status: 'mastered' },
          { id: 'les-math-1-3', title: 'كثيرات الحدود والتحليل باستخدام جذور الحدودية', status: 'review' }
        ]
      },
      {
        id: 'unit-math-2',
        number: 2,
        title: 'الوحدة 2: الاشتقاقية وتطبيقات الاشتقاق',
        lessons: [
          { id: 'les-math-2-1', title: 'العدد المشتق، المماس، والتقريب التآلفي', status: 'review' },
          { id: 'les-math-2-2', title: 'مشتقات الدوال المألوفة ومشتق مركب دالتين', status: 'weak' },
          { id: 'les-math-2-3', title: 'اتجاه التغير ونقط الانعطاف والقيم الحدية', status: 'review' }
        ]
      },
      {
        id: 'unit-math-3',
        number: 3,
        title: 'الوحدة 3: المتتاليات العددية (Suites Numériques)',
        lessons: [
          { id: 'les-math-3-1', title: 'توليد متتالية والتمثيل البياني لحدودها', status: 'mastered' },
          { id: 'les-math-3-2', title: 'المتتاليات الحسابية: العبارة العامة والمجموع والخواص', status: 'mastered' },
          { id: 'les-math-3-3', title: 'المتتاليات الهندسية: العبارة العامة ونهاية المتتالية', status: 'review' },
          { id: 'les-math-3-4', title: 'الاستدلال بالتراجع وتطبيقاته', status: 'weak' }
        ]
      },
      {
        id: 'unit-math-4',
        number: 4,
        title: 'الوحدة 4: النهايات والاستمرارية والسلوك المقارب',
        lessons: [
          { id: 'les-math-4-1', title: 'نهايات الدوال المرجعية وحساب النهايات عند اللانهاية وعند عدد', status: 'not_studied' },
          { id: 'les-math-4-2', title: 'حالات عدم التعيين وطرق إزالتها (التحليل، المرافق، الاختزال)', status: 'not_studied' },
          { id: 'les-math-4-3', title: 'المستقيمات المقاربة (الأفقية، العمودية، والمائلة)', status: 'not_studied' }
        ]
      },
      {
        id: 'unit-math-5',
        number: 5,
        title: 'الوحدة 5: الجداء السلمي والهندسة الفضائية والتحويلات النقطية',
        lessons: [
          { id: 'les-math-5-1', title: 'عبارات الجداء السلمي وتطبيقاته في حساب المسافات والزوايا', status: 'not_studied' },
          { id: 'les-math-5-2', title: 'معادلة مستقيم ودائرة والمجموعات النقطية', status: 'not_studied' }
        ]
      }
    ]
  },

  // 2AS Physics (العلوم الفيزيائية)
  '2AS-tech-phys': {
    id: 'curr-2as-phys',
    subjectId: 'phys',
    subjectName: 'العلوم الفيزيائية',
    levelId: '2AS',
    streamId: 'tech',
    title: 'المنهاج الرسمي للعلوم الفيزيائية - 2AS تقني رياضي ورياضيات',
    source: 'official',
    sourceLabel: 'وزارة التربية الوطنية',
    verifiedDate: '2026-09-01',
    description: 'المجالات الفيزيائية والكيميائية المعتمدة وفق التدرج السنوي',
    units: [
      {
        id: 'unit-phys-1',
        number: 1,
        title: 'المجال 1: الميكانيك والطاقة - العمل والطاقة الحركية الانسحابية والدورانية',
        lessons: [
          { id: 'les-phys-1-1', title: 'مفهوم العمل وقوة ثابتة والتحويل الميكانيكي للطاقة', status: 'mastered' },
          { id: 'les-phys-1-2', title: 'الطاقة الحركية لجسم صلب في حركة انسحابية ومبدأ انحفاظ الطاقة', status: 'mastered' },
          { id: 'les-phys-1-3', title: 'حركة جسم صلب في دوران حول محور ثابت وعزم القوة وعزم العطالة', status: 'review' }
        ]
      },
      {
        id: 'unit-phys-2',
        number: 2,
        title: 'المجال 2: الطاقة الكامنة والطاقة الداخلية',
        lessons: [
          { id: 'les-phys-2-1', title: 'الطاقة الكامنة الثقالية Epp والطاقة الكامنة المرونية Epe', status: 'review' },
          { id: 'les-phys-2-2', title: 'مفهوم الطاقة الداخلية والتحويل الحراري Q والسعة الحرارية', status: 'weak' }
        ]
      },
      {
        id: 'unit-phys-3',
        number: 3,
        title: 'المجال 3: الظواهر الكهربائية والمغناطيسية',
        lessons: [
          { id: 'les-phys-3-1', title: 'مفهوم الحقل الكهرومغناطيسي وقانون لابلاص (Laplace)', status: 'not_studied' },
          { id: 'les-phys-3-2', title: 'التحريض الكهرومغناطيسي وقانون فاراداي ولينز', status: 'not_studied' }
        ]
      }
    ]
  },

  // 3AS BAC Génie Mécanique
  '3AS-tech-meca-tech-meca': {
    id: 'curr-3as-meca',
    subjectId: 'tech-meca',
    subjectName: 'التكنولوجيا: هندسة ميكانيكية (BAC)',
    levelId: '3AS',
    streamId: 'tech',
    specId: 'meca',
    title: 'المنهاج الوزاري النهائي لبكالوريا الهندسة الميكانيكية - 3AS',
    source: 'official',
    sourceLabel: 'الديوان الوطني للامتحانات والمسابقات ONEC & وزارة التربية',
    verifiedDate: '2026-09-01',
    description: 'برنامج التحضير لبكالوريا التعليم الثانوي في الهندسة الميكانيكية',
    units: [
      {
        id: 'unit-3as-meca-1',
        number: 1,
        title: 'الوحدة 1: آليات التحويل ونقل الحركة المعقدة (Systèmes de Transmission BAC)',
        lessons: [
          { id: 'les-3as-m-1-1', title: 'القطارات المسننة البسيطة والمركبة (Trains d’engrenages ordinaires)', status: 'review' },
          { id: 'les-3as-m-1-2', title: 'القطارات الفلكية والتروس التداويرية (Trains épicycloïdaux)', status: 'weak' },
          { id: 'les-3as-m-1-3', title: 'أنظمة الربط المؤقت: القوابض والمكابح (Embrayages et Freins)', status: 'mastered' },
          { id: 'les-3as-m-1-4', title: 'أنظمة عدم الرجوع والوصلات المرنة ومفاصل كاردان (Accouplements et Joints)', status: 'review' }
        ]
      },
      {
        id: 'unit-3as-meca-2',
        number: 2,
        title: 'الوحدة 2: التحليل البنيوي والمقاومة الميكانيكية للمواد RDM المتقدمة',
        lessons: [
          { id: 'les-3as-m-2-1', title: 'الانحناء المستوي البسيط (Flexion plane simple)', status: 'review' },
          { id: 'les-3as-m-2-2', title: 'مخططات عزم الانحناء والجهد القاطع (Diagrammes Mfz et Ty)', status: 'weak' },
          { id: 'les-3as-m-2-3', title: 'الالتواء البسيط على الأعمدة الدائرية (Torsion simple des arbres)', status: 'review' }
        ]
      },
      {
        id: 'unit-3as-meca-3',
        number: 3,
        title: 'الوحدة 3: دراسة الصنع والآليات ومسارات التصنيع (Procédés d’obtention des pièces)',
        lessons: [
          { id: 'les-3as-m-3-1', title: 'القولبة والتشكيل بالسباكة والحدادة (Moulage et Forgeage)', status: 'not_studied' },
          { id: 'les-3as-m-3-2', title: 'التشغيل بالقطع: الخراطة والتفريز (Tournage et Fraisage)', status: 'not_studied' },
          { id: 'les-3as-m-3-3', title: 'عقد الطور ومخطط تصنيع القطع (Contrat de phase)', status: 'not_studied' }
        ]
      }
    ]
  }
};

// Function to look up curriculum or return standard not found message
export const getCurriculumForSubject = (levelId, streamId, specId, subjectId) => {
  const compositeKey1 = `${levelId}-${streamId}-${specId}-${subjectId}`;
  const compositeKey2 = `${levelId}-${streamId}-${subjectId}`;
  
  if (CURRICULA_DATABASE[compositeKey1]) {
    return CURRICULA_DATABASE[compositeKey1];
  }
  if (CURRICULA_DATABASE[compositeKey2]) {
    return CURRICULA_DATABASE[compositeKey2];
  }
  
  // Return placeholder notice
  return {
    notFound: true,
    message: 'البرنامج غير متوفر حاليًا في قاعدة البيانات.',
    subjectId,
    levelId,
    streamId,
    specId
  };
};
