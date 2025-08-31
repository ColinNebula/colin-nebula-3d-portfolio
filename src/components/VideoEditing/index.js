import React, {useState, useEffect, useRef, useCallback} from "react";
import logoD from '../../assets/images/logoD.png';
import nbg from '../../assets/images/nbg.png';
import content from '../../assets/images/contents.png';
import { Card, Container, Button, NavDropdown, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNotifications } from '../../App';
import './VideoEditing.css';

function VfxVideoEditing() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  // new features
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(true);
  // persisted on-screen legend
  const [showLegend, setShowLegend] = useState(() => {
    try { return localStorage.getItem("nebula_showLegend") === "1"; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem("nebula_showLegend", showLegend ? "1" : "0"); } catch (e) {} }, [showLegend]);
  const { showNotification } = useNotifications();

  // refs to restore focus + pause players
  const lastActiveRef = useRef(null);
  const demoIframeRef = useRef(null);
  const vfxIframeRef = useRef(null);
  const byteIframeRef = useRef(null);

  // reduced-motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // canonical reel ids / urls
  const REEL = {
    demo: { id: 'tFwtXZw_VzM', url: 'https://www.youtube.com/watch?v=tFwtXZw_VzM' },
    recent: { id: 'mPxmNbMpO7A', url: 'https://www.youtube.com/watch?v=mPxmNbMpO7A' },
    byte: { id: '1wI6aDte_1Q', url: 'https://www.youtube.com/watch?v=1wI6aDte_1Q' }
  };

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getEmbedSrc = (id) => {
    const params = new URLSearchParams();
    params.set('rel', '0');
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('mute', '1');
    // keep embed simple; enable JS API for postMessage
    params.set('enablejsapi', '1');
    params.set('modestbranding','1');
    params.set('playsinline','1');
    try { if (typeof window !== 'undefined' && window.location && window.location.origin) params.set('origin', window.location.origin); } catch(e){}
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  };

  // pause a YouTube iframe (requires enablejsapi=1)
  const pauseYouTube = (ref) => {
    try {
      const f = ref && ref.current;
      if (!f || !f.contentWindow) return;
      const msg = JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] });
      f.contentWindow.postMessage(msg, '*');
    } catch (e) {}
  };

  // Updated copy helper with notification system
  const copyToClipboard = async (text) => {
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
      showNotification('Link copied to clipboard!', 'success', 2000, {
        category: 'system',
        icon: '📋'
      });
      console.info('analytics', 'copy_link', text);
    } catch {
      showNotification('Failed to copy link', 'danger', 3000, {
        category: 'system',
        icon: '❌'
      });
    }
  };

  const scrollToTop = useCallback((behavior = 'smooth') => {
    const finalBehavior = prefersReducedMotion ? 'auto' : behavior;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: finalBehavior });
  }, [prefersReducedMotion]);

  const scrollToTopAndOpen = useCallback((openFn, label) => {
    scrollToTop();
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => {
      console.info('analytics', 'open_modal', label);
      openFn();
    }, delay);
  }, [prefersReducedMotion, scrollToTop]);

  // keyboard shortcuts: 1 -> demo, 2 -> recent, a -> autoplay, m -> mute, l -> legend
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === '1') scrollToTopAndOpen(() => setLgShow(true), 'demo');
      if (k === '2') scrollToTopAndOpen(() => setLgShow2(true), 'recent');
      if (k === 'a') setAutoplay(s => !s);
      if (k === 'm') setMuted(s => !s);
      if (k === 'l') setShowLegend(s => !s);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [autoplay, muted, prefersReducedMotion, scrollToTopAndOpen]);


    return (
    <Container fluid className="video-editing-container px-3 px-lg-5">
      <div className="justify-content-center">
        {/* on-screen legend */}
        {showLegend && (
          <div style={{
            position: 'fixed', left: 12, bottom: 12, zIndex: 1200,
            background: 'var(--card-bg)', color: 'var(--text)',
            padding: '8px 10px', borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: 12, marginBottom: 6 }}><strong>Shortcuts</strong></div>
            <div style={{ fontSize: 12 }}>1: Demo • 2: Recent VFX • A: Autoplay • M: Mute • L: Toggle legend</div>
            <button className="btn btn-sm btn-link" onClick={() => setShowLegend(false)} aria-label="Close legend">Close</button>
          </div>
        )}

        {/* small help button to toggle legend */}
        <button
          onClick={() => setShowLegend(s => !s)}
          aria-label="Toggle shortcuts legend"
          title="Shortcuts (L)"
          style={{ position: 'fixed', left: 12, bottom: 70, zIndex: 1300, width: 36, height: 36, borderRadius: 18, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer' }}
        >?</button>

        {/* Modal for VFX Demo Reel */}
        <Modal
          size="xl"
          show={lgShow}
          onHide={() => { 
            setLgShow(false); 
            pauseYouTube(demoIframeRef); 
            try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} 
          }}
          dialogClassName="modal-video-player"
          contentClassName="modal-dark"
          aria-labelledby="demo-modal-title"
          centered
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <div className="modal-title-wrapper">
              <Modal.Title id="demo-modal-title" className="fw-bold">
                VFX Demo Reel
              </Modal.Title>
              <p className="text-muted mb-0 small">Commercial & TV production showcase</p>
            </div>
          </Modal.Header>
          <Modal.Body className="pt-3">
            <div className="video-player-wrapper mb-4">
              <div className="ratio ratio-16x9 shadow-lg">
                <iframe
                  ref={demoIframeRef}
                  loading="lazy"
                  width="100%"
                  height="480"
                  src={getEmbedSrc(REEL.demo.id)}
                  title="VFX Demo Reel"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
            
            <div className="project-details-container">
              <div className="project-meta mb-4">
                <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
                  <span className="badge bg-primary px-3 py-2">Commercial VFX</span>
                  <span className="badge bg-secondary px-3 py-2">TV Production</span>
                  <span className="text-muted ms-auto small">
                    <i className="bi bi-clock me-1"></i> Duration: 2:35
                  </span>
                </div>
                
                <div className="player-controls d-flex flex-wrap gap-3 align-items-center mb-4">
                  <a 
                    className="btn btn-primary rounded-pill" 
                    href={REEL.demo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-youtube me-2"></i>Open on YouTube
                  </a>
                  <button 
                    className="btn btn-outline-secondary rounded-pill" 
                    onClick={() => copyToClipboard(REEL.demo.url)}
                  >
                    <i className="bi bi-link-45deg me-2"></i>Copy link
                  </button>
                  <div className="ms-auto d-flex gap-3">
                    <label className="form-check form-switch">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={autoplay} 
                        onChange={() => setAutoplay(v => !v)} 
                      /> 
                      <span className="form-check-label">Autoplay</span>
                    </label>
                    <label className="form-check form-switch">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={muted} 
                        onChange={() => setMuted(v => !v)} 
                      /> 
                      <span className="form-check-label">Mute</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="project-description">
                <h5 className="mb-3 border-bottom pb-2">Project Overview</h5>
                <p className="text-muted">
                  This VFX demo reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles, 
                  and other aspects to help complete the project. 
                  Photoshop and Maya were used predominantly.
                </p>
                
                <h5 className="mt-4 mb-3 border-bottom pb-2">Technical Details</h5>
                <p className="text-muted">
                  Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
                  My job was to very precisely rotoscope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments. 
                  This was accomplished utilizing Nuke primarily.
                </p>
                
                <div className="tools-used mt-4">
                  <h6 className="text-muted small">SOFTWARE & TOOLS</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-light text-dark">Maya</span>
                    <span className="badge bg-light text-dark">Photoshop</span>
                    <span className="badge bg-light text-dark">Nuke</span>
                    <span className="badge bg-light text-dark">After Effects</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Modal for Recent VFX Reel */}
        <Modal
          size="xl"
          show={lgShow2}
          onHide={() => { 
            setLgShow2(false); 
            pauseYouTube(vfxIframeRef); 
            try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} 
          }}
          dialogClassName="modal-video-player"
          contentClassName="modal-dark"
          aria-labelledby="recent-modal-title"
          centered
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <div className="modal-title-wrapper">
              <Modal.Title id="recent-modal-title" className="fw-bold">
                VFX Reel 2024
              </Modal.Title>
              <p className="text-muted mb-0 small">Latest professional visual effects showcase</p>
            </div>
          </Modal.Header>
          <Modal.Body className="pt-3">
            <div className="video-player-wrapper mb-4">
              <div className="ratio ratio-16x9 shadow-lg">
                <iframe
                  ref={vfxIframeRef}
                  loading="lazy"
                  width="100%"
                  height="480"
                  src={getEmbedSrc(REEL.recent.id)}
                  title="VFX Reel 2024"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
            
            <div className="project-details-container">
              <div className="project-meta mb-4">
                <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
                  <span className="badge bg-primary px-3 py-2">3D Integration</span>
                  <span className="badge bg-secondary px-3 py-2">Motion Tracking</span>
                  <span className="text-muted ms-auto small">
                    <i className="bi bi-clock me-1"></i> Published: 2024
                  </span>
                </div>
                
                <div className="player-controls d-flex flex-wrap gap-3 align-items-center mb-4">
                  <a 
                    className="btn btn-primary rounded-pill" 
                    href={REEL.recent.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-youtube me-2"></i>Open on YouTube
                  </a>
                  <button 
                    className="btn btn-outline-secondary rounded-pill" 
                    onClick={() => copyToClipboard(REEL.recent.url)}
                  >
                    <i className="bi bi-link-45deg me-2"></i>Copy link
                  </button>
                  <div className="ms-auto d-flex gap-3">
                    <label className="form-check form-switch">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={autoplay} 
                        onChange={() => setAutoplay(v => !v)} 
                      /> 
                      <span className="form-check-label">Autoplay</span>
                    </label>
                    <label className="form-check form-switch">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={muted} 
                        onChange={() => setMuted(v => !v)} 
                      /> 
                      <span className="form-check-label">Mute</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="project-description">
                <h5 className="mb-3 border-bottom pb-2">Project Overview</h5>
                <p className="text-muted">
                  This VFX reel represents my recent work in the visual effects field, showcasing advanced techniques
                  and creative problem solving across various projects.
                </p>
                
                <h5 className="mt-4 mb-3 border-bottom pb-2">Technical Approach</h5>
                <p className="text-muted">
                  The raw footage was camera and motion tracked using Adobe After effects.
                  3D elements were modeled and rendered from Blender, 
                  exported into After Effects for the application of 2D effects and compositing.
                </p>
                
                <div className="tools-used mt-4">
                  <h6 className="text-muted small">SOFTWARE & TOOLS</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-light text-dark">Blender</span>
                    <span className="badge bg-light text-dark">After Effects</span>
                    <span className="badge bg-light text-dark">Camera Tracking</span>
                    <span className="badge bg-light text-dark">Compositing</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Modal for Byte Size Soccer */}
        <Modal
          size="xl"
          show={lgShow1}
          onHide={() => { 
            setLgShow1(false); 
            pauseYouTube(byteIframeRef); 
            try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} 
          }}
          dialogClassName="modal-video-player"
          contentClassName="modal-dark"
          aria-labelledby="byte-modal-title"
          centered
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <div className="modal-title-wrapper">
              <Modal.Title id="byte-modal-title" className="fw-bold">
                Byte Size Soccer Videos
              </Modal.Title>
              <p className="text-muted mb-0 small">Educational sports production</p>
            </div>
          </Modal.Header>
          <Modal.Body className="pt-3">
            <div className="video-player-wrapper mb-4">
              <div className="ratio ratio-16x9 shadow-lg">
                <iframe
                  ref={byteIframeRef}
                  loading="lazy"
                  width="100%"
                  height="480"
                  src={getEmbedSrc(REEL.byte.id)}
                  title="Byte Size Soccer Videos"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
            
            <div className="project-details-container">
              <div className="project-meta mb-4">
                <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
                  <span className="badge bg-success px-3 py-2">Educational</span>
                  <span className="badge bg-info px-3 py-2">Marketing</span>
                  <span className="badge bg-secondary px-3 py-2">Sports</span>
                  <span className="text-muted ms-auto small">
                    <i className="bi bi-clock me-1"></i> Client Project
                  </span>
                </div>
                
                <div className="player-controls d-flex flex-wrap gap-3 align-items-center mb-4">
                  <a 
                    className="btn btn-primary rounded-pill" 
                    href={REEL.byte.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-youtube me-2"></i>Open on YouTube
                  </a>
                  <button 
                    className="btn btn-outline-secondary rounded-pill" 
                    onClick={() => copyToClipboard(REEL.byte.url)}
                  >
                    <i className="bi bi-link-45deg me-2"></i>Copy link
                  </button>
                  <div className="ms-auto d-flex gap-3">
                    <label className="form-check form-switch">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={autoplay} 
                        onChange={() => setAutoplay(v => !v)} 
                      /> 
                      <span className="form-check-label">Autoplay</span>
                    </label>
                    <label className="form-check form-switch">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        checked={muted} 
                        onChange={() => setMuted(v => !v)} 
                      /> 
                      <span className="form-check-label">Mute</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="project-description">
                <h5 className="mb-3 border-bottom pb-2">Project Overview</h5>
                <p className="text-muted">
                  A promotional video that takes young players through various drills and techniques to learn how to play soccer. 
                  Raw footage was provided by the client and the finished product is a result of VFX and video editing as well as, 
                  sound incorporation with effects.
                </p>
                
                <h5 className="mt-4 mb-3 border-bottom pb-2">Project Features</h5>
                <ul className="feature-list">
                  <li>Created a marketing style educational video that promotes Olympian, the late Tony Waiters, dispensing valuable soccer techniques to the next generation</li>
                  <li>For attention grabbing, and to highlight key points, individual 3D objects were added in and animated</li>
                  <li>Footage was sequenced for a linear development so that young players can learn the technique or drill easily in this flipped curriculum</li>
                  <li>Planning prior to, customizing the result, and conferring on final shots with the client helped incorporate their vision throughout</li>
                  <li>Smooth and error-free transition allows for an enjoyable viewing experience</li>
                  <li>Integration of appealing text and images was done to keep young players engaged in watching the video to the end just in time for their soccer practice</li>
                </ul>
                
                <div className="tools-used mt-4">
                  <h6 className="text-muted small">SOFTWARE & TOOLS</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-light text-dark">Adobe Suite</span>
                    <span className="badge bg-light text-dark">Photoshop</span>
                    <span className="badge bg-light text-dark">After Effects</span>
                    <span className="badge bg-light text-dark">Maya</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <div className="text-center mb-5 px-2">
          <h1 className="display-4 fw-bold mb-3 text-gradient">VFX and Video Editing</h1>
          <p className="lead fs-5 mb-4 text-muted">
            Professional video production combining 3D software rendering with advanced post-production effects
          </p>
          <hr className="border-2 border-primary w-25 mx-auto mb-5" />
        </div>

        <div className="px-2 px-lg-4">
          {/* Featured VFX Reel 2024 - Enhanced hero section */}
          <div className="featured-showcase mb-5">
            <Card className="bg-dark text-white shadow-lg border-0 overflow-hidden">
              <div className="position-relative">
                <div className="ratio ratio-21x9">
                  <Card.Img 
                    loading="lazy" 
                    variant="top" 
                    src={nbg} 
                    className="object-fit-cover" 
                    alt="VFX reel poster" 
                  />
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                <div className="position-absolute bottom-0 start-0 w-100 p-4 p-lg-5 bg-gradient-dark">
                  <div className="row align-items-end">
                    <div className="col-md-8">
                      <h2 className="h2 fw-bold mb-2 text-white">Colin Nebula 2024 VFX Reel</h2>
                      <p className="fs-5 mb-3 text-white-50">
                        Latest visual effects showcase created with Blender and After Effects
                      </p>
                      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                        <span className="badge bg-primary px-3 py-2">Blender</span>
                        <span className="badge bg-secondary px-3 py-2">After Effects</span>
                        <span className="badge bg-success px-3 py-2">Motion Tracking</span>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <Button 
                        variant="warning" 
                        size="lg" 
                        className="mb-2 px-4 py-2 fw-semibold"
                        onClick={(e) => { 
                          lastActiveRef.current = e.currentTarget; 
                          console.info('analytics', 'open_modal', 'recent');
                          setLgShow2(true); 
                        }}
                      >
                        <i className="bi bi-play-fill me-2"></i>Watch Reel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Portfolio grid section */}
          <div className="portfolio-grid">
            <div className="text-center mb-5">
              <h2 className="h1 fw-bold mb-3">Portfolio Showcase</h2>
              <p className="fs-5 text-muted mb-4">
                Combining 2D and 3D tools to create compelling visual narratives
              </p>
            </div>

            <div className="row">
              <div className="portfolio-card-wrapper">
                <Card className="portfolio-card bg-dark text-white shadow-lg border-0 h-100 overflow-hidden">
                  <div className="position-relative">
                    <div className="ratio ratio-16x9">
                      <Card.Img 
                        loading="lazy" 
                        variant="top" 
                        src={logoD} 
                        className="object-fit-cover transition-transform" 
                        alt="VFX logo" 
                      />
                    </div>
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 opacity-0 transition-opacity d-flex align-items-center justify-content-center">
                      <Button 
                        variant="outline-light" 
                        size="lg" 
                        className="rounded-pill px-4"
                        onClick={(e) => { 
                          lastActiveRef.current = e.currentTarget; 
                          scrollToTopAndOpen(() => setLgShow(true), 'demo'); 
                        }}
                      >
                        <i className="bi bi-play-fill me-2"></i>View Project
                      </Button>
                    </div>
                  </div>
                  
                  <Card.Body className="p-4 p-lg-5 d-flex flex-column">
                    <div className="mb-3">
                      <span className="badge bg-danger mb-2">Film Industry</span>
                      <Card.Title className="h3 fw-bold mb-3">VFX Demo Reel</Card.Title>
                      <Card.Text className="fs-6 text-white-50 flex-grow-1 lh-relaxed">
                        Professional visual effects demonstration showcasing industry experience 
                        in commercial and television production environments.
                      </Card.Text>
                    </div>
                    
                    <div className="border-top border-secondary pt-3 mt-auto">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <small className="text-muted">
                          <i className="bi bi-tools me-1"></i>Maya • Photoshop • Nuke
                        </small>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-2">
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="flex-grow-1"
                          onClick={(e) => { 
                            lastActiveRef.current = e.currentTarget; 
                            scrollToTopAndOpen(() => setLgShow(true), 'demo'); 
                          }}
                        >
                          <i className="bi bi-play me-1"></i>Watch
                        </Button>
                        <button 
                          className="btn btn-sm btn-outline-secondary" 
                          onClick={() => copyToClipboard(REEL.demo.url)}
                          title="Copy link"
                        >
                          <i className="bi bi-link-45deg"></i>
                        </button>
                        <a 
                          className="btn btn-sm btn-outline-primary" 
                          href={REEL.demo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Open on YouTube"
                        >
                          <i className="bi bi-youtube"></i>
                        </a>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="portfolio-card-wrapper">
                <Card className="portfolio-card bg-dark text-white shadow-lg border-0 h-100 overflow-hidden">
                  <div className="position-relative">
                    <div className="ratio ratio-16x9">
                      <Card.Img 
                        loading="lazy" 
                        variant="top" 
                        src={content} 
                        className="object-fit-cover transition-transform" 
                        alt="Byte video poster" 
                      />
                    </div>
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 opacity-0 transition-opacity d-flex align-items-center justify-content-center">
                      <Button 
                        variant="outline-light" 
                        size="lg" 
                        className="rounded-pill px-4"
                        onClick={(e) => { 
                          lastActiveRef.current = e.currentTarget; 
                          scrollToTopAndOpen(() => setLgShow1(true), 'byte'); 
                        }}
                      >
                        <i className="bi bi-play-fill me-2"></i>View Project
                      </Button>
                    </div>
                  </div>
                  
                  <Card.Body className="p-4 p-lg-5 d-flex flex-column">
                    <div className="mb-3">
                      <span className="badge bg-success mb-2">Educational</span>
                      <Card.Title className="h3 fw-bold mb-3">Video Production</Card.Title>
                      <Card.Text className="fs-6 text-white-50 flex-grow-1 lh-relaxed">
                        Complete video editing workflow including motion graphics, 
                        3D integration, and sound design for educational content.
                      </Card.Text>
                    </div>
                    
                    <div className="border-top border-secondary pt-3 mt-auto">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <small className="text-muted">
                          <i className="bi bi-tools me-1"></i>After Effects • Photoshop • Maya
                        </small>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-2">
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="flex-grow-1"
                          onClick={(e) => { 
                            lastActiveRef.current = e.currentTarget; 
                            scrollToTopAndOpen(() => setLgShow1(true), 'byte'); 
                          }}
                        >
                          <i className="bi bi-play me-1"></i>Watch
                        </Button>
                        <button 
                          className="btn btn-sm btn-outline-secondary" 
                          onClick={() => copyToClipboard(REEL.byte.url)}
                          title="Copy link"
                        >
                          <i className="bi bi-link-45deg"></i>
                        </button>
                        <a 
                          className="btn btn-sm btn-outline-primary" 
                          href={REEL.byte.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Open on YouTube"
                        >
                          <i className="bi bi-youtube"></i>
                        </a>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>

          {/* Share message notification - Remove this section since we're using global notifications */}
        </div>
      </div>

      <NavDropdown.Divider className="my-4 my-md-5" />

      {/* Back to top button - Improved mobile positioning */}
      {showTop && (
        <button
          onClick={() => scrollToTop()}
          aria-label="Back to top"
          title="Back to top"
          className="btn btn-primary position-fixed d-flex align-items-center justify-content-center"
          style={{
            right: '1rem',
            bottom: '1.5rem',
            zIndex: 999,
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: '1.25rem'
          }}
        >
          <span aria-hidden="true">↑</span>
          <span className="visually-hidden">Back to top</span>
        </button>
      )}
    </Container>
  )
}

export default VfxVideoEditing;
