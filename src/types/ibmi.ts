export interface IBMiConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  library?: string;
  timeout?: number;
  language?: string; // Language code: ENG, FR, DE, ES, etc.
  ccsid?: number; // Coded Character Set ID (default: 37)
  instance?: string; // Selected instance/library
}

export interface IBMiInstance {
  name: string;
  description: string;
  type: 'library' | 'partition' | 'database' | 'system';
  status: 'active' | 'inactive';
  path?: string;
}

export interface GreenScreenDisplay {
  rows: number;
  columns: number;
  data: string[][];
  attributes?: ScreenAttribute[];
  messages?: string[];
  cursorPosition?: {
    row: number;
    column: number;
  };
  language?: string;
  ccsid?: number;
}

export interface ScreenAttribute {
  row: number;
  column: number;
  attribute: string;
  color?: string;
  protect?: boolean;
  numeric?: boolean;
}

export interface ActionResponse {
  success: boolean;
  data?: any;
  message?: string;
  screenData?: GreenScreenDisplay;
  error?: string;
}

export interface IBMiAction {
  name: string;
  type: 'command' | 'function' | 'query' | 'update' | 'delete';
  description: string;
  parameters?: Record<string, any>;
  returnType?: string;
}

export type ScreenFieldType = 'input' | 'output' | 'button' | 'display';

export interface ScreenField {
  id: string;
  row: number;
  column: number;
  length: number;
  type: ScreenFieldType;
  content: string;
  protectedB?: boolean;
  numericB?: boolean;
  colorB?: string;
}

export interface KeyPressAction {
  key: string;
  action: string;
  screenFlowData?: Record<string, any>;
}

export interface ConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
  language?: string;
  ccsid?: number;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  connectionTime: Date;
  lastActivityTime: Date;
  language?: string; // Connected language
  ccsid?: number; // Connected CCSID
}
