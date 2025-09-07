// Database setup script
require('dotenv').config();
const { testConnection, initializeTables } = require('../database');

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }
    
    // Initialize tables
    console.log('📊 Initializing database tables...');
    const tablesCreated = await initializeTables();
    
    if (!tablesCreated) {
      console.error('❌ Failed to create database tables.');
      process.exit(1);
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('\n📋 Database configuration:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 3306}`);
    console.log(`   Database: ${process.env.DB_NAME || 'portfolio_db'}`);
    console.log(`   User: ${process.env.DB_USER || 'root'}`);
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Update your .env file with correct database credentials');
    console.log('   2. Run: npm run dev (to start development server)');
    console.log('   3. Run: npm start (to start production server)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;