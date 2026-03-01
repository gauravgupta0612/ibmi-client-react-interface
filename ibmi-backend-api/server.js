/**
 * IBM i Backend API Server
 * Express.js server providing REST API for IBM i 5250 green screen operations
 * Supports both real connections (via iTookit) and mock mode
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const ibmiToolKit = require('./ibm-i-toolkit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const USE_REAL_CONNECTION = process.env.USE_REAL_CONNECTION === 'true';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory session storage (replace with proper database in production)
const sessions = {};

/**
 * Helper function to generate session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper function to create green screen display object
 */
function createGreenScreenDisplay(data = '', language = 'ENG', ccsid = 37) {
  const rows = 24;
  const cols = 80;
  const screenData = [];

  // Initialize screen with empty rows
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(' ');
    }
    screenData.push(row);
  }

  // Add sample data if provided
  if (data) {
    const lines = data.split('\n');
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
  }

  return {
    data: screenData,
    cursorPosition: { row: 0, column: 0 },
    attributes: [],
    messages: [],
    language,
    ccsid,
  };
}

/**
 * POST /api/connect
 * Establish connection to IBM i system (iTookit or Demo Mode)
 */
app.post('/api/connect', async (req, res) => {
  try {
    const { host, port, username, password, language = 'ENG', ccsid = 37 } = req.body;

    // Validate input
    if (!host || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required connection parameters',
      });
    }

    // Try real connection if iTookit is available
    let isRealConnection = false;
    if (ibmiToolKit.isIToolkitAvailable()) {
      try {
        console.log(`Attempting real iTookit connection to ${host}...`);
        const connectionResult = await ibmiToolKit.connectToIBMi(host, username, password);
        
        if (connectionResult.success) {
          isRealConnection = true;
          const sessionId = generateSessionId();
          sessions[sessionId] = {
            sessionId,
            host,
            port: port || 23,
            username,
            language: language || 'ENG',
            ccsid: ccsid || 37,
            connectionTime: new Date(),
            lastActivityTime: new Date(),
            isConnected: true,
            connection: connectionResult.connection,
            isReal: true,
          };

          return res.json({
            success: true,
            sessionData: {
              sessionId,
              userId: username,
              connectionTime: new Date(),
              lastActivityTime: new Date(),
              language: language || 'ENG',
              ccsid: ccsid || 37,
              connectionMode: 'iTookit (Real)',
            },
            screenData: createGreenScreenDisplay(
              'IBM i System Connected via iTookit\nHost: ' + host + ':' + (port || 23) + '\nLanguage: ' + language + '\nCCSID: ' + ccsid,
              language || 'ENG',
              ccsid || 37
            ),
          });
        } else {
          console.warn('iTookit connection failed:', connectionResult.message);
          // Fall through to demo mode
        }
      } catch (error) {
        console.warn('iTookit connection error:', error.message);
        // Fall through to demo mode
      }
    }

    // Demo mode (fallback)
    const sessionId = generateSessionId();
    sessions[sessionId] = {
      sessionId,
      host,
      port: port || 23,
      username,
      language: language || 'ENG',
      ccsid: ccsid || 37,
      connectionTime: new Date(),
      lastActivityTime: new Date(),
      isConnected: true,
      isReal: false,
    };

    console.log(`Connected in demo mode to ${host}`);
    res.json({
      success: true,
      sessionData: {
        sessionId,
        userId: username,
        connectionTime: new Date(),
        lastActivityTime: new Date(),
        language: language || 'ENG',
        ccsid: ccsid || 37,
        connectionMode: 'Demo Mode',
      },
      screenData: createGreenScreenDisplay(
        'IBM i System (Demo Mode)\nHost: ' + host + ':' + (port || 23) + '\nLanguage: ' + language + '\nCCSID: ' + ccsid,
        language || 'ENG',
        ccsid || 37
      ),
    });
  } catch (error) {
    console.error('Connection error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Connection failed',
    });
  }
});

/**
 * POST /api/disconnect
 * Close IBM i connection
 */
app.post('/api/disconnect', (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessions[sessionId]) {
      delete sessions[sessionId];
    }

    res.json({
      success: true,
      message: 'Disconnected successfully',
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Disconnect failed',
    });
  }
});

/**
 * POST /api/session/heartbeat
 * Keep session alive
 */
app.post('/api/session/heartbeat', (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessions[sessionId]) {
      sessions[sessionId].lastActivityTime = new Date();
      res.json({
        success: true,
        message: 'Heartbeat received',
        sessionData: {
          sessionId: sessions[sessionId].sessionId,
          userId: sessions[sessionId].username,
          language: sessions[sessionId].language,
          ccsid: sessions[sessionId].ccsid,
          isConnected: true,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Session not found',
      });
    }
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Heartbeat failed',
    });
  }
});

