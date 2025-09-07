#!/usr/bin/env node

// MySQL Setup and Installation Script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 Portfolio MySQL Setup Script');
console.log('================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function executeCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function createEnvFile(dbConfig) {
  const envContent = `# Environment Configuration for Portfolio API Server

# Database Configuration
DB_HOST=${dbConfig.host}
DB_PORT=${dbConfig.port}
DB_USER=${dbConfig.user}
DB_PASSWORD=${dbConfig.password}
DB_NAME=${dbConfig.database}

# JWT Configuration
JWT_SECRET=${generateJWTSecret()}

# API Configuration
PORT=3001
NODE_ENV=development

# Email Configuration (for production EmailJS integration)
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Security Configuration
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_TIME=900000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100`;

  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('✅ Environment file created\n');
}

function generateJWTSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(64).toString('hex');
}

async function main() {
  try {
    console.log('This script will help you set up MySQL integration for your portfolio.');
    console.log('Make sure you have MySQL installed and running.\n');

    // Check if .env already exists
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await askQuestion('📄 .env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('✅ Keeping existing .env file');
      } else {
        await setupDatabase();
      }
    } else {
      await setupDatabase();
    }

    // Install dependencies
    console.log('📦 Installing dependencies...');
    const installSuccess = executeCommand('npm install', 'Installing npm packages');
    
    if (!installSuccess) {
      console.log('❌ Failed to install dependencies. Please run: npm install');
      process.exit(1);
    }

    // Setup database
    console.log('🗄️ Setting up database...');
    const setupSuccess = executeCommand('npm run setup-db', 'Database setup');
    
    if (!setupSuccess) {
      console.log('⚠️ Database setup failed. You may need to:');
      console.log('   1. Start MySQL service');
      console.log('   2. Create database and user manually');
      console.log('   3. Run: npm run setup-db');
    }

    // Test server
    console.log('🧪 Testing server startup...');
    console.log('Starting server for 5 seconds to test configuration...\n');
    
    try {
      const { spawn } = require('child_process');
      const serverProcess = spawn('node', ['server.js'], { 
        stdio: 'pipe',
        cwd: __dirname 
      });

      let output = '';
      
      serverProcess.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });

      serverProcess.stderr.on('data', (data) => {
        output += data.toString();
        process.stderr.write(data);
      });

      // Kill after 5 seconds
      setTimeout(() => {
        serverProcess.kill();
        
        if (output.includes('running on port')) {
          console.log('\n✅ Server test successful!');
          showNextSteps();
        } else {
          console.log('\n⚠️ Server test inconclusive. Check logs above.');
          showTroubleshooting();
        }
        
        rl.close();
      }, 5000);
      
    } catch (error) {
      console.error('❌ Server test failed:', error.message);
      showTroubleshooting();
      rl.close();
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

async function setupDatabase() {
  console.log('🔧 Database Configuration');
  console.log('========================\n');

  const dbConfig = {
    host: await askQuestion('Database host (localhost): ') || 'localhost',
    port: await askQuestion('Database port (3306): ') || '3306',
    user: await askQuestion('Database user (root): ') || 'root',
    password: await askQuestion('Database password: '),
    database: await askQuestion('Database name (portfolio_db): ') || 'portfolio_db'
  };

  console.log('\n📝 Creating environment configuration...');
  createEnvFile(dbConfig);
}

function showNextSteps() {
  console.log('\n🎉 Setup Complete!');
  console.log('=================\n');
  console.log('Next steps:');
  console.log('1. Start the API server:');
  console.log('   cd api-server && npm run dev\n');
  console.log('2. In your React app, add to .env:');
  console.log('   REACT_APP_API_URL=http://localhost:3001/api\n');
  console.log('3. Update your components to use the new MySQL backend');
  console.log('4. Test user registration and login\n');
  console.log('📚 Documentation: docs/MYSQL_INTEGRATION.md');
  console.log('🔍 Health check: http://localhost:3001/api/health');
}

function showTroubleshooting() {
  console.log('\n🔧 Troubleshooting');
  console.log('==================\n');
  console.log('Common issues:');
  console.log('1. MySQL not running:');
  console.log('   sudo systemctl start mysql\n');
  console.log('2. Database permissions:');
  console.log('   CREATE USER "portfolio_user"@"localhost" IDENTIFIED BY "password";');
  console.log('   GRANT ALL PRIVILEGES ON portfolio_db.* TO "portfolio_user"@"localhost";\n');
  console.log('3. Port conflicts:');
  console.log('   Change PORT in .env file\n');
  console.log('4. Manual setup:');
  console.log('   npm run setup-db');
  console.log('   npm run dev');
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main, createEnvFile, generateJWTSecret };