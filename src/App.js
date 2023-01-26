//Imports
import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Animation from './components/Animation';
import Artwork from './components/Artwork';
import Landing from './components/Landing';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Footer from './components/Footer';

import BootstrapCarousel from './components/BootstrapCarousel';



function App() {

  const [currentTab, setCurrentTab] = useState("landing");

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
          case "landing":
            return <Landing />;
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
