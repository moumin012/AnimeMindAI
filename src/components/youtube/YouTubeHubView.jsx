import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Youtube } from '../common/YoutubeIcon';
import {
  Search,
  Play,
  ShieldCheck,
  BookOpen,
  Filter,
  AlertCircle,
  Plus,
  Bot,
  UploadCloud,
  Bookmark
} from 'lucide-react';
import { YOUTUBE_CHANNELS_HUB } from '../../constants/youtubeData';
import { useEducation } from '../../context/EducationContext';
import { YouTubePlayerModal } from './YouTubePlayerModal';

export const YouTubeHubView = ({ onOpenUploadModal, onOpenAITutor }) => {
  const { currentSubjects, activeLevel, activeStream, activeSpec } = useEducation();
  const [activeTab, setActiveTab] = useState('my_teachers'); // 'my_teachers' | 'discover'
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [activePlayingVideo, setActivePlayingVideo] = useState(null);

  // Filter channels
  const channels = YOUTUBE_CHANNELS_HUB.filter((ch) => {
    if (selectedSubjectFilter === 'all') return true;
    return ch.subjectId === selectedSubjectFilter;
  });

  return (
    <div className="space-y-6 pb-12 text-right">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              منصة أساتذة اليوتيوب (YouTube Teacher Hub)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            شروحات مرئية منتقاة ومفهرسة حسب الشعبة والتخصص والمادة مع تشغيل نظامي ورسمي داخل StudentOS
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('my_teachers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'my_teachers'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👨‍🏫 أساتذتي المتابعون
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'discover'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔎 اكتشف الأساتذة
          </button>
        </div>
      </div>

      {/* Subject Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
            selectedSubjectFilter === 'all'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          جميع المواد
        </button>

        {currentSubjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubjectFilter(sub.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedSubjectFilter === sub.id
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Channels List */}
      {channels.length === 0 ? (
        /* Strict fallback requirement #24 */
        <Card className="text-center py-12 space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              «لم نجد حالياً مصدراً موثوقاً لهذه المادة.»
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              لا نقوم باختلاق قنوات أو روابط وهمية. يمكنك رفع درس أو وثيقة بصيغة PDF، أو اقتراح قناة موثوقة للمشرفين لإضافتها.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenUploadModal}
              icon={UploadCloud}
            >
              رفع درس لهذه المادة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenAITutor()}
              icon={Bot}
            >
              استخدام المساعد الذكي
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {channels.map((ch) => (
            <Card key={ch.id} className="space-y-5">
              {/* Channel Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <img
                    src={ch.avatar}
                    alt={ch.channelName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {ch.channelName}
                      </h3>
                      {ch.verified && (
                        <ShieldCheck className="w-4 h-4 text-brand-500" title="قناة تعليمية معتمدة" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {ch.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="brand" size="sm">
                    {ch.playlists?.length || 0} دورات وسلاسل
                  </Badge>
                </div>
              </div>

              {/* Playlists & Videos Carousel */}
              <div className="space-y-4">
                {ch.playlists?.map((pl) => (
                  <div key={pl.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <span>{pl.title}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {pl.videos?.length || 0} دروس متسلسلة
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {pl.videos?.map((vid) => (
                        <div
                          key={vid.id}
                          onClick={() => setActivePlayingVideo({ ...vid, channelName: ch.channelName, playlistTitle: pl.title })}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-500 transition cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                              <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                {vid.duration}
                              </span>
                              <span>{vid.views} مشاهدة</span>
                            </div>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-snug group-hover:text-brand-500 transition line-clamp-2">
                              {vid.title}
                            </h5>
                          </div>

                          <div className="pt-3 mt-3 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">تشغيل رسمي</span>
                            <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1 group-hover:scale-105 transition">
                              <Play className="w-3 h-3 fill-current" />
                              <span>مشاهدة</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Embedded Player Modal */}
      {activePlayingVideo && (
        <YouTubePlayerModal
          video={activePlayingVideo}
          onClose={() => setActivePlayingVideo(null)}
        />
      )}
    </div>
  );
};
