/**
 * The offline AI engine.
 *
 * It is the fallback used when no LLM key is configured (and when the browser
 * is offline), but it is not a random-text generator: it composes from the
 * user's own details, obeys occasion / feelings / style / intensity / length /
 * language, never invents a memory, and keeps the user's meaning intact.
 *
 * The whole module is plain ESM with no Node APIs, so the exact same file is
 * imported by the Express server and by the React bundle.
 */
import { BANKS, getBank } from './banks.js';
import { byId, FEELINGS, LENGTHS } from './catalog.js';
import { looksLikeDarija, toRegister } from './dialect.js';

/* ------------------------------------------------------------------ utils */

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic seed: same inputs + same variant ⇒ same letter. */
function seedFor(req) {
  const sig = [
    req.task,
    req.personName,
    req.nickname,
    req.trait,
    req.memory,
    req.recipient,
    req.occasion,
    req.feelings.join(','),
    req.style,
    req.intensity,
    req.length,
    req.language,
    req.details,
    req.rawSpeech,
    req.situation,
    req.action,
    req.targetLanguage,
    req.variant,
  ].join('|');
  return hashString(sig);
}

const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length) % arr.length];

const shuffle = (arr, rnd) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const inRange = (range, level) => level >= range[0] && level <= range[1];

export const countWords = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length;

