/**
 * رسـالتي | Resalti — Shared catalog of every option the user can pick.
 *
 * This file is imported by BOTH the React frontend (to render the form and the
 * UI labels) and the AI layer (to understand what each id means when building a
 * prompt or composing text locally). Keeping it in one place guarantees the UI
 * and the AI never drift apart.
 *
 * Every option carries an `ar` / `fr` / `en` label plus a `hint` that is only
 * sent to the model (never shown as UI copy).
 */

export const RECIPIENTS = [
  { id: 'love', ar: 'شخص أحبه', fr: "Quelqu'un que j'aime", en: 'Someone I love', hint: 'a person the user loves, relationship not officially stated' },
  { id: 'crush', ar: 'شخص معجب به', fr: 'Une personne qui me plaît', en: 'Someone I have a crush on', hint: 'a crush, feelings not yet confessed' },
  { id: 'partner', ar: 'حبيب / حبيبة', fr: 'Mon / ma partenaire', en: 'My boyfriend / girlfriend', hint: 'a current romantic partner' },
  { id: 'spouse', ar: 'زوج / زوجة', fr: 'Mon époux / mon épouse', en: 'My husband / wife', hint: 'a spouse' },
  { id: 'friend', ar: 'صديق / صديقة', fr: 'Un(e) ami(e)', en: 'A friend', hint: 'a close friend, strictly platonic' },
  { id: 'apology', ar: 'شخص أريد الاعتذار منه', fr: 'Une personne à qui je veux m’excuser', en: 'Someone I want to apologize to', hint: 'a person the user hurt and wants to apologize to' },
  { id: 'miss', ar: 'شخص أفتقده', fr: 'Une personne qui me manque', en: 'Someone I miss', hint: 'a person the user misses, physically distant or out of touch' },
  { id: 'cheer', ar: 'شخص أريد تشجيعه', fr: 'Une personne que je veux encourager', en: 'Someone I want to encourage', hint: 'a person going through something hard who needs support' },
];

export const OCCASIONS = [
  { id: 'none', ar: 'بدون مناسبة', fr: 'Sans occasion', en: 'No occasion', hint: 'no special occasion, just feelings the user wants to express' },
  { id: 'birthday', ar: 'عيد ميلاد', fr: 'Anniversaire', en: 'Birthday', hint: "it is the recipient's birthday" },
  { id: 'confession', ar: 'اعتراف بالمشاعر', fr: 'Déclaration', en: 'Confession', hint: 'the user is confessing feelings for the first time' },
  { id: 'love_letter', ar: 'رسالة حب', fr: "Lettre d'amour", en: 'Love letter', hint: 'a love letter' },
  { id: 'missing', ar: 'اشتياق', fr: 'Manque', en: 'Missing them', hint: 'the user misses the recipient' },
  { id: 'apology', ar: 'اعتذار', fr: 'Excuses', en: 'Apology', hint: 'the user is apologizing' },
  { id: 'reconciliation', ar: 'مصالحة', fr: 'Réconciliation', en: 'Reconciliation', hint: 'there was a fight and the user wants to make peace' },
  { id: 'congrats', ar: 'تهنئة', fr: 'Félicitations', en: 'Congratulations', hint: 'congratulating the recipient on something they achieved' },
  { id: 'encouragement', ar: 'تشجيع', fr: 'Encouragement', en: 'Encouragement', hint: 'the recipient needs encouragement' },
  { id: 'morning', ar: 'رسالة صباحية', fr: 'Message du matin', en: 'Good morning', hint: 'a good-morning message' },
  { id: 'goodnight', ar: 'رسالة قبل النوم', fr: 'Message du soir', en: 'Good night', hint: 'a good-night message' },
  { id: 'special', ar: 'مناسبة خاصة', fr: 'Occasion spéciale', en: 'Special occasion', hint: 'a special occasion the user will describe in the details' },
];

export const FEELINGS = [
  { id: 'love', ar: 'الحب', fr: 'Amour', en: 'Love', hint: 'love' },
  { id: 'admiration', ar: 'الإعجاب', fr: 'Admiration', en: 'Admiration', hint: 'admiration / being impressed' },
  { id: 'missing', ar: 'الاشتياق', fr: 'Manque', en: 'Missing', hint: 'missing them' },
  { id: 'gratitude', ar: 'الامتنان', fr: 'Gratitude', en: 'Gratitude', hint: 'gratitude' },
  { id: 'apology', ar: 'الاعتذار', fr: 'Regret', en: 'Apology', hint: 'regret and apology' },
  { id: 'nostalgia', ar: 'الحنين', fr: 'Nostalgie', en: 'Nostalgia', hint: 'nostalgia' },
  { id: 'happiness', ar: 'السعادة', fr: 'Joie', en: 'Happiness', hint: 'happiness' },
  { id: 'fear_of_loss', ar: 'الخوف من الفراق', fr: 'Peur de perdre', en: 'Fear of losing them', hint: 'fear of losing them, expressed gently and without pressure' },
  { id: 'appreciation', ar: 'التقدير', fr: 'Estime', en: 'Appreciation', hint: 'appreciation / valuing them' },
  { id: 'pride', ar: 'الفخر', fr: 'Fierté', en: 'Pride', hint: 'pride in them' },
  { id: 'support', ar: 'الدعم', fr: 'Soutien', en: 'Support', hint: 'support and being there for them' },
];

