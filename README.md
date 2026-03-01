# IBM i Green Screen Interface - React Application

A modern, professional React TypeScript application for connecting to and interacting with IBM i (AS400) systems using a green screen terminal interface.

## Features

✅ **Green Screen Terminal Interface** - Authentic IBM i green screen emulation  
✅ **Secure Connection Management** - Encrypted credentials and session handling  
✅ **Multi-Language Support** - 12 languages (ENG, FRA, DEU, ESP, ITA, NLD, JPN, CHS, KOR, RUS, POR, POL)  
✅ **Multi-CCSID Support** - 17 character encodings (37, 273, 285, 297, 500, 875, 1025-1026, 1047, 1140-1148)  
✅ **Function Key Support** - F1-F12 function key navigation  
✅ **Action Handlers** - Pre-built handlers for common IBM i operations  
✅ **Data Operations** - Create, Read, Update, Delete (CRUD) operations  
✅ **Command Execution** - Execute IBM i commands directly  
✅ **Query Support** - Execute SQL queries and retrieve data  
✅ **Screen Refresh** - Auto-refresh capability with configurable intervals  
✅ **Data Export** - Export screen data to CSV, Excel, or JSON formats  
✅ **Search Functionality** - Search within screen displays  
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices  
✅ **Dark Mode Support** - Automatic dark mode based on system preferences  
✅ **Accessibility** - WCAG compliant with keyboard navigation support  
✅ **Error Handling** - Comprehensive error handling and recovery mechanisms  
✅ **Session Management** - Keep-alive and session timeout handling  

## Project Structure

```
src/
├── components/              # React components
│   ├── GreenScreen.tsx      # Main green screen display component
│   ├── GreenScreen.css      # Green screen styling
│   ├── ConnectionPanel.tsx  # Connection configuration UI
│   ├── ConnectionPanel.css  # Connection panel styling
│   ├── ControlPanel.tsx     # Function keys and action buttons
│   └── ControlPanel.css     # Control panel styling
├── services/                # API and connection services
│   └── IBMiConnectionService.ts  # Main connection service
├── actions/                 # Action handlers
│   └── ibmiActions.ts       # Pre-built action handlers
├── hooks/                   # Custom React hooks
│   └── useIBMi.ts           # IBM i specific hooks
├── types/                   # TypeScript type definitions
│   └── ibmi.ts              # IBM i interfaces and types
├── config/                  # Application configuration
│   └── appConfig.ts         # Config constants and settings
├── utils/                   # Utility functions
│   └── helpers.ts           # Helper functions (logging, validation, etc.)
├── App.tsx                  # Main application component
├── App.css                  # Application styling
├── main.tsx                 # Application entry point
└── index.css                # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Environment Configuration

Create a `.env` file:
```env
VITE_IBMI_HOST=your-ibmi-host
VITE_IBMI_PORT=23
VITE_API_URL=http://localhost:3001/api
VITE_THEME=light
```

### Backend API Server Setup

The application requires a Node.js backend API server. A template server is included in `ibmi-backend-api/`.

**Setup Backend:**
```bash
# Navigate to backend directory
cd ibmi-backend-api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The backend server will run on `http://localhost:3001`

For production, you'll need to integrate with actual IBM i libraries:
- `node-5250` - Telnet 5250 client
- `idb-connector` - IBM i database connector

## Usage Guide

### Connecting to IBM i
1. Enter host address and credentials in Connection Panel
2. Select your preferred language (default: English)
3. Select appropriate CCSID for character encoding (default: 37 - US/Canada)
4. Click "Connect" button
5. Green screen will display upon successful connection
6. Your language and CCSID selection will be displayed in the connection info bar

### Supported Languages
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

### Supported CCSID (Character Encodings)
- **37** - EBCDIC US/Canada (Default)
- **273** - EBCDIC German/Austrian
- **285** - EBCDIC United Kingdom
- **297** - EBCDIC French
- **500** - EBCDIC International
- **875** - EBCDIC Greek
- **1025** - EBCDIC Cyrillic
- **1026** - EBCDIC Turkish
- **1047** - EBCDIC Latin-1
- **1140-1148** - EBCDIC Euro variants

Language and CCSID selections are automatically saved to browser storage and restored on next connection.

### Function Keys
- **F1** Help | **F2** Enter | **F3** Exit | **F4** Prompt
- **F5** Refresh | **F6** Create | **F7** Filter | **F8** Sort
- **F9** Retrieve | **F10** Delete | **F11** Toggle | **F12** Cancel

### Available Actions
- Screen refresh and clear
- Data export (CSV/Excel/JSON)
- CRUD operations (Create, Read, Update, Delete)
- Search and filter
- System information retrieval

## Backend API Requirements

The application requires a backend server implementing:
- `POST /api/connect` - Establish connection
- `GET /api/screen/display` - Retrieve screen data
- `POST /api/screen/input` - Submit input
- `POST /api/command/execute` - Execute commands
- `POST /api/query/execute` - Execute queries

## Development Scripts

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## Accessibility

- Full keyboard navigation
- Screen reader compatible
- High contrast mode support
- WCAG 2.1 AA compliant

## Security Features

- Credential encryption
- Session token validation
- Input validation & sanitization
- XSS protection
- CSRF prevention
- Secure HTTPS communication (production)

## Customization

### Modify Theme
Edit `src/config/appConfig.ts` to adjust colors, fonts, and UI settings.

### Add Custom Actions
Extend `src/actions/ibmiActions.ts` with your own action handlers.

### Create Custom Hooks
Build new hooks in `src/hooks/useIBMi.ts` for specialized functionality.

## Performance

- Code splitting & lazy loading
- Component memoization
- Efficient state management
- Data pagination support
- Request caching
- GZIP compression

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection timeout | Verify host is reachable, check firewall |
| Auth failed | Confirm credentials, check user permissions |
| Screen not displaying | Clear cache, adjust screen dimensions in config |
| Slow performance | Enable pagination, reduce refresh interval |

## Support

For issues or questions, contact your IBM i system administrator or development team.

## Version

**IBM i Client v1.0.0** - March 2, 2026

---

Built with React 18+, TypeScript 5.0+, and Vite 4.0+
