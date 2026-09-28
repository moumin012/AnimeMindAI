import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Moon, Sun, Compass, Bell, Volume2, Clock, CheckCircle2 } from 'lucide-react';
import { ALGERIAN_WILAYAS, calculatePrayerTimes } from '../../services/prayerService';
import { useAuth } from '../../context/AuthContext';

export const PrayerView = () => {
  const { user, updateUserProfile } = useAuth();
  const [selectedWilayaCode, setSelectedWilayaCode] = useState(user?.wilaya?.slice(0, 2) || '16');
  const [prayerData, setPrayerData] = useState(() => calculatePrayerTimes(selectedWilayaCode));

  useEffect(() => {
    setPrayerData(calculatePrayerTimes(selectedWilayaCode));
  }, [selectedWilayaCode]);

  const handleWilayaChange = (code) => {
    setSelectedWilayaCode(code);
    const wilaya = ALGERIAN_WILAYAS.find(w => w.code === code);
    if (wilaya) {
      updateUserProfile({ wilaya: `${wilaya.code} - ${wilaya.name}` });
    }
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              مواقيت الصلاة (الجزائر - 58 ولاية)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            حساب فلكي دقيق معتمد وفق معايير وزارة الشؤون الدينية والأوقاف الجزائرية
          </p>
        </div>

        {/* Wilaya Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-500 shrink-0">اختر الولاية:</label>
          <select
            value={selectedWilayaCode}
            onChange={(e) => handleWilayaChange(e.target.value)}
            className="w-full md:w-64 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-brand-500"
          >
            {ALGERIAN_WILAYAS.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code} - {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Next Prayer Big Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-emerald-700 to-teal-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
        <div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-emerald-100 mb-3 inline-block">
            الصلاة القادمة لولاية {prayerData.wilaya.name}
          </span>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            صلاة {prayerData.nextPrayer.name}
          </h3>
          <p className="text-sm text-emerald-100 mt-2 font-mono">
            الوقت المحدد: <strong>{prayerData.nextPrayer.time}</strong> • باقي {prayerData.remainingText}
          </p>
        </div>

        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center min-w-[200px]">
          <Clock className="w-8 h-8 text-amber-300 mx-auto mb-2 animate-pulse" />
          <p className="text-xs text-emerald-100">العد التنازلي المتبقي</p>
          <p className="text-2xl font-black font-mono mt-0.5">{prayerData.remainingText}</p>
        </div>
      </div>

      {/* Prayers Times Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {prayerData.prayers.map((pr) => {
          const isNext = pr.id === prayerData.nextPrayer.id;
          return (
            <Card
              key={pr.id}
              className={`text-center p-5 rounded-2xl transition ${
                isNext
                  ? 'border-2 border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-md'
                  : 'bg-white dark:bg-slate-900'
              }`}
            >
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                {pr.name}
              </span>
              <span className="text-xl font-black font-mono text-slate-900 dark:text-white block my-1">
                {pr.time}
              </span>
              {isNext && (
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-950 px-2 py-0.5 rounded-full inline-block mt-1">
                  القادمة
                </span>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
