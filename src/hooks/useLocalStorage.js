import { useState, useEffect } from 'react';

/**
 * Custom React hook to synchronize local state with window.localStorage.
 * @param {string} key - The localStorage key.
 * @param {any} initialValue - The fallback value if no data exists.
 * @returns {[any, Function]} A stateful value and a function to update it.
 */
export default function useLocalStorage(key, initialValue) {
  // Initialize state with value from localStorage or fallback
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep localStorage updated when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
