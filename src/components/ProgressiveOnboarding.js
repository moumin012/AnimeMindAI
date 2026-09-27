import React, { useMemo, useState } from 'react';
import { authGateway, identityConfigured } from '../services/authGateway';
import {
  EDUCATION_LEVELS, SELF_LEARNING_CATEGORIES, countryLabel, countryOptions,
  educationSystemsForCountry, emptyEducation, isMinimumEducationComplete,
  levelLabel, mergeEducationProfile, onboardingSteps,
} from '../services/educationProfile';
import { languages } from '../i18n';

const AGE_RANGES = ['Under 13', '13–15', '16–17', '18–24', '25+', 'Prefer not to say'];

function clean(value) { return String(value || '').trim(); }
function educationWith(profile, patch) {
  return mergeEducationProfile(profile, { ...emptyEducation(), ...(profile.education || {}), ...patch });
}
function markSkipped(profile, key) {
  const current = profile.education?.skippedFields || [];
  return educationWith(profile, { [key]: null, skippedFields: current.includes(key) ? current : [...current, key] });
}

/**
 * A short, resumable profile flow. It only renders unanswered, relevant steps
 * from onboardingSteps(), so a returned user never repeats known answers.
 */
export function ProgressiveOnboarding({ initialProfile, onProgress, onFinish, onDefer, onLanguage }) {
  const [view, setView] = useState('welcome');
  const [profile, setProfile] = useState(() => ({ ...initialProfile, education: { ...emptyEducation(), ...(initialProfile.education || {}) } }));
  const [activeStep, setActiveStep] = useState(null);
  const [history, setHistory] = useState([]);
  const [accountError, setAccountError] = useState('');
  const [accountBusy, setAccountBusy] = useState(false);
  const [account, setAccount] = useState({ name: initialProfile.name || '', email: '', password: '' });
  const steps = useMemo(() => onboardingSteps(profile), [profile]);
  const currentStep = activeStep || steps[0];
  const stepNumber = Math.max(1, steps.indexOf(currentStep) + 1);

  const persist = (next) => {
    setProfile(next);
    onProgress(next);
    return next;
  };
  const patchEducation = (patch) => persist(educationWith(profile, patch));
  const startProfile = (name = profile.name) => {
    const next = { ...profile, name: clean(name) || profile.name };
    persist(next);
    setView('flow');
    setActiveStep(onboardingSteps(next)[0]);
  };
  const advance = (nextProfile = profile) => {
    const nextSteps = onboardingSteps(nextProfile);
    const index = nextSteps.indexOf(currentStep);
    const nextStep = index >= 0 ? nextSteps[index + 1] : nextSteps[0];
    setHistory((items) => [...items, currentStep]);
    setActiveStep(nextStep || 'complete');
  };
  const updateAndAdvance = (patch) => {
    const next = patchEducation(patch);
    advance(next);
  };
  const goBack = () => {
    const previous = history[history.length - 1];
    if (previous) { setHistory((items) => items.slice(0, -1)); setActiveStep(previous); }
    else setView('welcome');
  };
  const defer = () => onDefer(profile);
  const complete = () => onFinish(profile, { educationComplete: isMinimumEducationComplete(profile) });

  if (view === 'welcome') {
    return <main className="welcome-shell" dir={['ar', 'ur'].includes(profile.language) ? 'rtl' : 'ltr'}><div className="welcome-orbit orbit-one" /><div className="welcome-orbit orbit-two" /><section className="welcome-card"><div className="hero-mark">S</div><p className="eyebrow">STUDENTOS MOBILE</p><h1>Plan. Study.<br/><em>Focus.</em> Remember. Improve.</h1><p className="hero-copy">A private, mobile-first workspace that begins with only the essentials.</p><div className="stack-actions"><button className="primary-button" onClick={() => setView(identityConfigured ? 'register' : 'local')}>Create account <span>→</span></button><button className="secondary-button" onClick={() => setView('signin')}>Sign in</button></div><p className="legal-copy">StudentOS asks for your education details only when they are useful. You can finish your profile later.</p><label className="welcome-language">App language <select value={profile.language} onChange={(e) => { const next = { ...profile, language: e.target.value }; persist(next); onLanguage(e.target.value); }}>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label></section></main>;
  }

  if (view === 'signin') {
    return <main className="welcome-shell" dir={['ar', 'ur'].includes(profile.language) ? 'rtl' : 'ltr'}><section className="welcome-card compact"><button className="back-link" onClick={() => setView('welcome')}>← Back</button><p className="eyebrow">ACCOUNT</p><h1>{identityConfigured ? 'Sign in to StudentOS' : 'Sign in needs a connected identity service.'}</h1>{identityConfigured ? <IdentitySignIn onComplete={(name) => startProfile(name)} onError={setAccountError}/> : <><p className="hero-copy">Email/password, Google, Apple, and phone OTP are not displayed until Firebase or OIDC is configured. No password or OTP is collected in this preview.</p><div className="notice-card"><strong>Use this preview without an account</strong><p>Your workspace stays on this device until a production StudentOS service is connected.</p></div><button className="primary-button" onClick={() => setView('local')}>Use local offline workspace <span>→</span></button></>}{accountError && <p className="form-error">{accountError}</p>}</section></main>;
  }

  if (view === 'local' || view === 'register') {
    const canSubmit = clean(account.name) && (view === 'local' || (clean(account.email) && account.password.length >= 8));
    const register = async () => {
      if (!canSubmit || accountBusy) return;
      if (view === 'local') return startProfile(account.name);
      setAccountBusy(true); setAccountError('');
      try {
        await authGateway.registerEmail(clean(account.email), account.password);
        startProfile(account.name);
      } catch (error) {
        setAccountError(error.message || 'We could not create that account.');
      } finally { setAccountBusy(false); }
    };
    return <main className="welcome-shell" dir={['ar', 'ur'].includes(profile.language) ? 'rtl' : 'ltr'}><section className="welcome-card compact"><button className="back-link" onClick={() => setView('welcome')}>← Back</button><p className="eyebrow">{view === 'local' ? 'LOCAL WORKSPACE' : 'CREATE ACCOUNT'}</p><h1>{view === 'local' ? 'Start with your name.' : 'Create your account.'}</h1><p className="hero-copy">{view === 'local' ? 'This creates a private workspace in this browser. You can connect an account later.' : 'Only your display name, email, and password are needed here.'}</p><label className="field-label">Display name<input autoFocus value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} placeholder="How should StudentOS greet you?" /></label>{view === 'register' && <><label className="field-label">Email<input type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} placeholder="you@example.com" /></label><label className="field-label">Password<input type="password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} placeholder="At least 8 characters" /></label><p className="field-hint">Email verification is sent by your configured identity provider.</p></>}{accountError && <p className="form-error">{accountError}</p>}<button className="primary-button" disabled={!canSubmit || accountBusy} onClick={register}>{accountBusy ? 'Creating account…' : 'Continue'} <span>→</span></button></section></main>;
  }

  const canFinishLater = currentStep !== 'complete';
  return <main className="welcome-shell" dir={['ar', 'ur'].includes(profile.language) ? 'rtl' : 'ltr'}><section className="onboarding-card progressive-card"><div className="onboarding-top"><button className="back-link" onClick={goBack}>← Back</button>{canFinishLater && <button className="skip-link" onClick={defer}>Finish later</button>}</div><div className="step-meta"><span>STEP {stepNumber} OF {steps.length}</span><div className="step-progress"><i style={{ width: `${(stepNumber / steps.length) * 100}%` }}/></div></div>{currentStep === 'country' && <CountryStep profile={profile} onSelect={(country) => updateAndAdvance({ country, systemId: null, systemLabel: null, level: null, grade: null, track: null, specialization: null, skippedFields: [] })}/>} {currentStep === 'system' && <SystemStep profile={profile} onSelect={(system) => updateAndAdvance({ systemId: system.id, systemLabel: system.label })}/>} {currentStep === 'level' && <LevelStep onSelect={(level) => updateAndAdvance({ level, grade: null, track: null, specialization: null, program: null, major: null, degree: null, year: null, semester: null, learningInterests: [], skippedFields: [] })}/>} {currentStep === 'grade' && <GradeStep onContinue={(grade) => updateAndAdvance({ grade })}/>} {currentStep === 'track' && <TrackStep profile={profile} onContinue={(track) => updateAndAdvance({ track })} onSkip={() => { const next = persist(markSkipped(profile, 'track')); advance(next); }}/>} {currentStep === 'specialization' && <SpecializationStep profile={profile} onContinue={(specialization) => updateAndAdvance({ specialization })} onSkip={() => { const next = persist(markSkipped(profile, 'specialization')); advance(next); }}/>} {currentStep === 'university' && <UniversityStep profile={profile} onContinue={(patch) => { const skippedFields = (profile.education.skippedFields || []).includes('university') ? profile.education.skippedFields : [...(profile.education.skippedFields || []), 'university']; updateAndAdvance({ ...patch, skippedFields }); }} onSkip={() => { const next = persist(markSkipped(profile, 'university')); advance(next); }}/>} {currentStep === 'vocational' && <VocationalStep profile={profile} onContinue={(patch) => updateAndAdvance(patch)} onSkip={() => { const next = persist(markSkipped(profile, 'vocational')); advance(next); }}/>} {currentStep === 'self_learning' && <SelfLearningStep profile={profile} onContinue={(learningInterests) => updateAndAdvance({ learningInterests })} onSkip={() => { const next = persist(markSkipped(profile, 'self_learning')); advance(next); }}/>} {currentStep === 'complete' && <CompleteStep profile={profile} onStudyLanguage={(studyLanguage) => patchEducation({ studyLanguage })} onFinish={complete}/>}</section></main>;
}

