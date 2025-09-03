import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import './App.css';

function App() {
  const [platform, setPlatform] = useState<string>('web');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // Set platform info
    setPlatform(Capacitor.getPlatform());

    // Configure status bar for mobile
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#3b82f6' });
    }

    // Listen for keyboard events
    const showListener = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardOpen(true);
    });

    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>My React Mobile App</h1>
        <p className="platform-info">Running on: {platform}</p>
      </header>

      <main className={`main-content ${isKeyboardOpen ? 'keyboard-open' : ''}`}>
        <div className="welcome-section">
          <div className="icon">📱</div>
          <h2>Welcome to Your Mobile App!</h2>
          <p>This React app is ready to be built as a native mobile application.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Performance</h3>
            <p>Built with React and optimized for mobile devices</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📲</div>
            <h3>Native Features</h3>
            <p>Access device capabilities through Capacitor plugins</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Beautiful UI</h3>
            <p>Responsive design that works on all screen sizes</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Built with modern security best practices</p>
          </div>
        </div>

        <div className="action-section">
          <button className="primary-button">
            Get Started
          </button>
          <button className="secondary-button">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;