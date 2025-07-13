import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize Telegram Web App
declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    }
  }
}

// Set custom headers for all fetch requests
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
  if (!init) {
    init = {};
  }
  if (!init.headers) {
    init.headers = {};
  }

  // Convert input to URL if it's a string
  const url = typeof input === 'string' ? new URL(input, window.location.origin) : input;
  
  // Add query parameter to bypass cache
  if (url instanceof URL) {
    url.searchParams.set('ngrok_bypass', 'true');
  }

  // Add headers
  const headers = new Headers(init.headers);
  headers.set('ngrok-skip-browser-warning', 'true');
  headers.set('User-Agent', 'TelegramWebApp');
  
  init.headers = headers;
  return originalFetch(url, init);
};

// Add meta tags
const addMetaTags = () => {
  const metaTags = [
    { name: 'ngrok-skip-browser-warning', content: 'true' },
    { 'http-equiv': 'User-Agent', content: 'TelegramWebApp' }
  ];

  metaTags.forEach(tag => {
    const meta = document.createElement('meta');
    Object.entries(tag).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
  });
};

// Initialize WebApp and add meta tags
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  addMetaTags();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
