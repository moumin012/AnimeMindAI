import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { BookMarked, Sparkles, CheckCircle2, Bookmark, Search } from 'lucide-react';
import { QURAN_SURAHS, SURAH_SAMPLES } from '../../constants/quranData';

export const QuranView = () => {
  const [selectedSurah, setSelectedSurah] = useState(QURAN_SURAHS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [memorizedSurahs, setMemorizedSurahs] = useState([1, 112, 113, 114]);

  const filteredSurahs = QURAN_SURAHS.filter(s =>
    s.name.includes(searchQuery) || s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMemorized = memorizedSurahs.includes(selectedSurah.number);

  const toggleMemorized = () => {
    if (isMemorized) {
      setMemorizedSurahs(memorizedSurahs.filter(n => n !== selectedSurah.number));
    } else {
      setMemorizedSurahs([...memorizedSurahs, selectedSurah.number]);
    }
  };

  const sampleAyahs = SURAH_SAMPLES[selectedSurah.number] || [
    { number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { number: 2, text: `قراءة وتلاوة آيات سورة ${selectedSurah.name} المباركة وفق الرسم العثماني المعتمد.` }
  ];

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              القرآن الكريم (Noble Quran)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة الورد اليومي، الحفظ والمراجعة بالرسم العثماني الموثق
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            تم حفظ {memorizedSurahs.length} سور
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Surahs List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم السورة..."
              className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-3 max-h-[500px] overflow-y-auto space-y-1.5 shadow-sm">
            {filteredSurahs.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;
              const hasMemorized = memorizedSurahs.includes(surah.number);
              return (
                <div
                  key={surah.number}
                  onClick={() => setSelectedSurah(surah)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-xs ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {surah.number}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs">{surah.name}</h4>
                      <p className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {surah.versesCount} آيات • {surah.revelationType}
                      </p>
                    </div>
                  </div>

                  {hasMemorized && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                      محفوظة ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ayahs Reader Area */}
        <div className="lg:col-span-2">
          <Card className="min-h-[500px] flex flex-col justify-between p-8 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-950/50 dark:to-slate-900">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    سورة {selectedSurah.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedSurah.revelationType} • {selectedSurah.versesCount} آيات • الصفحة {selectedSurah.page}
                  </p>
                </div>

                <Button
                  variant={isMemorized ? 'success' : 'outline'}
                  size="xs"
                  onClick={toggleMemorized}
                  icon={Bookmark}
                >
                  {isMemorized ? 'تم الحفظ والمراجعة ✓' : 'تحديد كـ "تم الحفظ"'}
                </Button>
              </div>

              {/* Quran Text */}
              <div className="space-y-6 text-center leading-[2.6] py-6 px-4">
                {sampleAyahs.map((a) => (
                  <p key={a.number} className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-wide">
                    {a.text} <span className="text-brand-600 dark:text-brand-400 font-mono text-sm">﴿{a.number}﴾</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>نص معتمد بالرسم العثماني</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">الورد اليومي: صفحة 293</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
