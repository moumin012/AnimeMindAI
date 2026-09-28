// StudentOS Progressive Web App Manager for Windows 10 Chrome and Microsoft Edge

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstallable = false;
    this.isInstalled = false;
    this.isUpdateAvailable = false;
    this.waitingWorker = null;
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  init() {
    if (typeof window === 'undefined') return;

    // Check if app is running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    this.isInstalled = isStandalone;
    this.emit('installed_status', this.isInstalled);

    // Listen for beforeinstallprompt (Chromium / Windows 10 Chrome & Edge)
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent default mini-infobar
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable = true;
      this.emit('installable', true);
    });

    // Listen for appinstalled
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.isInstallable = false;
      this.deferredPrompt = null;
      this.emit('installed', true);
      this.emit('installable', false);
    });

    // Register Service Worker in production
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('[StudentOS PWA] Service Worker registered successfully:', registration.scope);

            // Check if there's an update waiting
            if (registration.waiting) {
              this.waitingWorker = registration.waiting;
              this.isUpdateAvailable = true;
              this.emit('update_ready', true);
            }

            // Listen for new worker installing
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.waitingWorker = newWorker;
                    this.isUpdateAvailable = true;
                    this.emit('update_ready', true);
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('[StudentOS PWA] Service Worker registration failed:', err);
          });

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      });
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      return { outcome: 'manual_instructions', reason: 'Prompt not available' };
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.isInstallable = false;
    this.emit('installable', false);
    return { outcome };
  }

  applyUpdate() {
    if (this.waitingWorker) {
      this.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }
}

export const pwaService = new PWAManager();
