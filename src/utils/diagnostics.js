/**
 * Authentication Diagnostics Tool
 * 
 * This utility helps identify common issues with authentication.
 */

export const runAuthDiagnostics = () => {
  const results = {
    localStorageAvailable: false,
    cookiesAvailable: false,
    tokenPresent: false,
    tokenFormat: null,
    issues: []
  };
  
  // Check localStorage availability
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    results.localStorageAvailable = true;
  } catch (e) {
    results.issues.push('localStorage is not available. Login state cannot be persisted.');
  }
  
  // Check for token
  const token = localStorage.getItem('id_token');
  if (token) {
    results.tokenPresent = true;
    
    // Check token format
    const parts = token.split('.');
    results.tokenFormat = parts.length === 3 ? 'JWT' : 'Unknown';
    
    if (parts.length !== 3) {
      results.issues.push('Token does not appear to be in JWT format.');
    }
    
    // Check if token might be expired
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        results.issues.push(`Token is expired. Expired at: ${new Date(payload.exp * 1000)}`);
      }
    } catch (e) {
      results.issues.push('Unable to decode token payload.');
    }
  } else {
    results.issues.push('No authentication token found.');
  }
  
  // Check cookie availability
  results.cookiesAvailable = navigator.cookieEnabled;
  if (!results.cookiesAvailable) {
    results.issues.push('Cookies are disabled in your browser. This may affect authentication.');
  }
  
  // Output diagnostic info
  console.table({
    'Local Storage': results.localStorageAvailable ? '✅ Available' : '❌ Not Available',
    'Cookies': results.cookiesAvailable ? '✅ Enabled' : '❌ Disabled',
    'Token': results.tokenPresent ? `✅ Present (${results.tokenFormat})` : '❌ Not Found',
    'Issues Found': results.issues.length
  });
  
  results.issues.forEach((issue, i) => {
    console.warn(`Issue ${i+1}: ${issue}`);
  });
  
  return results;
};

export const testAPIEndpoint = async (endpoint = '/api/login') => {
  console.log(`Testing API endpoint: ${endpoint}`);
  
  try {
    // Just check if endpoint responds, not sending credentials
    const response = await fetch(endpoint, {
      method: 'OPTIONS', // Use OPTIONS to check API availability without making changes
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`API status: ${response.status} ${response.statusText}`);
    return response.status < 500; // Anything other than a server error
  } catch (err) {
    console.error('API endpoint test failed:', err);
    return false;
  }
};

// Create a helper function to be called from browser console for debugging
if (typeof window !== 'undefined') {
  window.diagnoseAuth = async () => {
    console.log('Running authentication diagnostics...');
    const authResults = runAuthDiagnostics();
    console.log('Testing API endpoint...');
    const endpointWorking = await testAPIEndpoint();
    
    return {
      authResults,
      apiEndpoint: endpointWorking ? '✅ Responding' : '❌ Not Responding'
    };
  };
}

export default {
  runAuthDiagnostics,
  testAPIEndpoint
};