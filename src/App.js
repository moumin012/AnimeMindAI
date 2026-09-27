import React, { useEffect, useMemo, useState } from 'react';
import { blankWorkspace, clearWorkspace, exportWorkspace, loadWorkspace, saveWorkspace } from './services/store';
import { mobileControl } from './services/mobileControl';
import { aiSetupMessage, askTutor } from './services/aiClient';
import { createTranslator, isRtl, languages } from './i18n';

const icon = {
  home: '⌂', schedule: '▦', study: '◔', ai: '✦', progress: '◒', more: '☰',
  task: '✓', subject: '▤', recall: '◌', test: '✎', language: '◎', skill: '✦',
  quran: '☾', prayer: '◐', entertainment: '◉', family: '♡', settings: '⚙', permissions: '⌁',
};

const uid = () => (window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const isoDay = (date = new Date()) => new Date(date).toISOString().slice(0, 10);
const localDateTime = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const dayLabel = (date) => new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(date));
const minutes = (seconds) => Math.max(0, Math.round(seconds / 60));
const prettyDuration = (seconds) => {
  const whole = Math.max(0, Math.round(seconds || 0));
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  return h ? `${h}h ${m}m` : `${m}:${String(s).padStart(2, '0')}`;
};
const sanitize = (value) => String(value || '').trim();

function calcSessionSeconds(session, now = Date.now()) {
  if (!session) return 0;
  const active = session.status === 'active' && session.lastStartedAt
    ? Math.max(0, Math.floor((now - new Date(session.lastStartedAt).getTime()) / 1000)) : 0;
  return (session.accumulatedSeconds || 0) + active;
}

function initialTaskForm() {
  return { title: '', subject: '', description: '', deadline: '', priority: 'Medium', estimatedMinutes: 30, status: 'To Do' };
}
function initialEventForm() {
  return { title: '', subject: '', startsAt: localDateTime(), duration: 25, type: 'Study', mandatory: false };
}

