const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database and routes
const { testConnection, initializeTables } = require('./database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-portfolio-domain.com'] // Update with your actual domain
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Database initialization
async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    const connected = await testConnection();
    
    if (connected) {
      console.log('📊 Initializing database tables...');
      await initializeTables();
      console.log('✅ Database ready');
    } else {
      console.warn('⚠️  Database connection failed - some features may not work');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
}

// API endpoint to save resume to assets directory
app.post('/api/save-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { destination } = req.body;
    const fileName = req.file.originalname;
    
    // Validate destination path (go up one level to reach project root)
    const allowedDestinations = ['assets/documents', 'src/assets/documents'];
    if (!allowedDestinations.includes(destination)) {
      return res.status(400).json({ error: 'Invalid destination path' });
    }

    // Build path relative to project root (one level up from api-server)
    const projectRoot = path.join(__dirname, '..');
    const fullDestinationPath = path.join(projectRoot, destination);
    
    // Ensure the destination directory exists
    await fs.mkdir(fullDestinationPath, { recursive: true });

    // Create the full file path
    const filePath = path.join(fullDestinationPath, fileName);

    // Write the file
    await fs.writeFile(filePath, req.file.buffer);

    console.log(`✅ Resume saved: ${filePath}`);

    // Return success response
    res.json({
      success: true,
      message: 'Resume saved successfully to assets directory',
      path: path.join(destination, fileName),
      fileName: fileName,
      size: req.file.size,
      fullPath: filePath
    });

  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ 
      error: 'Failed to save resume',
      details: error.message 
    });
  }
});

// API endpoint to ensure assets directory exists
app.post('/api/ensure-assets-dir', async (req, res) => {
  try {
    const projectRoot = path.join(__dirname, '..');
    const assetsPath = path.join(projectRoot, 'src', 'assets', 'documents');
    
    await fs.mkdir(assetsPath, { recursive: true });
    
    res.json({
      success: true,
      message: 'Assets directory ensured',
      path: 'src/assets/documents',
      fullPath: assetsPath
    });
  } catch (error) {
    console.error('Error ensuring assets directory:', error);
    res.status(500).json({
      error: 'Failed to ensure assets directory',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio API server is running',
    timestamp: new Date().toISOString(),
    features: {
      authentication: 'enabled',
      fileUpload: 'enabled',
      database: 'mysql'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// Start server with database initialization
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio API server running on port ${PORT}`);
    console.log(`📁 Project root: ${path.join(__dirname, '..')}`);
    console.log(`💾 File uploads enabled for resumes`);
    console.log(`🔐 Authentication system enabled`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n📋 Available endpoints:`);
      console.log(`   GET  /api/health - Health check`);
      console.log(`   POST /api/save-resume - Save resume file`);
      console.log(`   POST /api/ensure-assets-dir - Ensure assets directory`);
      console.log(`   POST /api/auth/signup - User registration`);
      console.log(`   POST /api/auth/login - User login`);
      console.log(`   POST /api/auth/verify-email - Email verification`);
      console.log(`   GET  /api/auth/profile - User profile`);
      console.log(`   POST /api/auth/logout - User logout`);
    }
  });
}

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});