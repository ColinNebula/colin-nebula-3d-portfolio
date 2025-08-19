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

    // apply theme (supports 'auto' which follows system preference)
    useEffect(() => {
      let mq;
      const apply = (mode) => {
        try {
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
  return (
    <Navbar expanded={expanded} onToggle={setExpanded} bg="dark" expand="md" variant="dark" sticky="top" collapseOnSelect role="navigation" aria-label="Main navigation">
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
              <button
                type="button"
                className="nav-button"
                onClick={toggleTheme}
                aria-pressed={appliedTheme === 'light'}
                title={`Theme: ${theme === 'auto' ? 'Auto (follows system)' : (theme === 'light' ? 'Light' : 'Dark')} — press T to toggle`}
                style={{ padding: '6px 10px' }}
              >
                {theme === 'auto' ? '🌓 Auto' : (theme === 'light' ? '🌞 Light' : '🌙 Dark')}
               </button>
               {/* announce current theme to screen readers */}
               <span className="visually-hidden" aria-live="polite">{themeAnnounce}</span>
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