import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Youtube } from '../common/YoutubeIcon';
import { Search, BookOpen, Bot, FileCheck2, Repeat, ArrowLeft } from 'lucide-react';
import { useEducation } from '../../context/EducationContext';
import { YOUTUBE_CHANNELS_HUB } from '../../constants/youtubeData';
import { DEMO_LESSONS, DEMO_TESTS } from '../../constants/demoData';

export const SearchModal = ({ isOpen, onClose, onSelectAction }) => {
  const [query, setQuery] = useState('');
  const { currentSubjects } = useEducation();

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingSubjects = currentSubjects.filter(s =>
    s.name.includes(q)
  );

  const matchingLessons = DEMO_LESSONS.filter(l =>
    l.title.includes(q) || l.summary.includes(q)
  );

  const matchingTests = DEMO_TESTS.filter(t =>
    t.title.includes(q) || t.description.includes(q)
  );

  const matchingChannels = YOUTUBE_CHANNELS_HUB.filter(c =>
    c.channelName.includes(q) || c.description.includes(q)
  );

  const hasResults = q.length > 0 && (
    matchingSubjects.length > 0 ||
    matchingLessons.length > 0 ||
    matchingTests.length > 0 ||
    matchingChannels.length > 0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="البحث الذكي الشامل في StudentOS"
      subtitle="ابحث عن مادة، درس، اختبار، قناة أستاذ، أو مصطلح تقني"
      maxWidth="max-w-2xl"
      icon={Search}
    >
      <div className="space-y-4 text-right">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-brand-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب للبحث (مثال: هندسة ميكانيكية، تروس، متتاليات، نور الدين)..."
            className="w-full pl-4 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-brand-500 shadow-sm"
          />
        </div>

        {/* Results */}
        {q.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {/* Matching Subjects */}
            {matchingSubjects.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400">المواد الدراسية:</span>
                {matchingSubjects.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      onClose();
                      onSelectAction('subjects', sub);
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-brand-500 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{sub.name}</span>
                    </div>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400">معامل {sub.coef} ←</span>
                  </div>
                ))}
              </div>
            )}

            {/* Matching Lessons */}
            {matchingLessons.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400">الدروس والملخصات:</span>
                {matchingLessons.map(les => (
                  <div
                    key={les.id}
                    onClick={() => {
                      onClose();
                      onSelectAction('classes', les);
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-brand-500 transition"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-brand-500" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{les.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">فتح الدرس ←</span>
                  </div>
                ))}
              </div>
            )}

            {/* Matching Tests */}
            {matchingTests.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400">الاختبارات:</span>
                {matchingTests.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onClose();
                      onSelectAction('tests', t);
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-brand-500 transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-purple-500" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{t.title}</span>
                    </div>
                    <span className="text-[11px] text-purple-600">بدء الاختبار ←</span>
                  </div>
                ))}
              </div>
            )}

            {/* Matching YouTube Channels */}
            {matchingChannels.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400">قنوات الأساتذة (YouTube):</span>
                {matchingChannels.map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onClose();
                      onSelectAction('youtube-hub', ch);
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-brand-500 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{ch.channelName}</span>
                    </div>
                    <span className="text-[11px] text-red-500">مشاهدة الدروس ←</span>
                  </div>
                ))}
              </div>
            )}

            {!hasResults && (
              <p className="text-xs text-slate-400 text-center py-6">
                لم يتم العثور على نتائج تطابق "{query}".
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 space-y-1">
            <p>جرّب البحث عن: <strong>هندسة ميكانيكية</strong>، <strong>متتاليات</strong>، <strong>نور الدين</strong>، أو <strong>طاقة حركية</strong></p>
          </div>
        )}
      </div>
    </Modal>
  );
};
