import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { CheckSquare, Plus, Clock, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useEducation } from '../../context/EducationContext';

export const TasksView = ({ onStartFocus }) => {
  const [tasks, setTasks] = useState(() => storageService.getTasks());
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { currentSubjects } = useEducation();

  const [newTask, setNewTask] = useState({
    title: '',
    subjectId: 'tech-meca',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 30,
    category: 'revision'
  });

  const toggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      storageService.saveTask(task);
      setTasks([...tasks]);
    }
  };

  const deleteTask = (taskId) => {
    storageService.deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const subject = currentSubjects.find(s => s.id === newTask.subjectId);
    const task = {
      id: 'task-' + Date.now(),
      title: newTask.title.trim(),
      subjectId: newTask.subjectId,
      subjectName: subject?.name || 'مادة دراسية',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      estimatedMinutes: Number(newTask.estimatedMinutes) || 30,
      completed: false,
      category: newTask.category
    };
    storageService.saveTask(task);
    setTasks([task, ...tasks]);
    setIsAddModalOpen(false);
    setNewTask({
      title: '',
      subjectId: 'tech-meca',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 30,
      category: 'revision'
    });
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              المهام وقائمة المذاكرة (Tasks & To-Do)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            خطط لمهامك اليومية، الواجبات، ومراجعات البكالوريا بدقة
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          icon={Plus}
        >
          إضافة مهمة جديدة
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2">
        {[
          { id: 'all', label: `جميع المهام (${tasks.length})` },
          { id: 'pending', label: `قيد الإنجاز (${tasks.filter(t => !t.completed).length})` },
          { id: 'completed', label: `المكتملة (${tasks.filter(t => t.completed).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-500">لا توجد مهام في هذا التصنيف حالياً</p>
          </Card>
        ) : (
          filteredTasks.map((t) => (
            <Card
              key={t.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                t.completed ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/50' : ''
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => toggleTask(t.id)}
                  className="mt-0.5 text-slate-400 hover:text-brand-500 transition shrink-0"
                >
                  {t.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500 text-white" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <h4
                    className={`font-bold text-sm text-slate-900 dark:text-white ${
                      t.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {t.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <span className="font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded text-[11px]">
                      {t.subjectName}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3" />
                      {t.estimatedMinutes} دقيقة
                    </span>
                    <span className="text-[11px] text-slate-400">
                      تاريخ الاستحقاق: {t.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mr-auto sm:mr-0 pt-2 sm:pt-0">
                {!t.completed && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onStartFocus(t)}
                    icon={Clock}
                  >
                    بدء جلسة تركيز
                  </Button>
                )}
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="حذف المهمة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة مهمة دراسية جديدة"
        icon={Plus}
      >
        <div className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان المهمة:
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="مثلاً: مراجعة قوانين التروس وحل تمرين مخفض السرعة"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المادة:
              </label>
              <select
                value={newTask.subjectId}
                onChange={(e) => setNewTask({ ...newTask, subjectId: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                {currentSubjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الوقت المقدر (دقيقة):
              </label>
              <input
                type="number"
                value={newTask.estimatedMinutes}
                onChange={(e) => setNewTask({ ...newTask, estimatedMinutes: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="primary" onClick={handleAddTask}>
              حفظ المهمة
            </Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
