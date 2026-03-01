import type {
  IBMiConnectionConfig,
  GreenScreenDisplay,
  ActionResponse,
  ConnectionState,
  SessionData,
  KeyPressAction,
} from '../types/ibmi';
import { IbmiConfig } from '../config/appConfig';

/**
 * IBMiConnectionService handles all communication with the IBM i (AS400) system
 * Supports both real backend API and demo/mock mode for testing
 */
class IBMiConnectionService {
  private isConnected: boolean = false;
  private sessionData: SessionData | null = null;
  private connectionTimeout: ReturnType<typeof setInterval> | null = null;
  private baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  private demoMode: boolean = IbmiConfig.demo.enabled;

  /**
   * Initialize connection to IBM i system
   */
  async connect(cfg: IBMiConnectionConfig): Promise<ActionResponse> {
    try {
      // Demo Mode
      if (this.demoMode) {
        return await this.connectDemo(cfg);
      }

      // Real Backend Mode
      const response = await fetch(`${this.baseURL}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });

      if (!response.ok) {
        throw new Error(`Connection failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.isConnected = true;
      this.sessionData = data.sessionData;
      this.startKeepAlive();

      return {
        success: true,
        message: 'Connected to IBM i system',
        data: data.sessionData,
      };
    } catch (error) {
      this.isConnected = false;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown connection error',
      };
    }
  }

