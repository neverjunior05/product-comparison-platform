import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { readStorage, writeStorage } from "../utils/storage";

/**
 * useState that mirrors its value into localStorage and stays in sync
 * across browser tabs via the `storage` event.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStorage<T>(key, initial));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch {
          /* ignore malformed */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const set = useCallback<Dispatch<SetStateAction<T>>>((next) => setValue(next), []);
  return [value, set];
}
