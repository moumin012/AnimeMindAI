import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Repeat,
  FileCheck2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const UploadLessonModal = ({ isOpen, onClose, defaultSubject = null }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    const fileName = selectedFile ? selectedFile.name : 'درس مخصص مكتوب';
    const content = pastedText || 'محتوى الوثيقة المرفوعة';

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await aiService.analyzeLessonDocument({
        fileName,
        fileContent: content,
        subjectId: defaultSubject?.id || 'tech-meca',
        levelId: '2AS',
        streamId: 'tech'
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToDeck = () => {
    if (analysisResult?.generatedFlashcards) {
      analysisResult.generatedFlashcards.forEach(fc => {
        storageService.saveFlashcard({
          id: 'fc-' + Date.now() + Math.random().toString(36).substr(2, 4),
          subjectId: defaultSubject?.id || 'tech-meca',
          subjectName: defaultSubject?.name || 'مادة تخصصية',
          topic: analysisResult.title,
          question: fc.question,
          answer: fc.answer,
          level: 1,
          intervalDays: 1,
          nextReviewDate: new Date().toISOString().split('T')[0],
          masteryScore: 50
        });
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="رفع درس أو وثيقة وتحليلها بـ AI"
      subtitle="يقوم الذكاء الاصطناعي باستخراج المفاهيم، المصطلحات، البطاقات، والأسئلة الاسترجاعية"
      maxWidth="max-w-3xl"
      icon={UploadCloud}
    >
      <div className="space-y-5 text-right">
        {!analysisResult ? (
          <div className="space-y-4">
            {/* Drop Zone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-3xl p-6 text-center transition bg-slate-50/50 dark:bg-slate-800/40">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'انقر لاختيار ملف (PDF, DOCX, TXT, صور)'}
                </h4>
                <p className="text-xs text-slate-400">
                  يدعم المذكرات البيداغوجية، كراسات الدروس، أو صور السبورة
                </p>
              </label>
            </div>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 shrink-0">
                أو الصق نص الدرس مباشرة
              </span>
            </div>

            {/* Text Paste */}
            <div>
              <textarea
                rows={4}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="الصق نص الدرس أو القوانين والتمارين هنا..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={handleAnalyze}
                loading={analyzing}
                disabled={!selectedFile && !pastedText.trim()}
                icon={Sparkles}
              >
                تحليل الوثيقة واستخراج مخرجات التعلّم
              </Button>
              <Button variant="ghost" onClick={onClose}>
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          /* Analysis Result Display */
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                    تم تحليل الوثيقة بنجاح: {analysisResult.title}
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    تم استخراج الملخص والمصطلحات و {analysisResult.generatedFlashcards?.length} بطاقات استرجاع نشط
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                مرفوع من المستخدم
              </Badge>
            </div>

            {/* Extracted Summary & Units */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                الملخص والأفكار الأساسية:
              </h5>
              {analysisResult.extractedUnits?.map((u, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h6 className="font-bold text-xs text-slate-900 dark:text-white">
                    {u.title}
                  </h6>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {u.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Generated Flashcards */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-purple-500" />
                <span>بطاقات التكرار المتباعد المستخرجة تلقائياً:</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.generatedFlashcards?.map((fc, i) => (
                  <div key={i} className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/60 text-xs">
                    <p className="font-bold text-purple-900 dark:text-purple-200 mb-1">
                      س: {fc.question}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      ج: {fc.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revision Plan */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-500" />
                <span>خطة المراجعة الموصى بها (Spaced Repetition Schedule):</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {analysisResult.recommendedRevisionSchedule?.map((sch, i) => (
                  <div key={i} className="p-2 bg-white dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600">
                    <span className="font-bold text-brand-600 dark:text-brand-400">اليوم {sch.day}</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 mt-1">{sch.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setAnalysisResult(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
              >
                تحليل ملف آخر
              </button>

              <Button
                variant="primary"
                onClick={handleSaveToDeck}
                disabled={savedSuccess}
                icon={CheckCircle2}
              >
                {savedSuccess ? 'تم حفظ البطاقات في حقيبتك!' : 'حفظ البطاقات في خريطة التكرار المتباعد'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
