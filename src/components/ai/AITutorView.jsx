import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEducation } from '../../context/EducationContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { aiService } from '../../services/aiService';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  BookOpen,
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const AITutorView = ({ initialSubject = null }) => {
  const { user } = useAuth();
  const { currentSubjects, activeLevel } = useEducation();

  const [selectedSubject, setSelectedSubject] = useState(initialSubject || currentSubjects[0] || { name: 'هندسة ميكانيكية', id: 'tech-meca' });
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `أهلاً بك يا ${user?.name || 'كريم'}! 🎓 أنا رفيقك ومساعدك الذكي في منصة **StudentOS**.
أعرف أنك في مستوى **${user?.level || '2AS'}** شعبة **${user?.streamName || 'تقني رياضي'}** ${user?.specializationName ? `(تخصص ${user.specializationName})` : ''}.

كيف يمكنني مساعدتك اليوم؟
- شرح درس معين أو قانون فيزيائي/ميكانيكي
- توجيهك خطوة بخطوة في حل تمرين دون إعطاء الإجابة مباشرة
- التدريب على نمط ومنهجية أسئلة البكالوريا`,
      timestamp: 'الآن'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const apiKey = localStorage.getItem('studentos_openai_key') || null;
      const aiResponse = await aiService.askTutor({
        message: text.trim(),
        studentProfile: user,
        subject: selectedSubject,
        currentLesson: { title: selectedSubject?.name || 'الدرس المختار' },
        chatHistory: messages,
        apiKey
      });

      const aiMsg = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    `اشرح لي قانون نسبة النقل r = Z1/Z2 وكيف نحسب سرعة الخروج N2 في الهندسة الميكانيكية`,
    `كيف أثبت أن متتالية عددية حسابية وما هو قانون المجموع؟`,
    `ما هي المنهجية الرسمية لحساب الطاقة الحركية وانحفاظ الطاقة؟`,
    `اطرح عليّ 3 أسئلة استرجاع نشط لاختبار فهمي للدرس`
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col pb-4 text-right">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                المساعد الذكي (AI Pedagogical Tutor)
              </h3>
              <Badge variant="brand" size="sm">
                المنهاج الثانوي الجزائري
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              موجّه وفق التدرجات البيداغوجية الرسمية لـ {user?.level || '2AS'} ({user?.streamName || 'تقني رياضي'})
            </p>
          </div>
        </div>

        {/* Subject Selector Pill */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-bold hidden sm:inline">المادة الحالية:</label>
          <select
            value={selectedSubject?.id || ''}
            onChange={(e) => {
              const sub = currentSubjects.find(s => s.id === e.target.value);
              if (sub) setSelectedSubject(sub);
            }}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {currentSubjects.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name} (معامل {sub.coef})
              </option>
            ))}
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages(messages.slice(0, 1))}
            icon={Trash2}
            title="مسح المحادثة"
          />
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isAi
                    ? 'bg-gradient-to-br from-brand-600 to-emerald-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isAi
                    ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
                    : 'bg-brand-600 text-white shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-black/5 dark:border-white/5 text-[10px] opacity-70">
                  <span className="font-bold">{isAi ? 'المساعد الذكي' : user?.name || 'أنت'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
              <span>المساعد الذكي يحلل المنهاج ويصيغ الإجابة البيداغوجية...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 shrink-0">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:border-brand-500 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium whitespace-nowrap transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="pt-1 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`اكتب سؤالك أو الصق تمرين ${selectedSubject?.name || ''}...`}
          className="flex-1 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 shadow-sm transition"
        />
        <Button
          variant="primary"
          onClick={() => handleSend()}
          disabled={!inputMsg.trim() || loading}
          className="p-3.5 rounded-2xl"
          icon={Send}
        >
          إرسال
        </Button>
      </div>
    </div>
  );
};
