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
    // Saves user token to localStorage and reloads the page
    if (!idToken) {
      console.error('No token provided to Auth.login()');
      throw new Error('Invalid authentication token');
    }
    
    // Debug token content before storing
    try {
      const decoded = this.decodeToken(idToken);
      console.log('Token payload:', decoded);
    } catch (err) {
      console.warn('Could not decode token for debugging:', err);
    }
    
    localStorage.setItem('id_token', idToken);
    
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
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }
}

export default new AuthService();
