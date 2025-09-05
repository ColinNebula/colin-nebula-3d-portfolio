// Environment Configuration Utility
// This file provides easy access to environment variables with fallbacks

export const envConfig = {
  // EmailJS Configuration
  emailjs: {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
  },

  // Application Settings
  app: {
    name: process.env.REACT_APP_WEBSITE_NAME || 'Colin Nebula 3D Portfolio',
    url: process.env.REACT_APP_WEBSITE_URL || 'http://localhost:3000',
    homepage: process.env.REACT_APP_HOMEPAGE || '/',
  },

  // Feature Flags
  features: {
    notifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    darkMode: process.env.REACT_APP_ENABLE_DARK_MODE !== 'false', // Default true
    portfolioAnimations: process.env.REACT_APP_ENABLE_PORTFOLIO_ANIMATIONS !== 'false',
    contactForm: process.env.REACT_APP_ENABLE_CONTACT_FORM !== 'false',
    lazyLoading: process.env.REACT_APP_ENABLE_LAZY_LOADING !== 'false',
  },

  // Theme Configuration
  theme: {
    default: process.env.REACT_APP_DEFAULT_THEME || 'dark',
    storageKey: process.env.REACT_APP_THEME_STORAGE_KEY || 'nebula_theme_preference',
  },

  // Performance Settings
  performance: {
    initialPortfolioLoad: parseInt(process.env.REACT_APP_INITIAL_PORTFOLIO_LOAD) || 12,
    animationPerformance: process.env.REACT_APP_ANIMATION_PERFORMANCE || 'high',
  },

  // Development Settings
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validation function to check if required env vars are present
export const validateEnvConfig = () => {
  const required = [
    'REACT_APP_EMAILJS_SERVICE_ID',
    'REACT_APP_EMAILJS_TEMPLATE_ID',
    'REACT_APP_EMAILJS_PUBLIC_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

// Helper function to get environment-specific settings
export const getEnvSettings = () => {
  return {
    apiUrl: envConfig.isDevelopment 
      ? 'http://localhost:3000' 
      : envConfig.app.url,
    debugMode: envConfig.isDevelopment,
    showDevTools: envConfig.isDevelopment,
  };
};

export default envConfig;