/**
 * Application Configuration
 * Centralized configuration for IBM i connection and application settings
 */

export const IbmiConfig = {
  // Connection Settings
  connection: {
    defaultHost: import.meta.env.VITE_IBMI_HOST || 'localhost',
    defaultPort: parseInt(import.meta.env.VITE_IBMI_PORT || '23'),
    defaultTimeout: parseInt(import.meta.env.VITE_IBMI_TIMEOUT || '30000'),
    keepAliveInterval: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
  },

  // API Settings
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    headers: {
      'Content-Type': 'application/json',
      'X-App-Version': '1.0.0',
    },
  },

  // Green Screen Settings
  greenScreen: {
    rows: parseInt(import.meta.env.VITE_SCREEN_ROWS || '24'),
    columns: parseInt(import.meta.env.VITE_SCREEN_COLS || '80'),
    refreshIntervalMs: 5000,
    enableAutoRefresh: false,
  },

  // UI Settings
  ui: {
    theme: (import.meta.env.VITE_THEME || 'light') as 'light' | 'dark',
    compactMode: false,
    enableAnimations: true,
  },

  // Logging
  logging: {
    enabled: import.meta.env.DEV,
    level: (import.meta.env.VITE_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
  },

  // Feature Flags
  features: {
    enableAutoConnect: false,
    enableScreenCapture: true,
    enableDataExport: true,
    enableSearchFunction: true,
    enableBatchOperations: true,
  },

  // Demo Mode - Works without backend server for testing
  demo: {
    enabled: import.meta.env.VITE_DEMO_MODE === 'true',
    simulateLatency: 500, // ms delay to simulate real connection
  },
};

/**
 * Supported Languages
 */
export const SupportedLanguages = {
  ENG: { code: 'ENG', name: 'English', nativeName: 'English' },
  FRA: { code: 'FRA', name: 'French', nativeName: 'Français' },
  DEU: { code: 'DEU', name: 'German', nativeName: 'Deutsch' },
  ESP: { code: 'ESP', name: 'Spanish', nativeName: 'Español' },
  ITA: { code: 'ITA', name: 'Italian', nativeName: 'Italiano' },
  NLD: { code: 'NLD', name: 'Dutch', nativeName: 'Nederlands' },
  JPN: { code: 'JPN', name: 'Japanese', nativeName: '日本語' },
  CHS: { code: 'CHS', name: 'Chinese Simplified', nativeName: '简体中文' },
  KOR: { code: 'KOR', name: 'Korean', nativeName: '한국어' },
  RUS: { code: 'RUS', name: 'Russian', nativeName: 'Русский' },
  POR: { code: 'POR', name: 'Portuguese', nativeName: 'Português' },
  POL: { code: 'POL', name: 'Polish', nativeName: 'Polski' },
};

/**
 * Supported CCSID (Coded Character Set ID)
 */
export const SupportedCCSID = {
  37: { id: 37, name: 'EBCDIC - US/Canada', region: 'North America' },
  273: { id: 273, name: 'EBCDIC - German/Austrian', region: 'Europe' },
  285: { id: 285, name: 'EBCDIC - United Kingdom', region: 'Europe' },
  297: { id: 297, name: 'EBCDIC - French', region: 'Europe' },
  500: { id: 500, name: 'EBCDIC - International', region: 'International' },
  875: { id: 875, name: 'EBCDIC - Greek', region: 'Europe' },
  1025: { id: 1025, name: 'EBCDIC - Cyrillic', region: 'Europe/Asia' },
  1026: { id: 1026, name: 'EBCDIC - Turkish', region: 'Europe/Asia' },
  1047: { id: 1047, name: 'EBCDIC - Latin-1', region: 'Europe' },
  1140: { id: 1140, name: 'EBCDIC - US/Canada (Euro)', region: 'North America' },
  1141: { id: 1141, name: 'EBCDIC - German/Austrian (Euro)', region: 'Europe' },
  1142: { id: 1142, name: 'EBCDIC - Danish/Norwegian (Euro)', region: 'Europe' },
  1143: { id: 1143, name: 'EBCDIC - Finnish/Swedish (Euro)', region: 'Europe' },
  1144: { id: 1144, name: 'EBCDIC - Italian (Euro)', region: 'Europe' },
  1145: { id: 1145, name: 'EBCDIC - Spanish (Euro)', region: 'Europe' },
  1146: { id: 1146, name: 'EBCDIC - United Kingdom (Euro)', region: 'Europe' },
  1147: { id: 1147, name: 'EBCDIC - French (Euro)', region: 'Europe' },
  1148: { id: 1148, name: 'EBCDIC - International (Euro)', region: 'International' },
};

/**
 * Screen attributes for text display
 */
export const ScreenAttributes = {
  NORMAL: 'normal',
  PROTECTED: 'protected',
  NUMERIC_ONLY: 'numeric',
  HIDDEN: 'hidden',
  HIGHLIGHT: 'highlight',
  REVERSE_VIDEO: 'reverse',
  UNDERLINE: 'underline',
  BLINK: 'blink',
};

/**
 * Color mappings for green screen
 */
export const ScreenColors = {
  DEFAULT: '#00ff00',
  RED: '#ff0000',
  YELLOW: '#ffff00',
  CYAN: '#00ffff',
  WHITE: '#ffffff',
  BLACK: '#000000',
};

/**
 * Function key mappings
 */
export const FunctionKeyMap = {
  F1: { displayName: 'Help', action: 'HELP' },
  F2: { displayName: 'Enter', action: 'ENTER' },
  F3: { displayName: 'Exit', action: 'EXIT' },
  F4: { displayName: 'Prompt', action: 'PROMPT' },
  F5: { displayName: 'Refresh', action: 'REFRESH' },
  F6: { displayName: 'Create', action: 'CREATE' },
  F7: { displayName: 'Filter', action: 'FILTER' },
  F8: { displayName: 'Sort', action: 'SORT' },
  F9: { displayName: 'Retrieve', action: 'RETRIEVE' },
  F10: { displayName: 'Delete', action: 'DELETE' },
  F11: { displayName: 'Toggle', action: 'TOGGLE' },
  F12: { displayName: 'Cancel', action: 'CANCEL' },
};

/**
 * Error messages
 */
export const ErrorMessages = {
  CONNECTION_FAILED: 'Failed to connect to IBM i system',
  CONNECTION_TIMEOUT: 'Connection timeout - server not responding',
  AUTHENTICATION_FAILED: 'Authentication failed - check credentials',
  SESSION_EXPIRED: 'Session expired - please reconnect',
  INVALID_INPUT: 'Invalid input - please check your entries',
  COMMAND_FAILED: 'Command execution failed',
  QUERY_FAILED: 'Query execution failed',
  NETWORK_ERROR: 'Network error - check your connection',
  SERVER_ERROR: 'Server error - please try again later',
};

/**
 * Success messages
 */
export const SuccessMessages = {
  CONNECTED: 'Successfully connected to IBM i system',
  DISCONNECTED: 'Disconnected from IBM i system',
  COMMAND_SUCCESS: 'Command executed successfully',
  QUERY_SUCCESS: 'Query completed successfully',
  DATA_SAVED: 'Data saved successfully',
  SCREEN_REFRESHED: 'Screen refreshed',
};