function App() {
  const [workspace, setWorkspace] = useState(loadWorkspace);
  const [page, setPage] = useState('home');
  const [detail, setDetail] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [now, setNow] = useState(Date.now());
  const t = createTranslator(workspace.profile.language);
  const rtl = isRtl(workspace.profile.language);
  const activeSession = workspace.sessions.find((session) => session.status === 'active' || session.status === 'paused');

  useEffect(() => { saveWorkspace(workspace); }, [workspace]);
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active') return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [activeSession?.id, activeSession?.status]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const update = (recipe) => setWorkspace((previous) => {
    const next = typeof recipe === 'function' ? recipe(previous) : recipe;
    return { ...next, updatedAt: new Date().toISOString() };
  });
  const notify = (message) => setToast(message);
  const openDetail = (name) => { setDetail(name); setPage('more'); window.scrollTo(0, 0); };
  const navigate = (next) => { setDetail(null); setPage(next); window.scrollTo(0, 0); };

  const finishOnboarding = (profile) => {
    const subjects = profile.subjects.filter(Boolean).map((name) => ({ id: uid(), name, createdAt: new Date().toISOString() }));
    update((w) => ({ ...w, onboardingComplete: true, profile, subjects }));
    navigate('home');
    notify('Your private workspace is ready on this device.');
  };

  const addTask = (task) => {
    if (!sanitize(task.title)) return notify('A task title is required.');
    update((w) => ({ ...w, tasks: [{ ...task, id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...w.tasks] }));
    setModal(null);
    notify('Task saved locally.');
  };
  const changeTask = (id, patch) => update((w) => ({ ...w, tasks: w.tasks.map((task) => task.id === id ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task) }));
  const addEvent = (event) => {
    if (!sanitize(event.title) || !event.startsAt) return notify('Add a title and start time.');
    update((w) => ({ ...w, events: [...w.events, { ...event, id: uid(), duration: Number(event.duration), createdAt: new Date().toISOString() }] }));
    setModal(null);
    notify('Schedule item saved locally.');
  };

  const startSession = async (config) => {
    if (!sanitize(config.subject)) return notify('Choose or enter a subject first.');
    if (activeSession) return notify('Finish or stop the current study session first.');
    const session = {
      id: uid(), subject: sanitize(config.subject), topic: sanitize(config.topic), mode: config.mode,
      plannedMinutes: Number(config.duration), startedAt: new Date().toISOString(), lastStartedAt: new Date().toISOString(),
      accumulatedSeconds: 0, status: 'active', policyResult: null,
    };
    update((w) => ({ ...w, sessions: [session, ...w.sessions] }));
    if (config.mode === 'Mandatory Study') {
      const result = await mobileControl.startStudyPolicy({ subject: session.subject, duration: session.plannedMinutes });
      update((w) => ({ ...w, sessions: w.sessions.map((item) => item.id === session.id ? { ...item, policyResult: result } : item) }));
      notify(result.active ? 'Supported focus policy started.' : result.reason);
    } else {
      notify('Study timer started.');
    }
  };
  const pauseSession = () => {
    if (!activeSession || activeSession.status !== 'active') return;
    const seconds = calcSessionSeconds(activeSession);
    update((w) => ({ ...w, sessions: w.sessions.map((session) => session.id === activeSession.id ? { ...session, status: 'paused', accumulatedSeconds: seconds, lastStartedAt: null } : session) }));
  };
  const resumeSession = () => {
    if (!activeSession || activeSession.status !== 'paused') return;
    update((w) => ({ ...w, sessions: w.sessions.map((session) => session.id === activeSession.id ? { ...session, status: 'active', lastStartedAt: new Date().toISOString() } : session) }));
  };
  const stopSession = async (status) => {
    if (!activeSession) return;
    const seconds = calcSessionSeconds(activeSession);
    if (activeSession.policyResult?.active) await mobileControl.stopStudyPolicy(activeSession.id);
    update((w) => ({ ...w, sessions: w.sessions.map((session) => session.id === activeSession.id ? {
      ...session, status, actualSeconds: seconds, accumulatedSeconds: seconds, lastStartedAt: null, endedAt: new Date().toISOString(),
    } : session) }));
    notify(status === 'completed' ? 'Session completed and recorded.' : 'Study stopped safely. The interruption was recorded.');
  };

  if (!workspace.onboardingComplete) {
    return <Welcome onFinish={finishOnboarding} language={workspace.profile.language} onLanguage={(language) => update((w) => ({ ...w, profile: { ...w.profile, language } }))} />;
  }

  const contentProps = { workspace, update, notify, openDetail, navigate, setModal, t, now, startSession, pauseSession, resumeSession, stopSession, addTask, changeTask, addEvent, activeSession };
  let content;
  if (page === 'home') content = <Home {...contentProps} />;
  if (page === 'schedule') content = <Schedule {...contentProps} />;
  if (page === 'study') content = <Study {...contentProps} />;
  if (page === 'ai') content = <Tutor {...contentProps} />;
  if (page === 'progress') content = <Progress {...contentProps} />;
  if (page === 'more') content = detail ? <DetailScreen detail={detail} {...contentProps} /> : <More {...contentProps} />;

  return (
    <main className={`app-shell ${workspace.theme === 'dark' ? 'dark' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="phone-frame">
        <header className="topbar">
          <button className="brand-button" onClick={() => navigate('home')} aria-label="StudentOS home"><span className="brand-mark">S</span><span>StudentOS</span></button>
          <div className="top-actions">
            <button className="icon-button" onClick={() => openDetail('permissions')} aria-label="Permissions">⌁</button>
            <button className="avatar" onClick={() => openDetail('settings')} aria-label="Open settings">{workspace.profile.name.slice(0, 1).toUpperCase() || 'S'}</button>
          </div>
        </header>
        <section className="page-content">{content}</section>
        <nav className="bottom-nav" aria-label="Primary navigation">
          {['home', 'schedule', 'study', 'ai', 'progress', 'more'].map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => navigate(item)}><span>{icon[item]}</span><small>{t(item)}</small></button>)}
        </nav>
      </div>
      {modal?.type === 'task' && <TaskModal initial={modal.task} subjects={workspace.subjects} onClose={() => setModal(null)} onSave={(task) => modal.task ? changeTask(modal.task.id, task) || setModal(null) : addTask(task)} />}
      {modal?.type === 'event' && <EventModal subjects={workspace.subjects} onClose={() => setModal(null)} onSave={addEvent} />}
      {modal?.type === 'confirm-delete' && <ConfirmModal title="Delete local workspace?" copy="This removes StudentOS data saved in this browser. It cannot delete a cloud account because no account is connected." confirm="Delete local data" danger onClose={() => setModal(null)} onConfirm={() => { clearWorkspace(); setWorkspace(blankWorkspace()); setModal(null); }} />}
      {modal?.type === 'auth-info' && <SetupModal onClose={() => setModal(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

function Welcome({ onFinish, language, onLanguage }) {
  const [stage, setStage] = useState('welcome');
  const [form, setForm] = useState({ name: '', ageGroup: '', language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', country: '', educationSystem: '', stage: '', grade: '', track: '', subjects: [], goals: [] });
  const change = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggle = (key, value) => setForm((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value] }));
  if (stage === 'welcome') return <main className="welcome-shell"><div className="welcome-orbit orbit-one" /><div className="welcome-orbit orbit-two" /><section className="welcome-card"><div className="hero-mark">S</div><p className="eyebrow">STUDENTOS MOBILE</p><h1>Plan. Study.<br/><em>Focus.</em> Remember. Improve.</h1><p className="hero-copy">A private, mobile-first workspace for building better study habits — one honest session at a time.</p><div className="stack-actions"><button className="primary-button" onClick={() => setStage('profile')}>Create workspace <span>→</span></button><button className="secondary-button" onClick={() => setStage('signin')}>Sign in</button></div><p className="legal-copy">Cloud sign-in uses an official identity provider when your StudentOS service is configured. This preview does not imitate one.</p><label className="welcome-language">Language <select value={language} onChange={(e) => { onLanguage(e.target.value); change('language', e.target.value); }}>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label></section></main>;
  if (stage === 'signin') return <main className="welcome-shell"><section className="welcome-card compact"><button className="back-link" onClick={() => setStage('welcome')}>← Back</button><p className="eyebrow">ACCOUNT</p><h1>Sign in needs a connected identity service.</h1><p className="hero-copy">Email/password, Google, Apple, and phone OTP are intentionally unavailable in this unconfigured preview. No passwords or OTPs are collected here.</p><div className="notice-card"><strong>To enable account access</strong><p>Configure Firebase or an OIDC service, enable the providers, and verify tokens on your StudentOS API.</p></div><button className="primary-button" onClick={() => setStage('profile')}>Use local offline workspace <span>→</span></button></section></main>;
  return <main className="welcome-shell"><section className="onboarding-card"><div className="progress-dots"><i className={stage === 'profile' ? 'current' : ''}/><i className={stage === 'education' ? 'current' : ''}/><i className={stage === 'goals' ? 'current' : ''}/></div>{stage === 'profile' && <><button className="back-link" onClick={() => setStage('welcome')}>← Back</button><p className="eyebrow">STEP 1 OF 3</p><h1>Let’s make this feel like yours.</h1><p>All of these choices can be changed later.</p><div className="form-grid"><Field label="Your name" value={form.name} onChange={(v) => change('name', v)} placeholder="How should StudentOS greet you?" /><SelectField label="Age group" value={form.ageGroup} onChange={(v) => change('ageGroup', v)} options={['Under 13', '13–15', '16–18', '18+']} /><SelectField label="Preferred language" value={form.language} onChange={(v) => change('language', v)} options={languages.map(([code, label]) => ({ value: code, label }))} /><Field label="Timezone" value={form.timezone} onChange={(v) => change('timezone', v)} /></div><button className="primary-button" disabled={!sanitize(form.name)} onClick={() => setStage('education')}>Continue <span>→</span></button></>}{stage === 'education' && <><button className="back-link" onClick={() => setStage('profile')}>← Back</button><p className="eyebrow">STEP 2 OF 3</p><h1>Your learning context.</h1><p>StudentOS only uses this to organize your own workspace. Curriculum data is never invented.</p><div className="form-grid"><Field label="Country" value={form.country} onChange={(v) => change('country', v)} placeholder="e.g. Morocco"/><Field label="Education system" value={form.educationSystem} onChange={(v) => change('educationSystem', v)} placeholder="e.g. National curriculum"/><Field label="Stage" value={form.stage} onChange={(v) => change('stage', v)} placeholder="e.g. Secondary"/><Field label="Grade / year" value={form.grade} onChange={(v) => change('grade', v)} placeholder="e.g. Year 11"/><Field label="Track / stream (optional)" value={form.track} onChange={(v) => change('track', v)} placeholder="e.g. Science"/></div><label className="field-label">Subjects <span>Add the subjects you study — one per line.</span><textarea value={form.subjects.join('\n')} onChange={(e) => change('subjects', e.target.value.split('\n'))} placeholder={'Mathematics\nEnglish\nPhysics'} /></label><button className="primary-button" onClick={() => setStage('goals')}>Continue <span>→</span></button></>}{stage === 'goals' && <><button className="back-link" onClick={() => setStage('education')}>← Back</button><p className="eyebrow">STEP 3 OF 3</p><h1>What would you like to improve?</h1><p>Choose any goals. Optional features stay out of your way until you opt in.</p><div className="choice-grid">{['School grades', 'Study consistency', 'Languages', 'Skills', 'Quran', 'Fitness / exercise', 'Time management', 'Exam preparation'].map((goal) => <button key={goal} className={form.goals.includes(goal) ? 'selected' : ''} onClick={() => toggle('goals', goal)}>{form.goals.includes(goal) ? '✓ ' : ''}{goal}</button>)}</div><button className="primary-button" onClick={() => onFinish({ ...form, subjects: form.subjects.map(sanitize).filter(Boolean) })}>Open my StudentOS <span>→</span></button></>}</section></main>;
}

function Home({ workspace, openDetail, navigate, setModal, t }) {
  const today = isoDay();
  const completedToday = workspace.sessions.filter((session) => session.status === 'completed' && isoDay(session.endedAt || session.startedAt) === today);
  const seconds = completedToday.reduce((sum, session) => sum + (session.actualSeconds || 0), 0);
  const dueTasks = workspace.tasks.filter((task) => task.status !== 'Completed' && task.status !== 'Cancelled').sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999'));
  const events = workspace.events.filter((event) => new Date(event.startsAt).getTime() > Date.now() - 60000).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  const nextEvent = events[0];
  const recommendation = getRecommendation(workspace, nextEvent, dueTasks);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('greetingMorning') : hour < 18 ? t('greetingAfternoon') : t('greetingEvening');
  const completedTasks = workspace.tasks.filter((task) => task.status === 'Completed' && isoDay(task.updatedAt) === today).length;
  const streak = studyStreak(workspace.sessions);
  return <div className="screen home-screen"><section className="greeting-row"><div><p className="muted">{new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}</p><h1>{greeting}, {workspace.profile.name || 'student'} <span className="wave">👋</span></h1></div><button className="round-plus" onClick={() => setModal({ type: 'task' })} aria-label="Add task">+</button></section><section className="progress-hero"><div className="section-top"><div><p>{t('todayProgress')}</p><strong>{seconds ? prettyDuration(seconds) : '0 min'}</strong></div><div className="sun-progress"><span>{completedToday.length}</span><small>sessions</small></div></div><div className="metric-row"><Metric value={seconds ? prettyDuration(seconds) : '0m'} label={t('studyTime')} /><Metric value={`${completedTasks}/${workspace.tasks.filter((x) => isoDay(x.createdAt) === today || isoDay(x.updatedAt) === today).length || 0}`} label={t('tasks')} /><Metric value={completedToday.length} label={t('sessions')} /></div></section><section className="quick-actions"><button onClick={() => setModal({ type: 'task' })}><span>＋</span>{t('addTask')}</button><button onClick={() => openDetail('tasks')}><span>✓</span>Tasks</button><button onClick={() => openDetail('recall')}><span>◌</span>Recall</button></section><section className="section-block"><SectionHeader title={t('nextActivity')} action={t('viewSchedule')} onAction={() => openDetail('schedule')} />{nextEvent ? <article className="next-card"><div className="event-icon">{nextEvent.type === 'Exam' ? '✎' : '◔'}</div><div><p className="card-title">{nextEvent.title}</p><p className="muted">{nextEvent.subject || 'Personal'} · {new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(nextEvent.startsAt))} · {nextEvent.duration} min</p></div><span className="chevron">›</span></article> : <EmptyCard message={t('noActivity')} action="Add to schedule" onAction={() => setModal({ type: 'event' })} />}</section><section className="section-block"><SectionHeader title={t('whatNow')} /><article className="recommendation-card"><div className="ai-spark">✦</div><div><p className="card-title">A plan built from your real data</p><p>{recommendation.text}</p><small>{recommendation.basis}</small><button className="text-button" onClick={() => recommendation.action === 'study' ? navigate('study') : recommendation.action === 'recall' ? openDetail('recall') : recommendation.action === 'schedule' ? navigate('schedule') : setModal({ type: 'task' })}>{recommendation.label} <span>→</span></button></div></article></section><section className="section-block"><SectionHeader title={t('upcomingTasks')} action="See all" onAction={() => openDetail('tasks')} />{dueTasks.length ? <div className="task-list">{dueTasks.slice(0, 3).map((task) => <TaskRow key={task.id} task={task} onComplete={() => openDetail('tasks')} />)}</div> : <EmptyCard message="No open tasks yet. Add a real task to start your plan." action={t('addTask')} onAction={() => setModal({ type: 'task' })} />}</section><section className="two-up"><article className="mini-card" onClick={() => openDetail('recall')} role="button" tabIndex="0"><span className="mini-icon purple">◌</span><p>{t('weakTopics')}</p><strong>{workspace.recallCards.filter((card) => card.state === 'Weak' || card.state === 'Needs Review').length ? `${workspace.recallCards.filter((card) => card.state === 'Weak' || card.state === 'Needs Review').length} cards need care` : 'No weak topics recorded'}</strong></article><article className="mini-card"><span className="mini-icon flame">♨</span><p>{t('streak')}</p><strong>{streak ? `${streak} ${t('dayStreak')}` : 'Start your first session'}</strong></article></section></div>;
}

function Schedule({ workspace, update, setModal, openDetail }) {
  const events = [...workspace.events].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  const days = [0, 1, 2, 3, 4].map((offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d; });
  return <div className="screen"><PageTitle eyebrow="PLAN" title="Your schedule" description="Every event is saved on this device. AI suggestions are always optional." action="Add event" onAction={() => setModal({ type: 'event' })}/><div className="date-strip">{days.map((date) => <div key={date.toISOString()} className={isoDay(date) === isoDay() ? 'today' : ''}><span>{dayLabel(date)}</span><strong>{date.getDate()}</strong></div>)}</div><section className="timeline"><div className="timeline-heading"><h2>Upcoming</h2><button className="icon-button" onClick={() => openDetail('permissions')}>⌁</button></div>{events.length ? events.map((event) => <article className={`schedule-card ${event.mandatory ? 'mandatory' : ''}`} key={event.id}><div className="schedule-time">{new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(event.startsAt))}</div><div className="schedule-rule"/><div className="schedule-copy"><span className="pill">{event.mandatory ? 'Mandatory study' : event.type}</span><h3>{event.title}</h3><p>{event.subject || 'Personal'} · {event.duration} minutes</p>{event.mandatory && <small>Restrictions activate only when supported and explicitly permitted.</small>}</div><button className="delete-x" onClick={() => { if (window.confirm('Remove this schedule item?')) update((w) => ({ ...w, events: w.events.filter((item) => item.id !== event.id) })); }} aria-label="Remove event">×</button></article>) : <EmptyState icon="▦" title="Your schedule is open" copy="Add school, study, rest, prayer, or personal events. StudentOS will never force a schedule." action="Add your first event" onAction={() => setModal({ type: 'event' })}/>}</section><section className="info-banner"><span>✦</span><div><strong>Smart scheduling is a suggestion layer</strong><p>Connect the AI service to generate proposals you can accept, edit, or reject.</p></div></section></div>;
}

function Study({ workspace, startSession, pauseSession, resumeSession, stopSession, activeSession, now, openDetail }) {
  const [form, setForm] = useState({ subject: workspace.subjects[0]?.name || '', topic: '', duration: 25, mode: 'Focus Study' });
  const [customSubject, setCustomSubject] = useState(false);
  if (activeSession) {
    const total = calcSessionSeconds(activeSession, now);
    const plannedSeconds = activeSession.plannedMinutes * 60;
    const pct = Math.min(100, Math.round((total / plannedSeconds) * 100));
    return <div className="screen study-screen"><PageTitle eyebrow="STUDY SESSION" title={activeSession.status === 'paused' ? 'Take a breath.' : 'Stay with it.'} description={`${activeSession.mode} · ${activeSession.subject}${activeSession.topic ? ` · ${activeSession.topic}` : ''}`} /><section className="timer-card"><div className="timer-ring" style={{ '--progress': `${pct * 3.6}deg` }}><div><strong>{prettyDuration(Math.max(0, plannedSeconds - total))}</strong><span>remaining</span></div></div><div className="timer-meta"><span>{prettyDuration(total)} focused</span><span>{activeSession.plannedMinutes} min planned</span></div>{activeSession.policyResult && <div className="policy-note">{activeSession.policyResult.active ? 'A supported study policy is active.' : activeSession.policyResult.reason}</div>}<div className="timer-actions">{activeSession.status === 'active' ? <button className="secondary-button" onClick={pauseSession}>Ⅱ Pause</button> : <button className="primary-button" onClick={resumeSession}>▶ Resume</button>}<button className="primary-button" onClick={() => stopSession('completed')}>Finish session <span>✓</span></button></div><button className="emergency-button" onClick={() => stopSession('interrupted')}>Emergency Stop <span>— safely ends this session</span></button></section><article className="focus-card"><span>◔</span><div><strong>Focus, not false control.</strong><p>StudentOS records your session. Platform controls only activate when the operating system confirms support and permission.</p></div></article></div>;
  }
  return <div className="screen study-screen"><PageTitle eyebrow="STUDY ENGINE" title="Start a study session" description="A timer that records only time you actually choose to study."/><section className="study-form-card"><label className="field-label">Subject<select value={customSubject ? '__custom' : form.subject} onChange={(e) => { if (e.target.value === '__custom') { setCustomSubject(true); setForm({ ...form, subject: '' }); } else { setCustomSubject(false); setForm({ ...form, subject: e.target.value }); } }}><option value="">Choose a subject</option>{workspace.subjects.map((subject) => <option key={subject.id} value={subject.name}>{subject.name}</option>)}<option value="__custom">Custom subject…</option></select></label>{customSubject && <Field label="Custom subject" value={form.subject} onChange={(value) => setForm({ ...form, subject: value })} placeholder="e.g. Piano"/>}<Field label="Topic (optional)" value={form.topic} onChange={(value) => setForm({ ...form, topic: value })} placeholder="e.g. Functions review"/><label className="field-label">Duration<div className="duration-choices">{[15, 25, 45, 60].map((value) => <button type="button" key={value} className={form.duration === value ? 'selected' : ''} onClick={() => setForm({ ...form, duration: value })}>{value}<small>min</small></button>)}</div></label><label className="field-label">Study mode<div className="mode-list">{[['Normal Study', 'Your timer and study tools only.'], ['Focus Study', 'A focused timer. Supported controls stay optional.'], ['Mandatory Study', 'Attempts supported focus policy; never claims a device lock.']].map(([mode, copy]) => <button type="button" key={mode} className={form.mode === mode ? 'selected' : ''} onClick={() => setForm({ ...form, mode })}><span className="mode-dot"/><div><strong>{mode}</strong><small>{copy}</small></div></button>)}</div></label><button className="primary-button large" onClick={() => startSession(form)}>Start {form.duration}-minute session <span>→</span></button></section><section className="feature-link" onClick={() => openDetail('permissions')} role="button" tabIndex="0"><span>⌁</span><div><strong>Check focus capabilities</strong><p>See exactly what this platform can and cannot do.</p></div><b>›</b></section></div>;
}

function Tutor({ workspace, notify }) {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState(workspace.subjects[0]?.name || '');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const send = async () => {
    const prompt = sanitize(message);
    if (!prompt || busy) return;
    const sent = { role: 'student', text: prompt };
    setMessages((items) => [...items, sent]); setMessage(''); setBusy(true);
    try {
      const answer = await askTutor({ message: prompt, context: { preferredLanguage: workspace.profile.language, country: workspace.profile.country, educationSystem: workspace.profile.educationSystem, grade: workspace.profile.grade, subject } });
      setMessages((items) => [...items, { role: 'tutor', text: answer }]);
    } catch (error) {
      setMessages((items) => [...items, { role: 'system', text: error.message || aiSetupMessage() }]);
      notify(aiSetupMessage());
    } finally { setBusy(false); }
  };
  return <div className="screen tutor-screen"><PageTitle eyebrow="AI TUTOR" title="Learn with context." description="The tutor uses your selected subject and education context only when a secure StudentOS API is connected."/><div className="context-selector"><label>Subject<select value={subject} onChange={(e) => setSubject(e.target.value)}><option value="">General learning</option>{workspace.subjects.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label><span>{workspace.profile.grade || 'Grade not set'}</span></div>{!messages.length && <section className="tutor-empty"><div className="ai-orb">✦</div><h2>Ask for an explanation, not an answer to copy.</h2><p>StudentOS can teach, give hints, create practice, correct work, and build revision plans once your secure tutor service is configured.</p><div className="prompt-chips">{['Explain this simply', 'Give me a practice question', 'Help me plan revision'].map((prompt) => <button key={prompt} onClick={() => setMessage(prompt)}>{prompt}</button>)}</div><div className="honesty-note"><strong>Service status</strong><p>{aiSetupMessage()}</p></div></section>}{messages.length > 0 && <section className="chat-thread">{messages.map((entry, index) => <article className={`chat-bubble ${entry.role}`} key={index}><span>{entry.role === 'student' ? 'You' : entry.role === 'tutor' ? 'Tutor' : 'Status'}</span><p>{entry.text}</p></article>)}{busy && <article className="chat-bubble tutor"><span>Tutor</span><p className="typing">Thinking securely <i/> <i/> <i/></p></article>}</section>}<div className="composer"><textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask about a lesson…" aria-label="Ask AI tutor"/><button disabled={!sanitize(message) || busy} onClick={send} aria-label="Send question">↑</button></div><p className="composer-note">Never share passwords, personal addresses, or private files in a tutor message.</p></div>;
}

function Progress({ workspace, openDetail }) {
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() - 6 + index); return date; });
  const daily = week.map((date) => { const seconds = workspace.sessions.filter((session) => session.status === 'completed' && isoDay(session.endedAt || session.startedAt) === isoDay(date)).reduce((sum, session) => sum + (session.actualSeconds || 0), 0); return { date, seconds }; });
  const max = Math.max(...daily.map((item) => item.seconds), 1);
  const total = workspace.sessions.filter((session) => session.status === 'completed').reduce((sum, session) => sum + (session.actualSeconds || 0), 0);
  const interruptions = workspace.sessions.filter((session) => session.status === 'interrupted').length;
  const cards = workspace.recallCards;
  return <div className="screen progress-screen"><PageTitle eyebrow="PROGRESS" title="Your real momentum." description="This view only uses sessions, tasks, and recall you recorded."/><section className="total-card"><p>Total focused time</p><strong>{total ? prettyDuration(total) : '0 min'}</strong><span>{workspace.sessions.filter((s) => s.status === 'completed').length} completed sessions</span></section><section className="chart-card"><SectionHeader title="Last 7 days" action="Actual study time"/><div className="bar-chart">{daily.map((item) => <div className="bar-column" key={isoDay(item.date)}><span className="bar-value">{item.seconds ? `${minutes(item.seconds)}m` : ''}</span><i style={{ height: `${Math.max(item.seconds ? 10 : 3, (item.seconds / max) * 100)}%` }} /><small>{dayLabel(item.date).slice(0, 1)}</small></div>)}</div></section><div className="stat-grid"><StatsCard value={workspace.tasks.filter((task) => task.status === 'Completed').length} label="Tasks completed" color="mint"/><StatsCard value={interruptions} label="Interrupted sessions" color="peach"/><StatsCard value={cards.filter((card) => card.state === 'Mastered').length} label="Recall cards mastered" color="purple"/><StatsCard value={studyStreak(workspace.sessions)} label="Current day streak" color="yellow"/></div><section className="section-block"><SectionHeader title="Knowledge map" action="Open recall" onAction={() => openDetail('recall')}/>{cards.length ? <div className="knowledge-map">{['Mastered', 'Learning', 'Needs Review', 'Weak'].map((state) => <div key={state}><span className={state.toLowerCase().replaceAll(' ', '-')}/><p>{state}</p><strong>{cards.filter((card) => card.state === state).length}</strong></div>)}</div> : <EmptyCard message="No recall performance yet. Add cards and review them to build this map." action="Open recall" onAction={() => openDetail('recall')} />}</section><section className="info-banner"><span>⌁</span><div><strong>Entertainment usage isn’t estimated.</strong><p>It appears here only when a native device adapter can read it with your permission.</p></div></section></div>;
}

function More({ openDetail, workspace }) {
  const groups = [
    { label: 'Organize learning', items: [['tasks', 'Tasks', 'Plan and complete your work'], ['subject', 'Subjects', 'Your curriculum and custom subjects'], ['recall', 'Active Recall', 'Cards, blur mode and review'], ['test', 'Tests', 'Create honest practice assessments']] },
    { label: 'Grow beyond class', items: [['language', 'Language Academy', 'Build a language path at your pace'], ['skill', 'Skill Academy', 'Practice skills through projects']] },
    { label: 'Optional life tools', items: [['prayer', 'Prayer', 'Manual city setup or a trusted provider'], ['quran', 'Quran', 'Use a verified text source'], ['entertainment', 'Entertainment', 'Limits where usage data is supported']] },
    { label: 'Safety & account', items: [['family', 'Family', 'Explicit sharing, never private conversations'], ['permissions', 'Permissions Center', 'What StudentOS can access'], ['settings', 'Settings', 'Language, data, privacy and more']] },
  ];
  return <div className="screen more-screen"><PageTitle eyebrow="MORE" title="Make StudentOS yours." description={workspace.profile.goals.length ? `${workspace.profile.goals.slice(0, 2).join(' · ')}${workspace.profile.goals.length > 2 ? ' · …' : ''}` : 'Optional tools stay optional.'}/>{groups.map((group) => <section className="more-group" key={group.label}><p className="group-label">{group.label}</p><div className="more-list">{group.items.map(([key, title, copy]) => <button key={key} className="more-row" onClick={() => openDetail(key)}><span className={`more-icon ${key}`}>{icon[key]}</span><div><strong>{title}</strong><small>{copy}</small></div><b>›</b></button>)}</div></section>)}</div>;
}

function DetailScreen({ detail, workspace, update, notify, openDetail, setModal, addTask, changeTask, t }) {
  const configs = {
    tasks: ['TASKS', 'Tasks', 'Track what needs your attention.'], subject: ['LEARNING', 'Subjects', 'Keep school and personal learning organized.'], recall: ['MEMORY SYSTEM', 'Active Recall', 'Remember first. Reveal later. Review based on your real answer.'], test: ['ASSESSMENTS', 'Tests', 'Practice tests are generated only when the AI service is connected.'], language: ['LANGUAGE ACADEMY', 'Language Academy', 'Set a target, level, and daily commitment.'], skill: ['SKILL ACADEMY', 'Skill Academy', 'Build a path from lessons to projects.'], prayer: ['OPTIONAL FEATURE', 'Prayer', 'Prayer times require your selected city and a transparent, trusted calculation provider.'], quran: ['OPTIONAL FEATURE', 'Quran', 'StudentOS does not invent or alter Quran text.'], entertainment: ['SELF-CONTROL', 'Entertainment', 'Limits never imply app control where your device cannot provide it.'], family: ['FAMILY FOUNDATION', 'Family', 'Sharing needs an explicit invitation, approval, and scope.'], permissions: ['PERMISSIONS CENTER', 'Know what StudentOS can access.', 'Every request explains why it is needed.'], settings: ['SETTINGS', 'Settings', 'Control your workspace, privacy, and preferences.'], schedule: ['SCHEDULE', 'Your schedule', 'Plan your next study block.'], study: ['STUDY ENGINE', 'Start a study session', 'Set a subject, duration, and mode.'],
  };
  const [eyebrow, title, description] = configs[detail] || configs.settings;
  let body;
  if (detail === 'tasks') body = <TasksDetail tasks={workspace.tasks} subjects={workspace.subjects} onAdd={() => setModal({ type: 'task' })} onEdit={(task) => setModal({ type: 'task', task })} onChange={changeTask} />;
  else if (detail === 'subject') body = <SubjectsDetail workspace={workspace} update={update} notify={notify} />;
  else if (detail === 'recall') body = <RecallDetail workspace={workspace} update={update} notify={notify} />;
  else if (detail === 'permissions') body = <PermissionsDetail workspace={workspace} update={update} notify={notify} />;
  else if (detail === 'settings') body = <SettingsDetail workspace={workspace} update={update} setModal={setModal} />;
  else if (detail === 'language') body = <GoalDetail kind="language" workspace={workspace} update={update} />;
  else if (detail === 'skill') body = <GoalDetail kind="skill" workspace={workspace} update={update} />;
  else if (detail === 'entertainment') body = <EntertainmentDetail workspace={workspace} update={update} />;
  else if (detail === 'prayer') body = <PrayerDetail workspace={workspace} update={update} />;
  else if (detail === 'quran') body = <IntegrityPlaceholder icon="☾" title="Bring your verified Quran source" copy="Quran reading and memorization progress can be stored after a trusted, licensed Quran text provider is configured. No verses are generated or modified by this app." />;
  else if (detail === 'family') body = <IntegrityPlaceholder icon="♡" title="Family is server-backed by design" copy="Invitations, approval, scoped aggregate statistics, deletion, and relationship audits require the StudentOS API. Private AI conversations, notes, uploads, and answers remain private by default." />;
  else if (detail === 'test') body = <IntegrityPlaceholder icon="✎" title="Tests need a real learning source" copy="Connect a verified curriculum or a student-owned lesson upload, then use the secured tutor service to generate questions. StudentOS will not fabricate a curriculum or score." />;
  else if (detail === 'schedule') body = <button className="primary-button" onClick={() => setModal({ type: 'event' })}>Add a schedule item <span>+</span></button>;
  else if (detail === 'study') body = <button className="primary-button" onClick={() => { window.scrollTo(0, 0); openDetail('study'); }}>Open study engine <span>→</span></button>;
  return <div className="screen detail-screen"><button className="back-link page-back" onClick={() => openDetail(null)}>← Back to More</button><PageTitle eyebrow={eyebrow} title={title} description={description}/>{body}</div>;
}

function TasksDetail({ tasks, subjects, onAdd, onEdit, onChange }) {
  const [filter, setFilter] = useState('Open');
  const shown = tasks.filter((task) => filter === 'All' ? true : filter === 'Open' ? task.status !== 'Completed' && task.status !== 'Cancelled' : task.status === filter);
  return <><div className="filter-row">{['Open', 'Completed', 'All'].map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}<button className="add-small" onClick={onAdd}>＋</button></div>{shown.length ? <div className="task-list detail-list">{shown.sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999')).map((task) => <article className="task-item" key={task.id}><button className={`check-button ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => onChange(task.id, { status: task.status === 'Completed' ? 'To Do' : 'Completed' })}>{task.status === 'Completed' ? '✓' : ''}</button><div onClick={() => onEdit(task)} role="button" tabIndex="0"><strong>{task.title}</strong><p>{task.subject || 'No subject'}{task.deadline ? ` · Due ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(task.deadline))}` : ''}</p><span className={`priority ${task.priority?.toLowerCase()}`}>{task.priority || 'Medium'}</span></div><button className="row-menu" onClick={() => onEdit(task)}>•••</button></article>)}</div> : <EmptyState icon="✓" title={filter === 'Completed' ? 'No completed tasks yet' : 'Nothing waiting for you'} copy="Create a task with a deadline, subject, and realistic duration." action="Add a task" onAction={onAdd}/>}</>;
}

