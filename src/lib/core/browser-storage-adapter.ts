import type { StorageAdapter } from "@/lib/core/storage-adapter";

export class BrowserStorageAdapter implements StorageAdapter {
  read<T>(key: string): T[] {
    if (typeof window === "undefined") return [];

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return [];

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed as T[];
    } catch {
      return [];
    }
  }

  write<T>(key: string, value: T[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

let defaultAdapter: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (!defaultAdapter) {
    defaultAdapter = new BrowserStorageAdapter();
  }
  return defaultAdapter;
}
