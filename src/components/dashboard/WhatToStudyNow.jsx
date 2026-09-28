import React from 'react';
import { Sparkles, ArrowLeft, BookOpen, Clock, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { Button } from '../common/Button';

export const WhatToStudyNow = ({ onStartTask, onStartRevision, onStartTest }) => {
  // Recommendation based on student backlog & schedule
  const recommendation = {
    subjectName: 'التكنولوجيا: هندسة ميكانيكية',
    topic: 'الوحدة 3: أنظمة نقل الحركة بالعجلات المسننة (Engrenages)',
    reason: 'لديك واجب منزلي ينتهي بعد يومين + بطاقات استرجاع نشط مستحقة اليوم.',
    priority: 'عالية جداً ⭐',
    estimatedTime: '35 دقيقة',
    actions: [
      { label: 'مراجعة ملخص الدرس والقوانين', type: 'lesson' },
      { label: 'حل 4 بطاقات Spaced Repetition', type: 'revision' },
      { label: 'إتمام تسليم الواجب للأستاذ أحمد', type: 'assignment' }
    ]
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-emerald-700 to-teal-800 text-white p-6 shadow-xl shadow-brand-900/20 text-right">
      {/* Ambient background decoration */}
      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-10 -top-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>ماذا أدرس الآن؟ (خوارزمية الاقتراح الذكي)</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-100 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>الوقت المقترح: {recommendation.estimatedTime}</span>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {recommendation.topic}
          </h3>
          <p className="text-sm text-emerald-100/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            {recommendation.reason}
          </p>
        </div>

        {/* Action checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          {recommendation.actions.map((act, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-white/95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="truncate">{act.label}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onStartTask}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-md transition hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>بدء جلسة دراسة فورية</span>
            </button>
            <button
              onClick={onStartRevision}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-medium text-xs border border-white/20 transition"
            >
              <span>مراجعة البطاقات المستحقة</span>
            </button>
          </div>

          <span className="text-[11px] text-emerald-200/80 italic">
            * الاقتراح استرشادي ولك كامل حرية اختيار ما تدرسه.
          </span>
        </div>
      </div>
    </div>
  );
};
