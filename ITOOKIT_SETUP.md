# iTookit Integration Setup Guide

This guide explains how to set up the IBM i Toolkit (iTookit) for real IBM i system connections.

## Overview

The backend API supports two connection modes:

1. **Demo Mode** (Default) - Mock implementation for UI testing without a real IBM i system
2. **Real Mode** (iTookit) - Actual connections to IBM i systems using iTookit library

## Prerequisites

### Windows System Requirements
- Visual Studio Build Tools 2017 or later (or Visual Studio with C++ support)
- Node.js 14+ with npm
- Python 3.x (for node-gyp)

### IBM i System Requirements
- Active IBM i system (V5R4+)
- Telnet enabled (port 23)
- User account with appropriate permissions
- SSH key or password authentication (for idb-connector)

## Installation Steps

### 1. Install Build Tools (Windows Only)

#### Option A: Visual Studio Build Tools
```bash
# Download from: https://visualstudio.microsoft.com/downloads/
# Select "Desktop development with C++"
# During installation, include:
# - Visual C++ build tools
# - Windows 10/11 SDK
```

#### Option B: Visual Studio Community
```bash
# Download at: https://visualstudio.microsoft.com/community/
# During installation, select "Desktop development with C++"
```

### 2. Install iTookit and idb-connector

Navigate to the backend directory and install dependencies:

```bash
cd ibmi-backend-api
npm install
```

This will install:
- **itoolkit** ^1.4.2 - Telnet 5250 green screen protocol
- **idb-connector** ^3.2.2 - IBM i database connector for SQL queries

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your IBM i system information:

```env
# Enable real iTookit connections
USE_REAL_CONNECTION=true

# IBM i System Credentials
IBMI_SYSTEM_HOST=your-ibmi-hostname
IBMI_SYSTEM_PORT=23
IBMI_SYSTEM_USER=your-username
IBMI_SYSTEM_PASSWORD=your-password

# Database Connection (for idb-connector)
IBMI_DB_HOST=your-ibmi-hostname
IBMI_DB_PORT=8471
IBMI_DB_USER=your-username
IBMI_DB_PASS=your-password
```

## Running the Backend

### With Demo Mode (No iTookit Required)

```bash
cd ibmi-backend-api
npm start
# Server runs on http://localhost:3001
# Connection requests use mock data
```

### With Real iTookit Connections

```bash
cd ibmi-backend-api

# Set environment variable (Windows PowerShell)
$env:USE_REAL_CONNECTION = "true"

# Or set in .env file
# USE_REAL_CONNECTION=true

npm start
# Server runs on http://localhost:3001
# Connection requests connect to real IBM i system
```

## API Endpoints

All endpoints support both Demo Mode and Real Mode automatically.

### Connection Endpoints

#### POST /api/connect
```bash
curl -X POST http://localhost:3001/api/connect \
  -H "Content-Type: application/json" \
  -d '{
    "host": "your-ibmi-hostname",
    "port": 23,
    "username": "your-username",
    "password": "your-password",
    "language": "ENG",
    "ccsid": "37"
  }'
```

Response (Real Mode):
```json
{
  "success": true,
  "sessionData": {
    "sessionId": "session_1234567890_abc123",
    "connectionMode": "iTookit (Real)",
    "language": "ENG",
    "ccsid": "37"
  },
  "screenData": { ... }
}
```

Response (Demo Mode):
```json
{
  "success": true,
  "sessionData": {
    "sessionId": "session_1234567890_abc123",
    "connectionMode": "Demo Mode",
    "language": "ENG",
    "ccsid": "37"
  },
  "screenData": { ... }
}
```

#### GET /api/instances/list
```bash
curl "http://localhost:3001/api/instances/list?sessionId=YOUR_SESSION_ID"
```

Returns available IBM i libraries/instances:

```json
{
  "success": true,
  "instances": [
    {
      "name": "QGPL",
      "description": "General Purpose Library",
      "type": "library",
      "status": "active",
      "path": "/QSYS.LIB/QGPL.LIB"
    },
    ...
  ],
  "connectionMode": "iTookit (Real)"
}
```

#### POST /api/command/execute
```bash
curl -X POST http://localhost:3001/api/command/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID",
    "command": "DSPLIB LIB(QGPL)"
  }'
```

