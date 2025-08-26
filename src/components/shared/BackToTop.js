import React from 'react';
import './BackToTop.css';

const BackToTop = ({ show }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      className={`back-to-top ${show ? 'show' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  );
};

export default BackToTop;
