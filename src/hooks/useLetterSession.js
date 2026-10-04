import { useCallback, useRef, useState } from 'react';
import { normalizeRequest } from '../../shared/ai/schema.js';
import { STYLES } from '../../shared/ai/catalog.js';
import { generate } from '../lib/api.js';

/**
 * Shared state machine behind every "letter producing" screen.
 *
 * It always keeps the request that produced the current text, which is what
 * makes the rewrite / refine / translate buttons operate on *this* letter
 * instead of generating a random new one.
 */
export function useLetterSession({ loadingLabel }) {
  const [letter, setLetter] = useState(null); // { text, request }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localMode, setLocalMode] = useState(false);
  const requestRef = useRef(null);

  const send = useCallback(
    async (request) => {
      setLoading(true);
      setError('');
      try {
        const res = await generate(request);
        if (res.text) {
          requestRef.current = request;
          setLetter({ text: res.text, request });
          setLocalMode(Boolean(res.local));
        }
        return res;
      } catch (e) {
        setError(e?.code || 'SERVER');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /** Produce a first letter from a raw (not yet normalised) request. */
  const start = useCallback((raw, label) => send(normalizeRequest({ ...raw, currentText: '' })), [send]);

  /** Rewrite / refine / translate the letter currently on screen. */
  const act = useCallback(
    async (kind, value) => {
      const current = letter;
      if (!current) return null;
      const base = current.request;

      if (kind === 'rewrite' || kind === 'another') {
        const rotate =
          kind === 'another'
            ? { style: STYLES[(STYLES.findIndex((s) => s.id === base.style) + 1) % STYLES.length].id }
            : {};
        return send(normalizeRequest({ ...base, ...rotate, variant: (base.variant || 0) + 1, currentText: '' }));
      }
      if (kind === 'customize') {
        return send(
          normalizeRequest({ ...base, customized: true, variant: (base.variant || 0) + 1, currentText: '' }),
        );
      }
      if (kind === 'translate') {
        const res = await send(
          normalizeRequest({ ...base, task: 'refine', action: 'translate', targetLanguage: value, currentText: current.text }),
        );
        // after translating, the "current request" describes the new language
        if (res?.text) {
          requestRef.current = normalizeRequest({
            ...base,
            language: value,
            variant: (base.variant || 0) + 1,
            currentText: '',
          });
          setLetter({ text: res.text, request: requestRef.current });
        }
        return res;
      }
      if (kind === 'refine') {
        return send(normalizeRequest({ ...base, task: 'refine', action: value, currentText: current.text }));
      }
      return null;
    },
    [letter, send],
  );

  /** The user edited the text by hand. */
  const edit = useCallback((text) => {
    setLetter((l) => (l ? { ...l, text } : l));
  }, []);

  const reset = useCallback(() => {
    setLetter(null);
    setError('');
    requestRef.current = null;
  }, []);

  return { letter, loading, loadingLabel, error, localMode, start, act, edit, reset, setLetter };
}
