import React, { useState, useEffect, useCallback } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Modal, Badge, Form, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css'; 
import { useNotifications } from '../../App';
import EmailVerification from '../EmailVerification';
import AdminDashboard from '../Admin/AdminDashboard';
import { UserManager, validateEmail as validateEmailUtil, checkPasswordStrength, canUserLogin, markEmailVerified } from '../../utils/userValidation';
import { FaBell, FaCheck } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { emailjsConfig, createEmailTemplate } from '../../utils/emailConfig';

function Navigation(props) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [themeAnnounce, setThemeAnnounce] = useState('');
    
    // Notifications state
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifAnnounce, setNotifAnnounce] = useState('');
    const [notificationFilter, setNotificationFilter] = useState('all'); // all, updates, accounts, system
    const [expandedNotifications, setExpandedNotifications] = useState(new Set());
    const [notificationSort, setNotificationSort] = useState('newest'); // newest, oldest, priority
    const { showNotification, notifications: globalNotifications, dismissNotification, dismissAllNotifications } = useNotifications();
    
    // Filter and sort notifications
    const filteredNotifications = (globalNotifications || []).filter(n => {
      const oneHour = 60 * 60 * 1000;
      const isRecent = (Date.now() - n.createdAt) < oneHour;
      
      if (!isRecent) return false;
      
      if (notificationFilter === 'all') return true;
      return n.category === notificationFilter;
    });
    
    const sortedNotifications = [...filteredNotifications].sort((a, b) => {
      switch (notificationSort) {
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'priority':
          const priorityOrder = { error: 4, warning: 3, success: 2, info: 1 };
          return (priorityOrder[b.type] || 1) - (priorityOrder[a.type] || 1);
        case 'newest':
        default:
          return b.createdAt - a.createdAt;
      }
    });
    
    // Count unread notifications
    const tenMinutes = 10 * 60 * 1000;
    const unreadCount = filteredNotifications.filter(n => 
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

    // Theme management - use props from App.js
    const currentTheme = props.darkMode ? 'dark' : 'light';

    const [isSticky, setIsSticky] = useState(false);

    // Mobile login access state
    const [logoTouchStart, setLogoTouchStart] = useState(null);
    const [logoLongPressTimer, setLogoLongPressTimer] = useState(null);
    const [showMobileLoginHint, setShowMobileLoginHint] = useState(false);
    
    // Subscription modal state
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [subscribeForm, setSubscribeForm] = useState({ name: '', email: '' });
    const [subscribeStatus, setSubscribeStatus] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    
    // Login button visibility state
    const [showLoginButton, setShowLoginButton] = useState(false);
    
    // Admin dashboard state
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Effect for scroll detection with throttling for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeSticky = window.scrollY > 100;
          setIsSticky(shouldBeSticky);
          
          // Add/remove body class for fixed navbar compensation
          if (shouldBeSticky) {
            document.body.classList.add('navbar-fixed');
          } else {
            document.body.classList.remove('navbar-fixed');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up body class on unmount
      document.body.classList.remove('navbar-fixed');
    };
  }, []);

  // Keyboard shortcut for login button toggle
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl + Shift + L to toggle login button
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setShowLoginButton(prev => {
          const newState = !prev;
          showNotification(
            newState ? 'Login button revealed! 🔓' : 'Login button hidden! 🔒', 
            'info', 
            3000, 
            {
              category: 'system',
              icon: newState ? '🔓' : '🔒'
            }
          );
          return newState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNotification]);

  // Effect to disable/enable scroll when modal is open
  useEffect(() => {
    if (showLogin || showEmailVerification || showSubscribeModal) {
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
            setShowNotifications(false); // Reset notifications dropdown
            
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
          setShowNotifications(false); // Reset notifications dropdown
          
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

    // Handle subscription
    const handleSubscribe = async (e) => {
      e.preventDefault();
      
      if (!subscribeForm.name.trim() || !subscribeForm.email.trim()) {
        setSubscribeStatus('Please fill in all fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(subscribeForm.email)) {
        setSubscribeStatus('Please enter a valid email address.');
        return;
      }

      setIsSubscribing(true);
      setSubscribeStatus('');

      try {
        // Check if already subscribed
        const subscribers = JSON.parse(localStorage.getItem('portfolio_subscribers') || '[]');
        if (subscribers.includes(subscribeForm.email)) {
          setSubscribeStatus('You are already subscribed to updates!');
          setIsSubscribing(false);
          return;
        }

        // Create email template
        const templateParams = createEmailTemplate(subscribeForm.name, subscribeForm.email);

        // Send email via EmailJS
        await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          templateParams,
          emailjsConfig.publicKey
        );

        // Save to localStorage
        subscribers.push(subscribeForm.email);
        localStorage.setItem('portfolio_subscribers', JSON.stringify(subscribers));
        
        // Success
        setSubscribeStatus('🎉 Thank you for subscribing! Check your email for a welcome message.');
        setSubscribeForm({ name: '', email: '' });
        
        showNotification('Successfully subscribed to updates! 📧', 'success', 5000, {
          category: 'subscription',
          icon: '📧'
        });
        
        // Close modal after 3 seconds
        setTimeout(() => {
          setShowSubscribeModal(false);
          setSubscribeStatus('');
        }, 3000);
        
      } catch (error) {
        console.error('Subscription error:', error);
        setSubscribeStatus('There was an error processing your subscription. Please try again.');
      } finally {
        setIsSubscribing(false);
      }
    };

    // Handle subscription input changes
    const handleSubscribeInputChange = (e) => {
      const { name, value } = e.target;
      setSubscribeForm(prev => ({
        ...prev,
        [name]: value
      }));
    };

    // Logout handler
    const handleLogout = () => {
      setAuthToken(null);
      setAuthUser(null);
      setShowNotifications(false); // Close notifications dropdown
      localStorage.removeItem('nebula_auth_token');
      localStorage.removeItem('nebula_auth_user');
      
      showNotification('You have been logged out successfully', 'info', 3000, {
        category: 'account',
        icon: '👋'
      });
      
      navigate('/');
    };

    // Theme toggle - use App.js function
    const toggleTheme = useCallback(() => {
      try {
        console.log('Theme toggle clicked');
        console.log('Current theme:', currentTheme);
        console.log('Props received:', { darkMode: props.darkMode, toggleDarkMode: props.toggleDarkMode });
        
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add transition class for smooth theme switching
        document.documentElement.classList.add('theme-transition');
        
        // Call the App.js toggle function
        if (props.toggleDarkMode && typeof props.toggleDarkMode === 'function') {
          props.toggleDarkMode();
          console.log('toggleDarkMode function called successfully');
        } else {
          console.error('toggleDarkMode function not available or not a function');
        }
        
        // Remove transition class after animation completes
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 300);
        
        const announcement = `Theme switched to ${newTheme} mode`;
        setThemeAnnounce(announcement);
        setTimeout(() => setThemeAnnounce(''), 1000);
        
        showNotification(announcement, 'info', 2000, {
          category: 'system',
          icon: newTheme === 'dark' ? '🌙' : '☀️'
        });
        
        // Debug logging (remove in production)
        console.log(`Theme switched from ${currentTheme} to ${newTheme}`);
        console.log('Current data-theme:', document.documentElement.getAttribute('data-theme'));
      } catch (error) {
        console.error('Error in theme toggle:', error);
        showNotification('Error switching theme', 'error', 3000, {
          category: 'system',
          icon: '❌'
        });
      }
    }, [currentTheme, props.toggleDarkMode, props.darkMode, showNotification]);

    // Close mobile nav when a link is clicked
    const handleNavClick = () => {
      setExpanded(false);
    };

    // Enhanced notification management functions
    const toggleNotificationExpansion = (notificationId) => {
      setExpandedNotifications(prev => {
        const newSet = new Set(prev);
        if (newSet.has(notificationId)) {
          newSet.delete(notificationId);
        } else {
          newSet.add(notificationId);
        }
        return newSet;
      });
    };

    const markNotificationAsRead = (notificationId) => {
      // This would integrate with your notification system
      showNotification('Notification marked as read', 'success', 2000, {
        category: 'system',
        icon: '✅'
      });
    };

    const getNotificationsByCategory = (category) => {
      return sortedNotifications.filter(n => n.category === category);
    };

    const getNotificationIcon = (type) => {
      const icons = {
        error: '❌',
        warning: '⚠️',
        success: '✅',
        info: 'ℹ️'
      };
      return icons[type] || 'ℹ️';
    };

    const getNotificationPriority = (type) => {
      const priorities = {
        error: 'High',
        warning: 'Medium',
        success: 'Low',
        info: 'Low'
      };
      return priorities[type] || 'Low';
    };

    const markAllAsRead = () => {
      // This would integrate with your notification system to mark all as read
      showNotification('All notifications marked as read', 'success', 2000, {
        category: 'system',
        icon: '✅'
      });
      console.log('All notifications marked as read');
    };

    const clearAllNotifications = () => {
      // This would integrate with your notification system to clear all
      if (dismissAllNotifications) {
        dismissAllNotifications();
      }
      showNotification('All notifications cleared', 'info', 2000, {
        category: 'system',
        icon: '🗑️'
      });
      console.log('All notifications cleared');
    };

    const handleSingleNotificationDismiss = (notificationId) => {
      // This would integrate with your notification system to dismiss a specific notification
      if (dismissNotification) {
        dismissNotification(notificationId);
      }
      showNotification('Notification dismissed', 'info', 1500, {
        category: 'system',
        icon: '❌'
      });
      console.log('Notification dismissed:', notificationId);
    };

    // Mobile login access handlers
    const handleLogoTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      setLogoTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() });
      
      // Start long press timer (1.5 seconds)
      const timer = setTimeout(() => {
        setShowLoginButton(true);
        setShowMobileLoginHint(true);
        
        // Vibrate if supported
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        
        showNotification('Login access enabled! 🔓', 'success', 3000, {
          category: 'system',
          icon: '🔓',
          public: true
        });
        
        // Auto-hide hint after 5 seconds
        setTimeout(() => setShowMobileLoginHint(false), 5000);
      }, 1500);
      
      setLogoLongPressTimer(timer);
    };

    const handleLogoTouchEnd = (e) => {
      if (logoLongPressTimer) {
        clearTimeout(logoLongPressTimer);
        setLogoLongPressTimer(null);
      }
      setLogoTouchStart(null);
    };

    const handleLogoTouchMove = (e) => {
      if (!logoTouchStart) return;
      
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - logoTouchStart.x);
      const deltaY = Math.abs(touch.clientY - logoTouchStart.y);
      
      // If user moves finger too much, cancel long press
      if (deltaX > 10 || deltaY > 10) {
        if (logoLongPressTimer) {
          clearTimeout(logoLongPressTimer);
          setLogoLongPressTimer(null);
        }
      }
    };

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768;

    return (
      <>
        <Navbar
          expanded={expanded}
          onToggle={setExpanded}
          bg={currentTheme === 'light' ? 'light' : 'dark'}
          expand="md"
          variant={currentTheme === 'light' ? 'light' : 'dark'}
          sticky="top"
          collapseOnSelect
          role="navigation"
          aria-label="Main navigation"
          className={isSticky ? 'navbar navbar-scrolled' : 'navbar'}
          style={{
            boxShadow: isSticky ? '0 8px 24px rgba(0,0,0,0.20)' : 'none',
            paddingTop: isSticky ? 6 : undefined,
            paddingBottom: isSticky ? 6 : undefined,
            backgroundColor: currentTheme === 'light' ? '#f8f9fa' : '#212529',
            borderBottom: currentTheme === 'light' ? '1px solid #dee2e6' : '1px solid #495057'
          }}
        >
          <Container>
            <Navbar.Brand 
              as={Link} 
              to="/" 
              style={{ 
                color: currentTheme === 'light' ? '#212529' : '#e9ecef',
                position: 'relative',
                userSelect: 'none'
              }}
              onTouchStart={isMobile ? handleLogoTouchStart : undefined}
              onTouchEnd={isMobile ? handleLogoTouchEnd : undefined}
              onTouchMove={isMobile ? handleLogoTouchMove : undefined}
              title={isMobile ? "Long press for login access" : undefined}
            >
              <img src={logoM} width="90px" height="40px" alt="logo" className="nav-logo" />
              Colin Nebula 3D 
              {isMobile && showMobileLoginHint && (
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  left: '0',
                  fontSize: '0.7rem',
                  color: '#28a745',
                  fontWeight: '600',
                  background: 'rgba(40, 167, 69, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  animation: 'fadeInOut 5s ease-in-out'
                }}>
                  🔓 Login enabled
                </div>
              )}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" />
            <Navbar.Collapse id="basic-navbar-nav" aria-label="Primary">
              <Nav className="ms-auto">
                <Nav.Link as={NavLink} to="/" onClick={handleNavClick} style={{ color: currentTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '6px' }}>
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/portfolio" onClick={handleNavClick} style={{ color: currentTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '6px' }}>
                  Portfolio
                </Nav.Link>
                <Nav.Link as={NavLink} to="/video-editing" onClick={handleNavClick} style={{ color: currentTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '6px' }}>
                  Video
                </Nav.Link>
                <Nav.Link as={NavLink} to="/artwork" onClick={handleNavClick} style={{ color: currentTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '6px' }}>
                  Artwork
                </Nav.Link>
                <Nav.Link as={NavLink} to="/animation" onClick={handleNavClick} style={{ color: currentTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '6px' }}>
                  Animation
                </Nav.Link>

                {/* More Dropdown */}
                <NavDropdown
                  title={
                    <span style={{ color: currentTheme === 'light' ? '#212529' : '#e9ecef' }}>
                      📋 More
                    </span>
                  }
                  id="more-dropdown"
                  align="end"
                  style={{ marginRight: '6px' }}
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

                {/* Notifications/More Dropdown - Only show when logged in */}
                {authUser && (
                  <NavDropdown
                    title={
                      <span style={{ 
                        position: 'relative', 
                        color: currentTheme === 'light' ? '#212529' : '#e9ecef',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                        lineHeight: 1,
                        minWidth: '24px',
                        minHeight: '24px'
                      }}>
                        🔔
                        {unreadCount > 0 && (
                          <Badge
                            bg="danger"
                            style={{
                              position: 'absolute',
                              top: 'clamp(-6px, -1.5vw, -8px)',
                              right: 'clamp(-6px, -1.5vw, -8px)',
                              fontSize: 'clamp(0.6rem, 1.8vw, 0.75rem)',
                              minWidth: 'clamp(14px, 4vw, 18px)',
                              height: 'clamp(14px, 4vw, 18px)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0',
                              lineHeight: 1
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
                        setNotifAnnounce(`${sortedNotifications.length} notifications available`);
                        setTimeout(() => setNotifAnnounce(''), 3000);
                      }
                    }}
                    align="end"
                    style={{ 
                      marginRight: '6px',
                      '--bs-dropdown-min-width': 'min(320px, 95vw)',
                      '--bs-dropdown-max-height': 'min(600px, 80vh)',
                      '--bs-dropdown-max-width': '95vw'
                    }}
                    className="notification-dropdown-responsive"
                    menuVariant={currentTheme === 'dark' ? 'dark' : 'light'}
                  >
                    <div style={{ 
                      padding: 'clamp(8px, 2vw, 12px) clamp(10px, 3vw, 16px)', 
                      borderBottom: '1px solid #eee', 
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '8px',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <strong style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>
                          🔔 Notifications ({sortedNotifications.length})
                        </strong>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          {sortedNotifications.length > 0 && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => {
                                dismissAllNotifications();
                                setShowNotifications(false);
                              }}
                              style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Filter Controls */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '6px', 
                        marginBottom: '8px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#6c757d' }}>
                          Filter:
                        </span>
                        {['all', 'system', 'updates', 'accounts'].map(filter => (
                          <button
                            key={filter}
                            onClick={() => setNotificationFilter(filter)}
                            style={{
                              background: notificationFilter === filter ? 
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                                'transparent',
                              color: notificationFilter === filter ? 'white' : '#6c757d',
                              border: `1px solid ${notificationFilter === filter ? '#667eea' : '#dee2e6'}`,
                              borderRadius: '12px',
                              padding: '2px 8px',
                              fontSize: 'clamp(0.65rem, 1.8vw, 0.7rem)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textTransform: 'capitalize'
                            }}
                          >
                            {filter === 'all' ? `All (${sortedNotifications.length})` : 
                             `${filter} (${getNotificationsByCategory(filter).length})`}
                          </button>
                        ))}
                      </div>
                      
                      {/* Sort Controls */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '6px',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#6c757d' }}>
                          Sort:
                        </span>
                        {[
                          { key: 'newest', label: '🕐 Newest' },
                          { key: 'oldest', label: '🕑 Oldest' },
                          { key: 'priority', label: '⚡ Priority' }
                        ].map(sort => (
                          <button
                            key={sort.key}
                            onClick={() => setNotificationSort(sort.key)}
                            style={{
                              background: notificationSort === sort.key ? 
                                'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 
                                'transparent',
                              color: notificationSort === sort.key ? 'white' : '#6c757d',
                              border: `1px solid ${notificationSort === sort.key ? '#28a745' : '#dee2e6'}`,
                              borderRadius: '12px',
                              padding: '2px 8px',
                              fontSize: 'clamp(0.65rem, 1.8vw, 0.7rem)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {sort.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {sortedNotifications.length === 0 ? (
                      <div style={{ 
                        padding: 'clamp(20px, 5vw, 30px)', 
                        textAlign: 'center', 
                        color: '#6c757d',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                      }}>
                        <div style={{ 
                          fontSize: 'clamp(2rem, 6vw, 3rem)', 
                          marginBottom: 'clamp(8px, 2vw, 12px)',
                          filter: 'grayscale(0.3)'
                        }}>
                          {notificationFilter === 'all' ? '🔕' : 
                           notificationFilter === 'system' ? '⚙️' :
                           notificationFilter === 'updates' ? '📈' : '👥'}
                        </div>
                        <div style={{ 
                          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          {notificationFilter === 'all' ? 'No notifications' : `No ${notificationFilter} notifications`}
                        </div>
                        <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                          {notificationFilter === 'all' ? "You're all caught up!" : 
                           `No ${notificationFilter} activity right now`}
                        </div>
                        {notificationFilter !== 'all' && (
                          <button
                            onClick={() => setNotificationFilter('all')}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                              cursor: 'pointer',
                              marginTop: '8px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            View All Notifications
                          </button>
                        )}
                      </div>
                    ) : (
                      sortedNotifications.slice(0, 8).map(notification => {
                        const isExpanded = expandedNotifications.has(notification.id);
                        const isRecent = (Date.now() - notification.createdAt) < (5 * 60 * 1000); // 5 minutes
                        
                        return (
                          <NavDropdown.Item 
                            key={notification.id} 
                            style={{ 
                              whiteSpace: 'normal',
                              padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              background: isRecent ? 
                                'linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(13, 110, 253, 0.02) 100%)' : 
                                'transparent',
                              borderLeft: isRecent ? '3px solid #0d6efd' : '3px solid transparent',
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => toggleNotificationExpansion(notification.id)}
                          >
                            {/* Priority indicator */}
                            {notification.type === 'error' && (
                              <div style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                animation: 'pulse 2s infinite'
                              }} />
                            )}
                            
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'clamp(6px, 1.5vw, 8px)',
                              marginBottom: '6px'
                            }}>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flexShrink: 0
                              }}>
                                <span style={{ 
                                  fontSize: 'clamp(0.9rem, 2.2vw, 1rem)',
                                  lineHeight: 1,
                                  filter: notification.type === 'error' ? 'brightness(1.2)' : 'none'
                                }}>
                                  {notification.icon || getNotificationIcon(notification.type)}
                                </span>
                                {isRecent && (
                                  <div style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: '#0d6efd',
                                    marginTop: '2px',
                                    animation: 'pulse 1s infinite'
                                  }} />
                                )}
                              </div>
                              
                              <div style={{
                                flex: 1,
                                minWidth: 0
                              }}>
                                <div style={{
                                  fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                                  lineHeight: '1.4',
                                  fontWeight: isRecent ? '600' : '500',
                                  color: notification.type === 'error' ? '#dc3545' : 'inherit',
                                  marginBottom: '4px'
                                }}>
                                  {notification.message}
                                  {notification.type && (
                                    <span style={{
                                      marginLeft: '6px',
                                      fontSize: '0.65rem',
                                      padding: '1px 4px',
                                      borderRadius: '8px',
                                      background: notification.type === 'error' ? '#dc3545' :
                                                 notification.type === 'warning' ? '#ffc107' :
                                                 notification.type === 'success' ? '#28a745' : '#6c757d',
                                      color: notification.type === 'warning' ? '#000' : '#fff',
                                      fontWeight: '600',
                                      textTransform: 'uppercase'
                                    }}>
                                      {getNotificationPriority(notification.type)}
                                    </span>
                                  )}
                                </div>
                                
                                {isExpanded && notification.details && (
                                  <div style={{
                                    fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                                    color: '#6c757d',
                                    padding: '6px 8px',
                                    background: 'rgba(108, 117, 125, 0.1)',
                                    borderRadius: '6px',
                                    marginBottom: '4px',
                                    borderLeft: '2px solid #6c757d'
                                  }}>
                                    {notification.details}
                                  </div>
                                )}
                                
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginTop: '4px'
                                }}>
                                  <small style={{ 
                                    color: '#6c757d',
                                    fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    🕐 {new Date(notification.createdAt).toLocaleTimeString()}
                                    {notification.category && (
                                      <>
                                        <span>•</span>
                                        <span style={{ textTransform: 'capitalize' }}>
                                          {notification.category}
                                        </span>
                                      </>
                                    )}
                                  </small>
                                  
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markNotificationAsRead(notification.id);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        opacity: 0.7,
                                        transition: 'opacity 0.2s ease'
                                      }}
                                      title="Mark as read"
                                    >
                                      ✅
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSingleNotificationDismiss(notification.id);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        opacity: 0.7,
                                        transition: 'opacity 0.2s ease'
                                      }}
                                      title="Dismiss"
                                    >
                                      ❌
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              <div style={{
                                fontSize: '0.7rem',
                                color: '#6c757d',
                                flexShrink: 0,
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                              }}>
                                ▼
                              </div>
                            </div>
                          </NavDropdown.Item>
                        );
                      })
                    )}
                    
                    {/* Enhanced notification footer */}
                    {sortedNotifications.length > 0 && (
                      <div style={{
                        padding: '8px 12px',
                        borderTop: '1px solid rgba(108, 117, 125, 0.2)',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={markAllAsRead}
                            style={{
                              background: 'linear-gradient(135deg, #28a745 0%, #20a739 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '4px 8px',
                              fontSize: '0.65rem',
                              color: 'white',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.2s ease'
                            }}
                            title="Mark all as read"
                          >
                            ✅ Read All
                          </button>
                          <button
                            onClick={clearAllNotifications}
                            style={{
                              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '4px 8px',
                              fontSize: '0.65rem',
                              color: 'white',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.2s ease'
                            }}
                            title="Clear all notifications"
                          >
                            🗑️ Clear
                          </button>
                        </div>
                        
                        <div style={{
                          fontSize: '0.65rem',
                          color: '#6c757d',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>📊</span>
                          <span>
                            {filteredNotifications.length} of {globalNotifications.length}
                          </span>
                        </div>
                      </div>
                    )}

                    {sortedNotifications.length > 8 && (
                      <NavDropdown.Item 
                        style={{ 
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#0d6efd',
                          background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.05) 100%)',
                          borderTop: '1px solid rgba(13, 110, 253, 0.2)'
                        }}
                        onClick={() => {
                          // Could implement a full notifications page here
                          setNotificationFilter('all');
                          console.log('Show all notifications');
                        }}
                      >
                        📋 View All {globalNotifications.length} Notifications
                      </NavDropdown.Item>
                    )}
                    
                    <NavDropdown.Divider />
                    
                    {/* Updates Section */}
                    <div style={{ 
                      padding: 'clamp(6px, 2vw, 8px) clamp(10px, 3vw, 16px)', 
                      background: '#f8f9fa', 
                      borderBottom: '1px solid #eee' 
                    }}>
                      <strong style={{ 
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)', 
                        color: '#495057' 
                      }}>📈 Updates</strong>
                    </div>
                    <NavDropdown.Item style={{ 
                      padding: 'clamp(6px, 2vw, 8px) clamp(10px, 3vw, 12px)',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'clamp(4px, 1.5vw, 6px)',
                        marginBottom: '4px'
                      }}>
                        <span style={{ 
                          flexShrink: 0,
                          lineHeight: 1
                        }}>🎨</span>
                        <div style={{
                          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                          lineHeight: '1.3',
                          flex: 1,
                          minWidth: 0
                        }}>
                          Portfolio v2.5 - New animations added
                        </div>
                      </div>
                      <small style={{ 
                        color: '#6c757d',
                        fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                        display: 'block',
                        marginLeft: 'clamp(14px, 3.5vw, 18px)'
                      }}>2 hours ago</small>
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
                    <div style={{ 
                      padding: 'clamp(6px, 2vw, 8px) clamp(10px, 3vw, 16px)', 
                      background: '#f8f9fa', 
                      borderBottom: '1px solid #eee' 
                    }}>
                      <strong style={{ 
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)', 
                        color: '#495057' 
                      }}>👥 Accounts</strong>
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
                )}

                {/* Subscribe and Auth Section */}
                <Nav.Link
                  onClick={() => {
                    setShowSubscribeModal(true);
                    handleNavClick();
                  }}
                  style={{ 
                    cursor: 'pointer', 
                    color: currentTheme === 'light' ? '#212529' : '#e9ecef', 
                    marginRight: '6px',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                  className="nav-icon-hover"
                  title="Subscribe to Updates"
                >
                  <span className="nav-icon-wrapper">
                    📧
                    <span className="nav-text-hover">Subscribe</span>
                  </span>
                </Nav.Link>

                {authUser ? (
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip id="user-tooltip">
                        {authUser.name}
                      </Tooltip>
                    }
                  >
                    <div>
                      <NavDropdown
                        title="👤"
                        id="user-dropdown"
                        align="end"
                        style={{ marginRight: '6px' }}
                        className="user-dropdown"
                        menuVariant={currentTheme === 'dark' ? 'dark' : 'light'}
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
                    <NavDropdown.Item onClick={handleLogout} title="Logout">
                      🚪
                    </NavDropdown.Item>
                    {(authUser.isAdmin || authUser.role === 'administrator') && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => setShowAdminDashboard(true)} title="Admin Dashboard">
                          👑
                        </NavDropdown.Item>
                      </>
                    )}
                      </NavDropdown>
                    </div>
                  </OverlayTrigger>
                ) : showLoginButton ? (
                  <Nav.Link
                    onClick={() => {
                      setAuthMode('login');
                      setShowLogin(true);
                      handleNavClick();
                    }}
                    style={{ cursor: 'pointer', color: currentTheme === 'light' ? '#212529' : '#e9ecef', marginRight: '6px' }}
                    title="Login"
                  >
                    👤
                  </Nav.Link>
                ) : null
                }

                {/* Theme Toggle */}
                <Nav.Link
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      toggleTheme();
                    } catch (error) {
                      console.error('Theme toggle error:', error);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.5rem',
                    color: currentTheme === 'light' ? '#212529' : '#e9ecef',
                    marginRight: '6px',
                    transition: 'color 0.3s ease, transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                  aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
                  title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
                >
                  {currentTheme === 'light' ? '🌙' : '☀️'}
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
              backgroundColor: currentTheme === 'light' ? '#ffffff' : '#343a40',
              color: currentTheme === 'light' ? '#212529' : '#ffffff',
              borderBottom: `1px solid ${currentTheme === 'light' ? '#dee2e6' : '#495057'}`
            }}>
              <Modal.Title>{authMode === 'login' ? 'Login' : 'Sign Up'}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ 
              backgroundColor: currentTheme === 'light' ? '#ffffff' : '#343a40',
              color: currentTheme === 'light' ? '#212529' : '#ffffff'
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
            backgroundColor: currentTheme === 'light' ? '#ffffff' : '#343a40',
            color: currentTheme === 'light' ? '#212529' : '#ffffff',
            borderTop: `1px solid ${currentTheme === 'light' ? '#dee2e6' : '#495057'}`
          }}>
            <div className="w-100 text-center">
              {authMode === 'login' ? (
                <span>
                  Want to stay updated?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => {
                      setShowLogin(false);
                      setShowSubscribeModal(true);
                    }}
                  >
                    Subscribe here
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

        {/* Subscription Modal */}
        <Modal 
          show={showSubscribeModal} 
          onHide={() => setShowSubscribeModal(false)}
          centered
          className="subscribe-modal"
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
            <Modal.Header 
              closeButton 
              style={{
                backgroundColor: currentTheme === 'light' ? '#ffffff' : '#343a40',
                color: currentTheme === 'light' ? '#212529' : '#ffffff',
                borderBottom: `1px solid ${currentTheme === 'light' ? '#dee2e6' : '#495057'}`
              }}
            >
              <Modal.Title>
                <FaBell className="me-2" />
                Subscribe to Updates
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ 
              backgroundColor: currentTheme === 'light' ? '#ffffff' : '#343a40',
              color: currentTheme === 'light' ? '#212529' : '#ffffff'
            }}>
              <div className="subscribe-intro mb-3">
                <p>Stay updated with my latest 3D projects, tutorials, and creative insights!</p>
                <ul className="list-unstyled">
                  <li><FaCheck className="me-2 text-success" />Latest project updates</li>
                  <li><FaCheck className="me-2 text-success" />Behind-the-scenes content</li>
                  <li><FaCheck className="me-2 text-success" />Exclusive tutorials</li>
                  <li><FaCheck className="me-2 text-success" />Creative process insights</li>
                </ul>
              </div>
              
              {subscribeStatus && (
                <Alert 
                  variant={subscribeStatus.includes('🎉') ? 'success' : 'danger'}
                  className="mb-3"
                >
                  {subscribeStatus}
                </Alert>
              )}
              
              <Form onSubmit={handleSubscribe}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={subscribeForm.name}
                    onChange={handleSubscribeInputChange}
                    placeholder="Your full name"
                    disabled={isSubscribing}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={subscribeForm.email}
                    onChange={handleSubscribeInputChange}
                    placeholder="your.email@example.com"
                    disabled={isSubscribing}
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <FaBell className="me-2" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </div>
        </Modal>

        {/* Admin Dashboard */}
        {showAdminDashboard && authUser && (authUser.isAdmin || authUser.role === 'administrator') && (
          <AdminDashboard
            user={authUser}
            onClose={() => setShowAdminDashboard(false)}
          />
        )}
      </>
    );
}

export default Navigation;

