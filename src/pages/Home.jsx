import { Link } from '../lib/router.jsx';
import { useT } from '../i18n/index.jsx';
import { Card } from '../components/ui.jsx';
import { IconArrow, IconChat, IconHeart, IconPen, IconShield, IconSparkle } from '../components/Icons.jsx';

export default function Home() {
  const t = useT();

  const features = [
    { t: t('features.f1t'), d: t('features.f1d'), Icon: IconPen },
    { t: t('features.f2t'), d: t('features.f2d'), Icon: IconSparkle },
    { t: t('features.f3t'), d: t('features.f3d'), Icon: IconChat },
    { t: t('features.f4t'), d: t('features.f4d'), Icon: IconShield },
  ];

  const stats = [
    { v: t('hero.stat1'), l: t('hero.stat1Label') },
    { v: t('hero.stat2'), l: t('hero.stat2Label') },
    { v: t('hero.stat3'), l: t('hero.stat3Label') },
  ];

  return (
    <div className="page page--home">
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__text">
          <span className="pill">
            <IconHeart width={14} height={14} />
            {t('brand.tagline')}
          </span>
          <h1 className="hero__title">{t('hero.title')}</h1>
          <p className="hero__subtitle">{t('hero.subtitle')}</p>
          <div className="hero__cta">
            <Link to="/compose" className="btn btn--solid btn--lg">
              <span className="btn__icon">
                <IconHeart width={18} height={18} />
              </span>
              <span>{t('hero.cta')}</span>
            </Link>
            <Link to="/what-to-say" className="btn btn--outline btn--lg">
              <span>{t('hero.cta2')}</span>
              <span className="btn__icon">
                <IconArrow width={16} height={16} />
              </span>
            </Link>
          </div>
          <dl className="hero__stats">
            {stats.map((s) => (
              <div key={s.l} className="hero__stat">
                <dt>{s.v}</dt>
                <dd>{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__preview">
          <Card className="paper paper--preview">
            <header className="paper__head">
              <span className="paper__stamp" aria-hidden="true">
                ❤
              </span>
              <span className="paper__to">{t('hero.previewName')}</span>
            </header>
            <div className="paper__body">
              <p>{t('hero.previewBody')}</p>
            </div>
            <footer className="paper__foot">
              <span className="paper__meta">{t('hero.previewMeta')}</span>
              <span className="paper__label">{t('hero.previewLabel')}</span>
            </footer>
          </Card>
          <span className="hero__previewTag" aria-hidden="true">
            <IconSparkle width={14} height={14} />
          </span>
        </div>
      </section>

      <section className="features">
        <h2 className="section__title">{t('features.title')}</h2>
        <div className="features__grid">
          {features.map(({ t: title, d, Icon }) => (
            <Card key={title} className="feature">
              <span className="feature__icon" aria-hidden="true">
                <Icon width={20} height={20} />
              </span>
              <h3 className="feature__title">{title}</h3>
              <p className="feature__desc">{d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2 className="cta-band__title">{t('speak.title')}</h2>
          <p className="cta-band__desc">{t('speak.subtitle')}</p>
        </div>
        <Link to="/say-it" className="btn btn--soft btn--lg">
          <span>{t('speak.button')}</span>
          <span className="btn__icon">
            <IconArrow width={16} height={16} />
          </span>
        </Link>
      </section>
    </div>
  );
}
