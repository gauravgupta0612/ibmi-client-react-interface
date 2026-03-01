# IBM i Backend API Server

REST API server for IBM i (AS/400) green screen interface. Provides endpoints for connecting to IBM i systems, managing sessions, and executing commands. Supports both demo mode (testing without real IBM i) and real connections via iTookit.

## Features

- ✅ IBM i 5250 green screen protocol support (via iTookit Telnet)
- ✅ Real IBM i system connections with iTookit integration
- ✅ SQL query execution via idb-connector
- ✅ CLLE command execution on real systems
- ✅ Session management with language and CCSID support
- ✅ Screen display capture and updates
- ✅ Command and query execution
- ✅ Function key handling (F1-F12)
- ✅ CORS enabled for frontend communication
- ✅ Error handling and validation
- ✅ Health check endpoint
- ✅ Multi-language support (ENG, FRA, DEU, ESP, ITA, NLD, JPN, CHS, KOR, RUS, POR, POL)
- ✅ CCSID (Character Encoding) support (37, 273, 285, 297, 500, 875, 1025, 1026, 1047, 1140-1148)
- ✅ Demo Mode for testing without real IBM i system
- ✅ Automatic fallback to Demo Mode if iTookit not available

## Installation

### Quick Start (Demo Mode)

1. Navigate to the backend directory:
```bash
cd ibmi-backend-api
```

2. Install dependencies:
```bash
npm install
```

3. Run the server:
```bash
npm start
```

Server runs on `http://localhost:3001` with **Demo Mode** enabled (no real IBM i required).

### Real Connection Setup (iTookit)

For actual IBM i connections, see [ITOOKIT_SETUP.md](../ITOOKIT_SETUP.md) for:
- Visual Studio Build Tools installation
- iTookit and idb-connector setup
- Configuration for your IBM i system
- Environment variables

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Enable Real iTookit Connections
```bash
# Set environment variable (Windows PowerShell)
$env:USE_REAL_CONNECTION = "true"
npm start

# Or in .env file:
# USE_REAL_CONNECTION=true
```

## API Endpoints

### 1. Health Check
```
GET /api/health
```

### 2. Connect to IBM i
```
POST /api/connect
```
Automatically uses iTookit if available and enabled, otherwise falls back to Demo Mode.

### 3. Get Available Instances/Libraries
```
GET /api/instances/list?sessionId=session_id
```
Returns available IBM i libraries for selection.

### 4. Check iTookit Availability
```
GET /api/status/libraries
```
Returns whether iTookit and idb-connector are installed.

### 5. Get Screen Display
```
GET /api/screen/display?sessionId=session_id
```

### 6. Send Input
```
POST /api/screen/input
```

### 7. Handle Key Press
```
POST /api/screen/keypress
```

### 8. Execute Command
```
POST /api/command/execute
```
Uses real IBM i commands if iTookit connected, otherwise demo mode.

### 9. Execute Query
```
POST /api/query/execute
```
Uses real SQL queries if idb-connector available, otherwise demo mode.

### 10. Session Heartbeat
```
POST /api/session/heartbeat
```

### 11. Disconnect
```
POST /api/disconnect
```

## API Endpoints

