import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Settings,
  User,
  Key,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Database,
  Lock,
  Monitor,
  Wifi,
  Command,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useEducation } from '../../context/EducationContext';
import { useOffline } from '../../context/OfflineContext';
import { storageService } from '../../services/storageService';
import { ALGERIAN_LEVELS } from '../../constants/educationData';
import { ALGERIAN_WILAYAS } from '../../services/prayerService';

export const SettingsView = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setEducationProfile, activeLevel, activeStream, activeSpec } = useEducation();
  const { isOnline, lastSyncTime } = useOffline();

  const [name, setName] = useState(user?.name || '');
  const [selectedLevel, setSelectedLevel] = useState(activeLevel || '2AS');
  const [selectedStream, setSelectedStream] = useState(activeStream || 'tech');
  const [selectedSpec, setSelectedSpec] = useState(activeSpec || 'meca');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('studentos_openai_key') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentLevelObj = ALGERIAN_LEVELS.find(l => l.id === selectedLevel) || ALGERIAN_LEVELS[1];
  const currentStreamObj = currentLevelObj.streams.find(s => s.id === selectedStream) || currentLevelObj.streams[0];
  const availableSpecs = currentStreamObj?.specializations || [];

  const handleSaveProfile = () => {
    const specObj = availableSpecs.find(sp => sp.id === selectedSpec);
    setEducationProfile({
      level: selectedLevel,
      stream: selectedStream,
      specialization: selectedSpec,
      streamName: currentStreamObj?.name || 'تقني رياضي',
      specializationName: specObj?.name || (availableSpecs.length > 0 ? availableSpecs[0].name : '')
    });
    updateUserProfile({ name });
    
    if (apiKey.trim()) {
      localStorage.setItem('studentos_openai_key', apiKey.trim());
    } else {
      localStorage.removeItem('studentos_openai_key');
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const jsonStr = storageService.exportFullData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studentos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = storageService.importFullData(event.target.result);
        if (res.success) {
          alert('تم استعادة النسخة الاحتياطية بنجاح!');
          location.reload();
        } else {
          alert('فشل في استيراد الملف: ' + res.error);
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              الإعدادات والنسخ الاحتياطي (Settings & System)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة الحساب الدراسي، تثبيت تطبيق سطح المكتب PWA، وتخصيص تجربة التعلم
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ الإعدادات بنجاح!</span>
          </div>
        )}
      </div>

      {/* Profile & Academic Track */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <span>الملف الدراسي والشعبة</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم المستخدم:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              المستوى الدراسي:
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                const lvl = ALGERIAN_LEVELS.find(l => l.id === e.target.value);
                if (lvl && lvl.streams.length > 0) {
                  setSelectedStream(lvl.streams[0].id);
                  const specs = lvl.streams[0].specializations || [];
                  setSelectedSpec(specs.length > 0 ? specs[0].id : '');
                }
              }}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
            >
              {ALGERIAN_LEVELS.map(lvl => (
                <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              الشعبة:
            </label>
            <select
              value={selectedStream}
              onChange={(e) => {
                setSelectedStream(e.target.value);
                const st = currentLevelObj?.streams.find(s => s.id === e.target.value);
                const specs = st?.specializations || [];
                setSelectedSpec(specs.length > 0 ? specs[0].id : '');
              }}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
            >
              {currentLevelObj?.streams.map(st => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>

          {availableSpecs.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                التخصص الهندسي:
              </label>
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              >
                {availableSpecs.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Windows 10 PWA & Offline Status */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-indigo-500" />
          <span>تطبيق سطح المكتب والعمل دون إنترنت (Windows 10 PWA)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-500" />
              <span>تثبيت StudentOS كتطبيق مستقل:</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              يمكنك تشغيل StudentOS كتطبيق سريع على شريط مهام Windows 10 وقائمة ابدأ عبر متصفحي Edge و Chrome.
            </p>
            <div className="pt-2">
              <PWAInstallButton size="sm" variant="primary" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>قاعدة البيانات المحلية (IndexedDB):</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              حالة التخزين: <span className="font-bold text-emerald-600 dark:text-emerald-400">نشط (جاهز للعمل دون اتصال)</span>.
              جميع التعديلات والمهام محفوظة محلياً فورياً وتتم مزامنتها تلقائياً.
            </p>
            <div className="text-[10px] text-slate-400">
              آخر مزامنة نشطة: {lastSyncTime}
            </div>
          </div>
        </div>

        {/* Windows 10 Keyboard Shortcuts Cheat Sheet */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            <Command className="w-4 h-4 text-sky-500" />
            <span>اختصارات لوحة المفاتيح في Windows 10:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">البحث الذكي الفوري</span>
              <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] border border-slate-300 dark:border-slate-600">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">ملء الشاشة للتركيز</span>
              <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] border border-slate-300 dark:border-slate-600">F11</kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">إغلاق النوافذ المنبثقة</span>
              <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] border border-slate-300 dark:border-slate-600">Esc</kbd>
            </div>
          </div>
        </div>
      </Card>

      {/* OpenAI API Key */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-500" />
          <span>مفتاح الذكاء الاصطناعي الخارجي (اختياري)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          يعمل StudentOS تلقائياً بنظام بيداغوجي محلي ذكي. يمكنك اختيارياً إضافة مفتاح OpenAI الخاص بك للحصول على ردود مخصصة إضافية.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            OpenAI API Key:
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
          />
        </div>
      </Card>

      {/* Appearance & Sound Settings */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Moon className="w-5 h-5 text-sky-500" />
          <span>المظهر والصوت</span>
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">المظهر (Dark / Light Mode)</h4>
            <p className="text-[11px] text-slate-500">الوضع الداكن مريح للعين أثناء جلسات المذاكرة الليلية</p>
          </div>
          <Button variant="outline" size="xs" onClick={toggleTheme} icon={theme === 'dark' ? Sun : Moon}>
            {theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الليلي'}
          </Button>
        </div>
      </Card>

      {/* Data Backup & Restore */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-500" />
          <span>النسخ الاحتياطي واستعادة البيانات</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          تصدير جميع مهامك وجدولك وبطاقات التكرار ونتائج الاختبارات كملف JSON آمن للنسخ الاحتياطي
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={handleExportData} icon={Download}>
            تصدير نسخة احتياطية (JSON)
          </Button>

          <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700">
              <Upload className="w-4 h-4" />
              <span>استعادة نسخة احتياطية</span>
            </span>
          </label>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط النظام إلى البيانات التجريبية الافتراضية؟')) {
                storageService.resetToDemo();
              }
            }}
            icon={RotateCcw}
          >
            إعادة الضبط الافتراضي (Demo Reset)
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <Button variant="primary" size="lg" onClick={handleSaveProfile} icon={CheckCircle2}>
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  );
};
