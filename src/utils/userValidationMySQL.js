// Enhanced User Validation System with MySQL Backend Support
import authAPI, { validatePassword, validateEmail, validateUsername } from './authAPI';

// Keep compatibility with existing validation levels
export const ValidationLevels = {
  LEVEL_0: 0, // Unverified - cannot login  
  LEVEL_1: 1, // Email verified - basic access
  LEVEL_2: 2, // Profile complete - full user access
  LEVEL_3: 3, // Admin approved - premium access
  // Aliases for backward compatibility
  UNVERIFIED: 0,
  EMAIL_VERIFIED: 1,
  TRUSTED_USER: 2,
  PREMIUM_ACCESS: 3
};

export const UserValidationStates = {
  UNVERIFIED: 'unverified',
  EMAIL_VERIFIED: 'email_verified',
  PHONE_VERIFIED: 'phone_verified', 
  PROFILE_COMPLETE: 'profile_complete',
  APPROVED: 'approved',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected'
};

// Enhanced User Manager with MySQL backend integration
export class UserManager {
  constructor() {
    this.isOnline = true;
    this.currentUser = null;
    this.initializeOnlineStatus();
  }

  // Check if we can connect to the backend
  async initializeOnlineStatus() {
    try {
      await authAPI.healthCheck();
      this.isOnline = true;
      console.log('✅ Connected to MySQL backend');
    } catch (error) {
      this.isOnline = false;
      console.warn('⚠️ Offline mode - using localStorage fallback');
    }
  }

