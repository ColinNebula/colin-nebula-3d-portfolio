import React, { useEffect, useState, useCallback } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Modal, Badge } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css'; 
import { useNotifications } from '../../App';

function Navigation(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [themeAnnounce, setThemeAnnounce] = useState('');
    
    // Simplified notifications state - use global notifications from context
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifAnnounce, setNotifAnnounce] = useState('');
    const { showNotification, notifications: globalNotifications, dismissNotification, dismissAllNotifications } = useNotifications();
    
    // Filter and deduplicate notifications
    const activeNotifications = globalNotifications.filter(n => {
      // Remove expired notifications (older than 1 hour for nav display)
      const oneHour = 60 * 60 * 1000;
      return (Date.now() - n.createdAt) < oneHour;
    });
    
    // Count unread notifications (notifications from last 10 minutes)
    const tenMinutes = 10 * 60 * 1000;
    const unreadCount = activeNotifications.filter(n => 
      (Date.now() - n.createdAt) < tenMinutes
    ).length;

    // Quick actions for notifications
    const [showQuickActions, setShowQuickActions] = useState(false);
    
    const quickActions = [
      {
        label: 'Test Notification',
        icon: '🧪',
        action: () => {
          showNotification('This is a test notification', 'info', 3000, {
            category: 'system',
            icon: '🧪',
            priority: 'normal'
          });
          setShowQuickActions(false);
        }
      },
      {
        label: 'Success Message',
        icon: '✅',
        action: () => {
          showNotification('Operation completed successfully!', 'success', 3000, {
            category: 'system',
            icon: '✅',
            priority: 'high'
          });
          setShowQuickActions(false);
        }
      },
      {
        label: 'Warning Alert',
        icon: '⚠️',
        action: () => {
          showNotification('This is a warning message', 'warning', 4000, {
            category: 'system',
            icon: '⚠️',
            priority: 'high'
          });
          setShowQuickActions(false);
        }
      },
      {
        label: 'Error Message',
        icon: '❌',
        action: () => {
          showNotification('Something went wrong!', 'error', 5000, {
            category: 'system',
            icon: '❌',
            priority: 'urgent'
          });
          setShowQuickActions(false);
        }
      }
    ];

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
    
    // Persist auth state to localStorage (removed notifications persistence)
    useEffect(() => {
      try {
        if (authToken) localStorage.setItem('nebula_auth_token', authToken);
        else localStorage.removeItem('nebula_auth_token');
        if (authUser) localStorage.setItem('nebula_auth_user', JSON.stringify(authUser));
        else localStorage.removeItem('nebula_auth_user');
      } catch (e) {}
    }, [authToken, authUser]);
    
    // Mark specific notification as read (using dismissNotification from global context)
    const markAsRead = (notificationId) => {
      dismissNotification(notificationId);
    };
    
    // Mark all notifications as read (clear all from global context)
    const markAllRead = () => {
      dismissAllNotifications();
      setNotifAnnounce('All notifications cleared');
      setTimeout(() => setNotifAnnounce(''), 1200);
    };
    
    // Clear all notifications (same as mark all read in unified system)
    const clearNotifications = () => {
      dismissAllNotifications();
      setNotifAnnounce('All notifications cleared');
      setTimeout(() => setNotifAnnounce(''), 1200);
    };
    
    // Delete specific notification (same as mark as read in unified system)
    const deleteNotification = (notificationId) => {
      dismissNotification(notificationId);
    };
    
    // Enhanced category management with counts and actions
    const getCategoryCount = (category) => {
      if (category === 'all') return activeNotifications.length;
      return activeNotifications.filter(n => n.category === category).length;
    };

    const getCategoryUnreadCount = (category) => {
      const tenMinutes = 10 * 60 * 1000;
      const categoryNotifications = category === 'all' 
        ? activeNotifications 
        : activeNotifications.filter(n => n.category === category);
      
      return categoryNotifications.filter(n => 
        (Date.now() - n.createdAt) < tenMinutes
      ).length;
    };

    // Category-specific actions
    const handleCategoryAction = (category, action) => {
      const categoryNotifications = category === 'all' 
        ? activeNotifications 
        : activeNotifications.filter(n => n.category === category);

      switch (action) {
        case 'markAllRead':
          categoryNotifications.forEach(n => dismissNotification(n.id));
          showNotification(
            `Marked all ${category} notifications as read`, 
            'success', 
            2000, 
            { category: 'system', icon: '✅' }
          );
          break;
        
        case 'clearAll':
          categoryNotifications.forEach(n => dismissNotification(n.id));
          showNotification(
            `Cleared all ${category} notifications`, 
            'success', 
            2000, 
            { category: 'system', icon: '🗑️' }
          );
          break;
        
        case 'export':
          try {
            const exportData = {
              category: category,
              notifications: categoryNotifications,
              exportDate: new Date().toISOString(),
              totalCount: categoryNotifications.length
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${category}-notifications-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification(
              `Exported ${category} notifications`, 
              'success', 
              3000, 
              { category: 'system', icon: '📥' }
            );
          } catch (error) {
            showNotification(
              `Failed to export ${category} notifications`, 
              'error', 
              3000, 
              { category: 'system', icon: '❌' }
            );
          }
          break;
        
        default:
          break;
      }
    };

    // Enhanced category selection with feedback
    const handleCategorySelect = (category) => {
      setNotifCategory(category);
      const count = getCategoryCount(category);
      const unreadCount = getCategoryUnreadCount(category);
      
      // Special handling for account category - navigate to Account component
      if (category === 'account') {
        navigateToAccount();
        return;
      }
      
      // Special handling for updates category - navigate to Updates component  
      if (category === 'updates') {
        navigateToUpdates();
        return;
      }
      
      showNotification(
        `Viewing ${category} notifications (${count} total, ${unreadCount} unread)`, 
        'info', 
        2000, 
        { category: 'system', icon: '📂' }
      );
    };

    // Category-specific quick actions
    const [showCategoryActions, setShowCategoryActions] = useState(null);

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'all': return '📋';
        case 'system': return '⚙️';
        case 'account': return '👤';
        case 'updates': return '📈';
        default: return '📌';
      }
    };

    const getCategoryDescription = (category) => {
      switch (category) {
        case 'all': return 'All notifications from every category';
        case 'system': return 'System alerts, settings, and technical notifications';
        case 'account': return 'Account-related notifications and security alerts';
        case 'updates': return 'Application updates, feature announcements, and changelog';
        default: return 'Miscellaneous notifications';
      }
    };

    // Filter notifications based on category
    const filteredNotifications = activeNotifications.filter(n => 
      notifCategory === 'all' || n.category === notifCategory
    );
    
    // Render individual notification item
    const renderNotificationItem = (notification) => {
      const isRecent = (Date.now() - notification.createdAt) < (10 * 60 * 1000); // 10 minutes
      
      return (
        <li 
          key={notification.id} 
          className={`notification-item ${isRecent ? 'unread' : 'read'} priority-${notification.priority || 'normal'}`}
        >
          <div className="notification-content">
            {notification.icon && <div className="notification-icon">{notification.icon}</div>}
            <div className="notification-text">
              {notification.message}
              {notification.count > 1 && (
                <span className="badge bg-primary ms-2 rounded-pill">
                  {notification.count}
                </span>
              )}
            </div>
            <div className="notification-time">
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="notification-actions">
            <button 
              className="btn btn-sm btn-outline-success rounded-pill"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
                showNotification('Notification marked as read', 'success', 1500, {
                  category: 'system',
                  icon: '✅'
                });
              }}
              title="Mark as read"
              aria-label="Mark notification as read"
              style={{
                padding: '0.125rem 0.375rem',
                fontSize: '0.7rem',
                marginRight: '0.25rem'
              }}
            >
              ✓
            </button>
            <button 
              className="btn btn-sm btn-outline-danger rounded-pill"
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
                showNotification('Notification deleted', 'info', 1500, {
                  category: 'system',
                  icon: '🗑️'
                });
              }}
              title="Delete notification"
              aria-label="Delete notification"
              style={{
                padding: '0.125rem 0.375rem',
                fontSize: '0.7rem'
              }}
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
        showNotification('Successfully logged out', 'success', 3000, {
          category: 'account',
          icon: '👋'
        });
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
          showNotification('Successfully logged in', 'success', 3000, {
            category: 'account',
            icon: '✅'
          });
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
      showNotification('Navigating to account settings', 'info', 2000, { 
        category: 'account', 
        icon: '👤' 
      });
    };

    // Navigate to updates page
    const navigateToUpdates = () => {
      setShowNotifications(false);
      navigate('/updates');
      showNotification('Navigating to updates page', 'info', 2000, { 
        category: 'navigation', 
        icon: '📈' 
      });
    };

    // Handle system notifications - open system settings
    const handleSystemNotifications = () => {
      setShowNotifications(false);
      // For demo purposes, show notification settings
      showNotification('System notification settings accessed', 'success', 3000, { 
        category: 'system', 
        icon: '⚙️' 
      });
      
      // You could also navigate to a system settings page if it exists
      // navigate('/system-settings');
      
      // Or open browser notification permissions dialog
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showNotification('Browser notifications enabled', 'success', 3000, {
              category: 'system',
              icon: '✅'
            });
          } else {
            showNotification('Browser notifications denied', 'warning', 3000, {
              category: 'system', 
              icon: '⚠️'
            });
          }
        });
      }
    };

    // Enhanced mark all read with confirmation
    const markAllReadEnhanced = () => {
      if (unreadCount === 0) {
        showNotification('No unread notifications to mark', 'info', 2000, {
          category: 'system',
          icon: 'ℹ️'
        });
        return;
      }
      
      markAllRead();
      showNotification(`Marked ${unreadCount} notifications as read`, 'success', 2000, {
        category: 'system',
        icon: '✅'
      });
    };

    // Enhanced clear all with confirmation
    const clearAllNotificationsEnhanced = () => {
      if (filteredNotifications.length === 0) {
        showNotification('No notifications to clear', 'info', 2000, {
          category: 'system',
          icon: 'ℹ️'
        });
        return;
      }
      
      const count = filteredNotifications.length;
      clearNotifications();
      showNotification(`Cleared ${count} notifications`, 'success', 2000, {
        category: 'system',
        icon: '🗑️'
      });
    };

    // Refresh notifications function
    const refreshNotifications = () => {
      // In a real app, this would fetch from an API
      showNotification('Notifications refreshed', 'success', 1500, {
        category: 'system',
        icon: '🔄'
      });
    };

    // Export notifications function
    const exportNotifications = () => {
      try {
        const exportData = {
          notifications: activeNotifications,
          exportDate: new Date().toISOString(),
          totalCount: activeNotifications.length
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `notifications-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Notifications exported successfully', 'success', 3000, {
          category: 'system',
          icon: '📥'
        });
      } catch (error) {
        showNotification('Failed to export notifications', 'error', 3000, {
          category: 'system',
          icon: '❌'
        });
      }
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
                          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                            <Button
                              variant="link"
                              className="p-0 me-2 btn-quick-actions rounded-pill"
                              onClick={() => setShowQuickActions(!showQuickActions)}
                              title="Quick actions"
                              style={{ 
                                color: appliedTheme === 'light' ? '#6f42c1' : '#b085f5',
                                textDecoration: 'none',
                                fontSize: '0.85rem'
                              }}
                            >
                              ⚡ Actions
                            </Button>
                            {showQuickActions && (
                              <div 
                                className="dropdown-menu show"
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  backgroundColor: appliedTheme === 'light' ? '#ffffff' : '#343a40',
                                  border: `1px solid ${appliedTheme === 'light' ? '#dee2e6' : '#495057'}`,
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                  zIndex: 1060,
                                  minWidth: '160px',
                                  padding: '0.5rem 0'
                                }}
                              >
                                {quickActions.map((action, index) => (
                                  <button
                                    key={index}
                                    className="dropdown-item"
                                    onClick={action.action}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      padding: '0.5rem 1rem',
                                      width: '100%',
                                      textAlign: 'left',
                                      color: appliedTheme === 'light' ? '#212529' : '#ffffff',
                                      fontSize: '0.8rem',
                                      cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = appliedTheme === 'light' ? '#f8f9fa' : '#495057';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    {action.icon} {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="link"
                            className="p-0 me-2 btn-refresh-link rounded-pill"
                            onClick={refreshNotifications}
                            title="Refresh notifications"
                            style={{ 
                              color: appliedTheme === 'light' ? '#198754' : '#75b798',
                              textDecoration: 'none',
                              fontSize: '0.85rem'
                            }}
                          >
                            🔄 Refresh
                          </Button>
                          <Button
                            variant="link"
                            className="p-0 me-2 btn-updates-link rounded-pill"
                            onClick={navigateToUpdates}
                            title="View all updates"
                            style={{ 
                              color: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              textDecoration: 'none',
                              fontSize: '0.85rem'
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
                              textDecoration: 'none',
                              fontSize: '0.85rem'
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
                              textDecoration: 'none',
                              fontSize: '0.85rem'
                            }}
                          >
                            ⚙️ System
                          </Button>
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                            onClick={() => {
                              setShowNotifications(false);
                              setShowQuickActions(false);
                            }}
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
                          {notificationCategories.map(category => {
                            const categoryCount = getCategoryCount(category);
                            const unreadCount = getCategoryUnreadCount(category);
                            const isActive = notifCategory === category;
                            
                            return (
                              <div key={category} className="d-flex align-items-center me-2">
                                <button
                                  className={`category-btn rounded-pill ${isActive ? 'active' : ''}`}
                                  onClick={() => handleCategorySelect(category)}
                                  aria-pressed={isActive}
                                  title={getCategoryDescription(category)}
                                  style={{
                                    backgroundColor: isActive 
                                      ? (appliedTheme === 'light' ? '#0d6efd' : '#0a58ca')
                                      : 'transparent',
                                    color: isActive 
                                      ? '#ffffff'
                                      : (appliedTheme === 'light' ? '#212529' : '#ffffff'),
                                    border: `1px solid ${appliedTheme === 'light' ? '#dee2e6' : '#495057'}`,
                                    padding: '0.25rem 0.75rem',
                                    margin: '0.125rem',
                                    fontSize: '0.8rem',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <span className="category-icon" style={{ fontSize: '0.9em' }}>
                                    {getCategoryIcon(category)}
                                  </span>
                                  <span className="category-label">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </span>
                                  {categoryCount > 0 && (
                                    <Badge 
                                      bg={unreadCount > 0 ? 'danger' : 'secondary'}
                                      pill
                                      className="ms-1"
                                      style={{
                                        fontSize: '0.65rem',
                                        minWidth: '1.2em',
                                        textAlign: 'center'
                                      }}
                                    >
                                      {categoryCount}
                                    </Badge>
                                  )}
                                </button>
                                
                                {isActive && categoryCount > 0 && (
                                  <div className="dropdown">
                                    <button 
                                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      title="Category Actions"
                                      style={{
                                        fontSize: '0.7rem',
                                        padding: '0.125rem 0.25rem',
                                        marginLeft: '0.25rem'
                                      }}
                                    >
                                      ⋮
                                    </button>
                                    
                                    <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.8rem' }}>
                                      <li className="dropdown-header">
                                        {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)} Actions
                                      </li>
                                      
                                      {unreadCount > 0 && (
                                        <li>
                                          <button 
                                            className="dropdown-item"
                                            onClick={() => handleCategoryAction(category, 'markAllRead')}
                                          >
                                            <i className="fas fa-check-circle text-success me-2"></i>
                                            Mark All Read ({unreadCount})
                                          </button>
                                        </li>
                                      )}
                                      
                                      <li>
                                        <button 
                                          className="dropdown-item text-warning"
                                          onClick={() => handleCategoryAction(category, 'clearAll')}
                                        >
                                          <i className="fas fa-trash-alt me-2"></i>
                                          Clear All ({categoryCount})
                                        </button>
                                      </li>
                                      
                                      <li>
                                        <button 
                                          className="dropdown-item"
                                          onClick={() => handleCategoryAction(category, 'export')}
                                        >
                                          <i className="fas fa-download text-info me-2"></i>
                                          Export ({categoryCount})
                                        </button>
                                      </li>
                                      
                                      <li><hr className="dropdown-divider" /></li>
                                      
                                      <li>
                                        <button 
                                          className="dropdown-item text-muted small"
                                          onClick={() => setShowCategoryActions(!showCategoryActions)}
                                        >
                                          <i className="fas fa-info-circle me-2"></i>
                                          Category Info
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="notification-management">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill"
                            onClick={markAllReadEnhanced}
                            disabled={unreadCount === 0}
                            title={unreadCount > 0 ? `Mark ${unreadCount} notifications as read` : 'No unread notifications'}
                            style={{
                              borderColor: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              color: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                              opacity: unreadCount === 0 ? 0.5 : 1,
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            ✓ Mark all read
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={clearAllNotificationsEnhanced}
                            disabled={filteredNotifications.length === 0}
                            title={filteredNotifications.length > 0 ? `Clear ${filteredNotifications.length} notifications` : 'No notifications to clear'}
                            style={{
                              borderColor: appliedTheme === 'light' ? '#dc3545' : '#ea868f',
                              color: appliedTheme === 'light' ? '#dc3545' : '#ea868f',
                              opacity: filteredNotifications.length === 0 ? 0.5 : 1,
                              marginLeft: '0.25rem',
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            🗑️ Clear all
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info rounded-pill"
                            onClick={exportNotifications}
                            disabled={activeNotifications.length === 0}
                            title={activeNotifications.length > 0 ? `Export ${activeNotifications.length} notifications` : 'No notifications to export'}
                            style={{
                              borderColor: appliedTheme === 'light' ? '#0dcaf0' : '#9eeaf9',
                              color: appliedTheme === 'light' ? '#0dcaf0' : '#9eeaf9',
                              opacity: activeNotifications.length === 0 ? 0.5 : 1,
                              marginLeft: '0.25rem',
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            📥 Export
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

