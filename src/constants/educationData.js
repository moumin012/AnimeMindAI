// Algerian Secondary Education Structure
// Levels -> Streams -> Specializations -> Subjects with coefficients and hours

export const ALGERIAN_LEVELS = [
  {
    id: '1AS',
    name: 'السنة الأولى ثانوي (1AS)',
    shortName: '1AS',
    description: 'الجذع المشترك - مرحلة التوجيه واكتشاف الميول العلمية والأدبية',
    streams: [
      {
        id: '1as-sci',
        name: 'جذع مشترك علوم وتكنولوجيا',
        shortName: 'ع.ت',
        description: 'المسار العلمي والتقني المؤهل لشعب الرياضيات والعلوم والتقني رياضي والتسيير',
        specializations: [],
        subjects: [
          { id: 'math', name: 'الرياضيات', coef: 5, hours: 5, color: '#3b82f6', icon: 'Calculator' },
          { id: 'phys', name: 'العلوم الفيزيائية', coef: 4, hours: 4, color: '#8b5cf6', icon: 'Atom' },
          { id: 'nat', name: 'علوم الطبيعة والحياة', coef: 4, hours: 4, color: '#10b981', icon: 'Dna' },
          { id: 'tech', name: 'التكنولوجيا (هندسة كهربائية وميكانيكية وطرائق ومدنية)', coef: 2, hours: 2, color: '#f59e0b', icon: 'Cpu' },
          { id: 'info', name: 'الإعلام الآلي', coef: 2, hours: 2, color: '#06b6d4', icon: 'Terminal' },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 3, color: '#14b8a6', icon: 'Globe' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 3, color: '#eab308', icon: 'Map' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: '1as-lit',
        name: 'جذع مشترك آداب',
        shortName: 'آداب',
        description: 'المسار الأدبي المؤهل لشعب الآداب والفلسفة واللغات الأجنبية',
        specializations: [],
        subjects: [
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 5, hours: 5, color: '#ec4899', icon: 'BookOpen' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 4, hours: 4, color: '#eab308', icon: 'Map' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 3, hours: 4, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 3, hours: 3, color: '#14b8a6', icon: 'Globe' },
          { id: 'math', name: 'الرياضيات', coef: 2, hours: 2, color: '#3b82f6', icon: 'Calculator' },
          { id: 'nat', name: 'علوم الطبيعة والحياة', coef: 2, hours: 2, color: '#10b981', icon: 'Dna' },
          { id: 'phys', name: 'العلوم الفيزيائية', coef: 1, hours: 2, color: '#8b5cf6', icon: 'Atom' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'info', name: 'الإعلام الآلي', coef: 2, hours: 2, color: '#06b6d4', icon: 'Terminal' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      }
    ]
  },
  {
    id: '2AS',
    name: 'السنة الثانية ثانوي (2AS)',
    shortName: '2AS',
    description: 'مرحلة التخصص الأساسي وتعميق الكفاءات التخصصية للتحضير للبكالوريا',
    streams: [
      {
        id: 'tech',
        name: 'تقني رياضي (Math-Technique)',
        shortName: 'تقني رياضي',
        description: 'شعبة التكنولوجيا والتطبيقات الهندسية مع الرياضيات والفيزياء المتقدمة',
        specializations: [
          {
            id: 'meca',
            name: 'هندسة ميكانيكية (Génie Mécanique)',
            description: 'دراسة الأنظمة الميكانيكية، الرسم الصناعي، المقاومة ونقل الحركة',
            subjects: [
              { id: 'tech-meca', name: 'التكنولوجيا: هندسة ميكانيكية', coef: 6, hours: 6, color: '#f59e0b', icon: 'Wrench', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 5, hours: 5, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 2, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          },
          {
            id: 'elec',
            name: 'هندسة كهربائية (Génie Électrique)',
            description: 'دراسة الأنظمة والدارات الكهربائية، المنطق التوافقي والتعاقبي والمعالجات',
            subjects: [
              { id: 'tech-elec', name: 'التكنولوجيا: هندسة كهربائية', coef: 6, hours: 6, color: '#f59e0b', icon: 'Zap', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 5, hours: 5, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 2, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          },
          {
            id: 'civil',
            name: 'هندسة مدنية (Génie Civil)',
            description: 'دراسة المنشآت والخرسانة، الطبوغرافيا ومقاومة المواد والبناء',
            subjects: [
              { id: 'tech-civil', name: 'التكنولوجيا: هندسة مدنية', coef: 6, hours: 6, color: '#f59e0b', icon: 'Building', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 5, hours: 5, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 2, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          },
          {
            id: 'proc',
            name: 'هندسة الطرائق (Génie des Procédés)',
            description: 'دراسة العمليات الكيميائية، الصناعات الغذائية والبتروكيميائية والديناميكا الحرارية',
            subjects: [
              { id: 'tech-proc', name: 'التكنولوجيا: هندسة الطرائق', coef: 6, hours: 6, color: '#f59e0b', icon: 'FlaskConical', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 5, hours: 5, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 2, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          }
        ]
      },
      {
        id: 'sci',
        name: 'علوم تجريبية',
        shortName: 'علوم تجريبية',
        description: 'التركيز على العلوم الطبيعية والفيزياء والرياضيات للمسارات الطبية والبيولوجية',
        specializations: [],
        subjects: [
          { id: 'nat', name: 'علوم الطبيعة والحياة', coef: 6, hours: 6, color: '#10b981', icon: 'Dna', isMajor: true },
          { id: 'phys', name: 'العلوم الفيزيائية', coef: 5, hours: 5, color: '#8b5cf6', icon: 'Atom', isMajor: true },
          { id: 'math', name: 'الرياضيات', coef: 5, hours: 5, color: '#3b82f6', icon: 'Calculator', isMajor: true },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 2, hours: 3, color: '#ec4899', icon: 'BookOpen' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'math',
        name: 'رياضيات',
        shortName: 'رياضيات',
        description: 'المسار الأكاديمي المتعمق في الرياضيات البحتة والفيزياء للمسارات الهندسية العليا',
        specializations: [],
        subjects: [
          { id: 'math', name: 'الرياضيات', coef: 7, hours: 7, color: '#3b82f6', icon: 'Calculator', isMajor: true },
          { id: 'phys', name: 'العلوم الفيزيائية', coef: 6, hours: 6, color: '#8b5cf6', icon: 'Atom', isMajor: true },
          { id: 'nat', name: 'علوم الطبيعة والحياة', coef: 2, hours: 2, color: '#10b981', icon: 'Dna' },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 2, hours: 3, color: '#ec4899', icon: 'BookOpen' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'ges',
        name: 'تسيير واقتصاد',
        shortName: 'تسيير واقتصاد',
        description: 'المحاسبة والمالية والاقتصاد والقانون للمسارات التجارية والإدارية والبنكية',
        specializations: [],
        subjects: [
          { id: 'ges-comp', name: 'التسيير المحاسبي والمالي', coef: 6, hours: 6, color: '#10b981', icon: 'BadgeDollarSign', isMajor: true },
          { id: 'ges-eco', name: 'الاقتصاد والمناجمنت', coef: 5, hours: 5, color: '#06b6d4', icon: 'TrendingUp', isMajor: true },
          { id: 'math', name: 'الرياضيات', coef: 4, hours: 4, color: '#3b82f6', icon: 'Calculator', isMajor: true },
          { id: 'ges-law', name: 'القانون', coef: 2, hours: 2, color: '#8b5cf6', icon: 'Scale' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 3, hours: 3, color: '#eab308', icon: 'Map' },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 2, hours: 3, color: '#ec4899', icon: 'BookOpen' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'philo',
        name: 'آداب وفلسفة',
        shortName: 'آداب وفلسفة',
        description: 'التحليل الأدبي والفلسفي والدراسات الإنسانية واللغوية والقانونية',
        specializations: [],
        subjects: [
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 6, hours: 6, color: '#ec4899', icon: 'BookOpen', isMajor: true },
          { id: 'philo', name: 'الفلسفة', coef: 5, hours: 5, color: '#a855f7', icon: 'Brain', isMajor: true },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 4, hours: 4, color: '#eab308', icon: 'Map', isMajor: true },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 3, hours: 4, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 3, hours: 3, color: '#14b8a6', icon: 'Globe' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 2, color: '#1ea150', icon: 'Moon' },
          { id: 'math', name: 'الرياضيات', coef: 2, hours: 2, color: '#3b82f6', icon: 'Calculator' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'lang',
        name: 'لغات أجنبية',
        shortName: 'لغات أجنبية',
        description: 'اللغات العالمية (الفرنسية، الإنجليزية، والإسبانية أو الألمانية أو الإيطالية)',
        specializations: [
          { id: 'lang-esp', name: 'لغة ثالثة: إسبانية', description: 'تخصص اللغة الإسبانية كلغة أجنبية ثالثة' },
          { id: 'lang-all', name: 'لغة ثالثة: ألمانية', description: 'تخصص اللغة الألمانية كلغة أجنبية ثالثة' },
          { id: 'lang-ita', name: 'لغة ثالثة: إيطالية', description: 'تخصص اللغة الإيطالية كلغة أجنبية ثالثة' },
        ],
        subjects: [
          { id: 'fr', name: 'اللغة الفرنسية', coef: 5, hours: 5, color: '#6366f1', icon: 'Languages', isMajor: true },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 5, hours: 5, color: '#14b8a6', icon: 'Globe', isMajor: true },
          { id: 'lang3', name: 'اللغة الأجنبية الثالثة (إسبانية/ألمانية/إيطالية)', coef: 4, hours: 4, color: '#f59e0b', icon: 'Globe2', isMajor: true },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 4, hours: 4, color: '#ec4899', icon: 'BookOpen', isMajor: true },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 3, hours: 3, color: '#eab308', icon: 'Map' },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 2, color: '#1ea150', icon: 'Moon' },
          { id: 'math', name: 'الرياضيات', coef: 2, hours: 2, color: '#3b82f6', icon: 'Calculator' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      }
    ]
  },
  {
    id: '3AS',
    name: 'السنة الثالثة ثانوي (3AS - تحضير البكالوريا BAC)',
    shortName: '3AS (BAC)',
    description: 'سنة البكالوريا - التحضير الشامل للامتحان الوطني للبكالوريا وفق المنهاج الجزائري الرسمي',
    streams: [
      {
        id: 'tech',
        name: 'تقني رياضي (Math-Technique)',
        shortName: 'تقني رياضي',
        description: 'امتحان شهادة البكالوريا في الهندسة الميكانيكية، الكهربائية، المدنية، أو الطرائق',
        specializations: [
          {
            id: 'meca',
            name: 'هندسة ميكانيكية (BAC Génie Mécanique)',
            description: 'دراسة وتحليل الآليات الصناعية، الحركيات، نقل الحركة والمقاومة',
            subjects: [
              { id: 'tech-meca', name: 'التكنولوجيا: هندسة ميكانيكية', coef: 7, hours: 7, color: '#f59e0b', icon: 'Wrench', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 6, hours: 6, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          },
          {
            id: 'elec',
            name: 'هندسة كهربائية (BAC Génie Électrique)',
            description: 'الأنظمة الآلية، المنطق التعاقبي GRAFCET، المعالجات الدقيقة والتحويل الطاقوي',
            subjects: [
              { id: 'tech-elec', name: 'التكنولوجيا: هندسة كهربائية', coef: 7, hours: 7, color: '#f59e0b', icon: 'Zap', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 6, hours: 6, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          },
          {
            id: 'civil',
            name: 'هندسة مدنية (BAC Génie Civil)',
            description: 'التحليل الإنشائي، حساب العوارض، الخرسانة المسلحة والمساحة',
            subjects: [
              { id: 'tech-civil', name: 'التكنولوجيا: هندسة مدنية', coef: 7, hours: 7, color: '#f59e0b', icon: 'Building', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 6, hours: 6, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          },
          {
            id: 'proc',
            name: 'هندسة الطرائق (BAC Génie des Procédés)',
            description: 'الكيمياء العضوية، الحركية الكيميائية، التوازنات والعمليات الموحدة',
            subjects: [
              { id: 'tech-proc', name: 'التكنولوجيا: هندسة الطرائق', coef: 7, hours: 7, color: '#f59e0b', icon: 'FlaskConical', isMajor: true },
              { id: 'math', name: 'الرياضيات', coef: 6, hours: 6, color: '#3b82f6', icon: 'Calculator', isMajor: true },
              { id: 'phys', name: 'العلوم الفيزيائية', coef: 6, hours: 6, color: '#8b5cf6', icon: 'Atom', isMajor: true },
              { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
              { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
              { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
              { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
              { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
              { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
              { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
            ]
          }
        ]
      },
      {
        id: 'sci',
        name: 'علوم تجريبية (BAC Sciences Expérimentales)',
        shortName: 'علوم تجريبية',
        description: 'تحضير بكالوريا العلوم التجريبية',
        specializations: [],
        subjects: [
          { id: 'nat', name: 'علوم الطبيعة والحياة', coef: 6, hours: 6, color: '#10b981', icon: 'Dna', isMajor: true },
          { id: 'phys', name: 'العلوم الفيزيائية', coef: 5, hours: 5, color: '#8b5cf6', icon: 'Atom', isMajor: true },
          { id: 'math', name: 'الرياضيات', coef: 5, hours: 5, color: '#3b82f6', icon: 'Calculator', isMajor: true },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'math',
        name: 'رياضيات (BAC Mathématiques)',
        shortName: 'رياضيات',
        description: 'تحضير بكالوريا الرياضيات',
        specializations: [],
        subjects: [
          { id: 'math', name: 'الرياضيات', coef: 7, hours: 7, color: '#3b82f6', icon: 'Calculator', isMajor: true },
          { id: 'phys', name: 'العلوم الفيزيائية', coef: 6, hours: 6, color: '#8b5cf6', icon: 'Atom', isMajor: true },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'nat', name: 'علوم الطبيعة والحياة', coef: 2, hours: 2, color: '#10b981', icon: 'Dna' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'ges',
        name: 'تسيير واقتصاد (BAC Gestion & Économie)',
        shortName: 'تسيير واقتصاد',
        description: 'تحضير بكالوريا التسيير والاقتصاد',
        specializations: [],
        subjects: [
          { id: 'ges-comp', name: 'التسيير المحاسبي والمالي', coef: 6, hours: 6, color: '#10b981', icon: 'BadgeDollarSign', isMajor: true },
          { id: 'ges-eco', name: 'الاقتصاد والمناجمنت', coef: 5, hours: 5, color: '#06b6d4', icon: 'TrendingUp', isMajor: true },
          { id: 'math', name: 'الرياضيات', coef: 5, hours: 5, color: '#3b82f6', icon: 'Calculator', isMajor: true },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 4, hours: 4, color: '#eab308', icon: 'Map', isMajor: true },
          { id: 'ges-law', name: 'القانون', coef: 2, hours: 2, color: '#8b5cf6', icon: 'Scale' },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 3, hours: 3, color: '#ec4899', icon: 'BookOpen' },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 2, hours: 3, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 2, hours: 2, color: '#14b8a6', icon: 'Globe' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 1, color: '#1ea150', icon: 'Moon' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'philo',
        name: 'آداب وفلسفة (BAC Lettres & Philosophie)',
        shortName: 'آداب وفلسفة',
        description: 'تحضير بكالوريا الآداب والفلسفة',
        specializations: [],
        subjects: [
          { id: 'philo', name: 'الفلسفة', coef: 6, hours: 6, color: '#a855f7', icon: 'Brain', isMajor: true },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 6, hours: 6, color: '#ec4899', icon: 'BookOpen', isMajor: true },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 4, hours: 4, color: '#eab308', icon: 'Map', isMajor: true },
          { id: 'fr', name: 'اللغة الفرنسية', coef: 3, hours: 4, color: '#6366f1', icon: 'Languages' },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 3, hours: 3, color: '#14b8a6', icon: 'Globe' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 2, color: '#1ea150', icon: 'Moon' },
          { id: 'math', name: 'الرياضيات', coef: 2, hours: 2, color: '#3b82f6', icon: 'Calculator' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      },
      {
        id: 'lang',
        name: 'لغات أجنبية (BAC Langues Étrangères)',
        shortName: 'لغات أجنبية',
        description: 'تحضير بكالوريا اللغات الأجنبية',
        specializations: [
          { id: 'lang-esp', name: 'لغة ثالثة: إسبانية', description: 'تخصص اللغة الإسبانية' },
          { id: 'lang-all', name: 'لغة ثالثة: ألمانية', description: 'تخصص اللغة الألمانية' },
          { id: 'lang-ita', name: 'لغة ثالثة: إيطالية', description: 'تخصص اللغة الإيطالية' },
        ],
        subjects: [
          { id: 'fr', name: 'اللغة الفرنسية', coef: 5, hours: 5, color: '#6366f1', icon: 'Languages', isMajor: true },
          { id: 'eng', name: 'اللغة الإنجليزية', coef: 5, hours: 5, color: '#14b8a6', icon: 'Globe', isMajor: true },
          { id: 'lang3', name: 'اللغة الأجنبية الثالثة (إسبانية/ألمانية/إيطالية)', coef: 4, hours: 4, color: '#f59e0b', icon: 'Globe2', isMajor: true },
          { id: 'arab', name: 'اللغة العربية وآدابها', coef: 5, hours: 5, color: '#ec4899', icon: 'BookOpen', isMajor: true },
          { id: 'philo', name: 'الفلسفة', coef: 2, hours: 2, color: '#a855f7', icon: 'Brain' },
          { id: 'hist', name: 'التاريخ والجغرافيا', coef: 2, hours: 2, color: '#eab308', icon: 'Map' },
          { id: 'isl', name: 'العلوم الإسلامية', coef: 2, hours: 2, color: '#1ea150', icon: 'Moon' },
          { id: 'math', name: 'الرياضيات', coef: 2, hours: 2, color: '#3b82f6', icon: 'Calculator' },
          { id: 'sport', name: 'التربية البدنية والرياضية', coef: 1, hours: 2, color: '#64748b', icon: 'Activity' },
        ]
      }
    ]
  }
];

// Helper to find subjects for a specific profile
export const getSubjectsForProfile = (levelId, streamId, specId = null) => {
  const level = ALGERIAN_LEVELS.find(l => l.id === levelId);
  if (!level) return [];
  const stream = level.streams.find(s => s.id === streamId);
  if (!stream) return [];
  
  if (stream.specializations && stream.specializations.length > 0) {
    const spec = stream.specializations.find(sp => sp.id === specId) || stream.specializations[0];
    if (spec && spec.subjects) {
      return spec.subjects;
    }
  }
  return stream.subjects || [];
};