function SubjectsDetail({ workspace, update, notify }) {
  const [name, setName] = useState('');
  const add = () => { if (!sanitize(name)) return; if (workspace.subjects.some((subject) => subject.name.toLowerCase() === sanitize(name).toLowerCase())) return notify('That subject already exists.'); update((w) => ({ ...w, subjects: [...w.subjects, { id: uid(), name: sanitize(name), createdAt: new Date().toISOString() }] })); setName(''); notify('Subject added.'); };
  return <><section className="inline-create"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a subject or custom learning area" onKeyDown={(e) => e.key === 'Enter' && add()}/><button onClick={add}>Add</button></section>{workspace.subjects.length ? <div className="subject-grid">{workspace.subjects.map((subject) => <article key={subject.id} className="subject-card"><span>{subject.name.slice(0, 1).toUpperCase()}</span><h3>{subject.name}</h3><p>{workspace.sessions.filter((session) => session.subject === subject.name && session.status === 'completed').length} completed sessions</p><button onClick={() => { if (window.confirm(`Remove ${subject.name}? Existing study history remains.`)) update((w) => ({ ...w, subjects: w.subjects.filter((item) => item.id !== subject.id) })); }}>Remove</button></article>)}</div> : <EmptyState icon="▤" title="Start with a subject" copy="Subjects connect your tasks, sessions, recall cards, and future curriculum data."/>}<article className="info-banner"><span>⌁</span><div><strong>Curriculum status: not connected</strong><p>Official curriculum sources appear only after import and verification by the StudentOS backend.</p></div></article></>;
}

