/**
 * Frontend AI client.
 *
 * - Always calls the backend first (that is where any API key lives).
 * - If the backend is unreachable, it lazily loads the very same offline engine
 *   the server uses, so the product keeps working. The engine is a separate
 *   chunk and is only downloaded when it is actually needed.
 */

const TIMEOUT_MS = 60000;

export class GenerationError extends Error {
  constructor(code, fields) {
    super(code);
    this.code = code;
    this.fields = fields || [];
  }
}

async function localFallback(request) {
  const engine = await import('../../shared/ai/index.js');
  const result =
    request.task === 'refine' && request.action === 'translate'
      ? engine.localTranslate(request)
      : engine.localGenerate(request);
  if (result?.unsupported) throw new GenerationError('TRANSLATE_NEEDS_CONTEXT');
  return { ok: true, ...result, local: true };
}

/**
 * @param {object} request a request already normalised by shared/ai/schema
 * @returns {Promise<object>} `{ text }` or `{ message, opener, avoid, alternative, note }`
 */
export async function generate(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      // A validation problem is the user's to fix — never hide it behind a fallback.
      if (data.error === 'INCOMPLETE') throw new GenerationError('INCOMPLETE', data.fields);
      if (data.error === 'TRANSLATE_NEEDS_CONTEXT') throw new GenerationError('TRANSLATE_NEEDS_CONTEXT');
      if (data.error === 'RATE_LIMITED') throw new GenerationError('RATE_LIMITED');
      throw new GenerationError('SERVER');
    }
    return { ...data, local: false };
  } catch (err) {
    if (err instanceof GenerationError) throw err;
    return localFallback(request);
  } finally {
    clearTimeout(timer);
  }
}

/** `{ engine: { provider, model }, keyConfigured }` — used by Settings. */
export async function getHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Uses the native share sheet when available, otherwise copies. */
export async function shareText(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
    }
  }
  const ok = await copyText(text);
  return ok ? 'copied' : 'failed';
}
