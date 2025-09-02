const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
    message: 'Resume saver API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Resume saver API server running on port ${PORT}`);
  console.log(`📁 Project root: ${path.join(__dirname, '..')}`);
  console.log(`💾 Ready to save resumes to assets directory`);
});

module.exports = app;