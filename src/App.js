//Imports
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Animation from './components/Animation';
import Artwork from './components/Artwork';
import PrivacyPolicy from './components/Private-policy';
import VideoEditing from './components/VideoEditing';
import Resume from './components/Resume';
import Updates from './components/Updates'; 
import Account from './components/Account'; 
import Footer from './components/Footer';
import LandingPage from "./components/LandingPage";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * NOTE: To use Apollo Client for GraphQL:
 * 1. Install required packages:
 *    npm install @apollo/client graphql
 * 
 * 2. Then uncomment and complete the Apollo configuration
 */

function App() {
  // State for theme or other app-wide settings could go here
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle theme function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
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
      </main>
      <Footer />
    </div>
  );
}

export default App;