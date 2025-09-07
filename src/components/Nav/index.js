import React, { useState, useEffect, useCallback } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Modal, Badge } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css'; 
import { useNotifications } from '../../App';
import EmailVerification from '../EmailVerification';
import { UserManager, validateEmail as validateEmailUtil, checkPasswordStrength, canUserLogin, markEmailVerified } from '../../utils/userValidation';

function Navigation(props) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [themeAnnounce, setThemeAnnounce] = useState('');
    
    // Notifications state
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifAnnounce, setNotifAnnounce] = useState('');
    const { showNotification, notifications: globalNotifications, dismissNotification, dismissAllNotifications } = useNotifications();
    
    // Filter notifications
    const activeNotifications = globalNotifications.filter(n => {
      const oneHour = 60 * 60 * 1000;
      return (Date.now() - n.createdAt) < oneHour;
    });
    
    // Count unread notifications
    const tenMinutes = 10 * 60 * 1000;
    const unreadCount = activeNotifications.filter(n => 
      (Date.now() - n.createdAt) < tenMinutes
    ).length;

    // Auth state
    const [authToken, setAuthToken] = useState(() => { 
      try { return localStorage.getItem('nebula_auth_token') || null; 
      } catch { return null; } 
    });
    const [authUser, setAuthUser] = useState(() => { 
      try { 
        const stored = localStorage.getItem('nebula_auth_user');
        return stored ? JSON.parse(stored) : null;
      } catch { return null; } 
    });
    
    // Authentication modal states
    const [showLogin, setShowLogin] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [loginBusy, setLoginBusy] = useState(false);
    const [loginMsg, setLoginMsg] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    
    // Email verification modal
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    
    // Authentication form data
    const [authData, setAuthData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      acceptTerms: false
    });

    // Theme management
    const [appliedTheme, setAppliedTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        const userPref = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', userPref);
        return userPref;
      } catch {
        return 'light';
      }
    });

    const [isSticky, setIsSticky] = useState(false);

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to disable/enable scroll when modal is open
  useEffect(() => {
    if (showLogin || showEmailVerification) {
      // Get current scroll position
      const scrollY = window.scrollY;
      
      // Disable scroll with more aggressive approach
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Store scroll position
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Re-enable scroll and restore position
      const scrollY = document.body.getAttribute('data-scroll-y');
      
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
      
      document.body.removeAttribute('data-scroll-y');
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
      document.body.removeAttribute('data-scroll-y');
    };
  }, [showLogin, showEmailVerification]);    // Handle auth form changes
    const handleAuthChange = (field, value) => {
      setAuthData(prev => ({ ...prev, [field]: value }));
      setLoginMsg('');
    };

    // Reset auth form
    const resetAuthForm = () => {
      setAuthData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        acceptTerms: false
      });
      setLoginMsg('');
      setLoginBusy(false);
    };

    // Authentication handler
    const handleAuth = async () => {
      if (loginBusy) return;
      
      setLoginBusy(true);
      setLoginMsg('');

      try {
        // Basic validation
        if (!authData.email || !authData.password) {
          setLoginMsg('Please fill in all required fields');
          setLoginBusy(false);
          return;
        }

        if (!validateEmailUtil(authData.email)) {
          setLoginMsg('Please enter a valid email address');
          setLoginBusy(false);
          return;
        }

        if (authMode === 'signup') {
          // Signup validation
          if (!authData.name || authData.name.trim().length < 2) {
            setLoginMsg('Name must be at least 2 characters long');
            setLoginBusy(false);
            return;
          }

          if (authData.password !== authData.confirmPassword) {
            setLoginMsg('Passwords do not match');
            setLoginBusy(false);
            return;
          }

          const passwordStrength = checkPasswordStrength(authData.password);
          if (passwordStrength.score < 3) {
            setLoginMsg(`Password too weak: ${passwordStrength.feedback.join(', ')}`);
            setLoginBusy(false);
            return;
          }

          if (!authData.acceptTerms) {
            setLoginMsg('Please accept the terms and conditions');
            setLoginBusy(false);
            return;
          }

          // Create new user
          const newUser = UserManager.createUser({
            email: authData.email,
            password: authData.password,
            name: authData.name.trim(),
            emailVerified: false
          });

          if (!newUser) {
            setLoginMsg('User already exists with this email');
            setLoginBusy(false);
            return;
          }

          // Set pending user for email verification
          setPendingUser(newUser);
          
          // Show email verification modal
          setShowEmailVerification(true);
          setShowLogin(false);
          
          showNotification('Account created! Please verify your email to continue.', 'info', 5000, {
            category: 'account',
            icon: '📧'
          });

        } else {
          // Login - Check admin credentials first
          const adminCredentials = [
            { email: 'admin@colin-nebula.com', password: 'admin123' },
            { email: 'colin@nebula.com', password: 'admin' },
            { email: 'colin@admin.com', password: 'colinadmin' }
          ];

          // Check if it's an admin login
          const adminMatch = adminCredentials.find(
            admin => admin.email.toLowerCase() === authData.email.toLowerCase() && 
                    admin.password === authData.password
          );

          // Check for any email containing "admin" with password "admin123"
          const isAdminEmail = authData.email.toLowerCase().includes('admin') && 
                              authData.password === 'admin123';

          if (adminMatch || isAdminEmail) {
            // Admin login successful
            const adminUser = {
              id: 'admin-' + Date.now(),
              email: authData.email,
              name: 'Administrator',
              emailVerified: true,
              validationLevel: 3,
              isAdmin: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };

            setAuthUser(adminUser);
            setAuthToken('admin-token-' + Date.now());
            
            if (rememberMe) {
              localStorage.setItem('authToken', 'admin-token-' + Date.now());
              localStorage.setItem('authUser', JSON.stringify(adminUser));
            }

            showNotification('Welcome back, Administrator! 👑', 'success', 5000, {
              category: 'admin',
              icon: '👑'
            });

            setShowLogin(false);
            resetAuthForm();
            setLoginBusy(false);
            return;
          }

          // Regular user login
          const loginResult = UserManager.login(authData.email, authData.password);
          
          if (!loginResult.success) {
            setLoginMsg(loginResult.message);
            setLoginBusy(false);
            return;
          }

          const user = loginResult.user;
          
          // Check if user can login
          const loginCheck = canUserLogin(user);
          if (!loginCheck.canLogin) {
            setLoginMsg(loginCheck.reason);
            setLoginBusy(false);
            return;
          }

          // Successful login
          setAuthToken('demo-token-' + Date.now());
          setAuthUser(user);
          
          if (rememberMe) {
            localStorage.setItem('nebula_auth_token', 'demo-token-' + Date.now());
            localStorage.setItem('nebula_auth_user', JSON.stringify(user));
          }

          // Reset form and close modal
          resetAuthForm();
          setShowLogin(false);
          
          const welcomeMessage = `Welcome back, ${user.name}!`;
          showNotification(welcomeMessage, 'success', 4000, {
            category: 'account',
            icon: '👋'
          });
        }
        
        setLoginBusy(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setLoginMsg('An error occurred. Please try again.');
        setLoginBusy(false);
      }
    };

    // Handle email verification completion
    const handleVerificationComplete = (success) => {
      if (success && pendingUser) {
        // Mark email as verified
        const verifiedUser = markEmailVerified(pendingUser);
        UserManager.updateUser(verifiedUser);
        
        // Auto-login after verification
        setAuthToken('demo-token-' + Date.now());
        setAuthUser(verifiedUser);
        
        if (rememberMe) {
          localStorage.setItem('nebula_auth_token', 'demo-token-' + Date.now());
          localStorage.setItem('nebula_auth_user', JSON.stringify(verifiedUser));
        }
        
        showNotification(`Welcome, ${verifiedUser.name}! Your email has been verified and you're now logged in.`, 'success', 5000, {
          category: 'account',
          icon: '🎉'
        });
        
        setPendingUser(null);
      }
      
      setShowEmailVerification(false);
    };

    // Logout handler
    const handleLogout = () => {
      setAuthToken(null);
      setAuthUser(null);
      localStorage.removeItem('nebula_auth_token');
      localStorage.removeItem('nebula_auth_user');
      
      showNotification('You have been logged out successfully', 'info', 3000, {
        category: 'account',
        icon: '👋'
      });
      
      navigate('/');
    };

    // Theme toggle
    const toggleTheme = useCallback(() => {
      const newTheme = appliedTheme === 'light' ? 'dark' : 'light';
      setAppliedTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      
      try {
        localStorage.setItem('nebula_theme', newTheme);
      } catch (error) {
        console.warn('Could not save theme preference:', error);
      }
      
      const announcement = `Theme switched to ${newTheme} mode`;
      setThemeAnnounce(announcement);
      setTimeout(() => setThemeAnnounce(''), 1000);
      
      showNotification(announcement, 'info', 2000, {
        category: 'system',
        icon: newTheme === 'dark' ? '🌙' : '☀️'
      });
    }, [appliedTheme, showNotification]);

    // Close mobile nav when a link is clicked
    const handleNavClick = () => {
      setExpanded(false);
    };
    return (
      <>
        <Navbar
          expanded={expanded}
          onToggle={setExpanded}
          bg={appliedTheme === 'light' ? 'light' : 'dark'}
          expand="md"
          variant={appliedTheme === 'light' ? 'light' : 'dark'}
          sticky="top"
          collapseOnSelect
          role="navigation"
          aria-label="Main navigation"
          className={isSticky ? 'navbar navbar-scrolled' : 'navbar'}
          style={{
            boxShadow: isSticky ? '0 8px 24px rgba(0,0,0,0.20)' : 'none',
            paddingTop: isSticky ? 6 : undefined,
            paddingBottom: isSticky ? 6 : undefined,
            backgroundColor: appliedTheme === 'light' ? '#f8f9fa' : '#212529',
            borderBottom: appliedTheme === 'light' ? '1px solid #dee2e6' : '1px solid #495057'
          }}
        >
          <Container>
            <Navbar.Brand as={Link} to="/" style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef' }}>
              <img src={logoM} width="90px" height="40px" alt="logo" className="nav-logo" />
              Colin Nebula 3D 
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" />
            <Navbar.Collapse id="basic-navbar-nav" aria-label="Primary">
              <Nav className="ms-auto">
                <Nav.Link as={NavLink} to="/" onClick={handleNavClick} style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '2px' }}>
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/portfolio" onClick={handleNavClick} style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '2px' }}>
                  Portfolio
                </Nav.Link>
                <Nav.Link as={NavLink} to="/video-editing" onClick={handleNavClick} style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '2px' }}>
                  Video
                </Nav.Link>
                <Nav.Link as={NavLink} to="/artwork" onClick={handleNavClick} style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '2px' }}>
                  Artwork
                </Nav.Link>
                <Nav.Link as={NavLink} to="/animation" onClick={handleNavClick} style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '2px' }}>
                  Animation
                </Nav.Link>

                {/* More Dropdown */}
                <NavDropdown
                  title={
                    <span style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef' }}>
                      📋 More
                    </span>
                  }
                  id="more-dropdown"
                  align="end"
                  style={{ marginRight: '2px' }}
                >
                  <NavDropdown.Item 
                    onClick={() => {
                      navigate('/about');
                      handleNavClick();
                    }}
                  >
                    👤 About
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    onClick={() => {
                      navigate('/resume');
                      handleNavClick();
                    }}
                  >
                    📄 Resume
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    onClick={() => {
                      navigate('/contact');
                      handleNavClick();
                    }}
                  >
                    📧 Contact
                  </NavDropdown.Item>
                </NavDropdown>

                {/* Notifications/More Dropdown */}
                <NavDropdown
                  title={
                    <span style={{ position: 'relative', color: appliedTheme === 'light' ? '#212529' : '#e9ecef' }}>
                      🔔
                      {unreadCount > 0 && (
                        <Badge
                          bg="danger"
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            fontSize: '0.75rem',
                            minWidth: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </span>
                  }
                  id="notifications-dropdown"
                  show={showNotifications}
                  onToggle={(isOpen) => {
                    setShowNotifications(isOpen);
                    if (isOpen) {
                      setNotifAnnounce(`${activeNotifications.length} notifications available`);
                      setTimeout(() => setNotifAnnounce(''), 3000);
                    }
                  }}
                  align="end"
                  style={{ marginRight: '2px' }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong>Notifications ({activeNotifications.length})</strong>
                      {activeNotifications.length > 0 && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            dismissAllNotifications();
                            setShowNotifications(false);
                          }}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>

                  {activeNotifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔕</div>
                      <div>No notifications</div>
                      <div style={{ fontSize: '0.875rem' }}>You're all caught up!</div>
                    </div>
                  ) : (
                    activeNotifications.slice(0, 5).map(notification => (
                      <NavDropdown.Item key={notification.id} style={{ whiteSpace: 'normal' }}>
                        <div style={{ fontSize: '0.9rem' }}>
                          <span style={{ marginRight: '6px' }}>{notification.icon || '📋'}</span>
                          {notification.message}
                        </div>
                        <small style={{ color: '#6c757d' }}>
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </small>
                      </NavDropdown.Item>
                    ))
                  )}
                  
                  <NavDropdown.Divider />
                  
                  {/* Updates Section */}
                  <div style={{ padding: '8px 16px', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#495057' }}>📈 Updates</strong>
                  </div>
                  <NavDropdown.Item>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>🎨</span>
                      Portfolio v2.5 - New animations added
                    </div>
                    <small style={{ color: '#6c757d' }}>2 hours ago</small>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>🔒</span>
                      Enhanced security features deployed
                    </div>
                    <small style={{ color: '#6c757d' }}>1 day ago</small>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>🌙</span>
                      Dark mode improvements released
                    </div>
                    <small style={{ color: '#6c757d' }}>3 days ago</small>
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  {/* Accounts Section */}
                  <div style={{ padding: '8px 16px', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#495057' }}>👥 Accounts</strong>
                  </div>
                  <NavDropdown.Item>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>✅</span>
                      Email verification completed
                    </div>
                    <small style={{ color: '#6c757d' }}>Just now</small>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>🔐</span>
                      Password updated successfully
                    </div>
                    <small style={{ color: '#6c757d' }}>2 days ago</small>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>🆙</span>
                      Account validation level increased
                    </div>
                    <small style={{ color: '#6c757d' }}>1 week ago</small>
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  
                  {/* Action Items */}
                  <NavDropdown.Item 
                    onClick={() => {
                      showNotification('Test notification from nav!', 'info', 3000, {
                        category: 'system',
                        icon: '🧪'
                      });
                      setShowNotifications(false);
                    }}
                  >
                    🧪 Test Notification
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    onClick={() => {
                      showNotification('Portfolio update available! New features added.', 'info', 5000, {
                        category: 'updates',
                        icon: '📈'
                      });
                      setShowNotifications(false);
                    }}
                  >
                    📈 Check for Updates
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    onClick={() => {
                      showNotification('Account settings reviewed successfully.', 'success', 3000, {
                        category: 'accounts',
                        icon: '👥'
                      });
                      setShowNotifications(false);
                    }}
                  >
                    👥 Account Settings
                  </NavDropdown.Item>
                </NavDropdown>

                {/* Auth Section */}
                {authUser ? (
                  <NavDropdown
                    title={`👤 ${authUser.name}`}
                    id="user-dropdown"
                    align="end"
                    style={{ marginRight: '2px' }}
                  >
                    <NavDropdown.Item>
                      <div style={{ padding: '8px 0' }}>
                        <div><strong>{authUser.name}</strong></div>
                        <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>{authUser.email}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                          Level {authUser.validationLevel} • {authUser.emailVerified ? '✅ Verified' : '❌ Unverified'}
                        </div>
                      </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      🚪 Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link
                    onClick={() => {
                      setAuthMode('login');
                      setShowLogin(true);
                      handleNavClick();
                    }}
                    style={{ cursor: 'pointer', color: appliedTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '2px' }}
                  >
                    👤 Login
                  </Nav.Link>
                )}

                {/* Theme Toggle */}
                <Nav.Link
                  onClick={toggleTheme}
                  style={{
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.5rem',
                    color: appliedTheme === 'light' ? '#212529' : '#e9ecef',
                    marginRight: '2px'
                  }}
                  aria-label={`Switch to ${appliedTheme === 'light' ? 'dark' : 'light'} theme`}
                  title={`Switch to ${appliedTheme === 'light' ? 'dark' : 'light'} theme`}
                >
                  {appliedTheme === 'light' ? '🌙' : '☀️'}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {themeAnnounce && <span>{themeAnnounce}</span>}
          {notifAnnounce && <span>{notifAnnounce}</span>}
        </div>

        {/* Authentication Modal */}
        <Modal 
          show={showLogin} 
          onHide={() => setShowLogin(false)} 
          centered
          backdrop="static"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0.375rem'
          }}>
            <Modal.Header closeButton style={{ 
              backgroundColor: appliedTheme === 'light' ? '#ffffff' : '#343a40',
              color: appliedTheme === 'light' ? '#212529' : '#ffffff',
              borderBottom: `1px solid ${appliedTheme === 'light' ? '#dee2e6' : '#495057'}`
            }}>
              <Modal.Title>{authMode === 'login' ? 'Login' : 'Sign Up'}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ 
              backgroundColor: appliedTheme === 'light' ? '#ffffff' : '#343a40',
              color: appliedTheme === 'light' ? '#212529' : '#ffffff'
            }}>
            <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
              {authMode === 'signup' && (
                <div className="mb-3">
                  <label htmlFor="auth-name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="auth-name"
                    value={authData.name}
                    onChange={(e) => handleAuthChange('name', e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="auth-email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="auth-email"
                  value={authData.email}
                  onChange={(e) => handleAuthChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="auth-password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="auth-password"
                  value={authData.password}
                  onChange={(e) => handleAuthChange('password', e.target.value)}
                  required
                />
              </div>
              
              {authMode === 'signup' && (
                <div className="mb-3">
                  <label htmlFor="auth-confirm-password" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="auth-confirm-password"
                    value={authData.confirmPassword}
                    onChange={(e) => handleAuthChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              )}

              {authMode === 'login' && (
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
              )}

              {authMode === 'login' && (
                <div className="mb-3 text-end">
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    style={{ fontSize: '0.875rem' }}
                    onClick={() => {
                      showNotification('Password reset link sent to your email!', 'info', 5000, {
                        category: 'accounts',
                        icon: '📧'
                      });
                      setShowLogin(false);
                    }}
                  >
                    🔑 Forgot Password?
                  </Button>
                </div>
              )}

              {authMode === 'signup' && (
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="accept-terms"
                    checked={authData.acceptTerms}
                    onChange={(e) => handleAuthChange('acceptTerms', e.target.checked)}
                    required
                  />
                  <label className="form-check-label" htmlFor="accept-terms">
                    I accept the terms and conditions
                  </label>
                </div>
              )}

              {loginMsg && (
                <div className="alert alert-danger" role="alert">
                  {loginMsg}
                </div>
              )}

              <div className="d-grid gap-2">
                <Button type="submit" variant="primary" disabled={loginBusy}>
                  {loginBusy ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Sign Up')}
                </Button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer style={{ 
            backgroundColor: appliedTheme === 'light' ? '#ffffff' : '#343a40',
            color: appliedTheme === 'light' ? '#212529' : '#ffffff',
            borderTop: `1px solid ${appliedTheme === 'light' ? '#dee2e6' : '#495057'}`
          }}>
            <div className="w-100 text-center">
              {authMode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => {
                      setAuthMode('signup');
                      resetAuthForm();
                    }}
                  >
                    Sign up here
                  </Button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => {
                      setAuthMode('login');
                      resetAuthForm();
                    }}
                  >
                    Login here
                  </Button>
                </span>
              )}
            </div>
          </Modal.Footer>
          </div>
        </Modal>

        {/* Email Verification Modal */}
        {showEmailVerification && pendingUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <EmailVerification
              show={showEmailVerification}
              onHide={() => setShowEmailVerification(false)}
              email={pendingUser.email}
              onVerificationComplete={handleVerificationComplete}
            />
          </div>
        )}
      </>
    );
}

export default Navigation;

