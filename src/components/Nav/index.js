import React, { useEffect, useState, useCallback } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Modal } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css'; 
import { useNotifications } from '../../App';

function Navigation(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [themeAnnounce, setThemeAnnounce] = useState('');
    
    // Simplified notifications state
    const [notifications, setNotifications] = useState(() => {
      try { 
        const stored = JSON.parse(localStorage.getItem('nebula_notifications') || '[]');
        return stored.map(n => ({
          ...n,
          priority: n.priority || 'normal',
          read: !!n.read,
          expires: n.expires || null
        }));
      } catch { 
        return []; 
      }
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifAnnounce, setNotifAnnounce] = useState('');
    const { showNotification } = useNotifications();
    
    // Filter out expired notifications
    const activeNotifications = notifications.filter(n => 
      !n.expires || new Date(n.expires) > new Date()
    );
    
    // Count unread notifications
    const unreadCount = activeNotifications.filter(n => !n.read).length;

    // Notification categories
    const notificationCategories = ['all', 'system', 'account', 'updates'];
    const [notifCategory, setNotifCategory] = useState('all');
    const [expandedNotifs, setExpandedNotifs] = useState(false);
    
    // Simplified auth state
    const [authToken, setAuthToken] = useState(() => { 
      try { return localStorage.getItem('nebula_auth_token') || null; 
      } catch { return null; } 
    });
    const [authUser, setAuthUser] = useState(() => { 
      try { return JSON.parse(localStorage.getItem('nebula_auth_user') || 'null'); 
      } catch { return null; } 
    });
    
    const [showLogin, setShowLogin] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginBusy, setLoginBusy] = useState(false);
    const [loginMsg, setLoginMsg] = useState('');
    const [loginErrors, setLoginErrors] = useState([]);
    const [loginValid, setLoginValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    
    // is the user an administrator?
    const isAdmin = authUser && (authUser.isAdmin || authUser.admin);

    // disable page scroll when login modal is open
    useEffect(() => {
      try {
        document.body.style.overflow = showLogin ? 'hidden' : '';
      } catch (e) {}
      return () => { try { document.body.style.overflow = ''; } catch (e) {} };
    }, [showLogin]);

    // simple validation: email format and password length
    useEffect(() => {
      const errs = [];
      const email = (loginEmail || '').trim();
      if (!email) errs.push('Email is required');
      else if (!/\S+@\S+\.\S+/.test(email)) errs.push('Enter a valid email');
      if (!loginPassword || loginPassword.length < 6) errs.push('Password must be at least 6 characters');
      setLoginErrors(errs);
      setLoginValid(errs.length === 0);
    }, [loginEmail, loginPassword]);
    
    // Persist auth state and notifications to localStorage
    useEffect(() => {
      try {
        if (authToken) localStorage.setItem('nebula_auth_token', authToken);
        else localStorage.removeItem('nebula_auth_token');
        if (authUser) localStorage.setItem('nebula_auth_user', JSON.stringify(authUser));
        else localStorage.removeItem('nebula_auth_user');
      } catch (e) {}
    }, [authToken, authUser]);
 
    useEffect(() => {
      try { localStorage.setItem('nebula_notifications', JSON.stringify(notifications)); } catch (e) {}
    }, [notifications]);
    
    // Mark specific notification as read
    const markAsRead = (notificationId) => {
      setNotifications(currentNotifications => 
        currentNotifications.map(n => 
          n.id === notificationId ? {...n, read: true} : n
        )
      );
    };
    
    // Mark all notifications as read
    const markAllRead = () => {
      setNotifications(currentNotifications => 
        currentNotifications.map(n => ({...n, read: true}))
      );
      setNotifAnnounce('All notifications marked as read');
      setTimeout(() => setNotifAnnounce(''), 1200);
    };
    
    // Clear all notifications
    const clearNotifications = () => {
      setNotifications([]);
      setNotifAnnounce('All notifications cleared');
      setTimeout(() => setNotifAnnounce(''), 1200);
    };
    
    // Delete specific notification
    const deleteNotification = (notificationId) => {
      setNotifications(currentNotifications => 
        currentNotifications.filter(n => n.id !== notificationId)
      );
    };
    
    // Filter notifications based on category
    const filteredNotifications = activeNotifications.filter(n => 
      notifCategory === 'all' || n.category === notifCategory
    );
    
    // Render individual notification item
    const renderNotificationItem = (notification) => {
      return (
        <li 
          key={notification.id} 
          className={`notification-item ${notification.read ? 'read' : 'unread'} priority-${notification.priority}`}
        >
          <div className="notification-content">
            {notification.icon && <div className="notification-icon">{notification.icon}</div>}
            <div className="notification-text">{notification.text}</div>
            <div className="notification-time">
              {new Date(notification.ts).toLocaleString()}
            </div>
          </div>
          <div className="notification-actions">
            <button 
              className="btn btn-sm btn-outline-secondary rounded-pill"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
              title="Mark as read"
              aria-label="Mark as read"
              disabled={notification.read}
            >
              ✓
            </button>
            <button 
              className="btn btn-sm btn-outline-danger rounded-pill"
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
              }}
              title="Delete notification"
              aria-label="Delete notification"
            >
              ×
            </button>
          </div>
        </li>
      );
    };

    // logout helper
    const logout = () => {
      try {
        setAuthToken(null);
        setAuthUser(null);
        localStorage.removeItem('nebula_auth_token');
        localStorage.removeItem('nebula_auth_user');
        setShowLogin(false);
        setNotifAnnounce('Logged out');
        setTimeout(() => setNotifAnnounce(''), 1000);
      } catch (e) {}
    };

    // login helper
    const login = async () => {
      if (!loginValid) {
        setLoginMsg('Please fix the highlighted errors');
        return;
      }
      
      try {
        setLoginBusy(true);
        setLoginMsg('');
        
        // Mock login for demo purposes
        setTimeout(() => {
          setAuthToken('demo-token');
          setAuthUser({ 
            username: loginEmail, 
            name: loginEmail.split('@')[0],
            isAdmin: loginEmail.includes('admin')
          });
          
          if (rememberMe) {
            localStorage.setItem('nebula_auth_token', 'demo-token');
            localStorage.setItem('nebula_auth_user', JSON.stringify({ 
              username: loginEmail, 
              name: loginEmail.split('@')[0],
              isAdmin: loginEmail.includes('admin')
            }));
          }
          
          setShowLogin(false);
          setLoginEmail('');
          setLoginPassword('');
          setLoginMsg('');
          setNotifAnnounce('Logged in');
          setTimeout(() => setNotifAnnounce(''), 1000);
          setLoginBusy(false);
        }, 800);
        
      } catch (e) {
        setLoginMsg('Network error during login');
        setLoginBusy(false);
      }
    };

    // initialize theme preference
    const [theme, setTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        if (saved) return saved;
        return 'auto';
      } catch (e) { return 'auto'; }
    });

    // appliedTheme is the actual mode ('light'|'dark') currently in effect
    const [appliedTheme, setAppliedTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        if (saved && saved !== 'auto') return saved;
        if (typeof window !== 'undefined' && window.matchMedia) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
      } catch (e) {}
      return 'dark';
    });
    
    // respect reduced-motion preference for transitions
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // sticky header state
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const onScroll = () => setIsSticky(window.scrollY > 10);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // apply theme (supports 'auto' which follows system preference)
    useEffect(() => {
      let mq;
      const apply = (mode) => {
        try {
          if (!prefersReducedMotion) {
            try { document.documentElement.classList.add('theme-transition'); } catch(e){}
            setTimeout(() => { try { document.documentElement.classList.remove('theme-transition'); } catch(e){} }, 240);
          }
          document.body.classList.remove('theme-light', 'theme-dark');
          document.body.classList.add(mode === 'light' ? 'theme-light' : 'theme-dark');
          document.documentElement.setAttribute('data-theme', mode);
          setAppliedTheme(mode);
          setThemeAnnounce(`${mode === 'light' ? 'Light' : 'Dark'} theme active${theme === 'auto' ? ' (auto)' : ''}`);
        } catch (e) {}
      };

      if (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
        mq = window.matchMedia('(prefers-color-scheme: dark)');
        apply(mq.matches ? 'dark' : 'light');
        const onChange = (ev) => apply(ev.matches ? 'dark' : 'light');
        try { mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange); } catch (e) {}
        try { localStorage.setItem('nebula_theme', 'auto'); } catch (e) {}
        const t = setTimeout(() => setThemeAnnounce(''), 1200);
        return () => { try { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); } catch(e){}; clearTimeout(t); };
      } else {
        apply(theme === 'light' ? 'light' : 'dark');
        try { localStorage.setItem('nebula_theme', theme); } catch (e) {}
        const t = setTimeout(() => setThemeAnnounce(''), 1200);
        return () => clearTimeout(t);
      }
    }, [theme, prefersReducedMotion]);

    // cycle theme: light -> dark -> auto -> light
    const toggleTheme = useCallback(() => {
      setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light');
    }, []);
    
    // keyboard shortcut: 't' toggles theme (ignore typing in inputs)
    useEffect(() => {
      const handler = (e) => {
        if (!e.key) return;
        if (e.key.toLowerCase() !== 't') return;
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
        toggleTheme();
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [toggleTheme]);

    // Navigate to account page
    const navigateToAccount = () => {
      setShowNotifications(false);
      navigate('/account');
      showNotification('Navigating to account settings', 'info', 2000);
    };

    // Navigate to updates page
    const navigateToUpdates = () => {
      setShowNotifications(false);
      navigate('/updates');
      showNotification('Navigating to updates', 'info', 2000);
    };

    // Handle system notifications
    const handleSystemNotifications = () => {
      setShowNotifications(false);
      showNotification('System notifications settings opened', 'info', 3000);
    };

    return (
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
          transition: prefersReducedMotion ? 'none' : 'box-shadow 200ms, padding 200ms, background-color 200ms',
          boxShadow: isSticky ? '0 8px 24px rgba(0,0,0,0.20)' : 'none',
          paddingTop: isSticky ? 6 : undefined,
          paddingBottom: isSticky ? 6 : undefined,
          backgroundColor: appliedTheme === 'light' ? '#f8f9fa' : '#212529',
          borderBottom: appliedTheme === 'light' ? '1px solid #dee2e6' : '1px solid #495057'
        }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ color: appliedTheme === 'light' ? '#212529' : '#ffffff' }}>
            <img src={logoM} width="90px" height="40px" alt="logo" />
            Colin Nebula 3D 
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" />
          <Navbar.Collapse id="basic-navbar-nav" aria-label="Primary">
            <Nav className="ms-auto">
              <Nav.Link 
                as={NavLink} 
                to="/"
                className={({isActive}) => isActive ? "mx-2 navActive" : "mx-2"}
                style={{ color: appliedTheme === 'light' ? '#212529' : '#ffffff' }}
                end
              >
                Home
              </Nav.Link>

              <Nav.Link 
                as={NavLink} 
                to="/portfolio"
                className={({isActive}) => isActive ? "mx-2 navActive" : "mx-2"}
                style={{ color: appliedTheme === 'light' ? '#212529' : '#ffffff' }}
              >
                Portfolio
              </Nav.Link>

              <Nav.Link 
                as={NavLink} 
                to="/artwork"
                className={({isActive}) => isActive ? "mx-2 navActive" : "mx-2"}
                style={{ color: appliedTheme === 'light' ? '#212529' : '#ffffff' }}
              >
                Artwork
              </Nav.Link>

              <Nav.Link 
                as={NavLink} 
                to="/animation"
                className={({isActive}) => isActive ? "mx-2 navActive" : "mx-2"}
                style={{ color: appliedTheme === 'light' ? '#212529' : '#ffffff' }}
              >
                Animation
              </Nav.Link>

              <Nav.Link 
                as={NavLink} 
                to="/video-editing"
                className={({isActive}) => isActive ? "mx-2 navActive" : "mx-2"}
                style={{ color: appliedTheme === 'light' ? '#212529' : '#ffffff' }}
              >
                VFX
              </Nav.Link>

              <NavDropdown 
                title="More" 
                id="nav-more" 
                align="end" 
                menuVariant={appliedTheme === 'light' ? 'light' : 'dark'} 
                aria-label="More links"
              >
                <NavDropdown.Item as={Link} to="/privacy-policy">Privacy Policy</NavDropdown.Item>
                <NavDropdown.Item href="mailto:colinnebula@gmail.com" title="Email Colin">Contact</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/resume" title="View Resume">Resume</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="https://github.com/ColinNebula" target="_blank" rel="noopener noreferrer" title="Open GitHub">GitHub</NavDropdown.Item>
              </NavDropdown>
 
              <div className="mx-2" style={{ display: 'flex', alignItems: 'center' }}>
                {/* Notifications bell */}
                <div className="notification-dropdown">
                  <button
                    className="notification-bell-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                    aria-label={`Notifications (${unreadCount} unread)`}
                    aria-expanded={showNotifications}
                    aria-controls="notification-panel"
                    style={{
                      background: 'transparent',
                      border: `1px solid ${appliedTheme === 'light' ? '#6c757d' : '#adb5bd'}`,
                      color: appliedTheme === 'light' ? '#212529' : '#ffffff',
                      borderRadius: '20px',
                      padding: '6px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    <span className={`notification-icon ${unreadCount > 0 ? 'has-unread' : ''}`}>
                      🔔
                    </span>
                    {unreadCount > 0 && (
                      <span className="notification-badge" aria-hidden="true">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div 
                      id="notification-panel" 
                      className={`notification-panel ${expandedNotifs ? 'expanded' : ''}`}
                      role="dialog"
                      aria-label="Notifications"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        width: '320px',
                        maxHeight: '400px',
                        backgroundColor: appliedTheme === 'light' ? '#ffffff' : '#343a40',
                        color: appliedTheme === 'light' ? '#212529' : '#ffffff',
                        border: `1px solid ${appliedTheme === 'light' ? '#dee2e6' : '#495057'}`,
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1050,
                        overflow: 'hidden'
                      }}
                    >
                      <div className="notification-header">
                        <h3>Notifications</h3>
                        <div className="notification-actions">
                          <Button
                            variant="link"
                            className="p-0 me-2 btn-updates-link rounded-pill"
                            onClick={navigateToUpdates}
                            title="View all updates"
                            style={{ 
                              color: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              textDecoration: 'none'
                            }}
                          >
                            📈 Updates
                          </Button>
                          <Button
                            variant="link"
                            className="p-0 me-2 btn-account-link rounded-pill"
                            onClick={navigateToAccount}
                            title="Go to account settings"
                            style={{ 
                              color: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              textDecoration: 'none'
                            }}
                          >
                            👤 Account
                          </Button>
                          <Button
                            variant="link"
                            className="p-0 me-2 btn-system-link rounded-pill"
                            onClick={handleSystemNotifications}
                            title="System notification settings"
                            style={{ 
                              color: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              textDecoration: 'none'
                            }}
                          >
                            ⚙️ System
                          </Button>
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                            onClick={() => setShowNotifications(false)}
                            aria-label="Close notifications"
                            style={{
                              borderColor: appliedTheme === 'light' ? '#6c757d' : '#adb5bd',
                              color: appliedTheme === 'light' ? '#6c757d' : '#adb5bd'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      
                      <div className="notification-controls">
                        <div className="notification-categories">
                          {notificationCategories.map(category => (
                            <button
                              key={category}
                              className={`category-btn rounded-pill ${notifCategory === category ? 'active' : ''}`}
                              onClick={() => setNotifCategory(category)}
                              aria-pressed={notifCategory === category}
                              style={{
                                backgroundColor: notifCategory === category 
                                  ? (appliedTheme === 'light' ? '#0d6efd' : '#0a58ca')
                                  : 'transparent',
                                color: notifCategory === category 
                                  ? '#ffffff'
                                  : (appliedTheme === 'light' ? '#212529' : '#ffffff'),
                                border: `1px solid ${appliedTheme === 'light' ? '#dee2e6' : '#495057'}`,
                                padding: '0.25rem 0.75rem',
                                margin: '0.125rem',
                                fontSize: '0.8rem'
                              }}
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                          ))}
                        </div>
                        
                        <div className="notification-management">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill"
                            onClick={markAllRead}
                            disabled={unreadCount === 0}
                            style={{
                              borderColor: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              color: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              opacity: unreadCount === 0 ? 0.5 : 1
                            }}
                          >
                            Mark all read
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={clearNotifications}
                            disabled={filteredNotifications.length === 0}
                            style={{
                              borderColor: appliedTheme === 'light' ? '#dc3545' : '#ea868f',
                              color: appliedTheme === 'light' ? '#dc3545' : '#ea868f',
                              opacity: filteredNotifications.length === 0 ? 0.5 : 1,
                              marginLeft: '0.5rem'
                            }}
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                      
                      <div className="notification-list-container">
                        {filteredNotifications.length === 0 ? (
                          <div className="empty-state" style={{
                            padding: '2rem 1rem',
                            textAlign: 'center',
                            color: appliedTheme === 'light' ? '#6c757d' : '#adb5bd'
                          }}>
                            <div className="empty-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</div>
                            <p>No notifications to display</p>
                          </div>
                        ) : (
                          <ul className="notification-list" style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}>
                            {filteredNotifications.map(notification => renderNotificationItem(notification))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Theme toggle button */}
                <button
                  type="button"
                  className={`btn btn-sm btn-outline-${appliedTheme === 'light' ? 'dark' : 'light'} rounded-pill`}
                  onClick={toggleTheme}
                  aria-pressed={appliedTheme === 'dark'}
                  aria-label={`Toggle theme (preference: ${theme}; applied: ${appliedTheme}). Press T to toggle.`}
                  title={`Theme: ${theme === 'auto' ? 'Auto (follows system)' : (theme === 'light' ? 'Light' : 'Dark')} — press T to toggle`}
                  style={{ padding: '6px 10px', marginLeft: '8px' }}
                >
                  {theme === 'auto' ? '🌓 Auto' : (appliedTheme === 'light' ? '🌞 Light' : '🌙 Dark')}
                </button>
                
                {/* Login/Logout button */}
                <button
                   type="button"
                   className={`btn btn-sm btn-outline-${appliedTheme === 'light' ? 'primary' : 'light'} ms-2 rounded-pill`}
                   onClick={() => { authToken ? logout() : setShowLogin(true); }}
                   aria-label={authToken ? 'Logout' : 'Login'}
                 >
                   {authToken ? 'Logout' : 'Login'}
                </button>
                 
                 {/* Login modal */}
                 <Modal show={showLogin} onHide={() => setShowLogin(false)} centered fullscreen="sm-down" aria-labelledby="nav-login-title">
                   <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                     <Modal.Header closeButton>
                       <Modal.Title id="nav-login-title">Sign in</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                         <label htmlFor="login-email" className="visually-hidden">Email</label>
                         <input 
                           id="login-email" 
                           type="email" 
                           value={loginEmail} 
                           onChange={e => setLoginEmail(e.target.value)} 
                           placeholder="you@example.com" 
                           className="form-control rounded-pill" 
                           required 
                         />
                         <label htmlFor="login-password" className="visually-hidden">Password</label>
                         <div style={{ display: 'flex', gap: 8 }}>
                           <input 
                             id="login-password" 
                             type={showPassword ? 'text' : 'password'} 
                             value={loginPassword} 
                             onChange={e => setLoginPassword(e.target.value)} 
                             placeholder="Password" 
                             className="form-control rounded-pill" 
                             required 
                           />
                           <button 
                             type="button" 
                             className="btn btn-outline-secondary rounded-pill" 
                             onClick={() => setShowPassword(s => !s)} 
                             aria-pressed={showPassword} 
                             aria-label={showPassword ? 'Hide password' : 'Show password'}
                           >
                             {showPassword ? 'Hide' : 'Show'}
                           </button>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                           <input 
                             id="remember-me" 
                             type="checkbox" 
                             checked={rememberMe} 
                             onChange={e => setRememberMe(e.target.checked)} 
                           />
                           <label htmlFor="remember-me" style={{ fontSize: 13 }}>Remember me</label>
                         </div>
                         {loginErrors.length > 0 && (
                           <div className="text-danger" role="alert" style={{ marginTop: 8 }}>
                             <ul style={{ margin: 0, paddingLeft: 18 }}>
                               {loginErrors.map((e,i) => <li key={i}>{e}</li>)}
                             </ul>
                           </div>
                         )}
                         {loginMsg && (
                           <div className="text-danger" role="status" style={{ marginTop: 8 }}>
                             {loginMsg}
                           </div>
                         )}
                       </div>
                     </Modal.Body>
                     <Modal.Footer>
                       <Button variant="secondary" className="rounded-pill" onClick={() => setShowLogin(false)}>
                         Cancel
                       </Button>
                       <Button 
                         type="submit" 
                         variant="primary" 
                         className="rounded-pill"
                         disabled={loginBusy || !loginValid}
                       >
                         {loginBusy ? (
                           <>
                             <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> 
                             Signing in…
                           </>
                         ) : 'Sign in'}
                       </Button>
                     </Modal.Footer>
                   </form>
                 </Modal>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
        
        {/* Accessibility announcements */}
        <div aria-live="polite" className="visually-hidden">{themeAnnounce}</div>
        <div aria-live="polite" className="visually-hidden">{notifAnnounce}</div>
      </Navbar>
    );
}

export default Navigation;