export const STYLES = [
  { id: 'spontaneous', ar: 'عفوي', fr: 'Spontané', en: 'Spontaneous', hint: 'spontaneous, like a voice note written down' },
  { id: 'romantic', ar: 'رومانسي', fr: 'Romantique', en: 'Romantic', hint: 'romantic and warm' },
  { id: 'cute', ar: 'لطيف', fr: 'Mignon', en: 'Cute', hint: 'sweet and light, gentle' },
  { id: 'deep', ar: 'عميق', fr: 'Profond', en: 'Deep', hint: 'deep and sincere, thoughtful' },
  { id: 'poetic', ar: 'شاعري', fr: 'Poétique', en: 'Poetic', hint: 'poetic, with light imagery — never overwrought' },
  { id: 'funny', ar: 'مضحك ولطيف', fr: 'Drôle et doux', en: 'Funny & sweet', hint: 'lightly funny and warm, never mocking' },
  { id: 'mature', ar: 'ناضج وهادئ', fr: 'Mûr et calme', en: 'Mature & calm', hint: 'mature, calm, measured' },
  { id: 'short_simple', ar: 'قصير وبسيط', fr: 'Court et simple', en: 'Short & simple', hint: 'very short and simple words' },
  { id: 'moving', ar: 'مؤثر', fr: 'Touchant', en: 'Moving', hint: 'emotionally moving but honest, not melodramatic' },
];

export const LENGTHS = [
  { id: 'short', ar: 'قصيرة', fr: 'Courte', en: 'Short', words: [25, 45] },
  { id: 'medium', ar: 'متوسطة', fr: 'Moyenne', en: 'Medium', words: [55, 95] },
  { id: 'long', ar: 'طويلة', fr: 'Longue', en: 'Long', words: [110, 180] },
];

export const LANGUAGES = [
  { id: 'ar-msa', ar: 'العربية الفصحى', fr: 'Arabe classique', en: 'Modern Standard Arabic', dir: 'rtl' },
  { id: 'ar-dz', ar: 'العربية الجزائرية', fr: 'Arabe algérien', en: 'Algerian Arabic (Darija)', dir: 'rtl' },
  { id: 'fr', ar: 'الفرنسية', fr: 'Français', en: 'French', dir: 'ltr' },
  { id: 'en', ar: 'الإنجليزية', fr: 'Anglais', en: 'English', dir: 'ltr' },
  { id: 'ar-fr', ar: 'عربي + فرنسي', fr: 'Arabe + français', en: 'Arabic + French', dir: 'rtl' },
];

/** Emotion intensity 1..5 — the model must obey this exactly. */
export const INTENSITY = [
  { id: 1, level: 1, ar: 'هادئة جدًا', fr: 'Très sobre', en: 'Very restrained', hint: 'very restrained, almost neutral, understated' },
  { id: 2, level: 2, ar: 'لطيفة', fr: 'Douce', en: 'Gentle', hint: 'gentle, light warmth' },
  { id: 3, level: 3, ar: 'عاطفية', fr: 'Émotive', en: 'Emotional', hint: 'clearly emotional' },
  { id: 4, level: 4, ar: 'رومانسية', fr: 'Romantique', en: 'Romantic', hint: 'romantic and openly affectionate' },
  { id: 5, level: 5, ar: 'عاطفية جدًا', fr: 'Très intense', en: 'Very intense', hint: 'very intense, from the heart — still respectful, never dramatic' },
];

/** Quick "make it more ..." actions shown on the result card and as chips. */
export const REFINE_ACTIONS = [
  { id: 'romantic', emoji: '❤️', ar: 'أكثر رومانسية', fr: 'Plus romantique', en: 'More romantic', directive: 'make it warmer and more romantic, without exaggerating' },
  { id: 'spontaneous', emoji: '😊', ar: 'أكثر عفوية', fr: 'Plus spontané', en: 'More spontaneous', directive: 'make it sound more natural and spontaneous, like talking out loud' },
  { id: 'elegant', emoji: '✨', ar: 'أكثر أناقة', fr: 'Plus élégant', en: 'More elegant', directive: 'make the wording more elegant and polished' },
  { id: 'impactful', emoji: '🥹', ar: 'أكثر تأثيرًا', fr: 'Plus touchant', en: 'More moving', directive: 'make it more emotionally moving and sincere' },
  { id: 'funny', emoji: '😂', ar: 'أكثر مرحًا', fr: 'Plus drôle', en: 'More playful', directive: 'add light, warm humour without mocking anyone' },
  { id: 'mature', emoji: '🕊️', ar: 'أكثر نضجًا', fr: 'Plus mûr', en: 'More mature', directive: 'make it calmer, more mature and measured' },
  { id: 'shorter', emoji: '💬', ar: 'أقصر', fr: 'Plus court', en: 'Shorter', directive: 'shorten it while keeping the meaning and the personal details' },
  { id: 'longer', emoji: '📝', ar: 'أطول', fr: 'Plus long', en: 'Longer', directive: 'make it longer with new sincere sentences, never by repeating' },
];

export const byId = (list, id) => list.find((x) => x.id === id) || null;

export const idsOf = (list) => list.map((x) => x.id);

/** Human readable summary of a request — used in "My letters" and the prompt. */
export function describeRequest(req, t) {
  const occ = byId(OCCASIONS, req.occasion);
  const rec = byId(RECIPIENTS, req.recipient);
  return [occ && t ? t(`occasion.${occ.id}`) : occ?.en, rec && t ? t(`recipient.${rec.id}`) : rec?.en]
    .filter(Boolean)
    .join(' • ');
}
