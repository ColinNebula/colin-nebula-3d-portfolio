// User validation and management utilities

export const UserValidationStates = {
  UNVERIFIED: 'unverified',
  EMAIL_VERIFIED: 'email_verified',
  PHONE_VERIFIED: 'phone_verified', 
  PROFILE_COMPLETE: 'profile_complete',
  APPROVED: 'approved',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected'
};

export const ValidationLevels = {
  LEVEL_0: 0, // Unverified - cannot login
  LEVEL_1: 1, // Email verified - basic access
  LEVEL_2: 2, // Profile complete - full user access
  LEVEL_3: 3, // Admin approved - premium access
};

// Enhanced user model
export const createUser = (userData) => {
  const now = new Date().toISOString();
  
  return {
    // Basic info
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username: userData.email,
    email: userData.email.toLowerCase().trim(),
    firstName: userData.firstName?.trim() || '',
    lastName: userData.lastName?.trim() || '',
    name: `${userData.firstName?.trim() || ''} ${userData.lastName?.trim() || ''}`.trim(),
    
    // Validation status
    isEmailVerified: false,
    isPhoneVerified: false,
    isProfileComplete: false,
    isApproved: false,
    validationLevel: ValidationLevels.LEVEL_0,
    validationState: UserValidationStates.UNVERIFIED,
    
    // Verification tokens
    emailVerificationToken: generateVerificationToken(),
    emailVerificationExpiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
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
    signupIP: 'localhost', // In real app, get actual IP
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
};

// Generate verification token
export const generateVerificationToken = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone format (basic)
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Check password strength
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

// Update user validation level
export const updateUserValidationLevel = (user) => {
  let newLevel = ValidationLevels.LEVEL_0;
  let newState = UserValidationStates.UNVERIFIED;
  
  if (user.isEmailVerified) {
    newLevel = ValidationLevels.LEVEL_1;
    newState = UserValidationStates.EMAIL_VERIFIED;
  }
  
  if (user.isEmailVerified && user.isProfileComplete) {
    newLevel = ValidationLevels.LEVEL_2;
    newState = UserValidationStates.PROFILE_COMPLETE;
  }
  
  if (user.isEmailVerified && user.isProfileComplete && user.isApproved) {
    newLevel = ValidationLevels.LEVEL_3;
    newState = UserValidationStates.APPROVED;
  }
  
  return {
    ...user,
    validationLevel: newLevel,
    validationState: newState,
    updatedAt: new Date().toISOString()
  };
};

// Check if user can login
export const canUserLogin = (user) => {
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
};

// Verify email token
export const verifyEmailToken = (user, token) => {
  const now = new Date();
  const expiry = new Date(user.emailVerificationExpiry);
  
  if (expiry < now) {
    return { success: false, reason: 'token_expired', message: 'Verification token has expired.' };
  }
  
  if (user.emailVerificationToken !== token) {
    return { success: false, reason: 'invalid_token', message: 'Invalid verification token.' };
  }
  
  return { success: true };
};

// Mark email as verified
export const markEmailVerified = (user) => {
  const updatedUser = {
    ...user,
    isEmailVerified: true,
    emailVerifiedAt: new Date().toISOString(),
    emailVerificationToken: null,
    emailVerificationExpiry: null,
    validationHistory: [
      ...user.validationHistory,
      {
        action: 'email_verified',
        timestamp: new Date().toISOString(),
        level: ValidationLevels.LEVEL_1
      }
    ]
  };
  
  return updateUserValidationLevel(updatedUser);
};

// Check if profile is complete
export const checkProfileComplete = (user) => {
  const requiredFields = [
    user.firstName?.trim(),
    user.lastName?.trim(),
    user.email?.trim()
  ];
  
  const isComplete = requiredFields.every(field => field && field.length > 0);
  
  return {
    isComplete,
    missingFields: requiredFields.map((field, index) => {
      const fieldNames = ['firstName', 'lastName', 'email'];
      return !field ? fieldNames[index] : null;
    }).filter(Boolean)
  };
};

// Mark profile as complete
export const markProfileComplete = (user) => {
  const { isComplete } = checkProfileComplete(user);
  
  if (!isComplete) {
    return user;
  }
  
  const updatedUser = {
    ...user,
    isProfileComplete: true,
    profileCompletedAt: new Date().toISOString(),
    validationHistory: [
      ...user.validationHistory,
      {
        action: 'profile_completed',
        timestamp: new Date().toISOString(),
        level: ValidationLevels.LEVEL_2
      }
    ]
  };
  
  return updateUserValidationLevel(updatedUser);
};

// User management functions
export const UserManager = {
  // Get all users from localStorage
  getAllUsers: () => {
    try {
      return JSON.parse(localStorage.getItem('nebula_users') || '[]');
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  },
  
  // Save users to localStorage
  saveUsers: (users) => {
    try {
      localStorage.setItem('nebula_users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  },
  
  // Get user by email
  getUserByEmail: (email) => {
    const users = UserManager.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },
  
  // Update user
  updateUser: (updatedUser) => {
    const users = UserManager.getAllUsers();
    const userIndex = users.findIndex(user => user.id === updatedUser.id);
    
    if (userIndex === -1) {
      return false;
    }
    
    users[userIndex] = { ...updatedUser, updatedAt: new Date().toISOString() };
    return UserManager.saveUsers(users);
  },
  
  // Add new user
  addUser: (userData) => {
    const users = UserManager.getAllUsers();
    const newUser = createUser(userData);
    
    // Check if user already exists
    if (users.find(user => user.email === newUser.email)) {
      return { success: false, reason: 'user_exists', message: 'User with this email already exists.' };
    }
    
    users.push(newUser);
    const saved = UserManager.saveUsers(users);
    
    return saved 
      ? { success: true, user: newUser }
      : { success: false, reason: 'save_failed', message: 'Failed to save user data.' };
  }
};

export default {
  UserValidationStates,
  ValidationLevels,
  createUser,
  validateEmail,
  validatePhone,
  checkPasswordStrength,
  updateUserValidationLevel,
  canUserLogin,
  verifyEmailToken,
  markEmailVerified,
  checkProfileComplete,
  markProfileComplete,
  UserManager
};