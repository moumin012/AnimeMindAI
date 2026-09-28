import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Sparkles, Code2, Palette, Wrench, Clock, Play, Star, CheckCircle2, UserCheck } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../constants/academiesData';

const ICON_MAP = {
  Code2,
  Palette,
  Wrench,
  Sparkles
};

export const SkillAcademyView = () => {
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].id);

  const currentCat = SKILL_CATEGORIES.find(c => c.id === activeCategory) || SKILL_CATEGORIES[0];

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              أكاديمية المهارات (Skill Academy)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مهارات المستقبل للطلاب: البرمجة والذكاء الاصطناعي، التصميم، الرسم الهندسي 3D CAD، وإدارة الوقت
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {SKILL_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Sparkles;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.category}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentCat.skills?.map((skill) => (
          <Card key={skill.id} className="flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <Badge variant="brand" size="sm">
                  {skill.level}
                </Badge>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{skill.rating}</span>
                  <span className="text-slate-400 font-normal">({skill.enrolledCount} طالب)</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition">
                {skill.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {skill.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {skill.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Progress Bar */}
              {skill.completedPercentage > 0 && (
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>نسبة الإنجاز</span>
                    <span>{skill.completedPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${skill.completedPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {skill.duration} ({skill.modulesCount} وحدات)
              </span>

              <Button
                variant="primary"
                size="xs"
                onClick={() => alert(`بدء متابعة دورة "${skill.title}" في أكاديمية المهارات`)}
                icon={Play}
              >
                {skill.completedPercentage > 0 ? 'متابعة الدورة' : 'بدء التعلّم الآن'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
