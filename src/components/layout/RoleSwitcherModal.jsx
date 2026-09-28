import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { GraduationCap, BookOpen, HeartHandshake, Shield, Check, Sparkles } from 'lucide-react';
import { DEMO_USERS } from '../../constants/demoData';

export const RoleSwitcherModal = () => {
  const { isRoleModalOpen, setIsRoleModalOpen, role, switchRole } = useAuth();

  const roleCards = [
    {
      id: 'student',
      title: 'حساب الطالب (Student Mode)',
      user: DEMO_USERS.student,
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-700',
      description: 'تجربة الطالب: اختيار الشعبة والمواد، جدول المذاكرة، الذكاء الاصطناعي، الاسترجاع النشط، الانضمام للصفوف وحل الاختبارات.',
      badge: '2AS تقني رياضي',
    },
    {
      id: 'teacher',
      title: 'حساب الأستاذ (Teacher Mode)',
      user: DEMO_USERS.teacher,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-700',
      description: 'تجربة الأستاذ: إنشاء الصفوف برمز MEC-7K42، نشر الدروس والواجبات، توليد الاختبارات بـ AI، وتصحيح أعمال الطلاب.',
      badge: 'أستاذ موثق ✓',
    },
    {
      id: 'parent',
      title: 'حساب ولي الأمر (Family / Guardian)',
      user: DEMO_USERS.parent,
      icon: HeartHandshake,
      color: 'from-purple-500 to-pink-700',
      description: 'تجربة ولي الأمر: متابعة ساعات الدراسة، درجات الاختبارات، حالة الواجبات دون انتهاك خصوصية المحادثات الخاصة.',
      badge: 'ولي أمر كريم',
    },
    {
      id: 'admin',
      title: 'حساب المشرف (Admin Mode)',
      user: DEMO_USERS.admin,
      icon: Shield,
      color: 'from-amber-500 to-orange-700',
      description: 'لوحة الإدارة: توثيق وتفعيل طلبات الأساتذة، تعديل الشعب والتخصصات والمواد، وإدارة المنهاج وقنوات يوتيوب.',
      badge: 'إشراف كامل',
    },
  ];

  return (
    <Modal
      isOpen={isRoleModalOpen}
      onClose={() => setIsRoleModalOpen(false)}
      title="تبديل حساب المستخدم (تجربة الأدوار)"
      subtitle="اختر الدور الذي ترغب في تجربته لمعاينة ميزات StudentOS المخصصة له"
      maxWidth="max-w-3xl"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {roleCards.map((rc) => {
          const Icon = rc.icon;
          const isCurrent = role === rc.id;
          return (
            <div
              key={rc.id}
              onClick={() => switchRole(rc.id)}
              className={`
                relative p-5 rounded-2xl border-2 transition-all cursor-pointer text-right flex flex-col justify-between
                ${isCurrent
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-lg shadow-brand-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                }
              `}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${rc.color} text-white shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {rc.user.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rc.title}
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {rc.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <Badge variant={isCurrent ? 'brand' : 'default'} size="sm">
                  {rc.badge}
                </Badge>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {isCurrent ? 'الحساب النشط حالياً' : 'الدخول بهذا الحساب ←'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
