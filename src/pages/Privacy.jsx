import { useT } from '../i18n/index.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useLetters } from '../context/LettersContext.jsx';
import { Button, Card } from '../components/ui.jsx';
import { IconCheck, IconShield, IconTrash } from '../components/Icons.jsx';

export default function Privacy() {
  const t = useT();
  const { clearAll, letters } = useLetters();

  const points = [
    ['privacy.p1t', 'privacy.p1d'],
    ['privacy.p2t', 'privacy.p2d'],
    ['privacy.p3t', 'privacy.p3d'],
    ['privacy.p4t', 'privacy.p4d'],
    ['privacy.p5t', 'privacy.p5d'],
    ['privacy.p6t', 'privacy.p6d'],
  ];

  return (
    <div className="page">
      <header className="page__head">
        <span className="page__icon" aria-hidden="true">
          <IconShield width={22} height={22} />
        </span>
        <h1 className="page__title">{t('privacy.title')}</h1>
        <p className="page__subtitle">{t('privacy.intro')}</p>
      </header>

      <div className="privacy-grid">
        {points.map(([title, desc]) => (
          <Card key={title} className="privacy-card">
            <span className="privacy-card__tick" aria-hidden="true">
              <IconCheck width={16} height={16} />
            </span>
            <h2 className="privacy-card__title">{t(title)}</h2>
            <p className="privacy-card__desc">{t(desc)}</p>
          </Card>
        ))}
      </div>

      <Card className="privacy-cta">
        <p>{t('privacy.delete')}</p>
        <Button variant="danger" icon={<IconTrash width={16} height={16} />} onClick={() => clearAll()} disabled={!letters.length}>
          {t('settings.deleteAll')}
        </Button>
      </Card>
    </div>
  );
}
