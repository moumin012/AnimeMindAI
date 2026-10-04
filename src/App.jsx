import { useEffect, useMemo, useState } from 'react';
import { RouterProvider, useRouter, Link } from './lib/router.jsx';
import { I18nProvider, useI18n } from './i18n/index.jsx';
import { SettingsProvider, useSettings } from './context/SettingsContext.jsx';
import { LettersProvider } from './context/LettersContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import Compose from './pages/Compose.jsx';
import SayIt from './pages/SayIt.jsx';
import WhatToSay from './pages/WhatToSay.jsx';
import MyLetters from './pages/MyLetters.jsx';
import Ideas from './pages/Ideas.jsx';
import Settings from './pages/Settings.jsx';
import Privacy from './pages/Privacy.jsx';
import About from './pages/About.jsx';
import { IconHeart, IconShield, IconInfo } from './components/Icons.jsx';

/** A few slow, low-cost hearts. Purely decorative, disabled for reduced motion. */
function Ambience() {
  const hearts = useMemo(
    () => [
      { left: '8%', delay: '0s', size: 12, duration: '18s' },
      { left: '24%', delay: '6s', size: 9, duration: '22s' },
      { left: '62%', delay: '3s', size: 14, duration: '20s' },
      { left: '86%', delay: '9s', size: 10, duration: '24s' },
    ],
    [],
  );
  return (
    <div className="ambience" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.left}
          className="ambience__heart"
          style={{ left: h.left, animationDelay: h.delay, animationDuration: h.duration, fontSize: h.size }}
        >
          <IconHeart width={h.size} height={h.size} />
        </span>
      ))}
    </div>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__brand">
          <IconHeart width={14} height={14} />
          {t('brand.name')} — {t('brand.tagline')}
        </p>
        <nav className="footer__links">
          <Link to="/privacy">
            <IconShield width={14} height={14} />
            {t('footer.privacy')}
          </Link>
          <Link to="/about">
            <IconInfo width={14} height={14} />
            {t('footer.about')}
          </Link>
        </nav>
        <p className="footer__rights">{t('footer.rights')}</p>
      </div>
    </footer>
  );
}

function Routes() {
  const { path } = useRouter();
  const [preset, setPreset] = useState(null);

  // an idea chosen on the Ideas page is handed over through sessionStorage
  useEffect(() => {
    if (path !== '/compose') return;
    try {
      const raw = sessionStorage.getItem('resalti:preset');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      sessionStorage.removeItem('resalti:preset');
      if (Date.now() - (parsed.at || 0) < 60000) setPreset(parsed);
    } catch {
      /* ignore malformed presets */
    }
  }, [path]);

  switch (path) {
    case '/compose':
      return <Compose preset={preset} />;
    case '/say-it':
      return <SayIt />;
    case '/what-to-say':
      return <WhatToSay />;
    case '/my-letters':
      return <MyLetters />;
    case '/ideas':
      return <Ideas />;
    case '/settings':
      return <Settings />;
    case '/privacy':
      return <Privacy />;
    case '/about':
      return <About />;
    default:
      return <Home />;
  }
}

function Shell() {
  const { settings } = useSettings();
  return (
    <I18nProvider locale={settings.locale}>
      <Ambience />
      <NavBar />
      <main className="main">
        <Routes />
      </main>
      <Footer />
    </I18nProvider>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <LettersProvider>
        <RouterProvider>
          <ToastProvider>
            <Shell />
          </ToastProvider>
        </RouterProvider>
      </LettersProvider>
    </SettingsProvider>
  );
}
