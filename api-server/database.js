// Database configuration for MySQL
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize database tables
async function initializeTables() {
  try {
    // Create users table with validation levels
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        validation_level INT DEFAULT 0,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        verification_token_expires DATETIME,
        last_login DATETIME,
        login_attempts INT DEFAULT 0,
        locked_until DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_verification_token (verification_token)
      )
    `);

    // Create user_sessions table for session management
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_session_token (session_token),
        INDEX idx_user_id (user_id)
      )
    `);

    // Create email_verification_codes table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS email_verification_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        attempts INT DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_code (code)
      )
    `);

    // Create user_activity_log table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        activity_type ENUM('login', 'logout', 'signup', 'email_verify', 'password_change', 'profile_update') NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        details JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_activity_type (activity_type),
        INDEX idx_created_at (created_at)
      )
    `);

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error.message);
    return false;
  }
}

// User-related database operations
const UserDB = {
  // Create new user
  async create(userData) {
    try {
      const { username, email, passwordHash, validationLevel = 0 } = userData;
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password_hash, validation_level) VALUES (?, ?, ?, ?)',
        [username, email, passwordHash, validationLevel]
      );
      return { id: result.insertId, ...userData };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // Find user by email
  async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  },

  // Find user by username
  async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by username: ${error.message}`);
    }
  },

  // Find user by ID
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  },

  // Update user validation level
  async updateValidationLevel(userId, level) {
    try {
      await pool.execute(
        'UPDATE users SET validation_level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [level, userId]
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to update validation level: ${error.message}`);
    }
  },

  // Mark email as verified
  async markEmailVerified(userId) {
    try {
      await pool.execute(
        'UPDATE users SET email_verified = TRUE, validation_level = GREATEST(validation_level, 1), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to mark email verified: ${error.message}`);
    }
  },

  // Update last login
  async updateLastLogin(userId) {
    try {
      await pool.execute(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP, login_attempts = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  },

  // Increment login attempts
  async incrementLoginAttempts(userId) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET login_attempts = login_attempts + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
      
      // Get updated attempts count
      const user = await this.findById(userId);
      
      // Lock account if too many attempts
      if (user && user.login_attempts >= 5) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await pool.execute(
          'UPDATE users SET locked_until = ? WHERE id = ?',
          [lockUntil, userId]
        );
      }
      
      return user ? user.login_attempts : 0;
    } catch (error) {
      throw new Error(`Failed to increment login attempts: ${error.message}`);
    }
  },

  // Check if account is locked
  async isAccountLocked(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT locked_until FROM users WHERE id = ?',
        [userId]
      );
      
      if (!rows[0] || !rows[0].locked_until) return false;
      
      const now = new Date();
      const lockUntil = new Date(rows[0].locked_until);
      
      if (now < lockUntil) {
        return true;
      } else {
        // Unlock account
        await pool.execute(
          'UPDATE users SET locked_until = NULL, login_attempts = 0 WHERE id = ?',
          [userId]
        );
        return false;
      }
    } catch (error) {
      throw new Error(`Failed to check account lock status: ${error.message}`);
    }
  }
};

// Email verification code operations
const VerificationDB = {
  // Create verification code
  async create(userId, code, expiresInMinutes = 10) {
    try {
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
      
      // Delete any existing codes for this user
      await pool.execute(
        'DELETE FROM email_verification_codes WHERE user_id = ?',
        [userId]
      );
      
      // Create new code
      const [result] = await pool.execute(
        'INSERT INTO email_verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)',
        [userId, code, expiresAt]
      );
      
      return { id: result.insertId, userId, code, expiresAt };
    } catch (error) {
      throw new Error(`Failed to create verification code: ${error.message}`);
    }
  },

  // Verify code
  async verify(userId, code) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM email_verification_codes WHERE user_id = ? AND code = ? AND verified = FALSE',
        [userId, code]
      );
      
      if (!rows[0]) return { success: false, error: 'Invalid verification code' };
      
      const verificationRecord = rows[0];
      const now = new Date();
      
      // Check if expired
      if (now > new Date(verificationRecord.expires_at)) {
        return { success: false, error: 'Verification code has expired' };
      }
      
      // Check attempts
      if (verificationRecord.attempts >= 3) {
        return { success: false, error: 'Too many verification attempts' };
      }
      
      // Mark as verified
      await pool.execute(
        'UPDATE email_verification_codes SET verified = TRUE, attempts = attempts + 1 WHERE id = ?',
        [verificationRecord.id]
      );
      
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to verify code: ${error.message}`);
    }
  },

  // Increment attempts
  async incrementAttempts(userId, code) {
    try {
      await pool.execute(
        'UPDATE email_verification_codes SET attempts = attempts + 1 WHERE user_id = ? AND code = ?',
        [userId, code]
      );
    } catch (error) {
      throw new Error(`Failed to increment attempts: ${error.message}`);
    }
  }
};

// Activity logging
const ActivityDB = {
  async log(userId, activityType, details = {}) {
    try {
      await pool.execute(
        'INSERT INTO user_activity_log (user_id, activity_type, details) VALUES (?, ?, ?)',
        [userId, activityType, JSON.stringify(details)]
      );
    } catch (error) {
      console.error('Failed to log activity:', error.message);
    }
  }
};

module.exports = {
  pool,
  testConnection,
  initializeTables,
  UserDB,
  VerificationDB,
  ActivityDB
};