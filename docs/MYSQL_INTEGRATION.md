# MySQL Database Integration Guide

## Overview

This portfolio application now supports MySQL database backend for user authentication and management, with automatic fallback to localStorage for offline development.

## Features

### 🔐 Authentication System
- User registration with password strength validation
- Secure login with JWT tokens
- Email verification with 6-digit codes
- Account lockout after failed attempts
- Progressive validation levels (0-3)

### 🗄️ Database Schema
- **users**: Core user information and security
- **user_sessions**: JWT session management
- **email_verification_codes**: Email verification workflow
- **user_activity_log**: Audit trail and analytics

### 🌐 Dual Mode Operation
- **Online Mode**: Full MySQL backend with API server
- **Offline Mode**: localStorage fallback for development

## Quick Setup

### 1. Install Dependencies

```bash
# Navigate to API server directory
cd api-server

# Install backend dependencies
npm install

# Install additional MySQL dependencies if needed
npm install mysql2@latest bcryptjs@latest jsonwebtoken@latest
```

### 2. Database Setup

Create a MySQL database and user:

```sql
CREATE DATABASE portfolio_db;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=portfolio_user
DB_PASSWORD=your_secure_password
DB_NAME=portfolio_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# API Configuration
PORT=3001
NODE_ENV=development
```

### 4. Initialize Database

Run the database setup script:

```bash
npm run setup-db
```

This will:
- Test database connection
- Create all necessary tables
- Set up indexes and relationships

### 5. Start the API Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 6. Update Frontend Configuration

Add API URL to your React app's `.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/verify-email` | Email verification |
| POST | `/api/auth/send-verification` | Resend verification code |
| GET | `/api/auth/profile` | Get user profile |
| POST | `/api/auth/logout` | User logout |

### File Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/save-resume` | Upload resume files |
| POST | `/api/ensure-assets-dir` | Ensure assets directory |
| GET | `/api/health` | Health check |

## Database Schema

### Users Table
```sql
users (
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
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### Validation Levels
- **Level 0**: Unverified (basic signup)
- **Level 1**: Email verified (basic access)
- **Level 2**: Trusted user (full access)
- **Level 3**: Premium access (admin features)

## Usage Examples

### Frontend Integration

```javascript
import userManager from './utils/userValidationMySQL';
import authAPI from './utils/authAPI';

// User registration
try {
  const result = await userManager.createUser({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe'
  });
  
  if (result.success) {
    console.log('User created:', result.user);
    console.log('Verification code:', result.verificationCode);
  }
} catch (error) {
  console.error('Registration failed:', error.message);
}

// User login
try {
  const result = await userManager.login('john@example.com', 'SecurePass123!');
  
  if (result.success) {
    console.log('Login successful:', result.user);
    
    if (result.requiresEmailVerification) {
      // Show email verification modal
    }
  }
} catch (error) {
  console.error('Login failed:', error.message);
}

// Email verification
try {
  const result = await userManager.verifyEmail('john@example.com', '123456');
  
  if (result.success) {
    console.log('Email verified:', result.user);
  }
} catch (error) {
  console.error('Verification failed:', error.message);
}
```

### Component Integration

```jsx
import React, { useState } from 'react';
import userManager from '../utils/userValidationMySQL';

function LoginForm() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await userManager.login(credentials.username, credentials.password);
      
      if (result.success) {
        // Redirect to dashboard or show verification modal
        if (result.requiresEmailVerification) {
          // Show EmailVerification modal
        } else {
          // Redirect to dashboard
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Account Protection
- Maximum 5 login attempts before lockout
- 15-minute lockout period
- JWT tokens expire after 24 hours
- Verification codes expire after 10 minutes

### Data Protection
- Passwords hashed with bcrypt (12 rounds)
- SQL injection protection with parameterized queries
- Rate limiting on API endpoints
- CORS protection

## Development vs Production

### Development Mode
- Automatic fallback to localStorage if database unavailable
- Detailed error messages
- CORS allows localhost origins
- Verification codes shown in response (for testing)

### Production Mode
- Requires working database connection
- Generic error messages
- Restricted CORS origins
- Verification codes sent via email only

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection
mysql -u portfolio_user -p portfolio_db
```

**Port Already in Use**
```bash
# Kill process using port 3001
npx kill-port 3001

# Or change port in .env
PORT=3002
```

**CORS Issues**
- Ensure frontend URL is in CORS configuration
- Check that API_URL environment variable is set correctly

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
DEBUG=true
```

### Database Reset

To reset all data:

```bash
npm run reset-db
```

## Migration from localStorage

If you have existing users in localStorage, create a migration script:

```javascript
// migration-script.js
const userManager = require('./src/utils/userValidationMySQL');

async function migrateUsers() {
  const localUsers = JSON.parse(localStorage.getItem('nebula_users') || '[]');
  
  for (const user of localUsers) {
    try {
      await userManager.createUser({
        username: user.username,
        email: user.email,
        password: user.passwordHash, // Note: will be re-hashed
        firstName: user.firstName,
        lastName: user.lastName
      });
      console.log(`Migrated user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to migrate ${user.email}:`, error.message);
    }
  }
}
```

## Monitoring and Analytics

The system logs all user activities:
- Account creation
- Login/logout events
- Email verification
- Failed login attempts

Query activity logs:

```sql
SELECT 
  u.username,
  u.email,
  al.activity_type,
  al.created_at
FROM user_activity_log al
JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 100;
```

## Next Steps

1. **Email Integration**: Configure EmailJS for production email sending
2. **Admin Dashboard**: Build admin interface for user management
3. **Analytics**: Add user behavior tracking
4. **Backup**: Set up automated database backups
5. **Scaling**: Consider connection pooling and read replicas