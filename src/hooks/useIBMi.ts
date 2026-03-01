import { useEffect, useState, useCallback } from 'react';
import IBMiConnectionService from '../services/IBMiConnectionService';
import type {
  IBMiConnectionConfig,
  GreenScreenDisplay,
  ActionResponse,
  ConnectionState,
} from '../types/ibmi';

/**
 * Hook for managing IBM i connection state
 */
export const useIBMiConnection = () => {
  const [state, setState] = useState<ConnectionState>({
    isConnected: false,
    isLoading: false,
    error: null,
  });

  const connect = useCallback(async (config: IBMiConnectionConfig) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const result = await IBMiConnectionService.connect(config);

    if (result.success) {
      setState({
        isConnected: true,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        language: config.language,
        ccsid: config.ccsid,
      });
    } else {
      setState({
        isConnected: false,
        isLoading: false,
        error: result.error || 'Connection failed',
      });
    }

    return result;
  }, []);

  const disconnect = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const result = await IBMiConnectionService.disconnect();

    setState({
      isConnected: false,
      isLoading: false,
      error: null,
    });

    return result;
  }, []);

  return { ...state, connect, disconnect };
};

/**
 * Hook for managing green screen display
 */
export const useGreenScreen = () => {
  const [screen, setScreen] = useState<GreenScreenDisplay | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshScreen = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await IBMiConnectionService.getScreenDisplay();
    if (result.success && result.screenData) {
      setScreen(result.screenData);
    } else {
      setError(result.error || 'Failed to refresh screen');
    }

    setLoading(false);
    return result;
  }, []);

  const sendInput = useCallback(async (inputData: Record<string, string>) => {
    setLoading(true);
    setError(null);

    const result = await IBMiConnectionService.sendInput(inputData);
    if (result.success && result.screenData) {
      setScreen(result.screenData);
    } else {
      setError(result.error || 'Failed to send input');
    }

    setLoading(false);
    return result;
  }, []);

  return {
    screen,
    loading,
    error,
    refreshScreen,
    sendInput,
  };
};

/**
 * Hook for executing commands on IBM i
 */
export const useIBMiCommand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const execute = useCallback(async (command: string, params?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await IBMiConnectionService.executeCommand(command, params);
    
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error || 'Command execution failed');
    }

    setLoading(false);
    return response;
  }, []);

  return { execute, loading, error, result };
};

/**
 * Hook for executing queries on IBM i
 */
export const useIBMiQuery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  const execute = useCallback(async (query: string, params?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setData([]);

    const response = await IBMiConnectionService.executeQuery(query, params);

    if (response.success && response.data) {
      setData(Array.isArray(response.data) ? response.data : [response.data]);
    } else {
      setError(response.error || 'Query execution failed');
    }

    setLoading(false);
    return response;
  }, []);

  return { execute, loading, error, data };
};

/**
 * Hook to auto-refresh screen at intervals
 */
export const useScreenRefresh = (intervalMs: number = 5000) => {
  const { refreshScreen } = useGreenScreen();
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshScreen();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshScreen, intervalMs]);

  return { autoRefresh, setAutoRefresh, refreshScreen };
};

/**
 * Hook for managing form state in green screen
 */
export const useScreenForm = (initialData: Record<string, string> = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialData);
    setTouched({});
    setErrors({});
  }, [initialData]);

  const isValid = Object.keys(errors).every((key) => !errors[key]);

  return {
    formData,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldError,
    reset,
    isValid,
    setFormData,
  };
};

/**
 * Hook for connection error handling
 */
export const useConnectionError = () => {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleError = useCallback((error: string) => {
    setConnectionError(error);
  }, []);

  const retry = useCallback(async (connectFunc: () => Promise<ActionResponse>) => {
    if (retryCount >= maxRetries) {
      setConnectionError('Max retries reached');
      return;
    }

    setRetryCount((prev) => prev + 1);
    const result = await connectFunc();

    if (result.success) {
      setConnectionError(null);
      setRetryCount(0);
    }

    return result;
  }, [retryCount]);

  const clearError = useCallback(() => {
    setConnectionError(null);
    setRetryCount(0);
  }, []);

  return { connectionError, handleError, retry, clearError, retryCount };
};