### 1. Health Check
```
GET /api/health
Response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

### 2. Connect to IBM i
```
POST /api/connect
Body:
{
  "host": "192.168.1.100",
  "port": 23,
  "username": "USER1",
  "password": "PASSWORD",
  "library": "QGPL",
  "language": "ENG",
  "ccsid": 37
}
Response:
{
  "success": true,
  "sessionData": {
    "sessionId": "session_1234567890_abc123",
    "userId": "USER1",
    "connectionTime": "2024-01-15T10:30:00.000Z",
    "language": "ENG",
    "ccsid": 37
  },
  "screenData": { ... }
}
```

### 3. Get Screen Display
```
GET /api/screen/display?sessionId=session_id
Response:
{
  "success": true,
  "screenData": {
    "data": [ [...] ],
    "cursorPosition": { "row": 0, "column": 0 },
    "attributes": [],
    "messages": [],
    "language": "ENG",
    "ccsid": 37
  }
}
```

### 4. Send Input
```
POST /api/screen/input
Body:
{
  "sessionId": "session_id",
  "input": "DATA"
}
Response:
{
  "success": true,
  "screenData": { ... }
}
```

### 5. Handle Key Press
```
POST /api/screen/keypress
Body:
{
  "sessionId": "session_id",
  "key": "F3"
}
Response:
{
  "success": true,
  "screenData": { ... }
}
```

### 6. Execute Command
```
POST /api/command/execute
Body:
{
  "sessionId": "session_id",
  "command": "DSPMSG",
  "params": {}
}
Response:
{
  "success": true,
  "data": {
    "command": "DSPMSG",
    "status": "SUCCESS",
    "output": "..."
  },
  "screenData": { ... }
}
```

### 7. Execute Query
```
POST /api/query/execute
Body:
{
  "sessionId": "session_id",
  "query": "SELECT * FROM MYLIB.MYTABLE",
  "params": {}
}
Response:
{
  "success": true,
  "data": [ {...}, {...} ],
  "screenData": { ... }
}
```

### 8. Session Heartbeat
```
POST /api/session/heartbeat
Body:
{
  "sessionId": "session_id"
}
Response:
{
  "success": true,
  "sessionData": {
    "sessionId": "session_id",
    "userId": "USER1",
    "language": "ENG",
    "ccsid": 37,
    "isConnected": true
  }
}
```

### 9. Disconnect
```
POST /api/disconnect
Body:
{
  "sessionId": "session_id"
}
Response:
{
  "success": true,
  "message": "Disconnected successfully"
}
```

## Supported Languages

- ENG - English
- FRA - French (Français)
- DEU - German (Deutsch)
- ESP - Spanish (Español)
- ITA - Italian (Italiano)
- NLD - Dutch (Nederlands)
- JPN - Japanese (日本語)
- CHS - Chinese Simplified (简体中文)
- KOR - Korean (한국어)
- RUS - Russian (Русский)
- POR - Portuguese (Português)
- POL - Polish (Polski)

## Supported CCSID (Character Encoding)

- 37 - EBCDIC US/Canada (Default)
- 273 - EBCDIC German/Austrian
- 285 - EBCDIC United Kingdom
- 297 - EBCDIC French
- 500 - EBCDIC International
- 875 - EBCDIC Greek
- 1025 - EBCDIC Cyrillic
- 1026 - EBCDIC Turkish
- 1047 - EBCDIC Latin-1
- 1140 - EBCDIC US/Canada (Euro)
- 1141 - EBCDIC German/Austrian (Euro)
- 1142 - EBCDIC Danish/Norwegian (Euro)
- 1143 - EBCDIC Finnish/Swedish (Euro)
- 1144 - EBCDIC Italian (Euro)
- 1145 - EBCDIC Spanish (Euro)
- 1146 - EBCDIC United Kingdom (Euro)
- 1147 - EBCDIC French (Euro)
- 1148 - EBCDIC International (Euro)

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `IBMI_HOST` - Default IBM i host
- `IBMI_PORT` - Default IBM i port (default: 23)
- `IBMI_DEFAULT_LIBRARY` - Default library (default: QGPL)
- `IBMI_TIMEOUT` - Connection timeout in ms
- `API_CORS_ORIGIN` - CORS origin (default: http://localhost:5173)
- `API_LOG_LEVEL` - Logging level (debug/info/warn/error)

## Required Libraries for Production

To connect to actual IBM i systems via Telnet 5250:

- `node-5250` - Telnet 5250 client
- `idb-connector` - IBM i database connector
- `node-gyp` - Required for native modules

## Development

### Run with Nodemon (auto-reload)
```bash
npm run dev
```

### Test the API
```bash
curl http://localhost:3001/api/health
```

## Architecture

The backend API uses:
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **In-Memory Sessions** - For demo (use Redis/database for production)

## Integration with Frontend

The frontend (React application) connects to this backend API using the configured `VITE_API_URL`. 

Example configuration in frontend `.env`:
```
VITE_API_URL=http://localhost:3001/api
VITE_IBMI_HOST=your-ibmi-server
VITE_IBMI_PORT=23
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- 200 - Success
- 400 - Bad Request (validation error)
- 401 - Unauthorized (invalid session)
- 500 - Internal Server Error

## Session Management

- Sessions are stored in memory (replace with Redis for production)
- Each session includes:
  - Session ID
  - User credentials
  - Connection info
  - Language setting
  - CCSID setting
  - Last activity timestamp

## TODO - Production Features

- [x] Integrate iTookit for real IBM i connections
- [x] Implement instance/library listing
- [x] Add command execution support
- [x] Add query execution support
- [ ] Implement database session storage (replace in-memory)
- [ ] Add authentication and JWT tokens
- [ ] Add rate limiting
- [ ] Add request validation middleware
- [ ] Add comprehensive logging
- [ ] Add request/response monitoring
- [ ] Implement proper error codes
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement 5250 screen field detection
- [ ] Add screen recording and playback
- [ ] Add performance metrics and monitoring

## License

MIT

## Support

For issues or questions about the IBM i API server, please refer to the main project documentation.
