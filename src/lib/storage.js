/** Tiny, dependency-free persistence. Everything stays on the device. */

const SETTINGS_KEY = 'resalti:settings';
const LETTERS_KEY = 'resalti:letters';

export const DEFAULT_SETTINGS = {
  locale: 'ar',
  theme: 'light', // light | dark | system
  textSize: 'medium', // small | medium | large
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const loadSettings = () => ({ ...DEFAULT_SETTINGS, ...safeGet(SETTINGS_KEY, {}) });
export const saveSettings = (settings) => safeSet(SETTINGS_KEY, settings);

export const loadLetters = () => {
  const list = safeGet(LETTERS_KEY, []);
  return Array.isArray(list) ? list : [];
};

export const saveLetters = (letters) => safeSet(LETTERS_KEY, letters.slice(0, 200));

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
