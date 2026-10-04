import { useEffect, useState } from 'react';
import { Link, useRouter } from '../lib/router.jsx';
import { useI18n, UI_LOCALES } from '../i18n/index.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useLetters } from '../context/LettersContext.jsx';
import {
  IconBulb,
  IconChat,
  IconClose,
  IconGear,
  IconHeart,
  IconHome,
  IconMenu,
  IconMoon,
  IconPen,
  IconSun,
} from './Icons.jsx';

export const NAV_ITEMS = [
  { path: '/', key: 'nav.home', Icon: IconHome },
  { path: '/compose', key: 'nav.compose', Icon: IconPen },
  { path: '/what-to-say', key: 'nav.whatToSay', Icon: IconChat },
  { path: '/my-letters', key: 'nav.myLetters', Icon: IconHeart },
  { path: '/ideas', key: 'nav.ideas', Icon: IconBulb },
  { path: '/settings', key: 'nav.settings', Icon: IconGear },
];

function ThemeButton() {
  const { settings, update } = useSettings();
  const { t } = useI18n();
  const isDark = settings.theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      title={`${t('settings.theme')}: ${t(isDark ? 'settings.themeDark' : 'settings.themeLight')}`}
      aria-label={t('settings.theme')}
      onClick={() => update({ theme: isDark ? 'light' : 'dark' })}
    >
      {isDark ? <IconSun width={18} height={18} /> : <IconMoon width={18} height={18} />}
    </button>
  );
}

function LanguageSwitch({ compact = false }) {
  const { settings, update } = useSettings();
  const { t } = useI18n();
  return (
    <div className={`lang-switch ${compact ? 'lang-switch--compact' : ''}`} role="group" aria-label={t('settings.language')}>
      {UI_LOCALES.map((l) => (
        <button
          key={l.id}
          type="button"
          className={`lang-switch__item ${settings.locale === l.id ? 'lang-switch__item--on' : ''}`}
          aria-pressed={settings.locale === l.id}
          onClick={() => update({ locale: l.id })}
        >
          {l.label.split(' ')[0]}
        </button>
      ))}
    </div>
  );
}

export default function NavBar() {
  const { t } = useI18n();
  const { path } = useRouter();
  const { letters } = useLetters();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  const count = letters.length;

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              <IconHeart width={18} height={18} />
            </span>
            <span className="brand__text">
              <span className="brand__name">{t('brand.name')}</span>
              <span className="brand__tag">{t('brand.tagline')}</span>
            </span>
          </Link>

          <nav className="nav__links" aria-label="main">
            {NAV_ITEMS.map(({ path: p, key, Icon }) => (
              <Link key={p} to={p} className={`nav__link ${path === p ? 'nav__link--on' : ''}`}>
                <Icon width={16} height={16} />
                <span>{t(key)}</span>
                {p === '/my-letters' && count > 0 ? <span className="nav__badge">{count}</span> : null}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <LanguageSwitch compact />
            <ThemeButton />
            <button
              type="button"
              className="icon-btn nav__burger"
              aria-label={t('nav.menu')}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <IconClose width={18} height={18} /> : <IconMenu width={18} height={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer ${open ? 'drawer--open' : ''}`} hidden={!open}>
        <nav className="drawer__list" aria-label="mobile">
          {NAV_ITEMS.map(({ path: p, key, Icon }) => (
            <Link key={p} to={p} className={`drawer__link ${path === p ? 'drawer__link--on' : ''}`}>
              <Icon width={18} height={18} />
              <span>{t(key)}</span>
              {p === '/my-letters' && count > 0 ? <span className="nav__badge">{count}</span> : null}
            </Link>
          ))}
        </nav>
      </div>

      <nav className="tabbar" aria-label="mobile tabs">
        {NAV_ITEMS.slice(0, 5).map(({ path: p, key, Icon }) => (
          <Link key={p} to={p} className={`tabbar__item ${path === p ? 'tabbar__item--on' : ''}`}>
            <Icon width={20} height={20} />
            <span>{t(key)}</span>
            {p === '/my-letters' && count > 0 ? <span className="tabbar__badge">{count}</span> : null}
          </Link>
        ))}
      </nav>
    </>
  );
}

export { LanguageSwitch, ThemeButton };
