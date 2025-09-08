import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Tab, Tabs } from 'react-bootstrap';
import { useNotifications } from '../../App';
import './Account.css';

function Account() {
  const { showNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    memberSince: new Date().toISOString().split('T')[0],
    accountType: 'guest'
  });

  const getAccountTypeBadge = (type) => {
    const badges = {
      'guest': { variant: 'secondary', icon: '👤', text: 'Guest' },
      'user': { variant: 'primary', icon: '👤', text: 'User' },
      'premium': { variant: 'warning', icon: '⭐', text: 'Premium' },
      'admin': { variant: 'danger', icon: '👑', text: 'Admin' }
    };
    
    const badge = badges[type] || badges.guest;
    return (
      <Badge bg={badge.variant}>
        <span className="me-1">{badge.icon}</span>
        {badge.text}
      </Badge>
    );
  };

  const testNotification = () => {
    showNotification('This is a test notification!', 'info');
  };

  return (
    <Container fluid className="account-container py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <div className="account-header mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="account-avatar me-3">
                <div className="avatar-placeholder rounded-circle">
                  <i className="fas fa-user fa-2x"></i>
                </div>
              </div>
              <div>
                <h2 className="mb-1">
                  {userInfo.name}
                  <span className="ms-2">{getAccountTypeBadge(userInfo.accountType)}</span>
                </h2>
                <p className="text-muted mb-0">{userInfo.email}</p>
                <small className="text-muted">Member since: {userInfo.memberSince}</small>
              </div>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="account-tabs mb-4"
          >
            <Tab eventKey="profile" title="Profile">
              <Card>
                <Card.Body>
                  <h5>Profile Information</h5>
                  <p><strong>Name:</strong> {userInfo.name}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Account Type:</strong> {getAccountTypeBadge(userInfo.accountType)}</p>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="settings" title="Settings">
              <Card>
                <Card.Body>
                  <h5>Settings</h5>
                  <p>Notification preferences and account settings will be available here.</p>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="activity" title="Activity">
              <Card>
                <Card.Body>
                  <h5>Recent Activity</h5>
                  <p>Your recent activity will be displayed here.</p>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>

          <Card>
            <Card.Body>
              <h5>Quick Actions</h5>
              <Button variant="outline-primary" className="me-2" onClick={testNotification}>
                <i className="fas fa-bell me-1"></i>Test Notification
              </Button>
              <Button variant="outline-success" className="me-2">
                <i className="fas fa-share me-1"></i>Share Portfolio
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Account;