import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FileCheck2, Clock, Play, Award, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { DEMO_TESTS } from '../../constants/demoData';
import { storageService } from '../../services/storageService';

export const TestsView = ({ onStartTest }) => {
  const [tests, setTests] = useState(() => storageService.getTests());
  const [testResults, setTestResults] = useState(() => storageService.getTestResults());

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              نظام الاختبارات والامتحانات (Testing Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            «اجعل الطالب يفكر، وليس يكتب بلا داعٍ» • اختبارات ذكية (MCQ، وصل، ترتيب، ومسائل حسابية)
          </p>
        </div>

        <Badge variant="brand" size="md">
          {tests.length} اختبارات متاحة
        </Badge>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tests.map((test) => (
          <Card key={test.id} className="flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="purple" size="sm">
                  هندسة ميكانيكية • 2AS
                </Badge>
                <span className="flex items-center gap-1 text-xs font-mono text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {test.durationMinutes} دقيقة
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition">
                {test.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {test.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {test.questions?.length || 5} أسئلة متنوعة • {test.totalPoints || 20} نقطة
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onStartTest(test, 'practice')}
                >
                  نمط التدريب (بدون وقت)
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => onStartTest(test, 'exam')}
                  icon={Play}
                >
                  بدء الامتحان
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Past Test History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              سجل نتائج الاختبارات السابقة
            </h3>
          </div>
        </div>

        {testResults.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            لم تقم بإجراء أي اختبار بعد. اختر اختباراً من الأعلى للبدء!
          </p>
        ) : (
          <div className="space-y-3">
            {testResults.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {res.testTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    التاريخ: {res.date} • نمط: {res.mode === 'exam' ? 'امتحان حقيقي' : 'تدريب'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <span className="font-black text-base text-brand-600 dark:text-brand-400">
                      {res.score} / {res.totalPoints}
                    </span>
                    <p className="text-[10px] text-emerald-600 font-bold">
                      {res.percentage}% ({res.percentage >= 80 ? 'ممتاز' : 'جيد'})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
