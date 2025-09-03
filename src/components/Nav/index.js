import React, { useEffect, useState, useCallback } from "react";
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

function Navigation(props) {
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
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loginBusy, setLoginBusy] = useState(false);
    const [loginMsg, setLoginMsg] = useState('');
    const [loginErrors, setLoginErrors] = useState([]);
    const [loginValid, setLoginValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    // Enhanced validation for both login and signup modes
    useEffect(() => {
      try {
        document.body.style.overflow = showLogin ? 'hidden' : '';
      } catch (e) {}
      return () => { try { document.body.style.overflow = ''; } catch (e) {} };
    }, [showLogin]);

    useEffect(() => {
      const errs = [];
      const email = (loginEmail || '').trim();
      
      // Email validation (required for both modes)
      if (!email) {
        errs.push('Email is required');
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errs.push('Enter a valid email address');
      }
      
      // Password validation
      if (!loginPassword) {
        errs.push('Password is required');
      } else if (loginPassword.length < 6) {
        errs.push('Password must be at least 6 characters');
      } else if (authMode === 'signup' && loginPassword.length < 8) {
        errs.push('Password must be at least 8 characters for new accounts');
      }
      
      // Signup-specific validations
      if (authMode === 'signup') {
        if (!firstName.trim()) errs.push('First name is required');
        if (!lastName.trim()) errs.push('Last name is required');
        
        if (loginPassword && confirmPassword) {
          if (loginPassword !== confirmPassword) {
            errs.push('Passwords do not match');
          }
        } else if (!confirmPassword) {
          errs.push('Please confirm your password');
        }
        
        if (!agreedToTerms) {
          errs.push('Please agree to the Terms of Service and Privacy Policy');
        }
        
        // Password strength validation for signup
        if (loginPassword && loginPassword.length >= 8) {
          const hasLower = /[a-z]/.test(loginPassword);
          const hasUpper = /[A-Z]/.test(loginPassword);
          const hasNumber = /\d/.test(loginPassword);
          
          if (!hasLower || !hasUpper || !hasNumber) {
            errs.push('Password must contain uppercase, lowercase, and numbers');
          }
        }
      }
      
      setLoginErrors(errs);
      setLoginValid(errs.length === 0);
    }, [loginEmail, loginPassword, confirmPassword, firstName, lastName, agreedToTerms, authMode]);
    
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
        setShowNotifications(false); // Close notifications panel on logout
        dismissAllNotifications(); // Clear all notifications on logout
        showNotification('Successfully logged out. Notifications are now hidden.', 'success', 3000, {
          category: 'account',
          icon: '👋'
        });
      } catch (e) {}
    };

    // Enhanced authentication function for both login and signup
    const handleAuth = async () => {
      if (!loginValid) {
        setLoginMsg('Please fix the highlighted errors');
        return;
      }
      
      try {
        setLoginBusy(true);
        setLoginMsg('');
        
        if (authMode === 'signup') {
          // Handle signup with admin detection
          setTimeout(() => {
            // Check if this should be an admin account
            const isAdminSignup = (
              loginEmail.includes('admin') || 
              loginEmail.includes('colin') ||
              firstName.toLowerCase().includes('colin') ||
              lastName.toLowerCase().includes('nebula') ||
              loginPassword === 'admin123'
            );
            
            const newUser = {
              username: loginEmail,
              email: loginEmail,
              name: `${firstName.trim()} ${lastName.trim()}`,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              isAdmin: isAdminSignup,
              role: isAdminSignup ? 'administrator' : 'user',
              permissions: isAdminSignup ? ['read', 'write', 'admin', 'notifications'] : ['read'],
              createdAt: new Date().toISOString()
            };
            
            // Save to localStorage for demo
            const existingUsers = JSON.parse(localStorage.getItem('nebula_users') || '[]');
            
            // Check if user already exists
            if (existingUsers.find(u => u.email === loginEmail)) {
              setLoginMsg('An account with this email already exists');
              setLoginBusy(false);
              return;
            }
            
            existingUsers.push(newUser);
            localStorage.setItem('nebula_users', JSON.stringify(existingUsers));
            
            // Auto-login after signup
            setAuthToken('demo-token-' + Date.now());
            setAuthUser(newUser);
            
            if (rememberMe) {
              localStorage.setItem('nebula_auth_token', 'demo-token-' + Date.now());
              localStorage.setItem('nebula_auth_user', JSON.stringify(newUser));
            }
            
            // Reset form
            resetAuthForm();
            setShowLogin(false);
            
            const welcomeMessage = isAdminSignup
              ? `Welcome ${newUser.name}! Your administrator account has been created successfully.`
              : `Welcome ${newUser.name}! Your account has been created successfully.`;
            
            showNotification(welcomeMessage, 'success', 5000, {
              category: 'account',
              icon: isAdminSignup ? '👑' : '🎉'
            });
            
            // Additional welcome notification
            setTimeout(() => {
              const tipMessage = isAdminSignup
                ? 'You have full administrator access to all features and notifications!'
                : 'Explore your new account features and notifications!';
                
              showNotification(tipMessage, 'info', 4000, {
                category: 'system',
                icon: '✨'
              });
            }, 1500);
            
            setLoginBusy(false);
          }, 1200);
          
        } else {
          // Handle login (existing logic with enhanced admin support)
          setTimeout(() => {
            // Admin credentials for demo (you can change these)
            const adminCredentials = {
              email: 'admin@colin-nebula.com',
              password: 'admin123',
              altEmail: 'colin@admin.com',
              altPassword: 'colinadmin'
            };
            
            // Check for admin login
            const isAdminLogin = (
              (loginEmail === adminCredentials.email && loginPassword === adminCredentials.password) ||
              (loginEmail === adminCredentials.altEmail && loginPassword === adminCredentials.altPassword) ||
              (loginEmail.includes('admin') && loginPassword === 'admin123') ||
              (loginEmail === 'colin@nebula.com' && loginPassword === 'admin')
            );
            
            // Check if user exists (for demo)
            const existingUsers = JSON.parse(localStorage.getItem('nebula_users') || '[]');
            const existingUser = existingUsers.find(u => u.email === loginEmail);
            
            const user = existingUser || { 
              username: loginEmail, 
              email: loginEmail,
              name: isAdminLogin ? 'Colin Nebula (Admin)' : loginEmail.split('@')[0],
              isAdmin: isAdminLogin || loginEmail.includes('admin'),
              role: isAdminLogin ? 'administrator' : 'user',
              permissions: isAdminLogin ? ['read', 'write', 'admin', 'notifications'] : ['read']
            };
            
            // If it's an admin login, update existing user to admin if needed
            if (isAdminLogin && existingUser && !existingUser.isAdmin) {
              existingUser.isAdmin = true;
              existingUser.role = 'administrator';
              existingUser.permissions = ['read', 'write', 'admin', 'notifications'];
              const updatedUsers = existingUsers.map(u => u.email === loginEmail ? existingUser : u);
              localStorage.setItem('nebula_users', JSON.stringify(updatedUsers));
            }
            
            setAuthToken('demo-token-' + Date.now());
            setAuthUser(user);
            
            if (rememberMe) {
              localStorage.setItem('nebula_auth_token', 'demo-token-' + Date.now());
              localStorage.setItem('nebula_auth_user', JSON.stringify(user));
            }
            
            // Reset form
            resetAuthForm();
            setShowLogin(false);
            
            const welcomeMessage = isAdminLogin 
              ? `Welcome back, Administrator! You have full access to all features.`
              : `Welcome back${user.name ? ', ' + user.name : ''}! Successfully logged in.`;
            
            showNotification(welcomeMessage, 'success', 4000, {
              category: 'account',
              icon: isAdminLogin ? '👑' : '✅'
            });
            
            // Show admin-specific or regular notification features tip
            setTimeout(() => {
              const tipMessage = isAdminLogin
                ? 'As admin, you have access to all notifications and system features! 🔔'
                : 'Click the 🔔 bell icon to view your notifications';
              
              showNotification(tipMessage, 'info', 3000, {
                category: 'system',
                icon: '🔔'
              });
            }, 1000);
            
            setLoginBusy(false);
          }, 800);
        }
        
      } catch (e) {
        setLoginMsg(`Network error during ${authMode}`);
        setLoginBusy(false);
      }
    };
    
    // Helper to reset authentication form
    const resetAuthForm = () => {
      setLoginEmail('');
      setLoginPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setLoginMsg('');
      setLoginErrors([]);
      setAgreedToTerms(false);
      setShowPassword(false);
    };
    
    // Helper to switch between login and signup modes
    const switchAuthMode = (mode) => {
      setAuthMode(mode);
      resetAuthForm();
    };

    // Enhanced theme preference initialization with fallback
    const [theme, setTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        if (saved && ['light', 'dark', 'auto'].includes(saved)) return saved;
        
        // Check if user has system preference and no saved preference
        if (typeof window !== 'undefined' && window.matchMedia) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
          if (prefersDark || prefersLight) {
            return 'auto'; // Default to auto if system has preference
          }
        }
        return 'dark'; // Fallback to dark
      } catch (e) { 
        console.warn('Theme initialization error:', e);
        return 'auto'; 
      }
    });

    // Enhanced appliedTheme with better system detection
    const [appliedTheme, setAppliedTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        if (saved && saved !== 'auto') return saved;
        
        if (typeof window !== 'undefined' && window.matchMedia) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          return prefersDark ? 'dark' : 'light';
        }
      } catch (e) {
        console.warn('Applied theme initialization error:', e);
      }
      return 'dark'; // Safe fallback
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

    // Enhanced theme application with better transitions and system detection
    useEffect(() => {
      let mq;
      const apply = (mode, isSystemChange = false) => {
        try {
          // Add smooth transition class for visual changes
          if (!prefersReducedMotion) {
            document.documentElement.classList.add('theme-transition');
            setTimeout(() => { 
              try { document.documentElement.classList.remove('theme-transition'); } catch(e){} 
            }, 350);
          }
          
          // Apply theme classes
          document.body.classList.remove('theme-light', 'theme-dark');
          document.body.classList.add(mode === 'light' ? 'theme-light' : 'theme-dark');
          document.documentElement.setAttribute('data-theme', mode);
          
          // Update meta theme-color for mobile browsers
          const metaThemeColor = document.querySelector('meta[name="theme-color"]');
          if (metaThemeColor) {
            metaThemeColor.setAttribute('content', mode === 'light' ? '#f8f9fa' : '#212529');
          } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = mode === 'light' ? '#f8f9fa' : '#212529';
            document.getElementsByTagName('head')[0].appendChild(meta);
          }
          
          setAppliedTheme(mode);
          
          // Enhanced accessibility announcement
          const modeText = mode === 'light' ? 'Light' : 'Dark';
          const sourceText = theme === 'auto' 
            ? isSystemChange ? ' (system preference changed)' : ' (auto)' 
            : '';
          setThemeAnnounce(`${modeText} theme activated${sourceText}`);
          
          // Save user preference
          try { 
            localStorage.setItem('nebula_theme', theme); 
            localStorage.setItem('nebula_last_applied', mode);
          } catch (e) {
            console.warn('Failed to save theme preference:', e);
          }
        } catch (e) {
          console.error('Theme application error:', e);
        }
      };

      if (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
        mq = window.matchMedia('(prefers-color-scheme: dark)');
        apply(mq.matches ? 'dark' : 'light');
        
        const onChange = (ev) => {
          apply(ev.matches ? 'dark' : 'light', true);
        };
        
        try { 
          if (mq.addEventListener) {
            mq.addEventListener('change', onChange);
          } else {
            mq.addListener(onChange);
          }
        } catch (e) {
          console.warn('Failed to add system theme listener:', e);
        }
        
        const t = setTimeout(() => setThemeAnnounce(''), 2000);
        return () => { 
          try { 
            if (mq.removeEventListener) {
              mq.removeEventListener('change', onChange);
            } else {
              mq.removeListener(onChange);
            }
          } catch(e){
            console.warn('Failed to remove system theme listener:', e);
          }
          clearTimeout(t); 
        };
      } else {
        apply(theme === 'light' ? 'light' : 'dark');
        const t = setTimeout(() => setThemeAnnounce(''), 2000);
        return () => clearTimeout(t);
      }
    }, [theme, prefersReducedMotion]);

    // Enhanced theme toggle with better cycling and feedback
    const toggleTheme = useCallback(() => {
      const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
      setTheme(nextTheme);
      
      // Provide immediate feedback
      const feedbackText = nextTheme === 'auto' 
        ? 'Switching to auto (follows system)' 
        : `Switching to ${nextTheme} theme`;
      setThemeAnnounce(feedbackText);
      
      // Clear feedback after transition
      setTimeout(() => setThemeAnnounce(''), 1000);
    }, [theme]);
    
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
          <Navbar.Brand as={Link} to="/" style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef' }}>
            <img src={logoM} width="90px" height="40px" alt="logo" />
            Colin Nebula 3D 
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" />
          <Navbar.Collapse id="basic-navbar-nav" aria-label="Primary">
            <Nav className="ms-auto">
              <NavLink 
                to="/"
                className={({isActive}) => `nav-link mx-2 ${isActive ? 'navActive' : ''}`}
                style={({isActive}) => ({ 
                  color: isActive ? undefined : (appliedTheme === 'light' ? '#212529' : '#e9ecef') 
                })}
                end
              >
                Home
              </NavLink>

              <NavLink 
                to="/portfolio"
                className={({isActive}) => `nav-link mx-2 ${isActive ? 'navActive' : ''}`}
                style={({isActive}) => ({ 
                  color: isActive ? undefined : (appliedTheme === 'light' ? '#212529' : '#e9ecef') 
                })}
              >
                Portfolio
              </NavLink>

              <NavLink 
                to="/artwork"
                className={({isActive}) => `nav-link mx-2 ${isActive ? 'navActive' : ''}`}
                style={({isActive}) => ({ 
                  color: isActive ? undefined : (appliedTheme === 'light' ? '#212529' : '#e9ecef') 
                })}
              >
                Artwork
              </NavLink>

              <NavLink 
                to="/animation"
                className={({isActive}) => `nav-link mx-2 ${isActive ? 'navActive' : ''}`}
                style={({isActive}) => ({ 
                  color: isActive ? undefined : (appliedTheme === 'light' ? '#212529' : '#e9ecef') 
                })}
              >
                Animation
              </NavLink>

              <NavLink 
                to="/video-editing"
                className={({isActive}) => `nav-link mx-2 ${isActive ? 'navActive' : ''}`}
                style={({isActive}) => ({ 
                  color: isActive ? undefined : (appliedTheme === 'light' ? '#212529' : '#e9ecef') 
                })}
              >
                VFX
              </NavLink>

              <NavDropdown 
                title="More" 
                id="nav-more" 
                align="end" 
                menuVariant={appliedTheme === 'light' ? 'light' : 'dark'} 
                aria-label="More links"
              >
                <NavDropdown.Item as={NavLink} to="/privacy-policy">Privacy Policy</NavDropdown.Item>
                <NavDropdown.Item href="mailto:colinnebula@gmail.com" title="Email Colin">Contact</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/resume" title="View Resume">Resume</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="https://github.com/ColinNebula" target="_blank" rel="noopener noreferrer" title="Open GitHub">GitHub</NavDropdown.Item>
              </NavDropdown>
 
              <div className="mx-2" style={{ display: 'flex', alignItems: 'center' }}>
                {/* Notifications bell - Only show when user is logged in */}
                {authToken && (
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
                        color: appliedTheme === 'light' ? '#212529' : '#e9ecef',
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
                      className="notification-panel"
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
                            color: appliedTheme === 'light' ? '#495057' : '#adb5bd'
                          }}>
                            <div className="empty-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</div>
                            <p style={{ color: appliedTheme === 'light' ? '#212529' : '#e9ecef' }}>No notifications to display</p>
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
                )}
                
                {/* Login prompt for notifications - Only show when user is not logged in */}
                {!authToken && (
                  <div className="notification-login-prompt" title="Log in to view notifications">
                    <button
                      className="notification-login-btn"
                      onClick={() => setShowLogin(true)}
                      aria-label="Log in to view notifications"
                      style={{
                        background: 'transparent',
                        border: `1px dashed ${appliedTheme === 'light' ? '#6c757d' : '#adb5bd'}`,
                        color: appliedTheme === 'light' ? '#6c757d' : '#adb5bd',
                        borderRadius: '20px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        opacity: 0.6,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
                      onMouseLeave={(e) => { e.target.style.opacity = '0.6'; }}
                    >
                      <span className="notification-icon">🔔</span>
                      <span className="login-hint" style={{ fontSize: '0.75rem', marginLeft: '4px' }}>
                        Login
                      </span>
                    </button>
                  </div>
                )}
                
                {/* Enhanced Theme toggle button with better visual feedback */}
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill theme-toggle-btn`}
                  aria-pressed={appliedTheme === 'dark'}
                  aria-label={`Toggle theme (preference: ${theme}; applied: ${appliedTheme}). Press T to toggle.`}
                  title={`Theme: ${theme === 'auto' ? 'Auto (follows system)' : (theme === 'light' ? 'Light' : 'Dark')} — press T to toggle`}
                  style={{ 
                    padding: '6px 12px', 
                    marginLeft: '8px',
                    background: theme === 'auto' 
                      ? 'linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4)' 
                      : appliedTheme === 'light' 
                        ? 'linear-gradient(135deg, #ffeaa7, #fab1a0)' 
                        : 'linear-gradient(135deg, #2d3436, #636e72)',
                    border: `2px solid ${appliedTheme === 'light' ? '#6c757d' : '#adb5bd'}`,
                    color: theme === 'auto' 
                      ? '#000000' 
                      : appliedTheme === 'light' ? '#212529' : '#e9ecef',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)',
                    boxShadow: theme === 'auto' 
                      ? '0 0 15px rgba(255, 215, 0, 0.3)'
                      : appliedTheme === 'light'
                        ? '0 4px 12px rgba(255, 234, 167, 0.4)'
                        : '0 4px 12px rgba(45, 52, 54, 0.4)',
                    fontWeight: '600',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = theme === 'auto' 
                      ? '0 0 20px rgba(255, 215, 0, 0.5)'
                      : appliedTheme === 'light'
                        ? '0 6px 16px rgba(255, 234, 167, 0.6)'
                        : '0 6px 16px rgba(45, 52, 54, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = theme === 'auto' 
                      ? '0 0 15px rgba(255, 215, 0, 0.3)'
                      : appliedTheme === 'light'
                        ? '0 4px 12px rgba(255, 234, 167, 0.4)'
                        : '0 4px 12px rgba(45, 52, 54, 0.4)';
                  }}
                  onClick={(e) => {
                    // Add click animation then toggle theme
                    e.target.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                      e.target.style.transform = 'scale(1.05)';
                      setTimeout(() => {
                        e.target.style.transform = 'scale(1)';
                      }, 100);
                    }, 100);
                    
                    // Call the toggle function
                    toggleTheme();
                  }}
                >
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ 
                      fontSize: '1.1em',
                      transition: 'transform 0.3s ease',
                      display: 'inline-block'
                    }}>
                      {theme === 'auto' ? '🌓' : (appliedTheme === 'light' ? '🌞' : '🌙')}
                    </span>
                    <span style={{ fontWeight: '700' }}>
                      {theme === 'auto' ? 'Auto' : (appliedTheme === 'light' ? 'Light' : 'Dark')}
                    </span>
                  </span>
                </button>
                
                {/* Enhanced Login/Logout button with custom border */}
                <button
                   type="button"
                   className={`btn btn-sm ms-2 rounded-pill login-logout-btn`}
                   onClick={() => { authToken ? logout() : setShowLogin(true); }}
                   aria-label={authToken ? 'Logout' : 'Login'}
                   style={{
                     padding: '6px 12px',
                     background: 'transparent',
                     border: `2px solid ${appliedTheme === 'light' ? '#0d6efd' : '#86b7fe'}`,
                     color: appliedTheme === 'light' ? '#0d6efd' : '#86b7fe',
                     fontWeight: '600',
                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.background = appliedTheme === 'light' 
                       ? 'linear-gradient(135deg, #0d6efd, #0056b3)' 
                       : 'linear-gradient(135deg, #86b7fe, #6ea8fe)';
                     e.target.style.color = '#ffffff';
                     e.target.style.transform = 'translateY(-2px) scale(1.05)';
                     e.target.style.boxShadow = `0 6px 16px ${appliedTheme === 'light' ? 'rgba(13, 110, 253, 0.4)' : 'rgba(134, 183, 254, 0.4)'}`;
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.background = 'transparent';
                     e.target.style.color = appliedTheme === 'light' ? '#0d6efd' : '#86b7fe';
                     e.target.style.transform = 'translateY(0) scale(1)';
                     e.target.style.boxShadow = 'none';
                   }}
                 >
                   {authToken ? 'Logout' : 'Login'}
                </button>
                 
                 {/* Enhanced Authentication Modal - Compact Size with White Backdrop */}
                 <Modal 
                   show={showLogin} 
                   onHide={() => {setShowLogin(false); resetAuthForm();}} 
                   centered 
                   size="sm"
                   fullscreen="xs-down" 
                   aria-labelledby="nav-auth-title"
                   className="auth-modal compact-modal"
                   backdrop="static"
                   backdropClassName="white-modal-backdrop"
                   style={{
                     '--bs-modal-backdrop-bg': 'rgba(255, 255, 255, 0.9)'
                   }}
                 >
                   <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                     <Modal.Header closeButton className="border-0 pb-1">
                       <Modal.Title id="nav-auth-title" className="w-100 text-center">
                         <div className="d-flex flex-column align-items-center">
                           <div className="auth-icon mb-1" style={{ fontSize: '2rem' }}>
                             {authMode === 'login' ? '🔐' : '🆕'}
                           </div>
                           <h5 className="mb-0">
                             {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                           </h5>
                           <small className="text-body" style={{ fontSize: '0.8rem' }}>
                             {authMode === 'login' 
                               ? 'Sign in to access your account' 
                               : 'Join Colin Nebula\'s creative community'
                             }
                           </small>
                         </div>
                       </Modal.Title>
                     </Modal.Header>
                     <Modal.Body className="px-3 py-2">
                       {/* Mode Toggle Buttons */}
                       <div className="auth-mode-toggle mb-3">
                         <div className="btn-group w-100" role="group">
                           <button
                             type="button"
                             className={`btn btn-sm ${authMode === 'login' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`}
                             onClick={() => switchAuthMode('login')}
                           >
                             Sign In
                           </button>
                           <button
                             type="button"
                             className={`btn btn-sm ${authMode === 'signup' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`}
                             onClick={() => switchAuthMode('signup')}
                           >
                             Create Account
                           </button>
                         </div>
                       </div>

                       <div className="auth-form-container">
                         {/* Signup Fields */}
                         {authMode === 'signup' && (
                           <div className="signup-fields mb-3">
                             <div className="row">
                               <div className="col-md-6 mb-3">
                                 <label htmlFor="auth-firstname" className="form-label">First Name</label>
                                 <input 
                                   id="auth-firstname" 
                                   type="text" 
                                   value={firstName} 
                                   onChange={e => setFirstName(e.target.value)} 
                                   placeholder="John" 
                                   className="form-control rounded-pill" 
                                   required={authMode === 'signup'}
                                 />
                               </div>
                               <div className="col-md-6 mb-3">
                                 <label htmlFor="auth-lastname" className="form-label">Last Name</label>
                                 <input 
                                   id="auth-lastname" 
                                   type="text" 
                                   value={lastName} 
                                   onChange={e => setLastName(e.target.value)} 
                                   placeholder="Doe" 
                                   className="form-control rounded-pill" 
                                   required={authMode === 'signup'}
                                 />
                               </div>
                             </div>
                           </div>
                         )}

                         {/* Email Field */}
                         <div className="mb-3">
                           <label htmlFor="auth-email" className="form-label">Email Address</label>
                           <input 
                             id="auth-email" 
                             type="email" 
                             value={loginEmail} 
                             onChange={e => setLoginEmail(e.target.value)} 
                             placeholder="you@example.com" 
                             className="form-control rounded-pill" 
                             required 
                           />
                         </div>

                         {/* Password Field */}
                         <div className="mb-3">
                           <label htmlFor="auth-password" className="form-label">Password</label>
                           <div className="input-group">
                             <input 
                               id="auth-password" 
                               type={showPassword ? 'text' : 'password'} 
                               value={loginPassword} 
                               onChange={e => setLoginPassword(e.target.value)} 
                               placeholder={authMode === 'signup' ? 'Create a strong password' : 'Enter your password'} 
                               className="form-control rounded-start" 
                               required 
                             />
                             <button 
                               type="button" 
                               className="btn btn-outline-secondary rounded-end" 
                               onClick={() => setShowPassword(s => !s)} 
                               aria-pressed={showPassword} 
                               aria-label={showPassword ? 'Hide password' : 'Show password'}
                             >
                               {showPassword ? '👁️' : '👁️‍🗨️'}
                             </button>
                           </div>
                           {authMode === 'signup' && loginPassword && (
                             <div className="password-strength mt-2">
                               <small className="text-body">
                                 Password strength: {
                                   loginPassword.length < 8 ? '🔴 Weak' :
                                   loginPassword.length < 12 ? '🟡 Medium' : '🟢 Strong'
                                 }
                               </small>
                             </div>
                           )}
                         </div>

                         {/* Confirm Password (Signup only) */}
                         {authMode === 'signup' && (
                           <div className="mb-3">
                             <label htmlFor="auth-confirm-password" className="form-label">Confirm Password</label>
                             <input 
                               id="auth-confirm-password" 
                               type="password" 
                               value={confirmPassword} 
                               onChange={e => setConfirmPassword(e.target.value)} 
                               placeholder="Confirm your password" 
                               className="form-control rounded-pill" 
                               required={authMode === 'signup'}
                             />
                           </div>
                         )}

                         {/* Options */}
                         <div className="auth-options mb-3">
                           {/* Remember Me (Login) or Terms Agreement (Signup) */}
                           {authMode === 'login' ? (
                             <div className="form-check">
                               <input 
                                 id="remember-me" 
                                 type="checkbox" 
                                 checked={rememberMe} 
                                 onChange={e => setRememberMe(e.target.checked)} 
                                 className="form-check-input"
                               />
                               <label htmlFor="remember-me" className="form-check-label">
                                 Keep me signed in
                               </label>
                             </div>
                           ) : (
                             <div className="form-check">
                               <input 
                                 id="agree-terms" 
                                 type="checkbox" 
                                 checked={agreedToTerms} 
                                 onChange={e => setAgreedToTerms(e.target.checked)} 
                                 className="form-check-input"
                                 required={authMode === 'signup'}
                               />
                               <label htmlFor="agree-terms" className="form-check-label">
                                 I agree to the{' '}
                                 <a href="#" className="text-decoration-none">Terms of Service</a>
                                 {' '}and{' '}
                                 <a href="#" className="text-decoration-none">Privacy Policy</a>
                               </label>
                             </div>
                           )}
                         </div>

                         {/* Error Messages */}
                         {loginErrors.length > 0 && (
                           <div className="alert alert-danger" role="alert">
                             <div className="d-flex align-items-start">
                               <span className="me-2">⚠️</span>
                               <div>
                                 <strong>Please fix the following:</strong>
                                 <ul className="mb-0 mt-1">
                                   {loginErrors.map((error, i) => <li key={i}>{error}</li>)}
                                 </ul>
                               </div>
                             </div>
                           </div>
                         )}

                         {/* General Message */}
                         {loginMsg && (
                           <div className="alert alert-info" role="status">
                             <div className="d-flex align-items-center">
                               <span className="me-2">ℹ️</span>
                               {loginMsg}
                             </div>
                           </div>
                         )}
                       </div>
                     </Modal.Body>
                     <Modal.Footer className="border-0 pt-0 px-3 pb-2">
                       <div className="d-flex flex-column w-100">
                         <div className="d-flex gap-2 justify-content-end">
                           <Button 
                             variant="outline-secondary" 
                             size="sm"
                             className="rounded-pill px-3" 
                             onClick={() => {setShowLogin(false); resetAuthForm();}}
                           >
                             Cancel
                           </Button>
                           <Button 
                             type="submit" 
                             variant="primary" 
                             size="sm"
                             className="rounded-pill px-3"
                             disabled={loginBusy || !loginValid}
                           >
                             {loginBusy ? (
                               <>
                                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" /> 
                                 {authMode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                               </>
                             ) : (
                               <>
                                 {authMode === 'signup' ? '🚀 Create Account' : '🔐 Sign In'}
                               </>
                             )}
                           </Button>
                         </div>
                         
                         {/* Additional Info */}
                         <div className="text-center mt-3">
                           <small className="text-body">
                             {authMode === 'login' ? (
                               <>Need an account? Click "Create Account" above</>
                             ) : (
                               <>Already have an account? Click "Sign In" above</>
                             )}
                           </small>
                         </div>
                       </div>
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

