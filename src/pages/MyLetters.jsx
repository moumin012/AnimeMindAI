import { useState } from 'react';
import { OCCASIONS, byId } from '../../shared/ai/catalog.js';
import { copyText } from '../lib/api.js';
import { useT, useI18n, useLabel } from '../i18n/index.jsx';
import { useToast } from '../components/Toast.jsx';
import { useLetters } from '../context/LettersContext.jsx';
import { Button, Card } from '../components/ui.jsx';
import { LetterPaper } from '../components/LetterCard.jsx';
import { IconBookmark, IconCopy, IconEdit, IconHeart, IconTrash } from '../components/Icons.jsx';

const preview = (text, n = 120) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > n ? `${flat.slice(0, n)}…` : flat;
};

export default function MyLetters() {
  const t = useT();
  const label = useLabel();
  const { dir, locale } = useI18n();
  const toast = useToast();
  const { letters, updateLetter, removeLetter, clearAll } = useLetters();

  const [openId, setOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const startEdit = (letter) => {
    setEditingId(letter.id);
    setDraft(letter.text);
    setOpenId(letter.id);
  };

  const commitEdit = (letter) => {
    if (draft.trim()) updateLetter(letter.id, { text: draft });
    setEditingId(null);
    toast(t('result.saved'), 'heart');
  };

  if (!letters.length) {
    return (
      <div className="page">
        <header className="page__head">
          <h1 className="page__title">{t('saved.title')}</h1>
          <p className="page__subtitle">{t('saved.subtitle')}</p>
        </header>
        <Card className="empty">
          <span className="empty__icon" aria-hidden="true">
            <IconHeart width={26} height={26} />
          </span>
          <p className="empty__title">{t('saved.empty')}</p>
          <p className="empty__hint">{t('saved.emptyHint')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page__head page__head--split">
        <div>
          <h1 className="page__title">{t('saved.title')}</h1>
          <p className="page__subtitle">
            {letters.length} {t('saved.count')} — {t('saved.subtitle')}
          </p>
        </div>
        <Button variant="danger" icon={<IconTrash width={16} height={16} />} onClick={() => setConfirmClear(true)}>
          {t('settings.deleteAll')}
        </Button>
      </header>

      {confirmClear ? (
        <Card className="confirm">
          <p>{t('settings.deleteAllConfirm')}</p>
          <div className="confirm__actions">
            <Button
              variant="danger"
              onClick={() => {
                clearAll();
                setConfirmClear(false);
                toast(t('saved.deletedAll'), 'info');
              }}
            >
              {t('common.confirm')}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="saved-list">
        {letters.map((letter) => {
          const isOpen = openId === letter.id;
          const isEditing = editingId === letter.id;
          const occasion = byId(OCCASIONS, letter.occasion);
          const letterDir = ['fr', 'en'].includes(letter.language) ? 'ltr' : dir;

          return (
            <Card key={letter.id} className={`saved ${isOpen ? 'saved--open' : ''}`}>
              <div className="saved__head">
                <div className="saved__meta">
                  <span className="saved__name">{letter.personName || t('result.untitled')}</span>
                  <span className="saved__tags">
                    {occasion ? label(occasion) : null}
                    <span aria-hidden="true">•</span>
                    {fmtDate(letter.createdAt)}
                  </span>
                </div>
                <button
                  type="button"
                  className="linkish"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setOpenId(isOpen ? null : letter.id);
                    setEditingId(null);
                  }}
                >
                  {t(isOpen ? 'common.close' : 'saved.open')}
                </button>
              </div>

              <p className="saved__preview">{preview(letter.text)}</p>

              {isOpen ? (
                <div className="saved__body">
                  <LetterPaper
                    name={letter.personName}
                    text={isEditing ? draft : letter.text}
                    dir={letterDir}
                    editing={isEditing}
                    onChange={setDraft}
                    onStartEdit={() => (isEditing ? commitEdit(letter) : startEdit(letter))}
                  />
                </div>
              ) : null}

              <div className="saved__actions">
                <Button
                  variant="soft"
                  icon={<IconCopy width={16} height={16} />}
                  onClick={async () => {
                    const ok = await copyText(letter.text);
                    toast(ok ? t('result.copied') : t('compose.errorGeneric'), ok ? 'heart' : 'info');
                  }}
                >
                  {t('saved.copy')}
                </Button>
                <Button
                  variant="ghost"
                  icon={<IconEdit width={16} height={16} />}
                  onClick={() => (isEditing ? commitEdit(letter) : startEdit(letter))}
                >
                  {t(isEditing ? 'saved.updateSave' : 'saved.edit')}
                </Button>
                {isEditing ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(null);
                      setDraft(letter.text);
                    }}
                  >
                    {t('saved.cancelEdit')}
                  </Button>
                ) : null}
                <Button
                  variant="ghost danger-text"
                  icon={<IconTrash width={16} height={16} />}
                  onClick={() => {
                    removeLetter(letter.id);
                    if (openId === letter.id) setOpenId(null);
                    toast(t('saved.deleted'), 'info');
                  }}
                >
                  {t('saved.delete')}
                </Button>
              </div>

              {isEditing ? <p className="saved__editingNote">{t('saved.editing')}</p> : null}
            </Card>
          );
        })}
      </div>

      <p className="privacy-note">
        <IconBookmark width={16} height={16} />
        {t('saved.subtitle')}
      </p>
    </div>
  );
}
