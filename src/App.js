//Imports
import React, { useState, useEffect, Suspense, lazy, createContext, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Nav';
import Home from './components/Home';
import LandingPage from "./components/LandingPage";
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Create notification context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationTimeouts = React.useRef(new Map());

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      notificationTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, []);

  const showNotification = (message, variant = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    
    setNotifications(prev => [
      ...prev,
      { id, message, variant, createdAt: Date.now() }
    ]);

    if (duration !== Infinity) {
      const timeoutId = setTimeout(() => {
        dismissNotification(id);
        notificationTimeouts.current.delete(id);
      }, duration);
      
      notificationTimeouts.current.set(id, timeoutId);
    }

    return id;
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notificationTimeouts.current.has(id)) {
      clearTimeout(notificationTimeouts.current.get(id));
      notificationTimeouts.current.delete(id);
    }
  };

  const dismissAllNotifications = () => {
    notificationTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    notificationTimeouts.current.clear();
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      dismissNotification,
      dismissAllNotifications
    }}>
      {children}
      
      {/* Global notification container */}
      <div className="notification-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`alert alert-${notification.variant} alert-dismissible fade show mb-2 notification-toast`}
            role="alert"
            style={{ 
              minWidth: '300px',
              maxWidth: '400px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: 'none'
            }}
          >
            <div className="d-flex align-items-center">
              {notification.variant === 'success' && <span className="me-2">✅</span>}
              {notification.variant === 'danger' && <span className="me-2">⚠️</span>}
              {notification.variant === 'info' && <span className="me-2">ℹ️</span>}
              {notification.variant === 'warning' && <span className="me-2">⚠️</span>}
              <span className="flex-grow-1">{notification.message}</span>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => dismissNotification(notification.id)}
              aria-label="Close notification"
            ></button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Lazy load components with error handling
const createLazyComponent = (importFn, fallbackName) => {
  return lazy(() => 
    importFn().catch(() => ({
      default: () => (
        <div className="container py-5">
          <div className="text-center">
            <h3>Component Unavailable</h3>
            <p>{fallbackName} component is temporarily unavailable.</p>
          </div>
        </div>
      )
    }))
  );
};

const About = createLazyComponent(() => import('./components/About'), 'About');
const Portfolio = createLazyComponent(() => import('./components/Portfolio'), 'Portfolio');
const Animation = createLazyComponent(() => import('./components/Animation'), 'Animation');
const Artwork = createLazyComponent(() => import('./components/Artwork'), 'Artwork');
const PrivacyPolicy = createLazyComponent(() => import('./components/Private-policy'), 'Privacy Policy');
const VideoEditing = createLazyComponent(() => import('./components/VideoEditing'), 'Video Editing');
const Resume = createLazyComponent(() => import('./components/Resume'), 'Resume');
const Updates = createLazyComponent(() => import('./components/Updates'), 'Updates');
const Account = createLazyComponent(() => import('./components/Account'), 'Account');
const Footer = createLazyComponent(() => import('./components/Footer'), 'Footer');

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const location = useLocation();

  // Check if we're on the home page and should show landing
  const isHomePage = location.pathname === '/';
  const shouldShowLanding = isHomePage && showLandingPage;

  // Improved theme handling with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.warn('Theme detection error:', error);
      return false;
    }
  });
  
  // Observe system theme changes
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (!localStorage.getItem('theme')) {
          setDarkMode(e.matches);
        }
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.warn('Unable to detect system theme preference');
    }
  }, []);
  
  // Apply theme to document and persist user choice
  useEffect(() => {
    try {
      const root = document.documentElement;
      const body = document.body;
      
      root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
      
      if (darkMode) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
      } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
      }
      
      // Set CSS custom properties for consistent theming
      const properties = {
        '--bs-body-bg': darkMode ? '#121212' : '#ffffff',
        '--bs-body-color': darkMode ? '#ffffff' : '#212529',
        '--bs-primary': darkMode ? '#4dabf7' : '#0d6efd',
        '--bs-secondary': darkMode ? '#868e96' : '#6c757d',
        '--bs-success': darkMode ? '#51cf66' : '#198754',
        '--bs-info': darkMode ? '#22b8cf' : '#0dcaf0',
        '--bs-warning': darkMode ? '#ffd43b' : '#ffc107',
        '--bs-danger': darkMode ? '#ff6b6b' : '#dc3545',
        '--bs-light': darkMode ? '#495057' : '#f8f9fa',
        '--bs-dark': darkMode ? '#ced4da' : '#212529',
        '--card-bg': darkMode ? '#1e1e1e' : '#ffffff',
        '--card-border': darkMode ? '#343a40' : '#dee2e6',
        '--text-color': darkMode ? '#ffffff' : '#212529',
        '--text-muted': darkMode ? '#adb5bd' : '#6c757d',
        '--border-color': darkMode ? '#495057' : '#dee2e6',
        '--input-bg': darkMode ? '#2d3339' : '#ffffff',
        '--input-border': darkMode ? '#495057' : '#ced4da',
        '--input-focus-border': darkMode ? '#86b7fe' : '#86b7fe',
        '--modal-bg': darkMode ? '#1e1e1e' : '#ffffff',
        '--modal-backdrop': darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)'
      };
      
      Object.entries(properties).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Unable to apply theme settings');
    }
  }, [darkMode]);

  // Toggle theme function
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`} data-theme={darkMode ? 'dark' : 'light'}>
          {!shouldShowLanding && <Navigation toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home setShowHomePage={setShowLandingPage} />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/animation" element={<Animation />} />
                <Route path="/artwork" element={<Artwork />} />
                <Route path="/video-editing" element={<VideoEditing />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/updates" element={<Updates />} />
                <Route path="/account" element={<Account />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </Suspense>
          </main>
          <Suspense fallback={<div className="pb-5 mb-5" />}>
            {!shouldShowLanding && <Footer />}
          </Suspense>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;