  /**
   * Disconnect from IBM i system
   */
  async disconnect(): Promise<ActionResponse> {
    try {
      if (this.connectionTimeout) {
        clearInterval(this.connectionTimeout);
      }

      if (this.sessionData?.sessionId) {
        await fetch(`${this.baseURL}/disconnect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: this.sessionData.sessionId }),
        });
      }

      this.isConnected = false;
      this.sessionData = null;

      return {
        success: true,
        message: 'Disconnected from IBM i system',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Disconnect error',
      };
    }
  }

  /**
   * Get available instances from connected IBM i system
   */
  async getInstances(): Promise<ActionResponse> {
    try {
      if (!this.isConnected || !this.sessionData?.sessionId) {
        return {
          success: false,
          error: 'Not connected to IBM i system',
        };
      }

      // Demo Mode
      if (this.demoMode) {
        return await this.getInstancesDemo();
      }

      // Real Backend Mode
      const response = await fetch(`${this.baseURL}/instances/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionData.sessionId,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to retrieve instances: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.instances || [],
        message: 'Instances retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error retrieving instances',
      };
    }
  }

  /**
   * Get current screen display from green screen
   */
  async getScreenDisplay(): Promise<ActionResponse> {
    try {
      if (!this.isConnected || !this.sessionData?.sessionId) {
        return {
          success: false,
          error: 'Not connected to IBM i system',
        };
      }

      const response = await fetch(`${this.baseURL}/screen/display`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionData.sessionId,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to retrieve screen: ${response.statusText}`);
      }

      const screenData = await response.json();
      this.updateLastActivity();

      return {
        success: true,
        screenData: screenData as GreenScreenDisplay,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error retrieving screen',
      };
    }
  }

  /**
   * Send input data to green screen
   */
  async sendInput(inputData: Record<string, string>): Promise<ActionResponse> {
    try {
      if (!this.isConnected || !this.sessionData?.sessionId) {
        return {
          success: false,
          error: 'Not connected to IBM i system',
        };
      }

      const response = await fetch(`${this.baseURL}/screen/input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionData.sessionId,
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error(`Failed to send input: ${response.statusText}`);
      }

      const result = await response.json();
      this.updateLastActivity();

      return {
        success: true,
        screenData: result as GreenScreenDisplay,
        message: 'Input sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error sending input',
      };
    }
  }

  /**
   * Handle key press actions on green screen
   */
  async handleKeyPress(keyAction: KeyPressAction): Promise<ActionResponse> {
    try {
      if (!this.isConnected || !this.sessionData?.sessionId) {
        return {
          success: false,
          error: 'Not connected to IBM i system',
        };
      }

      const response = await fetch(`${this.baseURL}/screen/keypress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionData.sessionId,
        },
        body: JSON.stringify(keyAction),
      });

      if (!response.ok) {
        throw new Error(`Key press failed: ${response.statusText}`);
      }

      const result = await response.json();
      this.updateLastActivity();

      return {
        success: true,
        screenData: result as GreenScreenDisplay,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error handling key press',
      };
    }
  }

  /**
   * Execute a command on IBM i system
   */
  async executeCommand(command: string, parameters?: Record<string, any>): Promise<ActionResponse> {
    try {
      if (!this.isConnected || !this.sessionData?.sessionId) {
        return {
          success: false,
          error: 'Not connected to IBM i system',
        };
      }

      const response = await fetch(`${this.baseURL}/command/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionData.sessionId,
        },
        body: JSON.stringify({ command, parameters }),
      });

      if (!response.ok) {
        throw new Error(`Command execution failed: ${response.statusText}`);
      }

      const result = await response.json();
      this.updateLastActivity();

      return {
        success: true,
        data: result,
        message: 'Command executed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error executing command',
      };
    }
  }

  /**
   * Execute a query to retrieve data from IBM i
   */
  async executeQuery(query: string, parameters?: Record<string, any>): Promise<ActionResponse> {
    try {
      if (!this.isConnected || !this.sessionData?.sessionId) {
        return {
          success: false,
          error: 'Not connected to IBM i system',
        };
      }

      const response = await fetch(`${this.baseURL}/query/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionData.sessionId,
        },
        body: JSON.stringify({ query, parameters }),
      });

      if (!response.ok) {
        throw new Error(`Query execution failed: ${response.statusText}`);
      }

      const result = await response.json();
      this.updateLastActivity();

      return {
        success: true,
        data: result,
        message: 'Query executed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error executing query',
      };
    }
  }

  /**
   * Get connection state
   */
  getConnectionState(): ConnectionState {
    return {
      isConnected: this.isConnected,
      isLoading: false,
      error: null,
      lastUpdated: this.sessionData?.lastActivityTime,
    };
  }

  /**
   * Private helper methods
   */

  private startKeepAlive(): void {
    this.connectionTimeout = setInterval(() => {
      if (this.isConnected && this.sessionData?.sessionId) {
        this.heartbeat();
      }
    }, 30000); // Keep alive every 30 seconds
  }

  private async heartbeat(): Promise<void> {
    try {
      if (!this.sessionData?.sessionId) return;

      await fetch(`${this.baseURL}/session/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionData.sessionId,
        },
      });
    } catch (error) {
      console.error('Heartbeat failed:', error);
    }
  }

  private updateLastActivity(): void {
    if (this.sessionData) {
      this.sessionData.lastActivityTime = new Date();
    }
  }

  /**
   * DEMO MODE HELPERS - Works without backend server
   */

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private createDemoSessionData(cfg: IBMiConnectionConfig): SessionData {
    return {
      sessionId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: cfg.username || 'DEMO_USER',
      connectionTime: new Date(),
      lastActivityTime: new Date(),
      language: cfg.language || 'ENG',
      ccsid: cfg.ccsid || 37,
    };
  }

  private createDemoScreenDisplay(text: string, language: string, ccsid: number): GreenScreenDisplay {
    const rows = 24;
    const cols = 80;
    const screenData: string[][] = [];

    // Initialize screen with empty rows
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(' ');
      }
      screenData.push(row);
    }

    // Add text to screen
    const lines = text.split('\n');
    lines.forEach((line, lineIdx) => {
      if (lineIdx < rows) {
        const chars = line.split('');
        chars.forEach((char, charIdx) => {
          if (charIdx < cols) {
            screenData[lineIdx][charIdx] = char;
          }
        });
      }
    });

    return {
      rows,
      columns: cols,
      data: screenData,
      cursorPosition: { row: 0, column: 0 },
      attributes: [],
      messages: [],
      language,
      ccsid,
    };
  }

  private async connectDemo(cfg: IBMiConnectionConfig): Promise<ActionResponse> {
    try {
      // Simulate connection delay
      await this.delay(IbmiConfig.demo.simulateLatency);

      const sessionData = this.createDemoSessionData(cfg);
      this.sessionData = sessionData;
      this.isConnected = true;
      this.startKeepAlive();

      const demoScreen = this.createDemoScreenDisplay(
        `
╔════════════════════════════════════════════════════════════════════════════╗
║                  IBM i GREEN SCREEN TERMINAL                              ║
║                      (DEMO MODE - NO BACKEND)                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Welcome to IBM i Green Screen Interface!                                 ║
║                                                                            ║
║  Connected User: ${cfg.username || 'DEMO_USER'}                           ║
║  Language: ${cfg.language || 'ENG'}                                         ║
║  CCSID: ${cfg.ccsid || 37}                                                   ║
║                                                                            ║
║  This is DEMO MODE - simulating IBM i connection                          ║
║  No backend server required for testing                                   ║
║                                                                            ║
║  Available Functions (F-Keys):                                            ║
║  F1=Help  F3=Exit  F5=Refresh  F12=Cancel                                 ║
║                                                                            ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`,
        cfg.language || 'ENG',
        cfg.ccsid || 37
      );

      return {
        success: true,
        message: 'Connected to IBM i system (DEMO MODE)',
        data: sessionData,
        screenData: demoScreen,
      };
    } catch (error) {
      this.isConnected = false;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Demo connection error',
      };
    }
  }

  private async getInstancesDemo(): Promise<ActionResponse> {
    try {
      // Simulate getting instances
      await this.delay(IbmiConfig.demo.simulateLatency);

      const mockInstances = [
        {
          name: 'QGPL',
          description: 'General Purpose Library',
          type: 'library' as const,
          status: 'active' as const,
          path: '/QSYS.LIB/QGPL.LIB',
        },
        {
          name: 'QSYS',
          description: 'System Library',
          type: 'library' as const,
          status: 'active' as const,
          path: '/QSYS.LIB/QSYS.LIB',
        },
        {
          name: 'MYLIB',
          description: 'Application Library',
          type: 'library' as const,
          status: 'active' as const,
          path: '/QSYS.LIB/MYLIB.LIB',
        },
        {
          name: 'TESTLIB',
          description: 'Test/Development Library',
          type: 'library' as const,
          status: 'active' as const,
          path: '/QSYS.LIB/TESTLIB.LIB',
        },
        {
          name: 'PRODDATA',
          description: 'Production Data Library',
          type: 'database' as const,
          status: 'active' as const,
          path: '/QSYS.LIB/PRODDATA.LIB',
        },
      ];

      return {
        success: true,
        data: mockInstances,
        message: 'Instances retrieved successfully (DEMO MODE)',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error retrieving instances',
      };
    }
  }
}

export default new IBMiConnectionService();
