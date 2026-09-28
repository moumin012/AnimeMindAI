import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export const DemoNoticeBanner = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-sky-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 ${className}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong>تنبيه تجريبي:</strong> هذه بيانات Demo توضيحية وليست بيانات حقيقية لغرض استعراض وتجربة ميزات النظام الشاملة.
        </span>
      </div>
      <span className="hidden md:inline-block px-2 py-0.5 bg-amber-500/20 rounded-md font-mono text-[10px] text-amber-700 dark:text-amber-300">
        DEMO MODE
      </span>
    </div>
  );
};
