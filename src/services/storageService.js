// StudentOS Local Storage & Persistent Repository Service
// Supports IndexedDB background synchronization and safe offline persistence
import { DEMO_USERS, DEMO_CLASSES, DEMO_LESSONS, DEMO_ASSIGNMENTS, DEMO_TESTS, DEMO_FLASHCARDS, DEMO_TASKS, DEMO_SCHEDULE_EVENTS } from '../constants/demoData';
import { ALGERIAN_LEVELS } from '../constants/educationData';
import { idbService } from './idbService';

const STORAGE_KEYS = {
  CURRENT_USER: 'studentos_current_user',
  USERS: 'studentos_users',
  CLASSES: 'studentos_classes',
  LESSONS: 'studentos_lessons',
  ASSIGNMENTS: 'studentos_assignments',
  TESTS: 'studentos_tests',
  TEST_RESULTS: 'studentos_test_results',
  FLASHCARDS: 'studentos_flashcards',
  TASKS: 'studentos_tasks',
  SCHEDULE: 'studentos_schedule',
  NOTIFICATIONS: 'studentos_notifications',
  EDUCATION_LEVELS: 'studentos_education_levels',
  SETTINGS: 'studentos_settings',
  ENTERTAINMENT: 'studentos_entertainment',
  AI_CHATS: 'studentos_ai_chats',
  STUDY_SESSIONS: 'studentos_study_sessions',
};

