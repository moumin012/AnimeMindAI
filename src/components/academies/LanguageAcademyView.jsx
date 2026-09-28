import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Languages, BookOpen, Sparkles, CheckCircle2, Volume2, Globe, FileText, Repeat } from 'lucide-react';
import { LANGUAGE_COURSES } from '../../constants/academiesData';

export const LanguageAcademyView = () => {
  const [selectedCourse, setSelectedCourse] = useState(LANGUAGE_COURSES[0]);

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Languages className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              أكاديمية اللغات (Language Academy)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إتقان الإنجليزية والفرنسية للتعليم الثانوي مع مصطلحات البكالوريا ومنهجية التحرير والترجمة
          </p>
        </div>

        {/* Course Switcher */}
        <div className="flex items-center gap-2">
          {LANGUAGE_COURSES.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition border ${
                selectedCourse.id === course.id
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500'
              }`}
            >
              <span className="text-base">{course.flag}</span>
              <span>{course.language}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Course Modules */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCourse.flag}</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {selectedCourse.title}
              </h3>
            </div>
            <Badge variant="brand" size="sm">
              {selectedCourse.level}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {selectedCourse.description}
          </p>
        </Card>

        {/* Modules List */}
        <div className="space-y-5">
          {selectedCourse.modules?.map((mod) => (
            <div
              key={mod.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4"
            >
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-500" />
                <span>{mod.title}</span>
              </h4>

              <div className="space-y-4">
                {mod.topics?.map((top) => (
                  <div
                    key={top.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3"
                  >
                    <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {top.title}
                    </h5>

                    {/* Vocabulary Terms */}
                    {top.terms && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {top.terms.map((t, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold font-mono text-brand-600 dark:text-brand-400">
                                {t.term}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                [{t.pos}]
                              </span>
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 font-bold">
                              المعنى: {t.meaning}
                            </p>
                            <p className="text-[11px] text-slate-500 italic">
                              مثال: "{t.example}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Grammar Rule */}
                    {top.grammar && (
                      <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-xs space-y-1.5">
                        <span className="font-bold text-purple-900 dark:text-purple-300">
                          القاعدة النحوية (Grammar Rule):
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 font-mono">
                          {top.grammar.rule}
                        </p>
                        {top.grammar.examples?.map((ex, i) => (
                          <p key={i} className="text-[11px] text-purple-700 dark:text-purple-400 font-medium">
                            • {ex}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
