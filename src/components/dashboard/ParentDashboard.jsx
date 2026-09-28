import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DemoNoticeBanner } from '../common/DemoNoticeBanner';
import {
  HeartHandshake,
  Clock,
  FileCheck2,
  CheckSquare,
  ShieldCheck,
  Lock,
  Flame,
  Award,
  TrendingUp,
  Gamepad2
} from 'lucide-react';
import { DEMO_USERS, DEMO_ASSIGNMENTS, DEMO_TESTS } from '../../constants/demoData';

export const ParentDashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const linkedStudent = DEMO_USERS.student;

  return (
    <div className="space-y-6 pb-12 text-right">
      <DemoNoticeBanner />

      {/* Parent Welcome Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                بوابة متابعة ولي الأمر
              </h2>
              <Badge variant="purple" size="sm">
                حساب عائلي موثق
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              متابعة التقدم الدراسي للابن: <strong className="text-slate-800 dark:text-slate-200">{linkedStudent.name}</strong> ({linkedStudent.level} - {linkedStudent.streamName})
            </p>
          </div>
        </div>

        {/* Strict Privacy Protection Notice */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>مبدأ الخصوصية:</strong> محادثات AI والملاحظات الخاصة بالتلميذ محمية ومحجوبة تلقائياً.
          </span>
        </div>
      </div>

      {/* Overview Stats for Linked Student */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ساعات المذاكرة هذا الأسبوع</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">7.0 ساعات</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">الالتزام اليومي (Streak)</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">14 يوم متواصل</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">معدل الاختبارات العامة</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">17.2 / 20</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">وقت الترفيه المستهلك</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">25 دقيقة / يوم</p>
          </div>
        </Card>
      </div>

      {/* Tests & Assignments Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Test Results */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                نتائج الاختبارات والتقييمات الأخيرة
              </h3>
            </div>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              أداء ممتاز
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  اختبار نقل الحركة والعجلات المسننة (هندسة ميكانيكية)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  24 سبتمبر 2026 • مدة الاختبار 25 دقيقة
                </p>
              </div>
              <div className="text-left">
                <span className="font-black text-base text-brand-600 dark:text-brand-400">
                  18 / 20
                </span>
                <p className="text-[10px] text-emerald-600 font-bold">90% (ممتاز)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Assignments Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                حالة الواجبات المدرسية
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              تم تسليم 2 من 2
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  واجب دراسة آلية مخفض السرعة لعلبة تروس صناعية
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  أستاذ المادة: أحمد المنصوري • تم التصحيح
                </p>
              </div>
              <div className="text-left">
                <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                  18.5 / 20
                </span>
                <p className="text-[10px] text-slate-400">ملاحظة الأستاذ: ممتاز</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
