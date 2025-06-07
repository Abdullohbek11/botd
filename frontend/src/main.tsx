import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Telegram Mini App SDK ni import qilish
declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

// ngrok uchun header
const headers = new Headers();
headers.append('ngrok-skip-browser-warning', '1');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
