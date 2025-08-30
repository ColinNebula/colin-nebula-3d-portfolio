import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNotifications } from '../../App';

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
    memberSince: '2024-01-01'
  });

  useEffect(() => {
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem('user_notification_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
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
    
    // Save to localStorage
    try {
      localStorage.setItem('user_notification_settings', JSON.stringify(newSettings));
      showNotification(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      showNotification('Failed to save settings', 'danger');
    }
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
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Account Settings</h1>
            <p className="lead text-muted">
              Manage your notification preferences and account information
            </p>
          </div>

          {/* User Information */}
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0"><i className="bi bi-person-circle me-2"></i>User Information</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Name:</strong> {userInfo.name}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Member Since:</strong> {new Date(userInfo.memberSince).toLocaleDateString()}</p>
                  <Badge bg="success" className="me-2">Active</Badge>
                  <Badge bg="info">Guest</Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Notification Settings */}
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0"><i className="bi bi-bell me-2"></i>Notification Settings</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                <div className="mb-3">
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    label="Email Notifications"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                  />
                  <small className="text-muted">Receive email updates about new portfolio items</small>
                </div>

                <div className="mb-3">
                  <Form.Check
                    type="switch"
                    id="browser-notifications"
                    label="Browser Notifications"
                    checked={settings.browserNotifications}
                    onChange={() => handleSettingChange('browserNotifications')}
                  />
                  <small className="text-muted">Show desktop notifications in your browser</small>
                  {!settings.browserNotifications && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline-primary" onClick={requestBrowserNotifications}>
                        Enable Browser Notifications
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <Form.Check
                    type="switch"
                    id="portfolio-updates"
                    label="Portfolio Updates"
                    checked={settings.portfolioUpdates}
                    onChange={() => handleSettingChange('portfolioUpdates')}
                  />
                  <small className="text-muted">Get notified when new work is added</small>
                </div>

                <div className="mb-3">
                  <Form.Check
                    type="switch"
                    id="system-updates"
                    label="System Updates"
                    checked={settings.systemUpdates}
                    onChange={() => handleSettingChange('systemUpdates')}
                  />
                  <small className="text-muted">Receive notifications about website improvements</small>
                </div>

                <div className="mb-3">
                  <Form.Check
                    type="switch"
                    id="marketing-emails"
                    label="Marketing Emails"
                    checked={settings.marketingEmails}
                    onChange={() => handleSettingChange('marketingEmails')}
                  />
                  <small className="text-muted">Receive promotional content and updates</small>
                </div>
              </Form>

              <hr />

              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary" onClick={testNotification}>
                  <i className="bi bi-bell me-1"></i>Test Notification
                </Button>
                <Button variant="outline-secondary" onClick={() => showNotification('Settings saved successfully', 'success')}>
                  <i className="bi bi-check-circle me-1"></i>Save Settings
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h4 className="mb-0"><i className="bi bi-lightning me-2"></i>Quick Actions</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="outline-info" href="/updates">
                  <i className="bi bi-arrow-up-right-circle me-1"></i>View Updates
                </Button>
                <Button variant="outline-warning" href="/portfolio">
                  <i className="bi bi-briefcase me-1"></i>View Portfolio
                </Button>
                <Button variant="outline-success" href="/privacy-policy">
                  <i className="bi bi-shield-check me-1"></i>Privacy Policy
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Account;
