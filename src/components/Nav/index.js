import React, { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




function Navigation(props) {
    const { currentTab, setCurrentTab } = props;

    // control navbar expanded state (so we can close it after clicking an item on mobile)
    const [expanded, setExpanded] = useState(false);
    // announce theme changes for screen readers
    const [themeAnnounce, setThemeAnnounce] = useState('');

    // notifications (persisted) + optional desktop push
    const [notifications, setNotifications] = useState(() => {
      try { return JSON.parse(localStorage.getItem('nebula_notifications') || '[]'); } catch { return []; }
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifAnnounce, setNotifAnnounce] = useState('');

    // desktop push state (persisted)
    const [pushEnabled, setPushEnabled] = useState(() => {
      try { return localStorage.getItem('nebula_push') === '1'; } catch { return false; }
    });
    const [pushPermission, setPushPermission] = useState(() => {
      try { return (typeof Notification !== 'undefined') ? Notification.permission : 'default'; } catch { return 'default'; }
    });
    // per-device web-push subscription (persisted)
    const [pushSubscription, setPushSubscription] = useState(() => {
      try { const s = localStorage.getItem('nebula_push_sub'); return s && s.length ? JSON.parse(s) : null; } catch { return null; }
    });
    // auth (login) state
    const [authToken, setAuthToken] = useState(() => { try { return localStorage.getItem('nebula_auth_token') || null; } catch { return null; } });
    const [authUser, setAuthUser] = useState(() => { try { return JSON.parse(localStorage.getItem('nebula_auth_user') || 'null'); } catch { return null; } });
    // local admin credentials (persisted in localStorage). Change these via localStorage keys 'nebula_admin_name' / 'nebula_admin_pass' or via setLocalAdmin helper below.
    const [adminCreds, setAdminCreds] = useState(() => {
      try {
        return {
          name: localStorage.getItem('nebula_admin_name') || 'admin',
          pass: localStorage.getItem('nebula_admin_pass') || 'admin123'
        };
      } catch (e) { return { name: 'admin', pass: 'admin123' }; }
    });
    const setLocalAdmin = (name, pass) => {
      try { localStorage.setItem('nebula_admin_name', name); localStorage.setItem('nebula_admin_pass', pass); setAdminCreds({ name, pass }); } catch (e) {}
    };
    // is the current authenticated user an administrator?
    const isAdmin = (() => {
      try {
        if (!authUser) return false;
        if (typeof authUser === 'object') return Boolean(authUser.isAdmin || authUser.admin || (String(authUser.username || authUser.user || authUser).toLowerCase() === (adminCreds.name || '').toLowerCase()));
        return String(authUser).toLowerCase() === (adminCreds.name || '').toLowerCase();
      } catch (e) { return false; }
    })();
    const [showLogin, setShowLogin] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginBusy, setLoginBusy] = useState(false);
    const [loginMsg, setLoginMsg] = useState('');
    const [loginErrors, setLoginErrors] = useState([]); // list of validation errors
    const [loginValid, setLoginValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

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

    useEffect(() => { try { localStorage.setItem('nebula_push_sub', pushSubscription ? JSON.stringify(pushSubscription) : ''); } catch(e){} }, [pushSubscription]);
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
    useEffect(() => { try { localStorage.setItem('nebula_push', pushEnabled ? '1' : '0'); } catch(e){} }, [pushEnabled]);
    // convert URL-safe base64 (VAPID) to Uint8Array
    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    };

    const sendSubscriptionToServer = async (subscription) => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
        await fetch('/api/subscribe', { method: 'POST', headers, body: JSON.stringify({ subscription }) });
      } catch (e) { /* ignore network failures */ }
    };
    const removeSubscriptionFromServer = async (subscription) => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
        await fetch('/api/unsubscribe', { method: 'POST', headers, body: JSON.stringify({ subscription }) });
      } catch (e) {}
    };

    const subscribeForPush = async () => {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          setNotifAnnounce('Push not supported in this browser'); setTimeout(() => setNotifAnnounce(''), 1400); return;
        }
        if (Notification.permission !== 'granted') {
          await requestPushPermission();
          if (Notification.permission !== 'granted') return;
        }
        const vapidKey = window.__VAPID_PUBLIC_KEY || localStorage.getItem('nebula_vapid');
        if (!vapidKey) { setNotifAnnounce('VAPID key missing; contact server'); setTimeout(() => setNotifAnnounce(''), 1400); return; }
        const reg = await navigator.serviceWorker.register('/sw.js').catch(() => null);
        if (!reg) { setNotifAnnounce('Service worker registration failed'); setTimeout(() => setNotifAnnounce(''), 1400); return; }
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidKey) });
        const js = sub.toJSON ? sub.toJSON() : sub;
        setPushSubscription(js);
        setPushEnabled(true);
        localStorage.setItem('nebula_push_sub', JSON.stringify(js));
        await sendSubscriptionToServer(js);
        setNotifAnnounce('Subscribed for push on this device');
        setTimeout(() => setNotifAnnounce(''), 1600);
      } catch (e) {
        setNotifAnnounce('Subscription failed'); setTimeout(() => setNotifAnnounce(''), 1400);
      }
    };

    const unsubscribePush = async () => {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const js = sub.toJSON ? sub.toJSON() : sub;
          await sub.unsubscribe();
          await removeSubscriptionFromServer(js);
          localStorage.removeItem('nebula_push_sub');
          setPushSubscription(null);
          setPushEnabled(false);
          setNotifAnnounce('Unsubscribed from push');
          setTimeout(() => setNotifAnnounce(''), 1200);
        }
      } catch (e) {
        setNotifAnnounce('Unsubscribe failed'); setTimeout(() => setNotifAnnounce(''), 1200);
      }
    };

    const notifyAllDevices = async (message) => {
      try {
        const msg = (message || '').toString().trim().slice(0, 500);
        if (!msg) { setNotifAnnounce('No message provided'); setTimeout(() => setNotifAnnounce(''), 1200); return; }
        if (!authToken) {
          // require login first
          setNotifAnnounce('Please login to send notifications');
          setShowLogin(true);
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        const res = await fetch('/api/notify-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          credentials: 'same-origin',
          body: JSON.stringify({ message: msg })
        });
        if (res.ok) {
          setNotifAnnounce('Notification sent to all devices (server)');
        } else if (res.status === 401) {
          setNotifAnnounce('Unauthorized — please login again');
          // auto-logout on unauthorized
          setAuthToken(null); setAuthUser(null);
        } else {
          setNotifAnnounce('Server failed to send notification');
        }
        setTimeout(() => setNotifAnnounce(''), 1600);
      } catch (e) {
        setNotifAnnounce('Failed to notify all devices');
        setTimeout(() => setNotifAnnounce(''), 1200);
      }
    };

    const copySubscriptionToClipboard = async () => {
      try {
        if (!pushSubscription) { setNotifAnnounce('No subscription to copy'); setTimeout(() => setNotifAnnounce(''), 1200); return; }
        const txt = JSON.stringify(pushSubscription);
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(txt);
        else { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
        setNotifAnnounce('Subscription copied');
        setTimeout(() => setNotifAnnounce(''), 1200);
      } catch (e) { setNotifAnnounce('Copy failed'); setTimeout(() => setNotifAnnounce(''), 1200); }
    };

    // sync prior subscription on mount
    useEffect(() => {
      (async () => {
        try {
          if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
          const reg = await navigator.serviceWorker.getRegistration();
          if (!reg) return;
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            const js = sub.toJSON ? sub.toJSON() : sub;
            setPushSubscription(js);
            localStorage.setItem('nebula_push_sub', JSON.stringify(js));
            setPushEnabled(true);
          } else {
            const saved = localStorage.getItem('nebula_push_sub');
            if (saved) setPushSubscription(JSON.parse(saved));
          }
        } catch (e) {}
      })();
    }, []);
 
    const unreadCount = notifications.filter(n => !n.read).length;

    const sendDesktopNotification = (title, body) => {
      try {
        if (typeof Notification === 'undefined') return;
        if (Notification.permission !== 'granted' || !pushEnabled) return;
        new Notification(title || 'Colin Nebula', { body: body || '', icon: logoM });
      } catch (e) {}
    };
    // send a quick test notification and announce outcome
    const testDesktopNotification = () => {
      try {
        if (typeof Notification === 'undefined') {
          setNotifAnnounce('Notifications not supported');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        if (Notification.permission !== 'granted') {
          setNotifAnnounce('Please enable desktop notifications first');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        if (!pushEnabled) {
          setNotifAnnounce('Desktop notifications are disabled in settings');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        sendDesktopNotification('Test — Colin Nebula', 'This is a test notification.');
        setNotifAnnounce('Test notification sent');
        setTimeout(() => setNotifAnnounce(''), 1400);
      } catch (e) {
        setNotifAnnounce('Test failed');
        setTimeout(() => setNotifAnnounce(''), 1400);
      }
    };

    const requestPushPermission = async () => {
      try {
        if (typeof Notification === 'undefined' || !Notification.requestPermission) {
          setNotifAnnounce('Notifications not supported in this browser');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        const p = await Notification.requestPermission();
        setPushPermission(p);
        if (p === 'granted') {
          setPushEnabled(true);
          setNotifAnnounce('Desktop notifications enabled');
        } else {
          setPushEnabled(false);
          setNotifAnnounce(p === 'denied' ? 'Desktop notifications blocked' : 'Desktop notifications not enabled');
        }
        setTimeout(() => setNotifAnnounce(''), 1400);
      } catch (e) {
        setNotifAnnounce('Notification permission request failed');
        setTimeout(() => setNotifAnnounce(''), 1400);
      }
    };

    const addNotification = (text) => {
      const n = { id: Date.now(), text, read: false, ts: new Date().toISOString() };
      setNotifications(s => [n, ...s]);
      setNotifAnnounce(text);
      // desktop push when enabled & permitted
      if (pushEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        sendDesktopNotification('Colin Nebula', text);
      }
    };
    // small dev hook to add notifications from console
    try { window.__addNebulaNotification = addNotification; } catch(e) {}

    const markAllRead = () => {
      setNotifications(s => s.map(n => ({ ...n, read: true })));
      setNotifAnnounce('All notifications marked read');
      setTimeout(() => setNotifAnnounce(''), 900);
    };
    const clearNotifications = () => {
      setNotifications([]);
      setNotifAnnounce('Notifications cleared');
      setTimeout(() => setNotifAnnounce(''), 900);
    };

    // initialize user-preference: 'light' | 'dark' | 'auto'
    const [theme, setTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        if (saved) return saved; // allow 'auto'
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
      // set initial state
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // apply theme (supports 'auto' which follows system preference)
    useEffect(() => {
      let mq;
      const apply = (mode) => {
        try {
          // small transition class (skip when user prefers reduced motion)
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
    }, [theme]);

    // cycle theme: light -> dark -> auto -> light
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light');
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

    // restore last tab on mount
    useEffect(() => {
      try {
        const saved = localStorage.getItem('nebula_currentTab');
        if (saved && saved !== currentTab) setCurrentTab(saved);
      } catch (e) { /* ignore */ }
    }, []); // run once

    // central navigation handler
    const navClick = (tab) => {
      setCurrentTab(tab);
      setExpanded(false); // close mobile menu after navigation
      try { localStorage.setItem('nebula_currentTab', tab); } catch (e) {}
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // keyboard activation for accessibility
    const onKeyActivate = (e, tab) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navClick(tab);
      }
    };

    // logout helper (clear auth state and persisted items)
    const logout = async () => {
      try {
        setAuthToken(null);
        setAuthUser(null);
        try {
          localStorage.removeItem('nebula_auth_token');
          localStorage.removeItem('nebula_auth_user');
        } catch (e) {}
        setShowLogin(false);
        setNotifAnnounce('Logged out');
        setTimeout(() => setNotifAnnounce(''), 1000);
      } catch (e) {}
    };

    // login helper (authenticate and persist auth state)
    const login = async () => {
      // prevent submit if invalid client-side
      if (!loginValid) {
        setLoginMsg('Please fix the highlighted errors');
        return;
      }
      try {
        setLoginBusy(true);
        setLoginMsg('');
        const payload = { email: (loginEmail || '').trim(), password: loginPassword || '' };
        // local admin check (short-circuits server call)
        try {
          if (payload.email && payload.password && adminCreds && payload.email.toLowerCase() === (adminCreds.name || '').toLowerCase() && payload.password === (adminCreds.pass || '')) {
            // sign in locally as admin
            setAuthToken('local-admin-token');
            setAuthUser({ username: adminCreds.name, isAdmin: true });
            setShowLogin(false);
            setLoginEmail('');
            setLoginPassword('');
            setLoginMsg('');
            setNotifAnnounce('Admin logged in');
            setTimeout(() => setNotifAnnounce(''), 1000);
            setLoginBusy(false);
            return;
          }
        } catch (e) {}
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          const token = data.token || data.authToken || null;
          const user = data.user || data.username || payload.email || null;
          if (token) {
            setAuthToken(token);
            setAuthUser(user);
            // persist according to rememberMe
            try {
              if (rememberMe) localStorage.setItem('nebula_auth_token', token);
              else sessionStorage.setItem('nebula_auth_token', token);
            } catch (e) {}
            // inform server of current device subscription (if present)
            try { if (pushSubscription) await sendSubscriptionToServer(pushSubscription); } catch (e) { /* ignore */ }
            setShowLogin(false);
            setLoginEmail('');
            setLoginPassword('');
            setLoginMsg('');
            setNotifAnnounce('Logged in');
            setTimeout(() => setNotifAnnounce(''), 1000);
          } else {
            setLoginMsg(data.message || 'Login succeeded but no token returned');
          }
        } else {
          const err = await res.json().catch(() => ({}));
          setLoginMsg(err.message || (res.status === 401 ? 'Invalid email or password' : 'Login failed'));
        }
      } catch (e) {
        setLoginMsg('Network error during login');
      } finally {
        setLoginBusy(false);
      }
    };

    const handleForgot = () => {
      const email = (loginEmail || '').trim();
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setLoginMsg('Enter your email above to receive reset instructions');
        return;
      }
      // graceful fallback: simulate sending reset link
      setLoginMsg('If this email is registered, a reset link has been sent (simulated).');
      setTimeout(() => setLoginMsg(''), 4000);
    };

  // toggle notifications with 'n'
  useEffect(() => {
    const kHandler = (e) => {
      if (e.key && e.key.toLowerCase() === 'n') {
        // only admins can toggle notifications
        if (!isAdmin) return;
        // ignore typing in inputs
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
        setShowNotifications(s => !s);
      }
    };
    window.addEventListener('keydown', kHandler);
    return () => window.removeEventListener('keydown', kHandler);
  }, [isAdmin]);
  return (
    <Navbar
      expanded={expanded}
      onToggle={setExpanded}
      bg="dark"
      expand="md"
      variant="dark"
      sticky="top"
      collapseOnSelect
      role="navigation"
      aria-label="Main navigation"
      className={isSticky ? 'navbar navbar-scrolled' : 'navbar'}
      style={{
        transition: prefersReducedMotion ? 'none' : 'box-shadow 200ms, padding 200ms',
        boxShadow: isSticky ? '0 8px 24px rgba(0,0,0,0.20)' : 'none',
        paddingTop: isSticky ? 6 : undefined,
        paddingBottom: isSticky ? 6 : undefined,
      }}
    >
      <Container>
        <Navbar.Brand href="home">
        <img src={logoM} width="90px" height="40px" alt="logo" />
        Colin Nebula 3D 
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" />
        <Navbar.Collapse id="basic-navbar-nav" aria-label="Primary">
          <Nav className="ms-auto">
            {/* Home */}
            <Nav.Link className={currentTab === "home" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("home")}
                onKeyDown={(e) => onKeyActivate(e, "home")}
                aria-current={currentTab === "home" ? "page" : undefined}
                title="Go to Home"
              >
                Home
              </button>
            </Nav.Link>

            {/* Portfolio */}
            <Nav.Link className={currentTab === "portfolio" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("portfolio")}
                onKeyDown={(e) => onKeyActivate(e, "portfolio")}
                aria-current={currentTab === "portfolio" ? "page" : undefined}
                title="Go to Portfolio"
              >
                Portfolio
              </button>
            </Nav.Link>

            {/* Artwork */}
            <Nav.Link className={currentTab === "artwork" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("artwork")}
                onKeyDown={(e) => onKeyActivate(e, "artwork")}
                aria-current={currentTab === "artwork" ? "page" : undefined}
                title="Go to Artwork"
              >
                Artwork
              </button>
            </Nav.Link>

            {/* Animation */}
            <Nav.Link className={currentTab === "animation" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("animation")}
                onKeyDown={(e) => onKeyActivate(e, "animation")}
                aria-current={currentTab === "animation" ? "page" : undefined}
                title="Go to Animation"
              >
                Animation
              </button>
            </Nav.Link>

            {/* VFX / Video Editing */}
            <Nav.Link className={currentTab === "video-editing" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("video-editing")}
                onKeyDown={(e) => onKeyActivate(e, "video-editing")}
                aria-current={currentTab === "video-editing" ? "page" : undefined}
                title="Go to VFX"
              >
                VFX
              </button>
            </Nav.Link>

            {/* Theme toggle */}
            <div className="mx-2" style={{ display: 'flex', alignItems: 'center' }}>
              {/* Notifications (visible only to administrators) */}
              {isAdmin && (
                <NavDropdown
                  title={<span aria-hidden="true">🔔{unreadCount > 0 && <span className="badge bg-danger ms-1" style={{fontSize:11}}>{unreadCount}</span>}</span>}
                  id="nav-notifications"
                  align="end"
                  menuVariant="dark"
                  show={showNotifications}
                  onToggle={(next) => setShowNotifications(next)}
                  aria-label={`Notifications (${unreadCount} unread)`}
                >
                  <NavDropdown.Item as="div" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ flex: 1, fontSize: 13 }}>
                      Desktop notifications: <strong>{pushEnabled && pushPermission === 'granted' ? 'On' : (pushPermission === 'denied' ? 'Blocked' : 'Off')}</strong>
                      {pushSubscription && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Subscribed on this device</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={async () => {
                          if (typeof Notification === 'undefined') { setNotifAnnounce('Notifications not supported'); setTimeout(() => setNotifAnnounce(''), 1400); return; }
                          if (Notification.permission === 'granted') {
                            if ('serviceWorker' in navigator && 'PushManager' in window) {
                              if (pushSubscription) await unsubscribePush();
                              else await subscribeForPush();
                            } else {
                              setPushEnabled(s => { const v = !s; setNotifAnnounce(v ? 'Desktop notifications enabled' : 'Desktop notifications disabled'); setTimeout(() => setNotifAnnounce(''), 1200); return v; });
                            }
                          } else {
                            await requestPushPermission();
                          }
                        }}
                        aria-label="Toggle desktop notifications / subscribe"
                      >
                        {pushSubscription ? 'Unsubscribe' : (pushEnabled && pushPermission === 'granted' ? 'Disable' : 'Enable')}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={testDesktopNotification}
                        aria-label="Send test desktop notification"
                        title="Send test notification"
                      >
                        Test
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => copySubscriptionToClipboard()}
                        aria-label="Copy push subscription"
                        title="Copy subscription"
                      >
                        Copy
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => {
                          const msg = window.prompt('Message to send to all devices (server)', 'Hello from Colin Nebula!');
                          if (msg) notifyAllDevices(msg);
                        }}
                        aria-label="Send push to all devices"
                        title="Send push via server"
                      >
                        Notify all
                      </button>
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {notifications.length === 0 ? (
                    <NavDropdown.Item as="div">No notifications</NavDropdown.Item>
                  ) : (
                    notifications.map(n => (
                      <NavDropdown.Item key={n.id} as="div" style={{ whiteSpace: 'normal' }}>
                        <div>{n.text}</div>
                        <small className="text-muted">{new Date(n.ts).toLocaleString()}</small>
                      </NavDropdown.Item>
                    ))
                  )}
                  <NavDropdown.Item as="button" onClick={markAllRead}>Mark all read</NavDropdown.Item>
                  <NavDropdown.Item as="button" onClick={clearNotifications}>Clear</NavDropdown.Item>
                </NavDropdown>
              )}
               <button
                 type="button"
                 className="nav-button"
                 onClick={toggleTheme}
                 aria-pressed={appliedTheme === 'dark'}
                 aria-label={`Toggle theme (preference: ${theme}; applied: ${appliedTheme}). Press T to toggle.`}
                 title={`Theme: ${theme === 'auto' ? 'Auto (follows system)' : (theme === 'light' ? 'Light' : 'Dark')} — press T to toggle`}
                 style={{ padding: '6px 10px' }}
               >
                 {theme === 'auto' ? '🌓 Auto' : (appliedTheme === 'light' ? '🌞 Light' : '🌙 Dark')}
                </button>
               <button
                 type="button"
                 className="btn btn-sm btn-outline-light"
                 onClick={() => { authToken ? logout() : setShowLogin(true); }}
                 style={{ marginLeft: 8 }}
                 aria-label={authToken ? 'Logout' : 'Login'}
               >
                 {authToken ? (typeof authUser === 'string' ? `Logout (${authUser})` : `Logout`) : 'Login'}
               </button>
               {/* Login modal (form-backed) */}
               <Modal show={showLogin} onHide={() => setShowLogin(false)} centered fullscreen="sm-down" aria-labelledby="nav-login-title">
                 <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                   <Modal.Header closeButton>
                     <Modal.Title id="nav-login-title">Sign in</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <label htmlFor="login-email" className="visually-hidden">Email</label>
                       <input id="login-email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" className="form-control" required aria-describedby={loginErrors.length ? 'login-errors' : undefined} />
                       <label htmlFor="login-password" className="visually-hidden">Password</label>
                       <div style={{ display: 'flex', gap: 8 }}>
                         <input id="login-password" type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Password" className="form-control" required aria-describedby={loginErrors.length ? 'login-errors' : undefined} />
                         <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(s => !s)} aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                           {showPassword ? 'Hide' : 'Show'}
                         </button>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                         <input id="remember-me" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                         <label htmlFor="remember-me" style={{ fontSize: 13 }}>Remember me</label>
                         <button type="button" className="btn btn-link btn-sm" onClick={handleForgot} style={{ marginLeft: 'auto' }}>Forgot password?</button>
                       </div>
                       {loginErrors.length > 0 && (
                         <div id="login-errors" className="text-danger" role="alert" aria-live="assertive" style={{ marginTop: 8 }}>
                           <ul style={{ margin: 0, paddingLeft: 18 }}>{loginErrors.map((e,i) => <li key={i}>{e}</li>)}</ul>
                         </div>
                       )}
                       {loginMsg && !loginErrors.length && <div className="text-danger" role="status" aria-live="polite" style={{ marginTop: 8 }}>{loginMsg}</div>}
                     </div>
                   </Modal.Body>
                   <Modal.Footer>
                     <Button variant="secondary" onClick={() => setShowLogin(false)}>Cancel</Button>
                     <Button type="submit" variant="primary" disabled={loginBusy || !loginValid} aria-disabled={loginBusy || !loginValid}>
                       {loginBusy ? (<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Signing in…</>) : 'Sign in'}
                     </Button>
                   </Modal.Footer>
                 </form>
               </Modal>
                {/* announce current theme to screen readers */}
                <span className="visually-hidden" aria-live="polite">{themeAnnounce}</span>
                {/* announce notifications changes */}
                <span className="visually-hidden" aria-live="polite">{notifAnnounce}</span>
            </div>

            {/* More dropdown */}
            <NavDropdown title="More" id="nav-more" align="end" menuVariant="dark" aria-label="More links">
              <NavDropdown.Item href="./components/Private-policy" target="_blank" rel="noopener noreferrer" title="Open Privacy Policy">Privacy Policy</NavDropdown.Item>
              <NavDropdown.Item href="mailto:colinnebula@gmail.com" title="Email Colin">Contact</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://github.com/ColinNebula" target="_blank" rel="noopener noreferrer" title="Open GitHub">GitHub</NavDropdown.Item>
            </NavDropdown>
 
            <NavDropdown.Divider />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;