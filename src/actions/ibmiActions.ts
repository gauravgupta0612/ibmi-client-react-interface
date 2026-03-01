import type { ActionResponse, KeyPressAction } from '../types/ibmi';
import IBMiConnectionService from '../services/IBMiConnectionService';

/**
 * Action handlers for common IBM i green screen operations
 */

export const IBMiActions = {
  /**
   * Navigate between screens using function keys
   */
  navigateWithFunctionKey: async (functionKey: string): Promise<ActionResponse> => {
    const keyMap: Record<string, string> = {
      'F1': 'HELP',
      'F2': 'ENTER',
      'F3': 'EXIT',
      'F4': 'PROMPT',
      'F5': 'REFRESH',
      'F6': 'CREATE',
      'F7': 'FILTER',
      'F8': 'SORT',
      'F9': 'RETRIEVE',
      'F10': 'DELETE',
      'F11': 'TOGGLE',
      'F12': 'CANCEL',
    };

    const action: KeyPressAction = {
      key: functionKey,
      action: keyMap[functionKey] || 'ENTER',
    };

    return IBMiConnectionService.handleKeyPress(action);
  },

  /**
   * Simple message display action
   */
  displayMessage: async (message: string): Promise<ActionResponse> => {
    return {
      success: true,
      message,
    };
  },

  /**
   * Data query action - fetch data from IBM i
   */
  queryData: async (
    query: string,
    filters?: Record<string, any>
  ): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.executeQuery(query, filters);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Query failed',
      };
    }
  },

  /**
   * Create new record on IBM i
   */
  createRecord: async (
    table: string,
    data: Record<string, any>
  ): Promise<ActionResponse> => {
    try {
      const command = `INSERT INTO ${table}`;
      const response = await IBMiConnectionService.executeCommand(command, data);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Create failed',
      };
    }
  },

  /**
   * Update existing record on IBM i
   */
  updateRecord: async (
    table: string,
    recordId: string,
    data: Record<string, any>
  ): Promise<ActionResponse> => {
    try {
      const command = `UPDATE ${table}`;
      const response = await IBMiConnectionService.executeCommand(command, {
        recordId,
        ...data,
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed',
      };
    }
  },

  /**
   * Delete record from IBM i
   */
  deleteRecord: async (
    table: string,
    recordId: string
  ): Promise<ActionResponse> => {
    try {
      const command = `DELETE FROM ${table}`;
      const response = await IBMiConnectionService.executeCommand(command, {
        recordId,
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  },

  /**
   * Submit data from green screen form
   */
  submitForm: async (formData: Record<string, any>): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.sendInput(formData);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Form submission failed',
      };
    }
  },

  /**
   * Clear screen and reset
   */
  clearScreen: async (): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.executeCommand('CLEAR');
      return {
        success: true,
        message: 'Screen cleared',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Clear screen failed',
      };
    }
  },

  /**
   * Refresh current screen
   */
  refreshScreen: async (): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.getScreenDisplay();
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refresh failed',
      };
    }
  },

  /**
   * Print current screen
   */
  printScreen: async (): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.executeCommand('PRINT');
      return {
        success: true,
        message: 'Screen sent to printer',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Print failed',
      };
    }
  },

  /**
   * Export screen data to file
   */
  exportData: async (format: 'csv' | 'excel' | 'json'): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.executeCommand('EXPORT', { format });
      return {
        success: true,
        message: `Data exported as ${format.toUpperCase()}`,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      };
    }
  },

  /**
   * Search within current view
   */
  search: async (searchTerm: string, field?: string): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.executeQuery(
        'SEARCH',
        { searchTerm, field }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      };
    }
  },

  /**
   * Get system information
   */
  getSystemInfo: async (): Promise<ActionResponse> => {
    try {
      const response = await IBMiConnectionService.executeQuery('SYSTEM_INFO');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve system info',
      };
    }
  },

  /**
   * Batch operation - perform multiple actions
   */
  batchOperation: async (actions: Array<{
    action: string;
    params: any;
  }>): Promise<ActionResponse> => {
    try {
      const results = [];
      for (const item of actions) {
        const actionKey = item.action as keyof typeof IBMiActions;
        if (typeof IBMiActions[actionKey] === 'function') {
          const result = await (IBMiActions[actionKey] as any)(item.params);
          results.push(result);
        }
      }
      return {
        success: true,
        data: results,
        message: `${results.length} operations completed`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Batch operation failed',
      };
    }
  },
};