function CountryStep({ profile, onSelect }) {
  const [query, setQuery] = useState('');
  const options = useMemo(() => countryOptions(profile.language).filter((country) => country.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()) || country.id.toLowerCase().includes(query.toLowerCase())).slice(0, 9), [profile.language, query]);
  return <section className="question-step"><p className="eyebrow">EDUCATION PROFILE</p><h1>Where do you study?</h1><p>Country helps StudentOS offer the right education-system choices. It never assumes a curriculum.</p><label className="country-search"><span>⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your country" /></label><div className="country-results">{options.map((country) => <button key={country.id} onClick={() => onSelect(country.id)}><span>{country.id}</span>{country.label}<b>›</b></button>)}</div>{!options.length && <p className="no-results">No matching country yet. Try another spelling.</p>}</section>;
}

function SystemStep({ profile, onSelect }) {
  const systems = educationSystemsForCountry(profile.education.country);
  return <section className="question-step"><p className="eyebrow">{countryLabel(profile.education.country, profile.language)}</p><h1>Which education system?</h1><p>Choose the program you follow. If it is not listed, select the neutral option—StudentOS will not guess.</p><div className="selection-cards">{systems.map((system) => <button key={system.id} onClick={() => onSelect(system)}><strong>{system.label}</strong><span>›</span></button>)}</div></section>;
}

