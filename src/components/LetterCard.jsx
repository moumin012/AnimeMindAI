import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui.jsx';
import { useT, useI18n } from '../i18n/index.jsx';
import { LANGUAGES, REFINE_ACTIONS } from '../../shared/ai/catalog.js';
import {
  IconBookmark,
  IconCheck,
  IconCopy,
  IconEdit,
  IconGlobe,
  IconRefresh,
  IconShare,
  IconSparkle,
} from './Icons.jsx';

/** The generated letter, presented like a real piece of paper. */
export function LetterPaper({ name, text, onChange, editing, onStartEdit, dir }) {
  const t = useT();
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  return (
    <div className="paper">
      <div className="paper__edge" aria-hidden="true" />
      <header className="paper__head">
        <span className="paper__stamp" aria-hidden="true">
          ❤
        </span>
        <span className="paper__to">
          {name ? `${t('result.to')} ${name}` : t('result.untitled')}
        </span>
      </header>

      {editing ? (
        <textarea
          ref={ref}
          className="paper__edit"
          value={text}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
          aria-label={t('result.title')}
        />
      ) : (
        <div className="paper__body" dir={dir}>
          {text.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <footer className="paper__foot">
        <span className="paper__count">
          {text.trim().split(/\s+/).filter(Boolean).length} {t('result.words')}
        </span>
        <button type="button" className="linkish" onClick={onStartEdit}>
          <IconEdit width={15} height={15} />
          {editing ? t('result.editHint') : t('saved.edit')}
        </button>
      </footer>
    </div>
  );
}

export default function LetterCard({
  text,
  name,
  request,
  loading,
  loadingLabel,
  error,
  onAction,
  onEdit,
  saved,
  onRetry,
}) {
  const t = useT();
  const { dir, locale } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [showTranslate, setShowTranslate] = useState(false);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setDraft(text);
    setEditing(false);
    setShowTranslate(false);
  }, [text]);

  useEffect(() => {
    if (loading && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading]);

  const letterDir = useMemo(() => {
    const lang = request?.language || 'ar-msa';
    return LANGUAGES.find((l) => l.id === lang)?.dir || dir;
  }, [request?.language, dir]);

  const commitEdit = () => {
    if (draft.trim() && draft !== text) onAction('edit', draft);
    setEditing(false);
  };

  const refine = (action) => {
    setEditing(false);
    onAction('refine', action);
  };

  const quick = [
    { id: 'copy', label: t('result.copy'), Icon: copied ? IconCheck : IconCopy, variant: 'solid' },
    { id: 'rewrite', label: t('result.rewrite'), Icon: IconRefresh, variant: 'ghost' },
    { id: 'save', label: saved ? t('result.alreadySaved') : t('result.save'), Icon: IconBookmark, variant: 'soft' },
    { id: 'share', label: t('result.share'), Icon: IconShare, variant: 'ghost' },
    { id: 'another', label: t('result.another'), Icon: IconSparkle, variant: 'ghost' },
  ];

  return (
    <section className="result" ref={sectionRef} aria-live="polite">
      <div className="result__head">
        <h2 className="result__title">{t('result.title')}</h2>
        <p className="result__hint">{t('result.editHint')}</p>
      </div>

      {loading ? (
        <div className="loading-card">
          <div className="loading-card__pulse" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="loading-card__label">{loadingLabel}</p>
          <p className="loading-card__hint">{t('compose.generatingHint')}</p>
        </div>
      ) : error ? (
        <div className="error-card" role="alert">
          <p>{error}</p>
          <Button variant="soft" onClick={onRetry} icon={<IconRefresh width={16} height={16} />}>
            {t('common.retry')}
          </Button>
        </div>
      ) : (
        <>
          <LetterPaper
            name={name}
            text={draft}
            dir={letterDir}
            editing={editing}
            onChange={setDraft}
            onStartEdit={() => (editing ? commitEdit() : setEditing(true))}
          />

          <div className="result__actions">
            {quick.map(({ id, label, Icon, variant }) => (
              <Button
                key={id}
                variant={variant}
                icon={<Icon width={16} height={16} />}
                disabled={id === 'save' && saved}
                onClick={() => {
                  if (id === 'copy') {
                    onAction('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  } else onAction(id);
                }}
              >
                {label}
              </Button>
            ))}

            <div className="translate-wrap">
              <Button
                variant="ghost"
                icon={<IconGlobe width={16} height={16} />}
                aria-expanded={showTranslate}
                onClick={() => setShowTranslate((s) => !s)}
              >
                {t('result.translate')}
              </Button>
              {showTranslate ? (
                <div className="translate-menu">
                  {LANGUAGES.filter((l) => l.id !== request.language).map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setShowTranslate(false);
                        onAction('translate', l.id);
                      }}
                    >
                      {l.ar} · {l.en}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="improve">
            <h3 className="improve__title">{t('result.improveTitle')}</h3>
            <div className="improve__chips">
              {REFINE_ACTIONS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="chip chip--action"
                  disabled={loading}
                  onClick={() => refine(a.id)}
                >
                  <span aria-hidden="true">{a.emoji}</span> {a[locale] || a.ar}
                </button>
              ))}
            </div>
          </div>

          <div className="result__secondary">
            <Button
              variant="outline"
              icon={<IconSparkle width={16} height={16} />}
              onClick={() => onAction('customize')}
              disabled={loading}
            >
              {t('result.customize')}
            </Button>
            <span className="result__secondaryHint">{t('result.customizeHint')}</span>
          </div>

          {editing ? (
            <div className="edit-bar">
              <Button variant="solid" icon={<IconCheck width={16} height={16} />} onClick={commitEdit}>
                {t('saved.updateSave')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setDraft(text);
                  setEditing(false);
                }}
              >
                {t('saved.cancelEdit')}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
