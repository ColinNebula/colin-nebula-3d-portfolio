//Imports
import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Animation from './components/Animation';
import Artwork from './components/Artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer';

import BootstrapCarousel from './components/BootstrapCarousel';



function App() {

  const [currentTab, setCurrentTab] = useState("home");

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
    <div>
      <Footer></Footer>
    </div>
  </div>

  );
}

export default App;