function LevelStep({ onSelect }) {
  return <section className="question-step"><p className="eyebrow">YOUR PATH</p><h1>What level are you studying at?</h1><p>This sets the questions StudentOS asks next. You can change it any time.</p><div className="level-cards">{EDUCATION_LEVELS.map((level) => <button key={level.id} onClick={() => onSelect(level.id)}><span className={`level-mark ${level.id}`}>{level.shortLabel.slice(0, 1)}</span><strong>{level.shortLabel}</strong><b>›</b></button>)}</div></section>;
}

function GradeStep({ onContinue }) {
  const [grade, setGrade] = useState('');
  return <section className="question-step"><p className="eyebrow">SCHOOL LEVEL</p><h1>What grade or year are you in?</h1><p>This is needed to organize age-appropriate school planning. StudentOS does not infer it from your country.</p><label className="large-answer"><input autoFocus value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="e.g. Grade 8, Year 2, 2AS" /></label><button className="primary-button question-continue" disabled={!clean(grade)} onClick={() => onContinue(clean(grade))}>Continue <span>→</span></button></section>;
}

function TrackStep({ profile, onContinue, onSkip }) {
  const [track, setTrack] = useState(profile.education.track || '');
  return <OptionalTextStep eyebrow="UPPER SECONDARY" title="Do you follow a track or stream?" copy="This program can use tracks. Add yours if it is useful, or skip it for now." value={track} placeholder="e.g. Science, Arts, Technical" button="Continue" onContinue={onContinue} onSkip={onSkip}/>;
}
function SpecializationStep({ profile, onContinue, onSkip }) {
  const [specialization, setSpecialization] = useState(profile.education.specialization || '');
  return <OptionalTextStep eyebrow="EDUCATION PROFILE" title="Any specialization?" copy="Add a specialization only if your program uses one. It is optional." value={specialization} placeholder="e.g. Mathematics, Industrial technology" button="Continue" onContinue={onContinue} onSkip={onSkip}/>;
}
function OptionalTextStep({ eyebrow, title, copy, value, placeholder, button, onContinue, onSkip }) {
  const [answer, setAnswer] = useState(value);
  return <section className="question-step"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p><label className="large-answer"><input autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={placeholder}/></label><button className="primary-button question-continue" disabled={!clean(answer)} onClick={() => onContinue(clean(answer))}>{button} <span>→</span></button><button className="skip-link centered" onClick={onSkip}>Skip for now</button></section>;
}

