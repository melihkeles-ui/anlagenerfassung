// Lokale Datenhaltung im Browser (IndexedDB). Es werden keine Daten an einen Server gesendet.
const DB_NAME = 'tga-anlagenerfassung';
const DB_VERSION = 2;
let dbPromise;

function open() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const r = indexedDB.open(DB_NAME, DB_VERSION);
      r.onupgradeneeded = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains('anlagen')) db.createObjectStore('anlagen', { keyPath: 'uid' });
        if (!db.objectStoreNames.contains('fotos')) {
          const f = db.createObjectStore('fotos', { keyPath: 'fid' });
          f.createIndex('uid', 'uid');
        }
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('maengel')) db.createObjectStore('maengel', { keyPath: 'uid' });
      };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }
  return dbPromise;
}

async function run(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const req = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Speichern abgebrochen (Speicher voll?)'));
  });
}

export const getAll = (store) => run(store, 'readonly', (s) => s.getAll());
export const get = (store, key) => run(store, 'readonly', (s) => s.get(key));
export const put = (store, value) => run(store, 'readwrite', (s) => s.put(value));
export const del = (store, key) => run(store, 'readwrite', (s) => s.delete(key));
export const clear = (store) => run(store, 'readwrite', (s) => s.clear());
export const byIndex = (store, index, key) => run(store, 'readonly', (s) => s.index(index).getAll(key));
export const keysByIndex = (store, index, key) => run(store, 'readonly', (s) => s.index(index).getAllKeys(key));

export async function putMany(store, values) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const s = tx.objectStore(store);
    values.forEach((v) => s.put(v));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Speichern abgebrochen (Speicher voll?)'));
  });
}

export async function getMeta(key, fallback) {
  const r = await get('meta', key);
  return r ? r.value : fallback;
}

export const setMeta = (key, value) => put('meta', { key, value });
