import { useState } from 'react';
import { LANGUAGES } from '../../shared/ai/catalog.js';
import { normalizeRequest } from '../../shared/ai/schema.js';
import { copyText, generate } from '../lib/api.js';
import { useI18n, useT } from '../i18n/index.jsx';
import { useToast } from '../components/Toast.jsx';
import { useLetters } from '../context/LettersContext.jsx';
import { Button, Card, Field, Select, TextArea } from '../components/ui.jsx';
import { IconBookmark, IconChat, IconCopy, IconShield } from '../components/Icons.jsx';

const DEFAULT_LOCALE_LANG = { ar: 'ar-msa', fr: 'fr', en: 'en' };

/** §17 — "What should I say?" — respectful communication, never manipulation. */
export default function WhatToSay() {
  const t = useT();
  const { locale } = useI18n();
  const toast = useToast();
  const { addLetter } = useLetters();

  const [situation, setSituation] = useState('');
  const [language, setLanguage] = useState(DEFAULT_LOCALE_LANG[locale] || 'ar-msa');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [localMode, setLocalMode] = useState(false);

  const run = async () => {
    if (!situation.trim()) {
      toast(t('wts.empty'), 'info');
      return;
    }
    setLoading(true);
    setError('');
    const request = normalizeRequest({ task: 'what_to_say', situation, language, length: 'short' });
    try {
      const res = await generate(request);
      if (res.message) {
        setResult({ ...res, request });
        setLocalMode(Boolean(res.local));
      } else setError(t('compose.errorGeneric'));
    } catch {
      setError(t('compose.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const dir = LANGUAGES.find((l) => l.id === language)?.dir || 'rtl';

  const saveMessage = (text) => {
    addLetter({ text, personName: '', occasion: 'none', language, request: result.request });
    toast(t('result.saved'), 'heart');
  };

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">{t('wts.title')}</h1>
        <p className="page__subtitle">{t('wts.subtitle')}</p>
      </header>

      <div className="single">
        <Card>
          <Field label={t('wts.placeholder')} htmlFor="situation">
            <TextArea
              id="situation"
              rows={5}
              value={situation}
              placeholder={t('wts.placeholder')}
              maxLength={4000}
              onChange={(e) => setSituation(e.target.value)}
            />
          </Field>
          <Field label={t('compose.language')} htmlFor="wtsLang">
            <Select
              id="wtsLang"
              ariaLabel={t('compose.language')}
              value={language}
              options={LANGUAGES.map((l) => ({ value: l.id, label: `${l.ar} · ${l.en}` }))}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </Field>
          <Button size="lg" onClick={run} loading={loading} icon={<IconChat width={18} height={18} />}>
            {t('wts.button')}
          </Button>
        </Card>

        <div className="notice">
          <IconShield width={18} height={18} />
          <span>{t('wts.ethics')}</span>
        </div>

        {loading ? (
          <div className="loading-card">
            <div className="loading-card__pulse" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="loading-card__label">{t('wts.working')}</p>
          </div>
        ) : null}

        {error ? <div className="error-card">{error}</div> : null}

        {result && !loading ? (
          <div className="advice">
            {localMode ? <div className="badge badge--warn">{t('compose.offlineBadge')}</div> : null}

            <Card className="advice__main">
              <h2 className="advice__title">{t('wts.suggested')}</h2>
              <p className="advice__text" dir={dir}>
                {result.message}
              </p>
              <div className="advice__actions">
                <Button
                  variant="soft"
                  icon={<IconCopy width={16} height={16} />}
                  onClick={async () => {
                    const ok = await copyText(result.message);
                    toast(ok ? t('result.copied') : t('compose.errorGeneric'), ok ? 'heart' : 'info');
                  }}
                >
                  {t('result.copy')}
                </Button>
                <Button variant="ghost" icon={<IconBookmark width={16} height={16} />} onClick={() => saveMessage(result.message)}>
                  {t('result.save')}
                </Button>
              </div>
            </Card>

            <div className="advice__grid">
              {result.opener ? (
                <Card className="advice__box">
                  <h3 className="advice__boxTitle">{t('wts.opener')}</h3>
                  <p dir={dir}>{result.opener}</p>
                </Card>
              ) : null}
              {result.avoid ? (
                <Card className="advice__box advice__box--warn">
                  <h3 className="advice__boxTitle">{t('wts.avoid')}</h3>
                  <p dir={dir}>{result.avoid}</p>
                </Card>
              ) : null}
            </div>

            {result.alternative ? (
              <Card className="advice__alt">
                <h3 className="advice__boxTitle">{t('wts.alternative')}</h3>
                <p className="advice__text" dir={dir}>
                  {result.alternative}
                </p>
                <div className="advice__actions">
                  <Button
                    variant="ghost"
                    icon={<IconCopy width={16} height={16} />}
                    onClick={async () => {
                      const ok = await copyText(result.alternative);
                      toast(ok ? t('result.copied') : t('compose.errorGeneric'), ok ? 'heart' : 'info');
                    }}
                  >
                    {t('result.copy')}
                  </Button>
                  <Button variant="ghost" icon={<IconBookmark width={16} height={16} />} onClick={() => saveMessage(result.alternative)}>
                    {t('result.save')}
                  </Button>
                </div>
              </Card>
            ) : null}

            {result.note ? <p className="advice__note">{result.note}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
