// StudentOS IndexedDB Persistent Layer with Data Migration & Fallback
// Ensures resilient offline-first persistence on Windows 10 Chrome and Microsoft Edge

const DB_NAME = 'StudentOS_DB';
const DB_VERSION = 1;

class IDBManager {
  constructor() {
    this.db = null;
    this.isSupported = typeof window !== 'undefined' && 'indexedDB' in window;
    this.initPromise = null;
  }

  async init() {
    if (!this.isSupported) return null;
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const stores = [
            'users',
            'classes',
            'lessons',
            'assignments',
            'tests',
            'test_results',
            'flashcards',
            'tasks',
            'schedule',
            'study_sessions',
            'settings',
            'offline_queue'
          ];

          stores.forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          });
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.warn('[StudentOS IDB] Failed to open IndexedDB, using localStorage fallback:', event.target.error);
          resolve(null);
        };
      } catch (err) {
        console.warn('[StudentOS IDB] Exception opening IndexedDB:', err);
        resolve(null);
      }
    });

    return this.initPromise;
  }

  async getAll(storeName) {
    const db = await this.init();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async put(storeName, item) {
    const db = await this.init();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async putMany(storeName, items) {
    const db = await this.init();
    if (!db || !Array.isArray(items)) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        items.forEach(item => store.put(item));
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async delete(storeName, id) {
    const db = await this.init();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }
}

export const idbService = new IDBManager();