function RecallDetail({ workspace, update, notify }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ subject: workspace.subjects[0]?.name || '', prompt: '', answer: '' });
  const due = workspace.recallCards.filter((card) => !card.nextReview || new Date(card.nextReview) <= new Date());
  const [reviewId, setReviewId] = useState(null);
  const card = workspace.recallCards.find((item) => item.id === reviewId);
  const add = () => { if (!sanitize(form.prompt) || !sanitize(form.answer)) return notify('Add both a prompt and answer.'); update((w) => ({ ...w, recallCards: [{ ...form, id: uid(), state: 'Learning', createdAt: new Date().toISOString(), nextReview: new Date().toISOString(), reviews: [] }, ...w.recallCards] })); setAdding(false); setForm({ subject: workspace.subjects[0]?.name || '', prompt: '', answer: '' }); notify('Recall card saved locally.'); };
  const rate = (rating) => {
    const intervals = { Remembered: 7, 'Partially remembered': 2, Forgot: 1, Incorrect: 1 };
    const states = { Remembered: 'Mastered', 'Partially remembered': 'Learning', Forgot: 'Needs Review', Incorrect: 'Weak' };
    update((w) => ({ ...w, recallCards: w.recallCards.map((item) => item.id === card.id ? { ...item, state: states[rating], nextReview: new Date(Date.now() + intervals[rating] * 86400000).toISOString(), reviews: [...(item.reviews || []), { rating, at: new Date().toISOString() }] } : item) }));
    setReviewId(null); notify(`Recorded: ${rating}.`);
  };
  if (card) return <section className="review-card"><p className="eyebrow">ACTIVE RECALL</p><span className="card-subject">{card.subject || 'General'}</span><h2>{card.prompt}</h2><details><summary>Reveal answer</summary><p>{card.answer}</p></details><p className="rate-prompt">How well did you remember it?</p><div className="rating-grid">{['Remembered', 'Partially remembered', 'Forgot', 'Incorrect'].map((rating) => <button key={rating} onClick={() => rate(rating)}>{rating}</button>)}</div><button className="text-button" onClick={() => setReviewId(null)}>Cancel review</button></section>;
  return <><div className="recall-overview"><div><strong>{due.length}</strong><span>due now</span></div><div><strong>{workspace.recallCards.filter((card) => card.state === 'Mastered').length}</strong><span>mastered</span></div><button onClick={() => setAdding(true)}>＋ Add card</button></div>{adding && <section className="create-card"><SelectField label="Subject" value={form.subject} onChange={(value) => setForm({ ...form, subject: value })} options={['', ...workspace.subjects.map((subject) => subject.name)]}/><label className="field-label">Question / prompt<textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} placeholder="What do you want to remember?"/></label><label className="field-label">Answer<textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Write the correct answer in your own words."/></label><div className="button-pair"><button className="secondary-button" onClick={() => setAdding(false)}>Cancel</button><button className="primary-button" onClick={add}>Save card</button></div></section>}{workspace.recallCards.length ? <div className="recall-list">{workspace.recallCards.map((item) => <article key={item.id}><span className={`state-dot ${item.state.toLowerCase().replaceAll(' ', '-')}`}/><div><strong>{item.prompt}</strong><p>{item.subject || 'General'} · {item.state}</p></div><button onClick={() => setReviewId(item.id)}>{due.includes(item) ? 'Review' : 'Open'}</button></article>)}</div> : <EmptyState icon="◌" title="Build your first memory card" copy="Cards start on Day 1. Your rating schedules real follow-ups at Day 2, 4, 7, 14, and 30 as you improve." action="Add a card" onAction={() => setAdding(true)}/>}<article className="info-banner"><span>◌</span><div><strong>Spaced repetition is adaptive.</strong><p>New cards begin with the 1, 2, 4, 7, 14, 30 day pattern; incorrect answers move sooner.</p></div></article></>;
}

