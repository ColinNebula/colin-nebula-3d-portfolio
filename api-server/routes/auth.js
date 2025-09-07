// Authentication routes for user management
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { UserDB, VerificationDB, ActivityDB } = require('../database');
const crypto = require('crypto');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username or email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Generate verification code
function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      email: user.email,
      validationLevel: user.validation_level 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
}

// Password strength checker
function checkPasswordStrength(password) {
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
}

// POST /api/auth/signup - User registration
router.post('/signup', signupValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check password strength
    const passwordCheck = checkPasswordStrength(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet requirements',
        passwordFeedback: passwordCheck.feedback
      });
    }

    // Check if user already exists
    const existingUser = await UserDB.findByEmail(email) || await UserDB.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with validation level 0 (unverified)
    const newUser = await UserDB.create({
      username,
      email,
      passwordHash,
      validationLevel: 0
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    await VerificationDB.create(newUser.id, verificationCode);

    // Log activity
    await ActivityDB.log(newUser.id, 'signup', { username, email });

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please verify your email.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        validationLevel: newUser.validationLevel,
        emailVerified: false
      },
      token,
      verificationCode, // In production, this would be sent via email
      requiresEmailVerification: true
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during signup'
    });
  }
});

// POST /api/auth/login - User authentication
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find user by username or email
    let user = await UserDB.findByUsername(username);
    if (!user) {
      user = await UserDB.findByEmail(username);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is locked
    const isLocked = await UserDB.isAccountLocked(user.id);
    if (isLocked) {
      return res.status(423).json({
        success: false,
        error: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await UserDB.incrementLoginAttempts(user.id);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await UserDB.updateLastLogin(user.id);

    // Log activity
    await ActivityDB.log(user.id, 'login', { username });

    // Generate token
    const token = generateToken(user);

    // Check validation level for access control
    const accessLevel = {
      0: 'basic', // Unverified email
      1: 'verified', // Email verified
      2: 'trusted', // Additional verification
      3: 'premium' // Full access
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        validationLevel: user.validation_level,
        emailVerified: user.email_verified,
        accessLevel: accessLevel[user.validation_level] || 'basic',
        lastLogin: user.last_login
      },
      token,
      requiresEmailVerification: !user.email_verified
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
});

// POST /api/auth/send-verification - Send verification code
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = await UserDB.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    await VerificationDB.create(user.id, verificationCode);

    res.json({
      success: true,
      message: 'Verification code sent',
      verificationCode, // In production, this would be sent via email
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send verification code'
    });
  }
});

// POST /api/auth/verify-email - Verify email with code
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email and verification code are required'
      });
    }

    const user = await UserDB.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Verify the code
    const verificationResult = await VerificationDB.verify(user.id, code);
    
    if (!verificationResult.success) {
      // Increment attempts for invalid codes
      if (verificationResult.error !== 'Too many verification attempts') {
        await VerificationDB.incrementAttempts(user.id, code);
      }
      
      return res.status(400).json({
        success: false,
        error: verificationResult.error
      });
    }

    // Mark email as verified and upgrade validation level
    await UserDB.markEmailVerified(user.id);

    // Log activity
    await ActivityDB.log(user.id, 'email_verify', { email });

    // Get updated user data
    const updatedUser = await UserDB.findById(user.id);

    // Generate new token with updated validation level
    const token = generateToken(updatedUser);

    res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        validationLevel: updatedUser.validation_level,
        emailVerified: updatedUser.email_verified
      },
      token
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify email'
    });
  }
});

// GET /api/auth/profile - Get user profile (requires authentication)
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await UserDB.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        validationLevel: user.validation_level,
        emailVerified: user.email_verified,
        lastLogin: user.last_login,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        await ActivityDB.log(decoded.userId, 'logout');
      } catch (error) {
        // Token might be invalid, but we can still log the logout attempt
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

module.exports = router;