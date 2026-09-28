import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Youtube } from '../common/YoutubeIcon';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  FileCheck2,
  BrainCircuit,
  Network,
  Bot,
  CheckSquare,
  TrendingUp,
  Languages,
  Sparkles,
  BookMarked,
  Moon,
  Gamepad2,
  HeartHandshake,
  Settings,
  ShieldCheck,
  FileText,
  Clock,
  Megaphone,
  UserCheck,
  Layers,
  Repeat
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed = false }) => {
  const { user, role, setIsRoleModalOpen } = useAuth();

  // Navigation Items per Role
  const studentNav = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'scheduler', label: 'الجدول الذكي', icon: Calendar },
    { id: 'subjects', label: 'المواد والمناهج', icon: BookOpen },
    { id: 'youtube-hub', label: 'أساتذتي واكتشف', icon: Youtube },
    { id: 'classes', label: 'صفوفي التعليمية', icon: Users, badge: '1' },
    { id: 'tests', label: 'نظام الاختبارات', icon: FileCheck2 },
    { id: 'active-recall', label: 'الاسترجاع الذكي', icon: Repeat },
    { id: 'knowledge-map', label: 'خريطة المعرفة', icon: Network },
    { id: 'ai-tutor', label: 'المساعد الذكي AI', icon: Bot, isHighlight: true },
    { id: 'tasks', label: 'المهام الدراسية', icon: CheckSquare },
    { id: 'stats', label: 'تقدمي وإحصائياتي', icon: TrendingUp },
    { id: 'languages', label: 'أكاديمية اللغات', icon: Languages },
    { id: 'skills', label: 'أكاديمية المهارات', icon: Sparkles },
    { id: 'quran', label: 'القرآن الكريم', icon: BookMarked },
    { id: 'prayer', label: 'مواقيت الصلاة', icon: Moon },
    { id: 'entertainment', label: 'ضبط الترفيه', icon: Gamepad2 },
    { id: 'family', label: 'بوابة العائلة', icon: HeartHandshake },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const teacherNav = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'classes', label: 'صفوفي التدريسية', icon: Users, badge: '2' },
    { id: 'lessons', label: 'الدروس والملفات', icon: BookOpen },
    { id: 'assignments', label: 'الواجبات والتصحيح', icon: FileCheck2, badge: '4' },
    { id: 'tests', label: 'الاختبارات والتقييم', icon: FileText },
    { id: 'announcements', label: 'الإعلانات الصفية', icon: Megaphone },
    { id: 'students-stats', label: 'إحصائيات الطلاب', icon: TrendingUp },
    { id: 'ai-assistant', label: 'مساعد الأستاذ AI', icon: Bot, isHighlight: true },
    { id: 'settings', label: 'الإعدادات والتوثيق', icon: Settings },
  ];

  const parentNav = [
    { id: 'dashboard', label: 'متابعة الأبناء', icon: LayoutDashboard },
    { id: 'study-logs', label: 'سجل المذاكرة', icon: Clock },
    { id: 'test-scores', label: 'نتائج الاختبارات', icon: FileCheck2 },
    { id: 'assignments-view', label: 'الواجبات المنزلية', icon: CheckSquare },
    { id: 'entertainment', label: 'ضوابط الترفيه', icon: Gamepad2 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const adminNav = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'admin-users', label: 'إدارة المستخدمين', icon: Users },
    { id: 'admin-verification', label: 'توثيق الأساتذة', icon: UserCheck, badge: '1' },
    { id: 'admin-curriculum', label: 'المناهج والشعب', icon: Layers },
    { id: 'admin-channels', label: 'قنوات الأساتذة', icon: Youtube },
    { id: 'settings', label: 'إعدادات المنصة', icon: Settings },
  ];

  const getNavItems = () => {
    switch (role) {
      case 'teacher': return teacherNav;
      case 'parent': return parentNav;
      case 'admin': return adminNav;
      default: return studentNav;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800/80 flex flex-col h-screen select-none sticky top-0 z-20 transition-all duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-700 p-2 shadow-md shadow-brand-500/20 flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
              Student<span className="text-brand-500">OS</span>
            </h1>
            <span className="text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded">
              DZ
            </span>
          </div>
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium truncate mt-1">
            خطط. ادرس. ركّز. تذكّر. تطوّر.
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-right
                ${isSelected 
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30' 
                  : item.isHighlight
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-950/70'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : item.isHighlight ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Card & Role Switcher */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
        <div
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition cursor-pointer group"
          title="انقر لتبديل الدور (طالب / أستاذ / ولي أمر / مشرف)"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover border border-brand-500/40 shrink-0"
            />
            <div className="min-w-0 text-right">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user?.name || 'مستخدم'}
                </p>
                {user?.verificationStatus === 'verified' && (
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500 shrink-0" title="أستاذ موثق ✓" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {role === 'student' && `${user?.level || '2AS'} • ${user?.streamName || 'تقني رياضي'}`}
                {role === 'teacher' && 'أستاذ التعليم الثانوي'}
                {role === 'parent' && 'حساب ولي أمر'}
                {role === 'admin' && 'مدير المنصة'}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-200 dark:border-brand-800 group-hover:scale-105 transition">
            تبديل
          </span>
        </div>
      </div>
    </aside>
  );
};