function PermissionsDetail({ workspace, update, notify }) {
  const [caps, setCaps] = useState(null);
  useEffect(() => { mobileControl.getCapabilities().then(setCaps); }, []);
  const request = async (kind) => {
    let result;
    if (kind === 'notifications') result = await mobileControl.requestNotificationPermission();
    else if (kind === 'microphone' || kind === 'camera') result = await mobileControl.requestMediaPermission(kind);
    else return;
    update((w) => ({ ...w, permissions: { ...w.permissions, [kind]: result.state } }));
    notify(`${kind[0].toUpperCase() + kind.slice(1)} permission: ${result.state}.`);
  };
  const rows = [
    ['notifications', 'Notifications', 'Study reminders, deadlines, recall reviews, and optional prayer reminders.', 'Only requested when you choose Allow.'],
    ['usageAccess', 'Usage Access', 'Measures entertainment use during Focus Study on supported Android configurations.', 'Not supported in this browser preview.'],
    ['appRestrictions', 'App restrictions', 'Supports a temporary study policy only where the mobile operating system approves it.', 'Not supported in this browser preview.'],
    ['microphone', 'Microphone', 'Optional speaking practice or voice tutor input.', 'Requested only when you start a voice feature.'],
    ['camera', 'Camera', 'Optional document scanning for a lesson you choose.', 'Requested only when you scan a document.'],
    ['location', 'Location', 'Optional prayer calculation. A city can be entered manually instead.', 'Not requested in this preview.'],
  ];
  return <>{caps ? <div className="capability-list"><div className="platform-badge">{caps.platform}</div>{rows.map(([key, title, why, timing]) => { const capability = caps[key]; const state = workspace.permissions[key] || (key === 'notifications' && typeof Notification !== 'undefined' ? Notification.permission : 'not requested'); const canRequest = ['notifications', 'microphone', 'camera'].includes(key) && capability?.available; return <article key={key}><span className={`cap-dot ${capability?.available ? 'available' : 'unavailable'}`}/><div><h3>{title}</h3><p>{why}</p><small>{capability?.detail || timing}</small><b className={capability?.available ? 'supported' : 'unsupported'}>{capability?.available ? `Supported · ${state}` : 'Not supported on this platform'}</b></div>{canRequest && <button onClick={() => request(key)}>{state === 'granted' ? 'Allowed' : 'Allow'}</button>}</article>; })}</div> : <div className="loading-card">Checking platform capabilities…</div>}<article className="info-banner"><span>⌁</span><div><strong>Nothing is hidden.</strong><p>StudentOS does not record screens, keylog, secretly monitor, or bypass mobile security.</p></div></article></>;
}

