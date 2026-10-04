import test from 'node:test';
import assert from 'node:assert/strict';
import {
  composeLetter,
  composeWhatToSay,
  detectIntent,
  localGenerate,
  localTranslate,
  normalizeRequest,
  refineText,
  requestProblems,
} from '../shared/ai/index.js';

const base = {
  task: 'letter',
  personName: 'سارة',
  mentionName: true,
  recipient: 'love',
  occasion: 'birthday',
  feelings: ['gratitude'],
  style: 'spontaneous',
  intensity: 4,
  length: 'medium',
  language: 'ar-msa',
  details: 'وجودها يجعل أيامي أجمل.',
};

const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;

test('normalizeRequest drops unknown values and clamps intensity', () => {
  const r = normalizeRequest({ ...base, intensity: 99, occasion: 'nope', feelings: ['nope', 'love', 'love'] });
  assert.equal(r.intensity, 5);
  assert.equal(r.occasion, 'none');
  assert.deepEqual(r.feelings, ['love']);
});

test('requestProblems flags an empty letter request', () => {
  assert.deepEqual(requestProblems(normalizeRequest({ task: 'letter' })), ['details']);
  assert.equal(requestProblems(normalizeRequest(base)).length, 0);
});

test('letter is deterministic for identical inputs', () => {
  const a = localGenerate(normalizeRequest(base)).text;
  const b = localGenerate(normalizeRequest(base)).text;
  assert.equal(a, b);
  assert.ok(a.length > 40, 'letter should not be empty');
});

test('variant produces a different letter from the same inputs', () => {
  const a = localGenerate(normalizeRequest(base)).text;
  const b = localGenerate(normalizeRequest({ ...base, variant: 1 })).text;
  assert.notEqual(a, b);
});

test('name is omitted when mentionName is false', () => {
  const out = composeLetter(normalizeRequest({ ...base, mentionName: false }));
  assert.ok(!out.includes('سارة'), `name leaked: ${out}`);
});

test('name never appears more than twice', () => {
  const req = normalizeRequest({
    ...base,
    length: 'long',
    intensity: 5,
    feelings: ['love', 'gratitude', 'missing'],
  });
  const out = composeLetter(req);
  assert.ok(out.split('سارة').length - 1 <= 2, `name repeated: ${out}`);
});

test('user details are kept and switched to the second person', () => {
  const out = composeLetter(normalizeRequest(base));
  assert.ok(out.includes('أيامي أجمل'), out);
  assert.ok(out.includes('وجودك'), `third person not converted: ${out}`);
});

test('no memory is invented when the user gave none', () => {
  const out = composeLetter(normalizeRequest(base));
  assert.ok(!/ما زلت أذكر|ولا أنسى/.test(out), out);
});

test('a provided memory does appear in the letter', () => {
  const out = composeLetter(normalizeRequest({ ...base, memory: 'أول مرة تحدثنا فيها كانت في المدرسة' }));
  assert.ok(out.includes('المدرسة'), out);
});

test('length controls the size of the letter', () => {
  const short = words(composeLetter(normalizeRequest({ ...base, length: 'short' })));
  const long = words(composeLetter(normalizeRequest({ ...base, length: 'long' })));
  assert.ok(long > short, `long (${long}) should be longer than short (${short})`);
  assert.ok(short <= 45, `short letter too long: ${short} words`);
});

test('every supported language produces a non-empty letter', () => {
  for (const language of ['ar-msa', 'ar-dz', 'fr', 'en', 'ar-fr']) {
    const out = composeLetter(normalizeRequest({ ...base, language }));
    assert.ok(out.length > 30, `${language} produced: "${out}"`);
  }
});

test('Algerian output uses Darija vocabulary, not literal MSA', () => {
  const out = composeLetter(normalizeRequest({ ...base, language: 'ar-dz' }));
  assert.ok(/نحب|بزاف|بصح|راك|حاجة|صحيت|كيما/.test(out), out);
});

test('Darija details are converted to MSA when MSA is requested', () => {
  const out = composeLetter(
    normalizeRequest({ ...base, language: 'ar-msa', details: 'نحبك بزاف وما نعرفش نعيش بلا بيك' }),
  );
  assert.ok(!/بزاف/.test(out), out);
  assert.ok(out.includes('أحبك'), out);
});

test('MSA details are converted to Darija when Darija is requested', () => {
  const out = composeLetter(normalizeRequest({ ...base, language: 'ar-dz', details: 'أحبك كثيرا' }));
  assert.ok(/نحبك|بزاف/.test(out), out);
});

test('what_to_say returns the four required parts', () => {
  const out = composeWhatToSay(
    normalizeRequest({ task: 'what_to_say', situation: 'هي غاضبة مني ولا أعرف ماذا أقول' }),
  );
  assert.ok(out.message.length > 20);
  assert.ok(out.opener.length > 5);
  assert.ok(out.avoid.length > 5);
  assert.ok(out.alternative.length > 20);
  assert.notEqual(out.message, out.alternative);
});

test('intent detection covers the documented cases', () => {
  assert.equal(detectIntent('هي غاضبة مني'), 'apology');
  assert.equal(detectIntent('اشتقت لها كثيرا'), 'missing');
  assert.equal(detectIntent('عندي امتحان وهي حزينة'), 'encouragement');
  assert.equal(detectIntent('elle est fâchée contre moi'), 'apology');
  assert.equal(detectIntent('quelque chose de banal'), 'support');
});

