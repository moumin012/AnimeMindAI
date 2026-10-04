/**
 * رسـالتي | Resalti — API server.
 *
 * - Keeps every secret server-side (nothing is ever sent to the browser).
 * - Uses a real model when a key is configured, otherwise falls back to the
 *   shared offline engine so the product still works end-to-end.
 * - In production also serves the built frontend.
 */
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { localGenerate, localTranslate, normalizeRequest, requestProblems } from '../shared/ai/index.js';
import { isConfigured, openaiGenerate, providerInfo } from './ai/openaiProvider.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '0.0.0.0';
const IS_PROD = process.env.NODE_ENV === 'production';

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '64kb' }));

/* --------------------------------------------------- tiny in-memory limiter */
const hits = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const bucket = hits.get(key) || [];
  const fresh = bucket.filter((t) => now - t < windowMs);
  if (fresh.length >= max) {
    hits.set(key, fresh);
    return false;
  }
  fresh.push(now);
  hits.set(key, fresh);
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) {
    const fresh = v.filter((t) => now - t < 60000);
    if (fresh.length) hits.set(k, fresh);
    else hits.delete(k);
  }
}, 60000).unref?.();

/* ------------------------------------------------------------------- health */
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'resalti',
    engine: providerInfo(),
    // exposed so the UI can be transparent about which engine answered
    keyConfigured: isConfigured(),
  });
});

/* ----------------------------------------------------------------- generate */
async function handleGenerate(req, res) {
  const ip = req.ip || 'unknown';
  if (!rateLimit(ip, 30, 60000)) {
    return res.status(429).json({ ok: false, error: 'RATE_LIMITED' });
  }

  let request;
  try {
    request = normalizeRequest(req.body);
  } catch (err) {
    return res.status(400).json({ ok: false, error: 'BAD_REQUEST', detail: err.message });
  }

  const problems = requestProblems(request);
  if (problems.length) {
    return res.status(422).json({ ok: false, error: 'INCOMPLETE', fields: problems });
  }

  if (request.task === 'refine' && request.action === 'translate') {
    const offline = localTranslate(request);
    if (offline.unsupported) {
      return res.status(422).json({ ok: false, error: 'TRANSLATE_NEEDS_CONTEXT' });
    }
    if (!isConfigured()) return res.json({ ok: true, ...offline });
  }

  if (isConfigured()) {
    try {
      const payload =
        request.task === 'refine' && request.action === 'translate'
          ? await openaiGenerate({ ...request, task: 'refine', action: `translate into ${request.targetLanguage}` })
          : await openaiGenerate(request);
      return res.json({ ok: true, ...payload });
    } catch (err) {
      // Never leak the provider error to the browser; degrade gracefully.
      console.error('[resalti] AI provider failed, falling back to the offline engine:', err.message);
    }
  }

  try {
    const result =
      request.task === 'refine' && request.action === 'translate'
        ? localTranslate(request)
        : localGenerate(request);
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error('[resalti] offline engine failed:', err);
    return res.status(500).json({ ok: false, error: 'ENGINE_ERROR' });
  }
}

app.post('/api/generate', handleGenerate);

/* ------------------------------------------------------------- static files */
const distDir = path.join(root, 'dist');
if (IS_PROD && fs.existsSync(distDir)) {
  app.use(
    express.static(distDir, {
      maxAge: '1h',
      index: false,
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
} else if (IS_PROD) {
  app.get(/^(?!\/api).*/, (_req, res) =>
    res.status(503).send('Frontend not built yet. Run: npm run build'),
  );
}

app.use((err, _req, res, _next) => {
  console.error('[resalti]', err);
  res.status(500).json({ ok: false, error: 'SERVER_ERROR' });
});

app.listen(PORT, HOST, () => {
  const engine = providerInfo();
  console.log(
    `[resalti] API on http://${HOST}:${PORT} — engine: ${engine.provider}${engine.model ? ` (${engine.model})` : ''}`,
  );
  if (!isConfigured()) {
    console.log('[resalti] No AI key found → using the built-in offline engine. Add RESALTI_API_KEY to .env for a real model.');
  }
});
