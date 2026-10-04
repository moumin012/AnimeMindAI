import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FEELINGS,
  INTENSITY,
  LANGUAGES,
  LENGTHS,
  OCCASIONS,
  RECIPIENTS,
  STYLES,
  byId,
} from '../../shared/ai/catalog.js';
import { emptyRequest, normalizeRequest } from '../../shared/ai/schema.js';
import { generate, GenerationError, copyText, shareText } from '../lib/api.js';
import { useT, useI18n, useLabel } from '../i18n/index.jsx';
import { useToast } from '../components/Toast.jsx';
import { useLetters } from '../context/LettersContext.jsx';
import LetterCard from '../components/LetterCard.jsx';
import {
  Button,
  Card,
  Checkbox,
  ChipGroup,
  Disclosure,
  Field,
  SegmentedControl,
  Select,
  Slider,
  TextArea,
  TextInput,
} from '../components/ui.jsx';
import { IconArrow, IconHeart, IconSparkle } from '../components/Icons.jsx';
import { Link } from '../lib/router.jsx';

const DEFAULT_LOCALE_LANG = { ar: 'ar-msa', fr: 'fr', en: 'en' };

export default function Compose({ preset }) {
  const t = useT();
  const label = useLabel();
  const toast = useToast();
  const { locale } = useI18n();
  const { addLetter } = useLetters();

  const [form, setForm] = useState(() => ({
    ...emptyRequest(),
    language: DEFAULT_LOCALE_LANG[locale] || 'ar-msa',
  }));
  const [languageTouched, setLanguageTouched] = useState(false);
  const [letter, setLetter] = useState(null); // { text, request }
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');
  const [error, setError] = useState('');
  const [localMode, setLocalMode] = useState(false);
  const [savedKey, setSavedKey] = useState('');

  const requestRef = useRef(null);

  // a new idea chosen on the Ideas page lands straight in the details field
  useEffect(() => {
    if (preset?.details) setForm((f) => ({ ...f, details: preset.details }));
    if (preset?.style) setForm((f) => ({ ...f, style: preset.style }));
  }, [preset?.details, preset?.style]);

  // the UI language nudges the letter language until the user picks one
  useEffect(() => {
    if (languageTouched) return;
    setForm((f) => ({ ...f, language: DEFAULT_LOCALE_LANG[locale] || f.language }));
  }, [locale, languageTouched]);

  const set = useCallback((patch) => setForm((f) => ({ ...f, ...patch })), []);

  const recipientOptions = useMemo(() => RECIPIENTS.map((r) => ({ id: r.id, label: label(r) })), [label]);
  const occasionOptions = useMemo(() => OCCASIONS.map((o) => ({ id: o.id, label: label(o) })), [label]);
  const feelingOptions = useMemo(() => FEELINGS.map((f) => ({ id: f.id, label: label(f) })), [label]);
  const styleOptions = useMemo(() => STYLES.map((s) => ({ id: s.id, label: label(s) })), [label]);
  const languageOptions = useMemo(
    () => LANGUAGES.map((l) => ({ value: l.id, label: `${l.ar} · ${l.en}` })),
    [],
  );

  const canSubmit = Boolean(form.details || form.memory || form.trait || form.nickname || form.occasion !== 'none');

  const run = useCallback(
    async (raw) => {
      const request = normalizeRequest(raw);
      setLoading(true);
      setError('');
      setLoadingLabel(t('compose.generating'));
      try {
        const res = await generate(request);
        requestRef.current = request;
        setLetter({ text: res.text, request });
        setLocalMode(Boolean(res.local));
        return res;
      } catch (e) {
        setLocalMode(false);
        if (e instanceof GenerationError && e.code === 'INCOMPLETE') setError(t('compose.needDetails'));
        else if (e instanceof GenerationError && e.code === 'RATE_LIMITED') setError(t('compose.errorGeneric'));
        else setError(t('compose.errorGeneric'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  const submit = () => {
    if (!canSubmit) {
      setError(t('compose.needDetails'));
      return;
    }
    run({ ...form, task: 'letter', variant: 0, currentText: '' });
  };

  const nextRequest = (patch) => ({ ...(requestRef.current || normalizeRequest(form)), ...patch });

  const handleAction = async (kind, value) => {
    if (!letter) return;

    if (kind === 'copy') {
      const ok = await copyText(letter.text);
      toast(ok ? t('result.copied') : t('compose.errorGeneric'), ok ? 'heart' : 'info');
      return;
    }

    if (kind === 'share') {
      const outcome = await shareText(t('result.shareTitle'), letter.text);
      if (outcome === 'shared') return;
      if (outcome === 'copied') toast(t('result.shareUnsupported'), 'info');
      return;
    }

    if (kind === 'edit') {
      setLetter({ ...letter, text: value });
      return;
    }

    if (kind === 'save') {
      addLetter({
        text: letter.text,
        personName: form.personName,
        occasion: letter.request.occasion,
        language: letter.request.language,
        request: letter.request,
      });
      setSavedKey(letter.text);
      toast(t('result.saved'), 'heart');
      return;
    }

    setLoading(true);
    setLoadingLabel(t('compose.generating'));
    setError('');

    let next = null;
    try {
      if (kind === 'rewrite' || kind === 'another') {
        const base = letter.request;
        const rotate =
          kind === 'another'
            ? { style: STYLES[(STYLES.findIndex((s) => s.id === base.style) + 1) % STYLES.length].id }
            : {};
        const request = normalizeRequest({ ...base, ...rotate, variant: (base.variant || 0) + 1, currentText: '' });
        next = await generate(request);
        requestRef.current = request;
      } else if (kind === 'customize') {
        const request = normalizeRequest({
          ...letter.request,
          customized: true,
          variant: (letter.request.variant || 0) + 1,
          currentText: '',
        });
        next = await generate(request);
        requestRef.current = request;
      } else if (kind === 'translate') {
        const request = normalizeRequest({
          ...letter.request,
          task: 'refine',
          action: 'translate',
          targetLanguage: value,
          currentText: letter.text,
        });
        next = await generate(request);
        requestRef.current = normalizeRequest({
          ...letter.request,
          language: value,
          variant: (letter.request.variant || 0) + 1,
          currentText: '',
        });
      } else if (kind === 'refine') {
        const request = normalizeRequest({
          ...letter.request,
          task: 'refine',
          action: value,
          currentText: letter.text,
        });
        next = await generate(request);
        requestRef.current = request;
      }
    } catch (e) {
      setError(
        e instanceof GenerationError && e.code === 'TRANSLATE_NEEDS_CONTEXT'
          ? t('compose.errorGeneric')
          : t('compose.errorGeneric'),
      );
    } finally {
      setLoading(false);
    }

    if (next?.text) {
      setLetter({ text: next.text, request: requestRef.current });
      setLocalMode(Boolean(next.local));
    }
  };

  const intensityLabels = INTENSITY.map((i) => label(i));

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">{t('compose.title')}</h1>
        <p className="page__subtitle">{t('compose.subtitle')}</p>
      </header>

      <div className="compose">
        <Card className="compose__form">
          {/* 1 — who */}
          <section className="block">
            <h2 className="block__title">
              <span className="block__num">1</span>
              {t('compose.step1')}
            </h2>
            <Field label={t('compose.nameLabel')} htmlFor="name" hint={t('compose.nameHint')}>
              <TextInput
                id="name"
                value={form.personName}
                placeholder={t('compose.namePlaceholder')}
                maxLength={60}
                onChange={(e) => set({ personName: e.target.value })}
              />
            </Field>
            <Checkbox
              id="mentionName"
              checked={form.mentionName}
              onChange={(v) => set({ mentionName: v })}
              label={t('compose.mentionName')}
              hint={t('compose.mentionNameHint')}
            />
          </section>

          {/* 2 — extra info */}
          <section className="block">
            <h2 className="block__title">
              <span className="block__num">2</span>
              {t('compose.about')}
            </h2>
            <Disclosure title={t('compose.about')} subtitle={t('common.optional')} defaultOpen={false}>
              <Field label={t('compose.nicknameLabel')} htmlFor="nickname">
                <TextInput
                  id="nickname"
                  value={form.nickname}
                  placeholder={t('compose.nicknamePlaceholder')}
                  maxLength={120}
                  onChange={(e) => set({ nickname: e.target.value })}
                />
              </Field>
              <Field label={t('compose.traitLabel')} htmlFor="trait">
                <TextInput
                  id="trait"
                  value={form.trait}
                  placeholder={t('compose.traitPlaceholder')}
                  maxLength={300}
                  onChange={(e) => set({ trait: e.target.value })}
                />
              </Field>
              <Field label={t('compose.memoryLabel')} htmlFor="memory">
                <TextInput
                  id="memory"
                  value={form.memory}
                  placeholder={t('compose.memoryPlaceholder')}
                  maxLength={300}
                  onChange={(e) => set({ memory: e.target.value })}
                />
              </Field>
            </Disclosure>
          </section>

          {/* 3 — recipient & occasion */}
          <section className="block">
            <h2 className="block__title">
              <span className="block__num">3</span>
              {t('compose.recipient')}
            </h2>
            <Field label={t('compose.recipient')} htmlFor="recipient">
              <Select
                id="recipient"
                ariaLabel={t('compose.recipient')}
                value={form.recipient}
                options={recipientOptions}
                onChange={(e) => set({ recipient: e.target.value })}
              />
            </Field>
            <Field label={t('compose.occasion')} htmlFor="occasion">
              <Select
                id="occasion"
                ariaLabel={t('compose.occasion')}
                value={form.occasion}
                options={occasionOptions}
                onChange={(e) => set({ occasion: e.target.value })}
              />
            </Field>
          </section>

          {/* 4 — feelings */}
          <section className="block">
            <h2 className="block__title">
              <span className="block__num">4</span>
              {t('compose.feelings')}
            </h2>
            <ChipGroup
              options={feelingOptions}
              value={form.feelings}
              multiple
              onChange={(v) => set({ feelings: v })}
            />
          </section>

          {/* 5 — style, intensity, length, language */}
          <section className="block">
            <h2 className="block__title">
              <span className="block__num">5</span>
              {t('compose.style')}
            </h2>
            <ChipGroup options={styleOptions} value={form.style} onChange={(v) => set({ style: v })} />

            <Field label={t('compose.intensity')} htmlFor="intensity">
              <Slider
                id="intensity"
                min={1}
                max={5}
                value={form.intensity}
                onChange={(v) => set({ intensity: v })}
                labels={intensityLabels}
                ariaLabel={t('compose.intensity')}
              />
            </Field>

            <Field label={t('compose.length')} htmlFor="length">
              <SegmentedControl
                ariaLabel={t('compose.length')}
                options={LENGTHS.map((l) => ({ id: l.id, label: label(l) }))}
                value={form.length}
                onChange={(v) => set({ length: v })}
              />
            </Field>

            <Field label={t('compose.language')} htmlFor="language">
              <Select
                id="language"
                ariaLabel={t('compose.language')}
                value={form.language}
                options={languageOptions}
                onChange={(e) => {
                  setLanguageTouched(true);
                  set({ language: e.target.value });
                }}
              />
            </Field>
          </section>

          {/* 6 — details */}
          <section className="block">
            <h2 className="block__title">
              <span className="block__num">6</span>
              {t('compose.details')}
            </h2>
            <Field label={t('compose.detailsLabel')} htmlFor="details">
              <TextArea
                id="details"
                rows={5}
                value={form.details}
                placeholder={t('compose.detailsPlaceholder')}
                maxLength={4000}
                onChange={(e) => set({ details: e.target.value })}
              />
            </Field>
            <p className="tip">{t('compose.tip')}</p>
            <Link to="/say-it" className="linkish">
              {t('speak.title')}
              <IconArrow width={14} height={14} />
            </Link>
          </section>

          <div className="compose__submit">
            <Button size="lg" loading={loading} onClick={submit} icon={<IconHeart width={18} height={18} />}>
              {t('compose.submit')}
            </Button>
            {!canSubmit ? <p className="compose__warning">{t('compose.needDetails')}</p> : null}
          </div>
        </Card>

        <div className="compose__side">
          {letter || loading || error ? (
            <>
              {localMode ? <div className="badge badge--warn">{t('compose.offlineBadge')}</div> : null}
              <LetterCard
                text={letter?.text || ''}
                name={form.personName}
                request={letter?.request || normalizeRequest(form)}
                loading={loading}
                loadingLabel={loadingLabel}
                error={error}
                saved={Boolean(letter) && savedKey === letter.text}
                onRetry={submit}
                onAction={handleAction}
              />
            </>
          ) : (
            <Card className="hint-card">
              <span className="hint-card__icon" aria-hidden="true">
                <IconSparkle width={22} height={22} />
              </span>
              <p>{t('compose.tip')}</p>
              <ul className="hint-card__list">
                <li>{t('compose.nameLabel')}</li>
                <li>{t('compose.occasion')}</li>
                <li>{t('compose.feelings')}</li>
                <li>{t('compose.style')}</li>
                <li>{t('compose.details')}</li>
              </ul>
            </Card>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {loading ? loadingLabel : ''}
      </p>
    </div>
  );
}

export { byId };
