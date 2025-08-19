import React, {useState, useEffect} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import shapeAnimation from '../../assets/images/shapeAnimation.png';
import rundown from '../../assets/images/rundown.png';
import rigging from '../../assets/images/rigging.png';
import { Card, Container, Button, Col, Row, CardGroup, NavDropdown, Modal } from 'react-bootstrap';
import SocialIcons from '../SocialIcons';

function Animation() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);

  // new features
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  // reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // canonical reel IDs / URLs
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

  // helper: build embed src with autoplay/mute params
  const getEmbedSrc = (id) => {
    const p = new URLSearchParams();
    p.set('rel', '0');
    if (autoplay) p.set('autoplay', '1');
    if (muted) p.set('mute', '1');
    return `https://www.youtube.com/embed/${id}?${p.toString()}`;
  };

  // copy helper with feedback + analytics
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

  // keyboard shortcuts: 1->free rider, 2->rigging, A->autoplay, M->mute, L->legend
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === '1') {
        // Free Rider
        scrollToTopAndOpen(() => setLgShow(true), 'freeRider');
      } else if (k === '2') {
        // Rigging
        scrollToTopAndOpen(() => setLgShow1(true), 'rigging');
      } else if (k === 'a') {
        setAutoplay(v => !v);
      } else if (k === 'm') {
        setMuted(v => !v);
      } else if (k === 'l') {
        setShowLegend(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [autoplay, muted, prefersReducedMotion]);

  // small helper to scroll then open modal, with analytics label
  const scrollToTopAndOpen = (openFn, label) => {
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior });
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => {
      console.info('analytics', 'open_modal', label);
      openFn();
    }, delay);
  };

  const [showTop, setShowTop] = useState(false);
  
    useEffect(() => {
      const onScroll = () => setShowTop(window.scrollY > 240);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

  // NOTE: reuse existing scrollToTop if present; otherwise use local inline call below
  const scrollToTop = (behavior = 'smooth') => {
    const finalBehavior = prefersReducedMotion ? 'auto' : behavior;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: finalBehavior });
  };

    return (
        <Container fluid>
            <Row>
        {/* on-screen legend */}
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
            <div style={{ fontSize: 12 }}>1: Free Rider • 2: Rigging • A: Autoplay • M: Mute • L: Toggle legend</div>
            <button className="btn btn-sm btn-link" onClick={() => setShowLegend(false)} aria-label="Close legend">Close</button>
          </div>
        )}

        <div>
        <>
      <Modal
        fullscreen={true}
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="modal-free-rider-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-free-rider-title">
            Free Rider Animation
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          A short low budget animated film made completely in blender. Very low polygon count for the whole project. 
          Objects were placed in the scene using Blenders particle engine
          </p>

          <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
            <iframe
              title="Free Rider Animation video"
              src={getEmbedSrc(REEL_IDS.freeRider)}
              width="100%"
              height="640"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
         <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.freeRider} target="_blank" rel="noopener noreferrer">Open on YouTube</a>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.freeRider, setShareMsg)}>Copy link</button>
            <span className="visually-hidden" aria-live="polite">{shareMsg}</span>
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
     </>
         </div>

      <div>
      <>
      <Modal
        fullscreen={true}
        show={lgShow1}
        onHide={() => setLgShow1(false)}
        aria-labelledby="modal-rigging-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-rigging-title">
            Facial Rigging Demo
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          A short facial rigging demo. Maya was used to model, uv, texture, and rig character. 
          Zbrush was used to add details. 
          Xnormal was used to extract the normal map.

          </p>
                <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
                  <iframe
                    title="Facial Rigging Demo video"
                    src="https://www.youtube.com/embed/lIrnDytiNxA"
                    width="100%"
                    height="640"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <div>
      <>
      <Modal
        fullscreen={true}
        show={lgShow2}
        onHide={() => setLgShow2(false)}
        aria-labelledby="modal-shape-animation-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-shape-animation-title">
            2D Shape Animation
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          This is a short 2D animation using different shapes. 
          Adobe After Effects is the software used in the project.
          
          

          </p>
          <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
            <iframe
              title="2D Shape Animation video"
              src="https://www.youtube.com/embed/FVVFcjpg5eA"
              width="100%"
              height="640"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <div>
      <>
      <Modal
        fullscreen={true}
        show={lgShow3}
        onHide={() => setLgShow3(false)}
        aria-labelledby="modal-bouncing-ball-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-bouncing-ball-title">
            2D Shape Animation
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          This is a short 2D animation using different shapes. 
          Adobe After Effects is the software used in the project.
          
          

          </p>
          <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
            <iframe
              title="Bouncing Ball video"
              src="https://www.youtube.com/embed/FVVFcjpg5eA"
              width="100%"
              height="640"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>
        <br/>
          <br/>
            <h2 className="top_text"> Animation and Video Renders</h2>
            <p className="top-p">Videos are rendered through 3D software and worked on in post production for added effects</p>
            <NavDropdown.Divider />
                <Col ms={"auto"}>
                <CardGroup>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={rundown} className="rounded" 
                  alt="Short Film thumbnail" />
                  <Card.Body>
                    <Card.Title className="ti-tle">Short Film</Card.Title>
                    <Card.Text>
                    A short film created using only Blender 
                    
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <Button aria-label="Open Short Film modal" variant="outline-warning" size="sm" onClick={() => scrollToTopAndOpen(() => setLgShow(true), 'freeRider')}>View video here</Button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.freeRider, setShareMsg)}>Copy</button>
                    <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.freeRider} target="_blank" rel="noopener noreferrer">Open</a>
                  </div>
                  </Card.Footer>

                  <br/>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={rigging} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title className="ti-tle">Lip Sync and Rigging</Card.Title>
                    <Card.Text>
                    Facial Rigging demo 
                    using Maya to model, UV, texture, and rig the character
                    {' '}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <Button variant="outline-warning" size="sm" onClick={() => scrollToTopAndOpen(() => setLgShow1(true), 'rigging')}>View video here</Button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.rigging, setShareMsg)}>Copy</button>
                    <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.rigging} target="_blank" rel="noopener noreferrer">Open</a>
                  </div>
                    
                  
                 </Card.Footer>
                  <br/>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
                  <Card.Img variant="top" src={shapeAnimation} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title className="ti-tle">2D Shape Animation</Card.Title>
                    <Card.Text>
                      Simple shapes and lines animation in After Effects
                      
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <Button variant="outline-warning" size="sm" onClick={() => scrollToTopAndOpen(() => setLgShow2(true), 'shape')}>View video here</Button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.shape, setShareMsg)}>Copy</button>
                    <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.shape} target="_blank" rel="noopener noreferrer">Open</a>
                  </div>
                    
                  
                 </Card.Footer>
                  <br/>
                </Card>
                
              </CardGroup>
              <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
              <Card.Img variant="top" src={shapeAnimation} className="rounded" 
              alt="Card image" />
              <Card.Body>
                <Card.Title className="ti-tle">The Bouncing Ball</Card.Title>
                <Card.Text>
                  Simple ball bounce animation to showcase my animation skills
                  
                </Card.Text>
              </Card.Body>
              <br/>
              </Card>
              <Card.Footer>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <Button variant="outline-warning" size="sm" onClick={() => scrollToTopAndOpen(() => setLgShow3(true), 'shape')}>View video here</Button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL_URLS.shape, setShareMsg)}>Copy</button>
                <a className="btn btn-sm btn-outline-primary" href={REEL_URLS.shape} target="_blank" rel="noopener noreferrer">Open</a>
              </div>
                
              
             </Card.Footer>
              <CardGroup>

              </CardGroup>
        
        </Col>
      </Row>
      <br />
      <NavDropdown.Divider />

      {/* Footer Section */}
                  <Container fluid className="footer">
                    <Row>
                      <Col md={12} className="text-center">
                        <div className="rights">
                          Colin Nebula
                        </div>
                      </Col>
            
                      <Col xs={12} className="icons text-center">
                        <SocialIcons />
                      </Col>
                    </Row>
                  </Container>
                  {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 30,
            zIndex: 999,
            padding: '10px 14px',
            borderRadius: 6,
            border: 'none',
            background: '#0ea5e9',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
          }}
        >
          ↑ Top
        </button>
      )}
                </Container>
    )
}


export default Animation;
