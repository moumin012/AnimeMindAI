import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Youtube } from '../common/YoutubeIcon';
import {
  ArrowRight,
  BookOpen,
  FileCheck2,
  FileText,
  Megaphone,
  Calendar,
  Users,
  Plus,
  ShieldCheck,
  Copy,
  Clock,
  Download,
  Send,
  CheckCircle2,
  Sparkles,
  Bot
} from 'lucide-react';
import { DEMO_LESSONS, DEMO_ASSIGNMENTS, DEMO_TESTS } from '../../constants/demoData';

export const ClassDetailView = ({
  classObj,
  onBack,
  onOpenPublishLesson,
  onOpenCreateAssignment,
  onOpenTeacherTestAI
}) => {
  const { user, isTeacher, isStudent } = useAuth();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'lessons' | 'assignments' | 'tests' | 'announcements' | 'students'
  const [copiedCode, setCopiedCode] = useState(false);

  // Class data
  const lessons = DEMO_LESSONS.filter(l => l.classId === classObj.id || l.subjectId === classObj.subjectId);
  const assignments = DEMO_ASSIGNMENTS.filter(a => a.classId === classObj.id || a.subjectId === classObj.subjectId);
  const tests = DEMO_TESTS.filter(t => t.classId === classObj.id || t.subjectId === classObj.subjectId);
  const announcements = classObj.announcements || [];

  // Submit Homework State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeAssignmentToSubmit, setActiveAssignmentToSubmit] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // New Announcement state
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceContent, setNewAnnounceContent] = useState('');

  const copyCode = () => {
    navigator.clipboard.writeText(classObj.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePostAnnouncement = () => {
    if (!newAnnounceTitle.trim()) return;
    classObj.announcements.unshift({
      id: 'ann-' + Date.now(),
      title: newAnnounceTitle.trim(),
      content: newAnnounceContent.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      pinned: false
    });
    setIsAnnounceModalOpen(false);
    setNewAnnounceTitle('');
    setNewAnnounceContent('');
  };

  const handleStudentSubmit = () => {
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      alert('تم تسليم الواجب بنجاح للأستاذ!');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Back Button & Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md mb-4 transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع لقائمة الصفوف</span>
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand" size="sm">
                {classObj.level} • {classObj.subjectName}
              </Badge>
              <span className="text-xs text-slate-300">السنة الدراسية {classObj.academicYear}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {classObj.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {classObj.description}
            </p>
          </div>

          {/* Join Code Display */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div>
              <p className="text-[10px] text-slate-300 font-medium">رمز انضمام الصف</p>
              <p className="font-mono font-black text-base text-brand-300">{classObj.code}</p>
            </div>
            <button
              onClick={copyCode}
              className="p-2 hover:bg-white/10 rounded-xl transition text-white"
              title="نسخ الرمز"
            >
              <Copy className="w-4 h-4" />
            </button>
            {copiedCode && <span className="text-[10px] text-emerald-400 font-bold">تم النسخ!</span>}
          </div>
        </div>
      </div>

      {/* Class Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'feed', label: 'الرئيسية والنشاطات', icon: Megaphone },
          { id: 'lessons', label: `الدروس المنشورة (${lessons.length})`, icon: BookOpen },
          { id: 'assignments', label: `الواجبات (${assignments.length})`, icon: FileCheck2 },
          { id: 'tests', label: `الاختبارات (${tests.length})`, icon: FileText },
          { id: 'students', label: `الطلاب والنتائج (${classObj.students?.length || 5})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Feed & Activity */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Teacher Quick Post Bar (if Teacher) */}
            {isTeacher && (
              <Card className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-bold">نشر إعلان جديد لطلاب الصف:</span>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => setIsAnnounceModalOpen(true)}
                  icon={Megaphone}
                >
                  كتابة إعلان
                </Button>
              </Card>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
              {announcements.map((ann) => (
                <Card key={ann.id} className="relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {ann.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400">{ann.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-8">
                    {ann.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-4">
            <Card>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                أستاذ المادة
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={classObj.teacherAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                  alt={classObj.teacherName}
                  className="w-12 h-12 rounded-2xl object-cover border border-brand-500/40"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {classObj.teacherName}
                    </h5>
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">أستاذ رئيسي للتعليم الثانوي</p>
                </div>
              </div>
            </Card>

            {isTeacher && (
              <Card>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                  إجراءات تدريسية
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start"
                    onClick={onOpenPublishLesson}
                    icon={BookOpen}
                  >
                    + نشر درس جديد
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start"
                    onClick={onOpenCreateAssignment}
                    icon={FileCheck2}
                  >
                    + إنشاء واجب منزلي
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start"
                    onClick={onOpenTeacherTestAI}
                    icon={Bot}
                  >
                    + توليد اختبار بـ AI
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Lessons */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              الدروس والمحاضرات المنشورة
            </h3>
            {isTeacher && (
              <Button variant="primary" size="xs" onClick={onOpenPublishLesson} icon={Plus}>
                نشر درس جديد
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {lessons.map((les) => (
              <Card key={les.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="brand" size="sm">
                      {les.unitTitle}
                    </Badge>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                      {les.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      نُشر بواسطة: {les.authorName} • {les.createdAt}
                    </p>
                  </div>

                  <Badge variant="success" size="sm">
                    منشور ✓
                  </Badge>
                </div>

                {/* Lesson Markdown Content */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {les.contentMarkdown}
                </div>

                {/* Terminology tags */}
                {les.keyTerms && les.keyTerms.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs text-slate-500">المصطلحات التقنية الأساسية:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {les.keyTerms.map((term, idx) => (
                        <div key={idx} className="p-2.5 bg-brand-50/50 dark:bg-brand-950/30 rounded-xl border border-brand-200/60 dark:border-brand-800/60 text-xs">
                          <span className="font-bold text-brand-900 dark:text-brand-300">{term.ar}</span>
                          <span className="text-slate-500 text-[11px] font-mono mr-2">({term.fr})</span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{term.def}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              الواجبات المنزلية والتطبيقات
            </h3>
            {isTeacher && (
              <Button variant="primary" size="xs" onClick={onOpenCreateAssignment} icon={Plus}>
                إنشاء واجب جديد
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {assignments.map((asg) => (
              <Card key={asg.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="warning" size="sm" icon={Clock}>
                      تاريخ التسليم: {asg.dueDate.replace('T', ' ')}
                    </Badge>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                      {asg.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    العلامة القصوى: {asg.maxScore}/20
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {asg.description}
                </p>

                {/* Submission status for Student */}
                {isStudent && asg.mySubmission && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        ✅ تم تسليم حلك وتصحيحه من قبل الأستاذ!
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        <strong>ملاحظة الأستاذ:</strong> {asg.mySubmission.teacherFeedback}
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {asg.mySubmission.score} / 20
                      </span>
                    </div>
                  </div>
                )}

                {isStudent && !asg.mySubmission && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveAssignmentToSubmit(asg);
                      setIsSubmitModalOpen(true);
                    }}
                    icon={Send}
                  >
                    تسليم حل الواجب
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tests */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              اختبارات وتقييمات الصف
            </h3>
            {isTeacher && (
              <Button variant="primary" size="xs" onClick={onOpenTeacherTestAI} icon={Sparkles}>
                توليد اختبار ذكي بـ AI
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test) => (
              <Card key={test.id} className="flex flex-col justify-between">
                <div>
                  <Badge variant="purple" size="sm">
                    {test.durationMinutes} دقيقة
                  </Badge>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {test.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {test.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {test.questions?.length || 5} أسئلة
                  </span>
                  <Button variant="primary" size="xs">
                    بدء الاختبار
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Students & Aggregate Analytics (Non-competitive) */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  قائمة طلاب الصف ({classObj.students?.length || 5} تلاميذ)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  مؤشرات عامة تساعد الأستاذ على معرفة التلاميذ الذين يحتاجون دعماً إضافياً دون ترتيب تنافسي مفروض
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {classObj.students?.map((std) => (
                <div
                  key={std.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={std.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                      alt={std.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {std.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        تاريخ الانضمام: {std.joinedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 dark:text-slate-300">
                      الواجبات المنجزة: <strong>{std.completedAssignments}</strong>
                    </span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-1 rounded-lg">
                      المعدل: {std.averageScore > 0 ? `${std.averageScore} / 20` : 'بانتظار التقييم'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Announcement Modal */}
      <Modal
        isOpen={isAnnounceModalOpen}
        onClose={() => setIsAnnounceModalOpen(false)}
        title="نشر إعلان صفي جديد"
        icon={Megaphone}
      >
        <div className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان الإعلان:
            </label>
            <input
              type="text"
              value={newAnnounceTitle}
              onChange={(e) => setNewAnnounceTitle(e.target.value)}
              placeholder="مثلاً: غداً سنراجع الوحدة الثالثة"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              نص الإعلان والتعليمات:
            </label>
            <textarea
              rows={4}
              value={newAnnounceContent}
              onChange={(e) => setNewAnnounceContent(e.target.value)}
              placeholder="اكتب التوجيهات أو الملاحظات الموجهة لتلاميذك..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="primary" onClick={handlePostAnnouncement}>
              نشر الإعلان فوراً
            </Button>
            <Button variant="ghost" onClick={() => setIsAnnounceModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>

      {/* Student Submit Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`تسليم حل: ${activeAssignmentToSubmit?.title || 'الواجب'}`}
        icon={Send}
      >
        <div className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اكتب حلك أو ملاحظاتك للأستاذ:
            </label>
            <textarea
              rows={5}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="اكتب الخطوات أو القوانين الحسابية المستخدمة..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div className="border border-dashed border-slate-300 dark:border-slate-700 p-4 rounded-xl text-center text-xs text-slate-500 cursor-pointer hover:border-brand-500">
            📎 انقر لرفع ملف PDF أو صورة حل الكراس
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="primary" onClick={handleStudentSubmit}>
              تأكيد التسليم
            </Button>
            <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
