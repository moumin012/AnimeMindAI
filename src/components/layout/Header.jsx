import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { calculatePrayerTimes } from '../../services/prayerService';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { FullscreenButton } from '../common/FullscreenButton';
import {
  Search,
  Sun,
  Moon,
  Play,
  Pause,
  Clock,
  Wifi,
  WifiOff,
  Sparkles,
  ShieldCheck,
  Lock,
  Compass
} from 'lucide-react';
import { Button } from '../common/Button';

export const Header = ({ onOpenSearch, onOpenFocusMode, onOpenStudyLock }) => {
  const { user, role, switchRole, setIsRoleModalOpen } = useAuth();
  const { isActive, secondsRemaining, pauseSession, resumeSession, studyMode, isStudyLockActive } = useStudy();
  const { theme, toggleTheme } = useTheme();
  const { isOnline } = useOffline();

  const [prayerInfo, setPrayerInfo] = useState(() => calculatePrayerTimes(user?.wilaya?.slice(0, 2) || '16'));

  useEffect(() => {
    const timer = setInterval(() => {
      setPrayerInfo(calculatePrayerTimes(user?.wilaya?.slice(0, 2) || '16'));
    }, 60000);
    return () => clearInterval(timer);
  }, [user]);

  // Global Keyboard shortcuts: Ctrl+K for Search, Esc, etc.
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onOpenSearch]);

  // Format timer seconds
  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 transition-colors select-none">
      {/* Search Input Bar with Ctrl+K shortcut */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full cursor-pointer" onClick={onOpenSearch}>
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            placeholder="ابحث عن درس، قانون، أستاذ، تمرين... (Ctrl+K)"
            className="w-full pl-12 pr-10 py-2 bg-slate-100 dark:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-brand-500 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400 cursor-pointer"
          />
          <kbd className="absolute left-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-block px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-mono rounded border border-slate-300 dark:border-slate-600">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA Install Button for Chrome / Edge */}
        <PWAInstallButton size="xs" variant="outline" className="hidden md:inline-flex" />

        {/* Offline / Online indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
          title={isOnline ? 'متصل بالإنترنت ومزامنة البيانات مفعّلة' : 'أنت غير متصل بالإنترنت — بعض الميزات غير متاحة'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="hidden xl:inline">{isOnline ? 'متصل بالإنترنت' : 'أنت غير متصل بالإنترنت'}</span>
        </div>

        {/* Next Prayer Countdown Widget */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:border-brand-500/50 transition"
          title={`مواقيت الصلاة لولاية ${prayerInfo.wilaya?.name || 'الجزائر'}`}
        >
          <Compass className="w-3.5 h-3.5 text-brand-500" />
          <span>
            {prayerInfo.nextPrayer?.name}: <strong>{prayerInfo.nextPrayer?.time}</strong>
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
            باقي {prayerInfo.remainingText}
          </span>
        </div>

        {/* Study Timer Bar / Focus launcher */}
        {role === 'student' && (
          <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 px-3 py-1 rounded-xl">
            <button
              onClick={isActive ? pauseSession : resumeSession}
              className="p-1 text-brand-600 dark:text-brand-400 hover:scale-110 transition"
              title={isActive ? 'إيقاف مؤقت' : 'بدء جلسة المذاكرة'}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <span
              onClick={onOpenFocusMode}
              className="font-mono font-bold text-xs text-brand-700 dark:text-brand-300 cursor-pointer hover:underline"
              title="فتح غرفة التركيز الكامل"
            >
              {formatTimer(secondsRemaining)}
            </span>
            {isStudyLockActive && (
              <Lock className="w-3 h-3 text-amber-500 animate-pulse" title="قفل المذاكرة الذاتي مفعّل" />
            )}
          </div>
        )}

        {/* Fullscreen toggle for Windows 10 app-like feel */}
        <FullscreenButton />

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={theme === 'dark' ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الليلي'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Role Switcher Pill */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-600 to-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow hover:scale-105 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تبديل الحساب</span>
        </button>
      </div>
    </header>
  );
};
