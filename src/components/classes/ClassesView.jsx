import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Users,
  Plus,
  KeyRound,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ClassDetailView } from './ClassDetailView';

export const ClassesView = ({ onOpenPublishLesson, onOpenCreateAssignment, onOpenTeacherTestAI }) => {
  const { user, isTeacher, isStudent } = useAuth();
  const [classes, setClasses] = useState(() => storageService.getClasses());
  const [selectedClass, setSelectedClass] = useState(null);

  // Modals
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Join State
  const [joinCode, setJoinCode] = useState('');
  const [joinResult, setJoinResult] = useState(null);

  // Create Class State
  const [newClassData, setNewClassData] = useState({
    name: '2AS تقني رياضي – هندسة ميكانيكية (فوج 2)',
    level: '2AS',
    stream: 'tech',
    specialization: 'meca',
    subjectId: 'tech-meca',
    subjectName: 'التكنولوجيا: هندسة ميكانيكية',
    description: 'صف إضافي لحصص الدعم والمراجعة التطبيقية في الهندسة الميكانيكية.'
  });

  const handleJoinClass = () => {
    if (!joinCode.trim()) return;
    const res = storageService.joinClassByCode(user, joinCode);
    setJoinResult(res);
    if (res.success) {
      setClasses(storageService.getClasses());
      setTimeout(() => {
        setIsJoinModalOpen(false);
        setJoinResult(null);
        setJoinCode('');
        setSelectedClass(res.targetClass);
      }, 1200);
    }
  };

  const handleCreateClass = () => {
    if (!newClassData.name.trim()) return;
    const newCode = `DZ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newClass = {
      id: 'cls-' + Date.now(),
      code: newCode,
      name: newClassData.name,
      teacherId: user.id,
      teacherName: user.name,
      teacherAvatar: user.avatar,
      teacherVerified: user.verificationStatus === 'verified',
      level: newClassData.level,
      stream: newClassData.stream,
      specialization: newClassData.specialization,
      subjectId: newClassData.subjectId,
      subjectName: newClassData.subjectName,
      academicYear: '2026/2027',
      description: newClassData.description,
      coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      studentIds: [],
      students: [],
      announcements: []
    };

    storageService.saveClass(newClass);
    setClasses(storageService.getClasses());
    setIsCreateModalOpen(false);
    setSelectedClass(newClass);
  };

  if (selectedClass) {
    return (
      <ClassDetailView
        classObj={selectedClass}
        onBack={() => setSelectedClass(null)}
        onOpenPublishLesson={onOpenPublishLesson}
        onOpenCreateAssignment={onOpenCreateAssignment}
        onOpenTeacherTestAI={onOpenTeacherTestAI}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              الصفوف التعليمية (Classes & Groups)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ربط مباشر بين الطالب والأستاذ عبر الدروس المعتمدة، الواجبات، والاختبارات التفاعلية
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isStudent && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsJoinModalOpen(true)}
              icon={KeyRound}
            >
              الانضمام إلى صف برمز
            </Button>
          )}

          {isTeacher && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              icon={Plus}
            >
              + إنشاء صف تدريسي جديد
            </Button>
          )}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls) => (
          <Card
            key={cls.id}
            hover
            onClick={() => setSelectedClass(cls)}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <Badge variant="brand" size="sm">
                    {cls.level} • {cls.subjectName}
                  </Badge>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 group-hover:text-brand-500 transition">
                    {cls.name}
                  </h3>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                  {cls.code}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {cls.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={cls.teacherAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                  alt={cls.teacherName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {cls.teacherName}
                </span>
                {cls.teacherVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500" title="أستاذ موثق ✓" />
                )}
              </div>

              <span className="font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-[-4px] transition">
                دخول الصف ←
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Join Class Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setJoinResult(null);
        }}
        title="الانضمام إلى صف تعليمي"
        subtitle="أدخل رمز الانضمام المكوّن من أحرف وأرقام الذي قدمه لك أستاذك (مثال: MEC-7K42)"
        icon={KeyRound}
      >
        <div className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رمز الصف:
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="مثلاً: MEC-7K42"
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-mono font-bold text-center tracking-widest uppercase focus:outline-none focus:border-brand-500"
            />
          </div>

          {joinResult && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              joinResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {joinResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{joinResult.success ? 'تم الانضمام بنجاح! جاري فتح الصف...' : joinResult.message}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="primary" onClick={handleJoinClass} icon={KeyRound}>
              انضمام إلى الصف
            </Button>
            <Button variant="ghost" onClick={() => setIsJoinModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Class Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إنشاء صف تدريسي جديد"
        subtitle="سيتم توليد رمز انضمام فريد لمشاركته مع تلاميذك"
        icon={Plus}
      >
        <div className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم الصف:
            </label>
            <input
              type="text"
              value={newClassData.name}
              onChange={(e) => setNewClassData({ ...newClassData, name: e.target.value })}
              placeholder="مثلاً: 2AS تقني رياضي – هندسة ميكانيكية"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المستوى:
              </label>
              <select
                value={newClassData.level}
                onChange={(e) => setNewClassData({ ...newClassData, level: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                <option value="1AS">1AS (السنة الأولى)</option>
                <option value="2AS">2AS (السنة الثانية)</option>
                <option value="3AS">3AS (البكالوريا BAC)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المادة:
              </label>
              <input
                type="text"
                value={newClassData.subjectName}
                onChange={(e) => setNewClassData({ ...newClassData, subjectName: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              وصف الصف وأهدافه:
            </label>
            <textarea
              rows={3}
              value={newClassData.description}
              onChange={(e) => setNewClassData({ ...newClassData, description: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="primary" onClick={handleCreateClass}>
              تأكيد وإنشاء الصف
            </Button>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
