import React, { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

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

    useEffect(() => {
      try { localStorage.setItem('nebula_notifications', JSON.stringify(notifications)); } catch (e) {}
    }, [notifications]);
    useEffect(() => { try { localStorage.setItem('nebula_push', pushEnabled ? '1' : '0'); } catch(e){} }, [pushEnabled]);

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
  // toggle notifications with 'n'
  useEffect(() => {
    const kHandler = (e) => {
      if (e.key && e.key.toLowerCase() === 'n') {
        // ignore typing in inputs
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
        setShowNotifications(s => !s);
      }
    };
    window.addEventListener('keydown', kHandler);
    return () => window.removeEventListener('keydown', kHandler);
  }, []);
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
              {/* Notifications */}
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
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        if (typeof Notification === 'undefined') { setNotifAnnounce('Notifications not supported'); setTimeout(() => setNotifAnnounce(''), 1400); return; }
                        if (Notification.permission === 'granted') {
                          setPushEnabled(s => { const v = !s; setNotifAnnounce(v ? 'Desktop notifications enabled' : 'Desktop notifications disabled'); setTimeout(() => setNotifAnnounce(''), 1200); return v; });
                        } else {
                          requestPushPermission();
                        }
                      }}
                      aria-label="Toggle desktop notifications"
                    >
                      {pushEnabled && pushPermission === 'granted' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={testDesktopNotification}
                      aria-label="Send test desktop notification"
                      title="Send test notification"
                    >
                      Test
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
                <NavDropdown.Divider />
                <NavDropdown.Item as="button" onClick={markAllRead}>Mark all read</NavDropdown.Item>
                <NavDropdown.Item as="button" onClick={clearNotifications}>Clear</NavDropdown.Item>
              </NavDropdown>
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
               {/* announce current theme to screen readers */}
               <span className="visually-hidden" aria-live="polite">{themeAnnounce}</span>
               {/* announce notifications changes */}
               <span className="visually-hidden" aria-live="polite">{notifAnnounce}</span>
            </div>

            {/* More dropdown */}
            <NavDropdown title="More" id="nav-more" align="end" menuVariant="dark" aria-label="More links">
              <NavDropdown.Item href="/resume" target="_blank" rel="noopener noreferrer" title="Open Resume">Resume</NavDropdown.Item>
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