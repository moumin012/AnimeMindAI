import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Gamepad2, Clock, ShieldCheck, Lock, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { storageService } from '../../services/storageService';

export const EntertainmentControlView = () => {
  const [data, setData] = useState(() => storageService.getEntertainmentData());

  const remaining = Math.max(0, data.dailyLimitMinutes - data.usedMinutesToday);

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ضبط وإدارة وقت الترفيه (Entertainment Control)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تنظيم متوازن لأوقات الألعاب وشبكات التواصل بما يضمن التفوق الدراسي دون حرمان
          </p>
        </div>

        <div className="p-3 bg-brand-50 dark:bg-brand-950/60 rounded-2xl border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-300">
          ✨ <strong>قاعدة أساسية:</strong> المذاكرة والدروس داخل StudentOS لا تُحسب ترفيهاً أبداً.
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 space-y-2">
          <Clock className="w-8 h-8 text-sky-500 mx-auto" />
          <p className="text-xs text-slate-500">الحد اليومي المخصص</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{data.dailyLimitMinutes} دقيقة</p>
        </Card>

        <Card className="text-center p-6 space-y-2">
          <Gamepad2 className="w-8 h-8 text-amber-500 mx-auto" />
          <p className="text-xs text-slate-500">الوقت المستهلك اليوم</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{data.usedMinutesToday} دقيقة</p>
        </Card>

        <Card className="text-center p-6 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="text-xs text-slate-500">الوقت المتبقي اليوم</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{remaining} دقيقة</p>
        </Card>
      </div>

      {/* Blocked distractions rules */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          التطبيقات والمواقع المندرجة ضمن الترفيه:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {data.blockedApps.map((app, i) => (
            <div
              key={i}
              className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold"
            >
              <span>{app}</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
