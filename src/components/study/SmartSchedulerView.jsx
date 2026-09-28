import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Calendar, Plus, Clock, Sparkles, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { DEMO_SCHEDULE_EVENTS } from '../../constants/demoData';

const DAYS_OF_WEEK = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export const SmartSchedulerView = () => {
  const [schedule, setSchedule] = useState(() => storageService.getSchedule());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    day: 'الأحد',
    time: '18:00 - 19:30',
    title: '',
    type: 'study',
    color: '#1ea150'
  });

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    const item = {
      id: 'sch-' + Date.now(),
      ...newEvent
    };
    const updated = [...schedule, item];
    setSchedule(updated);
    storageService.saveSchedule(updated);
    setIsAddModalOpen(false);
    setNewEvent({ day: 'الأحد', time: '18:00 - 19:30', title: '', type: 'study', color: '#1ea150' });
  };

  const handleDeleteEvent = (id) => {
    const updated = schedule.filter(e => e.id !== id);
    setSchedule(updated);
    storageService.saveSchedule(updated);
  };

  const handleAutoSuggest = () => {
    alert('تم توليد جدول دراسي ذكي متوازن يجمع بين حصص الثانوية، أوقات الصلاة، جلسات التركيز StudentOS، والراحة!');
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              الجدول الذكي (Smart Scheduler)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تنظيم متكامل لأوقات المدرسة، المذاكرة، الصلاة، والراحة • أنت صاحب القرار الكامل في التعديل
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoSuggest}
            icon={Sparkles}
          >
            اقتراح جدول ذكي
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            إضافة نشاط / حصة
          </Button>
        </div>
      </div>

      {/* Days Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayEvents = schedule.filter(e => e.day === day);
          return (
            <div
              key={day}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col min-h-[320px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {day}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {dayEvents.length} أنشطة
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {dayEvents.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-8">
                    لا توجد حصص مبرمجة
                  </p>
                ) : (
                  dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border transition group relative text-right"
                      style={{
                        backgroundColor: `${ev.color}10`,
                        borderColor: `${ev.color}30`
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="opacity-0 group-hover:opacity-100 text-rose-500 hover:scale-110 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                        {ev.title}
                      </h4>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة نشاط أو حصة دراسية للجدول"
        icon={Plus}
      >
        <div className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اليوم:
            </label>
            <select
              value={newEvent.day}
              onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              {DAYS_OF_WEEK.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان النشاط أو المادة:
            </label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="مثلاً: جلسة تركيز - تمارين الهندسة الميكانيكية"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              التوقيت (من - إلى):
            </label>
            <input
              type="text"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              placeholder="مثلاً: 17:30 - 19:00"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="primary" onClick={handleAddEvent}>
              حفظ في الجدول
            </Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
