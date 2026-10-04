import { useState } from 'react';
import { CATEGORY_LABELS, IDEA_CATEGORIES, IDEAS } from '../data/ideas.js';
import { useRouter } from '../lib/router.jsx';
import { useT, useI18n } from '../i18n/index.jsx';
import { useToast } from '../components/Toast.jsx';
import { Card } from '../components/ui.jsx';
import { IconArrow, IconBulb } from '../components/Icons.jsx';

export default function Ideas() {
  const t = useT();
  const { locale } = useI18n();
  const { navigate } = useRouter();
  const toast = useToast();
  const [active, setActive] = useState(IDEA_CATEGORIES[0]);

  const items = IDEAS[active]?.[locale] || IDEAS[active]?.ar || [];

  const useIdea = (text) => {
    try {
      sessionStorage.setItem('resalti:preset', JSON.stringify({ details: text, at: Date.now() }));
    } catch {
      /* storage may be unavailable — navigation still works */
    }
    toast(t('ideas.used'), 'heart');
    navigate('/compose');
  };

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">{t('ideas.title')}</h1>
        <p className="page__subtitle">{t('ideas.subtitle')}</p>
      </header>

      <div className="chips chips--cats">
        {IDEA_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip ${active === c ? 'chip--on' : ''}`}
            aria-pressed={active === c}
            onClick={() => setActive(c)}
          >
            {CATEGORY_LABELS[c][locale] || CATEGORY_LABELS[c].ar}
          </button>
        ))}
      </div>

      <div className="ideas">
        {items.map((idea) => (
          <Card key={idea} className="idea">
            <span className="idea__icon" aria-hidden="true">
              <IconBulb width={18} height={18} />
            </span>
            <p className="idea__text">{idea}</p>
            <button type="button" className="idea__use" onClick={() => useIdea(idea)}>
              {t('ideas.use')}
              <IconArrow width={14} height={14} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