/**
 * GET /api/screen/display
 * Get current screen display
 */
app.get('/api/screen/display', (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessions[sessionId]) {
      return res.status(401).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = sessions[sessionId];
    res.json({
      success: true,
      screenData: createGreenScreenDisplay(
        'IBM i Green Screen\nSession: ' + session.sessionId + '\nUser: ' + session.username,
        session.language,
        session.ccsid
      ),
    });
  } catch (error) {
    console.error('Get screen error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get screen display',
    });
  }
});

/**
 * POST /api/screen/input
 * Send input to IBM i screen
 */
app.post('/api/screen/input', (req, res) => {
  try {
    const { sessionId, input } = req.body;

    if (!sessions[sessionId]) {
      return res.status(401).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = sessions[sessionId];
    session.lastActivityTime = new Date();

    res.json({
      success: true,
      message: 'Input processed',
      screenData: createGreenScreenDisplay(
        'Processing input: ' + (input || '') + '\n' + 'Language: ' + session.language + '\nCCSID: ' + session.ccsid,
        session.language,
        session.ccsid
      ),
    });
  } catch (error) {
    console.error('Input error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process input',
    });
  }
});

/**
 * POST /api/screen/keypress
 * Handle function key press
 */
app.post('/api/screen/keypress', (req, res) => {
  try {
    const { sessionId, key } = req.body;

    if (!sessions[sessionId]) {
      return res.status(401).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = sessions[sessionId];
    session.lastActivityTime = new Date();

    // Handle function key
    let displayText = 'Function Key: ' + key;
    switch (key) {
      case 'F3':
        displayText = 'Exit application (F3 pressed)';
        break;
      case 'F5':
        displayText = 'Screen refreshed (F5 pressed)';
        break;
      case 'F12':
        displayText = 'Cancel (F12 pressed)';
        break;
      default:
        displayText = 'Key: ' + key + ' pressed';
    }

    res.json({
      success: true,
      message: displayText,
      screenData: createGreenScreenDisplay(
        displayText + '\nLanguage: ' + session.language + '\nCCSID: ' + session.ccsid,
        session.language,
        session.ccsid
      ),
    });
  } catch (error) {
    console.error('Keypress error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to handle key press',
    });
  }
});

/**
 * POST /api/command/execute
 * Execute IBM i command (via iTookit or demo mode)
 */
app.post('/api/command/execute', async (req, res) => {
  try {
    const { sessionId, command, params } = req.body;

    if (!sessions[sessionId]) {
      return res.status(401).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = sessions[sessionId];
    session.lastActivityTime = new Date();

    // Try real command execution if iTookit connected
    if (session.isReal && session.connection && ibmiToolKit.isIToolkitAvailable()) {
      try {
        const result = await ibmiToolKit.executeCommand(session.connection, command);
        if (result.success) {
          return res.json({
            success: true,
            message: 'Command executed on IBM i',
            data: {
              command,
              status: 'SUCCESS',
              output: result.data || 'Command completed',
              mode: 'iTookit (Real)'
            },
            screenData: createGreenScreenDisplay(
              'CMD> ' + command + '\nStatus: SUCCESS\nOutput: ' + (result.data || 'Completed'),
              session.language,
              session.ccsid
            ),
          });
        }
      } catch (error) {
        console.warn('Real command execution failed:', error.message);
      }
    }

    // Demo mode execution
    res.json({
      success: true,
      message: 'Command executed (Demo)',
      data: {
        command,
        status: 'SUCCESS',
        output: 'Command output would appear here (Demo Mode)',
        mode: 'Demo'
      },
      screenData: createGreenScreenDisplay(
        'CMD> ' + command + '\nStatus: SUCCESS\nLanguage: ' + session.language + '\nCCSID: ' + session.ccsid,
        session.language,
        session.ccsid
      ),
    });
  } catch (error) {
    console.error('Command error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Command execution failed',
    });
  }
});

/**
 * POST /api/query/execute
 * Execute IBM i SQL query (via iTookit or demo mode)
 */
