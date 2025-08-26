class AuthService {
  getProfile() {
    return this.decodeToken();
  }

  loggedIn() {
    // Check if there's a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      // Check if the token is expired
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token validation error:', err);
      return true; // Consider invalid tokens as expired
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // Improved token validation and error handling
    if (!idToken) {
      console.error('No token provided to Auth.login()');
      throw new Error('Invalid authentication token');
    }
    
    // Extra validation to ensure token is a string
    if (typeof idToken !== 'string') {
      console.error('Token is not a string:', typeof idToken);
      throw new Error('Invalid token format');
    }
    
    // Check minimum token length
    if (idToken.length < 10) {
      console.error('Token appears too short:', idToken.length);
      throw new Error('Token is too short');
    }
    
    // Debug token content before storing
    try {
      const decoded = this.decodeToken(idToken);
      console.log('Token payload:', decoded);
      
      // Check for required token fields
      if (!decoded || !decoded.exp) {
        console.warn('Token may be missing required fields');
      }
    } catch (err) {
      console.warn('Could not decode token for debugging:', err);
    }
    
    // Clear any previous token
    localStorage.removeItem('id_token');
    
    // Store the new token
    try {
      localStorage.setItem('id_token', idToken);
      
      // Verify token was stored correctly
      const storedToken = localStorage.getItem('id_token');
      if (storedToken !== idToken) {
        console.error('Token storage verification failed');
        throw new Error('Token storage failed');
      }
    } catch (e) {
      console.error('Error storing token in localStorage:', e);
      
      // Check if localStorage is available and working
      try {
        localStorage.setItem('test_storage', 'test');
        localStorage.removeItem('test_storage');
      } catch (storageError) {
        console.error('localStorage is not available:', storageError);
        throw new Error('Browser storage is not available');
      }
      
      throw new Error('Failed to save authentication data');
    }
    
    // Get redirect path or go to home
    const redirectPath = localStorage.getItem('redirect_after_login') || '/';
    localStorage.removeItem('redirect_after_login');
    
    // Use window.location to ensure a full reload
    window.location.assign(redirectPath);
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // Use window.location to ensure a full reload
    window.location.assign('/');
  }

  decodeToken(token = this.getToken()) {
    if (!token) return {};
    
    try {
      // Decode token (assumes JWT format)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Token does not appear to be in JWT format');
      }
      
      // Base64 decode the payload (middle part of JWT)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }
}

export default new AuthService();
