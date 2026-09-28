import React, { useState } from 'react';
import { useEducation } from '../../context/EducationContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  BookOpen,
  Calculator,
  Atom,
  Dna,
  Cpu,
  Terminal,
  Languages,
  Globe,
  Map,
  Moon,
  Activity,
  Wrench,
  Zap,
  Building,
  FlaskConical,
  Brain,
  BadgeDollarSign,
  TrendingUp,
  Scale,
  Sparkles,
  UploadCloud,
  FileCheck2,
  Bot
} from 'lucide-react';
import { SubjectDetailModal } from './SubjectDetailModal';

const ICON_MAP = {
  Calculator,
  Atom,
  Dna,
  Cpu,
  Terminal,
  Languages,
  Globe,
  Map,
  Moon,
  Activity,
  Wrench,
  Zap,
  Building,
  FlaskConical,
  Brain,
  BadgeDollarSign,
  TrendingUp,
  Scale,
  BookOpen
};

export const SubjectsView = ({ onOpenUploadModal, onOpenAITutor, onOpenTest }) => {
  const { currentSubjects, activeLevel, activeStream, activeSpec } = useEducation();
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              المواد والبرامج الدراسية
            </h2>
            <Badge variant="brand" size="sm">
              {activeLevel}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            قائمة المواد الرسمية المخصصة لشعبة <strong className="text-slate-800 dark:text-slate-200">{user?.streamName || 'تقني رياضي'}</strong> {user?.specializationName && `(تخصص ${user.specializationName})`}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenUploadModal}
          icon={UploadCloud}
        >
          رفع وثيقة أو درس جديد
        </Button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentSubjects.map((sub) => {
          const IconComponent = ICON_MAP[sub.icon] || BookOpen;
          return (
            <Card
              key={sub.id}
              hover
              onClick={() => setSelectedSubject(sub)}
              className="flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="p-3.5 rounded-2xl text-white shadow-sm transition group-hover:scale-110"
                    style={{ backgroundColor: sub.color }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {sub.isMajor && (
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        مادة أساسية ⭐
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                      معامل {sub.coef}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  الحجم الساعي الأسبوعي: <strong>{sub.hours} ساعات</strong>
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  انقر لعرض الوحدات والدروس
                </span>
                <span className="font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-[-4px] transition">
                  فتح المادة ←
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <SubjectDetailModal
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
          onOpenUploadModal={onOpenUploadModal}
          onOpenAITutor={onOpenAITutor}
          onOpenTest={onOpenTest}
        />
      )}
    </div>
  );
};