function UniversityStep({ profile, onContinue, onSkip }) {
  const [form, setForm] = useState({ institution: profile.education.institution || '', degree: profile.education.degree || '', major: profile.education.major || '', year: profile.education.year || '' });
  return <section className="question-step"><p className="eyebrow">HIGHER EDUCATION</p><h1>What are you studying?</h1><p>Everything on this screen is optional. University or institution name is never required for StudentOS.</p><div className="short-form"><label>Degree<input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="e.g. Bachelor’s"/></label><label>Major / field<input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} placeholder="e.g. Computer Science"/></label><label>Year / level<input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. Year 2"/></label><label>Institution <em>optional</em><input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Optional"/></label></div><button className="primary-button question-continue" onClick={() => onContinue(form)}>Continue <span>→</span></button><button className="skip-link centered" onClick={onSkip}>Skip for now</button></section>;
}

function VocationalStep({ profile, onContinue, onSkip }) {
  const [form, setForm] = useState({ program: profile.education.program || '', specialization: profile.education.specialization || '', year: profile.education.year || '' });
  return <section className="question-step"><p className="eyebrow">VOCATIONAL EDUCATION</p><h1>What program are you in?</h1><p>This is separate from the school path. Add only what helps organize your learning.</p><div className="short-form"><label>Program<input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="e.g. Electrical installation"/></label><label>Specialization <em>optional</em><input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Optional"/></label><label>Level / year <em>optional</em><input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Optional"/></label></div><button className="primary-button question-continue" disabled={!clean(form.program)} onClick={() => onContinue(form)}>Continue <span>→</span></button><button className="skip-link centered" onClick={onSkip}>Skip for now</button></section>;
}

function SelfLearningStep({ profile, onContinue, onSkip }) {
  const [selected, setSelected] = useState(profile.education.learningInterests || []);
  const toggle = (interest) => setSelected((items) => items.includes(interest) ? items.filter((item) => item !== interest) : [...items, interest]);
  return <section className="question-step"><p className="eyebrow">INDEPENDENT LEARNING</p><h1>What would you like to learn?</h1><p>Select any interests. This never creates subjects or a curriculum without your approval.</p><div className="interest-grid">{SELF_LEARNING_CATEGORIES.map((interest) => <button key={interest} className={selected.includes(interest) ? 'selected' : ''} onClick={() => toggle(interest)}>{selected.includes(interest) ? '✓ ' : ''}{interest}</button>)}</div><button className="primary-button question-continue" disabled={!selected.length} onClick={() => onContinue(selected)}>Continue <span>→</span></button><button className="skip-link centered" onClick={onSkip}>Skip for now</button></section>;
}

