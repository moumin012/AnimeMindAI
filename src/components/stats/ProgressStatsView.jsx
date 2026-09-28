import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  TrendingUp,
  Clock,
  Flame,
  Award,
  CheckCircle2,
  AlertTriangle,
  Repeat,
  Target,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEducation } from '../../context/EducationContext';
import { storageService } from '../../services/storageService';

export const ProgressStatsView = () => {
  const { user } = useAuth();
  const { currentSubjects } = useEducation();
  const testResults = storageService.getTestResults();

  const studySessions = storageService.getStudySessions();
  const totalMinutes = studySessions.reduce((acc, s) => acc + (s.minutes || 0), 0);

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              تقرير التقدم والإحصائيات (Progress & Analytics)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تحليل شامل للأداء الدراسي، ساعات التركيز، ونقاط القوة والضعف في المنهاج
          </p>
        </div>

        <Badge variant="brand" size="md">
          جاهزية البكالوريا: 72% ⭐
        </Badge>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">إجمالي ساعات المذاكرة</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {(totalMinutes / 60).toFixed(1)} ساعة
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">الالتزام اليومي المتواصل</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">14 يوم (Streak)</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">معدل الاختبارات العامة</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">18.0 / 20</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">بطاقات الذاكرة المتقنة</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">85% إتقان</p>
          </div>
        </Card>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              نقاط القوة والمفاهيم المتقنة (🟢 Mastered):
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              <strong className="text-emerald-900 dark:text-emerald-200">الهندسة الميكانيكية:</strong> حساب نسبة النقل وقوانين التروس الأسطوانية (100% إتقان)
            </div>
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              <strong className="text-emerald-900 dark:text-emerald-200">الرياضيات:</strong> المتتاليات الحسابية والحد العام والمجموع (90% إتقان)
            </div>
          </div>
        </Card>

        {/* Weaknesses / Needs Attention */}
        <Card className="space-y-3 border-amber-200/60 dark:border-amber-900/40">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              نقاط تحتاج مراجعة وتعزيز (🟡 / 🔴 Needs Focus):
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
              <strong className="text-amber-900 dark:text-amber-200">الهندسة الميكانيكية:</strong> التسامحات الهندسية والشكلية وحساب الخلوص ISO
            </div>
            <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-800/60">
              <strong className="text-rose-900 dark:text-rose-200">الرياضيات:</strong> إزالة حالات عدم التعيين في الدوال الجذرية
            </div>
          </div>
        </Card>
      </div>

      {/* Subjects Performance Breakdown */}
      <Card>
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
          أداء المواد بحسب المعاملات الرسمية ({user?.streamName || 'تقني رياضي'})
        </h3>

        <div className="space-y-3">
          {currentSubjects.map((sub) => {
            const pct = sub.isMajor ? 88 : 75;
            return (
              <div key={sub.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                    <span className="font-bold text-slate-900 dark:text-white">{sub.name}</span>
                    <span className="text-slate-400 text-[10px]">(معامل {sub.coef})</span>
                  </div>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{pct}% إتقان</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
