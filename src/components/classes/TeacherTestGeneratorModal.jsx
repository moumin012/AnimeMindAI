import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Sparkles, Bot, CheckCircle2, Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';

export const TeacherTestGeneratorModal = ({ isOpen, onClose, onTestCreated }) => {
  const [topic, setTopic] = useState('أنظمة نقل الحركة بالعجلات المسننة ونسب التخفيض');
  const [subjectName, setSubjectName] = useState('هندسة ميكانيكية');
  const [level, setLevel] = useState('2AS');
  const [stream, setStream] = useState('تقني رياضي');
  
  const [generating, setGenerating] = useState(false);
  const [proposal, setProposal] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await aiService.generateTeacherExamProposal({
        subjectName,
        level,
        stream,
        lessonTopic: topic
      });
      setProposal(res);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!proposal) return;
    const newTest = {
      id: 'test-' + Date.now(),
      classId: 'class-meca-2as-1',
      title: proposal.title,
      subjectId: 'tech-meca',
      durationMinutes: proposal.suggestedDurationMinutes || 30,
      totalPoints: proposal.totalPoints || 20,
      mode: 'both',
      description: `اختبار مقترح ومعدل بواسطة الأستاذ حول موضوع: ${topic}`,
      questions: proposal.questions
    };

    storageService.saveTest(newTest);
    if (onTestCreated) onTestCreated(newTest);
    onClose();
    alert('تمت مراجعة ونشر الاختبار بنجاح لجميع طلاب الصف!');
  };

  const handleDeleteQ = (idx) => {
    if (!proposal) return;
    const updated = { ...proposal };
    updated.questions.splice(idx, 1);
    setProposal(updated);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="مساعد الأستاذ الذكي: توليد ومراجعة الاختبارات"
      subtitle="يقترح الذكاء الاصطناعي أسئلة بيداغوجية، مع إمكانية المراجعة والتعديل الكامل قبل النشر"
      maxWidth="max-w-3xl"
      icon={Sparkles}
    >
      <div className="space-y-5 text-right">
        {!proposal ? (
          <div className="space-y-4">
            <div className="p-4 bg-brand-50/60 dark:bg-brand-950/40 rounded-2xl border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-300 leading-relaxed">
              💡 <strong>قاعدة الأمان البيداغوجي:</strong> الذكاء الاصطناعي لا ينشر الاختبار للطلاب تلقائياً. الأستاذ يراجع كل سؤال، يعدل الصياغة والنقاط، ثم يقرر النشر.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                موضوع الدرس أو الوحدة:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثلاً: المتتاليات الحسابية والهندسية"
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المادة:</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المستوى:</label>
                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الشعبة:</label>
                <input
                  type="text"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={handleGenerate}
                loading={generating}
                icon={Bot}
              >
                توليد مقترح الاختبار الآن
              </Button>
              <Button variant="ghost" onClick={onClose}>
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          /* Teacher Review Screen */
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                  {proposal.title}
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  تم توليد {proposal.questions?.length} أسئلة • راجع الأسئلة قبل النشر النهائي
                </p>
              </div>
              <Badge variant="success" size="sm">
                قيد المراجعة للأستاذ
              </Badge>
            </div>

            {/* Questions Review List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {proposal.questions?.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      س{idx + 1} ({q.type}): {q.question}
                    </span>
                    <button
                      onClick={() => handleDeleteQ(idx)}
                      className="text-rose-400 hover:text-rose-600 p-1"
                      title="حذف هذا السؤال"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {q.explanation && (
                    <p className="text-[11px] text-slate-500 italic bg-white dark:bg-slate-700/50 p-2 rounded-xl">
                      الشرح: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setProposal(null)}
                className="text-xs text-slate-500 hover:underline"
              >
                ← إعادة صياغة موضوع آخر
              </button>

              <div className="flex items-center gap-2">
                <Button variant="success" onClick={handlePublish} icon={CheckCircle2}>
                  اعتماد ونشر الاختبار للطلاب
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
