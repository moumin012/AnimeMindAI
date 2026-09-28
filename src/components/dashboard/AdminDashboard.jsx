import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { DemoNoticeBanner } from '../common/DemoNoticeBanner';
import { Youtube } from '../common/YoutubeIcon';
import {
  Shield,
  UserCheck,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ALGERIAN_LEVELS } from '../../constants/educationData';

export const AdminDashboard = ({ setActiveTab }) => {
  const [levels, setLevels] = useState(() => storageService.getEducationLevels());
  const [pendingTeachers, setPendingTeachers] = useState([
    {
      id: 'teach-req-1',
      name: 'الأستاذ رشيد سعيدي',
      email: 'rachid.saidi@education.dz',
      subject: 'العلوم الفيزيائية',
      wilaya: '31 - وهران',
      school: 'ثانوية العقيد لطفي',
      docName: 'شهادة العمل وقرار التثبيت الوزاري.pdf',
      appliedAt: '2026-09-25',
      status: 'pending'
    }
  ]);

  const [approvedCount, setApprovedCount] = useState(1);

  const handleApproveTeacher = (id) => {
    setPendingTeachers(prev => prev.filter(t => t.id !== id));
    setApprovedCount(prev => prev + 1);
    alert('تم توثيق الأستاذ بنجاح ومنحه شارة أستاذ موثق ✓');
  };

  const handleRejectTeacher = (id) => {
    setPendingTeachers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 text-right">
      <DemoNoticeBanner />

      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                لوحة المشرف العام (StudentOS Admin)
              </h2>
              <Badge variant="warning" size="sm">
                Super Admin
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              إدارة المستخدمين، توثيق الأساتذة، وتحديث المنظومة والشعب دون الحاجة لإعادة بناء التطبيق
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">إجمالي الطلاب المسجلين</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">1,480 طالب</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">الأساتذة الموثقون</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{approvedCount} موثق ✓</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">الشعب والتخصصات المدعومة</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">6 شعب رئيسية</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
            <Youtube className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">قنوات الأساتذة المفهرسة</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">5 قنوات معتمدة</p>
          </div>
        </Card>
      </div>

      {/* Teacher Verification Queue */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              طلبات توثيق الأساتذة بانتظار المراجعة
            </h3>
          </div>
          <span className="text-xs text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
            {pendingTeachers.length} طلبات جديدة
          </span>
        </div>

        {pendingTeachers.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            لا توجد طلبات توثيق معلقة حالياً.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingTeachers.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {req.name}
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">({req.email})</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    المادة: <strong>{req.subject}</strong> • {req.school} • {req.wilaya}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 mt-1 font-mono">
                    <FileText className="w-3.5 h-3.5" />
                    <span>الوثيقة المرفقة: {req.docName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApproveTeacher(req.id)}
                    icon={CheckCircle2}
                  >
                    قبول وتوثيق ✓
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectTeacher(req.id)}
                    icon={XCircle}
                  >
                    رفض الطلب
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Curriculum & Stream Customizer */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              هيكل التعليم الثانوي الجزائري (ديناميكي وقابل للتحديث)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              يمكنك إضافة شعب جديدة، تخصصات، أو مواد دون إعادة بناء النظام
            </p>
          </div>
          <Button variant="primary" size="xs" icon={Plus}>
            إضافة شعبة أو تخصص جديد
          </Button>
        </div>

        <div className="space-y-4">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">
                    {lvl.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lvl.description}</p>
                </div>
                <Badge variant="brand" size="sm">
                  {lvl.streams?.length || 0} مسارات / شعب
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {lvl.streams?.map((st) => (
                  <span
                    key={st.id}
                    className="px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold"
                  >
                    {st.name} {st.specializations?.length > 0 && `(${st.specializations.length} تخصصات)`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
