import React, { useState, useEffect } from 'react';
import { useOffline } from '../../context/OfflineContext';
import { WifiOff, CheckCircle2, CloudOff } from 'lucide-react';

export const OfflineBanner = () => {
  const { isOnline, lastSyncTime } = useOffline();
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowSyncSuccess(true);
      const timer = setTimeout(() => {
        setShowSyncSuccess(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md select-none transition-all animate-fadeIn">
        <div className="flex items-center gap-2">
          <CloudOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            أنت غير متصل بالإنترنت — تم تفعيل وضع Offline (المهام، الجدول، المؤقت، والبطاقات تعمل محلياً).
          </span>
        </div>
        <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded font-mono">
          OFFLINE MODE
        </span>
      </div>
    );
  }

  if (showSyncSuccess) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md select-none transition-all animate-fadeIn">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>تمت استعادة الاتصال ومزامنة بياناتك المحلية بنجاح! ({lastSyncTime})</span>
        </div>
      </div>
    );
  }

  return null;
};
