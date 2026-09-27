import {
  countryLabel, emptyEducation, isMinimumEducationComplete, mergeEducationProfile, onboardingSteps,
} from './educationProfile';
import { isRtl } from '../i18n';

const profile = (education) => ({ language: 'en', education: { ...emptyEducation(), ...education } });

describe('data-driven progressive education flow', () => {
  test('primary student gets only a grade after country, system, and level', () => {
    expect(onboardingSteps(profile({ country: 'US', systemId: 'us_state_district', level: 'primary' }))).toEqual(['grade', 'complete']);
  });

  test('middle-school student does not receive an irrelevant high-school track', () => {
    expect(onboardingSteps(profile({ country: 'DZ', systemId: 'dz_national', level: 'middle', grade: 'Year 2' }))).toEqual(['complete']);
  });

  test('Algerian upper-secondary path orders grade, track, then specialization', () => {
    expect(onboardingSteps(profile({ country: 'DZ', systemId: 'dz_national', level: 'high' }))).toEqual(['grade', 'track', 'specialization', 'complete']);
  });

  test('university path does not receive school grade or track questions', () => {
    expect(onboardingSteps(profile({ country: 'FR', systemId: 'fr_national', level: 'university' }))).toEqual(['university', 'complete']);
  });

  test('vocational path places program before optional specialization', () => {
    expect(onboardingSteps(profile({ country: 'DZ', systemId: 'dz_national', level: 'vocational' }))).toEqual(['vocational', 'complete']);
    expect(onboardingSteps(profile({ country: 'DZ', systemId: 'dz_national', level: 'vocational', program: 'Electrical systems' }))).toEqual(['specialization', 'complete']);
  });

  test('self-learning path asks interests and never asks school information', () => {
    expect(onboardingSteps(profile({ country: 'CA', systemId: 'ca_provincial', level: 'self_learning' }))).toEqual(['self_learning', 'complete']);
  });

  test('unknown countries retain an honest, non-assumptive system path', () => {
    expect(onboardingSteps(profile({ country: 'BR', level: 'adult' }))).toEqual(['complete']);
  });

  test('Arabic is RTL while English and French retain LTR; country labels localize where supported', () => {
    expect(isRtl('ar')).toBe(true);
    expect(isRtl('en')).toBe(false);
    expect(isRtl('fr')).toBe(false);
    expect(countryLabel('DZ', 'fr')).toBeTruthy();
  });

  test('skipped optional questions remain null and are not asked twice', () => {
    expect(onboardingSteps(profile({ country: 'DZ', systemId: 'dz_national', level: 'high', grade: '2AS', skippedFields: ['track', 'specialization'] }))).toEqual(['complete']);
  });

  test('minimum completion requires grade only where the selected stage needs it', () => {
    expect(isMinimumEducationComplete(profile({ country: 'GB', level: 'high' }))).toBe(false);
    expect(isMinimumEducationComplete(profile({ country: 'GB', level: 'high', grade: 'Year 12' }))).toBe(true);
    expect(isMinimumEducationComplete(profile({ country: 'GB', level: 'university' }))).toBe(true);
  });

  test('structured updates preserve legacy values for existing features', () => {
    const next = mergeEducationProfile({ language: 'ar', country: '', grade: '', track: '', education: emptyEducation() }, { country: 'DZ', systemId: 'dz_national', systemLabel: 'Algerian national education', level: 'high', grade: '2AS', track: 'Science', studyLanguage: 'fr' });
    expect(next.country).toBe('DZ');
    expect(next.grade).toBe('2AS');
    expect(next.track).toBe('Science');
    expect(next.studyLanguage).toBe('fr');
  });
});
