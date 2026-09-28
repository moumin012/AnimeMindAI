import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export const FullscreenButton = ({ className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleKeyDown = (e) => {
      // Toggle fullscreen on F11 or Ctrl+Shift+F
      if (e.key === 'F11' || (e.ctrlKey && e.shiftKey && (e.key === 'F' || e.key === 'f'))) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Fullscreen not supported or allowed in this context:', e);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      className={`p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${className}`}
      title={isFullscreen ? 'تصغير الشاشة (F11)' : 'ملء الشاشة لبيئة تركيز ممتدة (F11)'}
      aria-label="ملء الشاشة"
    >
      {isFullscreen ? (
        <Minimize2 className="w-4 h-4 text-brand-500" />
      ) : (
        <Maximize2 className="w-4 h-4" />
      )}
    </button>
  );
};
