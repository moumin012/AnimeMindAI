import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  Sparkles,
  Lock,
  CheckCircle2,
  Edit3,
  Coffee
} from 'lucide-react';

export const FocusStudyView = ({ onBackToDashboard }) => {
  const {
    isActive,
    studyMode,
    sessionSubject,
    durationMinutes,
    secondsRemaining,
    totalSecondsElapsed,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    ambientSound,
    toggleAmbientSound,
    playChime,
    isStudyLockActive
  } = useStudy();

  const [notes, setNotes] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(25);

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercentage = Math.min(100, Math.round(((durationMinutes * 60 - secondsRemaining) / (durationMinutes * 60)) * 100));

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              غرفة التركيز والمذاكرة العميقة (Focus Room)
            </h2>
            <Badge variant={studyMode === 'mandatory' ? 'danger' : 'brand'} size="sm">
              {studyMode === 'mandatory' ? 'جلسة إلزامية 🔒' : studyMode === 'focus' ? 'جلسة تركيز 25/5' : 'جلسة عادية'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            بيئة هادئة خالية من المشتتات مع أصوات طبيعية ومؤقت بومودورو
          </p>
        </div>

        {/* Ambient Sounds bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">أصوات التركيز:</span>
          <button
            onClick={() => toggleAmbientSound('rain')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              ambientSound === 'rain'
                ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="صوت المطر الهادئ"
          >
            <CloudRain className="w-4 h-4" />
            <span className="hidden md:inline">مطر</span>
          </button>

          <button
            onClick={() => toggleAmbientSound('waves')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              ambientSound === 'waves'
                ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="صوت أمواج البحر"
          >
            <Waves className="w-4 h-4" />
            <span className="hidden md:inline">أمواج</span>
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Circular Glow */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-brand-500/20 flex flex-col items-center justify-center relative mb-8 shadow-2xl shadow-brand-500/10">
            <span className="text-5xl sm:text-7xl font-black font-mono tracking-tighter text-slate-900 dark:text-white">
              {formatTimer(secondsRemaining)}
            </span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-2 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full">
              {isActive ? 'الجلسة جارية • ركّز الآن' : 'المؤقت متوقف'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant={isActive ? 'secondary' : 'primary'}
              size="lg"
              onClick={isActive ? pauseSession : resumeSession}
              icon={isActive ? Pause : Play}
              className="px-8 font-black text-sm"
            >
              {isActive ? 'إيقاف مؤقت' : 'بدء التركيز'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={resetSession}
              icon={RotateCcw}
              title="إعادة ضبط المؤقت"
            >
              إعادة الضبط
            </Button>
          </div>

          {/* Quick Presets */}
          {!isActive && (
            <div className="flex items-center gap-2 mt-8">
              <span className="text-xs text-slate-400 font-bold">المدة:</span>
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setSelectedDuration(mins);
                    startSession({ mode: 'focus', duration: mins });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    durationMinutes === mins
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {mins} دقيقة
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scratchpad & Session Notes */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Edit3 className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  مفكرة الجلسة السريعة (Scratchpad)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                دوّن الأفكار، القوانين المستخلصة، أو النقاط التي تحتاج سؤال الأستاذ عنها
              </p>

              <textarea
                rows={10}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتب ملاحظاتك أثناء المذاكرة هنا..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>يتم الحفظ تلقائياً في جهازك</span>
              <Button variant="ghost" size="xs" onClick={() => setNotes('')}>
                مسح المفكرة
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
