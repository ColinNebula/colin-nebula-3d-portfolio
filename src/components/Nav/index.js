import React, { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation(props) {
    const { currentTab, setCurrentTab } = props;

    // theme state (persisted)
    const [theme, setTheme] = useState(() => {
      try { return localStorage.getItem('nebula_theme') || 'dark'; } catch { return 'dark'; }
    });

    // apply theme class to body and persist
    useEffect(() => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
      }
      try { localStorage.setItem('nebula_theme', theme); } catch (e) {}
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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
    <Navbar bg="dark" expand="md" variant="dark" sticky="top" collapseOnSelect role="navigation" aria-label="Main navigation">
      <Container>
        <Navbar.Brand href="home">
        <img src={logoM} width="90px" height="40px" alt="logo" />
        Colin Nebula 3D 
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
                aria-pressed={theme === 'light'}
                title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                style={{ padding: '6px 10px' }}
              >
                {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
              </button>
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