function SettingsDetail({ workspace, update, setModal }) {
  const profile = workspace.profile;
  return <div className="settings-list"><section><p className="group-label">PERSONAL</p><label className="setting-row"><span>Display name</span><input value={profile.name} onChange={(e) => update((w) => ({ ...w, profile: { ...w.profile, name: e.target.value } }))}/></label><label className="setting-row"><span>Language</span><select value={profile.language} onChange={(e) => update((w) => ({ ...w, profile: { ...w.profile, language: e.target.value } }))}>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label><label className="setting-row"><span>Theme</span><select value={workspace.theme} onChange={(e) => update((w) => ({ ...w, theme: e.target.value }))}><option value="light">Light</option><option value="dark">Dark</option></select></label></section><section><p className="group-label">NOTIFICATIONS</p>{Object.entries(workspace.notificationPreferences).map(([key, checked]) => <label className="setting-row toggle-row" key={key}><span>{key[0].toUpperCase() + key.slice(1)} reminders</span><input type="checkbox" checked={checked} onChange={(e) => update((w) => ({ ...w, notificationPreferences: { ...w.notificationPreferences, [key]: e.target.checked } }))}/></label>)}</section><section><p className="group-label">PRIVACY & DATA</p><button className="settings-button" onClick={() => exportWorkspace(workspace)}><span>Export local data</span><b>↓</b></button><button className="settings-button" onClick={() => setModal({ type: 'auth-info' })}><span>Account & cloud sync</span><b>›</b></button><button className="settings-button danger-text" onClick={() => setModal({ type: 'confirm-delete' })}><span>Delete local workspace</span><b>›</b></button></section><section className="privacy-card"><strong>Local preview privacy</strong><p>Your data is currently stored in this browser only. It is not encrypted cloud storage, synchronized, or accessible to a guardian. Connect a production StudentOS API for account deletion, export, sessions, and cloud sync.</p></section></div>;
}