test('refine: shorter really is shorter and keeps the meaning', () => {
  const original = composeLetter(
    normalizeRequest({ ...base, length: 'long', intensity: 5, feelings: ['love', 'gratitude'] }),
  );
  const shorter = refineText(
    normalizeRequest({ task: 'refine', action: 'shorter', currentText: original, ...base }),
  );
  assert.ok(words(shorter) < words(original), `${words(shorter)} vs ${words(original)}`);
  assert.ok(shorter.includes('أيامي أجمل'), `user detail lost: ${shorter}`);
});

test('refine: longer really is longer', () => {
  const original = composeLetter(normalizeRequest({ ...base, length: 'short' }));
  const longer = refineText(normalizeRequest({ task: 'refine', action: 'longer', currentText: original, ...base }));
  assert.ok(words(longer) > words(original), `${words(longer)} vs ${words(original)}`);
});

test('refine: every tone action changes the text', () => {
  const original = composeLetter(normalizeRequest(base));
  for (const action of ['romantic', 'spontaneous', 'elegant', 'impactful', 'funny', 'mature']) {
    const out = refineText(normalizeRequest({ task: 'refine', action, currentText: original, ...base }));
    assert.notEqual(out, original, `${action} did not change anything`);
    assert.ok(out.length > 20);
  }
});

test('translate offline regenerates from the stored request', () => {
  const out = localTranslate(normalizeRequest({ ...base, task: 'refine', action: 'translate', targetLanguage: 'fr' }));
  assert.equal(out.unsupported, undefined);
  assert.ok(/[a-zà-ÿ]/i.test(out.text), out.text);
});

test('translate refuses when there is nothing to translate from', () => {
  const out = localTranslate(normalizeRequest({ task: 'refine', action: 'translate', targetLanguage: 'en' }));
  assert.equal(out.unsupported, true);
});

test('speak task turns raw words into a letter keeping the meaning', () => {
  const out = localGenerate(
    normalizeRequest({
      task: 'speak',
      language: 'ar-dz',
      rawSpeech: 'أنا زعلان منها بصح ما نحبش نخسرها ونحب نصلح الأمور',
    }),
  );
  assert.ok(out.text.length > 40);
  assert.ok(/نصلح|نخسر|زعلان/.test(out.text), out.text);
});

/* ------------------------------------------------- the LLM contract (§24) */

import { buildPrompt, SYSTEM_PROMPT } from '../shared/ai/prompt.js';
import { modelInput } from '../shared/ai/schema.js';

test('the system prompt enforces every writing rule from the spec', () => {
  for (const rule of [
    'at most twice', // name is not repeated
    'NEVER invent a memory', // no fabricated details
    'Respect the requested emotion intensity exactly',
    'Respect the requested length',
    'Avoid clichés',
    'Match the occasion',
    "Respect the other person's boundaries",
    'No pressure, no guilt-tripping',
    'Algerian Arabic (Darija)',
    'Return ONLY the letter text',
  ]) {
    assert.ok(SYSTEM_PROMPT.includes(rule), `rule missing from the system prompt: ${rule}`);
  }
});

test('the prompt carries every field the model needs', () => {
  const req = normalizeRequest({
    ...base,
    nickname: 'سوسو',
    trait: 'تحب الضحك',
    memory: 'أول لقاء في المدرسة',
    feelings: ['gratitude', 'love'],
  });
  const { system, user } = buildPrompt(req);
  assert.ok(system.length > 500);
  const payload = JSON.parse(user.slice(user.indexOf('{')));
  assert.equal(payload.person_name, 'سارة');
  assert.equal(payload.nickname, 'سوسو');
  assert.equal(payload.special_trait, 'تحب الضحك');
  assert.equal(payload.shared_memory, 'أول لقاء في المدرسة');
  assert.equal(payload.mention_name, true);
  assert.equal(payload.feelings.length, 2);
  assert.match(payload.length, /^\d+-\d+ words$/);
  assert.ok(payload.intensity.includes('romantic'), payload.intensity);
});

test('mention_name is false when the user opts out', () => {
  const payload = modelInput(normalizeRequest({ ...base, mentionName: false }));
  assert.equal(payload.mention_name, false);
});

test('the what_to_say task asks for the four JSON fields', () => {
  const { user } = buildPrompt(normalizeRequest({ task: 'what_to_say', situation: 'test' }));
  for (const key of ['"message"', '"opener"', '"avoid"', '"alternative"']) {
    assert.ok(user.includes(key), `missing ${key}`);
  }
});

test('the refine task passes the current text and the action', () => {
  const { user } = buildPrompt(
    normalizeRequest({ task: 'refine', action: 'romantic', currentText: 'مرحبا', ...base }),
  );
  assert.ok(user.includes('مرحبا'));
  assert.ok(user.includes('romantic'));
});

test('the generated opening never echoes the user’s own words back', () => {
  const out = composeLetter(
    normalizeRequest({
      task: 'letter',
      personName: 'Amine',
      occasion: 'apology',
      feelings: ['apology'],
      intensity: 3,
      length: 'short',
      language: 'en',
      details: 'I was wrong and I want to fix it',
    }),
  );
  const occurrences = out.toLowerCase().split('i was wrong').length - 1;
  assert.equal(occurrences, 1, `the user's sentence was repeated:\n${out}`);
});
