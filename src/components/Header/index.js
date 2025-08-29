import React from 'react';
import Navigation from '../Nav';

const Header = ({ toggleDarkMode, darkMode }) => {
  return (
    <header>
      <Navigation toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </header>
  );
};

export default Header;