function GoalDetail({ kind, workspace, update }) {
  const isLanguage = kind === 'language';
  const list = isLanguage ? workspace.languageGoals : workspace.skillGoals;
  const [form, setForm] = useState({ name: '', level: 'Beginner', dailyMinutes: 15 });
  const add = () => { if (!sanitize(form.name)) return; const key = isLanguage ? 'languageGoals' : 'skillGoals'; update((w) => ({ ...w, [key]: [...w[key], { ...form, id: uid(), name: sanitize(form.name), createdAt: new Date().toISOString() }] })); setForm({ name: '', level: 'Beginner', dailyMinutes: 15 }); };
  const suggestions = isLanguage ? ['Arabic', 'French', 'Spanish', 'English', 'Japanese', 'Korean'] : ['Python', 'Web Development', 'Digital Art', 'Public Speaking', 'Cooking', 'Robotics'];
  return <><section className="goal-create"><label className="field-label">{isLanguage ? 'Target language' : 'Skill'}<input list={`${kind}-suggestions`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={isLanguage ? 'e.g. French' : 'e.g. Python'}/><datalist id={`${kind}-suggestions`}>{suggestions.map((item) => <option key={item} value={item}/>)}</datalist></label><div className="form-grid"><SelectField label="Current level" value={form.level} onChange={(value) => setForm({ ...form, level: value })} options={['Beginner', 'Elementary', 'Intermediate', 'Advanced']}/><SelectField label="Daily time" value={form.dailyMinutes} onChange={(value) => setForm({ ...form, dailyMinutes: Number(value) })} options={[15, 20, 30, 45, 60].map((value) => ({ value, label: `${value} min` }))}/></div><button className="primary-button" onClick={add}>Add to my path <span>+</span></button></section>{list.length ? <div className="goal-list">{list.map((item) => <article key={item.id}><span>{isLanguage ? '◎' : '✦'}</span><div><strong>{item.name}</strong><p>{item.level} · {item.dailyMinutes} min daily</p></div><button onClick={() => { const key = isLanguage ? 'languageGoals' : 'skillGoals'; update((w) => ({ ...w, [key]: w[key].filter((entry) => entry.id !== item.id) })); }}>Remove</button></article>)}</div> : <EmptyState icon={isLanguage ? '◎' : '✦'} title={`Choose one ${isLanguage ? 'language' : 'skill'} to begin`} copy="Your path, lessons, and measurable progress will grow from goals you choose."/>}<article className="info-banner"><span>⌁</span><div><strong>Learning content is not fabricated.</strong><p>Paths may combine student-created goals, licensed content, and verified sources once the content service is configured.</p></div></article></>;
}

function EntertainmentDetail({ workspace, update }) {
  const [limits, setLimits] = useState(workspace.limits);
  const save = () => update((w) => ({ ...w, limits }));
  return <><section className="limits-card"><p>Daily limits</p>{Object.entries(limits).map(([category, limit]) => <label key={category}><span>{category}</span><div><input type="range" min="0" max="240" step="5" value={limit} onChange={(e) => setLimits({ ...limits, [category]: Number(e.target.value) })}/><strong>{limit} min</strong></div></label>)}<button className="primary-button" onClick={save}>Save limits</button></section><section className="unsupported-usage"><span>◉</span><div><strong>Usage: Not supported on this platform</strong><p>This browser cannot inspect other apps. Limits are your chosen plan, not a claim that apps are being blocked or measured.</p></div></section><article className="info-banner"><span>⌁</span><div><strong>Native capability rules apply.</strong><p>Android may require Usage Access; iOS/iPadOS may require approved Screen Time entitlements. StudentOS must show actual capability before activating a policy.</p></div></article></>;
}

function PrayerDetail({ workspace, update }) {
  const [settings, setSettings] = useState(workspace.prayerSettings || { country: workspace.profile.country || '', city: '', method: 'Select a trusted provider' });
  return <><section className="study-form-card"><Field label="Country" value={settings.country} onChange={(value) => setSettings({ ...settings, country: value })}/><Field label="City (manual entry is supported)" value={settings.city} onChange={(value) => setSettings({ ...settings, city: value })}/><Field label="Calculation method" value={settings.method} onChange={(value) => setSettings({ ...settings, method: value })}/><button className="primary-button" onClick={() => update((w) => ({ ...w, prayerSettings: settings }))}>Save prayer settings</button></section><IntegrityPlaceholder icon="◐" title="Prayer times are not calculated in this preview" copy="Add a transparent, trusted calculation provider to your StudentOS API, show its method and time zone, and let students choose manual city entry. Precise location is never required."/></>;
}

function IntegrityPlaceholder({ icon: mark, title, copy }) { return <section className="integrity-placeholder"><div>{mark}</div><h2>{title}</h2><p>{copy}</p><span>Requires configured service</span></section>; }

function TaskModal({ initial, subjects, onClose, onSave }) {
  const [form, setForm] = useState(initial ? { ...initial } : initialTaskForm());
  const patch = (key, value) => setForm((item) => ({ ...item, [key]: value }));
  return <Modal title={initial ? 'Edit task' : 'New task'} onClose={onClose}><Field label="Title" value={form.title} onChange={(value) => patch('title', value)} placeholder="What needs doing?" autoFocus/><label className="field-label">Description (optional)<textarea value={form.description} onChange={(e) => patch('description', e.target.value)} placeholder="Add useful context"/></label><div className="form-grid"><SelectField label="Subject" value={form.subject} onChange={(value) => patch('subject', value)} options={['', ...subjects.map((subject) => subject.name)]}/><SelectField label="Priority" value={form.priority} onChange={(value) => patch('priority', value)} options={['Low', 'Medium', 'High']}/><Field label="Deadline (optional)" type="datetime-local" value={form.deadline} onChange={(value) => patch('deadline', value)}/><SelectField label="Estimated time" value={form.estimatedMinutes} onChange={(value) => patch('estimatedMinutes', Number(value))} options={[15, 25, 30, 45, 60, 90].map((value) => ({ value, label: `${value} min` }))}/></div><div className="button-pair"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave(form)}>Save task</button></div></Modal>;
}

