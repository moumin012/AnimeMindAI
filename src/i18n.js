export const languages = [
  ['en', 'English'], ['ar', 'العربية'], ['fr', 'Français'], ['es', 'Español'], ['de', 'Deutsch'], ['it', 'Italiano'], ['pt', 'Português'], ['tr', 'Türkçe'], ['ja', '日本語'], ['ko', '한국어'], ['zh', '中文'], ['ru', 'Русский'], ['hi', 'हिन्दी'], ['ur', 'اردو'],
];

const english = {
  home: 'Home', schedule: 'Schedule', study: 'Study', ai: 'AI', progress: 'Progress', more: 'More',
  greetingMorning: 'Good morning', greetingAfternoon: 'Good afternoon', greetingEvening: 'Good evening',
  todayProgress: "Today's progress", studyTime: 'Study time', tasks: 'Tasks', sessions: 'Sessions',
  nextActivity: 'Next activity', noActivity: 'Nothing scheduled yet', whatNow: 'What should I do now?',
  addTask: 'Add task', startStudy: 'Start study', viewSchedule: 'View schedule', completed: 'completed',
  upcomingTasks: 'Upcoming tasks', weakTopics: 'Weak topics', streak: 'Study streak', dayStreak: 'day streak',
  dashboardEmpty: 'Build a realistic plan, then StudentOS will calculate your progress here.',
  settings: 'Settings', permissions: 'Permissions', privacy: 'Privacy', save: 'Save', cancel: 'Cancel',
  delete: 'Delete', edit: 'Edit', close: 'Close', subject: 'Subject', duration: 'Duration', minutes: 'minutes',
  timer: 'Timer', pause: 'Pause', resume: 'Resume', finish: 'Finish', emergencyStop: 'Emergency stop',
  start: 'Start', title: 'Title', deadline: 'Deadline', priority: 'Priority', status: 'Status',
  signOut: 'Sign out', localWorkspace: 'Local offline workspace', language: 'Language', theme: 'Theme',
};

const arabic = {
  home: 'الرئيسية', schedule: 'الجدول', study: 'الدراسة', ai: 'الذكاء الاصطناعي', progress: 'التقدم', more: 'المزيد',
  greetingMorning: 'صباح الخير', greetingAfternoon: 'مساء الخير', greetingEvening: 'مساء الخير',
  todayProgress: 'تقدم اليوم', studyTime: 'وقت الدراسة', tasks: 'المهام', sessions: 'الجلسات',
  nextActivity: 'النشاط التالي', noActivity: 'لا يوجد نشاط مجدول', whatNow: 'ماذا أفعل الآن؟',
  addTask: 'إضافة مهمة', startStudy: 'ابدأ الدراسة', viewSchedule: 'عرض الجدول', completed: 'مكتملة',
  upcomingTasks: 'المهام القادمة', weakTopics: 'الموضوعات الضعيفة', streak: 'سلسلة الدراسة', dayStreak: 'أيام متتالية',
  dashboardEmpty: 'أنشئ خطة حقيقية وسيحسب StudentOS تقدمك هنا.', settings: 'الإعدادات', permissions: 'الأذونات',
  privacy: 'الخصوصية', save: 'حفظ', cancel: 'إلغاء', delete: 'حذف', edit: 'تعديل', close: 'إغلاق',
  subject: 'المادة', duration: 'المدة', minutes: 'دقائق', timer: 'المؤقت', pause: 'إيقاف مؤقت', resume: 'استئناف',
  finish: 'إنهاء', emergencyStop: 'إيقاف طارئ', start: 'ابدأ', title: 'العنوان', deadline: 'الموعد النهائي',
  priority: 'الأولوية', status: 'الحالة', signOut: 'تسجيل الخروج', localWorkspace: 'مساحة عمل محلية دون اتصال',
  language: 'اللغة', theme: 'المظهر',
};

const dictionaries = { en: english, ar: arabic };
export const isRtl = (language) => ['ar', 'ur'].includes(language);
export const createTranslator = (language) => (key) => dictionaries[language]?.[key] || english[key] || key;
