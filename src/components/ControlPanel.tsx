import React from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
  onAction: (actionName: string, params?: any) => void;
  isConnected: boolean;
  loading?: boolean;
}

/**
 * Control Panel Component
 * Provides quick access to common IBM i actions and function keys
 */
const ControlPanel: React.FC<ControlPanelProps> = ({
  onAction,
  isConnected,
  loading = false,
}) => {
  const functionKeys = [
    { key: 'F1', label: 'Help' },
    { key: 'F2', label: 'Enter' },
    { key: 'F3', label: 'Exit' },
    { key: 'F4', label: 'Prompt' },
    { key: 'F5', label: 'Refresh' },
    { key: 'F6', label: 'Create' },
    { key: 'F7', label: 'Filter' },
    { key: 'F8', label: 'Sort' },
    { key: 'F9', label: 'Retrieve' },
    { key: 'F10', label: 'Delete' },
    { key: 'F11', label: 'Toggle' },
    { key: 'F12', label: 'Cancel' },
  ];

  const operationButtons = [
    { id: 'refreshScreen', label: 'Refresh', icon: '🔄' },
    { id: 'clearScreen', label: 'Clear', icon: '✖' },
    { id: 'printScreen', label: 'Print', icon: '🖨' },
    { id: 'exportData', label: 'Export', icon: '💾' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'getSystemInfo', label: 'System Info', icon: 'ℹ' },
  ];

  const handleFunctionKey = (key: string) => {
    onAction('navigateWithFunctionKey', { functionKey: key });
  };

  const handleOperation = (actionId: string) => {
    onAction(actionId);
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h4>Function Keys</h4>
        <div className="function-keys-grid">
          {functionKeys.map((fkey) => (
            <button
              key={fkey.key}
              className="function-key"
              onClick={() => handleFunctionKey(fkey.key)}
              disabled={!isConnected || loading}
              title={`${fkey.key} - ${fkey.label}`}
            >
              <span className="key-code">{fkey.key}</span>
              <span className="key-label">{fkey.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h4>Operations</h4>
        <div className="operations-grid">
          {operationButtons.map((btn) => (
            <button
              key={btn.id}
              className="operation-button"
              onClick={() => handleOperation(btn.id)}
              disabled={!isConnected || loading}
              title={btn.label}
            >
              <span className="icon">{btn.icon}</span>
              <span className="label">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h4>Data Operations</h4>
        <div className="data-operations">
          <button
            className="data-button"
            onClick={() => onAction('createRecord')}
            disabled={!isConnected || loading}
          >
            ➕ Create Record
          </button>
          <button
            className="data-button"
            onClick={() => onAction('updateRecord')}
            disabled={!isConnected || loading}
          >
            ✏️ Update Record
          </button>
          <button
            className="data-button delete"
            onClick={() => onAction('deleteRecord')}
            disabled={!isConnected || loading}
          >
            🗑️ Delete Record
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h4>Keyboard Help</h4>
        <div className="keyboard-help">
          <div className="help-item">
            <kbd>F1</kbd> - <span>Help</span>
          </div>
          <div className="help-item">
            <kbd>F12</kbd> - <span>Cancel</span>
          </div>
          <div className="help-item">
            <kbd>Tab</kbd> - <span>Next Field</span>
          </div>
          <div className="help-item">
            <kbd>Enter</kbd> - <span>Submit</span>
          </div>
        </div>
      </div>

      {loading && <div className="loading-indicator">Processing...</div>}
    </div>
  );
};

export default ControlPanel;
