import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Youtube } from '../common/YoutubeIcon';
import { Edit3, Bookmark, CheckCircle2, ShieldCheck } from 'lucide-react';

export const YouTubePlayerModal = ({ video, onClose }) => {
  const [videoNotes, setVideoNotes] = useState('');
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);

  if (!video) return null;

  const handleSaveNote = () => {
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2000);
  };

  return (
    <Modal
      isOpen={!!video}
      onClose={onClose}
      title={video.title}
      subtitle={`القناة: ${video.channelName} • الدورة: ${video.playlistTitle || 'المنهاج الثانوي'}`}
      maxWidth="max-w-4xl"
      icon={Youtube}
    >
      <div className="space-y-4 text-right">
        {/* Official YouTube Embed Player */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Notes & Lesson Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Lesson Concept Notes */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>ملاحظات ونقاط الدرس الأساسية:</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {video.notes || 'شرح تفصيلي للمفاهيم الهندسية والحسابية وفق المنهاج الوزاري الرسمي.'}
            </p>
          </div>

          {/* Student Personal Video Notes */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-brand-500" />
                <span>تدوين ملاحظاتك الشخصية أثناء المشاهدة:</span>
              </h4>
              <textarea
                rows={3}
                value={videoNotes}
                onChange={(e) => setVideoNotes(e.target.value)}
                placeholder="اكتب القوانين أو الأفكار التي ذكرها الأستاذ..."
                className="w-full mt-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="xs"
                onClick={handleSaveNote}
                icon={CheckCircle2}
              >
                {savedNoteSuccess ? 'تم حفظ الملاحظة!' : 'حفظ في كراسي'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
