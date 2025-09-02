const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

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
router.post('/api/save-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { destination } = req.body;
    const fileName = req.file.originalname;
    
    // Validate destination path
    const allowedDestinations = ['assets/documents', 'src/assets/documents'];
    if (!allowedDestinations.includes(destination)) {
      return res.status(400).json({ error: 'Invalid destination path' });
    }

    // Ensure the destination directory exists
    const fullDestinationPath = path.join(process.cwd(), destination);
    await fs.mkdir(fullDestinationPath, { recursive: true });

    // Create the full file path
    const filePath = path.join(fullDestinationPath, fileName);

    // Write the file
    await fs.writeFile(filePath, req.file.buffer);

    // Return success response
    res.json({
      success: true,
      message: 'Resume saved successfully',
      path: path.join(destination, fileName),
      fileName: fileName,
      size: req.file.size
    });

  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ 
      error: 'Failed to save resume',
      details: error.message 
    });
  }
});

module.exports = router;