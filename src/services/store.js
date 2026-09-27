import { emptyEducation, mergeEducationProfile } from './educationProfile';

const KEY = 'studentos.mobile.workspace.v1';

export const blankWorkspace = () => ({
  version: 1,
  profile: {
    name: '',
    ageGroup: '',
    language: 'en',
    studyLanguage: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    country: '',
    educationSystem: '',
    stage: '',
    grade: '',
    track: '',
    education: emptyEducation(),
    subjects: [],
    goals: [],
  },
  onboardingComplete: false,
  onboarding: { educationComplete: false, deferred: false, version: 2 },
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
    const base = blankWorkspace();
    const legacyProfile = { ...base.profile, ...parsed.profile };
    // Preserve legacy fields while moving education data into its structured shape.
    // We intentionally do not infer a level from free-text stage values.
    const profile = mergeEducationProfile(legacyProfile, {
      ...emptyEducation(),
      ...(legacyProfile.education || {}),
      country: legacyProfile.education?.country || legacyProfile.country || null,
      systemLabel: legacyProfile.education?.systemLabel || legacyProfile.educationSystem || null,
      grade: legacyProfile.education?.grade || legacyProfile.grade || null,
      track: legacyProfile.education?.track || legacyProfile.track || null,
      studyLanguage: legacyProfile.education?.studyLanguage || legacyProfile.studyLanguage || null,
    });
    return {
      ...base,
      ...parsed,
      profile,
      onboarding: { ...base.onboarding, ...(parsed.onboarding || {}), version: 2 },
    };
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
