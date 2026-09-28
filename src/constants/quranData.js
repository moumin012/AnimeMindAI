// Authentic Quran Surahs Data & Reader Service

export const QURAN_SURAHS = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', versesCount: 7, revelationType: 'مكية', page: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', versesCount: 286, revelationType: 'مدنية', page: 2 },
  { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', versesCount: 200, revelationType: 'مدنية', page: 50 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', versesCount: 176, revelationType: 'مدنية', page: 77 },
  { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', versesCount: 120, revelationType: 'مدنية', page: 106 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', versesCount: 165, revelationType: 'مكية', page: 128 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', versesCount: 206, revelationType: 'مكية', page: 151 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', versesCount: 75, revelationType: 'مدنية', page: 177 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', versesCount: 129, revelationType: 'مدنية', page: 187 },
  { number: 10, name: 'يونس', englishName: 'Yunus', versesCount: 109, revelationType: 'مكية', page: 208 },
  { number: 11, name: 'هود', englishName: 'Hud', versesCount: 123, revelationType: 'مكية', page: 221 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', versesCount: 111, revelationType: 'مكية', page: 235 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', versesCount: 43, revelationType: 'مدنية', page: 249 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', versesCount: 52, revelationType: 'مكية', page: 255 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', versesCount: 99, revelationType: 'مكية', page: 262 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', versesCount: 128, revelationType: 'مكية', page: 267 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', versesCount: 111, revelationType: 'مكية', page: 282 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', versesCount: 110, revelationType: 'مكية', page: 293 },
  { number: 19, name: 'مريم', englishName: 'Maryam', versesCount: 98, revelationType: 'مكية', page: 305 },
  { number: 20, name: 'طه', englishName: 'Ta-Ha', versesCount: 135, revelationType: 'مكية', page: 312 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', versesCount: 83, revelationType: 'مكية', page: 440 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', versesCount: 78, revelationType: 'مدنية', page: 531 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', versesCount: 96, revelationType: 'مكية', page: 534 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', versesCount: 30, revelationType: 'مكية', page: 562 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', versesCount: 4, revelationType: 'مكية', page: 604 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', versesCount: 5, revelationType: 'مكية', page: 604 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', versesCount: 6, revelationType: 'مكية', page: 604 }
];

export const SURAH_SAMPLES = {
  1: [
    { number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { number: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
    { number: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ' },
    { number: 4, text: 'مَالِكِ يَوْمِ الدِّينِ' },
    { number: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
    { number: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' },
    { number: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ' }
  ],
  67: [
    { number: 1, text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ' },
    { number: 2, text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ' },
    { number: 3, text: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ' },
    { number: 4, text: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ' },
    { number: 5, text: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ' }
  ],
  112: [
    { number: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ' },
    { number: 2, text: 'اللَّهُ الصَّمَدُ' },
    { number: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ' },
    { number: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ' }
  ]
};
