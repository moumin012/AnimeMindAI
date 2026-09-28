import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HeartHandshake, ShieldCheck, Lock, Copy, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FamilyPortalView = () => {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [permissions, setPermissions] = useState({
    studyTime: true,
    testScores: true,
    assignments: true,
    entertainment: false
  });

  const familyCode = user?.familyCode || 'FAM-K7892';

  const copyCode = () => {
    navigator.clipboard.writeText(familyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              بوابة العائلة والربط الأسري (Family Portal)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مشاركة مؤشرات التقدم وساعات المذاكرة مع ولي الأمر مع ضمان خصوصيتك الكاملة
          </p>
        </div>

        <Badge variant="purple" size="md">
          حساب أسري متصل
        </Badge>
      </div>

      {/* Family Code Card */}
      <Card className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-200 bg-white/10 px-3 py-1 rounded-full inline-block">
              رمز الربط العائلي الخاص بك
            </span>
            <h3 className="text-3xl font-mono font-black tracking-widest text-white">
              {familyCode}
            </h3>
            <p className="text-xs text-purple-200 max-w-md leading-relaxed">
              أعطِ هذا الرمز لولي أمرك ليتمكن من ربط حسابه ومتابعة نتائجك وساعات المذاكرة في لوحته المخصصة.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={copyCode}
            className="bg-white text-purple-950 hover:bg-purple-50 font-bold"
            icon={Copy}
          >
            {copiedCode ? 'تم النسخ بنجاح!' : 'نسخ رمز العائلة'}
          </Button>
        </div>
      </Card>

      {/* Privacy Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Eye className="w-5 h-5" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              ما يستطيع ولي الأمر رؤيته:
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pr-4 list-disc">
            <li>إجمالي ساعات وجلسات المذاكرة المكتملة.</li>
            <li>درجات ونتائج الاختبارات الرسمية والتجريبية.</li>
            <li>حالة تسليم الواجبات المنزلية للأساتذة.</li>
            <li>وقت الترفيه المستخدم (عند تفعيلك للإذن).</li>
          </ul>
        </Card>

        <Card className="space-y-3 border-rose-200/60 dark:border-rose-900/40">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Lock className="w-5 h-5" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              ما لا يستطيع ولي الأمر رؤيته أبداً (خصوصية تامة 🔒):
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pr-4 list-disc">
            <li>محادثاتك وأسئلتك الخاصة مع المساعد الذكي AI.</li>
            <li>مذكراتك وكراسك وملاحظاتك الشخصية.</li>
            <li>الملفات الشخصية خارج الواجبات المطلوبة.</li>
            <li>أي بيانات غير تعليمية.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
