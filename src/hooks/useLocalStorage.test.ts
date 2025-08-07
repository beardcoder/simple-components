import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value.toString();
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
  key: vi.fn(),
  length: 0,
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const storage = useLocalStorage('test-key', 'default');
    expect(storage.value).toBe('default');
  });

  it('should initialize with stored value when localStorage has data', () => {
    localStorageMock.store['test-key'] = JSON.stringify('stored-value');
    const storage = useLocalStorage('test-key', 'default');
    expect(storage.value).toBe('stored-value');
  });

  it('should save value to localStorage when changed', () => {
    const storage = useLocalStorage('test-key', 'initial');
    storage.value = 'new-value';

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
  });

  it('should remove from localStorage when set to initial value', () => {
    const storage = useLocalStorage('test-key', 'initial');
    storage.value = 'changed';
    storage.value = 'initial'; // Back to initial

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle objects and arrays', () => {
    const initialObj = { count: 0 };
    const storage = useLocalStorage('obj-key', initialObj);

    const newObj = { count: 1, name: 'test' };
    storage.value = newObj;

    expect(localStorageMock.setItem).toHaveBeenCalledWith('obj-key', JSON.stringify(newObj));
  });

  it('should reset to initial value', () => {
    const storage = useLocalStorage('test-key', 'initial');
    storage.value = 'changed';

    storage.reset();

    expect(storage.value).toBe('initial');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage full');
    });

    const storage = useLocalStorage('test-key', 'initial');

    // Should not throw
    expect(() => {
      storage.value = 'new-value';
    }).not.toThrow();

    // Restore original function
    localStorageMock.setItem = originalSetItem;
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorageMock.store['test-key'] = 'invalid-json{';

    const storage = useLocalStorage('test-key', 'default');
    expect(storage.value).toBe('default');
  });

  it('should notify subscribers when value changes', () => {
    const storage = useLocalStorage('test-key', 0);
    const subscriber = vi.fn();

    storage.subscribe(subscriber);
    storage.value = 5;

    expect(subscriber).toHaveBeenCalledWith(5);
  });

  it('should work with different data types', () => {
    // String
    const stringStorage = useLocalStorage('string-key', 'test');
    expect(stringStorage.value).toBe('test');

    // Number
    const numberStorage = useLocalStorage('number-key', 42);
    expect(numberStorage.value).toBe(42);

    // Boolean
    const boolStorage = useLocalStorage('bool-key', true);
    expect(boolStorage.value).toBe(true);

    // Array
    const arrayStorage = useLocalStorage('array-key', [1, 2, 3]);
    expect(arrayStorage.value).toEqual([1, 2, 3]);

    // Object
    const objStorage = useLocalStorage('obj-key', { name: 'test' });
    expect(objStorage.value).toEqual({ name: 'test' });
  });
});
