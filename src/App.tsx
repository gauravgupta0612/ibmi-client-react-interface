import { useState } from 'react';
import type { IBMiConnectionConfig } from './types/ibmi';
import GreenScreen from './components/GreenScreen';
import ConnectionPanel from './components/ConnectionPanel';
import ControlPanel from './components/ControlPanel';
import { useIBMiConnection, useGreenScreen } from './hooks/useIBMi';
import { IBMiActions } from './actions/ibmiActions';
import { logger } from './utils/helpers';
import './App.css';

/**
 * Main Application Component
 * IBM i Green Screen Interface for React
 */
function App() {
  const connection = useIBMiConnection();
  const greenScreen = useGreenScreen();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleConnect = async (config: IBMiConnectionConfig) => {
    logger.info('Attempting to connect to IBM i system', { host: config.host, port: config.port });
    const result = await connection.connect(config);
    
    if (result.success) {
      logger.info('Successfully connected to IBM i');
      // Fetch initial screen display
      await greenScreen.refreshScreen();
    } else {
      logger.error('Connection failed', result.error);
    }
  };

  const handleDisconnect = async () => {
    logger.info('Disconnecting from IBM i');
    await connection.disconnect();
  };

  const handleAction = async (actionName: string, params?: any) => {
    logger.info(`Executing action: ${actionName}`, params);

    try {
      const actionKey = actionName as keyof typeof IBMiActions;
      if (typeof IBMiActions[actionKey] === 'function') {
        const result = await (IBMiActions[actionKey] as any)(params);
        
        if (result.success) {
          logger.info(`Action ${actionName} completed successfully`);
          if (result.screenData) {
            // Screen was updated by the action
          }
        } else {
          logger.error(`Action ${actionName} failed`, result.error);
        }
      }
    } catch (error) {
      logger.error(`Error executing action ${actionName}`, error);
    }
  };

  const handleKeyPress = async (key: string) => {
    logger.info(`Key pressed: ${key}`);
    
    if (key.startsWith('F')) {
      // Handle function key
      await handleAction('navigateWithFunctionKey', { functionKey: key });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🔵 IBM Green Screen Interface</h1>
          <div className="connection-status">
            <span className={`status-badge ${connection.isConnected ? 'connected' : 'disconnected'}`}>
              {connection.isConnected ? '● Connected' : '● Disconnected'}
            </span>
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar with Connection and Control Panels */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            ☰
          </button>

          {sidebarOpen && (
            <div className="sidebar-content">
              <ConnectionPanel
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                isConnected={connection.isConnected}
                error={connection.error}
                loading={connection.isLoading}
              />

              {connection.isConnected && (
                <ControlPanel
                  onAction={handleAction}
                  isConnected={connection.isConnected}
                  loading={greenScreen.loading}
                />
              )}
            </div>
          )}
        </aside>

        {/* Main Green Screen Display */}
        <main className="main-content">
          <GreenScreen
            screenData={greenScreen.screen}
            onKeyPress={handleKeyPress}
            loading={greenScreen.loading}
            language={connection.language}
            ccsid={connection.ccsid}
            isConnected={connection.isConnected}
          />
        </main>
      </div>

      {/* Footer with Status Information */}
      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-info">
            {connection.isConnected
              ? `Connected to IBM i • Session active`
              : 'Not connected'}
          </span>
          <span className="footer-version">IBM i Client v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
