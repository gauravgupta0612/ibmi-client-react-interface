import React, { useState, useEffect } from 'react';
import type { IBMiConnectionConfig, IBMiInstance } from '../types/ibmi';
import { SupportedLanguages, SupportedCCSID } from '../config/appConfig';
import IBMiConnectionService from '../services/IBMiConnectionService';
import './ConnectionPanel.css';

interface ConnectionPanelProps {
  onConnect: (config: IBMiConnectionConfig) => Promise<void>;
  onDisconnect: () => Promise<void>;
  isConnected: boolean;
  error?: string | null;
  loading?: boolean;
}

/**
 * Connection Panel Component
 * Handles IBM i connection configuration and management
 */
const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  onConnect,
  onDisconnect,
  isConnected,
  error,
  loading = false,
}) => {
  const [config, setConfig] = useState<IBMiConnectionConfig>({
    host: localStorage.getItem('ibmi_host') || 'localhost',
    port: parseInt(localStorage.getItem('ibmi_port') || '23'),
    username: localStorage.getItem('ibmi_username') || '',
    password: '',
    timeout: 30000,
    language: localStorage.getItem('ibmi_language') || 'ENG',
    ccsid: parseInt(localStorage.getItem('ibmi_ccsid') || '37'),
    instance: localStorage.getItem('ibmi_instance') || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [instances, setInstances] = useState<IBMiInstance[]>([]);
  const [showInstanceSelection, setShowInstanceSelection] = useState(false);
  const [loadingInstances, setLoadingInstances] = useState(false);

  // Fetch instances when successfully connected
  useEffect(() => {
    if (isConnected && !error && showInstanceSelection === false) {
      fetchInstances();
    }
  }, [isConnected, error]);

  const handleInputChange = (field: keyof IBMiConnectionConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConnect = async () => {
    // Save config to localStorage
    localStorage.setItem('ibmi_host', config.host);
    localStorage.setItem('ibmi_port', config.port.toString());
    localStorage.setItem('ibmi_username', config.username);
    localStorage.setItem('ibmi_language', config.language || 'ENG');
    localStorage.setItem('ibmi_ccsid', config.ccsid?.toString() || '37');

    await onConnect(config);
  };

  const fetchInstances = async () => {
    setLoadingInstances(true);
    const instancesResult = await IBMiConnectionService.getInstances();
    setLoadingInstances(false);

    if (instancesResult.success && instancesResult.data) {
      setInstances(instancesResult.data);
      setShowInstanceSelection(true);
    }
  };

  const handleInstanceSelect = (instanceName: string) => {
    setConfig((prev) => ({
      ...prev,
      instance: instanceName,
    }));
    localStorage.setItem('ibmi_instance', instanceName);
    setShowInstanceSelection(false);
  };

  return (
    <div className="connection-panel">
      <div className="panel-header">
        <h3>IBM i Connection</h3>
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '● Connected' : '● Disconnected'}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="host">Host Address:</label>
        <input
          id="host"
          type="text"
          value={config.host}
          onChange={(e) => handleInputChange('host', e.target.value)}
          disabled={isConnected || loading}
          placeholder="192.168.1.100 or as400.company.com"
        />
      </div>

      <div className="form-row">
        <div className="form-group form-group-half">
          <label htmlFor="port">Port:</label>
          <input
            id="port"
            type="number"
            value={config.port}
            onChange={(e) => handleInputChange('port', parseInt(e.target.value))}
            disabled={isConnected || loading}
            min="1"
            max="65535"
          />
        </div>

        <div className="form-group form-group-half">
          <label htmlFor="timeout">Timeout (ms):</label>
          <input
            id="timeout"
            type="number"
            value={config.timeout}
            onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
            disabled={isConnected || loading}
            min="1000"
            step="1000"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={config.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          disabled={isConnected || loading}
          placeholder="User ID"
        />
      </div>

      <div className="form-group password-group">
        <label htmlFor="password">Password:</label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={config.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            disabled={isConnected || loading}
            placeholder="Password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isConnected || loading}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-half">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            value={config.language || 'ENG'}
            onChange={(e) => handleInputChange('language', e.target.value)}
            disabled={isConnected || loading}
          >
            {Object.entries(SupportedLanguages).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.nativeName} ({code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-half">
          <label htmlFor="ccsid">CCSID:</label>
          <select
            id="ccsid"
            value={config.ccsid || 37}
            onChange={(e) => handleInputChange('ccsid', parseInt(e.target.value))}
            disabled={isConnected || loading}
          >
            {Object.entries(SupportedCCSID).map(([_, ccsidInfo]) => (
              <option key={ccsidInfo.id} value={ccsidInfo.id}>
                {ccsidInfo.id} - {ccsidInfo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showInstanceSelection && instances.length > 0 && (
        <div className="instance-selection">
          <div className="instance-header">
            <h4>Select Instance/Library:</h4>
            <p>Choose which instance you want to work with</p>
          </div>
          <div className="instance-list">
            {instances.map((instance) => (
              <button
                key={instance.name}
                className="instance-button"
                onClick={() => handleInstanceSelect(instance.name)}
                disabled={loadingInstances}
              >
                <div className="instance-name">{instance.name}</div>
                <div className="instance-desc">{instance.description}</div>
                <div className="instance-type">
                  <span className={`badge ${instance.status}`}>{instance.type}</span>
                  <span className={`status ${instance.status}`}>{instance.status}</span>
                </div>
              </button>
            ))}
          </div>
          {loadingInstances && <div className="loading-instances">Loading instances...</div>}
        </div>
      )}

      <div className="button-group">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={!config.host || !config.username || loading}
            className="btn btn-primary"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            disabled={loading}
            className="btn btn-danger"
          >
            {loading ? 'Disconnecting...' : 'Disconnect'}
          </button>
        )}
      </div>

      <div className="connection-tips">
        <h4>Connection Tips:</h4>
        <ul>
          <li>Default IBM i telnet port is 23</li>
          <li>Some systems use custom ports (e.g., 992 for SSL)</li>
          <li>Keep credentials secure - never share passwords</li>
          <li>Check network connectivity before attempting connection</li>
          <li><strong>DEMO MODE:</strong> Set VITE_DEMO_MODE=true in .env to test without backend</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionPanel;
