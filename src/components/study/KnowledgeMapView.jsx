import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Network, CheckCircle2, AlertTriangle, XCircle, Circle, BookOpen, Bot, Sparkles } from 'lucide-react';
import { CURRICULA_DATABASE } from '../../constants/curriculaData';
import { useEducation } from '../../context/EducationContext';

export const KnowledgeMapView = ({ onOpenAITutor }) => {
  const { currentSubjects } = useEducation();
  const [selectedSubjectId, setSelectedSubjectId] = useState('tech-meca');
  const [filterStatus, setFilterStatus] = useState('all');

  const curr = CURRICULA_DATABASE['2AS-tech-meca-tech-meca'] || Object.values(CURRICULA_DATABASE)[0];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'mastered':
        return { label: 'متقن', color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-300 dark:border-emerald-800' };
      case 'review':
        return { label: 'يحتاج مراجعة', color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/60', border: 'border-amber-300 dark:border-amber-800' };
      case 'weak':
        return { label: 'ضعيف', color: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/60', border: 'border-rose-300 dark:border-rose-800' };
      default:
        return { label: 'لم تتم دراسته', color: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              خريطة المعرفة والمفاهيم (Knowledge Map)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            رسم بياني شجري يوضح مدى إتقانك لكل مفهوم ودرس بالاعتماد على نتائج الاختبارات والاسترجاع النشط
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
            🟢 متقن
          </span>
          <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
            🟡 يحتاج مراجعة
          </span>
          <span className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-800">
            🔴 ضعيف
          </span>
          <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            ⚪ لم تتم دراسته
          </span>
        </div>
      </div>

      {/* Units Knowledge Tree */}
      <div className="space-y-6">
        {curr.units?.map((unit) => (
          <div
            key={unit.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {unit.title}
              </h3>
              <Badge variant="brand" size="sm">
                الوحدة {unit.number}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {unit.lessons?.map((les) => {
                const info = getStatusInfo(les.status);
                return (
                  <div
                    key={les.id}
                    className={`p-4 rounded-2xl border-2 ${info.border} ${info.bg} flex flex-col justify-between transition hover:shadow-md cursor-pointer`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${info.color}`} />
                        <span className={`text-[10px] font-bold ${info.text}`}>
                          {info.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                        {les.title}
                      </h4>
                    </div>

                    <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => onOpenAITutor({ name: les.title })}
                        className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <Bot className="w-3 h-3" />
                        <span>اسأل AI حوله</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
