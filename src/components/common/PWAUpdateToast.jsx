import React, { useState, useEffect } from 'react';
import { pwaService } from '../../services/pwaService';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { Button } from './Button';

export const PWAUpdateToast = () => {
  const [updateAvailable, setUpdateAvailable] = useState(pwaService.isUpdateAvailable);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const unsubscribe = pwaService.on('update_ready', (val) => {
      setUpdateAvailable(val);
      setDismissed(false);
    });
    return () => unsubscribe();
  }, []);

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-md w-full bg-slate-900/95 dark:bg-slate-900/95 text-white p-4 rounded-3xl border border-brand-500/40 shadow-2xl backdrop-blur-xl animate-fadeIn text-right">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/20 text-brand-400 rounded-2xl shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">
              يتوفر إصدار جديد ومحدث من StudentOS 🚀
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              تم تحسين الأداء وتحديث الميزات البيداغوجية. يمكنك التحديث الآن مع الحفاظ الكامل على بياناتك.
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white transition"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-3.5 pt-3 border-t border-slate-800">
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          لاحقاً
        </button>

        <Button
          variant="primary"
          size="xs"
          onClick={() => pwaService.applyUpdate()}
          icon={RefreshCw}
        >
          تحديث الآن
        </Button>
      </div>
    </div>
  );
};
