import { IbmiConfig } from '../config/appConfig';

/**
 * Logger utility
 */
export const logger = {
  debug: (message: string, data?: any) => {
    if (IbmiConfig.logging.enabled && ['debug', 'info', 'warn', 'error'].includes(IbmiConfig.logging.level)) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },

  info: (message: string, data?: any) => {
    if (IbmiConfig.logging.enabled && ['info', 'warn', 'error'].includes(IbmiConfig.logging.level)) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },

  warn: (message: string, data?: any) => {
    if (IbmiConfig.logging.enabled && ['warn', 'error'].includes(IbmiConfig.logging.level)) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },

  error: (message: string, error?: any) => {
    if (IbmiConfig.logging.enabled) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
};

/**
 * String utilities for screen formatting
 */
export const StringUtils = {
  /**
   * Pad string to specified length
   */
  padRight: (str: string, length: number, char: string = ' '): string => {
    return str.length >= length ? str : str + char.repeat(length - str.length);
  },

  /**
   * Pad string to left
   */
  padLeft: (str: string, length: number, char: string = ' '): string => {
    return str.length >= length ? str : char.repeat(length - str.length) + str;
  },

  /**
   * Truncate string to specified length
   */
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  /**
   * Convert string to uppercase
   */
  toUpperCase: (str: string): string => str.toUpperCase(),

  /**
   * Convert string to lowercase
   */
  toLowerCase: (str: string): string => str.toLowerCase(),

  /**
   * Trim whitespace
   */
  trim: (str: string): string => str.trim(),
};

/**
 * Date/Time utilities
 */
export const DateUtils = {
  /**
   * Format date as MMDDYY (IBM i standard)
   */
  formatIBMiDate: (date: Date = new Date()): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}${day}${year}`;
  },

  /**
   * Format time as HHMMSS
   */
  formatIBMiTime: (date: Date = new Date()): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}${minutes}${seconds}`;
  },

  /**
   * Get timestamp for logging
   */
  getTimestamp: (): string => {
    return new Date().toISOString();
  },
};

/**
 * Validation utilities
 */
export const ValidationUtils = {
  /**
   * Validate IP address
   */
  isValidIP: (ip: string): boolean => {
    const ipRegex =
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    return ipRegex.test(ip);
  },

  /**
   * Validate hostname
   */
  isValidHostname: (hostname: string): boolean => {
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return hostnameRegex.test(hostname);
  },

  /**
   * Validate port number
   */
  isValidPort: (port: number): boolean => {
    return port > 0 && port <= 65535;
  },

  /**
   * Validate email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check if string is empty or whitespace only
   */
  isEmpty: (str: string): boolean => {
    return !str || str.trim().length === 0;
  },

  /**
   * Validate numeric input
   */
  isNumeric: (str: string): boolean => {
    return /^-?\d+(\.\d+)?$/.test(str);
  },
};

/**
 * Object utilities
 */
export const ObjectUtils = {
  /**
   * Deep clone object
   */
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Merge objects
   */
  merge: <T extends object>(target: T, source: Partial<T>): T => {
    return { ...target, ...source };
  },

  /**
   * Check if object is empty
   */
  isEmpty: (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  },

  /**
   * Get object keys
   */
  keys: (obj: Record<string, any>): string[] => {
    return Object.keys(obj);
  },

  /**
   * Get object values
   */
  values: (obj: Record<string, any>): any[] => {
    return Object.values(obj);
  },
};

/**
 * Array utilities
 */
export const ArrayUtils = {
  /**
   * Check if array is empty
   */
  isEmpty: (arr: any[]): boolean => {
    return arr.length === 0;
  },

  /**
   * Find item in array
   */
  find: <T>(arr: T[], predicate: (item: T) => boolean): T | undefined => {
    return arr.find(predicate);
  },

  /**
   * Filter array
   */
  filter: <T>(arr: T[], predicate: (item: T) => boolean): T[] => {
    return arr.filter(predicate);
  },

  /**
   * Map array
   */
  map: <T, U>(arr: T[], mapper: (item: T) => U): U[] => {
    return arr.map(mapper);
  },

  /**
   * Sort array
   */
  sort: <T>(arr: T[], compareFn?: (a: T, b: T) => number): T[] => {
    return [...arr].sort(compareFn);
  },

  /**
   * Remove duplicates
   */
  unique: <T>(arr: T[]): T[] => {
    return Array.from(new Set(arr));
  },
};

/**
 * Storage utilities (localStorage)
 */
export const StorageUtils = {
  /**
   * Set item in localStorage
   */
  setItem: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.error('Storage setItem error:', error);
    }
  },

  /**
   * Get item from localStorage
   */
  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      logger.error('Storage getItem error:', error);
      return defaultValue || null;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Storage removeItem error:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      logger.error('Storage clear error:', error);
    }
  },
};

/**
 * Error handling utilities
 */
export const ErrorUtils = {
  /**
   * Get error message
   */
  getMessage: (error: any): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  },

  /**
   * Create error object
   */
  createError: (message: string, code?: string): Error => {
    const error = new Error(message);
    (error as any).code = code;
    return error;
  },

  /**
   * Format error for display
   */
  formatError: (error: any): string => {
    const message = ErrorUtils.getMessage(error);
    return `Error: ${message}`;
  },
};
