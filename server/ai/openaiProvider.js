/**
 * Provider #1 — any OpenAI-compatible chat completions endpoint.
 *
 * The key never leaves the server: it is read from the environment on every
 * request and is never serialised into a response.
 */
import { buildPrompt } from '../../shared/ai/index.js';

const TIMEOUT_MS = 45000;

/** True when the environment is configured to talk to a real model. */
export function isConfigured() {
  return Boolean(process.env.RESALTI_API_KEY || process.env.OPENAI_API_KEY);
}

export function providerInfo() {
  if (!isConfigured()) return { provider: 'local', model: null };
  return {
    provider: 'openai',
    model: process.env.RESALTI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini',
  };
}

function parseModelJson(raw) {
  const cleaned = String(raw || '')
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * @param {object} request normalised request
 * @returns {Promise<object>}
 */
export async function openaiGenerate(request) {
  const apiKey = process.env.RESALTI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('AI_NOT_CONFIGURED');

  const baseUrl = (
    process.env.RESALTI_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    'https://api.openai.com/v1'
  ).replace(/\/$/, '');
  const model = process.env.RESALTI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const { system, user } = buildPrompt(request);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: request.task === 'what_to_say' ? 0.6 : 0.85,
        max_tokens: request.length === 'long' ? 900 : 600,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`AI_HTTP_${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('AI_EMPTY_RESPONSE');

    if (request.task === 'what_to_say') {
      const parsed = parseModelJson(content);
      if (parsed && parsed.message) {
        return {
          message: String(parsed.message),
          opener: String(parsed.opener || ''),
          avoid: String(parsed.avoid || ''),
          alternative: String(parsed.alternative || ''),
          note: String(parsed.note || ''),
          provider: 'openai',
        };
      }
      // Model ignored the JSON contract — keep the text as the message.
      return { message: content, opener: '', avoid: '', alternative: '', note: '', provider: 'openai' };
    }

    return { text: content, provider: 'openai' };
  } finally {
    clearTimeout(timer);
  }
}
