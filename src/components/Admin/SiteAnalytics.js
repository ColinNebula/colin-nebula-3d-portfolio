import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Alert, Button } from 'react-bootstrap';

const SiteAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    visitors: {
      today: 0,
      week: 0,
      month: 0,
      total: 0
    },
    pageViews: {
      today: 0,
      week: 0,
      month: 0,
      total: 0
    },
    topPages: [],
    recentVisitors: [],
    devices: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    browsers: {},
    countries: {}
  });

  useEffect(() => {
    loadAnalytics();
    // Track current visit
    trackVisit();
  }, []);

  const loadAnalytics = () => {
    const storedAnalytics = JSON.parse(localStorage.getItem('site_analytics') || '{}');
    
    // Generate demo data if none exists
    if (!storedAnalytics.visitors) {
      const demoAnalytics = generateDemoAnalytics();
      localStorage.setItem('site_analytics', JSON.stringify(demoAnalytics));
      setAnalytics(demoAnalytics);
    } else {
      setAnalytics(storedAnalytics);
    }
  };

  const generateDemoAnalytics = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      visitors: {
        today: 47,
        week: 312,
        month: 1450,
        total: 8750
      },
      pageViews: {
        today: 89,
        week: 876,
        month: 3240,
        total: 25600
      },
      topPages: [
        { path: '/portfolio', views: 1240, percentage: 28.5 },
        { path: '/', views: 1180, percentage: 27.1 },
        { path: '/about', views: 650, percentage: 14.9 },
        { path: '/contact', views: 420, percentage: 9.6 },
        { path: '/resume', views: 380, percentage: 8.7 },
        { path: '/projects/ecommerce', views: 280, percentage: 6.4 },
        { path: '/projects/weather-app', views: 210, percentage: 4.8 }
      ],
      recentVisitors: [
        {
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          page: '/portfolio',
          country: 'United States',
          device: 'Desktop',
          browser: 'Chrome'
        },
        {
          timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
          page: '/',
          country: 'Canada',
          device: 'Mobile',
          browser: 'Safari'
        },
        {
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          page: '/contact',
          country: 'United Kingdom',
          device: 'Desktop',
          browser: 'Firefox'
        },
        {
          timestamp: new Date(Date.now() - 62 * 60 * 1000).toISOString(),
          page: '/about',
          country: 'Germany',
          device: 'Tablet',
          browser: 'Chrome'
        },
        {
          timestamp: new Date(Date.now() - 89 * 60 * 1000).toISOString(),
          page: '/portfolio',
          country: 'Australia',
          device: 'Mobile',
          browser: 'Chrome'
        }
      ],
      devices: {
        desktop: 1680,
        mobile: 1320,
        tablet: 240
      },
      browsers: {
        'Chrome': 1890,
        'Safari': 680,
        'Firefox': 420,
        'Edge': 210,
        'Other': 40
      },
      countries: {
        'United States': 1245,
        'Canada': 380,
        'United Kingdom': 295,
        'Germany': 240,
        'Australia': 180,
        'France': 165,
        'Netherlands': 145,
        'Other': 590
      }
    };
  };

  const trackVisit = () => {
    // Simulate tracking a visit
    const currentAnalytics = JSON.parse(localStorage.getItem('site_analytics') || '{}');
    if (currentAnalytics.visitors) {
      currentAnalytics.visitors.today += 1;
      currentAnalytics.pageViews.today += 1;
      localStorage.setItem('site_analytics', JSON.stringify(currentAnalytics));
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device) => {
    const icons = {
      Desktop: '🖥️',
      Mobile: '📱',
      Tablet: '📲'
    };
    return icons[device] || '💻';
  };

  const getBrowserIcon = (browser) => {
    const icons = {
      Chrome: '🟢',
      Safari: '🔵',
      Firefox: '🟠',
      Edge: '🔷',
      Other: '⚫'
    };
    return icons[browser] || '⚫';
  };

  const getCountryFlag = (country) => {
    const flags = {
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'Australia': '🇦🇺',
      'France': '🇫🇷',
      'Netherlands': '🇳🇱',
      'Other': '🌍'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="admin-content-area">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>📈 Site Analytics Dashboard</h3>
        <Button variant="outline-light" onClick={loadAnalytics} className="admin-btn">
          🔄 Refresh Data
        </Button>
      </div>

      {/* Main Statistics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-visitors">
            <Card.Body className="text-center">
              <div className="stat-icon">👥</div>
              <h3>{formatNumber(analytics.visitors.today)}</h3>
              <p>Today's Visitors</p>
              <small className="text-muted">
                Week: {formatNumber(analytics.visitors.week)} | 
                Month: {formatNumber(analytics.visitors.month)}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-projects">
            <Card.Body className="text-center">
              <div className="stat-icon">👁️</div>
              <h3>{formatNumber(analytics.pageViews.today)}</h3>
              <p>Page Views Today</p>
              <small className="text-muted">
                Week: {formatNumber(analytics.pageViews.week)} | 
                Month: {formatNumber(analytics.pageViews.month)}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-contacts">
            <Card.Body className="text-center">
              <div className="stat-icon">📊</div>
              <h3>{formatNumber(analytics.visitors.total)}</h3>
              <p>Total Visitors</p>
              <small className="text-muted">
                All time visits
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-users">
            <Card.Body className="text-center">
              <div className="stat-icon">⚡</div>
              <h3>{formatNumber(analytics.pageViews.total)}</h3>
              <p>Total Page Views</p>
              <small className="text-muted">
                All time views
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Top Pages */}
        <Col lg={6} className="mb-4">
          <Card className="analytics-card">
            <Card.Header>
              <h5>📄 Top Pages This Month</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table size="sm" className="admin-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Views</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topPages.map((page, index) => (
                      <tr key={index}>
                        <td>
                          <code>{page.path}</code>
                        </td>
                        <td>{formatNumber(page.views)}</td>
                        <td>
                          <Badge bg="info">{page.percentage}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Visitors */}
        <Col lg={6} className="mb-4">
          <Card className="analytics-card">
            <Card.Header>
              <h5>🕐 Recent Visitors</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {analytics.recentVisitors.map((visitor, index) => (
                  <div key={index} className="visitor-item mb-2 p-2 border rounded">
                    <div className="d-flex justify-content-between align-items-start flex-column flex-sm-row">
                      <div className="mb-2 mb-sm-0">
                        <strong>{visitor.page}</strong>
                        <br />
                        <small>
                          {getCountryFlag(visitor.country)} {visitor.country} • 
                          {getDeviceIcon(visitor.device)} {visitor.device} • 
                          {getBrowserIcon(visitor.browser)} {visitor.browser}
                        </small>
                      </div>
                      <small className="text-muted">
                        {formatDate(visitor.timestamp)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Device Breakdown */}
        <Col lg={4} md={6} className="mb-4">
          <Card className="analytics-card">
            <Card.Header>
              <h5>📱 Device Types</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(analytics.devices).map(([device, count]) => (
                <div key={device} className="d-flex justify-content-between align-items-center mb-2">
                  <span>
                    {getDeviceIcon(device)} {device}
                  </span>
                  <Badge bg="primary">{formatNumber(count)}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Browser Stats */}
        <Col lg={4} md={6} className="mb-4">
          <Card className="analytics-card">
            <Card.Header>
              <h5>🌐 Browsers</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(analytics.browsers).map(([browser, count]) => (
                <div key={browser} className="d-flex justify-content-between align-items-center mb-2">
                  <span>
                    {getBrowserIcon(browser)} {browser}
                  </span>
                  <Badge bg="success">{formatNumber(count)}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Countries */}
        <Col lg={4} md={12} className="mb-4">
          <Card className="analytics-card">
            <Card.Header>
              <h5>🌍 Top Countries</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(analytics.countries).map(([country, count]) => (
                <div key={country} className="d-flex justify-content-between align-items-center mb-2">
                  <span>
                    {getCountryFlag(country)} {country}
                  </span>
                  <Badge bg="warning">{formatNumber(count)}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analytics Note */}
      <Alert variant="info">
        <strong>📊 Analytics Note:</strong> This is demo analytics data. In a production environment, 
        you would integrate with Google Analytics, Adobe Analytics, or a custom tracking solution 
        to get real visitor data and insights.
      </Alert>
    </div>
  );
};

export default SiteAnalytics;