app.post('/api/query/execute', async (req, res) => {
  try {
    const { sessionId, query, params } = req.body;

    if (!sessions[sessionId]) {
      return res.status(401).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = sessions[sessionId];
    session.lastActivityTime = new Date();

    // Try real query execution if iTookit connected
    if (session.isReal && ibmiToolKit.isDBConnectorAvailable()) {
      try {
        const dbConnection = await ibmiToolKit.getDBConnection(session.host, session.username, '');
        if (dbConnection.success) {
          const result = await ibmiToolKit.executeQuery(dbConnection.connection, query);
          if (result.success) {
            return res.json({
              success: true,
              message: 'Query executed on IBM i',
              data: result.data || [],
              rowCount: (result.data || []).length,
              mode: 'iTookit (Real)'
            });
          }
        }
      } catch (error) {
        console.warn('Real query execution failed:', error.message);
      }
    }

    // Demo mode execution
    const demoData = [
      { id: 1, name: 'Item 1', status: 'ACTIVE' },
      { id: 2, name: 'Item 2', status: 'INACTIVE' },
      { id: 3, name: 'Item 3', status: 'ACTIVE' },
    ];

    res.json({
      success: true,
      message: 'Query executed (Demo)',
      data: demoData,
      rowCount: demoData.length,
      mode: 'Demo',
      screenData: createGreenScreenDisplay(
        'Query: ' + query.substring(0, 40) + '...\nRecords: ' + demoData.length + '\nLanguage: ' + session.language + '\nCCSID: ' + session.ccsid,
        session.language,
        session.ccsid
      ),
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Query execution failed',
    });
  }
});

/**
 * GET /api/instances/list
 * Get list of available IBM i instances/libraries
 */
app.get('/api/instances/list', async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessions[sessionId]) {
      return res.status(401).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = sessions[sessionId];

    // Try to get real instances from iTookit if connected
    const instances = [];
    if (session.isReal && session.connection && ibmiToolKit.isIToolkitAvailable()) {
      try {
        const result = await ibmiToolKit.listLibraries(session.connection);
        if (result.success && result.data) {
          return res.json({
            success: true,
            instances: result.data,
            connectionMode: 'iTookit (Real)',
          });
        }
      } catch (error) {
        console.warn('Failed to fetch real instances:', error.message);
      }
    }

    // Demo mode instances (fallback)
    instances.push(
      {
        name: 'QGPL',
        description: 'General Purpose Library',
        type: 'library',
        status: 'active',
        path: '/QSYS.LIB/QGPL.LIB'
      },
      {
        name: 'QSYS',
        description: 'System Library',
        type: 'system',
        status: 'active',
        path: '/QSYS.LIB/QSYS.LIB'
      },
      {
        name: 'MYLIB',
        description: 'My Custom Library',
        type: 'database',
        status: 'active',
        path: '/QSYS.LIB/MYLIB.LIB'
      },
      {
        name: 'TESTLIB',
        description: 'Testing Library',
        type: 'library',
        status: 'inactive',
        path: '/QSYS.LIB/TESTLIB.LIB'
      },
      {
        name: 'PRODDATA',
        description: 'Production Data',
        type: 'partition',
        status: 'active',
        path: '/QSYS.LIB/PRODDATA.LIB'
      }
    );

    res.json({
      success: true,
      instances,
      connectionMode: session.isReal ? 'iTookit (Real)' : 'Demo Mode',
    });
  } catch (error) {
    console.error('Get instances error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get instances list',
    });
  }
});

/**
 * GET /api/status/libraries
 * Check availability of iTookit and idb-connector libraries
 */
app.get('/api/status/libraries', (req, res) => {
  try {
    const status = ibmiToolKit.getLibraryStatus();
    const toolkitInfo = {
      iTookit: ibmiToolKit.isIToolkitAvailable(),
      idbConnector: ibmiToolKit.isDBConnectorAvailable(),
      ...status
    };

    res.json({
      success: true,
      libraries: toolkitInfo,
      realConnectionAvailable: ibmiToolKit.isIToolkitAvailable(),
      message: ibmiToolKit.isIToolkitAvailable() 
        ? 'Ready for real IBM i connections'
        : 'Demo mode only - iTookit not installed'
    });
  } catch (error) {
    console.error('Library status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check library status',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'IBM i Backend API Server',
    version: '1.0.0',
    description: 'REST API for IBM i 5250 green screen interface with iTookit integration',
    endpoints: [
      'POST /api/connect - Connect to IBM i system',
      'POST /api/disconnect - Disconnect from IBM i',
      'POST /api/session/heartbeat - Keep session alive',
      'GET /api/screen/display - Get current screen',
      'POST /api/screen/input - Send input to screen',
      'POST /api/screen/keypress - Handle function key',
      'POST /api/command/execute - Execute CLLE command',
      'POST /api/query/execute - Execute SQL query',
      'GET /api/instances/list - List available libraries',
      'GET /api/status/libraries - Check iTookit availability',
      'GET /api/health - Health check',
    ],
    iTookit: {
      available: ibmiToolKit.isIToolkitAvailable(),
      idbConnector: ibmiToolKit.isDBConnectorAvailable(),
    }
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`IBM i Backend API Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
