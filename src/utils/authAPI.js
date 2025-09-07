// API service for MySQL backend authentication
class AuthAPI {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.token = localStorage.getItem('auth_token');
  }

  // Helper method for API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User authentication methods
  async signup(userData) {
    try {
      const response = await this.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success && response.token) {
        this.setToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.token) {
        this.setToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    } finally {
      this.clearToken();
    }
  }

  async getProfile() {
    try {
      return await this.request('/auth/profile');
    } catch (error) {
      if (error.message.includes('Invalid token') || error.message.includes('401')) {
        this.clearToken();
      }
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  // Email verification methods
  async sendVerificationCode(email) {
    try {
      return await this.request('/auth/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      throw new Error(`Failed to send verification code: ${error.message}`);
    }
  }

  async verifyEmail(email, code) {
    try {
      const response = await this.request('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });

      if (response.success && response.token) {
        this.setToken(response.token);
      }

      return response;
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  // Token management
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Helper method to decode JWT (client-side only, not for security)
  getTokenData() {
    if (!this.token) return null;

    try {
      const payload = this.token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  // Validation level helpers
  getValidationLevel() {
    const tokenData = this.getTokenData();
    return tokenData ? tokenData.validationLevel : 0;
  }

  canAccess(requiredLevel = 1) {
    return this.getValidationLevel() >= requiredLevel;
  }

  getAccessLevelName() {
    const level = this.getValidationLevel();
    const levels = {
      0: 'Basic (Unverified)',
      1: 'Verified Email',
      2: 'Trusted User',
      3: 'Premium Access'
    };
    return levels[level] || 'Unknown';
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health`);
      return await response.json();
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
}

// Password strength validator (client-side helper)
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  
  let score = 0;
  let feedback = [];
  
  if (password.length >= minLength) score += 1;
  else feedback.push('At least 8 characters');
  
  if (hasUpperCase) score += 1;
  else feedback.push('One uppercase letter');
  
  if (hasLowerCase) score += 1;
  else feedback.push('One lowercase letter');
  
  if (hasNumbers) score += 1;
  else feedback.push('One number');
  
  if (hasSpecialChar) score += 1;
  else feedback.push('One special character (@$!%*?&)');
  
  const strength = score < 3 ? 'Weak' : score < 5 ? 'Medium' : 'Strong';
  
  return {
    strength,
    score,
    isValid: score >= 5,
    feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : 'Password meets all requirements'
  };
};

// Email validator
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username validator
export const validateUsername = (username) => {
  if (!username || username.length < 3 || username.length > 30) {
    return { isValid: false, error: 'Username must be between 3 and 30 characters' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  
  return { isValid: true };
};

// Create singleton instance
const authAPI = new AuthAPI();

export default authAPI;

// Export the class for testing or custom instances
export { AuthAPI };