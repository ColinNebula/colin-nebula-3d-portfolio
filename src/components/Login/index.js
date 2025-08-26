import React, { useState, useEffect } from 'react';
// Remove Apollo dependency temporarily
// import { useMutation } from '@apollo/client';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Auth from '../../utils/auth'; 

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
    // Check if redirected with an error message
    const params = new URLSearchParams(location.search);
    const errorMsg = params.get('error');
    if (errorMsg) {
      setCustomError(decodeURIComponent(errorMsg));
    }
    
    // Test connection to GraphQL endpoint
    checkServerConnection();
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
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>

      <h2>Login</h2>
      
      {/* Connection status indicator */}
      {connectionStatus === 'error' && (
        <div className="server-status-alert" style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
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
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '0.8rem'
        }}>
          <details>
            <summary>Troubleshooting Info</summary>
            <p>API Endpoint: /api/login</p>
            <p>Auth Status: {Auth.loggedIn() ? 'Logged In' : 'Not Logged In'}</p>
            <p>Connection Status: {connectionStatus}</p>
            <p className="mt-2">
              <strong>Note:</strong> Apollo Client is not configured. Using fetch API instead.
              <br />
              Install Apollo Client with: <code>npm install @apollo/client graphql</code>
            </p>
          </details>
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email address:</label>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
            value={formState.email}
            required
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="pwd">Password:</label>
          <input
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
            value={formState.password}
            required
          />
        </div>
        
        {/* Enhanced error display with troubleshooting tips */}
        {customError && (
          <div className="error-container" style={{ 
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            <p className="error-text" style={{ margin: 0 }}>
              <strong>Error:</strong> {customError}
            </p>
            <details style={{ marginTop: '8px', fontSize: '0.9em' }}>
              <summary>Troubleshooting Tips</summary>
              <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                <li>Check if your email and password are correct</li>
                <li>Make sure you have a stable internet connection</li>
                <li>Clear browser cache and cookies</li>
                <li>Try using incognito/private mode</li>
                <li>If the issue persists, contact support</li>
              </ul>
            </details>
          </div>
        )}
        
        <div className="flex-row flex-end">
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1 
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;