function CompleteStep({ profile, onStudyLanguage, onFinish }) {
  const [studyLanguage, setStudyLanguage] = useState(profile.education.studyLanguage || '');
  return <section className="question-step complete-step"><div className="complete-orb">✓</div><p className="eyebrow">YOU’RE READY</p><h1>Welcome to your StudentOS.</h1><p>Your essentials are saved. Add more only when it helps you learn.</p><label className="study-language-select">Study language <em>optional</em><select value={studyLanguage} onChange={(event) => { setStudyLanguage(event.target.value); onStudyLanguage(event.target.value); }}><option value="">Set later</option>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label><div className="profile-summary"><span>{countryLabel(profile.education.country, profile.language)}</span><span>{levelLabel(profile.education.level)}</span>{profile.education.grade && <span>{profile.education.grade}</span>}</div><button className="primary-button question-continue" onClick={onFinish}>Open StudentOS <span>→</span></button><p className="completion-note">Personalize study goals, subjects, languages, skills, prayer, and more later from your dashboard or settings.</p></section>;
}

function IdentitySignIn({ onComplete, onError }) {
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const social = async (provider) => {
    setBusy(true); onError('');
    try {
      const result = provider === 'google' ? await authGateway.signInGoogle() : await authGateway.signInApple();
      onComplete(result.user.displayName || 'Student');
    } catch (error) { onError(error.message || 'The sign-in request did not complete.'); } finally { setBusy(false); }
  };
  const emailSignIn = async () => {
    if (!clean(email) || !password || busy) return;
    setBusy(true); onError('');
    try { const result = await authGateway.signInEmail(clean(email), password); onComplete(result.user.displayName || 'Student'); }
    catch (error) { onError(error.message || 'The sign-in request did not complete.'); } finally { setBusy(false); }
  };
  const reset = async () => {
    if (!clean(email) || busy) return onError('Enter your email first, then choose password reset.');
    setBusy(true); onError('');
    try { await authGateway.resetPassword(clean(email)); onError('A password-reset message was sent if this email has an account.'); }
    catch (error) { onError(error.message || 'The password reset request did not complete.'); } finally { setBusy(false); }
  };
  return <><p className="hero-copy">Use your StudentOS email or an approved provider. StudentOS never asks for a provider password.</p><label className="field-label">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"/></label><label className="field-label">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password"/></label><button className="primary-button" disabled={busy || !clean(email) || !password} onClick={emailSignIn}>Sign in <span>→</span></button><button className="reset-link" disabled={busy} onClick={reset}>Forgot password?</button><div className="identity-divider"><span>or</span></div><div className="identity-buttons"><button disabled={busy} onClick={() => social('google')}>Continue with Google</button><button disabled={busy} onClick={() => social('apple')}>Continue with Apple</button><button disabled title="Phone OTP needs a native Firebase verifier">Phone OTP requires native setup</button></div></>;
}

export function ProfilePersonalization({ profile, onSave, onClose }) {
  const [ageGroup, setAgeGroup] = useState(profile.ageGroup || '');
  const [studyLanguage, setStudyLanguage] = useState(profile.education?.studyLanguage || '');
  const [goals, setGoals] = useState(profile.goals || []);
  const allGoals = ['School grades', 'Study consistency', 'Languages', 'Skills', 'Quran', 'Fitness / exercise', 'Time management', 'Exam preparation'];
  const toggle = (goal) => setGoals((items) => items.includes(goal) ? items.filter((item) => item !== goal) : [...items, goal]);
  return <section className="personalization-panel"><p className="eyebrow">OPTIONAL</p><h2>Personalize your StudentOS experience</h2><p>None of this blocks access. You can update it any time.</p><label className="field-label">Age range <span>Optional; a full birth date is not needed.</span><select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}><option value="">Prefer to set later</option>{AGE_RANGES.map((range) => <option key={range} value={range}>{range}</option>)}</select></label><label className="field-label">Study language <span>Separate from your app language.</span><select value={studyLanguage} onChange={(event) => setStudyLanguage(event.target.value)}><option value="">Set later</option>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label><p className="field-label">Learning goals <span>Optional</span></p><div className="choice-grid compact-choices">{allGoals.map((goal) => <button key={goal} className={goals.includes(goal) ? 'selected' : ''} onClick={() => toggle(goal)}>{goals.includes(goal) ? '✓ ' : ''}{goal}</button>)}</div><div className="button-pair"><button className="secondary-button" onClick={onClose}>Skip for now</button><button className="primary-button" onClick={() => onSave({ ...profile, ageGroup, goals, education: { ...profile.education, studyLanguage }, studyLanguage })}>Save choices</button></div></section>;
}
