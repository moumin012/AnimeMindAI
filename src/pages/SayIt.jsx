import { useEffect, useState } from 'react';
import { LANGUAGES } from '../../shared/ai/catalog.js';
import { normalizeRequest } from '../../shared/ai/schema.js';
import { copyText, shareText } from '../lib/api.js';
import { useI18n, useT } from '../i18n/index.jsx';
import { useToast } from '../components/Toast.jsx';
import { useLetters } from '../context/LettersContext.jsx';
import { useLetterSession } from '../hooks/useLetterSession.js';
import LetterCard from '../components/LetterCard.jsx';
import { Button, Card, Field, Select, TextArea } from '../components/ui.jsx';
import { IconSparkle } from '../components/Icons.jsx';

const DEFAULT_LOCALE_LANG = { ar: 'ar-msa', fr: 'fr', en: 'en' };

/** §16 — "I have words… but I don’t know how to say them." */
export default function SayIt() {
  const t = useT();
  const { locale } = useI18n();
  const toast = useToast();
  const { addLetter } = useLetters();
  const session = useLetterSession({ loadingLabel: t('speak.working') });

  const [rawSpeech, setRawSpeech] = useState('');
  const [language, setLanguage] = useState(DEFAULT_LOCALE_LANG[locale] || 'ar-msa');
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => setLanguage((l) => (l === 'ar-msa' || l === 'fr' || l === 'en' ? DEFAULT_LOCALE_LANG[locale] : l)), [locale]);

  const run = () => {
    if (!rawSpeech.trim()) {
      toast(t('speak.empty'), 'info');
      return;
    }
    session.start({ task: 'speak', rawSpeech, language, style: 'spontaneous', length: 'medium' });
  };

  const handleAction = async (kind, value) => {
    if (!session.letter) return;
    if (kind === 'copy') {
      const ok = await copyText(session.letter.text);
      toast(ok ? t('result.copied') : t('compose.errorGeneric'), ok ? 'heart' : 'info');
      return;
    }
    if (kind === 'share') {
      const outcome = await shareText(t('result.shareTitle'), session.letter.text);
      if (outcome === 'copied') toast(t('result.shareUnsupported'), 'info');
      return;
    }
    if (kind === 'edit') {
      session.edit(value);
      return;
    }
    if (kind === 'save') {
      addLetter({
        text: session.letter.text,
        personName: '',
        occasion: session.letter.request.occasion,
        language: session.letter.request.language,
        request: session.letter.request,
      });
      setSavedKey(session.letter.text);
      toast(t('result.saved'), 'heart');
      return;
    }
    await session.act(kind, value);
  };

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">{t('speak.title')}</h1>
        <p className="page__subtitle">{t('speak.subtitle')}</p>
      </header>

      <div className="single">
        <Card>
          <Field label={t('speak.title')} htmlFor="rawSpeech">
            <TextArea
              id="rawSpeech"
              rows={6}
              value={rawSpeech}
              placeholder={t('speak.placeholder')}
              maxLength={4000}
              onChange={(e) => setRawSpeech(e.target.value)}
            />
          </Field>

          <Field label={t('compose.language')} htmlFor="speakLang">
            <Select
              id="speakLang"
              ariaLabel={t('compose.language')}
              value={language}
              options={LANGUAGES.map((l) => ({ value: l.id, label: `${l.ar} · ${l.en}` }))}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </Field>

          <Button size="lg" onClick={run} loading={session.loading} icon={<IconSparkle width={18} height={18} />}>
            {t('speak.button')}
          </Button>
        </Card>

        {session.letter || session.loading || session.error ? (
          <>
            {session.localMode ? <div className="badge badge--warn">{t('compose.offlineBadge')}</div> : null}
            <LetterCard
              text={session.letter?.text || ''}
              name=""
              request={session.letter?.request || normalizeRequest({ language })}
              loading={session.loading}
              loadingLabel={t('speak.working')}
              error={session.error ? t('compose.errorGeneric') : ''}
              saved={Boolean(session.letter) && savedKey === session.letter.text}
              onRetry={run}
              onAction={handleAction}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
