export interface StorageAdapter {
  read<T>(key: string): T[];
  write<T>(key: string, value: T[]): void;
}
