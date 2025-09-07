import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize theme before React renders to prevent flash
const initializeTheme = () => {
  try {
    const savedTheme = localStorage.getItem('nebula_theme');
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