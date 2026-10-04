import { useEffect, useState } from 'react';
import { Link } from '../lib/router.jsx';
import { UI_LOCALES, useT } from '../i18n/index.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useLetters } from '../context/LettersContext.jsx';
import { getHealth } from '../lib/api.js';
import { Button, Card, SegmentedControl } from '../components/ui.jsx';
import { IconCheck, IconGear, IconGlobe, IconMonitor, IconMoon, IconShield, IconSun, IconTrash } from '../components/Icons.jsx';

export default function Settings() {
  const t = useT();
  const { settings, update } = useSettings();
  const { letters, clearAll } = useLetters();
  const [health, setHealth] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let alive = true;
    getHealth().then((h) => alive && setHealth(h));
    return () => {
      alive = false;
    };
  }, []);

  const engineLabel = health?.keyConfigured ? t('settings.engineReal') : t('settings.engineLocal');

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">{t('settings.title')}</h1>
      </header>

      <div className="settings">
        <Card>
          <h2 className="settings__label">
            <IconGlobe width={16} height={16} />
            {t('settings.language')}
          </h2>
          <SegmentedControl
            ariaLabel={t('settings.language')}
            options={UI_LOCALES.map((l) => ({ id: l.id, label: l.label }))}
            value={settings.locale}
            onChange={(v) => update({ locale: v })}
          />
        </Card>

        <Card>
          <h2 className="settings__label">
            {settings.theme === 'dark' ? <IconMoon width={16} height={16} /> : <IconSun width={16} height={16} />}
            {t('settings.theme')}
          </h2>
          <SegmentedControl
            ariaLabel={t('settings.theme')}
            options={[
              { id: 'light', label: t('settings.themeLight') },
              { id: 'dark', label: t('settings.themeDark') },
              { id: 'system', label: t('settings.themeSystem') },
            ]}
            value={settings.theme}
            onChange={(v) => update({ theme: v })}
          />
        </Card>

        <Card>
          <h2 className="settings__label">
            <IconGear width={16} height={16} />
            {t('settings.textSize')}
          </h2>
          <SegmentedControl
            ariaLabel={t('settings.textSize')}
            options={[
              { id: 'small', label: t('settings.textSizeSmall') },
              { id: 'medium', label: t('settings.textSizeMedium') },
              { id: 'large', label: t('settings.textSizeLarge') },
            ]}
            value={settings.textSize}
            onChange={(v) => update({ textSize: v })}
          />
        </Card>

        <Card>
          <h2 className="settings__label">
            <IconShield width={16} height={16} />
            {t('settings.engine')}
          </h2>
          <p className="settings__value">
            <span className={`dot ${health?.keyConfigured ? 'dot--on' : 'dot--off'}`} aria-hidden="true" />
            {engineLabel}
            {health?.engine?.model ? ` · ${health.engine.model}` : ''}
          </p>
          <p className="settings__hint">{t('settings.engineHint')}</p>
        </Card>

        <Card>
          <h2 className="settings__label">
            <IconTrash width={16} height={16} />
            {t('settings.data')}
          </h2>
          <p className="settings__value">
            {letters.length} {t('saved.count')}
          </p>
          {confirming ? (
            <div className="confirm confirm--inline">
              <p>{t('settings.deleteAllConfirm')}</p>
              <div className="confirm__actions">
                <Button
                  variant="danger"
                  onClick={() => {
                    clearAll();
                    setConfirming(false);
                  }}
                >
                  {t('common.confirm')}
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="danger" icon={<IconTrash width={16} height={16} />} onClick={() => setConfirming(true)}>
              {t('settings.deleteAll')}
            </Button>
          )}
        </Card>

        <Card className="settings__links">
          <Link to="/privacy" className="settings__link">
            <IconShield width={16} height={16} />
            {t('settings.privacy')}
          </Link>
          <Link to="/about" className="settings__link">
            <IconCheck width={16} height={16} />
            {t('settings.about')}
          </Link>
        </Card>
      </div>
    </div>
  );
}
