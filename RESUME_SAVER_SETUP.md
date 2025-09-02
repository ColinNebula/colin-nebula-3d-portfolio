# Resume PDF Saver Setup

This setup allows the "Save as PDF" button in the Resume component to save PDF files directly to the project's `assets/documents` directory instead of just downloading them to the user's default downloads folder.

## Setup Instructions

### Option 1: Automatic Setup (Recommended)
```bash
# Install API server dependencies
npm run setup-api

# Start both React app and API server
npm run dev-with-api
```

### Option 2: Manual Setup
```bash
# Install main project dependencies
npm install

# Install API server dependencies
cd api-server
npm install
cd ..

# Start API server (in one terminal)
npm run api-start

# Start React app (in another terminal)
npm start
```

## How It Works

### Client-Side (Browser)
1. **Modern Browsers**: Uses File System Access API to let users select the assets directory
2. **Fallback**: Sends PDF to API server to save in assets directory
3. **Ultimate Fallback**: Regular download to user's downloads folder

### Server-Side (Development)
- Express.js API server running on port 3001
- Accepts PDF uploads via `/api/save-resume` endpoint
- Saves files to `src/assets/documents/` directory

## File Structure
```
colin-nebula-3d-portfolio/
├── src/
│   ├── assets/
│   │   └── documents/          # Generated PDFs saved here
│   ├── components/
│   │   └── Resume/
│   │       └── index.js        # Main Resume component
│   └── utils/
│       └── resumeSaver.js      # Resume saving utility
├── api-server/
│   ├── package.json
│   └── server.js              # Express API server
└── package.json
```

## Features

### PDF Generation
- High-quality PDF generation using html2canvas + jsPDF
- Automatic multi-page handling
- Optimized for print with proper formatting
- Removes interactive elements from PDF output

### Saving Options
1. **Browser File System Access**: Prompts user to select save location
2. **API Server Save**: Automatically saves to assets directory
3. **Standard Download**: Falls back to browser download

### File Naming
- Automatic timestamping: `Colin_Nebula_Resume_2025-09-01.pdf`
- Unique filenames prevent overwrites
- Professional naming convention

## Usage

1. Navigate to the Resume page
2. Click "Save as PDF" button
3. Choose save method:
   - **File System Access**: Select your project's assets directory
   - **Automatic**: PDF saves to `src/assets/documents/`
   - **Download**: Standard browser download

## API Endpoints

### POST `/api/save-resume`
Saves uploaded PDF file to assets directory
- **Body**: FormData with file and destination
- **Response**: Success message with file path

### POST `/api/ensure-assets-dir`
Creates assets directory structure if it doesn't exist
- **Response**: Directory status and path

### GET `/api/health`
Health check endpoint
- **Response**: API server status

## Development Notes

- API server runs on port 3001 (React on 3000)
- CORS enabled for local development
- File size limit: 10MB
- Only PDF files accepted
- Automatic directory creation

## Browser Compatibility

- **File System Access API**: Chrome 86+, Edge 86+
- **Fallback Methods**: All modern browsers
- **API Method**: All browsers with JavaScript enabled

## Troubleshooting

### Common Issues
1. **API server not running**: Use `npm run dev-with-api`
2. **Permission denied**: Check file system permissions
3. **CORS errors**: Ensure API server is on port 3001

### Error Messages
- **"Could not save to assets directory"**: API server issue or permissions
- **"Save operation was cancelled"**: User cancelled file picker
- **"Only PDF files are allowed"**: File validation error

## Security Notes

- API only accepts PDF files
- Path validation prevents directory traversal
- File size limits prevent abuse
- CORS configured for development only