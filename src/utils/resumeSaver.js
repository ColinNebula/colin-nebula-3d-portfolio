// Utility function to save resume PDF to assets directory
export const saveResumeToAssets = async (pdfBlob, fileName) => {
  try {
    // Method 1: Use File System Access API to save to specific location
    if ('showDirectoryPicker' in window) {
      // Ask user to select the project's assets/documents directory
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents'
      });
      
      // Try to navigate to assets/documents if it exists
      let assetsDir;
      try {
        assetsDir = await dirHandle.getDirectoryHandle('assets', { create: true });
        const documentsDir = await assetsDir.getDirectoryHandle('documents', { create: true });
        
        // Create the file in the documents directory
        const fileHandle = await documentsDir.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
        
        return {
          success: true,
          message: `Resume saved to assets/documents/${fileName}`,
          path: `assets/documents/${fileName}`
        };
      } catch (dirError) {
        // If we can't find/create the assets structure, just save to selected directory
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
        
        return {
          success: true,
          message: `Resume saved to selected directory as ${fileName}`,
          path: fileName
        };
      }
    }
    
    // Method 2: Fallback - Save to specific location using showSaveFilePicker
    if ('showSaveFilePicker' in window) {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'PDF files',
          accept: {'application/pdf': ['.pdf']},
        }],
        startIn: 'documents'
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(pdfBlob);
      await writable.close();
      
      return {
        success: true,
        message: `Resume saved as ${fileName}`,
        path: fileName
      };
    }
    
    // Method 3: If File System Access API is not supported, try to save using Node.js fs (if in development)
    if (process.env.NODE_ENV === 'development') {
      try {
        // Convert blob to buffer
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Use fetch to send to our backend API
        const formData = new FormData();
        formData.append('file', pdfBlob, fileName);
        formData.append('destination', 'src/assets/documents');
        
        const response = await fetch('/api/save-resume', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          return {
            success: true,
            message: result.message,
            path: result.path
          };
        } else {
          throw new Error('API call failed');
        }
      } catch (apiError) {
        console.warn('Could not save via API:', apiError);
        // Fall through to default download
      }
    }
    
    // Method 4: Fallback - Create download link (default browser behavior)
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: `Resume downloaded as ${fileName}`,
      path: fileName,
      note: 'Saved to default downloads folder'
    };
    
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Save operation was cancelled',
        cancelled: true
      };
    }
    
    throw error;
  }
};

// Helper function to create assets directory structure in development
export const ensureAssetsDirectory = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const response = await fetch('/api/ensure-assets-dir', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Assets directory ensured:', result.path);
        return result;
      }
    } catch (error) {
      console.warn('Could not ensure assets directory:', error);
    }
  }
  return null;
};