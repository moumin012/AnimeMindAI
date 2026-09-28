import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Repeat,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { DEMO_FLASHCARDS } from '../../constants/demoData';

export const ActiveRecallView = () => {
  const [cards, setCards] = useState(() => storageService.getFlashcards());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedSession, setCompletedSession] = useState(false);

  const currentCard = cards[currentIndex] || DEMO_FLASHCARDS[0];

  const handleRate = (quality) => {
    // 1: bad (1 day), 2: good (4 days), 3: easy (7+ days)
    if (currentCard) {
      storageService.updateCardReview(currentCard.id, quality);
    }

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setCompletedSession(true);
    }
  };

  const resetReview = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompletedSession(false);
    setCards(storageService.getFlashcards());
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Repeat className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              الاسترجاع النشط والتكرار المتباعد (Active Recall)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            استرجع المفهوم من ذاكرتك أولاً قبل كشف الإجابة لترسيخ الروابط العصبية في الدماغ
          </p>
        </div>

        <Badge variant="purple" size="md">
          {cards.length} بطاقات مستحقة للمراجعة اليوم
        </Badge>
      </div>

      {!completedSession ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>البطاقة {currentIndex + 1} من {cards.length}</span>
            <span>الفاصل التكراري: {currentCard?.intervalDays || 1} أيام</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* Flashcard Interactive Container */}
          <Card className="min-h-[300px] flex flex-col justify-between p-8 bg-gradient-to-br from-white to-purple-50/20 dark:from-slate-900 dark:to-purple-950/20 border-2 border-purple-200/60 dark:border-purple-800/60 shadow-lg text-center">
            <div className="flex items-center justify-between text-xs mb-4">
              <Badge variant="brand" size="sm">
                {currentCard?.subjectName || 'هندسة ميكانيكية'}
              </Badge>
              <span className="text-slate-400 font-bold">
                الموضوع: {currentCard?.topic}
              </span>
            </div>

            {/* Question */}
            <div className="my-auto py-6">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded-full mb-3 inline-block">
                سؤال الاسترجاع الذهني
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                {currentCard?.question}
              </h3>
            </div>

            {/* Answer Reveal Area */}
            {showAnswer ? (
              <div className="pt-6 border-t border-purple-100 dark:border-purple-900/60 animate-fadeIn text-right">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  الإجابة النموذجية:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium mt-2 leading-relaxed bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {currentCard?.answer}
                </p>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => setShowAnswer(true)}
                className="w-full py-3.5 text-xs font-bold bg-purple-600 hover:bg-purple-500"
                icon={Sparkles}
              >
                انقر لكشف الإجابة والتحقق من استرجاعك
              </Button>
            )}
          </Card>

          {/* Rating Buttons (Spaced repetition evaluation) */}
          {showAnswer && (
            <div className="space-y-2 animate-scaleUp">
              <p className="text-xs text-slate-500 text-center font-bold">
                كيف كان أداؤك في تذكر هذا المفهوم؟
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRate(1)}
                  className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold hover:scale-105 transition"
                >
                  صعب / لم أتذكره
                  <span className="block text-[10px] opacity-70 mt-0.5">مراجعة غداً (1d)</span>
                </button>

                <button
                  onClick={() => handleRate(2)}
                  className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:scale-105 transition"
                >
                  جيد / تذكرت بصعوبة
                  <span className="block text-[10px] opacity-70 mt-0.5">بعد 4 أيام (4d)</span>
                </button>

                <button
                  onClick={() => handleRate(3)}
                  className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:scale-105 transition"
                >
                  متقن وسهل جداً
                  <span className="block text-[10px] opacity-70 mt-0.5">بعد 7-14 يوماً</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Session Banner */
        <Card className="max-w-md mx-auto text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            أحسنت! أتممت مراجعة جميع بطاقات اليوم 🎉
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            تم تحديث خوارزمية التكرار المتباعد وفواصل المراجعة بنجاح لترسيخ المعلومات في الذاكرة الدائمة.
          </p>
          <Button variant="outline" onClick={resetReview} icon={RotateCcw}>
            إعادة المراجعة من جديد
          </Button>
        </Card>
      )}
    </div>
  );
};
