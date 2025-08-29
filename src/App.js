//Imports
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Nav'; // Fixed: Import Navigation instead of Header
import Home from './components/Home';
import LandingPage from "./components/LandingPage";
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy load components for better performance
const About = lazy(() => import('./components/About'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Animation = lazy(() => import('./components/Animation'));
const Artwork = lazy(() => import('./components/Artwork'));
const PrivacyPolicy = lazy(() => import('./components/Private-policy'));
const VideoEditing = lazy(() => import('./components/VideoEditing'));
const Resume = lazy(() => import('./components/Resume'));
const Updates = lazy(() => import('./components/Updates'));
const Account = lazy(() => import('./components/Account'));
const Footer = lazy(() => import('./components/Footer'));

/**
 * NOTE: To use Apollo Client for GraphQL:
 * 1. Install required packages:
 *    npm install @apollo/client graphql
 * 
 * 2. Then uncomment and complete the Apollo configuration
 */

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const location = useLocation();

  // Check if we're on the home page and should show landing
  const isHomePage = location.pathname === '/';
  const shouldShowLanding = isHomePage && showLandingPage;

  // Improved theme handling with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Otherwise check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Observe system theme changes
  useEffect(() => {
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
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  // Apply theme to document and persist user choice
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Toggle theme function
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      {/* Only show Navigation if not on landing page */}
      {!shouldShowLanding && <Navigation toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <main>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home setShowLandingPage={setShowLandingPage} />} />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/animation" element={<Animation />} />
              <Route path="/artwork" element={<Artwork />} />
              <Route path="/video-editing" element={<VideoEditing />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/updates" element={<Updates />} />
              <Route path="/account" element={<Account />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              {/* Add a catch-all route that redirects to the landing page */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Suspense fallback={<div className="pb-5 mb-5" />}>
        {/* Only show Footer if not on landing page */}
        {!shouldShowLanding && <Footer />}
      </Suspense>
    </div>
  );
}

export default App;