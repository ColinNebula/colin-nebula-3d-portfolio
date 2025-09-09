import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';

const ThemeCustomization = () => {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColor: '#f093fb',
    backgroundColor: '#0f0f23',
    textColor: '#ffffff',
    cardBackground: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif'
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [savedThemes, setSavedThemes] = useState([]);

  useEffect(() => {
    loadThemeSettings();
    loadSavedThemes();
  }, []);

  const loadThemeSettings = () => {
    const stored = JSON.parse(localStorage.getItem('admin_theme_settings') || '{}');
    if (Object.keys(stored).length > 0) {
      setThemeSettings(stored);
    }
  };

  const loadSavedThemes = () => {
    const themes = JSON.parse(localStorage.getItem('admin_saved_themes') || '[]');
    if (themes.length === 0) {
      const defaultThemes = [
        {
          name: 'Default Portfolio',
          settings: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            accentColor: '#f093fb',
            backgroundColor: '#0f0f23',
            textColor: '#ffffff',
            cardBackground: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif'
          }
        },
        {
          name: 'Ocean Blue',
          settings: {
            primaryColor: '#2196F3',
            secondaryColor: '#03A9F4',
            accentColor: '#00BCD4',
            backgroundColor: '#0a1929',
            textColor: '#ffffff',
            cardBackground: 'rgba(33, 150, 243, 0.1)',
            borderRadius: '12px',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif'
          }
        },
        {
          name: 'Sunset Orange',
          settings: {
            primaryColor: '#FF9800',
            secondaryColor: '#FF5722',
            accentColor: '#FFC107',
            backgroundColor: '#1a0e0a',
            textColor: '#ffffff',
            cardBackground: 'rgba(255, 152, 0, 0.1)',
            borderRadius: '20px',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif'
          }
        },
        {
          name: 'Forest Green',
          settings: {
            primaryColor: '#4CAF50',
            secondaryColor: '#388E3C',
            accentColor: '#8BC34A',
            backgroundColor: '#0d1b0f',
            textColor: '#ffffff',
            cardBackground: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '10px',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif'
          }
        }
      ];
      localStorage.setItem('admin_saved_themes', JSON.stringify(defaultThemes));
      setSavedThemes(defaultThemes);
    } else {
      setSavedThemes(themes);
    }
  };

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...themeSettings, [setting]: value };
    setThemeSettings(newSettings);
    
    if (previewMode) {
      applyThemeToDocument(newSettings);
    }
  };

  const applyThemeToDocument = (settings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.primaryColor);
    root.style.setProperty('--secondary-color', settings.secondaryColor);
    root.style.setProperty('--accent-color', settings.accentColor);
    root.style.setProperty('--background-color', settings.backgroundColor);
    root.style.setProperty('--text-color', settings.textColor);
    root.style.setProperty('--card-background', settings.cardBackground);
    root.style.setProperty('--border-radius', settings.borderRadius);
    root.style.setProperty('--font-size', settings.fontSize);
    root.style.setProperty('--font-family', settings.fontFamily);
  };

  const togglePreview = () => {
    if (previewMode) {
      // Reset to original theme
      resetTheme();
    } else {
      // Apply current settings
      applyThemeToDocument(themeSettings);
    }
    setPreviewMode(!previewMode);
  };

  const resetTheme = () => {
    const root = document.documentElement;
    root.style.removeProperty('--primary-color');
    root.style.removeProperty('--secondary-color');
    root.style.removeProperty('--accent-color');
    root.style.removeProperty('--background-color');
    root.style.removeProperty('--text-color');
    root.style.removeProperty('--card-background');
    root.style.removeProperty('--border-radius');
    root.style.removeProperty('--font-size');
    root.style.removeProperty('--font-family');
  };

  const saveCurrentTheme = () => {
    const name = prompt('Enter a name for this theme:');
    if (name) {
      const newTheme = {
        name,
        settings: { ...themeSettings },
        createdAt: new Date().toISOString()
      };
      const updatedThemes = [...savedThemes, newTheme];
      setSavedThemes(updatedThemes);
      localStorage.setItem('admin_saved_themes', JSON.stringify(updatedThemes));
      alert('Theme saved successfully!');
    }
  };

  const loadTheme = (theme) => {
    setThemeSettings(theme.settings);
    if (previewMode) {
      applyThemeToDocument(theme.settings);
    }
  };

  const deleteTheme = (index) => {
    if (window.confirm('Are you sure you want to delete this theme?')) {
      const updatedThemes = savedThemes.filter((_, i) => i !== index);
      setSavedThemes(updatedThemes);
      localStorage.setItem('admin_saved_themes', JSON.stringify(updatedThemes));
    }
  };

  const saveToStorage = () => {
    localStorage.setItem('admin_theme_settings', JSON.stringify(themeSettings));
    alert('Theme settings saved! Changes will be applied on next reload.');
  };

  const resetToDefault = () => {
    if (window.confirm('Reset to default theme? This will overwrite current settings.')) {
      const defaultSettings = {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#f093fb',
        backgroundColor: '#0f0f23',
        textColor: '#ffffff',
        cardBackground: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif'
      };
      setThemeSettings(defaultSettings);
      if (previewMode) {
        applyThemeToDocument(defaultSettings);
      }
    }
  };

  return (
    <div className="admin-content-area">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🎨 Theme Customization</h3>
        <div className="d-flex gap-2">
          <Button 
            variant={previewMode ? "warning" : "outline-light"} 
            onClick={togglePreview}
            className="admin-btn"
          >
            {previewMode ? "🔴 Stop Preview" : "👁️ Live Preview"}
          </Button>
          <Button variant="success" onClick={saveToStorage} className="admin-btn">
            💾 Save Theme
          </Button>
        </div>
      </div>

      {previewMode && (
        <Alert variant="warning" className="mb-4">
          <strong>🔴 Live Preview Mode:</strong> Changes are being applied in real-time. 
          Click "Stop Preview" to return to normal view.
        </Alert>
      )}

      <Row>
        {/* Color Settings */}
        <Col md={6}>
          <Card className="theme-settings-card mb-4">
            <Card.Header>
              <h5>🎨 Color Scheme</h5>
            </Card.Header>
            <Card.Body>
              <Form className="admin-form">
                <Form.Group className="mb-3">
                  <Form.Label>Primary Color</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      style={{ width: '50px', height: '40px' }}
                    />
                    <Form.Control
                      type="text"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      placeholder="#667eea"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Secondary Color</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control
                      type="color"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      style={{ width: '50px', height: '40px' }}
                    />
                    <Form.Control
                      type="text"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      placeholder="#764ba2"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Accent Color</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control
                      type="color"
                      value={themeSettings.accentColor}
                      onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                      style={{ width: '50px', height: '40px' }}
                    />
                    <Form.Control
                      type="text"
                      value={themeSettings.accentColor}
                      onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                      placeholder="#f093fb"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Background Color</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control
                      type="color"
                      value={themeSettings.backgroundColor}
                      onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                      style={{ width: '50px', height: '40px' }}
                    />
                    <Form.Control
                      type="text"
                      value={themeSettings.backgroundColor}
                      onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                      placeholder="#0f0f23"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Text Color</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control
                      type="color"
                      value={themeSettings.textColor}
                      onChange={(e) => handleSettingChange('textColor', e.target.value)}
                      style={{ width: '50px', height: '40px' }}
                    />
                    <Form.Control
                      type="text"
                      value={themeSettings.textColor}
                      onChange={(e) => handleSettingChange('textColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Layout Settings */}
        <Col md={6}>
          <Card className="theme-settings-card mb-4">
            <Card.Header>
              <h5>📐 Layout & Typography</h5>
            </Card.Header>
            <Card.Body>
              <Form className="admin-form">
                <Form.Group className="mb-3">
                  <Form.Label>Border Radius</Form.Label>
                  <Form.Control
                    type="text"
                    value={themeSettings.borderRadius}
                    onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
                    placeholder="15px"
                  />
                  <Form.Text>Controls corner roundness (e.g., 10px, 15px, 20px)</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Font Size</Form.Label>
                  <Form.Control
                    type="text"
                    value={themeSettings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                  <Form.Text>Base font size (e.g., 14px, 16px, 18px)</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Font Family</Form.Label>
                  <Form.Select
                    value={themeSettings.fontFamily}
                    onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  >
                    <option value="Inter, sans-serif">Inter (Default)</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Open Sans, sans-serif">Open Sans</option>
                    <option value="Lato, sans-serif">Lato</option>
                    <option value="Montserrat, sans-serif">Montserrat</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                    <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
                    <option value="Georgia, serif">Georgia (Serif)</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Card Background</Form.Label>
                  <Form.Control
                    type="text"
                    value={themeSettings.cardBackground}
                    onChange={(e) => handleSettingChange('cardBackground', e.target.value)}
                    placeholder="rgba(255, 255, 255, 0.1)"
                  />
                  <Form.Text>Background for cards and panels</Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Saved Themes */}
        <Col md={12}>
          <Card className="theme-settings-card mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>💾 Saved Themes</h5>
              <Button variant="outline-light" onClick={saveCurrentTheme} size="sm">
                ➕ Save Current
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                {savedThemes.map((theme, index) => (
                  <Col md={3} key={index} className="mb-3">
                    <Card className="saved-theme-card">
                      <Card.Body>
                        <div className="theme-preview mb-2">
                          <div 
                            className="color-swatch"
                            style={{ 
                              background: `linear-gradient(135deg, ${theme.settings.primaryColor}, ${theme.settings.secondaryColor})`,
                              height: '40px',
                              borderRadius: '8px'
                            }}
                          ></div>
                        </div>
                        <h6>{theme.name}</h6>
                        <div className="d-flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => loadTheme(theme)}
                          >
                            📥 Load
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => deleteTheme(index)}
                            disabled={theme.name === 'Default Portfolio'}
                          >
                            🗑️
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Theme Actions */}
        <Col md={12}>
          <Card className="theme-settings-card">
            <Card.Header>
              <h5>⚙️ Theme Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Button variant="danger" onClick={resetToDefault}>
                  🔄 Reset to Default
                </Button>
                <Button variant="info" onClick={() => alert('Export feature coming soon!')}>
                  📤 Export Theme
                </Button>
                <Button variant="warning" onClick={() => alert('Import feature coming soon!')}>
                  📥 Import Theme
                </Button>
              </div>
              
              <Alert variant="info" className="mt-3">
                <strong>💡 Pro Tip:</strong> Use the Live Preview to see changes in real-time. 
                Remember to save your theme settings when you're happy with the results!
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThemeCustomization;