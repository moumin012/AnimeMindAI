import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadLetters, saveLetters, uid } from '../lib/storage.js';

const LettersContext = createContext(null);

/**
 * Saved letters. Nothing is stored until the user explicitly taps "Save ❤️",
 * and nothing ever leaves the device.
 */
export function LettersProvider({ children }) {
  const [letters, setLetters] = useState(() => loadLetters());

  useEffect(() => {
    saveLetters(letters);
  }, [letters]);

  const addLetter = useCallback((letter) => {
    const record = {
      id: letter.id || uid(),
      text: letter.text,
      personName: letter.personName || '',
      occasion: letter.occasion || 'none',
      language: letter.language || 'ar-msa',
      request: letter.request || null,
      createdAt: letter.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLetters((list) => [record, ...list.filter((l) => l.id !== record.id)]);
    return record.id;
  }, []);

  const updateLetter = useCallback((id, patch) => {
    setLetters((list) =>
      list.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l)),
    );
  }, []);

  const removeLetter = useCallback((id) => {
    setLetters((list) => list.filter((l) => l.id !== id));
  }, []);

  const clearAll = useCallback(() => setLetters([]), []);

  const value = useMemo(
    () => ({ letters, addLetter, updateLetter, removeLetter, clearAll }),
    [letters, addLetter, updateLetter, removeLetter, clearAll],
  );

  return <LettersContext.Provider value={value}>{children}</LettersContext.Provider>;
}

export function useLetters() {
  const ctx = useContext(LettersContext);
  if (!ctx) throw new Error('useLetters must be used inside LettersProvider');
  return ctx;
}
