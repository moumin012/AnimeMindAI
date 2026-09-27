const KEY = 'studentos.mobile.workspace.v1';

export const blankWorkspace = () => ({
  version: 1,
  profile: {
    name: '',
    ageGroup: '',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    country: '',
    educationSystem: '',
    stage: '',
    grade: '',
    track: '',
    subjects: [],
    goals: [],
  },
  onboardingComplete: false,
  theme: 'light',
  tasks: [],
  events: [],
  sessions: [],
  subjects: [],
  recallCards: [],
  languageGoals: [],
  skillGoals: [],
  limits: { Gaming: 60, YouTube: 30, 'Social Media': 20, Streaming: 60 },
  notificationPreferences: {
    study: true,
    tasks: true,
    recall: true,
    prayer: false,
  },
  permissions: {},
  studyPolicy: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function loadWorkspace() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return blankWorkspace();
    const parsed = JSON.parse(raw);
    return { ...blankWorkspace(), ...parsed, profile: { ...blankWorkspace().profile, ...parsed.profile } };
  } catch {
    return blankWorkspace();
  }
}

export function saveWorkspace(next) {
  const value = { ...next, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(value));
  return value;
}

export function clearWorkspace() {
  window.localStorage.removeItem(KEY);
}

export function exportWorkspace(workspace) {
  const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `studentos-local-export-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
