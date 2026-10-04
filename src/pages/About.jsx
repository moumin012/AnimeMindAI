import { useT } from '../i18n/index.jsx';
import { Card } from '../components/ui.jsx';
import { IconHeart, IconInfo, IconSparkle } from '../components/Icons.jsx';

export default function About() {
  const t = useT();
  return (
    <div className="page">
      <header className="page__head">
        <span className="page__icon" aria-hidden="true">
          <IconHeart width={22} height={22} />
        </span>
        <h1 className="page__title">{t('about.title')}</h1>
        <p className="page__subtitle">{t('brand.tagline')}</p>
      </header>

      <div className="single">
        <Card>
          <p className="about__text">{t('about.body')}</p>
        </Card>

        <Card>
          <h2 className="about__title">
            <IconInfo width={16} height={16} />
            {t('about.how')}
          </h2>
          <p className="about__text">{t('about.howBody')}</p>
          <p className="about__version">
            {t('about.version')} 1.0.0
          </p>
        </Card>

        <Card>
          <h2 className="about__title">
            <IconSparkle width={16} height={16} />
            {t('about.future')}
          </h2>
          <p className="about__text">{t('about.futureBody')}</p>
        </Card>
      </div>
    </div>
  );
}