Returns command execution result:

```json
{
  "success": true,
  "data": {
    "command": "DSPLIB LIB(QGPL)",
    "status": "SUCCESS",
    "output": "...",
    "mode": "iTookit (Real)"
  }
}
```

#### POST /api/query/execute
```bash
curl -X POST http://localhost:3001/api/query/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID",
    "query": "SELECT * FROM QSYS2.SYSCOLUMNS LIMIT 10"
  }'
```

#### GET /api/status/libraries
```bash
curl "http://localhost:3001/api/status/libraries"
```

Returns iTookit availability status:

```json
{
  "success": true,
  "libraries": {
    "iTookit": true,
    "idbConnector": true,
    "message": "Ready for real IBM i connections"
  },
  "realConnectionAvailable": true
}
```

## Frontend Configuration

The frontend automatically detects the backend mode and displays:

- **Demo Mode**: "Demo Mode" label in connection info
- **Real Mode**: "iTookit (Real)" label with actual IBM i system info

No additional configuration needed - the frontend works with both modes.

## Troubleshooting

### iTookit Installation Fails

```
Error: Failed to compile native addon for itoolkit
```

**Solution:**
1. Ensure Visual Studio Build Tools are installed with C++ support
2. Delete node_modules folder: `rm -r node_modules`
3. Clear npm cache: `npm cache clean --force`
4. Reinstall: `npm install`

### Connection Timeout

```
Error: Connection timeout to IBM i system
```

**Solution:**
1. Verify IBM i host and port are correct
2. Check firewall allows port 23 (or your configured port)
3. Verify Telnet service is enabled on IBM i
4. Test with: `telnet your-ibmi-hostname 23`

### Database Connection Failed

```
Error: Failed to connect to database
```

**Solution:**
1. Verify database port (usually 8471 for idb-connector)
2. Check username and password
3. Ensure user has database access on IBM i
4. Try connecting with: `idb-connector` command-line test

### "Unknown Command" Error

```
Error: Unknown CLLE command
```

**Solution:**
1. Verify command syntax and permissions
2. Check user has authority to run CLLE commands
3. Use fully-qualified library names: `LIB(QSYS) CMD (DSPLIB)`

## Connection Flow

```
Frontend (React)
    ↓
POST /api/connect
    ↓
Backend (Express + iTookit)
    ↓
USE_REAL_CONNECTION=true?
    ├→ YES: iTookit.connectToIBMi() → Real IBM i System
    │       ↓
    │       Telnet 5250 Connection ✓
    │       ↓
    │       Session Stored + Return Success
    │
    └→ NO: Demo Mode
            ↓
            Return Mock Data
            ↓
            Session Stored + Return Success
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `3001` | Backend server port |
| `USE_REAL_CONNECTION` | `false` | Enable iTookit real connections |
| `IBMI_HOST` | `localhost` | IBM i hostname |
| `IBMI_PORT` | `23` | Telnet port |
| `IBMI_USERNAME` | - | IBM i username |
| `IBMI_PASSWORD` | - | IBM i password |
| `IBMI_DB_HOST` | - | Database host for idb-connector |
| `IBMI_DB_PORT` | `8471` | Database port |

## Next Steps

1. Start both frontend and backend:

```bash
# Terminal 1: Frontend
cd ibmi-client-react-interface
npm run dev

# Terminal 2: Backend
cd ibmi-backend-api
npm start
```

2. Open browser: `http://localhost:5173`

3. Enter IBM i connection details

4. Select instance/library from the list

5. Execute commands and queries

## Additional Resources

- [iTookit GitHub](https://github.com/IBM/nodejs-itoolkit)
- [idb-connector GitHub](https://github.com/IBM/nodejs-idb-connector)
- [IBM i Telnet Protocol](https://www.ibm.com/support/pages/telnet-client)
- [CLLE Command Reference](https://www.ibm.com/support/pages/clle-commands)

## Support

For issues with:
- **Frontend**: Check browser console and application logs
- **Backend**: Check terminal/console output and enable LOG_LEVEL=debug in .env
- **iTookit**: See iTookit GitHub issues: https://github.com/IBM/nodejs-itoolkit/issues
- **idb-connector**: See idb-connector GitHub issues: https://github.com/IBM/nodejs-idb-connector/issues
