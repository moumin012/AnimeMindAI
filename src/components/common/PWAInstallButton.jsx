import React, { useState, useEffect } from 'react';
import { pwaService } from '../../services/pwaService';
import { Download, Monitor, CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

export const PWAInstallButton = ({ variant = 'primary', size = 'xs', className = '' }) => {
  const [isInstallable, setIsInstallable] = useState(pwaService.isInstallable);
  const [isInstalled, setIsInstalled] = useState(pwaService.isInstalled);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const unsub1 = pwaService.on('installable', (val) => setIsInstallable(val));
    const unsub2 = pwaService.on('installed', () => {
      setIsInstalled(true);
      setIsInstallable(false);
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  if (isInstalled) {
    return null; // Don't show install button if app is already running in standalone / installed mode
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const result = await pwaService.promptInstall();
      if (result?.outcome === 'manual_instructions') {
        setShowInstructions(true);
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleInstallClick}
        icon={Download}
        className={`shadow-sm animate-pulse-slow ${className}`}
        title="تثبيت StudentOS كتطبيق مستقل على Windows 10 (Edge / Chrome)"
      >
        تثبيت StudentOS
      </Button>

      {/* Manual Installation Instructions Modal for Windows 10 Edge & Chrome */}
      <Modal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="تثبيت StudentOS على نظام Windows 10"
        subtitle="طريقة تشغيل وتثبيت المنصة كتطبيق مستقل وسريع على سطح المكتب وقائمة ابدأ"
        maxWidth="max-w-xl"
        icon={Monitor}
      >
        <div className="space-y-4 text-right text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-4 bg-brand-50 dark:bg-brand-950/60 rounded-2xl border border-brand-200 dark:border-brand-800 space-y-2">
            <h4 className="font-bold text-sm text-brand-900 dark:text-brand-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>ميزات تثبيت StudentOS كـ PWA على حاسوبك:</span>
            </h4>
            <ul className="list-disc pr-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li>تشغيل فوري في نافذة مستقلة دون شريط العناوين والتبويبات.</li>
              <li>أيقونة مخصصة على سطح المكتب (Desktop) وقائمة ابدأ (Start Menu).</li>
              <li>دعم كامل للعمل بدون إنترنت (Offline) للمهام، الجدول، والبطاقات.</li>
              <li>أداء فائق واستجابة سريعة للأجهزة المتوسطة والضعيفة.</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              خطوات التثبيت السريعة في متصفحك:
            </h4>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-brand-600 dark:text-brand-400">في Microsoft Edge:</span>
              <p className="text-slate-600 dark:text-slate-300">
                انقر على أيقونة التثبيت <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">⊞ App available</span> الموجودة في يمين شريط العناوين، أو اضغط على <strong>القائمة (...) ← التطبيقات (Apps) ← تثبيت StudentOS</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-brand-600 dark:text-brand-400">في Google Chrome:</span>
              <p className="text-slate-600 dark:text-slate-300">
                انقر على أيقونة التثبيت <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">⬇ Install</span> في شريط العناوين، أو من <strong>القائمة (⋮) ← حفظ ومشاركة ← تثبيت StudentOS</strong>.
              </p>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setShowInstructions(false)}>
              حسناً، فهمت
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
