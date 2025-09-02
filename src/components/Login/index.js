import React, { useState, useEffect } from 'react';
// Remove Apollo dependency temporarily
// import { useMutation } from '@apollo/client';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Auth from '../../utils/auth';
import './Login.css'; 

function Login(props) {
  const [formState, setFormState] = useState({ email: '', password: '' });
  // Replace Apollo mutation with regular fetch
  // const [loginMutation, { error: apolloError, loading }] = useMutation(LOGIN);
  const [loading, setLoading] = useState(false);
  const [customError, setCustomError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for redirect parameters
  useEffect(() => {
    // Add body class to prevent scrolling and hide everything
    document.body.classList.add('login-modal-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    // Hide main app content if it exists
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    
    if (mainContent) mainContent.style.display = 'none';
    if (header) header.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Check if redirected with an error message
    const params = new URLSearchParams(location.search);
    const errorMsg = params.get('error');
    if (errorMsg) {
      setCustomError(decodeURIComponent(errorMsg));
    }
    
    // Test connection to GraphQL endpoint
    checkServerConnection();

    // Cleanup function to restore everything
    return () => {
      document.body.classList.remove('login-modal-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      
      // Restore main app content
      if (mainContent) mainContent.style.display = '';
      if (header) header.style.display = '';
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, [location]);
  
  // Function to test server connection
  const checkServerConnection = async () => {
    try {
      // Make a simple fetch to your GraphQL endpoint
      const response = await fetch(process.env.REACT_APP_GRAPHQL_URI || '/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '{ __typename }'
        })
      });
      
      if (!response.ok) {
        setConnectionStatus('error');
        console.error('GraphQL endpoint not responding correctly');
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      setConnectionStatus('error');
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setCustomError('');
    setLoading(true);
    
    if (connectionStatus === 'error') {
      setCustomError('Unable to connect to login service. Please try again later.');
      setLoading(false);
      return;
    }
    
    try {
      // Validate inputs
      if (!formState.email || !formState.password) {
        setCustomError('Email and password are required');
        setLoading(false);
        return;
      }

      // Replace Apollo mutation with fetch
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password
        })
      });

      const data = await response.json();
      
      // Debug response structure
      console.log('Login response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        setCustomError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Check if token exists in the response
      const token = data.token;
      if (!token) {
        setCustomError('Authentication token not received');
        setLoading(false);
        return;
      }

      // Successfully got token, now login
      try {
        Auth.login(token);
        // If login doesn't redirect, manually navigate to home
        navigate('/');
      } catch (authError) {
        console.error('Auth login error:', authError);
        setCustomError('Error storing authentication token');
      }
    } catch (e) {
      console.error('Login error:', e);
      setCustomError(e.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-card container my-1">
        <Link to="/signup" style={{ 
          fontSize: '0.9rem', 
          marginBottom: '15px', 
          display: 'inline-block',
          color: 'var(--primary)',
          textDecoration: 'none'
        }}>← Go to Signup</Link>

        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '25px', 
          textAlign: 'center',
          color: 'var(--text)',
          fontWeight: '600'
        }}>Login</h2>
      
      {/* Connection status indicator */}
      {connectionStatus === 'error' && (
        <div className="server-status-alert" style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404',
          padding: '8px',
          borderRadius: '4px',
          marginBottom: '12px',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: 0 }}>
            <strong>⚠️ Server connection issue detected.</strong> Login may not work correctly.
          </p>
        </div>
      )}
      
      {/* Debug info section in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{ 
          backgroundColor: '#e2f3eb', 
          padding: '8px',
          borderRadius: '4px',
          marginBottom: '12px',
          fontSize: '0.75rem'
        }}>
          <details>
            <summary style={{ fontSize: '0.8rem', cursor: 'pointer' }}>Troubleshooting Info</summary>
            <div style={{ marginTop: '5px', fontSize: '0.75rem' }}>
              <p style={{ margin: '2px 0' }}>API Endpoint: /api/login</p>
              <p style={{ margin: '2px 0' }}>Auth Status: {Auth.loggedIn() ? 'Logged In' : 'Not Logged In'}</p>
              <p style={{ margin: '2px 0' }}>Connection Status: {connectionStatus}</p>
              <p style={{ margin: '5px 0 0 0' }}>
                <strong>Note:</strong> Apollo Client is not configured. Using fetch API instead.
                <br />
                Install Apollo Client with: <code style={{ fontSize: '0.7rem' }}>npm install @apollo/client graphql</code>
              </p>
            </div>
          </details>
        </div>
      )}

      <form onSubmit={handleFormSubmit} style={{ maxWidth: '100%' }}>
        <div className="flex-row space-between my-2" style={{ flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="email" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email address:</label>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
            value={formState.email}
            required
            style={{ padding: '8px', fontSize: '0.9rem', width: '100%' }}
          />
        </div>
        <div className="flex-row space-between my-2" style={{ flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="pwd" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Password:</label>
          <input
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
            value={formState.password}
            required
            style={{ padding: '8px', fontSize: '0.9rem', width: '100%' }}
          />
        </div>
        
        {/* Enhanced error display with troubleshooting tips */}
        {customError && (
          <div className="error-container" style={{ 
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '12px',
            fontSize: '0.85rem'
          }}>
            <p className="error-text" style={{ margin: 0 }}>
              <strong>Error:</strong> {customError}
            </p>
            <details style={{ marginTop: '6px', fontSize: '0.8rem' }}>
              <summary style={{ cursor: 'pointer' }}>Troubleshooting Tips</summary>
              <ul style={{ paddingLeft: '16px', marginTop: '4px', fontSize: '0.75rem' }}>
                <li>Check if your email and password are correct</li>
                <li>Make sure you have a stable internet connection</li>
                <li>Clear browser cache and cookies</li>
                <li>Try using incognito/private mode</li>
                <li>If the issue persists, contact support</li>
              </ul>
            </details>
          </div>
        )}
        
        <div className="flex-row flex-end" style={{ marginTop: '15px' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              padding: '10px 20px',
              fontSize: '0.9rem',
              width: '100%'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Login;


