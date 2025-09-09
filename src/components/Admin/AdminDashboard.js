import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Badge, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import './AdminDashboard.css';

// Import admin sub-components
import UserManagement from './UserManagement';
import PortfolioManagement from './PortfolioManagement';
import ContactManagement from './ContactManagement';
import SiteAnalytics from './SiteAnalytics';
import ThemeCustomization from './ThemeCustomization';

const AdminDashboard = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalContacts: 0,
    todayVisitors: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = () => {
    // Load basic stats for overview
    const users = JSON.parse(localStorage.getItem('nebula_users') || '[]');
    const projects = JSON.parse(localStorage.getItem('admin_portfolio_projects') || '[]');
    const contacts = JSON.parse(localStorage.getItem('admin_contact_submissions') || '[]');
    const analytics = JSON.parse(localStorage.getItem('site_analytics') || '{}');
    
    setDashboardStats({
      totalUsers: users.length,
      totalProjects: projects.length,
      totalContacts: contacts.length,
      todayVisitors: analytics.todayVisitors || 0
    });
  };

  const adminTabs = [
    { key: 'overview', title: 'Dashboard Overview', icon: '📊' },
    { key: 'users', title: 'User Management', icon: '👥' },
    { key: 'portfolio', title: 'Portfolio Projects', icon: '💼' },
    { key: 'contacts', title: 'Contact Forms', icon: '📧' },
    { key: 'analytics', title: 'Site Analytics', icon: '📈' },
    { key: 'theme', title: 'Theme Customization', icon: '🎨' }
  ];

  const OverviewTab = () => (
    <div className="admin-overview">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-2">Welcome back, {user?.name || 'Administrator'}! 👑</h2>
          <p className="text-muted mb-0">Here's what's happening with your portfolio</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-users">
            <Card.Body className="text-center">
              <div className="stat-icon">👥</div>
              <h3>{dashboardStats.totalUsers}</h3>
              <p>Registered Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-projects">
            <Card.Body className="text-center">
              <div className="stat-icon">💼</div>
              <h3>{dashboardStats.totalProjects}</h3>
              <p>Portfolio Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-contacts">
            <Card.Body className="text-center">
              <div className="stat-icon">📧</div>
              <h3>{dashboardStats.totalContacts}</h3>
              <p>Contact Messages</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-visitors">
            <Card.Body className="text-center">
              <div className="stat-icon">📈</div>
              <h3>{dashboardStats.todayVisitors}</h3>
              <p>Today's Visitors</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="quick-actions-card">
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-action-grid">
                <Button variant="outline-primary" onClick={() => setActiveTab('portfolio')}>
                  📁 Add New Project
                </Button>
                <Button variant="outline-success" onClick={() => setActiveTab('users')}>
                  👤 Manage Users
                </Button>
                <Button variant="outline-info" onClick={() => setActiveTab('contacts')}>
                  📬 View Messages
                </Button>
                <Button variant="outline-warning" onClick={() => setActiveTab('theme')}>
                  🎨 Customize Theme
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card className="recent-activity-card">
            <Card.Header>
              <h5>Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-feed">
                <div className="activity-item">
                  <span className="activity-icon">👤</span>
                  <span>New user registered - 2 hours ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📧</span>
                  <span>Contact form submitted - 4 hours ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📊</span>
                  <span>100+ visitors today - 6 hours ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💼</span>
                  <span>Portfolio project updated - 1 day ago</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="admin-dashboard-overlay">
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="admin-title">
            <h1>👑 Admin Dashboard</h1>
            <Badge bg="success">Administrator</Badge>
          </div>
          <Button variant="outline-secondary" onClick={onClose} className="close-admin-btn">
            ✕ Close
          </Button>
        </div>

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="pills" className="admin-nav mb-4">
            {adminTabs.map(tab => (
              <Nav.Item key={tab.key}>
                <Nav.Link eventKey={tab.key}>
                  <span className="nav-icon">{tab.icon}</span>
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="overview">
              <OverviewTab />
            </Tab.Pane>
            
            <Tab.Pane eventKey="users">
              <UserManagement onStatsUpdate={loadDashboardStats} />
            </Tab.Pane>
            
            <Tab.Pane eventKey="portfolio">
              <PortfolioManagement onStatsUpdate={loadDashboardStats} />
            </Tab.Pane>
            
            <Tab.Pane eventKey="contacts">
              <ContactManagement onStatsUpdate={loadDashboardStats} />
            </Tab.Pane>
            
            <Tab.Pane eventKey="analytics">
              <SiteAnalytics />
            </Tab.Pane>
            
            <Tab.Pane eventKey="theme">
              <ThemeCustomization />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default AdminDashboard;