const splitSentences = (text) =>
  String(text || '')
    .split(/(?<=[.!؟…])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

const joinSentences = (list) => list.join(' ');

const endPunct = (s, mark = '.') => (/[.!؟…]$/.test(s) ? s : `${s}${mark}`);

const tidy = (s) => s.replace(/\s+/g, ' ').replace(/\s+([،.!?])/g, '$1').trim();

/* ------------------------------------------------- user text normalisation */

/** Removes the filler people type before saying the real thing. */
const FILLERS_AR = /^(بصراحة|والله|يعني|بصفتي|في الحقيقة|هكذا|انا|أنا|انني|أنني|هو انها)\s*[،,:]?\s*/;

/* Third → second person for French and English.
 * Users describe the person ("she makes my days better"); a letter must address
 * them ("you make my days better"), verb agreement included. */

const EN_THIRD_PERSON = {
  is: 'are', has: 'have', does: 'do', goes: 'go', says: 'say', makes: 'make', takes: 'take',
  gives: 'give', knows: 'know', thinks: 'think', sees: 'see', comes: 'come', gets: 'get',
  lets: 'let', puts: 'put', keeps: 'keep', feels: 'feel', leaves: 'leave', means: 'mean',
  tells: 'tell', finds: 'find', shows: 'show', helps: 'help', brings: 'bring', wants: 'want',
  needs: 'need', likes: 'like', loves: 'love', laughs: 'laugh', smiles: 'smile', tries: 'try',
  cries: 'cry', carries: 'carry', worries: 'worry', studies: 'study', replies: 'reply',
  enjoys: 'enjoy', turns: 'turn', holds: 'hold', stays: 'stay', lives: 'live',
};

const enSecondPersonVerb = (verb) => {
  const lower = verb.toLowerCase();
  if (EN_THIRD_PERSON[lower]) return EN_THIRD_PERSON[lower];
  if (lower.endsWith('ies')) return `${lower.slice(0, -3)}y`;
  if (/(s|sh|ch|x|z)es$/.test(lower)) return lower.slice(0, -2);
  if (lower.endsWith('s')) return lower.slice(0, -1);
  return verb;
};

function secondPersonEn(text) {
  return text
    .replace(/\b(she|he)'s\b/gi, "you're")
    .replace(/\b(she|he)\s+([a-z']+)\b/gi, (_m, _p, verb) => `you ${enSecondPersonVerb(verb)}`)
    .replace(/\bher\s+(?=[a-z])/gi, 'your ')
    .replace(/\b(his|her|him|she|he)\b/gi, (m) => (m.toLowerCase() === 'his' || m.toLowerCase() === 'her' ? 'your' : 'you'))
    .replace(/\b(herself|himself)\b/gi, 'yourself');
}

const FR_THIRD_PERSON = {
  est: 'es', a: 'as', fait: 'fais', va: 'vas', vient: 'viens', dit: 'dis', peut: 'peux',
  veut: 'veux', sait: 'sais', voit: 'vois', prend: 'prends', met: 'mets', doit: 'dois',
  rit: 'ris', sourit: 'souris', rend: 'rends', donne: 'donnes', parle: 'parles', aime: 'aimes',
  trouve: 'trouves', pense: 'penses', connaît: 'connais', comprend: 'comprends', attend: 'attends',
  aide: 'aides', reste: 'restes', devient: 'deviens', sent: 'sens', tient: 'tiens', écrit: 'écris',
  lit: 'lis', suit: 'suis', ouvre: 'ouvres', offre: 'offres', laisse: 'laisses', montre: 'montres',
  apporte: 'apportes', change: 'changes', compte: 'comptes', manque: 'manques', éclaire: 'éclaires',
  embellis: 'embellis', suffit: 'suffis', plaît: 'plais', rassure: 'rassures', apaise: 'apaises',
};

const frSecondPersonVerb = (verb) => {
  const lower = verb.toLowerCase();
  if (FR_THIRD_PERSON[lower]) return FR_THIRD_PERSON[lower];
  if (/e$/.test(lower) && lower.length > 3) return `${lower.slice(0, -1)}s`;
  if (/(a|i|u|s|t|d|c|l|r|n|m)$/.test(lower)) return `${lower}s`;
  return verb;
};

function secondPersonFr(text) {
  return text
    .replace(/\b(elle|il)\s+([a-zà-ÿ']+)\b/gi, (_m, _p, verb) => `tu ${frSecondPersonVerb(verb)}`)
    .replace(/\bsa\s+(?=[a-zà-ÿ])/gi, 'ta ')
    .replace(/\bson\s+(?=[a-zà-ÿ])/gi, 'ton ')
    .replace(/\bses\s+(?=[a-zà-ÿ])/gi, 'tes ')
    .replace(/\b(elle|il)\b/gi, 'tu')
    .replace(/\blui\b/gi, 'te');
}

/**
 * Users usually describe the person in the third person ("وجودها يجعل أيامي
 * أجمل"). A letter must address them directly ("وجودك...").
 */
const THIRD_TO_SECOND_AR = [  ['وجودها', 'وجودك'], ['وجوده', 'وجودك'],
  ['صوتها', 'صوتك'], ['صوته', 'صوتك'],
  ['ضحكتها', 'ضحكتك'], ['ضحكته', 'ضحكتك'],
  ['كلامها', 'كلامك'], ['كلامه', 'كلامك'],
  ['حضورها', 'حضورك'], ['حضوره', 'حضورك'],
  ['قلبها', 'قلبك'], ['قلبه', 'قلبك'],
  ['حياتها', 'حياتك'], ['حياته', 'حياتك'],
  ['وجهها', 'وجهك'], ['وجهه', 'وجهك'],
  ['اسمها', 'اسمك'], ['اسمه', 'اسمك'],
  ['طريقتها', 'طريقتك'], ['طريقته', 'طريقتك'],
  ['عيونها', 'عيونك'], ['عيونه', 'عيونك'],
  ['بها', 'بك'], ['به', 'بك'],
  ['لها', 'لك'], ['له', 'لك'],
  ['معها', 'معك'], ['معه', 'معك'],
  ['عنها', 'عنك'], ['عنه', 'عنك'],
  ['منها', 'منك'], ['منه', 'منك'],
  ['عليها', 'عليك'], ['عليه', 'عليك'],
  ['فيها', 'فيك'], ['فيه', 'فيك'],
  ['إليها', 'إليك'], ['إليه', 'إليك'],
  ['عندها', 'عندك'], ['عنده', 'عندك'],
  ['حولها', 'حولك'], ['حوله', 'حولك'],
  ['هي', 'أنت'], ['هو', 'أنت'],
];

const AR_PUNCT = '\\s،؛:.!?';

function secondPerson(text, lang) {
  if (!text) return text;
  if (lang === 'fr') return secondPersonFr(text);
  if (lang === 'en') return secondPersonEn(text);
  if (lang !== 'ar-msa' && lang !== 'ar-dz' && lang !== 'ar-fr') return text;
  let out = text;
  for (const [from, to] of THIRD_TO_SECOND_AR) {
    out = out.replace(new RegExp(`(^|[${AR_PUNCT}])${from}(?=$|[${AR_PUNCT}])`, 'g'), `$1${to}`);
  }
  return out;
}

/** Clean what the user typed: keep the meaning, drop the noise. */
function polishUserText(raw, lang) {
  if (!raw) return '';
  const sentences = splitSentences(raw).map((s) => tidy(s.replace(FILLERS_AR, ''))).filter(Boolean);
  const fixed = sentences.map((s) => secondPerson(s, lang)).map((s) => toRegister(s, lang));
  return fixed.map((s) => endPunct(s)).join(' ');
}

/* ------------------------------------------------------------------ compose */

function wordBudget(length, language) {
  const l = byId(LENGTHS, length) || byId(LENGTHS, 'medium');
  const factor = language.startsWith('ar') ? 0.85 : 1;
  return { min: Math.round(l.words[0] * factor), max: Math.round(l.words[1] * factor) };
}

function greetingFor(req, bank, rnd, short) {
  if (req.nickname) return pick(bank.greet.nickname, rnd).replace('{nickname}', req.nickname);
  if (req.personName && req.mentionName) return pick(bank.greet.named, rnd).replace('{name}', req.personName);
  const plain = bank.greet.plain.filter(Boolean);
  return short || !plain.length ? '' : pick(plain, rnd);
}

/**
 * Pick the opening. When the user already said the thing in their own words,
 * the generated opener must not simply repeat it back to them.
 */
function openingFor(req, bank, rnd, checker) {
  const inTone = (list) => list.filter((l) => inRange(l.i, req.intensity));
  const pools = [inTone(bank.opening[req.occasion] || []), inTone(bank.opening.none)].filter((p) => p.length);
  if (!pools.length) return '';
  for (const pool of pools) {
    const shuffled = shuffle(pool, rnd);
    if (!checker) return shuffled[0].t;
    const fresh = shuffled.find((l) => !checker.isRedundant(l.t) && !checker.sameOpener(l.t));
    if (fresh) return fresh.t;
  }
  return pick(pools[0], rnd).t;
}

function feelingLinesFor(req, bank, rnd, count, checker) {
  const out = [];
  const order = shuffle(req.feelings, rnd);
  const pools = order
    .map((f) => shuffle((bank.feelings[f] || []).filter((l) => inRange(l.i, req.intensity)), rnd))
    .filter((p) => p.length);
  if (!pools.length) return out;

  let guard = 0;
  let pi = 0;
  while (out.length < count && guard < 60) {
    guard += 1;
    const pool = pools[pi % pools.length];
    pi += 1;
    const candidate =
      pool.find(
        (l) =>
          !out.includes(l.t) &&
          (!checker || (!checker.isRedundant(l.t) && !checker.sameOpener(l.t))),
      ) ||
      pool.find((l) => !out.includes(l.t) && (!checker || !checker.isRedundant(l.t)));
    if (candidate) {
      out.push(candidate.t);
      checker?.remember(candidate.t);
    }
  }
  return out;
}

function fillTemplate(template, req) {
  return template
    .replace('{name}', req.personName || '')
    .replace('{nickname}', req.nickname || '')
    .replace('{trait}', req.trait || '')
    .replace('{memory}', req.memory || '');
}

function closingFor(req, bank, rnd) {
  const specific = bank.closing[req.occasion];
  if (specific && req.occasion !== 'none') return pick(specific, rnd);
  const tier = req.intensity <= 2 ? 'low' : req.intensity <= 4 ? 'mid' : 'high';
  return pick(bank.closing.generic[tier], rnd);
}

/* Redundancy guard: the same idea must never be said twice in one letter. */
function gramsOf(text, n = 3) {
  const words = String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const size = Math.min(n, words.length);
  const out = new Set();
  if (size < 2) return out;
  for (let i = 0; i + size <= words.length; i += 1) out.add(words.slice(i, i + size).join(' '));
  return out;
}

const firstWord = (text) => String(text).trim().split(/\s+/)[0]?.replace(/[^\p{L}\p{N}]/gu, '') || '';

function makeRedundancyChecker(seedText = '') {
  const seen = new Set(gramsOf(seedText));
  const exact = new Set(
    splitSentences(seedText).map((s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim()),
  );
  const openers = new Set(splitSentences(seedText).map(firstWord));
  return {
    isRedundant(text) {
      const key = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();
      if (!key || exact.has(key)) return true;
      for (const g of gramsOf(text)) if (seen.has(g)) return true;
      return false;
    },
    /** Two sentences in one letter should not start with the same word. */
    sameOpener(text) {
      return openers.has(firstWord(text));
    },
    remember(text) {
      exact.add(text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim());
      openers.add(firstWord(text));
      for (const g of gramsOf(text)) seen.add(g);
    },
  };
}

const GROUP_ORDER = ['open', 'details', 'feel', 'feel2', 'close'];

/**
 * Build the letter body from blocks, respecting the requested length.
 * prio 0 = must appear, 1 = personal details, 2 = optional colour.
 */
function assemble(blocks, budget, groupOf, checker = makeRedundancyChecker()) {
  const kept = [];

  const add = (b) => {
    if (!b.text) return false;
    if (kept.some((k) => k.text === b.text)) return false;
    // blocks already vetted while being picked must not be filtered again
    if (b.prio !== 0 && !b.vetted && checker.isRedundant(b.text)) return false;
    kept.push(b);
    checker.remember(b.text);
    return true;
  };

  const p0 = blocks.filter((b) => b.prio === 0);
  const p1 = blocks.filter((b) => b.prio === 1);
  const p2 = blocks.filter((b) => b.prio === 2);

  p0.forEach(add);
  let words = countWords(kept.map((b) => b.text).join(' '));

  for (const b of [...p1, ...p2]) {
    const w = countWords(b.text);
    if (words + w > budget.max) continue;
    if (add(b)) words += w;
  }

  // still too short → add colour until we reach the minimum
  for (const b of p2) {
    if (words >= budget.min) break;
    if (kept.includes(b)) continue;
    if (add(b)) words += countWords(b.text);
  }

  const groups = new Map();
  for (const b of kept) {
    const g = groupOf(b);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(b.text);
  }
  return GROUP_ORDER.filter((g) => groups.has(g))
    .map((g) => tidy(groups.get(g).join(' ')))
    .join('\n\n');
}

/** Full letter from a structured request. */
export function composeLetter(req, rnd = mulberry32(seedFor(req))) {
  const bank = getBank(req.language);
  const budget = wordBudget(req.length, req.language);
  const short = req.length === 'short';
  // "Personalize it more ✨": keep every detail and turn the emotion up a notch.
  const intensity = req.customized ? Math.max(4, req.intensity) : req.intensity;

  const greeting = greetingFor(req, bank, rnd, short && !req.customized);
  const details = polishUserText(req.details || req.rawSpeech, req.language);
  const detailsBlock = details ? `${pick(bank.detailLead, rnd)} ${details}` : '';
  const memoryBlock = req.memory ? endPunct(fillTemplate(pick(bank.memory, rnd), req)) : '';
  const traitBlock = req.trait ? endPunct(fillTemplate(pick(bank.trait, rnd), req)) : '';
  const personalPrio = req.customized ? 0 : 1;

  // The redundancy guard is seeded with the user's own words first, so no
  // generated sentence (opening included) can simply repeat them back.
  const checker = makeRedundancyChecker([detailsBlock, memoryBlock, traitBlock].join(' '));
  const opening = openingFor({ ...req, intensity }, bank, rnd, checker);
  checker.remember(opening);

  const blocks = [
    { text: [greeting, opening].filter(Boolean).join(' '), prio: 0, group: 'open' },
    { text: detailsBlock, prio: 0, group: 'details' },
    { text: memoryBlock, prio: personalPrio, group: 'details', vetted: true },
    { text: traitBlock, prio: personalPrio, group: 'details', vetted: true },
  ];

  const feelingCount = short ? 1 : req.length === 'medium' ? 2 : 3;
  feelingLinesFor({ ...req, intensity }, bank, rnd, feelingCount, checker).forEach((t) =>
    blocks.push({ text: endPunct(t), prio: 1, group: 'feel', vetted: true }),
  );

  const extra = bank.styleExtra[req.style] || [];
  const extraPool = extra.filter((l) => inRange(l.i, intensity));
  if (extraPool.length && !short) {
    blocks.push({ text: endPunct(pick(extraPool, rnd).t), prio: 2, group: 'feel2' });
  }
  if (bank.sprinkleLines && !short && rnd() < 0.6) {
    blocks.push({ text: endPunct(pick(bank.sprinkleLines, rnd)), prio: 2, group: 'feel2' });
  }
  if (!short) {
    feelingLinesFor({ ...req, intensity }, bank, rnd, 2, checker).forEach((t) =>
      blocks.push({ text: endPunct(t), prio: 2, group: 'feel2', vetted: true }),
    );
  }

  blocks.push({ text: closingFor({ ...req, intensity }, bank, rnd), prio: 0, group: 'close' });

  return enforceNameRule(assemble(blocks, budget, (b) => b.group, checker), req);
}

/** The name appears at most twice, and never when the user opted out. */
function enforceNameRule(text, req) {
  if (!req.personName) return text;
  if (!req.mentionName) return tidy(text.split(req.personName).join(' '));
  const parts = text.split(req.personName);
  if (parts.length <= 3) return text;
  let out = parts[0] + req.personName + parts[1] + req.personName;
  out += parts.slice(2).join('');
  return tidy(out);
}

/* ------------------------------------------------------- "what should I say" */

const INTENTS = [
  { id: 'apology', re: /(غاضب|غاضبة|زعلان|زعلانه|زعلانة|مزعّل|مزعله|خصام|زعل|خطأ|غلط|آسف|fâché|fâchée|dispute|excuse|angry|mad|fight|apolog)/i },
  { id: 'missing', re: /(اشتق|توحش|بعيد|سافر|فراق|manque|éloigné|miss|far away)/i },
  { id: 'confession', re: /(معجب|نحبها|نحبو|أحبها|أحبه|حبيتها|أعترف|crush|plait|confess|like her|like him)/i },
  { id: 'encouragement', re: /(امتحان|مقابلة|عمل|دراسة|مريض|حزين|اكتئاب|فشل|examen|entretien|travail|malade|triste|échec|exam|interview|sad|hard time)/i },
  { id: 'space', re: /(قالت لي ابتعد|طلبت مسافة|تركتني|انفصلنا|ما تبغينيش|space|breakup|broke up|left me|no contact)/i },
];

export function detectIntent(text) {
  const hit = INTENTS.find((i) => i.re.test(text || ''));
  return hit ? hit.id : 'support';
}

export function composeWhatToSay(req, rnd = mulberry32(seedFor(req))) {
  const bank = getBank(req.language);
  const intent = detectIntent(req.situation);

  const occasionMap = {
    apology: 'apology',
    missing: 'missing',
    confession: 'confession',
    encouragement: 'encouragement',
    space: 'reconciliation',
    support: 'none',
  };
  const feelingsMap = {
    apology: ['apology', 'appreciation'],
    missing: ['missing', 'love'],
    confession: ['love', 'admiration'],
    encouragement: ['support', 'pride'],
    space: ['appreciation', 'nostalgia'],
    support: ['support', 'appreciation'],
  };

  const base = {
    ...req,
    occasion: occasionMap[intent] || 'none',
    feelings: feelingsMap[intent] || ['support'],
    length: 'short',
  };

  const message = composeLetter(base, mulberry32(seedFor({ ...base, variant: (req.variant || 0) + 11 })));
  const alternative = composeLetter(
    { ...base, style: base.style === 'mature' ? 'deep' : 'mature', intensity: Math.max(1, base.intensity - 1) },
    mulberry32(seedFor({ ...base, style: 'deep', variant: (req.variant || 0) + 37 })),
  );

  const contextNote =
    intent === 'space'
      ? req.language.startsWith('ar')
        ? 'ملاحظة: إن كان الطرف الآخر طلب مساحة، فالأفضل احترام طلبه وعدم الإلحاح.'
        : 'Note: if they asked for space, the kindest move is to respect it and not insist.'
      : '';

  const opener = pick(bank.whatToSay.openers, rnd);
  const avoid = pick(bank.whatToSay.avoid, rnd);

  // A chat message reads better as one flowing paragraph than as a letter.
  const asMessage = (text) => text.split(/\n{2,}/).map((p) => p.trim()).join(' ');

  return {
    message: asMessage(message),
    opener,
    avoid,
    alternative: asMessage(alternative),
    note: contextNote,
    intent,
  };
}

/* ------------------------------------------------------------------- refine */

const TONE_LINES = {
  'ar-msa': {
    romantic: ['معك صرت أعرف معنى أن يكون لليوم طعم مختلف.', 'لا أحتاج سببًا لأحبك، يكفي أنك أنت.'],
    spontaneous: ['بصراحة لم أخطط لهذا الكلام، خرج كما هو.', 'أكتب لك وأنا أبتسم، هكذا ببساطة.'],
    elegant: ['أترك لك هذه الكلمات لأنها أصدق ما أملك.', 'ما أردت قوله يستحق أن يُقال بهدوء وبوضوح.'],
    impactful: ['هناك أشياء لا تُنسى، وأنت منها.', 'لو سألتني عن أجمل ما حدث لي، سأقول: أنك مررت من هنا.'],
    funny: ['أعدك ألا أطيل، فأنا أعرف أنك تقرأ وأنا أعرف أنني أتكلم كثيرًا.', 'لو كان للكلام وزن لكانت هذه الرسالة أثقل من هاتفي.'],
    mature: ['لن أطلب شيئًا، ولن أستعجل شيئًا.', 'ما بيننا يستحق الصدق أكثر مما يستحق الكلام الجميل.'],
  },
  'ar-dz': {
    romantic: ['معاك ولّيت نعرف معنى بلي للنهار طعم آخر.', 'ما نحتاش سبب باش نحبك، يكفي بلي راك أنت.'],
    spontaneous: ['بصراحة ما خطّطتش لها الكلام، خرج كيما هو.', 'نكتبلك وأنا نبتسم، هكاك ببساطة.'],
    elegant: ['نخلي لك ها الكلمات لأنها أصدق حاجة عندي.', 'اللي حبيت نقولو يستاهل يتقال بهدوء وبوضوح.'],
    impactful: ['كاين حاجات ما يتنساوش، وأنت واحدة منهم.', 'لو تسقسيني على أحلى حاجة صارتلي، نقول: بلي راك دزت في حياتي.'],
    funny: ['نعدك ما نطولش، نعرف بلي راك تقرا وأنا نعرف بلي نهضر بزاف.', 'لو كان للكلام وزن، ها الرسالة تكون تقيلة من التيليفون تاعي.'],
    mature: ['ما راحش نطلب والو، وما راحش نستعجل والو.', 'اللي بيناتنا يستاهل الصدق أكثر من الكلام الزوين.'],
  },
  fr: {
    romantic: ['Avec toi, j’ai découvert qu’une journée peut avoir un autre goût.', 'Je n’ai pas besoin de raison pour t’aimer, il suffit que ce soit toi.'],
    spontaneous: ['Franchement, je n’avais rien préparé, c’est sorti comme ça.', 'Je t’écris en souriant, tout simplement.'],
    elegant: ['Je te laisse ces mots parce qu’ils sont ce que j’ai de plus sincère.', 'Ce que je veux dire mérite d’être dit calmement et clairement.'],
    impactful: ['Il y a des choses qu’on n’oublie pas, et tu en fais partie.', 'Si tu me demandais la plus belle chose qui me soit arrivée, je dirais toi.'],
    funny: ['Je promets de faire court, je sais que tu lis et que je parle trop.', 'Si les mots pesaient quelque chose, ce message serait plus lourd que mon téléphone.'],
    mature: ['Je ne demande rien et je ne presse rien.', 'Ce qu’il y a entre nous mérite plus d’honnêteté que de belles phrases.'],
  },
  en: {
    romantic: ['With you I learned that a day can taste different.', 'I don’t need a reason to love you, it’s enough that it’s you.'],
    spontaneous: ['Honestly, I didn’t plan any of this, it just came out.', 'I’m writing this while smiling, that’s all.'],
    elegant: ['I’m leaving you these words because they’re the most honest thing I have.', 'What I want to say deserves to be said calmly and clearly.'],
    impactful: ['Some things you never forget, and you’re one of them.', 'If you asked me the best thing that happened to me, I’d say you did.'],
    funny: ['I promise to keep it short, I know you’re reading and I know I talk too much.', 'If words had weight, this message would be heavier than my phone.'],
    mature: ['I’m not asking for anything, and I’m not rushing anything.', 'What we have deserves honesty more than it deserves pretty sentences.'],
  },
};

/** Light register shifts per tone. Kept small on purpose: safe, visible, honest. */
const TONE_SWAPS = {
  'ar-msa': {
    elegant: [['كثيرًا', 'بعمق'], ['حاجة', 'أمر'], ['بصراحة', 'بصدق']],
    spontaneous: [['أردت أن أقول لك', 'حبيت أقولك'], ['لذلك', 'يعني'], ['أريد', 'أحب']],
    mature: [['جدا', ''], ['حقا', ''], ['كثيرا', '']],
    romantic: [['أحب', 'أحمل من الحب لـ'], ['جميل', 'دافئ']],
    impactful: [['أظن', 'أعرف'], ['ربما', '']],
    funny: [['أعتذر', 'آسف']],
  },
  'ar-dz': {
    elegant: [['بزاف', 'كثير'], ['حاجة', 'أمر']],
    spontaneous: [['أردت', 'حبيت'], ['لذلك', 'يعني']],
    mature: [['بزاف', ''], ['بصراحة', '']],
    romantic: [['نحب', 'نحمل من الحب لـ']],
    impactful: [['نظن', 'نعرف']],
    funny: [['نعتذر', 'سمحلي']],
  },
  fr: {
    elegant: [['beaucoup', 'profondément'], ['truc', 'chose'], ['franchement', 'sincèrement']],
    spontaneous: [['je voulais te dire', 'je te dis direct'], ['donc', 'enfin']],
    mature: [['vraiment', ''], ['tellement', '']],
    romantic: [['j’aime', 'je tiens à'], ['bien', 'doux']],
    impactful: [['je pense', 'je sais'], ['peut-être', '']],
    funny: [['je m’excuse', 'pardon']],
  },
  en: {
    elegant: [['a lot', 'deeply'], ['thing', 'detail'], ['honestly', 'sincerely']],
    spontaneous: [['I wanted to tell you', 'let me just say'], ['therefore', 'so']],
    mature: [['really', ''], ['so much', '']],
    romantic: [['I like', 'I care for'], ['nice', 'warm']],
    impactful: [['I think', 'I know'], ['maybe', '']],
    funny: [['I apologize', 'I’m sorry']],
  },
};

const SHORT_ACTIONS = ['shorter'];
const LONG_ACTIONS = ['longer'];

function applySwaps(text, lang, tone) {
  const table = TONE_SWAPS[lang === 'ar-fr' ? 'ar-dz' : lang]?.[tone];
  if (!table) return text;
  let out = text;
  for (const [from, to] of table) {
    out = out.replace(new RegExp(escape(from), 'gi'), to);
  }
  return out.replace(/\s{2,}/g, ' ').replace(/\s+([،.!?])/g, '$1').trim();
}

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toneLines(lang, tone) {
  return TONE_LINES[lang === 'ar-fr' ? 'ar-dz' : lang]?.[tone] || TONE_LINES['ar-msa'][tone] || [];
}

/** Rewrite an existing letter: shorter / longer / a tone change. */
export function refineText(req, rnd = mulberry32(seedFor(req))) {
  const bank = getBank(req.language);
  const tone = req.action;
  const sentences = splitSentences(req.currentText);
  const budget = wordBudget(req.length, req.language);

  if (SHORT_ACTIONS.includes(tone)) {
    const target = Math.max(20, Math.round(countWords(req.currentText) * 0.55));
    const keywords = new Set(
      [req.details, req.memory, req.trait, req.personName, req.nickname]
        .filter(Boolean)
        .join(' ')
        .split(/\s+/)
        .map((w) => w.replace(/[^\p{L}]/gu, ''))
        .filter((w) => w.length > 2),
    );
    const scored = sentences.map((s, i) => {
      let score = 0;
      if (i === 0) score += 3;
      if (i === sentences.length - 1) score += 3;
      const words = s.split(/\s+/);
      const hits = words.filter((w) => keywords.has(w.replace(/[^\p{L}]/gu, ''))).length;
      score += hits * 2;
      if (req.personName && s.includes(req.personName)) score += 2;
      return { s, i, score };
    });
    const chosen = [];
    let words = 0;
    for (const item of [...scored].sort((a, b) => b.score - a.score || a.i - b.i)) {
      const w = countWords(item.s);
      if (words + w > target && chosen.length >= 2) continue;
      chosen.push(item);
      words += w;
    }
    return enforceNameRule(
      chosen
        .sort((a, b) => a.i - b.i)
        .map((x) => x.s)
        .join(' '),
      req,
    );
  }

  if (LONG_ACTIONS.includes(tone)) {
    const extras = feelingLinesFor(
      { ...req, intensity: req.intensity },
      bank,
      mulberry32(seedFor({ ...req, variant: (req.variant || 0) + 5 })),
      req.length === 'long' ? 3 : 2,
    );
    const fresh = extras.filter((t) => !req.currentText.includes(t.slice(0, 12)));
    const head = sentences.slice(0, -1);
    const tail = sentences.slice(-1);
    const out = [...head, ...fresh.map(endPunct), ...tail].join(' ');
    return enforceNameRule(out.length > 0 ? out : `${req.currentText} ${fresh.map(endPunct).join(' ')}`, req);
  }

  // tone change: swap register, then add one tone-appropriate sentence
  let out = applySwaps(req.currentText, req.language, tone);
  const pool = toneLines(req.language, tone).filter((t) => !out.includes(t.slice(0, 10)));
  if (pool.length) {
    const added = endPunct(pick(pool, rnd));
    const parts = splitSentences(out);
    const insertAt = Math.max(1, parts.length - 1);
    parts.splice(insertAt, 0, added);
    out = parts.join(' ');
  }
  if (tone === 'mature') out = out.replace(/!+/g, '.');
  return enforceNameRule(out, req);
}

/* ------------------------------------------------------------------ dispatch */

/**
 * @param {object} req normalised request
 * @returns {{ text:string }|{ message:string, opener:string, avoid:string, alternative:string, note?:string }}
 */
export function localGenerate(req) {
  const rnd = mulberry32(seedFor(req));
  switch (req.task) {
    case 'what_to_say':
      return { ...composeWhatToSay(req, rnd), provider: 'local' };
    case 'refine':
      return { text: refineText(req, rnd), provider: 'local' };
    case 'speak': {
      // "Turn my words into a letter": reuse the structure, but the user's own
      // speech becomes the core of the letter.
      const speech = polishUserText(req.rawSpeech, req.language);
      const letter = composeLetter({ ...req, details: speech }, rnd);
      return { text: letter, provider: 'local' };
    }
    case 'letter':
    default:
      return { text: composeLetter(req, rnd), provider: 'local' };
  }
}

/** Re-generate the same letter in another language (offline translation). */
export function localTranslate(req) {
  if (!req.details && !req.memory && !req.trait && !req.rawSpeech) {
    return { unsupported: true, provider: 'local' };
  }
  const translated = composeLetter(
    { ...req, language: req.targetLanguage, length: req.length },
    mulberry32(seedFor({ ...req, language: req.targetLanguage })),
  );
  return { text: translated, provider: 'local' };
}

export const availableLanguages = () => Object.keys(BANKS);
