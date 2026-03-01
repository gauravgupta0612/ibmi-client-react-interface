# IBM i Green Screen Interface - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Option 1: Demo Mode (Instant - No IBM i Required!)

**Perfect for testing the UI without a real IBM i system**

```bash
# Terminal 1: Start Frontend
npm run dev
# Opens http://localhost:5173

# Terminal 2: Start Backend  
cd ibmi-backend-api
npm install
npm start
# API on http://localhost:3001
```

Then:
1. Open http://localhost:5173
2. Enter any credentials (demo/demo recommended)
3. Click "Connect"
4. Demo mode automatically provides mock data and instances!

✅ **No IBM i server needed, instant testing!**

### Option 2: Real IBM i Connections (With iTookit)

**For connecting to actual IBM i systems**

1. **Install Build Tools** (Windows only)
   - [Download Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
   - Select "Desktop development with C++"

2. **Install iTookit**
   ```bash
   cd ibmi-backend-api
   npm install
   # Installs itoolkit@1.4.2 and idb-connector@3.2.2
   ```

3. **Configure .env**
   ```bash
   # In ibmi-backend-api directory:
   cp .env.example .env
   # Edit .env with your IBM i system details:
   # IBMI_SYSTEM_HOST=your-ibmi-hostname
   # IBMI_SYSTEM_USER=your-username
   # IBMI_SYSTEM_PASSWORD=your-password
   # USE_REAL_CONNECTION=true
   ```

4. **Start with Real Connections**
   ```bash
   # Set environment variable
   $env:USE_REAL_CONNECTION = "true"
   
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend (with iTookit)
   cd ibmi-backend-api
   npm start
   ```

✅ **Now connected to real IBM i system!**

### 📋 Using the Startup Script (Windows)

**Double-click `START-ALL.bat` to start everything automatically:**
- Asks you to choose Demo or Real mode
- Starts Frontend automatically
- Starts Backend automatically
- Shows access URLs

Or run manually:
```bash
.\START-ALL.bat
```

---

## 📚 Connection Types

| Feature | Demo Mode | Real Mode (iTookit) |
|---------|-----------|-------------------|
| Requires IBM i | ❌ No | ✅ Yes |
| Setup Time | ⚡ 2 minutes | 📋 15 minutes |
| Testing UI | ✅ Perfect | ✅ Perfect |
| Real Commands | ❌ Simulated | ✅ Real execution |
| Real Queries | ❌ Mock data | ✅ Real results |
| Instances | Mock (5) | Real IBM i libraries |
| Auto-fallback | N/A | ✅ Falls back to Demo if iTookit fails |

---

## 1️⃣ Development Build

```bash
npm run dev
```
The application will open at `http://localhost:5173`

## 2️⃣ Backend API Setup

**For Demo Mode (Skip iTookit):**
```bash
cd ibmi-backend-api
npm install
npm start
```

**For Real Mode (With iTookit):**
```bash
cd ibmi-backend-api
npm install  # Includes itoolkit and idb-connector
cp .env.example .env
# Edit .env with your IBM i system details
npm start
```

## 3️⃣ Configure IBM i Connection

1. Frontend automatically loads at `http://localhost:5173`
2. Fill in the Connection Panel:
   - **Host**: Your IBM i system IP/hostname (or localhost for Demo)
   - **Port**: Connection port (default: 23)
   - **Username**: Your IBM i user ID (or any value for Demo)
   - **Password**: Your IBM i password (or any value for Demo)
   - **Language**: Select connection language
   - **CCSID**: Select character encoding (EBCDIC variant)
3. Click "Connect"

## 4️⃣ Select Instance/Library

After connection succeeds:
1. Available instances/libraries appear on screen
2. **Demo Mode**: Shows 5 mock instances (QGPL, QSYS, MYLIB, TESTLIB, PRODDATA)
3. **Real Mode**: Shows actual IBM i libraries via DSPLIB
4. Click any instance to select it
5. Ready for commands and queries!

---

## 📋 Available Features

### Multi-Language Support (12 Languages)
- **ENG** - English
- **FRA** - French (Français)
- **DEU** - German (Deutsch)
- **ESP** - Spanish (Español)
- **ITA** - Italian (Italiano)
- **NLD** - Dutch (Nederlands)
- **JPN** - Japanese (日本語)
- **CHS** - Chinese Simplified (简体中文)
- **KOR** - Korean (한국어)
- **RUS** - Russian (Русский)
- **POR** - Portuguese (Português)
- **POL** - Polish (Polski)

Your language choice is displayed after connection and persisted in browser storage.

### Multi-CCSID Support (17 Encodings)
EBCDIC variants for different regions:
- **37** - US/Canada (Default)
- **273** - German/Austrian
- **285** - United Kingdom
- **297** - French
- **500** - International
- **875** - Greek
- **1025** - Cyrillic
- **1026** - Turkish
- **1047** - Latin-1
- **1140-1148** - Euro variants

Your CCSID selection persists for your next session.

### Green Screen Interface
- Full IBM i 5250 terminal emulation
- 24x80 character display (authentic green monochrome)
- Real-time screen updates
- Function key support (F1-F12)

### Connection Modes Display
After successful connection, the connection info shows:
- **Connection Status**: Connected indicator
- **Language**: Selected language with native name
- **CCSID**: Selected encoding with region
- **Mode**: "Demo Mode" or "iTookit (Real)" label

---

## 🔧 Development & Production Builds

### Development Mode
```bash
npm run dev
# Hot reload enabled, debug tools available
```

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Build Output
- **Frontend**: 220.39 KB JavaScript, 19.25 KB CSS (optimized & gzipped)
- **Backend**: Express API server on port 3001

---

## 📚 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run type-check` | TypeScript type checking |
| `cd ibmi-backend-api && npm start` | Start backend API server |
| `cd ibmi-backend-api && npm run dev` | Backend with auto-reload (nodemon) |

---

## 🎯 Component Overview

### Main Components
- **GreenScreen** - Green screen display terminal (24x80)
- **ConnectionPanel** - IBM i connection form with language/CCSID selection
- **ControlPanel** - Function keys and action buttons

### Custom Hooks (useIBMi.ts)
- `useIBMiConnection()` - Manage IBM i connections
- `useGreenScreen()` - Handle screen display and input
- `useIBMiCommand()` - Execute IBM i commands
- `useIBMiQuery()` - Run queries and retrieve data
- `useScreenForm()` - Manage form state
- `useConnectionError()` - Handle connection errors

### Services
- **IBMiConnectionService** - Core connection management
  - Demo Mode: Mock data generation
  - Real Mode: iTookit integration

### Actions (ibmiActions.ts)
Pre-built handlers for common operations

---

## 🔗 iTookit Integration Details

### What's New
- **server.js**: Updated with iTookit service integration
- **ibm-i-toolkit.js**: Service wrapper for iTookit and idb-connector
- **New API endpoints**: `/api/instances/list`, `/api/status/libraries`
- **Updated endpoints**: All support both Demo and Real modes automatically

### Connection Flow
```
User connects
    ↓
Backend checks: USE_REAL_CONNECTION=true AND iTookit available?
    ↓
YES → Real IBM i connection via Telnet 5250
NO  → Demo Mode with mock data
    ↓
Instance list displayed (Real or Mock)
    ↓
Ready for commands/queries
```

### Auto-Fallback
If iTookit fails or not installed:
1. Backend automatically falls back to Demo Mode
2. Application continues working with mock data
3. User can still test the UI
4. No manual configuration needed

---

## 🐛 Troubleshooting

## � Troubleshooting

### Frontend Issues

**"npm: command not found"**
- Install Node.js from https://nodejs.org/
- Restart terminal/PowerShell after installation

**"Cannot find module"**
```bash
rm -r node_modules  # or Remove-Item node_modules -Recurse
npm install
```

**Port 5173 already in use**
```bash
npm run dev -- --port 3000  # Use different port
```

### Backend Issues

**Dependencies not installing**
```bash
cd ibmi-backend-api
rm -r node_modules
npm cache clean --force
npm install
```

**"Failed to compile native addon" (iTookit)**
- Install Visual Studio Build Tools with C++ support
- Delete node_modules, clear cache, reinstall
- On Windows, run in Administrator command prompt

**Backend won't start**
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001  # Windows

# Kill the process or use different port
npm start -- --port 3002  # Use different port
```

### Connection Issues

**"Connection refused"**
- Check IBM i hostname is correct
- Test: `ping your-ibmi-hostname`
- Verify firewall allows port 23 (or your configured port)
- Ensure Telnet is enabled on IBM i system

**"Only demo mode available"**
- iTookit not installed or failed to compile
- This is actually OK! Demo mode works perfectly for testing
- For real connections, run `npm install` in ibmi-backend-api

**"Authentication failed"**
- Verify username and password are correct
- Check IBM i account is active and not locked
- Ensure user has appropriate permissions

### Demo vs Real Mode

**Check which mode is running:**
```bash
curl http://localhost:3001/api/status/libraries
# Returns iTookit availability status
```

### More Help

For detailed troubleshooting:
- See [ITOOKIT_SETUP.md](./ITOOKIT_SETUP.md) for iTookit issues
- See [ITOOKIT_INTEGRATION_COMPLETE.md](./ITOOKIT_INTEGRATION_COMPLETE.md) for integration details
- Check [Backend README](./ibmi-backend-api/README.md) for API details
- See [Main README](./README.md) for full documentation

---

## 💡 Tips & Tricks

- **Browser DevTools**: Press F12 to inspect network requests and console logs
- **Auto-save settings**: Connection details are saved in browser storage
- **Languages persist**: Your language choice is remembered between sessions
- **Demo anytime**: Even with real mode enabled, you can use Demo Mode credentials
- **Error messages**: Check browser console (F12) and backend terminal for detailed errors
- **Performance**: Production build is optimized and significantly smaller

---

## 📞 Support & Documentation

For comprehensive documentation:
- **Getting Started**: See [QUICK_START.md](./QUICK_START.md) (this file)
- **Setup & iTookit**: See [ITOOKIT_SETUP.md](./ITOOKIT_SETUP.md)
- **Integration Details**: See [ITOOKIT_INTEGRATION_COMPLETE.md](./ITOOKIT_INTEGRATION_COMPLETE.md)
- **Backend API**: See [ibmi-backend-api/README.md](./ibmi-backend-api/README.md)
- **Full Details**: See [README.md](./README.md)

---

## 🎯 Quick Navigation

| Want to... | Do this |
|-----------|------|
| Test UI immediately | Run Demo Mode (Option 1) |
| Connect real IBM i | Set up iTookit (Option 2) |
| Start everything | Run `START-ALL.bat` |
| Check backend health | `curl http://localhost:3001/api/health` |
| Build for production | `npm run build` |
| Clear everything | `rm -r node_modules && npm install` |

---

## ✅ Verification Checklist

Before declaring success:

- [ ] Frontend loads at http://localhost:5173
- [ ] Connection form displays with all fields
- [ ] Backend responds to API health check
- [ ] Can select language and CCSID
- [ ] Can connect (Demo or Real)
- [ ] Instance/library selection appears
- [ ] Green screen displays after connection
- [ ] Connection info shows language and CCSID

---

**Happy IBMi green screen interfacing!** 🎉

Built with React 18+, TypeScript 5.0+, and Vite 4.0+
Powered by iTookit for real IBM i connections