function EventModal({ subjects, onClose, onSave }) {
  const [form, setForm] = useState(initialEventForm());
  const patch = (key, value) => setForm((item) => ({ ...item, [key]: value }));
  return <Modal title="Schedule something" onClose={onClose}><Field label="Title" value={form.title} onChange={(value) => patch('title', value)} placeholder="e.g. Functions revision" autoFocus/><div className="form-grid"><SelectField label="Type" value={form.type} onChange={(value) => patch('type', value)} options={['Study', 'School', 'Homework', 'Exam', 'Exercise', 'Prayer', 'Quran', 'Language', 'Skill', 'Rest', 'Entertainment']}/><SelectField label="Subject (optional)" value={form.subject} onChange={(value) => patch('subject', value)} options={['', ...subjects.map((subject) => subject.name)]}/><Field label="Starts" type="datetime-local" value={form.startsAt} onChange={(value) => patch('startsAt', value)}/><SelectField label="Duration" value={form.duration} onChange={(value) => patch('duration', Number(value))} options={[15, 25, 30, 45, 60, 90, 120].map((value) => ({ value, label: `${value} min` }))}/></div><label className="checkbox-label"><input type="checkbox" checked={form.mandatory} onChange={(e) => patch('mandatory', e.target.checked)}/> Mark as Mandatory Study <small>It will use only OS controls that are actually supported and permitted.</small></label><div className="button-pair"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave(form)}>Save to schedule</button></div></Modal>;
}

function SetupModal({ onClose }) { return <Modal title="Account & cloud sync" onClose={onClose}><div className="setup-content"><div className="setup-icon">⌁</div><h3>Not connected in this preview</h3><p>StudentOS needs a configured Firebase/OIDC identity provider and authenticated API before it can create cloud accounts, sync devices, manage sessions, export cloud data, or delete a cloud account.</p><p>No sign-in form is shown because collecting credentials without that service would be misleading.</p><code>See README.md and .env.example</code><button className="primary-button" onClick={onClose}>I understand</button></div></Modal>; }
function ConfirmModal({ title, copy, confirm, danger, onClose, onConfirm }) { return <Modal title={title} onClose={onClose}><p className="modal-copy">{copy}</p><div className="button-pair"><button className="secondary-button" onClick={onClose}>Cancel</button><button className={danger ? 'danger-button' : 'primary-button'} onClick={onConfirm}>{confirm}</button></div></Modal>; }
function Modal({ title, children, onClose }) { return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={onClose} aria-label="Close">×</button></div>{children}</section></div>; }

function PageTitle({ eyebrow, title, description, action, onAction }) { return <section className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <button className="small-primary" onClick={onAction}>＋ {action}</button>}</section>; }
function SectionHeader({ title, action, onAction }) { return <div className="section-header"><h2>{title}</h2>{action && <button onClick={onAction}>{action} <span>›</span></button>}</div>; }
function Metric({ value, label }) { return <div><strong>{value}</strong><small>{label}</small></div>; }
function StatsCard({ value, label, color }) { return <article className={`stats-card ${color}`}><strong>{value}</strong><span>{label}</span></article>; }
function EmptyCard({ message, action, onAction }) { return <div className="empty-card"><p>{message}</p>{action && <button onClick={onAction}>{action} <span>→</span></button>}</div>; }
function EmptyState({ icon: mark, title, copy, action, onAction }) { return <section className="empty-state"><div>{mark}</div><h2>{title}</h2><p>{copy}</p>{action && <button className="secondary-button" onClick={onAction}>{action}</button>}</section>; }
function TaskRow({ task, onComplete }) { return <article className="task-item compact"><button className={`check-button ${task.status === 'Completed' ? 'checked' : ''}`} onClick={onComplete}>{task.status === 'Completed' ? '✓' : ''}</button><div><strong>{task.title}</strong><p>{task.subject || 'No subject'}{task.deadline ? ` · ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(task.deadline))}` : ''}</p></div><span className={`priority ${task.priority?.toLowerCase()}`}>{task.priority}</span></article>; }
function Field({ label, value, onChange, placeholder, type = 'text', autoFocus = false }) { return <label className="field-label">{label}<input autoFocus={autoFocus} type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}/></label>; }
function SelectField({ label, value, onChange, options }) { return <label className="field-label">{label}<select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>{options.map((option) => typeof option === 'object' ? <option key={option.value} value={option.value}>{option.label}</option> : <option key={option} value={option}>{option || 'Choose…'}</option>)}</select></label>; }

function getRecommendation(workspace, nextEvent, tasks) {
  const dueCards = workspace.recallCards.filter((card) => !card.nextReview || new Date(card.nextReview) <= new Date());
  const overdue = tasks.find((task) => task.deadline && new Date(task.deadline) < new Date());
  if (overdue) return { text: `“${overdue.title}” is overdue. Start with a small, focused block instead of postponing it again.`, basis: 'Based on an overdue task you created.', label: 'Start a study block', action: 'study' };
  if (dueCards.length) return { text: `${dueCards.length} recall ${dueCards.length === 1 ? 'card is' : 'cards are'} due. A quick review now will keep your memory plan honest.`, basis: 'Based on your own card review dates.', label: 'Review now', action: 'recall' };
  if (nextEvent) return { text: `Your next planned activity is “${nextEvent.title}.” Take a moment to prepare the material you need.`, basis: 'Based on the next item in your schedule.', label: 'See schedule', action: 'schedule' };
  if (tasks.length) return { text: `Choose “${tasks[0].title}” and set a realistic timer. You can pause or stop safely at any time.`, basis: 'Based on the tasks you created.', label: 'Start a study block', action: 'study' };
  return { text: 'Add your first task or study event. Once you have real plans and sessions, this recommendation will adapt to them.', basis: 'No study data has been recorded yet.', label: 'Add a task', action: 'task' };
}
function studyStreak(sessions) {
  const days = new Set(sessions.filter((session) => session.status === 'completed').map((session) => isoDay(session.endedAt || session.startedAt)));
  let count = 0; let cursor = new Date();
  if (!days.has(isoDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(isoDay(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); }
  return count;
}

export default App;
