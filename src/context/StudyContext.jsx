import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  
  // Timer States
  const [isActive, setIsActive] = useState(false);
  const [studyMode, setStudyMode] = useState('focus'); // 'normal' | 'focus' | 'mandatory'
  const [sessionSubject, setSessionSubject] = useState(null);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);

  // Focus Lock / Self-Control state
  const [isStudyLockActive, setIsStudyLockActive] = useState(false);
  const [studyLockUntil, setStudyLockUntil] = useState(null);
  const [studyLockMinutes, setStudyLockMinutes] = useState(30);

  // Sound generator (Web Audio API synthetic soothing noise - Rain / Waves / White Noise)
  const [ambientSound, setAmbientSound] = useState('off'); // 'off' | 'rain' | 'waves' | 'chime'
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
        setTotalSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      // Session Completed
      setIsActive(false);
      handleSessionCompleted();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  // Handle Study Session Completion
  const handleSessionCompleted = () => {
    const minutesStudied = Math.max(1, Math.round(totalSecondsElapsed / 60));
    
    // Log to storage
    storageService.logStudySession({
      subjectId: sessionSubject?.id || 'general',
      subjectName: sessionSubject?.name || 'جلسة عامة',
      minutes: minutesStudied,
      type: studyMode,
    });

    // Update user stats
    if (user) {
      const todayMinutes = (user.studyMinutesToday || 0) + minutesStudied;
      const weekMinutes = (user.studyMinutesWeek || 0) + minutesStudied;
      const points = (user.totalPoints || 0) + (minutesStudied * 5);
      updateUserProfile({
        studyMinutesToday: todayMinutes,
        studyMinutesWeek: weekMinutes,
        totalPoints: points,
      });
    }

    // Play chime sound
    playChime();
  };

  const startSession = ({ mode = 'focus', subject = null, duration = 25 }) => {
    setStudyMode(mode);
    setSessionSubject(subject);
    setDurationMinutes(duration);
    setSecondsRemaining(duration * 60);
    setTotalSecondsElapsed(0);
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const resetSession = () => {
    setIsActive(false);
    setSecondsRemaining(durationMinutes * 60);
    setTotalSecondsElapsed(0);
  };

  // Study Lock / Self Control
  const activateStudyLock = (minutes) => {
    const until = new Date(Date.now() + minutes * 60 * 1000);
    setStudyLockMinutes(minutes);
    setStudyLockUntil(until);
    setIsStudyLockActive(true);
    // Also start study timer
    startSession({ mode: 'mandatory', duration: minutes });
  };

  const deactivateStudyLock = () => {
    setIsStudyLockActive(false);
    setStudyLockUntil(null);
  };

  // Web Audio Synthetic Sound Engine
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  };

  const toggleAmbientSound = (type) => {
    if (ambientSound === type) {
      // Turn off
      setAmbientSound('off');
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } else {
      // Start sound
      setAmbientSound(type);
      try {
        if (audioCtxRef.current) audioCtxRef.current.close();
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Generate pink noise / rain simulation
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'waves' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'waves' ? 350 : 800, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        noiseNodeRef.current = noise;
      } catch (e) {
        console.warn('Audio synthesis failed:', e);
      }
    }
  };

  return (
    <StudyContext.Provider
      value={{
        isActive,
        studyMode,
        sessionSubject,
        durationMinutes,
        secondsRemaining,
        totalSecondsElapsed,
        startSession,
        pauseSession,
        resumeSession,
        resetSession,
        isStudyLockActive,
        studyLockUntil,
        studyLockMinutes,
        activateStudyLock,
        deactivateStudyLock,
        ambientSound,
        toggleAmbientSound,
        playChime,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);
