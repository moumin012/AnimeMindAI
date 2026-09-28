import React from 'react';
import { useStudy } from '../../context/StudyContext';
import { Lock, Unlock, ShieldAlert, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const StudyLockOverlay = ({ isOpen, onClose }) => {
  const { isStudyLockActive, studyLockMinutes, activateStudyLock, deactivateStudyLock, secondsRemaining } = useStudy();

  const [selectedMinutes, setSelectedMinutes] = React.useState(30);

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-right">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-hidden relative">
        {/* Glow Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isStudyLockActive ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-brand-500'}`}>
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Study Lock | نظام التركيز والتحكم بالذات
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مخصص لأجهزة Windows PC / Laptop لحجب المشتتات أثناء جلسات المذاكرة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {isStudyLockActive ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-amber-500/10 border-4 border-amber-500/30 flex items-center justify-center">
              <span className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400">
                {formatTimer(secondsRemaining)}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                جلسة التركيز الإلزامي قيد التشغيل 🔒
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                تم تفعيل حظر المشتتات. ركّز على درسك وتحدّ نفسك لإتمام المهمة الحالية!
              </p>
            </div>

            {/* Blocked Apps list */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-right text-xs space-y-2 border border-slate-200/60 dark:border-slate-700/60">
              <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                المشتتات المحظورة خلال هذه الجلسة:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['مواقع التواصل', 'YouTube الترفيهي', 'ألعاب الفيديو', 'الإشعارات المشتتة'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-md text-[11px] font-medium">
                    ✕ {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3 justify-center">
              <Button
                variant="danger"
                onClick={() => {
                  deactivateStudyLock();
                  onClose();
                }}
                icon={Unlock}
              >
                إنهاء قفل المذاكرة الآن
              </Button>
              <Button variant="secondary" onClick={onClose}>
                إبقاء النافذة في الخلفية
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-5 space-y-5">
            <div className="p-4 bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <p className="text-xs text-brand-800 dark:text-brand-300 leading-relaxed">
                <strong>أمان وموثوقية:</strong> يعمل نظام Study Lock كبيئة تركيز بصرية وتحفيزية شفافة تحت تحكمك الكامل بنسبة 100% دون أي برمجيات خفية أو تجاوز لحماية نظام Windows.
              </p>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر مدة جلسة القفل والتركيز:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 25, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedMinutes(mins)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                      selectedMinutes === mins
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500'
                    }`}
                  >
                    {mins} دقيقة
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  activateStudyLock(selectedMinutes);
                  onClose();
                }}
                icon={Lock}
              >
                بدء قفل المذاكرة ({selectedMinutes} دقيقة)
              </Button>
              <Button variant="ghost" onClick={onClose}>
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
