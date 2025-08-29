import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
