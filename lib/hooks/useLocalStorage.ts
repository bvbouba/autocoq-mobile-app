import { customStorage } from "@/utils/auth/customStorage";
import { useEffect, useState, useCallback } from "react";

export interface UseAsyncStorageOpts {
  sync?: boolean; // Placeholder for future implementation, since AsyncStorage does not have a built-in sync mechanism
}

export type SetAsyncStorageValue<T> = T | ((prevValue: T) => T);
export type SetAsyncStorage<T> = (value: SetAsyncStorageValue<T>) => void;

export function useAsyncStorage<T>(
  key: string,
  initialValue: T,
  { sync }: UseAsyncStorageOpts = {}
): [T, SetAsyncStorage<T>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await customStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error(`Error loading key "${key}" from AsyncStorage:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key, initialValue]);

  const setValue: SetAsyncStorage<T> = useCallback(
    async (valueOrCb) => {
      try {
        const valueToStore =
          valueOrCb instanceof Function ? valueOrCb(storedValue) : valueOrCb;
        setStoredValue(valueToStore);
        await customStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting key "${key}" in AsyncStorage:`, error);
      }
    },
    [key, storedValue]
  );

  useCallback(async () => {
    try {
      await customStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing key "${key}" from AsyncStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, loading];
}
