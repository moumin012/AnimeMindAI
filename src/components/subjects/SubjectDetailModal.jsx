import React from 'react';
import { useEducation } from '../../context/EducationContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  BookOpen,
  ShieldCheck,
  AlertCircle,
  UploadCloud,
  Bot,
  FileCheck2,
  Repeat,
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';

export const SubjectDetailModal = ({ subject, onClose, onOpenUploadModal, onOpenAITutor, onOpenTest }) => {
  const { getCurriculum } = useEducation();
  const curriculum = getCurriculum(subject.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'mastered':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">🟢 متقن</span>;
      case 'review':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">🟡 يحتاج مراجعة</span>;
      case 'weak':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">🔴 ضعيف</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">⚪ لم يُدرس بعد</span>;
    }
  };

  return (
    <Modal
      isOpen={!!subject}
      onClose={onClose}
      title={subject.name}
      subtitle={`المعامل: ${subject.coef} • الحجم الساعي: ${subject.hours} ساعات أسبوعياً`}
      maxWidth="max-w-3xl"
      icon={BookOpen}
    >
      <div className="space-y-5 text-right">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <Button
            variant="primary"
            size="xs"
            onClick={() => {
              onClose();
              onOpenAITutor(subject);
            }}
            icon={Bot}
          >
            اسأل المساعد الذكي AI حول هذه المادة
          </Button>

          <Button
            variant="secondary"
            size="xs"
            onClick={() => {
              onClose();
              onOpenTest(subject);
            }}
            icon={FileCheck2}
          >
            اختبار تجريبي
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              onClose();
              onOpenUploadModal(subject);
            }}
            icon={UploadCloud}
          >
            رفع درس أو تمرين
          </Button>
        </div>

        {/* Curriculum Section */}
        {curriculum?.notFound ? (
          /* Fallback when curriculum is not yet in vetted database */
          <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                «البرنامج غير متوفر حالياً في قاعدة البيانات.»
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                لم نقم باختلاق أو افتراض برنامج غير موثق. يمكنك رفع وثيقة البرنامج السنوي الرسمية (PDF/DOCX) أو إضافة محاور الدروس يدويًا ليقوم StudentOS بتحليلها فورًا.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onOpenUploadModal(subject);
              }}
              icon={UploadCloud}
            >
              رفع وثيقة المنهاج السنوي لهذه المادة
            </Button>
          </div>
        ) : (
          /* Official Verified Curriculum */
          <div className="space-y-4">
            {/* Source Seal */}
            <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    منهاج رسمي موثق ومطابق للتدرج السنوي
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    المصدر: {curriculum.sourceLabel}
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                محقّق رسمياً
              </Badge>
            </div>

            {/* Units & Lessons List */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                محاور ووحدات المنهاج المقررة ({curriculum.units?.length || 0} وحدات):
              </h4>

              <div className="space-y-3">
                {curriculum.units?.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                  >
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {unit.title}
                    </h5>

                    <div className="space-y-1.5 pr-2 border-r-2 border-slate-200 dark:border-slate-700">
                      {unit.lessons?.map((les) => (
                        <div
                          key={les.id}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs transition"
                        >
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            • {les.title}
                          </span>
                          {getStatusBadge(les.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
