import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Tabs, Tab, Badge, ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './Account.css';

const Account = () => {
  // User profile state - with proper default structure
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: null,
    preferences: {
      darkMode: false,
      notifications: true,
      newsletter: true,
      emailFrequency: 'weekly'
    }
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    projectUpdates: true,
    newReleases: true,
    events: true,
    comments: true,
    pushNotifications: true,
    emailNotifications: true
  });
  
  // Authentication state with token validation check
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { 
      const token = localStorage.getItem('nebula_auth_token');
      // Basic validation to check if token exists and is not expired
      if (!token) return false;
      
      // Try to parse token expiry (if using JWT)
      try {
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Token expired, clean up localStorage
            localStorage.removeItem('nebula_auth_token');
            localStorage.removeItem('nebula_auth_user');
            return false;
          }
        }
      } catch (e) {
        // Invalid token format, but we'll still consider it valid
        // since we're just checking if it exists
      }
      
      return true;
    } catch (e) { 
      return false; 
    }
  });

  // Activity history
  const [activityHistory, setActivityHistory] = useState([]);
  
  // Form validation
  const [formErrors, setFormErrors] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Password visibility state
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  
  // Refs
  const saveTimeoutRef = useRef();
  const fileInputRef = useRef();
  
  // Enhanced states for new features
  const [securityScore, setSecurityScore] = useState(0);
  const [loginHistory, setLoginHistory] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    github: false,
    facebook: false,
    twitter: false
  });
  const [activeDevices, setActiveDevices] = useState([]);
  const [showSecurityTips, setShowSecurityTips] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    textSpacing: false
  });
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
  // Load user data - memoized with useCallback
  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would fetch from your API
      // const response = await fetch('/api/user/profile');
      // const userData = await response.json();
      
      // For demo, use local storage or default values
      const savedProfile = localStorage.getItem('nebula_user_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          // Validate the structure
          if (typeof parsed === 'object' && parsed !== null) {
            // Ensure preferences object exists
            if (!parsed.preferences) {
              parsed.preferences = {
                darkMode: document.body.classList.contains('theme-dark'),
                notifications: true,
                newsletter: true,
                emailFrequency: 'weekly'
              };
            }
            setProfile(parsed);
          } else {
            throw new Error('Invalid profile data');
          }
        } catch (e) {
          console.error('Error parsing profile data:', e);
          // Fall back to default values
          throw new Error('Invalid profile data');
        }
      } else {
        // Default demo values
        setProfile({
          name: 'Demo User',
          email: 'demo@example.com',
          bio: 'I am a 3D artist and enthusiast interested in digital art, modeling and animation.',
          avatar: null,
          preferences: {
            darkMode: document.body.classList.contains('theme-dark'),
            notifications: true,
            newsletter: true,
            emailFrequency: 'weekly'
          }
        });
      }
      
      // Load notification settings
      const savedSettings = localStorage.getItem('nebula_notification_settings');
      if (savedSettings) {
        try {
          setNotificationSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error('Error parsing notification settings:', e);
        }
      }
      
      // Generate mock activity history
      setActivityHistory([
        { id: 1, type: 'view', description: 'Viewed "New 3D Character Model" update', date: '2023-12-01T14:30:00Z' },
        { id: 2, type: 'bookmark', description: 'Bookmarked "VFX Breakdown" update', date: '2023-11-28T09:15:00Z' },
        { id: 3, type: 'comment', description: 'Commented on "Portfolio Website Updates"', date: '2023-11-20T16:45:00Z' },
        { id: 4, type: 'subscribe', description: 'Subscribed to newsletter', date: '2023-11-15T10:20:00Z' }
      ]);
      
      // Additional mock data for enhancements
      // Calculate security score based on profile completeness
      setTimeout(() => {
        let score = 0;
        if (profile.name) score += 10;
        if (profile.email) score += 10;
        if (profile.bio) score += 10;
        if (profile.avatar) score += 10;
        if (passwordForm.newPassword && passwordForm.newPassword.length >= 12) score += 20;
        if (connectedAccounts.google || connectedAccounts.github) score += 20;
        if (notificationSettings.emailNotifications) score += 10;
        setSecurityScore(score);
      }, 1000);
      
      // Mock login history
      setLoginHistory([
        { id: 1, device: 'Chrome on Windows', location: 'New York, USA', ip: '192.168.x.xx', time: '2023-12-04T08:22:31Z', status: 'success' },
        { id: 2, device: 'Firefox on macOS', location: 'San Francisco, USA', ip: '172.16.x.xx', time: '2023-12-01T15:47:12Z', status: 'success' },
        { id: 3, device: 'Safari on iPhone', location: 'Chicago, USA', ip: '10.0.x.xx', time: '2023-11-28T12:32:05Z', status: 'success' },
        { id: 4, device: 'Unknown Browser', location: 'Seoul, South Korea', ip: '203.0.x.xx', time: '2023-11-25T03:14:22Z', status: 'blocked' }
      ]);
      
      // Mock active devices
      setActiveDevices([
        { id: 1, name: 'Current Browser', type: 'browser', lastActive: new Date().toISOString(), isCurrent: true },
        { id: 2, name: 'iPhone 13', type: 'mobile', lastActive: '2023-12-03T18:42:11Z', isCurrent: false },
        { id: 3, name: 'MacBook Pro', type: 'desktop', lastActive: '2023-12-02T09:15:32Z', isCurrent: false }
      ]);
      
      // Mock API key
      setApiKey('neb_' + Array(32).fill(0).map(() => 
        Math.random().toString(36).charAt(2)).join(''));
        
      // Load accessibility settings from localStorage or browser preferences
      try {
        const savedAccessibility = localStorage.getItem('nebula_accessibility');
        if (savedAccessibility) {
          setAccessibilitySettings(JSON.parse(savedAccessibility));
        } else {
          // Check browser preferences
          const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          setAccessibilitySettings(prev => ({
            ...prev,
            darkMode: prefersDarkMode,
            reducedMotion: prefersReducedMotion
          }));
        }
      } catch (e) {
        console.error('Error loading accessibility settings:', e);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage({ 
        type: 'danger', 
        text: 'Failed to load profile data. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated, loadUserData]);
  
  // Save user profile with validation
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!profile.name.trim()) errors.name = 'Name is required';
    if (!profile.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profile.email)) errors.email = 'Email is invalid';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSaving(true);
    setMessage({ type: '', text: '' });
    setFormErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a POST to your API
      // await fetch('/api/user/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });
      
      // For demo, save to localStorage
      localStorage.setItem('nebula_user_profile', JSON.stringify(profile));
      
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
      
      // Clear success message after a delay
      saveTimeoutRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ 
        type: 'danger', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Save notification settings
  const handleSaveNotificationSettings = async () => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to localStorage for demo
      localStorage.setItem('nebula_notification_settings', JSON.stringify(notificationSettings));
      
      setMessage({ 
        type: 'success', 
        text: 'Notification settings updated successfully!' 
      });
      
      // Clear success message after a delay
      saveTimeoutRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: 'Failed to update notification settings.' 
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle avatar upload with optimized reader
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.match('image.*')) {
      setMessage({ type: 'danger', text: 'Please select an image file' });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ type: 'danger', text: 'Image must be less than 5MB' });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prevProfile => ({
        ...prevProfile,
        avatar: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle input changes with proper type checking
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = {...prev};
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };
  
  // Handle notification setting changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = {...prev};
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Handle password update with validation
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    if (!passwordForm.confirmPassword) errors.confirmPassword = 'Please confirm your new password';
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSaving(true);
    setFormErrors({});
    
    // Simulate password update
    setTimeout(() => {
      setSaving(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });
      
      // Clear message after delay
      saveTimeoutRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 1000);
  };
  
  // Handle connected account toggle
  const toggleConnectedAccount = (account) => {
    setConnectedAccounts(prev => {
      const wasConnected = prev[account];
      // Set message based on previous state
      setMessage({
        type: 'success',
        text: wasConnected
          ? `Disconnected from ${account.charAt(0).toUpperCase() + account.slice(1)}`
          : `Connected to ${account.charAt(0).toUpperCase() + account.slice(1)}`
      });
      // Update security score after state update
      setTimeout(() => {
        setSecurityScore(scorePrev =>
          wasConnected ? Math.max(0, scorePrev - 20) : Math.min(100, scorePrev + 20)
        );
      }, 500);
      return {
        ...prev,
        [account]: !wasConnected
      };
    });
  };
  
  // Handle device logout
  const logoutDevice = (deviceId) => {
    setActiveDevices(prev => prev.filter(device => device.id !== deviceId));
    
    setMessage({
      type: 'success',
      text: 'Device has been logged out successfully'
    });
  };
  
  // Generate new API key
  const generateNewApiKey = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKey = 'neb_' + Array(32).fill(0).map(() => 
        Math.random().toString(36).charAt(2)).join('');
      setApiKey(newKey);
      setShowApiKey(true);
      setSaving(false);
      
      setMessage({
        type: 'success',
        text: 'New API key has been generated'
      });
    }, 800);
  };
  
  // Handle accessibility settings change
  const handleAccessibilityChange = (setting, value) => {
    setAccessibilitySettings(prev => {
      const newSettings = { ...prev, [setting]: value };
      
      // Persist to localStorage
      try {
        localStorage.setItem('nebula_accessibility', JSON.stringify(newSettings));
      } catch (e) {
        console.error('Error saving accessibility settings:', e);
      }
      
      // Apply settings immediately
      if (setting === 'fontSize') {
        document.documentElement.style.fontSize = value === 'large' ? '18px' : 
          value === 'medium' ? '16px' : '14px';
      }
      
      if (setting === 'highContrast') {
        document.body.classList.toggle('high-contrast', value);
      }
      
      if (setting === 'textSpacing') {
        document.body.classList.toggle('increased-spacing', value);
      }
      
      return newSettings;
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setMessage({
          type: 'success',
          text: 'API key copied to clipboard!'
        });
      }, () => {
        setMessage({
          type: 'danger',
          text: 'Failed to copy API key.'
        });
      });
    } else {
      // fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setMessage({
          type: 'success',
          text: 'API key copied to clipboard!'
        });
      } catch (err) {
        setMessage({
          type: 'danger',
          text: 'Failed to copy API key.'
        });
      }
      document.body.removeChild(textArea);
    }
  };
  
  // Handle logout with proper cleanup
  const handleLogout = () => {
    try {
      localStorage.removeItem('nebula_auth_token');
      localStorage.removeItem('nebula_auth_user');
      setIsAuthenticated(false);
      
      // Redirect to home or login page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      setMessage({
        type: 'danger',
        text: 'Error logging out. Please try again.'
      });
    }
  };

  return (
    <Container className="account-container py-5">
      <h1 className="account-title text-center mb-5">Account Settings</h1>
      
      {!isAuthenticated ? (
        <Card className="text-center p-5 login-prompt">
          <Card.Body>
            <div className="login-prompt-icon">👤</div>
            <h2 className="login-prompt-title">Sign In Required</h2>
            <p className="mb-4">Please sign in to access your account settings.</p>
            <div className="login-prompt-buttons">
              <Button variant="primary" size="lg" onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
              <Button variant="outline-secondary" size="lg" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your account information...</p>
        </div>
      ) : (
        <>
          {message.text && (
            <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
              {message.text}
            </Alert>
          )}
          
          <div className="account-content">
            {/* Account summary card with security score - NEW */}
            <div className="account-overview mb-4">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {profile.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt="Profile" 
                              className="account-overview-avatar" 
                            />
                          ) : (
                            <div className="account-overview-avatar-placeholder">
                              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 className="account-overview-name mb-1">{profile.name || 'User'}</h2>
                          <p className="account-overview-email mb-2">{profile.email || 'No email set'}</p>
                          <div className="d-flex align-items-center">
                            <Badge bg="success" className="me-2">Active</Badge>
                            <span className="account-overview-since">Member since Nov 2023</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="account-security-score">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Account Security</h6>
                          <span className={`security-score-value ${
                            securityScore >= 70 ? 'text-success' :
                            securityScore >= 40 ? 'text-warning' : 'text-danger'
                          }`}>{securityScore}%</span>
                        </div>
                        <ProgressBar 
                          now={securityScore} 
                          variant={
                            securityScore >= 70 ? 'success' :
                            securityScore >= 40 ? 'warning' : 'danger'
                          }
                          className="security-progress"
                        />
                        {securityScore < 70 && showSecurityTips && (
                          <div className="security-tips mt-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <small>
                                {securityScore < 40 ? 
                                  'Your account is at risk. Add more security features.' :
                                  'Good progress! A few more steps to secure your account.'}
                              </small>
                              <button 
                                className="btn btn-link btn-sm p-0 ms-2" 
                                onClick={() => setShowSecurityTips(false)}
                                aria-label="Dismiss security tips"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4 account-tabs"
            >
              <Tab eventKey="profile" title="Profile">
                <Row>
                  <Col md={4} className="mb-4 mb-md-0">
                    <div className="avatar-container text-center mb-4">
                      <div className="avatar-preview">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Profile" className="avatar-img" />
                        ) : (
                          <div className="avatar-placeholder" aria-label="Profile image placeholder">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 avatar-actions">
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          className="d-none" 
                          id="avatar-upload"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleAvatarChange}
                          aria-label="Upload profile photo"
                        />
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={triggerFileInput}
                          className="me-2"
                        >
                          <i className="bi bi-camera-fill me-1" aria-hidden="true"></i> Change Photo
                        </Button>
                        {profile.avatar && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => setProfile(prev => ({...prev, avatar: null}))}
                          >
                            <i className="bi bi-trash me-1" aria-hidden="true"></i> Remove
                          </Button>
                        )}
                      </div>
                      <div className="avatar-help-text mt-2">
                        <small className="text-muted">Recommended: Square image, max 5MB</small>
                      </div>
                    </div>
                    
                    <Card className="account-info-card">
                      <Card.Body>
                        <h5>Account Information</h5>
                        <p className="mb-1"><strong>Member Since:</strong> November 2023</p>
                        <p><strong>Status:</strong> <Badge bg="success">Active</Badge></p>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={8}>
                    <Card>
                      <Card.Body>
                        <h3 className="card-title">Profile Information</h3>
                        <Form onSubmit={handleSaveProfile} className="account-form">
                          <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={profile.name}
                              onChange={handleInputChange}
                              isInvalid={!!formErrors.name}
                              required
                            />
                            {formErrors.name && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.name}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={profile.email}
                              onChange={handleInputChange}
                              isInvalid={!!formErrors.email}
                              required
                            />
                            {formErrors.email && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.email}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="bio"
                              value={profile.bio}
                              onChange={handleInputChange}
                              rows={4}
                            />
                          </Form.Group>
                          
                          <h5 className="mt-4">Communication Preferences</h5>
                          
                          <Form.Group className="mb-3">
                            <Form.Check
                              type="switch"
                              id="newsletter-switch"
                              label="Subscribe to newsletter"
                              name="preferences.newsletter"
                              checked={profile.preferences.newsletter}
                              onChange={handleCheckboxChange}
                            />
                          </Form.Group>
                          
                          {profile.preferences.newsletter && (
                            <Form.Group className="mb-3">
                              <Form.Label>Email Frequency</Form.Label>
                              <Form.Select
                                name="preferences.emailFrequency"
                                value={profile.preferences.emailFrequency}
                                onChange={handleInputChange}
                              >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </Form.Select>
                            </Form.Group>
                          )}
                          
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <Button 
                              type="submit" 
                              variant="primary"
                              disabled={saving}
                            >
                              {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
              
              <Tab eventKey="notifications" title="Notifications">
                <Card>
                  <Card.Body>
                    <h3 className="card-title">Notification Settings</h3>
                    
                    <div className="notification-section">
                      <h5>Email Notifications</h5>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="email-notifications-switch"
                          label="Enable email notifications"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <h5 className="mt-4">Push Notifications</h5>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="push-notifications-switch"
                          label="Enable browser push notifications"
                          name="pushNotifications"
                          checked={notificationSettings.pushNotifications}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <h5 className="mt-4">Notify me about</h5>
                      <Form.Group className="mb-2">
                        <Form.Check
                          type="switch"
                          id="project-updates-switch"
                          label="Project Updates"
                          name="projectUpdates"
                          checked={notificationSettings.projectUpdates}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-2">
                        <Form.Check
                          type="switch"
                          id="new-releases-switch"
                          label="New Releases"
                          name="newReleases"
                          checked={notificationSettings.newReleases}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-2">
                        <Form.Check
                          type="switch"
                          id="events-switch"
                          label="Events & Workshops"
                          name="events"
                          checked={notificationSettings.events}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="comments-switch"
                          label="Comments & Replies"
                          name="comments"
                          checked={notificationSettings.comments}
                          onChange={handleNotificationChange}
                        />
                      </Form.Group>
                    </div>
                    
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                      <Button 
                        variant="primary"
                        onClick={handleSaveNotificationSettings}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Notification Settings'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="activity" title="Activity">
                <Card>
                  <Card.Body>
                    <h3 className="card-title">Activity History</h3>
                    
                    {activityHistory.length === 0 ? (
                      <div className="text-center py-4 empty-state">
                        <div className="empty-activity-icon">📝</div>
                        <h4>No Activity Yet</h4>
                        <p>Your activity history will appear here as you interact with the site.</p>
                      </div>
                    ) : (
                      <div className="activity-timeline">
                        {activityHistory.map((activity) => (
                          <div className="activity-item" key={activity.id}>
                            <div className={`activity-icon ${activity.type}`} aria-hidden="true">
                              {activity.type === 'view' && '👁️'}
                              {activity.type === 'bookmark' && '🔖'}
                              {activity.type === 'comment' && '💬'}
                              {activity.type === 'subscribe' && '📧'}
                            </div>
                            <div className="activity-content">
                              <p className="activity-description">
                                <span className="activity-title">{activity.description}</span>
                                <span className="visually-hidden"> on </span>
                                <span className="activity-date" aria-label={`Date: ${formatDate(activity.date)}`}>
                                  {formatDate(activity.date)}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="security" title="Security">
                <Row>
                  <Col lg={6} className="mb-4">
                    <Card className="h-100">
                      <Card.Body>
                        <h3 className="card-title">Password & Authentication</h3>
                        
                        <Form onSubmit={handlePasswordUpdate} className="account-form">
                          <Form.Group className="mb-3 position-relative">
                            <Form.Label>Current Password</Form.Label>
                            <div className="input-group">
                              <Form.Control 
                                type={passwordVisibility.currentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                isInvalid={!!formErrors.currentPassword}
                                aria-describedby="current-password-toggle"
                              />
                              <Button 
                                variant="outline-secondary" 
                                id="current-password-toggle"
                                onClick={() => togglePasswordVisibility('currentPassword')}
                                aria-label={passwordVisibility.currentPassword ? "Hide password" : "Show password"}
                              >
                                <i className={`bi ${passwordVisibility.currentPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                              </Button>
                              {formErrors.currentPassword && (
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.currentPassword}
                                </Form.Control.Feedback>
                              )}
                            </div>
                          </Form.Group>
                          
                          <Form.Group className="mb-3 position-relative">
                            <Form.Label>New Password</Form.Label>
                            <div className="input-group">
                              <Form.Control 
                                type={passwordVisibility.newPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                isInvalid={!!formErrors.newPassword}
                                aria-describedby="new-password-toggle"
                              />
                              <Button 
                                variant="outline-secondary" 
                                id="new-password-toggle"
                                onClick={() => togglePasswordVisibility('newPassword')}
                                aria-label={passwordVisibility.newPassword ? "Hide password" : "Show password"}
                              >
                                <i className={`bi ${passwordVisibility.newPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                              </Button>
                              {formErrors.newPassword && (
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.newPassword}
                                </Form.Control.Feedback>
                              )}
                            </div>
                            <div className="password-strength-meter mt-1">
                              <small className={passwordForm.newPassword.length >= 8 ? "text-success" : "text-muted"}>
                                {passwordForm.newPassword.length >= 8 ? "✓" : "•"} At least 8 characters
                              </small>
                            </div>
                          </Form.Group>
                          
                          <Form.Group className="mb-3 position-relative">
                            <Form.Label>Confirm New Password</Form.Label>
                            <div className="input-group">
                              <Form.Control 
                                type={passwordVisibility.confirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                isInvalid={!!formErrors.confirmPassword}
                                aria-describedby="confirm-password-toggle"
                              />
                              <Button 
                                variant="outline-secondary" 
                                id="confirm-password-toggle"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                aria-label={passwordVisibility.confirmPassword ? "Hide password" : "Show password"}
                              >
                                <i className={`bi ${passwordVisibility.confirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                              </Button>
                              {formErrors.confirmPassword && (
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.confirmPassword}
                                </Form.Control.Feedback>
                              )}
                            </div>
                          </Form.Group>
                          
                          <Button 
                            variant="primary" 
                            type="submit"
                            disabled={saving}
                            className="mb-4"
                          >
                            {saving ? 'Updating...' : 'Update Password'}
                          </Button>
                        </Form>
                        
                        <hr />
                        
                        {/* Two-Factor Authentication - NEW */}
                        <div className="mt-4">
                          <h5>Two-Factor Authentication</h5>
                          <p className="text-muted">Add an extra layer of security to your account</p>
                          
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="mb-1">Authenticator App</h6>
                              <p className="text-muted small mb-0">Use an app like Google Authenticator</p>
                            </div>
                            <Button variant="outline-primary" size="sm">
                              Setup
                            </Button>
                          </div>
                          
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h6 className="mb-1">SMS Authentication</h6>
                              <p className="text-muted small mb-0">Receive a code via text message</p>
                            </div>
                            <Button variant="outline-primary" size="sm">
                              Setup
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col lg={6} className="mb-4">
                    <Card className="h-100">
                      <Card.Body>
                        <h3 className="card-title">Connected Accounts</h3>
                        <p className="text-muted mb-4">Link your accounts for easier login</p>
                        
                        <div className="connected-accounts">
                          <div className="connected-account-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="connected-account-icon google-icon">
                                  <i className="bi bi-google"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">Google</h6>
                                  <small className="text-muted">
                                    {connectedAccounts.google ? profile.email : 'Not connected'}
                                  </small>
                                </div>
                              </div>
                              <Button 
                                variant={connectedAccounts.google ? "outline-danger" : "outline-primary"}
                                size="sm"
                                onClick={() => toggleConnectedAccount('google')}
                              >
                                {connectedAccounts.google ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="connected-account-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="connected-account-icon github-icon">
                                  <i className="bi bi-github"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">GitHub</h6>
                                  <small className="text-muted">
                                    {connectedAccounts.github ? '@username' : 'Not connected'}
                                  </small>
                                </div>
                              </div>
                              <Button 
                                variant={connectedAccounts.github ? "outline-danger" : "outline-primary"}
                                size="sm"
                                onClick={() => toggleConnectedAccount('github')}
                              >
                                {connectedAccounts.github ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="connected-account-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="connected-account-icon facebook-icon">
                                  <i className="bi bi-facebook"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">Facebook</h6>
                                  <small className="text-muted">
                                    {connectedAccounts.facebook ? 'Connected' : 'Not connected'}
                                  </small>
                                </div>
                              </div>
                              <Button 
                                variant={connectedAccounts.facebook ? "outline-danger" : "outline-primary"}
                                size="sm"
                                onClick={() => toggleConnectedAccount('facebook')}
                              >
                                {connectedAccounts.facebook ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="connected-account-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="connected-account-icon twitter-icon">
                                  <i className="bi bi-twitter-x"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">X / Twitter</h6>
                                  <small className="text-muted">
                                    {connectedAccounts.twitter ? '@handle' : 'Not connected'}
                                  </small>
                                </div>
                              </div>
                              <Button 
                                variant={connectedAccounts.twitter ? "outline-danger" : "outline-primary"}
                                size="sm"
                                onClick={() => toggleConnectedAccount('twitter')}
                              >
                                {connectedAccounts.twitter ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col lg={12}>
                    <Card>
                      <Card.Body>
                        <h3 className="card-title">Login History</h3>
                        
                        <div className="login-history">
                          <div className="table-responsive">
                            <table className="table table-hover login-history-table">
                              <thead>
                                <tr>
                                  <th>Device</th>
                                  <th>Location</th>
                                  <th>IP Address</th>
                                  <th>Time</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {loginHistory.map(login => (
                                  <tr key={login.id} className={login.status === 'blocked' ? 'table-danger' : ''}>
                                    <td>{login.device}</td>
                                    <td>{login.location}</td>
                                    <td>{login.ip}</td>
                                    <td>{formatDate(login.time)}</td>
                                    <td>
                                      <Badge bg={login.status === 'success' ? 'success' : 'danger'}>
                                        {login.status}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
              
              <Tab eventKey="devices" title="Devices">
                <Card>
                  <Card.Body>
                    <h3 className="card-title">Active Devices</h3>
                    <p className="text-muted mb-4">Manage devices currently signed in to your account</p>
                    
                    <div className="active-devices">
                      {activeDevices.map(device => (
                        <div className="active-device-item" key={device.id}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className={`device-icon ${device.type}-icon`}>
                                <i className={`bi bi-${
                                  device.type === 'browser' ? 'display' : 
                                  device.type === 'mobile' ? 'phone' : 'laptop'
                                }`}></i>
                              </div>
                              <div>
                                <h6 className="mb-0 d-flex align-items-center">
                                  {device.name}
                                  {device.isCurrent && (
                                    <Badge bg="primary" pill className="ms-2">Current</Badge>
                                  )}
                                </h6>
                                <small className="text-muted">
                                  Last active: {formatDate(device.lastActive)}
                                </small>
                              </div>
                            </div>
                            {!device.isCurrent && (
                              <Button 
                                variant="outline-danger"
                                size="sm"
                                onClick={() => logoutDevice(device.id)}
                              >
                                Logout
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center mt-4">
                      <Button variant="outline-danger" onClick={() => {
                        setActiveDevices(activeDevices.filter(d => d.isCurrent));
                        setMessage({
                          type: 'success',
                          text: 'All other devices have been logged out'
                        });
                      }}>
                        Logout from all other devices
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="developer" title="Developer">
                <Card>
                  <Card.Body>
                    <h3 className="card-title">API Access</h3>
                    <p className="text-muted mb-4">Manage your API keys for integrating with our services</p>
                    
                    <div className="api-key-section">
                      <h5>Your API Key</h5>
                      <div className="api-key-display">
                        <div className="input-group mb-3">
                          <Form.Control
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            readOnly
                            onClick={(e) => e.target.select()}
                          />
                          <Button 
                            variant="outline-secondary"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            <i className={`bi ${showApiKey ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </Button>
                          <Button 
                            variant="outline-primary"
                            onClick={() => copyToClipboard(apiKey)}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center mt-3">
                        <Button 
                          variant="primary"
                          onClick={generateNewApiKey}
                          disabled={saving}
                        >
                          {saving ? 'Generating...' : 'Generate New API Key'}
                        </Button>
                        
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip>
                              Generating a new API key will invalidate your current key
                            </Tooltip>
                          }
                        >
                          <i className="bi bi-question-circle ms-2"></i>
                        </OverlayTrigger>
                      </div>
                      
                      <div className="mt-4">
                        <h5>Documentation</h5>
                        <p>
                          Learn how to use our API to integrate Nebula 3D into your projects.
                        </p>
                        <Button variant="outline-primary" onClick={() => window.open('/api-docs', '_blank')}>
                          View Documentation
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="accessibility" title="Accessibility">
                <Card>
                  <Card.Body>
                    <h3 className="card-title">Accessibility Preferences</h3>
                    <p className="text-muted mb-4">Customize your experience to make the site more accessible</p>
                    
                    <Form className="accessibility-form">
                      <Form.Group className="mb-4">
                        <Form.Label><h5 className="mb-3">Visual</h5></Form.Label>
                        
                        <div className="mb-3">
                          <Form.Label>Font Size</Form.Label>
                          <div className="d-flex align-items-center font-size-controls">
                            <Form.Check
                              type="radio"
                              id="font-size-small"
                              name="fontSize"
                              label="Small"
                              checked={accessibilitySettings.fontSize === 'small'}
                              onChange={() => handleAccessibilityChange('fontSize', 'small')}
                              className="me-3"
                            />
                            <Form.Check
                              type="radio"
                              id="font-size-medium"
                              name="fontSize"
                              label="Medium"
                              checked={accessibilitySettings.fontSize === 'medium'}
                              onChange={() => handleAccessibilityChange('fontSize', 'medium')}
                              className="me-3"
                            />
                            <Form.Check
                              type="radio"
                              id="font-size-large"
                              name="fontSize"
                              label="Large"
                              checked={accessibilitySettings.fontSize === 'large'}
                              onChange={() => handleAccessibilityChange('fontSize', 'large')}
                            />
                          </div>
                        </div>
                        
                        <Form.Check
                          type="switch"
                          id="high-contrast"
                          label="High Contrast Mode"
                          checked={accessibilitySettings.highContrast}
                          onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
                          className="mb-3"
                        />
                        
                        <Form.Check
                          type="switch"
                          id="reduced-motion"
                          label="Reduced Motion"
                          checked={accessibilitySettings.reducedMotion}
                          onChange={(e) => handleAccessibilityChange('reducedMotion', e.target.checked)}
                          className="mb-3"
                        />
                        
                        <Form.Check
                          type="switch"
                          id="text-spacing"
                          label="Increased Text Spacing"
                          checked={accessibilitySettings.textSpacing}
                          onChange={(e) => handleAccessibilityChange('textSpacing', e.target.checked)}
                        />
                      </Form.Group>
                      
                      <hr />
                      
                      <div className="mt-4">
                        <h5>Accessibility Statement</h5>
                        <p>
                          We are committed to ensuring our website is accessible to all users.
                          If you encounter any accessibility barriers, please contact us.
                        </p>
                        <Button variant="link" className="p-0" onClick={() => window.open('/accessibility', '_blank')}>
                          Read our accessibility statement
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="account" title="Account">
                <Card>
                  <Card.Body>
                    <h3 className="card-title">Account Management</h3>
                    
                    <div className="section-divider">
                      <h5>Change Password</h5>
                      <Form onSubmit={handlePasswordUpdate} className="account-form">
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Current Password</Form.Label>
                          <div className="input-group">
                            <Form.Control 
                              type={passwordVisibility.currentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              isInvalid={!!formErrors.currentPassword}
                              aria-describedby="current-password-toggle"
                            />
                            <Button 
                              variant="outline-secondary" 
                              id="current-password-toggle"
                              onClick={() => togglePasswordVisibility('currentPassword')}
                              aria-label={passwordVisibility.currentPassword ? "Hide password" : "Show password"}
                            >
                              <i className={`bi ${passwordVisibility.currentPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                            </Button>
                            {formErrors.currentPassword && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.currentPassword}
                              </Form.Control.Feedback>
                            )}
                          </div>
                        </Form.Group>
                        
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>New Password</Form.Label>
                          <div className="input-group">
                            <Form.Control 
                              type={passwordVisibility.newPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              isInvalid={!!formErrors.newPassword}
                              aria-describedby="new-password-toggle"
                            />
                            <Button 
                              variant="outline-secondary" 
                              id="new-password-toggle"
                              onClick={() => togglePasswordVisibility('newPassword')}
                              aria-label={passwordVisibility.newPassword ? "Hide password" : "Show password"}
                            >
                              <i className={`bi ${passwordVisibility.newPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                            </Button>
                            {formErrors.newPassword && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.newPassword}
                              </Form.Control.Feedback>
                            )}
                          </div>
                          <div className="password-strength-meter mt-1">
                            <small className={passwordForm.newPassword.length >= 8 ? "text-success" : "text-muted"}>
                              {passwordForm.newPassword.length >= 8 ? "✓" : "•"} At least 8 characters
                            </small>
                          </div>
                        </Form.Group>
                        
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Confirm New Password</Form.Label>
                          <div className="input-group">
                            <Form.Control 
                              type={passwordVisibility.confirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordChange}
                              isInvalid={!!formErrors.confirmPassword}
                              aria-describedby="confirm-password-toggle"
                            />
                            <Button 
                              variant="outline-secondary" 
                              id="confirm-password-toggle"
                              onClick={() => togglePasswordVisibility('confirmPassword')}
                              aria-label={passwordVisibility.confirmPassword ? "Hide password" : "Show password"}
                            >
                              <i className={`bi ${passwordVisibility.confirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                            </Button>
                            {formErrors.confirmPassword && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.confirmPassword}
                              </Form.Control.Feedback>
                            )}
                          </div>
                        </Form.Group>
                        
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={saving}
                        >
                          {saving ? 'Updating...' : 'Update Password'}
                        </Button>
                      </Form>
                    </div>
                    
                    <div className="section-divider mt-5">
                      <h5>Data & Privacy</h5>
                      <p>Manage your data and privacy preferences.</p>
                      
                      <Row className="mt-4">
                        <Col md={6}>
                          <Button variant="outline-primary" className="w-100 mb-3">
                            Download My Data
                          </Button>
                        </Col>
                        <Col md={6}>
                          <Button variant="outline-primary" className="w-100 mb-3">
                            Manage Cookies
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    
                    <div className="section-divider mt-5">
                      <h5>Account Actions</h5>
                      
                      <Row className="mt-4">
                        <Col md={6}>
                          <Button 
                            variant="primary" 
                            className="w-100 mb-3"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </Col>
                        <Col md={6}>
                          <Button 
                            variant="danger" 
                            className="w-100 mb-3"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            Delete Account
                          </Button>
                          
                          {showDeleteConfirm && (
                            <div className="delete-confirmation mt-3 p-3 border border-danger rounded">
                              <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-exclamation-triangle-fill text-danger me-2" style={{ fontSize: '1.5rem' }} aria-hidden="true"></i>
                                <h5 className="mb-0 text-danger">Delete Account</h5>
                              </div>
                              <p className="text-danger">Are you sure you want to delete your account? This action <strong>cannot be undone</strong> and all your data will be permanently lost.</p>
                              <div className="d-flex justify-content-between">
                                <Button 
                                  variant="outline-secondary"
                                  onClick={() => setShowDeleteConfirm(false)}
                                  className="px-4"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="danger"
                                  onClick={() => {
                                    // Handle account deletion
                                    setShowDeleteConfirm(false);
                                    setMessage({
                                      type: 'info',
                                      text: 'Account deletion requested. You will receive an email with further instructions.'
                                    });
                                  }}
                                  className="px-4"
                                >
                                  Delete Account
                                </Button>
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </>
      )}
    </Container>
  );
};

export default Account;
