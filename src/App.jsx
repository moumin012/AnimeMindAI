import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { PWAUpdateToast } from './components/common/PWAUpdateToast';
import { RoleSwitcherModal } from './components/layout/RoleSwitcherModal';
import { StudyLockOverlay } from './components/layout/StudyLockOverlay';
import { SearchModal } from './components/layout/SearchModal';

// Dashboards
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';

// Subjects & Curricula
import { SubjectsView } from './components/subjects/SubjectsView';
import { UploadLessonModal } from './components/subjects/UploadLessonModal';

// AI Tutor
import { AITutorView } from './components/ai/AITutorView';

// Study & Schedule
import { SmartSchedulerView } from './components/study/SmartSchedulerView';
import { TasksView } from './components/study/TasksView';
import { FocusStudyView } from './components/study/FocusStudyView';
import { ActiveRecallView } from './components/study/ActiveRecallView';
import { KnowledgeMapView } from './components/study/KnowledgeMapView';

// Tests
import { TestsView } from './components/tests/TestsView';
import { TestTakingModal } from './components/tests/TestTakingModal';

// Classes & Teacher tools
import { ClassesView } from './components/classes/ClassesView';
import { TeacherTestGeneratorModal } from './components/classes/TeacherTestGeneratorModal';

// YouTube Teacher Hub
import { YouTubeHubView } from './components/youtube/YouTubeHubView';

// Academies
import { LanguageAcademyView } from './components/academies/LanguageAcademyView';
import { SkillAcademyView } from './components/academies/SkillAcademyView';

// Spiritual & Lifestyle
import { PrayerView } from './components/spiritual/PrayerView';
import { QuranView } from './components/spiritual/QuranView';
import { EntertainmentControlView } from './components/lifestyle/EntertainmentControlView';
import { FamilyPortalView } from './components/lifestyle/FamilyPortalView';

// Stats & Settings
import { ProgressStatsView } from './components/stats/ProgressStatsView';
import { SettingsView } from './components/settings/SettingsView';

export const App = () => {
  const { user, role, isStudent, isTeacher, isParent, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStudyLockOpen, setIsStudyLockOpen] = useState(false);
  const [isUploadLessonOpen, setIsUploadLessonOpen] = useState(false);
  const [activeTestModal, setActiveTestModal] = useState(null); // { test, mode }
  const [isTeacherTestAIOpen, setIsTeacherTestAIOpen] = useState(false);
  const [aiTutorInitialSubject, setAiTutorInitialSubject] = useState(null);

  // Handle URL Query Params for PWA Shortcuts (e.g. /?tab=focus-study)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    } catch (e) {
      console.warn('URL params parsing error:', e);
    }
  }, []);

  const handleOpenAITutor = (subject = null) => {
    setAiTutorInitialSubject(subject);
    setActiveTab('ai-tutor');
  };

  const handleStartTest = (test, mode = 'exam') => {
    setActiveTestModal({ test, mode });
  };

  const renderActiveView = () => {
    // 1. Role-specific Dashboard
    if (activeTab === 'dashboard') {
      if (isTeacher) {
        return (
          <TeacherDashboard
            setActiveTab={setActiveTab}
            onCreateClass={() => setActiveTab('classes')}
            onPublishLesson={() => setActiveTab('classes')}
            onCreateAssignment={() => setActiveTab('classes')}
            onCreateTest={() => setActiveTab('tests')}
            onOpenTeacherAI={() => setIsTeacherTestAIOpen(true)}
          />
        );
      }
      if (isParent) {
        return <ParentDashboard setActiveTab={setActiveTab} />;
      }
      if (isAdmin) {
        return <AdminDashboard setActiveTab={setActiveTab} />;
      }
      // Default Student Dashboard
      return (
        <StudentDashboard
          setActiveTab={setActiveTab}
          onOpenUploadModal={() => setIsUploadLessonOpen(true)}
          onOpenTestModal={(t) => handleStartTest(t, 'exam')}
          onOpenFocusMode={() => setActiveTab('focus-study')}
        />
      );
    }

    // 2. Common & Student Views
    switch (activeTab) {
      case 'scheduler':
        return <SmartSchedulerView />;
      case 'subjects':
        return (
          <SubjectsView
            onOpenUploadModal={() => setIsUploadLessonOpen(true)}
            onOpenAITutor={handleOpenAITutor}
            onOpenTest={(sub) => handleStartTest(null, 'practice')}
          />
        );
      case 'youtube-hub':
      case 'admin-channels':
        return (
          <YouTubeHubView
            onOpenUploadModal={() => setIsUploadLessonOpen(true)}
            onOpenAITutor={handleOpenAITutor}
          />
        );
      case 'classes':
      case 'lessons':
      case 'assignments':
      case 'announcements':
        return (
          <ClassesView
            onOpenPublishLesson={() => {}}
            onOpenCreateAssignment={() => {}}
            onOpenTeacherTestAI={() => setIsTeacherTestAIOpen(true)}
          />
        );
      case 'tests':
        return <TestsView onStartTest={handleStartTest} />;
      case 'active-recall':
        return <ActiveRecallView />;
      case 'knowledge-map':
        return <KnowledgeMapView onOpenAITutor={handleOpenAITutor} />;
      case 'ai-tutor':
      case 'ai-assistant':
        return <AITutorView initialSubject={aiTutorInitialSubject} />;
      case 'tasks':
        return <TasksView onStartFocus={() => setActiveTab('focus-study')} />;
      case 'focus-study':
        return <FocusStudyView onBackToDashboard={() => setActiveTab('dashboard')} />;
      case 'stats':
      case 'students-stats':
      case 'study-logs':
      case 'test-scores':
      case 'assignments-view':
        return <ProgressStatsView />;
      case 'languages':
        return <LanguageAcademyView />;
      case 'skills':
        return <SkillAcademyView />;
      case 'quran':
        return <QuranView />;
      case 'prayer':
        return <PrayerView />;
      case 'entertainment':
        return <EntertainmentControlView />;
      case 'family':
        return <FamilyPortalView />;
      case 'admin-users':
      case 'admin-verification':
      case 'admin-curriculum':
        return <AdminDashboard setActiveTab={setActiveTab} />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <StudentDashboard
            setActiveTab={setActiveTab}
            onOpenUploadModal={() => setIsUploadLessonOpen(true)}
            onOpenTestModal={(t) => handleStartTest(t, 'exam')}
            onOpenFocusMode={() => setActiveTab('focus-study')}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Offline Banner Indicator */}
        <OfflineBanner />

        {/* Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenFocusMode={() => setActiveTab('focus-study')}
          onOpenStudyLock={() => setIsStudyLockOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Service Worker Safe Update Notification Toast */}
      <PWAUpdateToast />

      {/* Global Modals */}
      <RoleSwitcherModal />
      <StudyLockOverlay isOpen={isStudyLockOpen} onClose={() => setIsStudyLockOpen(false)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAction={(tab, data) => {
          setActiveTab(tab);
        }}
      />
      <UploadLessonModal
        isOpen={isUploadLessonOpen}
        onClose={() => setIsUploadLessonOpen(false)}
      />
      {activeTestModal && (
        <TestTakingModal
          isOpen={!!activeTestModal}
          onClose={() => setActiveTestModal(null)}
          test={activeTestModal.test}
          initialMode={activeTestModal.mode}
        />
      )}
      <TeacherTestGeneratorModal
        isOpen={isTeacherTestAIOpen}
        onClose={() => setIsTeacherTestAIOpen(false)}
        onTestCreated={(newTest) => {
          setActiveTab('tests');
        }}
      />
    </div>
  );
};
