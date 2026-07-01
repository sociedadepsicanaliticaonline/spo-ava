import { initialSeed, type SeedData } from "@/data/seed";

const STORAGE_KEY = "spo-learning:db:v1";
const SESSION_KEY = "spo-learning:session:v1";

type Tables = keyof SeedData;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function isBrowser() {
  return typeof window !== "undefined";
}

function loadDb(): SeedData {
  if (!isBrowser()) return clone(initialSeed);
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = clone(initialSeed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  try {
    return JSON.parse(raw) as SeedData;
  } catch {
    const fresh = clone(initialSeed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function saveDb(db: SeedData) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export const db = {
  read: loadDb,
  write: saveDb,
  reset() {
    if (!isBrowser()) return;
    const fresh = clone(initialSeed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  },
  list<T extends Tables>(table: T): SeedData[T] {
    return loadDb()[table];
  },
  upsert<T extends Tables>(table: T, predicate: (row: any) => boolean, patch: Partial<any>): SeedData[T] {
    const data = loadDb();
    const list = [...(data[table] as any[])];
    const idx = list.findIndex(predicate);
    if (idx === -1) {
      const newRow = { id: `${table}-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...patch };
      list.push(newRow);
      (data as any)[table] = list;
      saveDb(data);
      return newRow as any;
    }
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    (data as any)[table] = list;
    saveDb(data);
    return list[idx] as any;
  },
  insert<T extends Tables>(table: T, row: any) {
    const data = loadDb();
    const list = [...(data[table] as any[]), row];
    (data as any)[table] = list;
    saveDb(data);
    return row;
  },
  remove<T extends Tables>(table: T, predicate: (row: any) => boolean) {
    const data = loadDb();
    const list = (data[table] as any[]).filter((r) => !predicate(r));
    (data as any)[table] = list;
    saveDb(data);
  },
  updateWhere<T extends Tables>(table: T, predicate: (row: any) => boolean, patch: Partial<any>) {
    const data = loadDb();
    const list = (data[table] as any[]).map((r) => (predicate(r) ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r));
    (data as any)[table] = list;
    saveDb(data);
  },
};

export const session = {
  read(): { userId: string | null } {
    if (!isBrowser()) return { userId: null };
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : { userId: null };
    } catch {
      return { userId: null };
    }
  },
  write(value: { userId: string | null }) {
    if (!isBrowser()) return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(value));
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(SESSION_KEY);
  },
};

export function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function genValidationCode() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SPO-${part()}-${part()}-${part()}`;
}