// Event emitter for reactive updates
class StorageEventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in storage listener for ${event}:`, err);
        }
      });
    }
  }
}

export const storageEvents = new StorageEventEmitter();

// Helper to get from storage or init default
const getOrInit = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
  }
  localStorage.setItem(key, JSON.stringify(defaultVal));
  return defaultVal;
};

// Save helper with IndexedDB backup
const save = (key, data, storeName = null) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    storageEvents.emit(key, data);
    
    // Background IndexedDB persistence
    if (storeName && Array.isArray(data)) {
      idbService.putMany(storeName, data).catch(() => {});
    }
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

export const storageService = {
  // Initialize and hydrate from IndexedDB if localStorage was empty
  async initStorage() {
    try {
      await idbService.init();
    } catch (e) {
      console.warn('IDB init ignored:', e);
    }
  },

  // Current User / Session
  getCurrentUser() {
    return getOrInit(STORAGE_KEYS.CURRENT_USER, DEMO_USERS.student);
  },

  setCurrentUser(user) {
    save(STORAGE_KEYS.CURRENT_USER, user);
    storageEvents.emit('auth_change', user);
  },

  // Switch to one of the 4 demo roles
  switchRole(roleName) {
    let target = DEMO_USERS.student;
    if (roleName === 'teacher') target = DEMO_USERS.teacher;
    else if (roleName === 'parent') target = DEMO_USERS.parent;
    else if (roleName === 'admin') target = DEMO_USERS.admin;
    
    this.setCurrentUser(target);
    return target;
  },

  // Users Collection
  getUsers() {
    return getOrInit(STORAGE_KEYS.USERS, Object.values(DEMO_USERS));
  },

  saveUser(user) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    save(STORAGE_KEYS.USERS, users, 'users');
    return user;
  },

  // Classes
  getClasses() {
    return getOrInit(STORAGE_KEYS.CLASSES, DEMO_CLASSES);
  },

  getClassById(classId) {
    const classes = this.getClasses();
    return classes.find(c => c.id === classId) || null;
  },

  saveClass(classObj) {
    const classes = this.getClasses();
    const idx = classes.findIndex(c => c.id === classObj.id);
    if (idx >= 0) classes[idx] = classObj;
    else classes.unshift(classObj);
    save(STORAGE_KEYS.CLASSES, classes, 'classes');
    return classObj;
  },

  joinClassByCode(studentUser, code) {
    const classes = this.getClasses();
    const cleanCode = code.trim().toUpperCase();
    const targetClass = classes.find(c => c.code.toUpperCase() === cleanCode);
    
    if (!targetClass) {
      return { success: false, message: 'رمز الصف غير صحيح أو غير موجود.' };
    }

    if (!targetClass.studentIds) targetClass.studentIds = [];
    if (targetClass.studentIds.includes(studentUser.id)) {
      return { success: false, message: 'أنت منضم بالفعل إلى هذا الصف!' };
    }

    targetClass.studentIds.push(studentUser.id);
    if (!targetClass.students) targetClass.students = [];
    targetClass.students.push({
      id: studentUser.id,
      name: studentUser.name,
      avatar: studentUser.avatar,
      joinedAt: new Date().toISOString().split('T')[0],
      completedAssignments: 0,
      averageScore: 0
    });

    this.saveClass(targetClass);

    // Create a notification for the student
    this.addNotification({
      title: 'تم الانضمام إلى الصف بنجاح!',
      content: `أهلاً بك في صف "${targetClass.name}" للأستاذ ${targetClass.teacherName}.`,
      type: 'class',
      targetId: targetClass.id,
      userId: studentUser.id,
    });

    return { success: true, targetClass };
  },

  // Lessons
  getLessons() {
    return getOrInit(STORAGE_KEYS.LESSONS, DEMO_LESSONS);
  },

  saveLesson(lesson) {
    const lessons = this.getLessons();
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx >= 0) lessons[idx] = lesson;
    else lessons.unshift(lesson);
    save(STORAGE_KEYS.LESSONS, lessons, 'lessons');
    return lesson;
  },

  // Assignments
  getAssignments() {
    return getOrInit(STORAGE_KEYS.ASSIGNMENTS, DEMO_ASSIGNMENTS);
  },

  saveAssignment(assignment) {
    const assignments = this.getAssignments();
    const idx = assignments.findIndex(a => a.id === assignment.id);
    if (idx >= 0) assignments[idx] = assignment;
    else assignments.unshift(assignment);
    save(STORAGE_KEYS.ASSIGNMENTS, assignments, 'assignments');
    return assignment;
  },

  submitAssignment(assignmentId, submission) {
    const assignments = this.getAssignments();
    const asg = assignments.find(a => a.id === assignmentId);
    if (asg) {
      asg.mySubmission = {
        ...submission,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };
      asg.submissionsCount = (asg.submissionsCount || 0) + 1;
      this.saveAssignment(asg);
      return true;
    }
    return false;
  },

  gradeSubmission(assignmentId, studentId, grade, feedback) {
    const assignments = this.getAssignments();
    const asg = assignments.find(a => a.id === assignmentId);
    if (asg && asg.mySubmission && asg.mySubmission.studentId === studentId) {
      asg.mySubmission.score = grade;
      asg.mySubmission.teacherFeedback = feedback;
      asg.mySubmission.status = 'graded';
      this.saveAssignment(asg);
      return true;
    }
    return false;
  },

  // Tests
  getTests() {
    return getOrInit(STORAGE_KEYS.TESTS, DEMO_TESTS);
  },

  saveTest(test) {
    const tests = this.getTests();
    const idx = tests.findIndex(t => t.id === test.id);
    if (idx >= 0) tests[idx] = test;
    else tests.unshift(test);
    save(STORAGE_KEYS.TESTS, tests, 'tests');
    return test;
  },

  // Test Results
  getTestResults() {
    return getOrInit(STORAGE_KEYS.TEST_RESULTS, [
      {
        id: 'res-demo-1',
        testId: 'test-meca-transmission-1',
        testTitle: 'اختبار تقييمي شامل: نقل الحركة والعجلات المسننة',
        score: 18,
        totalPoints: 20,
        percentage: 90,
        date: '2026-09-24',
        durationTakenSeconds: 940,
        mode: 'exam',
        userId: 'user-student-karim',
      }
    ]);
  },

  saveTestResult(result) {
    const results = this.getTestResults();
    results.unshift(result);
    save(STORAGE_KEYS.TEST_RESULTS, results, 'test_results');
    return result;
  },

  // Flashcards & Spaced Repetition
  getFlashcards() {
    return getOrInit(STORAGE_KEYS.FLASHCARDS, DEMO_FLASHCARDS);
  },

  saveFlashcard(card) {
    const cards = this.getFlashcards();
    const idx = cards.findIndex(c => c.id === card.id);
    if (idx >= 0) cards[idx] = card;
    else cards.push(card);
    save(STORAGE_KEYS.FLASHCARDS, cards, 'flashcards');
    return card;
  },

  updateCardReview(cardId, scoreQuality) {
    const cards = this.getFlashcards();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const intervals = [1, 2, 4, 7, 14, 30];
    let currentLevel = card.level || 1;
    let currIdx = intervals.indexOf(currentLevel);
    if (currIdx === -1) currIdx = 0;

    let nextIdx = currIdx;
    if (scoreQuality >= 2) {
      nextIdx = Math.min(intervals.length - 1, currIdx + (scoreQuality === 3 ? 2 : 1));
      card.masteryScore = Math.min(100, (card.masteryScore || 50) + 15);
    } else {
      nextIdx = 0; // Reset to 1 day on mistake
      card.masteryScore = Math.max(10, (card.masteryScore || 50) - 20);
    }

    card.level = intervals[nextIdx];
    card.intervalDays = intervals[nextIdx];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervals[nextIdx]);
    card.nextReviewDate = nextDate.toISOString().split('T')[0];
    card.lastReviewed = new Date().toISOString();

    this.saveFlashcard(card);
    return card;
  },

  // Tasks
  getTasks() {
    return getOrInit(STORAGE_KEYS.TASKS, DEMO_TASKS);
  },

  saveTask(task) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx >= 0) tasks[idx] = task;
    else tasks.unshift(task);
    save(STORAGE_KEYS.TASKS, tasks, 'tasks');
    return task;
  },

  deleteTask(taskId) {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    save(STORAGE_KEYS.TASKS, tasks, 'tasks');
    idbService.delete('tasks', taskId).catch(() => {});
  },

  // Schedule
  getSchedule() {
    return getOrInit(STORAGE_KEYS.SCHEDULE, DEMO_SCHEDULE_EVENTS);
  },

  saveSchedule(scheduleList) {
    save(STORAGE_KEYS.SCHEDULE, scheduleList, 'schedule');
  },

  // Study Sessions tracking
  getStudySessions() {
    return getOrInit(STORAGE_KEYS.STUDY_SESSIONS, [
      { id: 'sess-1', date: '2026-09-27', minutes: 45, subjectId: 'tech-meca', type: 'focus' },
      { id: 'sess-2', date: '2026-09-27', minutes: 40, subjectId: 'math', type: 'normal' },
      { id: 'sess-3', date: '2026-09-26', minutes: 60, subjectId: 'phys', type: 'focus' },
    ]);
  },

  logStudySession(session) {
    const sessions = this.getStudySessions();
    sessions.unshift({
      id: 'sess-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...session
    });
    save(STORAGE_KEYS.STUDY_SESSIONS, sessions, 'study_sessions');
  },

  // Notifications
  getNotifications() {
    return getOrInit(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        title: 'واجب جديد: دراسة آلية مخفض السرعة',
        content: 'نشر الأستاذ أحمد المنصوري واجبًا جديدًا لمادة الهندسة الميكانيكية.',
        time: 'منذ ساعتين',
        read: false,
        type: 'assignment'
      },
      {
        id: 'notif-2',
        title: 'موعد مراجعة Spaced Repetition',
        content: 'لديك 4 بطاقات جاهزة للمراجعة اليوم في مادة الرياضيات والهندسة الميكانيكية.',
        time: 'منذ 4 ساعات',
        read: false,
        type: 'revision'
      }
    ]);
  },

  addNotification(notif) {
    const notifs = this.getNotifications();
    notifs.unshift({
      id: 'notif-' + Date.now(),
      time: 'الآن',
      read: false,
      ...notif
    });
    save(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  markAllNotificationsRead() {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    save(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Education Structure (Admin customizable)
  getEducationLevels() {
    return getOrInit(STORAGE_KEYS.EDUCATION_LEVELS, ALGERIAN_LEVELS);
  },

  saveEducationLevels(levels) {
    save(STORAGE_KEYS.EDUCATION_LEVELS, levels);
  },

  // Entertainment Settings & Usage
  getEntertainmentData() {
    return getOrInit(STORAGE_KEYS.ENTERTAINMENT, {
      dailyLimitMinutes: 60,
      usedMinutesToday: 25,
      blockedApps: ['YouTube Non-Edu', 'TikTok', 'Instagram', 'Gaming'],
      activeLock: false,
      lockUntil: null
    });
  },

  saveEntertainmentData(data) {
    save(STORAGE_KEYS.ENTERTAINMENT, data);
  },

  // Full Export / Import Data
  exportFullData() {
    const data = {};
    Object.keys(STORAGE_KEYS).forEach(k => {
      const keyName = STORAGE_KEYS[k];
      const val = localStorage.getItem(keyName);
      if (val) data[keyName] = JSON.parse(val);
    });
    return JSON.stringify(data, null, 2);
  },

  importFullData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      Object.keys(parsed).forEach(k => {
        localStorage.setItem(k, JSON.stringify(parsed[k]));
      });
      storageEvents.emit('data_imported', true);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  resetToDemo() {
    localStorage.clear();
    location.reload();
  }
};
