import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { DemoNoticeBanner } from '../common/DemoNoticeBanner';
import {
  Users,
  BookOpen,
  FileCheck2,
  FileText,
  Plus,
  ShieldCheck,
  Clock,
  Sparkles,
  Bot,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { DEMO_CLASSES, DEMO_ASSIGNMENTS } from '../../constants/demoData';

export const TeacherDashboard = ({
  setActiveTab,
  onCreateClass,
  onPublishLesson,
  onCreateAssignment,
  onCreateTest,
  onOpenTeacherAI
}) => {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState(null);

  const classes = DEMO_CLASSES;
  const assignments = DEMO_ASSIGNMENTS;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      <DemoNoticeBanner />

      {/* Teacher Profile Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/50 shadow-md shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user?.name || 'الأستاذ أحمد المنصوري'}
              </h2>
              {user?.verificationStatus === 'verified' ? (
                <Badge variant="success" size="sm" icon={ShieldCheck}>
                  أستاذ موثق بيداغوجياً ✓
                </Badge>
              ) : (
                <Badge variant="warning" size="sm" icon={Clock}>
                  طلب التوثيق قيد المراجعة
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user?.schoolName || 'ثانوية عمر راسم - الجزائر'} • مادة التكنولوجيا (هندسة ميكانيكية) والرياضيات
            </p>
          </div>
        </div>

        {/* Quick Teacher Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateClass}
            icon={Plus}
          >
            إنشاء صف جديد
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onPublishLesson}
            icon={BookOpen}
          >
            نشر درس
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenTeacherAI}
            icon={Bot}
          >
            مساعد الأستاذ AI
          </Button>
        </div>
      </div>

      {/* Teacher Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">الصفوف النشطة</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">2 صفوف</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">إجمالي التلاميذ</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">38 تلميذ</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">واجبات بانتظار التصحيح</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">4 تسليمات</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">متوسط نتائج الصف</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">16.4 / 20</p>
          </div>
        </Card>
      </div>

      {/* Classes Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              صفوفك الدراسية
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              شارك رمز الانضمام مع طلابك للدخول إلى الصف ومتابعة الدروس والواجبات
            </p>
          </div>
          <Button variant="outline" size="xs" onClick={onCreateClass} icon={Plus}>
            صف جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classes.map((cls) => (
            <Card key={cls.id} className="relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <Badge variant="brand" size="sm">
                      {cls.level} • {cls.subjectName}
                    </Badge>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                      {cls.name}
                    </h4>
                  </div>

                  {/* Class Join Code Pill */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400">الرمز:</span>
                    <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                      {cls.code}
                    </span>
                    <button
                      onClick={() => copyCode(cls.code)}
                      className="text-slate-400 hover:text-brand-500 transition ml-1"
                      title="نسخ رمز الصف"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedCode === cls.code && (
                      <span className="text-[9px] text-emerald-500 font-bold">تم النسخ!</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {cls.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>{cls.studentIds?.length || 5} تلاميذ منضمين</span>
                </div>

                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => setActiveTab('classes')}
                >
                  إدارة الصف والمحتوى ←
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pending Submissions / Assignments to Grade */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              تسليمات الواجبات الأخيرة بانتظار الملاحظات
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('assignments')}
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            عرض الكل ←
          </button>
        </div>

        <div className="space-y-3">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  {asg.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تم تسليم: <strong>{asg.submissionsCount} من أصل {asg.totalStudents}</strong> تلميذ • أحدث تسليم من الطالب <strong>كريم بوخالفة</strong>
                </p>
              </div>

              <Button
                variant="outline"
                size="xs"
                onClick={() => setActiveTab('assignments')}
              >
                مراجعة وتصحيح ({asg.submissionsCount})
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