  // Create new user account
  async createUser(userData) {
    const { email, password, firstName = '', lastName = '', username = email } = userData;

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      throw new Error(usernameValidation.error);
    }

    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.feedback);
    }

    try {
      if (this.isOnline) {
        // Use MySQL backend
        const response = await authAPI.signup({
          username,
          email,
          password
        });

        if (response.success) {
          // Enhance user data with additional fields
          const enhancedUser = {
            ...response.user,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            isEmailVerified: response.user.emailVerified || false,
            isProfileComplete: !!(firstName && lastName),
            validationState: this.getValidationState(response.user.validationLevel)
          };

          this.currentUser = enhancedUser;
          
          return {
            success: true,
            user: enhancedUser,
            token: response.token,
            verificationCode: response.verificationCode,
            requiresEmailVerification: response.requiresEmailVerification,
            message: response.message
          };
        } else {
          throw new Error(response.error || 'Signup failed');
        }
      } else {
        // Fallback to localStorage
        return this.createUserOffline(userData);
      }
    } catch (error) {
      // If online method fails, try offline fallback
      if (this.isOnline) {
        console.warn('Backend signup failed, trying offline mode:', error.message);
        this.isOnline = false;
        return this.createUserOffline(userData);
      }
      throw error;
    }
  }

  // Offline user creation fallback (compatible with existing structure)
  createUserOffline(userData) {
    const users = this.getAllUsers();
    
    // Check for existing users
    const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      const field = existingUser.email === userData.email ? 'email' : 'username';
      throw new Error(`${field === 'email' ? 'Email' : 'Username'} already registered`);
    }

    // Create user with existing structure
    const newUser = this.createUserObject(userData);
    users.push(newUser);
    this.saveUsers(users);
    
    // Generate verification code
    const verificationCode = this.generateVerificationCode();
    this.storeVerificationCode(userData.email, verificationCode);

    this.currentUser = newUser;

    return {
      success: true,
      user: newUser,
      verificationCode,
      requiresEmailVerification: true,
      message: 'User created successfully (offline mode). Please verify your email.'
    };
  }

  // Create user object with existing structure
  createUserObject(userData) {
    const now = new Date().toISOString();
    
    return {
      // Basic info
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: userData.username || userData.email,
      email: userData.email.toLowerCase().trim(),
      firstName: userData.firstName?.trim() || '',
      lastName: userData.lastName?.trim() || '',
      name: `${userData.firstName?.trim() || ''} ${userData.lastName?.trim() || ''}`.trim(),
      
      // Validation status
      isEmailVerified: false,
      isPhoneVerified: false,
      isProfileComplete: !!(userData.firstName && userData.lastName),
      isApproved: false,
      validationLevel: ValidationLevels.LEVEL_0,
      validationState: UserValidationStates.UNVERIFIED,
      
      // Verification tokens
      emailVerificationToken: this.generateVerificationToken(),
      emailVerificationExpiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      phoneVerificationToken: null,
      phoneVerificationExpiry: null,
      
      // Security
      passwordHash: userData.password, // In real app, this would be hashed
      loginAttempts: 0,
      lastLoginAttempt: null,
      accountLocked: false,
      accountLockExpiry: null,
      
      // Profile data
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      bio: userData.bio || '',
      preferences: {
        notifications: true,
        emailUpdates: true,
        theme: 'auto'
      },
      
      // Admin/Role info
      role: userData.role || 'user',
      isAdmin: userData.isAdmin || false,
      permissions: userData.permissions || ['read'],
      
      // Timestamps
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      emailVerifiedAt: null,
      phoneVerifiedAt: null,
      profileCompletedAt: null,
      approvedAt: null,
      
      // Metadata
      signupSource: 'portfolio_website',
      signupIP: 'localhost',
      userAgent: navigator.userAgent,
      
      // Validation tracking
      validationHistory: [
        {
          action: 'account_created',
          timestamp: now,
          level: ValidationLevels.LEVEL_0
        }
      ]
    };
  }

  // User login
  async login(usernameOrEmail, password) {
    try {
      if (this.isOnline) {
        // Use MySQL backend
        const response = await authAPI.login({
          username: usernameOrEmail,
          password
        });

        if (response.success) {
          // Enhance user data for compatibility
          const enhancedUser = {
            ...response.user,
            isEmailVerified: response.user.emailVerified || false,
            validationState: this.getValidationState(response.user.validationLevel)
          };

          this.currentUser = enhancedUser;
          return {
            success: true,
            user: enhancedUser,
            token: response.token,
            requiresEmailVerification: response.requiresEmailVerification,
            message: response.message
          };
        } else {
          throw new Error(response.error || 'Login failed');
        }
      } else {
        // Fallback to localStorage
        return this.loginOffline(usernameOrEmail, password);
      }
    } catch (error) {
      // If online method fails, try offline fallback
      if (this.isOnline) {
        console.warn('Backend login failed, trying offline mode:', error.message);
        this.isOnline = false;
        return this.loginOffline(usernameOrEmail, password);
      }
      throw error;
    }
  }

  // Offline login fallback
  loginOffline(usernameOrEmail, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === usernameOrEmail || u.username === usernameOrEmail);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.passwordHash !== password) {
      throw new Error('Invalid credentials');
    }

    // Check if user can login
    const loginCheck = this.canUserLogin(user);
    if (!loginCheck.allowed) {
      throw new Error(loginCheck.message);
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.updateUser(user);

    this.currentUser = user;

    return {
      success: true,
      user,
      requiresEmailVerification: !user.isEmailVerified,
      message: 'Login successful (offline mode)'
    };
  }

  // Email verification
  async verifyEmail(email, code) {
    try {
      if (this.isOnline) {
        const response = await authAPI.verifyEmail(email, code);
        if (response.success) {
          // Enhance user data for compatibility
          const enhancedUser = {
            ...response.user,
            isEmailVerified: true,
            emailVerifiedAt: new Date().toISOString(),
            validationState: this.getValidationState(response.user.validationLevel)
          };
          this.currentUser = enhancedUser;
        }
        return response;
      } else {
        return this.verifyEmailOffline(email, code);
      }
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  // Offline email verification
  verifyEmailOffline(email, code) {
    const storedCode = this.getStoredVerificationCode(email);
    
    if (!storedCode || storedCode.code !== code) {
      throw new Error('Invalid verification code');
    }

    if (new Date() > new Date(storedCode.expires)) {
      throw new Error('Verification code has expired');
    }

    // Mark email as verified
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    const verifiedUser = this.markEmailVerified(user);
    
    users[userIndex] = verifiedUser;
    this.saveUsers(users);

    // Remove verification code
    this.removeVerificationCode(email);

    this.currentUser = verifiedUser;

    return {
      success: true,
      user: verifiedUser,
      message: 'Email verified successfully (offline mode)'
    };
  }

  // Get validation state from level
  getValidationState(level) {
    const stateMap = {
      [ValidationLevels.LEVEL_0]: UserValidationStates.UNVERIFIED,
      [ValidationLevels.LEVEL_1]: UserValidationStates.EMAIL_VERIFIED,
      [ValidationLevels.LEVEL_2]: UserValidationStates.PROFILE_COMPLETE,
      [ValidationLevels.LEVEL_3]: UserValidationStates.APPROVED
    };
    return stateMap[level] || UserValidationStates.UNVERIFIED;
  }

  // Backward compatibility methods
  getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem('nebula_users') || '[]');
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem('nebula_users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  updateUser(updatedUser) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === updatedUser.id);
    
    if (userIndex === -1) {
      return false;
    }
    
    users[userIndex] = { ...updatedUser, updatedAt: new Date().toISOString() };
    return this.saveUsers(users);
  }

  addUser(userData) {
    const users = this.getAllUsers();
    const newUser = this.createUserObject(userData);
    
    // Check if user already exists
    if (users.find(user => user.email === newUser.email)) {
      return { success: false, reason: 'user_exists', message: 'User with this email already exists.' };
    }
    
    users.push(newUser);
    const saved = this.saveUsers(users);
    
    return saved 
      ? { success: true, user: newUser }
      : { success: false, reason: 'save_failed', message: 'Failed to save user data.' };
  }

  // Existing validation methods
  canUserLogin(user) {
    if (!user.isEmailVerified) {
      return { allowed: false, reason: 'email_not_verified', message: 'Please verify your email before logging in.' };
    }
    
    if (user.accountLocked) {
      const lockExpiry = new Date(user.accountLockExpiry);
      if (lockExpiry > new Date()) {
        return { 
          allowed: false, 
          reason: 'account_locked', 
          message: `Account is temporarily locked. Try again after ${lockExpiry.toLocaleTimeString()}.`
        };
      }
    }
    
    if (user.validationState === UserValidationStates.SUSPENDED) {
      return { allowed: false, reason: 'account_suspended', message: 'Your account has been suspended. Contact support.' };
    }
    
    if (user.validationState === UserValidationStates.REJECTED) {
      return { allowed: false, reason: 'account_rejected', message: 'Your account application was not approved.' };
    }
    
    return { allowed: true };
  }

  markEmailVerified(user) {
    const updatedUser = {
      ...user,
      isEmailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      emailVerificationToken: null,
      emailVerificationExpiry: null,
      validationLevel: Math.max(user.validationLevel, ValidationLevels.LEVEL_1),
      validationState: UserValidationStates.EMAIL_VERIFIED,
      validationHistory: [
        ...user.validationHistory,
        {
          action: 'email_verified',
          timestamp: new Date().toISOString(),
          level: ValidationLevels.LEVEL_1
        }
      ]
    };
    
    return updatedUser;
  }

  // Utility methods for offline mode
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateVerificationToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  storeVerificationCode(email, code) {
    const codes = JSON.parse(localStorage.getItem('verification_codes') || '{}');
    codes[email] = {
      code,
      expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
    };
    localStorage.setItem('verification_codes', JSON.stringify(codes));
  }

  getStoredVerificationCode(email) {
    const codes = JSON.parse(localStorage.getItem('verification_codes') || '{}');
    return codes[email] || null;
  }

  removeVerificationCode(email) {
    const codes = JSON.parse(localStorage.getItem('verification_codes') || '{}');
    delete codes[email];
    localStorage.setItem('verification_codes', JSON.stringify(codes));
  }

  // Logout
  async logout() {
    try {
      if (this.isOnline) {
        await authAPI.logout();
      }
    } catch (error) {
      console.warn('Backend logout failed:', error.message);
    } finally {
      this.currentUser = null;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Backward compatibility functions
export const createUser = (userData) => {
  const userManager = new UserManager();
  return userManager.createUserObject(userData);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score,
    checks,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
    valid: score >= 3
  };
};

export const canUserLogin = (user) => {
  const userManager = new UserManager();
  return userManager.canUserLogin(user);
};

export const markEmailVerified = (user) => {
  const userManager = new UserManager();
  return userManager.markEmailVerified(user);
};

// Export original UserManager for backward compatibility
export { UserManager as UserManagerClass };

// Create singleton instance
const userManager = new UserManager();
export default userManager;

// Export individual components for backward compatibility
export {
  UserValidationStates,
  ValidationLevels
};