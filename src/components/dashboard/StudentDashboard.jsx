import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEducation } from '../../context/EducationContext';
import { useStudy } from '../../context/StudyContext';
import { WhatToStudyNow } from './WhatToStudyNow';
import { DemoNoticeBanner } from '../common/DemoNoticeBanner';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  FileCheck2,
  Users,
  Repeat,
  Bot,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Gamepad2,
  BookMarked,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { DEMO_CLASSES, DEMO_ASSIGNMENTS, DEMO_TESTS, DEMO_FLASHCARDS } from '../../constants/demoData';

export const StudentDashboard = ({ setActiveTab, onOpenUploadModal, onOpenTestModal, onOpenFocusMode }) => {
  const { user } = useAuth();
  const { currentSubjects } = useEducation();
  const { isStudyLockActive } = useStudy();

  const enrolledClass = DEMO_CLASSES[0];
  const upcomingAssignment = DEMO_ASSIGNMENTS[0];
  const activeTest = DEMO_TESTS[0];

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Demo Notice Banner */}
      <DemoNoticeBanner />

      {/* Header Profile & Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/50 shadow-md shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                مرحباً بك، {user?.name || 'كريم'} 👋
              </h2>
              <Badge variant="brand" size="sm" icon={ShieldCheck}>
                طالب نظامي
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {user?.level || '2AS'}
              </span>
              <span>•</span>
              <span className="font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                الشعبة: {user?.streamName || 'تقني رياضي'}
              </span>
              {user?.specializationName && (
                <>
                  <span>•</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                    التخصص: {user?.specializationName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Top Stats (Streak, Study time, Points) */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl shrink-0">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
            <div>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">حماسة المذاكرة (Streak)</p>
              <p className="text-sm font-black text-amber-900 dark:text-amber-200">{user?.streakDays || 14} يوم متواصل</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 rounded-2xl shrink-0">
            <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <div>
              <p className="text-[10px] text-brand-700 dark:text-brand-400 font-medium">وقت المذاكرة اليوم</p>
              <p className="text-sm font-black text-brand-900 dark:text-brand-200">{user?.studyMinutesToday || 85} دقيقة</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-2xl shrink-0">
            <Target className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div>
              <p className="text-[10px] text-sky-700 dark:text-sky-400 font-medium">نقاط الإنجاز</p>
              <p className="text-sm font-black text-sky-900 dark:text-sky-200">{user?.totalPoints || 1350} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* "What to Study Now" Engine */}
      <WhatToStudyNow
        onStartTask={() => onOpenFocusMode()}
        onStartRevision={() => setActiveTab('active-recall')}
        onStartTest={() => onOpenTestModal(activeTest)}
      />

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Classes, Assignments, Recent Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Class & Teacher Hub */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  صفك التعليمي النشط
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('classes')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>عرض الصف بالكامل</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={enrolledClass.coverImage}
                  alt={enrolledClass.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {enrolledClass.name}
                    </h4>
                    <span className="font-mono text-[10px] bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded font-bold">
                      {enrolledClass.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    الأستاذ: <strong className="text-slate-700 dark:text-slate-300">{enrolledClass.teacherName}</strong> (أستاذ موثق ✓)
                  </p>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-1 font-medium">
                    📢 إعلان حديث: {enrolledClass.announcements[0]?.title}
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('classes')}
              >
                دخول الصف
              </Button>
            </div>
          </Card>

          {/* Assignments and Tests widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upcoming Assignment */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="warning" size="sm" icon={Clock}>
                    واجب مستحق
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    20/20 نقطة
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-1">
                  {upcomingAssignment.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {upcomingAssignment.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  تم تسليمه (علامتك: {upcomingAssignment.mySubmission.score}/20)
                </span>
                <button
                  onClick={() => setActiveTab('classes')}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  التفاصيل ←
                </button>
              </div>
            </Card>

            {/* Upcoming / Active Test */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple" size="sm" icon={FileCheck2}>
                    اختبار تفاعلي
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {activeTest.durationMinutes} دقيقة
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-1">
                  {activeTest.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {activeTest.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  5 أسئلة ذكية متنوعة
                </span>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => onOpenTestModal(activeTest)}
                >
                  بدء الاختبار الآن
                </Button>
              </div>
            </Card>
          </div>

          {/* Subjects of your stream */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  مواد مسارك الدراسي ({user?.streamName || 'تقني رياضي'})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  مخصصة بدقة مع المعاملات والساعات الأسبوعية المقررة
                </p>
              </div>
              <button
                onClick={() => setActiveTab('subjects')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                عرض كل المواد ←
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentSubjects.slice(0, 6).map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setActiveTab('subjects')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-500 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color }}
                    />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      معامل {sub.coef}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-brand-500 transition">
                    {sub.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {sub.hours} ساعات أسبوعياً
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Assistant, Spaced Repetition, Quran & Spiritual, Quick Actions */}
        <div className="space-y-6">
          {/* AI Tutor Card */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <Badge variant="brand" size="sm">
                  AI بيداغوجي متخصص
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-white text-base">
                  مساعد StudentOS الذكي
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  شرح الدروس خطوة بخطوة، حل التمارين بمنهجية البكالوريا، ومراجعة الأخطاء.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full text-xs"
                  onClick={() => setActiveTab('ai-tutor')}
                  icon={Bot}
                >
                  فتح المحادثة التعليمية
                </Button>
              </div>
            </div>
          </Card>

          {/* Spaced Repetition Flashcards Due */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-purple-500" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  التكرار المتباعد (Spaced Repetition)
                </h4>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
                4 بطاقات مستحقة
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              فترات المراجعة التكيفية (1 ← 2 ← 4 ← 7 ← 14 ← 30 يوماً) لترسيخ المفاهيم في الذاكرة طويلة المدى.
            </p>

            <Button
              variant="secondary"
              className="w-full text-xs"
              onClick={() => setActiveTab('active-recall')}
              icon={Repeat}
            >
              مراجعة البطاقات الآن
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              إجراءات سريعة
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenUploadModal}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-500" />
                  <span>رفع درس جديد أو وثيقة PDF</span>
                </div>
                <span className="text-slate-400 text-[10px]">تحليل ذكي</span>
              </button>

              <button
                onClick={() => setActiveTab('knowledge-map')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  <span>معاينة خريطة المعرفة والمفاهيم</span>
                </div>
                <span className="text-slate-400 text-[10px]">🟢 🟡 🔴</span>
              </button>

              <button
                onClick={() => setActiveTab('scheduler')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>تعديل جدول الحصص والمذاكرة</span>
                </div>
                <span className="text-slate-400 text-[10px]">تخصيص كامل</span>
              </button>
            </div>
          </Card>

          {/* Quran & Entertainment Mini Widgets */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setActiveTab('quran')}
              className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 cursor-pointer hover:border-emerald-500 transition text-right"
            >
              <div className="flex items-center justify-between mb-1">
                <BookMarked className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] text-emerald-600 font-bold">الورد اليومي</span>
              </div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                سورة الكهف
              </h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                الصفحة 293 • 45%
              </p>
            </div>

            <div
              onClick={() => setActiveTab('entertainment')}
              className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/60 cursor-pointer hover:border-sky-500 transition text-right"
            >
              <div className="flex items-center justify-between mb-1">
                <Gamepad2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-[10px] text-sky-600 font-bold">الترفيه المتبقي</span>
              </div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                35 دقيقة متبقية
              </h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                من أصل 60 دقيقة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
