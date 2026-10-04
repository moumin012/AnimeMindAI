/**
 * Normalisation + validation of everything the app sends to the AI layer.
 * Both the browser and the Node server run this, so the server never trusts
 * raw client input and the offline engine sees exactly the same shape.
 */
import {
  FEELINGS,
  INTENSITY,
  LANGUAGES,
  LENGTHS,
  OCCASIONS,
  RECIPIENTS,
  STYLES,
  byId,
  idsOf,
} from './catalog.js';

export const TASKS = ['letter', 'speak', 'what_to_say', 'refine'];

export const MAX_TEXT = 4000;
export const MAX_NAME = 60;
export const MAX_SHORT = 300;

export function emptyRequest() {
  return {
    task: 'letter',
    personName: '',
    mentionName: true,
    nickname: '',
    trait: '',
    memory: '',
    recipient: 'love',
    occasion: 'none',
    feelings: ['love'],
    style: 'spontaneous',
    intensity: 3,
    length: 'medium',
    language: 'ar-msa',
    details: '',
    /** raw speech for the "turn my words into a letter" feature */
    rawSpeech: '',
    /** situation for the "what should I say?" feature */
    situation: '',
    /** current text + action, for refine / rewrite / shorten / lengthen / translate */
    currentText: '',
    action: '',
    /** target language for the translate action */
    targetLanguage: '',
    /** bump to force a different result from the same inputs */
    variant: 0,
    /** "personalize it more ✨": use every personal detail available */
    customized: false,
  };
}

const clean = (value, max) =>
  String(value ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .replace(/[ \t\u00a0]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);

const oneOf = (list, value, fallback) => (idsOf(list).includes(value) ? value : fallback);

/** @returns {object} a safe, fully-typed request */
export function normalizeRequest(input = {}) {
  const feelings = Array.isArray(input.feelings)
    ? [...new Set(input.feelings.filter((f) => idsOf(FEELINGS).includes(f)))]
    : [];

  return {
    task: TASKS.includes(input.task) ? input.task : 'letter',
    personName: clean(input.personName, MAX_NAME),
    mentionName: input.mentionName !== false,
    nickname: clean(input.nickname, MAX_SHORT),
    trait: clean(input.trait, MAX_SHORT),
    memory: clean(input.memory, MAX_SHORT),
    recipient: oneOf(RECIPIENTS, input.recipient, 'love'),
    occasion: oneOf(OCCASIONS, input.occasion, 'none'),
    feelings: feelings.length ? feelings : ['love'],
    style: oneOf(STYLES, input.style, 'spontaneous'),
    intensity: Math.min(5, Math.max(1, Number(input.intensity) || 3)),
    length: oneOf(LENGTHS, input.length, 'medium'),
    language: oneOf(LANGUAGES, input.language, 'ar-msa'),
    details: clean(input.details, MAX_TEXT),
    rawSpeech: clean(input.rawSpeech, MAX_TEXT),
    situation: clean(input.situation, MAX_TEXT),
    currentText: clean(input.currentText, MAX_TEXT),
    action: clean(input.action, 40),
    targetLanguage: oneOf(LANGUAGES, input.targetLanguage, input.language || 'ar-msa'),
    variant: Math.min(999, Math.max(0, Number(input.variant) || 0)),
    customized: input.customized === true,
  };
}

/** Does this request carry enough for the AI to do something meaningful? */
export function requestProblems(req) {
  const problems = [];
  if (req.task === 'speak' && !req.rawSpeech) problems.push('rawSpeech');
  if (req.task === 'what_to_say' && !req.situation) problems.push('situation');
  if (req.task === 'refine' && !req.currentText) problems.push('currentText');
  if (req.task === 'letter' && !req.details && !req.memory && !req.trait && !req.nickname && req.occasion === 'none') {
    problems.push('details');
  }
  return problems;
}

/**
 * The compact JSON contract handed to a real LLM. Anything the model does not
 * need (UI-only flags) is dropped here.
 */
export function modelInput(req) {
  return {
    task: req.task,
    recipient: byId(RECIPIENTS, req.recipient)?.hint,
    occasion: byId(OCCASIONS, req.occasion)?.hint,
    feelings: req.feelings.map((f) => byId(FEELINGS, f)?.hint).filter(Boolean),
    style: byId(STYLES, req.style)?.hint,
    intensity: byId(INTENSITY, req.intensity)?.hint,
    length: (() => {
      const l = byId(LENGTHS, req.length);
      return l ? `${l.words[0]}-${l.words[1]} words` : '55-95 words';
    })(),
    language: byId(LANGUAGES, req.language)?.en,
    target_language: byId(LANGUAGES, req.targetLanguage)?.en,
    mention_name: req.mentionName && !!req.personName,
    person_name: req.personName,
    nickname: req.nickname,
    special_trait: req.trait,
    shared_memory: req.memory,
    user_details: req.details,
    raw_speech: req.rawSpeech,
    situation: req.situation,
    current_text: req.currentText,
    refine_action: req.action,
    personalize_deeply: req.customized,
  };
}
