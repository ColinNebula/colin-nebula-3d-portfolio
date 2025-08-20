import React, { useState, useEffect, useRef } from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import shapeAnimation from '../../assets/images/shapeAnimation.png';
import rundown from '../../assets/images/rundown.png';
import rigging from '../../assets/images/rigging.png';
import { Card, Container, Button, Col, Row, CardGroup, NavDropdown, Modal } from 'react-bootstrap';
import SocialIcons from '../SocialIcons';

function Animation() {
  // modals
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);

  // features / prefs
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showLegend, setShowLegend] = useState(() => {
    try { return localStorage.getItem('animation_showLegend') === '1'; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem('animation_showLegend', showLegend ? '1' : '0'); } catch(e){} }, [showLegend]);
  const [shareMsg, setShareMsg] = useState('');

  // refs
  const lastActiveRef = useRef(null);
  const freeIframeRef = useRef(null);
  const riggingIframeRef = useRef(null);
  const shapeIframeRef = useRef(null);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const currentYear = new Date().getFullYear();

  // reel ids / urls
  const REEL_IDS = {
    freeRider: 'N2WhwHaicR4',
    rigging: 'lIrnDytiNxA',
    shape: 'FVVFcjpg5eA'
  };
  const REEL_URLS = {
    freeRider: `https://www.youtube.com/watch?v=${REEL_IDS.freeRider}`,
    rigging: `https://www.youtube.com/watch?v=${REEL_IDS.rigging}`,
    shape: `https://www.youtube.com/watch?v=${REEL_IDS.shape}`
  };

  // preconnect + analytics note
  const preconnectYouTube = () => {
    try {
      if (typeof document === 'undefined') return;
      const add = (rel, href) => {
        if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
          const l = document.createElement('link');
          l.rel = rel;
          l.href = href;
          l.crossOrigin = 'anonymous';
          document.head.appendChild(l);
        }
      };
      add('preconnect', 'https://www.youtube.com');
      add('preconnect', 'https://www.google.com');
    } catch (e) {}
  };
  const noteOpen = (label) => { try { console.info('analytics','open_link', label); } catch (e) {} };

  // build embed src (enablejsapi so we can postMessage)
  const getEmbedSrc = (id) => {
    const p = new URLSearchParams();
    p.set('rel','0');
    p.set('modestbranding','1');
    p.set('playsinline','1');
    p.set('enablejsapi','1');
    try { if (typeof window !== 'undefined' && window.location && window.location.origin) p.set('origin', window.location.origin); } catch (e) {}
    if (autoplay) p.set('autoplay','1');
    if (muted) p.set('mute','1');
    return `https://www.youtube.com/embed/${id}?${p.toString()}`;
  };

  // pause player via postMessage (requires enablejsapi=1)
  const pauseYouTube = (ref) => {
    try {
      const f = ref && ref.current;
      if (!f || !f.contentWindow) return;
      const msg = JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] });
      f.contentWindow.postMessage(msg, '*');
    } catch (e) {}
  };

  // copy helper
  const copyToClipboard = async (text, setMsg) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setMsg('Copied!');
      console.info('analytics', 'copy_link', text);
      setTimeout(() => setMsg(''), 1400);
    } catch {
      setMsg('Copy failed');
      setTimeout(() => setMsg(''), 1400);
    }
  };

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === '1') scrollToTopAndOpen(() => setLgShow(true), 'freeRider');
      if (k === '2') scrollToTopAndOpen(() => setLgShow1(true), 'rigging');
      if (k === '3') scrollToTopAndOpen(() => setLgShow2(true), 'shape');
      if (k === '4') scrollToTopAndOpen(() => setLgShow3(true), 'shape');
      if (k === 'a') setAutoplay(s => !s);
      if (k === 'm') setMuted(s => !s);
      if (k === 'l') setShowLegend(s => !s);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [autoplay, muted, prefersReducedMotion]);

  // scroll + open helper
  const scrollToTopAndOpen = (openFn, label) => {
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior });
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => {
      console.info('analytics', 'open_modal', label);
      // pause any global/background players here if present
      openFn();
    }, delay);
  };

  // back-to-top visibility
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = (behavior = 'smooth') => {
    const finalBehavior = prefersReducedMotion ? 'auto' : behavior;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: finalBehavior });
  };

  // focus the modal close on open (small delay)
  useEffect(() => {
    if (!(lgShow || lgShow1 || lgShow2 || lgShow3)) return;
    const delay = prefersReducedMotion ? 0 : 60;
    const t = setTimeout(() => {
      const el = document.querySelector('.modal.show .btn-close');
      if (el && typeof el.focus === 'function') el.focus();
    }, delay);
    return () => clearTimeout(t);
  }, [lgShow, lgShow1, lgShow2, lgShow3, prefersReducedMotion]);

  return (
    <Container fluid>
      {/* help toggle */}
      <button
        onClick={() => setShowLegend(s => !s)}
        aria-label="Toggle shortcuts legend"
        title="Shortcuts (L)"
        style={{
          position: "fixed",
          left: 12,
          bottom: 70,
          zIndex: 1300,
          width: 36,
          height: 36,
          borderRadius: 18,
          border: "none",
          background: "var(--primary)",
          color: "var(--light)",
          cursor: "pointer",
        }}
      >?</button>

      <Row>
        {/* legend */}
        {showLegend && (
          <div style={{
            position: 'fixed',
            left: 12,
            bottom: 12,
            zIndex: 1200,
            background: 'var(--card-bg)',
            color: 'var(--text)',
            padding: '8px 10px',
            borderRadius: 6,
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: 12, marginBottom: 6 }}><strong>Shortcuts</strong></div>
            <div style={{ fontSize: 12 }}>1: Free Rider • 2: Rigging • 3: Shape • A: Autoplay • M: Mute • L: Toggle legend</div>
            <button className="btn btn-sm btn-link" onClick={() => setShowLegend(false)} aria-label="Close legend">Close</button>
          </div>
        )}

        {/* Free Rider modal */}
        <Modal
          fullscreen
          show={lgShow}
          onHide={() => { setLgShow(false); pauseYouTube(freeIframeRef); try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} }}
          aria-labelledby="modal-free-rider-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="modal-free-rider-title">Free Rider Animation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>A short low budget animated film made completely in blender. Very low polygon count for the whole project. Objects were placed using Blender's particle engine.</p>
            <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
              <iframe
                ref={freeIframeRef}
                title="Free Rider Animation video"
                src={getEmbedSrc(REEL_IDS.freeRider)}
                width="100%"
                height="640"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            </div>

            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <a onMouseEnter={preconnectYouTube} onClick={() => noteOpen(REEL_URLS.freeRider)} className="btn btn-sm btn-outline-primary" href={REEL_URLS.freeRider} target="_blank" rel="noopener noreferrer">Open on YouTube</a>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.freeRider, setShareMsg)}>Copy link</button>
              {shareMsg && <span role="status" style={{ marginLeft: 8, fontSize: 12, color: 'var(--primary)' }}>{shareMsg}</span>}
              <div style={{ marginLeft: 'auto' }}>
                <label style={{ marginRight: 8, fontSize: 12 }}>
                  <input type="checkbox" checked={autoplay} onChange={() => setAutoplay(s => !s)} /> Autoplay
                </label>
                <label style={{ fontSize: 12 }}>
                  <input type="checkbox" checked={muted} onChange={() => setMuted(s => !s)} /> Mute
                </label>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Rigging modal */}
        <Modal
          fullscreen
          show={lgShow1}
          onHide={() => { setLgShow1(false); pauseYouTube(riggingIframeRef); try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} }}
          aria-labelledby="modal-rigging-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="modal-rigging-title">Facial Rigging Demo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>A short facial rigging demo. Maya was used to model, UV, texture, and rig the character. ZBrush was used to add details. XNormal used to extract normal maps.</p>
            <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
              <iframe
                ref={riggingIframeRef}
                title="Facial Rigging Demo video"
                src={getEmbedSrc(REEL_IDS.rigging)}
                width="100%"
                height="640"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            </div>
          </Modal.Body>
        </Modal>

        {/* Shape modal */}
        <Modal
          fullscreen
          show={lgShow2}
          onHide={() => { setLgShow2(false); pauseYouTube(shapeIframeRef); try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} }}
          aria-labelledby="modal-shape-animation-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="modal-shape-animation-title">2D Shape Animation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>This is a short 2D animation created in After Effects.</p>
            <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
              <iframe
                ref={shapeIframeRef}
                title="2D Shape Animation video"
                src={getEmbedSrc(REEL_IDS.shape)}
                width="100%"
                height="640"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            </div>
          </Modal.Body>
        </Modal>

        {/* Bouncing Ball modal (reuse shape id) */}
        <Modal
          fullscreen
          show={lgShow3}
          onHide={() => { setLgShow3(false); pauseYouTube(shapeIframeRef); try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} }}
          aria-labelledby="modal-bouncing-ball-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="modal-bouncing-ball-title">Bouncing Ball</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Simple ball bounce animation to showcase principles of motion.</p>
            <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
              <iframe
                title="Bouncing Ball video"
                src={getEmbedSrc(REEL_IDS.shape)}
                width="100%"
                height="640"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            </div>
          </Modal.Body>
        </Modal>

        <br/><br/>
        <h2 className="top_text">Animation and Video Renders</h2>
        <p className="top-p">Videos are rendered through 3D software and worked on in post production for added effects</p>
        <NavDropdown.Divider />

        <Col ms={"auto"}>
          <CardGroup>
            <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
              <Card.Img loading="lazy" variant="top" src={rundown} className="rounded" alt="Short Film thumbnail" />
              <Card.Body>
                <Card.Title className="ti-tle">Short Film</Card.Title>
                <Card.Text>A short film created using Blender.</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <Button aria-label="Open Short Film modal" variant="outline-warning" size="sm" onClick={(e) => { lastActiveRef.current = e.currentTarget; scrollToTopAndOpen(() => setLgShow(true), 'freeRider'); }}>View video here</Button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.freeRider, setShareMsg)}>Copy</button>
                  <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.freeRider} target="_blank" rel="noopener noreferrer" onMouseEnter={preconnectYouTube} onClick={() => noteOpen(REEL_URLS.freeRider)}>Open</a>
                </div>
              </Card.Footer>
            </Card>

            <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
              <Card.Img loading="lazy" variant="top" src={rigging} className="rounded" alt="Rigging thumbnail" />
              <Card.Body>
                <Card.Title className="ti-tle">Lip Sync and Rigging</Card.Title>
                <Card.Text>Facial rigging demo using Maya + ZBrush.</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <Button variant="outline-warning" size="sm" onClick={(e) => { lastActiveRef.current = e.currentTarget; scrollToTopAndOpen(() => setLgShow1(true), 'rigging'); }}>View video here</Button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.rigging, setShareMsg)}>Copy</button>
                  <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.rigging} target="_blank" rel="noopener noreferrer" onMouseEnter={preconnectYouTube} onClick={() => noteOpen(REEL_URLS.rigging)}>Open</a>
                </div>
              </Card.Footer>
            </Card>

            <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
              <Card.Img loading="lazy" variant="top" src={shapeAnimation} className="rounded" alt="Shape animation thumbnail" />
              <Card.Body>
                <Card.Title className="ti-tle">2D Shape Animation</Card.Title>
                <Card.Text>Simple shapes and lines animation in After Effects.</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <Button variant="outline-warning" size="sm" onClick={(e) => { lastActiveRef.current = e.currentTarget; scrollToTopAndOpen(() => setLgShow2(true), 'shape'); }}>View video here</Button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.shape, setShareMsg)}>Copy</button>
                  <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.shape} target="_blank" rel="noopener noreferrer" onMouseEnter={preconnectYouTube} onClick={() => noteOpen(REEL_URLS.shape)}>Open</a>
                </div>
              </Card.Footer>
            </Card>
          </CardGroup>
        </Col>
      </Row>

      <br />
      <NavDropdown.Divider />

      {/* Footer Section (semantic) */}
      <footer id="site-footer" role="contentinfo" className="footer" aria-label="Site footer">
        <Container fluid>
          <Row className="align-items-center py-3">
            <Col md={8} className="text-md-start text-center">
              <div className="rights">© {currentYear} Colin Nebula</div>
            </Col>
            <Col md={4} className="icons text-md-end text-center" aria-label="Social links">
              <SocialIcons />
            </Col>
          </Row>
        </Container>
      </footer>

      {showTop && (
        <button
          onClick={() => scrollToTop()}
          aria-label="Back to top"
          title="Back to top"
          style={{
            position: "fixed",
            right: 20,
            bottom: 30,
            zIndex: 999,
            padding: "10px 14px",
            borderRadius: 6,
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          }}
        >
          <span aria-hidden="true">↑</span>
          <span className="visually-hidden">Back to top</span>
        </button>
      )}
    </Container>
  );
}

export default Animation;