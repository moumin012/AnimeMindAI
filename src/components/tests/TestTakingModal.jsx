import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const TestTakingModal = ({ isOpen, onClose, test, initialMode = 'exam' }) => {
  const [mode, setMode] = useState(initialMode);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchingSelections, setMatchingSelections] = useState({});
  const [orderedItems, setOrderedItems] = useState([]);
  const [numericInput, setNumericInput] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState((test?.durationMinutes || 30) * 60);

  useEffect(() => {
    if (test?.questions?.[0]?.type === 'ordering') {
      setOrderedItems([...test.questions[0].items]);
    }
  }, [test]);

  // Timer for Exam mode
  useEffect(() => {
    let timer = null;
    if (isOpen && !isSubmitted && mode === 'exam' && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, mode, secondsLeft]);

  if (!isOpen || !test) return null;

  const questions = test.questions || [];
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (qId, optionId) => {
    setAnswers(prev => ({ ...prev, [qId]: optionId }));
  };

  const handleTrueFalse = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleMatching = (leftIndex, rightText) => {
    setMatchingSelections(prev => ({ ...prev, [leftIndex]: rightText }));
  };

  const moveOrderItem = (fromIndex, toIndex) => {
    const updated = [...orderedItems];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    setOrderedItems(updated);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    const pointsPerQ = 20 / questions.length;

    questions.forEach((q, idx) => {
      if (q.type === 'mcq') {
        const selected = answers[q.id];
        const correctOpt = q.options.find(o => o.isCorrect);
        if (selected && selected === correctOpt?.id) calculatedScore += pointsPerQ;
      } else if (q.type === 'true_false') {
        if (answers[q.id] === q.correctAnswer) calculatedScore += pointsPerQ;
      } else if (q.type === 'calculation') {
        const val = parseFloat(numericInput);
        if (!isNaN(val) && Math.abs(val - q.correctNumericAnswer) <= (q.tolerance || 0.5)) {
          calculatedScore += pointsPerQ;
        }
      } else {
        calculatedScore += pointsPerQ; // Generous for demo matching/ordering
      }
    });

    const score = Math.round(calculatedScore);
    setFinalScore(score);
    setIsSubmitted(true);

    // Save test result
    storageService.saveTestResult({
      id: 'res-' + Date.now(),
      testId: test.id,
      testTitle: test.title,
      score: score,
      totalPoints: 20,
      percentage: Math.round((score / 20) * 100),
      date: new Date().toISOString().split('T')[0],
      mode: mode
    });

    // Confetti if high score
    if (score >= 14) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={test.title}
      subtitle={mode === 'exam' ? `نمط الامتحان الحقيقي • الوقت المتبقي: ${formatTimer(secondsLeft)}` : 'نمط التدريب المفتوح (بدون وقت)'}
      maxWidth="max-w-3xl"
      icon={FileCheck2}
    >
      <div className="space-y-6 text-right">
        {!isSubmitted ? (
          <div>
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
              <span>السؤال {currentQIndex + 1} من {questions.length}</span>
              <Badge variant={mode === 'exam' ? 'danger' : 'brand'} size="sm">
                {mode === 'exam' ? 'امتحان موقوت ⏳' : 'تدريب فوري'}
              </Badge>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                  {currentQIndex + 1}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Question Types Rendering */}

              {/* Type 1: MCQ */}
              {currentQ.type === 'mcq' && (
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      className={`w-full p-3.5 rounded-2xl text-xs sm:text-sm font-medium text-right border transition flex items-center justify-between ${
                        answers[currentQ.id] === opt.id
                          ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQ.id] === opt.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {answers[currentQ.id] === opt.id && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Type 2: True / False */}
              {currentQ.type === 'true_false' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handleTrueFalse(currentQ.id, true)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition flex items-center justify-center gap-2 ${
                      answers[currentQ.id] === true
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>صحيح (Vrai)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTrueFalse(currentQ.id, false)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition flex items-center justify-center gap-2 ${
                      answers[currentQ.id] === false
                        ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-700 dark:text-rose-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-500'
                    }`}
                  >
                    <XCircle className="w-5 h-5 text-rose-500" />
                    <span>خطأ (Faux)</span>
                  </button>
                </div>
              )}

              {/* Type 3: Matching (وصل) */}
              {currentQ.type === 'matching' && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-500 font-bold">صل كل عنصر بالقائمة المناسبة:</p>
                  {currentQ.pairs?.map((p, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {p.left}
                      </span>
                      <span className="text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-950 px-3 py-1 rounded-xl">
                        ← {p.right}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Type 4: Ordering (ترتيب) */}
              {currentQ.type === 'ordering' && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-slate-500 font-bold">الترتيب المنطقي للخطوات:</p>
                  {orderedItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => moveOrderItem(idx, idx - 1)}
                            className="p-1 text-slate-400 hover:text-brand-500"
                          >
                            ↑
                          </button>
                        )}
                        {idx < orderedItems.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveOrderItem(idx, idx + 1)}
                            className="p-1 text-slate-400 hover:text-brand-500"
                          >
                            ↓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Type 5: Calculation (مسائل حسابية) */}
              {currentQ.type === 'calculation' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                    💡 <strong>تلميح القانون:</strong> {currentQ.formulaHint}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      أدخل النتيجة الحسابية النهائية:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={numericInput}
                        onChange={(e) => setNumericInput(e.target.value)}
                        placeholder="مثلاً: 500"
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold w-48"
                      />
                      <span className="text-xs font-bold text-slate-500">{currentQ.unit}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Practice Mode Explanation Hint */}
              {mode === 'practice' && currentQ.explanation && (
                <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-2xl text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
                  <strong>الشرح البيداغوجي:</strong> {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                icon={ArrowRight}
              >
                السابق
              </Button>

              {currentQIndex < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  iconRight={ArrowLeft}
                >
                  السؤال التالي
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleSubmit}
                  icon={CheckCircle2}
                >
                  تسليم وإنهاء الاختبار
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Test Result Screen */
          <div className="text-center py-6 space-y-5 animate-scaleUp">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl ${
              finalScore >= 14 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {finalScore >= 16 ? 'ممتاز! نتيجة استثنائية 🌟' : finalScore >= 10 ? 'عمل جيد! أحسنت 👍' : 'تحتاج لمزيد من المراجعة والتركيز 📚'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تم حفظ نتيجتك في سجل التقدم المدرسي ومزامنة الإحصائيات
              </p>
            </div>

            <div className="inline-block p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-[240px]">
              <span className="text-4xl font-black text-brand-600 dark:text-brand-400 font-mono">
                {finalScore} / 20
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">
                النسبة المئوية: {Math.round((finalScore / 20) * 100)}%
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button
                variant="primary"
                onClick={onClose}
              >
                العودة للاختبارات
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
