import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize theme before React renders to prevent flash
const initializeTheme = () => {
  try {
    // Clean up old theme storage key if it exists
    const oldTheme = localStorage.getItem('nebula_theme');
    if (oldTheme && !localStorage.getItem('theme')) {
      localStorage.setItem('theme', oldTheme);
      localStorage.removeItem('nebula_theme');
      console.log('Migrated theme preference from old storage key');
    }
    
    const savedTheme = localStorage.getItem('theme'); // Use same key as App.js
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemPreference;
    
    document.documentElement.setAttribute('data-theme', theme);
    console.log('Theme pre-initialized:', theme);
  } catch (error) {
    console.warn('Theme pre-initialization failed:', error);
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

// Run theme initialization immediately
initializeTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

reportWebVitals();