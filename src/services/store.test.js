import { clearWorkspace, loadWorkspace, saveWorkspace } from './store';

describe('workspace profile migration', () => {
  beforeEach(() => clearWorkspace());

  test('preserves an existing completed profile and moves known education fields into structured storage', () => {
    window.localStorage.setItem('studentos.mobile.workspace.v1', JSON.stringify({
      onboardingComplete: true,
      profile: { name: 'Amel', language: 'ar', country: 'DZ', educationSystem: 'Algerian national education', stage: 'Secondary', grade: '2AS', track: 'Science' },
      subjects: [{ id: 'math', name: 'Mathematics' }],
    }));
    const workspace = loadWorkspace();
    expect(workspace.onboardingComplete).toBe(true);
    expect(workspace.profile.name).toBe('Amel');
    expect(workspace.profile.education.country).toBe('DZ');
    expect(workspace.profile.education.grade).toBe('2AS');
    expect(workspace.profile.education.track).toBe('Science');
    expect(workspace.profile.stage).toBe('Secondary');
    expect(workspace.subjects).toHaveLength(1);
  });

  test('persists structured study language separately from app language', () => {
    const workspace = loadWorkspace();
    const next = { ...workspace, profile: { ...workspace.profile, language: 'ar', studyLanguage: 'fr', education: { ...workspace.profile.education, studyLanguage: 'fr' } } };
    saveWorkspace(next);
    const restored = loadWorkspace();
    expect(restored.profile.language).toBe('ar');
    expect(restored.profile.education.studyLanguage).toBe('fr');
  });
});
