import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { DayRecord, Settings } from '../types';
import { DEFAULT_SETTINGS } from './dailyTemplate';

interface OutreachDB extends DBSchema {
  days: {
    key: string;
    value: DayRecord;
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = 'outreach-tracker';
const DB_VERSION = 1;
const SETTINGS_KEY = 'main';

let dbPromise: Promise<IDBPDatabase<OutreachDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OutreachDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('days')) {
          db.createObjectStore('days', { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      }
    });
  }
  return dbPromise;
}

export async function getDay(date: string): Promise<DayRecord | undefined> {
  const db = await getDB();
  return db.get('days', date);
}

export async function putDay(record: DayRecord): Promise<void> {
  const db = await getDB();
  await db.put('days', { ...record, updatedAt: new Date().toISOString() });
}

export async function getAllDays(): Promise<DayRecord[]> {
  const db = await getDB();
  return db.getAll('days');
}

export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  const s = await db.get('settings', SETTINGS_KEY);
  return s ?? DEFAULT_SETTINGS;
}

export async function putSettings(settings: Settings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, SETTINGS_KEY);
}
