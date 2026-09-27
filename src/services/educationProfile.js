// Canonical values are stable across clients. Labels are intentionally kept
// separate so native/mobile clients can localize them without migrating data.
export const EDUCATION_LEVELS = [
  { id: 'early_childhood', label: 'Early Childhood / Preschool', shortLabel: 'Preschool' },
  { id: 'primary', label: 'Primary / Elementary School', shortLabel: 'Primary School' },
  { id: 'middle', label: 'Middle School / Lower Secondary', shortLabel: 'Middle School' },
  { id: 'high', label: 'High School / Upper Secondary', shortLabel: 'High School' },
  { id: 'university', label: 'University / Higher Education', shortLabel: 'University' },
  { id: 'vocational', label: 'Vocational / Technical Education', shortLabel: 'Vocational' },
  { id: 'adult', label: 'Adult Education', shortLabel: 'Adult Education' },
  { id: 'self_learning', label: 'Self-Learning / Independent Learning', shortLabel: 'Self-Learning' },
  { id: 'other', label: 'Other', shortLabel: 'Other' },
];

export const SELF_LEARNING_CATEGORIES = [
  'Languages', 'Mathematics', 'Science', 'Programming', 'Artificial Intelligence', 'Robotics',
  'Electronics', 'Mechanical Engineering', 'Design', 'Video Editing', 'Business', 'Other',
];

// A compact catalogue deliberately describes system structure only, not an
// official curriculum. Curriculum data is loaded server-side only after source
// verification. Unknown countries use a neutral, non-assumptive option.
const SYSTEMS_BY_COUNTRY = {
  DZ: [
    { id: 'dz_national', label: 'Algerian national education', tracksAt: ['high'], specializationsAt: ['high', 'vocational'] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
  FR: [
    { id: 'fr_national', label: 'French national education', tracksAt: ['high'], specializationsAt: ['high'] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
  GB: [
    { id: 'gb_national', label: 'UK national curriculum', tracksAt: ['high'], specializationsAt: ['high'] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
  US: [
    { id: 'us_state_district', label: 'US state or district program', tracksAt: [], specializationsAt: [] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
  CA: [
    { id: 'ca_provincial', label: 'Canadian provincial program', tracksAt: [], specializationsAt: [] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
  MA: [
    { id: 'ma_national', label: 'Moroccan national education', tracksAt: ['high'], specializationsAt: ['high', 'vocational'] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
  TN: [
    { id: 'tn_national', label: 'Tunisian national education', tracksAt: ['high'], specializationsAt: ['high', 'vocational'] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
  EG: [
    { id: 'eg_national', label: 'Egyptian national education', tracksAt: ['high'], specializationsAt: ['high', 'vocational'] },
    { id: 'international', label: 'International / other program', tracksAt: [], specializationsAt: [] },
  ],
};

export const FALLBACK_SYSTEM = { id: 'unspecified', label: 'Not sure / another education system', tracksAt: [], specializationsAt: [] };

export const COUNTRY_CODES = [
  'DZ', 'AF', 'AL', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA', 'BW', 'BR', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'CF', 'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CD', 'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE', 'GH', 'GR', 'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MR', 'MU', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'MK', 'NO', 'OM', 'PK', 'PW', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'QA', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD', 'SR', 'SE', 'CH', 'SY', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TO', 'TT', 'TN', 'TR', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'YE', 'ZM', 'ZW',
];

export function countryLabel(code, locale = 'en') {
  try { return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || code; } catch { return code; }
}

export function countryOptions(locale = 'en') {
  return [...new Set(COUNTRY_CODES)].map((id) => ({ id, label: countryLabel(id, locale) })).sort((a, b) => a.label.localeCompare(b.label, locale));
}

export function educationSystemsForCountry(country) {
  return SYSTEMS_BY_COUNTRY[country] || [FALLBACK_SYSTEM];
}

export function getSystem(country, systemId) {
  return educationSystemsForCountry(country).find((system) => system.id === systemId) || FALLBACK_SYSTEM;
}

export function levelLabel(level) {
  return EDUCATION_LEVELS.find((item) => item.id === level)?.label || 'Not set';
}

export function needsGrade(levelOrEducation) {
  const level = typeof levelOrEducation === 'string' ? levelOrEducation : levelOrEducation?.level;
  return ['primary', 'middle', 'high'].includes(level);
}

export function needsTrack(education) {
  return education.level === 'high' && getSystem(education.country, education.systemId).tracksAt.includes('high');
}

export function needsSpecialization(education) {
  const system = getSystem(education.country, education.systemId);
  return ['high', 'vocational'].includes(education.level) && system.specializationsAt.includes(education.level);
}

/**
 * Generates only unanswered, relevant steps. The UI uses this to avoid asking
 * a completed profile the same question twice. `complete` is a final review.
 */
export function onboardingSteps(profile) {
  const education = profile.education || {};
  const steps = [];
  if (!education.country) steps.push('country');
  if (education.country && educationSystemsForCountry(education.country).length > 1 && !education.systemId) steps.push('system');
  if (!education.level) steps.push('level');
  if (needsGrade(education) && !education.grade) steps.push('grade');
  const skipped = education.skippedFields || [];
  if (needsTrack(education) && !education.track && !skipped.includes('track')) steps.push('track');
  // Upper-secondary specialization follows track. Vocational program precedes
  // specialization, because that is the meaningful dependency for this path.
  if (education.level === 'high' && needsSpecialization(education) && !education.specialization && !skipped.includes('specialization')) steps.push('specialization');
  if (education.level === 'university' && !education.major && !skipped.includes('university')) steps.push('university');
  if (education.level === 'vocational' && !education.program && !skipped.includes('vocational')) steps.push('vocational');
  if (education.level === 'vocational' && education.program && needsSpecialization(education) && !education.specialization && !skipped.includes('specialization')) steps.push('specialization');
  if (education.level === 'self_learning' && !(education.learningInterests || []).length && !skipped.includes('self_learning')) steps.push('self_learning');
  steps.push('complete');
  return steps;
}

export function isMinimumEducationComplete(profile) {
  const education = profile.education || {};
  return Boolean(education.country && education.level && (!needsGrade(education) || education.grade));
}

export function mergeEducationProfile(profile, educationPatch) {
  const education = { ...emptyEducation(), ...(profile.education || {}), ...educationPatch };
  return {
    ...profile,
    education,
    // Legacy fields stay synchronized so existing features/data continue to work.
    country: education.country || '',
    educationSystem: education.systemLabel || education.systemId || '',
    stage: education.level || profile.stage || '',
    grade: education.grade || '',
    track: education.track || '',
    studyLanguage: education.studyLanguage || profile.studyLanguage || '',
  };
}

export function emptyEducation() {
  return {
    country: null,
    systemId: null,
    systemLabel: null,
    level: null,
    grade: null,
    track: null,
    specialization: null,
    institution: null,
    degree: null,
    program: null,
    major: null,
    year: null,
    semester: null,
    studyLanguage: null,
    learningInterests: [],
    skippedFields: [],
    curriculumStatus: 'unknown',
  };
}
