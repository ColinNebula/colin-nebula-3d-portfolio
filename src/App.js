//Imports
import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Animation from './components/Animation';
import Artwork from './components/Artwork';
import VideoEditing from './components/VideoEditing';

import 'bootstrap/dist/css/bootstrap.min.css';
// import Footer from './components/Footer';

import BootstrapCarousel from './components/BootstrapCarousel';
import LandingPage from './components/LandingPage';



function App() {

  const [currentTab, setCurrentTab] = useState("landing-page");

  const renderTab = () => {
    switch (currentTab) {
      case "home":
        return <Home />;

      case "about":
        return <About />;

      case "portfolio":
        return <Portfolio />

      case "artwork":
        return <Artwork />;

      case "animation":
          return <Animation />;

          case "video-editing":
          return <VideoEditing />;

          case "landing-page":
            return <LandingPage />;
      default:
        return null;
    }
  };

  return (
    
    <div>
    <div>
      
				<Header currentTab={currentTab} setCurrentTab={setCurrentTab}></Header>
        
			</div>

    <BootstrapCarousel />
  
      <div>
      <main>{renderTab()}</main>
    </div>
   
  </div>

  );
}

export default App;
