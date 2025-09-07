import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, ProgressBar } from 'react-bootstrap';
import { useNotifications } from '../../App';
import './Account.css';

function Account() {
  const { showNotification } = useNotifications();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    portfolioUpdates: true,
    systemUpdates: false,
    marketingEmails: false
  });
  const [userInfo, setUserInfo] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    memberSince: '2024-01-01',
    avatar: null
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editUserInfo, setEditUserInfo] = useState(userInfo);
  const [profileCompletion, setProfileCompletion] = useState(60);
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem('user_notification_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      // Load user info from localStorage
      const savedUserInfo = localStorage.getItem('user_profile_info');
      if (savedUserInfo) {
        const parsedUserInfo = JSON.parse(savedUserInfo);
        setUserInfo(parsedUserInfo);
        setEditUserInfo(parsedUserInfo);
        
        // Update profile completion
        const completion = calculateProfileCompletion(parsedUserInfo);
        setProfileCompletion(completion);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    showNotification('Account settings loaded', 'info', 2000);
  }, [showNotification]);

  const handleSettingChange = (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    
    setSettings(newSettings);
    setPreferencesSaved(true);
    
    // Save to localStorage
    try {
      localStorage.setItem('user_notification_settings', JSON.stringify(newSettings));
      showNotification(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`, 'success', 2000, {
        icon: newSettings[setting] ? '✅' : '🔕'
      });
      
      // Auto-hide saved indicator after 3 seconds
      setTimeout(() => setPreferencesSaved(false), 3000);
    } catch (error) {
      showNotification('Failed to save settings', 'danger');
    }
  };

  const saveProfile = () => {
    setUserInfo(editUserInfo);
    setShowEditProfile(false);
    
    // Save to localStorage
    try {
      localStorage.setItem('user_profile_info', JSON.stringify(editUserInfo));
      showNotification('Profile updated successfully!', 'success', 3000, { icon: '👤' });
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Failed to save profile', 'danger');
    }
    
    // Update profile completion
    const completion = calculateProfileCompletion(editUserInfo);
    setProfileCompletion(completion);
  };

  const calculateProfileCompletion = (profile) => {
    let score = 0;
    if (profile.name && profile.name !== 'Guest User') score += 20;
    if (profile.email && profile.email !== 'guest@example.com') score += 20;
    if (profile.bio) score += 20;
    if (profile.avatar) score += 20;
    if (profile.memberSince) score += 20;
    return score;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be less than 5MB', 'warning');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditUserInfo({...editUserInfo, avatar: e.target.result});
        showNotification('Image uploaded successfully!', 'success', 2000, { icon: '📸' });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setEditUserInfo({...editUserInfo, avatar: null});
    showNotification('Avatar removed', 'info', 2000, { icon: '🗑️' });
  };

  const requestBrowserNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, browserNotifications: true }));
        showNotification('Browser notifications enabled', 'success');
      } else {
        showNotification('Browser notifications denied', 'warning');
      }
    } else {
      showNotification('Browser notifications not supported', 'warning');
    }
  };

  const testNotification = () => {
    showNotification('This is a test notification!', 'info');
    
    if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Colin Nebula Portfolio', {
        body: 'This is a test browser notification',
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <Container fluid className="account-container py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          {/* Elegant Header with Animation */}
          <div className="account-header text-center mb-5">
            <div className="account-hero-icon mb-3">
              <div className="hero-circle">
                <i className="bi bi-person-gear"></i>
              </div>
            </div>
            <h1 className="account-title">Account Settings</h1>
            <p className="account-subtitle">
              Personalize your experience and manage your preferences
            </p>
          </div>

          {/* Profile Completion Card */}
          <Card className="profile-completion-card mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  Profile Completion
                </h5>
                <Badge bg="primary" className="completion-badge">
                  {profileCompletion}%
                </Badge>
              </div>
              <ProgressBar 
                now={profileCompletion} 
                className="elegant-progress mb-2"
                animated
                striped
              />
              <small className="text-muted">
                Complete your profile to unlock all features
              </small>
            </Card.Body>
          </Card>

          {/* Enhanced User Information */}
          <Card className="user-info-card mb-4">
            <Card.Header className="elegant-card-header">
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="mb-0">
                  <i className="bi bi-person-circle me-2"></i>
                  Profile Information
                </h4>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="edit-profile-btn"
                  onClick={() => setShowEditProfile(true)}
                >
                  <i className="bi bi-pencil me-1"></i>Edit
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="user-info-body">
              <Row className="g-4">
                <Col md={4} className="text-center">
                  <div className="profile-avatar mb-3">
                    {userInfo.avatar ? (
                      <img 
                        src={userInfo.avatar} 
                        alt="Profile Avatar" 
                        className="avatar-image"
                      />
                    ) : (
                      <i className="bi bi-person-circle"></i>
                    )}
                  </div>
                  <Badge bg="success" className="status-badge">
                    <i className="bi bi-check-circle me-1"></i>Active
                  </Badge>
                </Col>
                <Col md={8}>
                  <div className="profile-details">
                    <div className="detail-item mb-3">
                      <label className="detail-label">Full Name</label>
                      <div className="detail-value">{userInfo.name}</div>
                    </div>
                    <div className="detail-item mb-3">
                      <label className="detail-label">Email Address</label>
                      <div className="detail-value">{userInfo.email}</div>
                    </div>
                    <div className="detail-item">
                      <label className="detail-label">Member Since</label>
                      <div className="detail-value">
                        {new Date(userInfo.memberSince).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Enhanced Notification Settings */}
          <Card className="notification-settings-card mb-4">
            <Card.Header className="elegant-card-header">
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="mb-0">
                  <i className="bi bi-bell-fill me-2"></i>
                  Notification Preferences
                </h4>
                {preferencesSaved && (
                  <Badge bg="success" className="saved-indicator">
                    <i className="bi bi-check2 me-1"></i>Saved
                  </Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body className="notification-body">
              <Form>
                <Row className="g-4">
                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-envelope-fill option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Email Notifications"
                          checked={settings.emailNotifications}
                          onChange={() => handleSettingChange('emailNotifications')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Receive email updates about new portfolio items and announcements
                      </small>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-browser-chrome option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="browser-notifications"
                          label="Browser Notifications"
                          checked={settings.browserNotifications}
                          onChange={() => handleSettingChange('browserNotifications')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Show desktop notifications in your browser
                      </small>
                      {!settings.browserNotifications && (
                        <div className="mt-2">
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="enable-btn"
                            onClick={requestBrowserNotifications}
                          >
                            <i className="bi bi-toggle-on me-1"></i>Enable
                          </Button>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-briefcase-fill option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="portfolio-updates"
                          label="Portfolio Updates"
                          checked={settings.portfolioUpdates}
                          onChange={() => handleSettingChange('portfolioUpdates')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Get notified when new creative work is added
                      </small>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-gear-fill option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="system-updates"
                          label="System Updates"
                          checked={settings.systemUpdates}
                          onChange={() => handleSettingChange('systemUpdates')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Receive notifications about website improvements
                      </small>
                    </div>
                  </Col>
                </Row>

                <hr className="elegant-divider my-4" />

                <div className="action-buttons d-flex gap-3 flex-wrap justify-content-center">
                  <Button 
                    variant="primary" 
                    className="action-btn test-btn"
                    onClick={testNotification}
                  >
                    <i className="bi bi-bell me-2"></i>Test Notification
                  </Button>
                  <Button 
                    variant="outline-success" 
                    className="action-btn save-btn"
                    onClick={() => showNotification('All settings are automatically saved!', 'success', 3000, { icon: '💾' })}
                  >
                    <i className="bi bi-check-circle me-2"></i>Auto-Save Active
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="quick-actions-card">
            <Card.Header className="elegant-card-header">
              <h4 className="mb-0">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                Quick Actions
              </h4>
            </Card.Header>
            <Card.Body className="quick-actions-body">
              <Row className="g-3">
                <Col md={4}>
                  <Button 
                    variant="outline-info" 
                    href="/updates" 
                    className="quick-action-btn w-100"
                  >
                    <i className="bi bi-arrow-up-right-circle me-2"></i>
                    <div>
                      <div className="action-title">View Updates</div>
                      <small className="action-subtitle">Latest changes</small>
                    </div>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-warning" 
                    href="/portfolio" 
                    className="quick-action-btn w-100"
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    <div>
                      <div className="action-title">View Portfolio</div>
                      <small className="action-subtitle">Creative work</small>
                    </div>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-success" 
                    href="/privacy-policy" 
                    className="quick-action-btn w-100"
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    <div>
                      <div className="action-title">Privacy Policy</div>
                      <small className="action-subtitle">Your data</small>
                    </div>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Edit Profile Modal */}
          <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)} centered>
            <Modal.Header closeButton className="elegant-modal-header">
              <Modal.Title>
                <i className="bi bi-person-gear me-2"></i>
                Edit Profile
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Avatar Upload Section */}
                <Form.Group className="mb-4">
                  <Form.Label>Profile Picture</Form.Label>
                  <div className="avatar-upload-section">
                    <div className="current-avatar-preview mb-3">
                      <div className="avatar-preview-container">
                        {editUserInfo.avatar ? (
                          <img 
                            src={editUserInfo.avatar} 
                            alt="Avatar Preview" 
                            className="avatar-preview-image"
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            <i className="bi bi-person-circle"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="avatar-upload-controls d-flex gap-2 flex-wrap">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="d-none"
                        id="avatarUpload"
                      />
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => document.getElementById('avatarUpload').click()}
                      >
                        <i className="bi bi-camera me-1"></i>
                        {editUserInfo.avatar ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      {editUserInfo.avatar && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={removeAvatar}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </Button>
                      )}
                    </div>
                    <small className="text-muted d-block mt-2">
                      Recommended: Square image, max 5MB (JPG, PNG, GIF)
                    </small>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editUserInfo.name}
                    onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={editUserInfo.email}
                    onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editUserInfo.bio || ''}
                    onChange={(e) => setEditUserInfo({...editUserInfo, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowEditProfile(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveProfile}>
                <i className="bi bi-check-lg me-1"></i>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default Account;
