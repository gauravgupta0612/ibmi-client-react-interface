import React, { useEffect } from 'react';
import type { GreenScreenDisplay } from '../types/ibmi';
import { SupportedLanguages, SupportedCCSID } from '../config/appConfig';
import './GreenScreen.css';

interface GreenScreenProps {
  screenData: GreenScreenDisplay | null;
  onKeyPress?: (key: string) => void;
  loading?: boolean;
  language?: string;
  ccsid?: number;
  isConnected?: boolean;
}

/**
 * Green Screen display component
 * Renders an IBM i green screen terminal interface
 */
const GreenScreen: React.FC<GreenScreenProps> = ({
  screenData,
  onKeyPress,
  loading = false,
  language = 'ENG',
  ccsid = 37,
  isConnected = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (onKeyPress) {
        const keyMap: Record<string, string> = {
          'F1': 'F1',
          'F2': 'F2',
          'F3': 'F3',
          'F4': 'F4',
          'F5': 'F5',
          'F6': 'F6',
          'F7': 'F7',
          'F8': 'F8',
          'F9': 'F9',
          'F10': 'F10',
          'F11': 'F11',
          'F12': 'F12',
          'Enter': 'ENTER',
          'Tab': 'TAB',
          'Escape': 'ESCAPE',
        };

        if (keyMap[e.key]) {
          e.preventDefault();
          onKeyPress(keyMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  if (!screenData) {
    return (
      <div className="green-screen-container">
        <div className="green-screen-header">
          <div className="screen-info">
            <span>IBM i Green Screen Terminal</span>
            <span className="cursor-pos">Ready</span>
          </div>
        </div>
        <div className="green-screen-display">
          <div className="welcome-screen">
            <div className="welcome-banner">
              ╔════════════════════════════════════════════════════════════════╗
            </div>
            <div className="welcome-banner"></div>
            <div className="welcome-banner">
              ║                                                                ║
            </div>
            <div className="welcome-banner">
              ║          🔵 IBM i GREEN SCREEN INTERFACE 🔵                  ║
            </div>
            <div className="welcome-banner">
              ║                                                                ║
            </div>
            <div className="welcome-banner">
              ║          Ready to connect to IBM i System                     ║
            </div>
            <div className="welcome-banner">
              ║                                                                ║
            </div>
            <div className="welcome-banner">
              ║          • Configure connection in the left panel             ║
            </div>
            <div className="welcome-banner">
              ║          • Enter Host Address (e.g., 10.5.11.40)              ║
            </div>
            <div className="welcome-banner">
              ║          • Enter Port (default: 23 for Telnet)                ║
            </div>
            <div className="welcome-banner">
              ║          • Enter Username and Password                        ║
            </div>
            <div className="welcome-banner">
              ║          • Click CONNECT to establish session                 ║
            </div>
            <div className="welcome-banner">
              ║                                                                ║
            </div>
            <div className="welcome-banner">
              ║          Language: {SupportedLanguages[language as keyof typeof SupportedLanguages]?.name || language}                                  ║
            </div>
            <div className="welcome-banner">
              ║          CCSID: {SupportedCCSID[ccsid as keyof typeof SupportedCCSID]?.name || ccsid}                                    ║
            </div>
            <div className="welcome-banner">
              ║                                                                ║
            </div>
            <div className="welcome-banner">
              ╚════════════════════════════════════════════════════════════════╝
            </div>
            {loading && <div className="loading-text">Loading screen...</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="green-screen-container">
      <div className="green-screen-header">
        <div className="screen-info">
          <span>IBM i Green Screen Terminal</span>
          <span className="cursor-pos">
            {screenData.cursorPosition &&
              `Row: ${screenData.cursorPosition.row} Col: ${screenData.cursorPosition.column}`}
          </span>
        </div>
      </div>

      {isConnected && (
        <div className="connection-info-bar">
          <div className="connection-status">✓ Connected</div>
          <div className="connection-details">
            <span className="detail-item">
              Language: {SupportedLanguages[language as keyof typeof SupportedLanguages]?.name || language} ({language})
            </span>
            <span className="detail-item">
              CCSID: {SupportedCCSID[ccsid as keyof typeof SupportedCCSID]?.name || ccsid} ({ccsid})
            </span>
          </div>
        </div>
      )}

      <div className="green-screen-display">
        {screenData.data.map((row, rowIndex) => (
          <div key={rowIndex} className="screen-row">
            {row.map((cell, colIndex) => {
              const attribute = screenData.attributes?.find(
                (attr) => attr.row === rowIndex && attr.column === colIndex
              );

              return (
                <span
                  key={`${rowIndex}-${colIndex}`}
                  className={`screen-cell ${attribute?.attribute || ''}`}
                  style={{
                    color: attribute?.color || '#00ff00',
                    backgroundColor: '#000000',
                  }}
                >
                  {cell || ' '}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {screenData.messages && screenData.messages.length > 0 && (
        <div className="screen-messages">
          {screenData.messages.map((msg, idx) => (
            <div key={idx} className="message">
              {msg}
            </div>
          ))}
        </div>
      )}

      {loading && <div className="loading-overlay">Processing...</div>}
    </div>
  );
};

export default GreenScreen;
