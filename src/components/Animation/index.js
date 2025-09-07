import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from "react";
import shapeAnimation from '../../assets/images/shapeAnimation.png';
import rundown from '../../assets/images/rundown.png';
import rigging from '../../assets/images/rigging.png';
import cover1 from '../../assets/images/cover1.png';
import g1 from '../../assets/images/g1.png';
import { Card, Container, Button, Col, Row, Badge, Modal, Breadcrumb } from 'react-bootstrap';
import { useNotifications } from '../../App';
import './Animation.css';

function Animation() {
  // modals
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);
  const [lgShow4, setLgShow4] = useState(false); // Glass video modal
  const [lgShow5, setLgShow5] = useState(false); // Intro video modal

  // features / prefs
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showLegend, setShowLegend] = useState(() => {
    try { return localStorage.getItem('animation_showLegend') === '1'; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem('animation_showLegend', showLegend ? '1' : '0'); } catch(e){} }, [showLegend]);

  // refs
  const freeIframeRef = useRef(null);
  const riggingIframeRef = useRef(null);
  const shapeIframeRef = useRef(null);
  const glassVideoRef = useRef(null);
  const introVideoRef = useRef(null);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // Use notification context instead of local state
  const { showNotification } = useNotifications();

  // Updated copy helper
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
      showNotification('Link copied to clipboard!', 'success');
      console.info('analytics', 'copy_link', text);
    } catch (error) {
      showNotification('Failed to copy link', 'danger');
      console.error('Copy failed:', error);
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
      if (k === 'escape') closeModal();
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
    if (!(lgShow || lgShow1 || lgShow2 || lgShow3 || lgShow4 || lgShow5)) return;
    const delay = prefersReducedMotion ? 0 : 60;
    const t = setTimeout(() => {
      const el = document.querySelector('.modal.show .btn-close');
      if (el && typeof el.focus === 'function') el.focus();
    }, delay);
    return () => clearTimeout(t);
  }, [lgShow, lgShow1, lgShow2, lgShow3, lgShow4, lgShow5, prefersReducedMotion]);

  // Enhanced animation data structure
  const animationProjects = [
    {
      id: 'freeRider',
      title: 'Free Rider',
      subtitle: 'Low-Poly 3D Animation',
      description: 'A cinematic short film showcasing advanced particle systems and environmental storytelling techniques in Blender.',
      thumbnail: rundown,
      videoId: REEL_IDS.freeRider,
      duration: '2:45',
      year: '2023',
      software: ['Blender', 'DaVinci Resolve'],
      techniques: ['Particle Systems', 'Low-Poly Modeling', 'Environmental Design', 'Color Grading'],
      awards: ['Best Student Film 2023'],
      metrics: {
        views: '15.2K',
        likes: '98%',
        comments: '127'
      },
      type: 'youtube'
    },
    {
      id: 'rigging',
      title: 'Facial Rigging Demo',
      subtitle: 'Advanced Character Animation',
      description: 'Professional facial rigging demonstration featuring complex blend shapes, realistic expressions, and advanced deformation techniques.',
      thumbnail: rigging,
      videoId: REEL_IDS.rigging,
      duration: '1:30',
      year: '2023',
      software: ['Maya', 'ZBrush', 'XNormal'],
      techniques: ['Facial Rigging', 'Blend Shapes', 'UV Mapping', 'Normal Map Extraction'],
      metrics: {
        views: '8.7K',
        likes: '96%',
        comments: '85'
      },
      type: 'youtube'
    },
    {
      id: 'shape',
      title: '2D Motion Graphics',
      subtitle: 'Abstract Shape Animation',
      description: 'Elegant motion graphics piece exploring geometric forms and kinetic typography with smooth transitions and dynamic compositions.',
      thumbnail: shapeAnimation,
      videoId: REEL_IDS.shape,
      duration: '0:45',
      year: '2023',
      software: ['After Effects', 'Illustrator'],
      techniques: ['Motion Graphics', 'Kinetic Typography', 'Shape Layers', 'Easing'],
      metrics: {
        views: '12.1K',
        likes: '94%',
        comments: '63'
      },
      type: 'youtube'
    },
    {
      id: 'glass',
      title: 'Glass Animation',
      subtitle: 'Material & Lighting Study',
      description: 'Realistic glass material animation demonstrating advanced lighting techniques, caustics, and transparent material properties.',
      thumbnail: cover1,
      videoSrc: '/colin-nebula-3d-portfolio/videos/glass.mp4',
      duration: '1:15',
      year: '2024',
      software: ['Blender', 'Cycles Render'],
      techniques: ['Glass Materials', 'Caustics', 'HDR Lighting', 'Ray Tracing'],
      metrics: {
        views: '3.2K',
        likes: '92%',
        comments: '28'
      },
      type: 'local'
    },
    {
      id: 'intro',
      title: 'Nebula Media Intro',
      subtitle: 'Brand Identity Animation',
      description: 'Professional brand introduction animation featuring dynamic logo animation, particle effects, and cinematic presentation.',
      thumbnail: g1,
      videoSrc: '/colin-nebula-3d-portfolio/videos/Intro1.avi',
      duration: '0:30',
      year: '2024',
      software: ['After Effects', 'Cinema 4D'],
      techniques: ['Logo Animation', 'Particle Systems', 'Motion Graphics', 'Brand Design'],
      metrics: {
        views: '5.8K',
        likes: '95%',
        comments: '42'
      },
      type: 'local'
    }
  ];

  const [selectedProject, setSelectedProject] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setCurrentModal(project.id);
    
    // Legacy modal state management for backward compatibility
    if (project.id === 'freeRider') setLgShow(true);
    else if (project.id === 'rigging') setLgShow1(true);
    else if (project.id === 'shape') setLgShow2(true);
    else if (project.id === 'glass') setLgShow4(true);
    else if (project.id === 'intro') setLgShow5(true);
    
    console.info('analytics', 'open_modal', project.id);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentModal(null);
    
    // Close all legacy modals
    setLgShow(false);
    setLgShow1(false);
    setLgShow2(false);
    setLgShow3(false);
    setLgShow4(false);
    setLgShow5(false);
    
    // Pause all videos
    [freeIframeRef, riggingIframeRef, shapeIframeRef].forEach(ref => pauseYouTube(ref));
    
    // Pause local videos
    if (glassVideoRef.current) {
      glassVideoRef.current.pause();
      glassVideoRef.current.currentTime = 0;
    }
    if (introVideoRef.current) {
      introVideoRef.current.pause();
      introVideoRef.current.currentTime = 0;
    }
  };

  // Updated keyboard shortcuts to work with new modal system
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === '1') {
        const project = animationProjects.find(p => p.id === 'freeRider');
        if (project) openProjectModal(project);
      }
      if (k === '2') {
        const project = animationProjects.find(p => p.id === 'rigging');
        if (project) openProjectModal(project);
      }
      if (k === '3') {
        const project = animationProjects.find(p => p.id === 'shape');
        if (project) openProjectModal(project);
      }
      if (k === '4') {
        const project = animationProjects.find(p => p.id === 'glass');
        if (project) openProjectModal(project);
      }
      if (k === '5') {
        const project = animationProjects.find(p => p.id === 'intro');
        if (project) openProjectModal(project);
      }
      if (k === 'a') setAutoplay(s => !s);
      if (k === 'm') setMuted(s => !s);
      if (k === 'l') setShowLegend(s => !s);
      if (k === 'escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [animationProjects]);

  return (
    <Container fluid className="animation-container">
      {/* Professional Header */}
      <div className="animation-header">
        <Container>
          <Row>
            <Col>
              <Breadcrumb className="mb-3">
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Animation</Breadcrumb.Item>
              </Breadcrumb>
              
              <div className="header-content text-center">
                <h1 className="display-4 fw-bold mb-3">Animation & Motion Graphics</h1>
                <p className="lead mb-4">
                  Professional 3D animation, character rigging, and motion graphics showcasing 
                  technical expertise and creative storytelling.
                </p>
                
                {/* Stats Bar */}
                <Row className="stats-bar g-4 mb-5">
                  <Col md={3} sm={6}>
                    <div className="stat-item">
                      <h3 className="stat-number">44+</h3>
                      <p className="stat-label">Total Views (K)</p>
                    </div>
                  </Col>
                  <Col md={3} sm={6}>
                    <div className="stat-item">
                      <h3 className="stat-number">95%</h3>
                      <p className="stat-label">Average Rating</p>
                    </div>
                  </Col>
                  <Col md={3} sm={6}>
                    <div className="stat-item">
                      <h3 className="stat-number">345</h3>
                      <p className="stat-label">Total Comments</p>
                    </div>
                  </Col>
                  <Col md={3} sm={6}>
                    <div className="stat-item">
                      <h3 className="stat-number">5</h3>
                      <p className="stat-label">Featured Works</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Enhanced Project Grid */}
      <Container className="projects-section">
        <div className="animation-grid">
          {animationProjects.map((project, index) => (
            <Card key={project.id} className="project-card h-100 shadow-sm">
              <div className="project-image-container">
                <Card.Img 
                  variant="top" 
                  src={project.thumbnail} 
                  alt={`${project.title} thumbnail`}
                  className="project-image"
                  loading="lazy"
                />
                <div className="project-overlay">
                  <Button 
                    variant="light" 
                    size="lg"
                    className="play-button rounded-pill"
                      onClick={() => openProjectModal(project)}
                    >
                      ▶️ Watch Now
                    </Button>
                  </div>
                  
                  {/* Project Badges */}
                  <div className="project-badges">
                    {project.awards && project.awards.length > 0 && (
                      <Badge bg="warning" className="award-badge">
                        🏆 Award Winner
                      </Badge>
                    )}
                    <Badge bg="dark" className="duration-badge">
                      {project.duration}
                    </Badge>
                  </div>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <div className="project-header mb-3">
                    <Card.Title className="h5 mb-1">{project.title}</Card.Title>
                    <Card.Subtitle className="text-muted small">{project.subtitle}</Card.Subtitle>
                  </div>
                  
                  <Card.Text className="flex-grow-1 mb-3">
                    {project.description}
                  </Card.Text>
                  
                  {/* Software Tags */}
                  <div className="software-tags mb-3">
                    {project.software.map(software => (
                      <Badge key={software} bg="secondary" className="me-1 mb-1">
                        {software}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Project Metrics */}
                  <div className="project-metrics mb-3">
                    <div className="metrics-row">
                      <span className="metric">
                        👁️ {project.metrics.views}
                      </span>
                      <span className="metric">
                        👍 {project.metrics.likes}
                      </span>
                      <span className="metric">
                        💬 {project.metrics.comments}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="project-actions mt-auto">
                    <Button 
                      variant="primary" 
                      className="rounded-pill me-2"
                      onClick={() => openProjectModal(project)}
                    >
                      🎬 View Project
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      className="rounded-pill"
                      onClick={() => copyToClipboard(REEL_URLS[project.id])}
                    >
                      📋
                    </Button>
                  </div>
                </Card.Body>
              </Card>
          ))}
        </div>
      </Container>

      {/* Unified Enhanced Modal */}
      <Modal
        size="xl"
        show={!!currentModal}
        onHide={closeModal}
        centered
        className="project-modal"
      >
        {selectedProject && (
          <>
            <Modal.Header closeButton className="border-0">
              <div className="modal-title-section">
                <Modal.Title className="h4 mb-1">{selectedProject.title}</Modal.Title>
                <p className="text-muted mb-0">{selectedProject.subtitle} • {selectedProject.year}</p>
              </div>
            </Modal.Header>
            
            <Modal.Body className="p-0">
              <Row className="g-0">
                <Col lg={8}>
                  <div className="video-container">
                    <div className="ratio ratio-16x9">
                      {selectedProject.type === 'youtube' ? (
                        <iframe
                          ref={currentModal === 'freeRider' ? freeIframeRef : 
                               currentModal === 'rigging' ? riggingIframeRef : shapeIframeRef}
                          title={`${selectedProject.title} video`}
                          src={getEmbedSrc(selectedProject.videoId)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          ref={currentModal === 'glass' ? glassVideoRef : introVideoRef}
                          controls
                          autoPlay={autoplay}
                          muted={muted}
                          loop
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        >
                          <source src={selectedProject.videoSrc} type="video/mp4" />
                          <source src={selectedProject.videoSrc} type="video/x-msvideo" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                </Col>
                
                <Col lg={4} className="project-details">
                  <div className="p-4">
                    <h6 className="text-uppercase fw-bold mb-3 text-muted">Project Details</h6>
                    
                    <div className="detail-section mb-4">
                      <h6 className="fw-semibold mb-2">Description</h6>
                      <p className="text-muted">{selectedProject.description}</p>
                    </div>
                    
                    <div className="detail-section mb-4">
                      <h6 className="fw-semibold mb-2">Software Used</h6>
                      <div className="software-list">
                        {selectedProject.software.map(software => (
                          <Badge key={software} bg="primary" className="me-1 mb-1">
                            {software}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="detail-section mb-4">
                      <h6 className="fw-semibold mb-2">Techniques</h6>
                      <ul className="techniques-list">
                        {selectedProject.techniques.map(technique => (
                          <li key={technique} className="technique-item">
                            ✅ {technique}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedProject.awards && selectedProject.awards.length > 0 && (
                      <div className="detail-section mb-4">
                        <h6 className="fw-semibold mb-2">Awards & Recognition</h6>
                        {selectedProject.awards.map(award => (
                          <div key={award} className="award-item">
                            🏆 {award}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="detail-section">
                      <h6 className="fw-semibold mb-2">Performance</h6>
                      <div className="performance-metrics">
                        <div className="metric-item">
                          <span className="metric-label">Views:</span>
                          <span className="metric-value">{selectedProject.metrics.views}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Rating:</span>
                          <span className="metric-value">{selectedProject.metrics.likes}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Comments:</span>
                          <span className="metric-value">{selectedProject.metrics.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            
            <Modal.Footer className="border-0 justify-content-between">
              <div className="modal-controls">
                <div className="form-check form-check-inline">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="autoplay" 
                    checked={autoplay} 
                    onChange={() => setAutoplay(s => !s)}
                  />
                  <label className="form-check-label" htmlFor="autoplay">Autoplay</label>
                </div>
                <div className="form-check form-check-inline">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="muted" 
                    checked={muted} 
                    onChange={() => setMuted(s => !s)}
                  />
                  <label className="form-check-label" htmlFor="muted">Muted</label>
                </div>
              </div>
              
              <div className="modal-actions">
                <Button 
                  variant="outline-primary" 
                  className="rounded-pill me-2"
                  onClick={() => {
                    if (selectedProject.type === 'youtube') {
                      copyToClipboard(REEL_URLS[selectedProject.id]);
                    } else {
                      copyToClipboard(`${window.location.origin}${selectedProject.videoSrc}`);
                    }
                  }}
                >
                  🔗 Copy Link
                </Button>
                {selectedProject.type === 'youtube' ? (
                  <a 
                    href={REEL_URLS[selectedProject.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary rounded-pill"
                    onMouseEnter={preconnectYouTube}
                    onClick={() => noteOpen(REEL_URLS[selectedProject.id])}
                  >
                    📺 Open on YouTube
                  </a>
                ) : (
                  <Button
                    variant="primary"
                    className="rounded-pill"
                    onClick={() => {
                      const video = currentModal === 'glass' ? glassVideoRef.current : introVideoRef.current;
                      if (video) {
                        if (video.requestFullscreen) {
                          video.requestFullscreen();
                        } else if (video.webkitRequestFullscreen) {
                          video.webkitRequestFullscreen();
                        } else if (video.msRequestFullscreen) {
                          video.msRequestFullscreen();
                        }
                      }
                    }}
                  >
                    🔍 Full Screen
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Keyboard Shortcuts Help */}
      {showLegend && (
        <div className="shortcuts-panel">
          <div className="panel-header">
            <h6 className="mb-0">Keyboard Shortcuts</h6>
            <button 
              className="btn btn-sm btn-link p-0"
              onClick={() => setShowLegend(false)}
            >
              ✖️
            </button>
          </div>
          <div className="panel-content">
            <div className="shortcut-item">
              <kbd>1-5</kbd>
              <span>Open project modals</span>
            </div>
            <div className="shortcut-item">
              <kbd>A</kbd>
              <span>Toggle autoplay</span>
            </div>
            <div className="shortcut-item">
              <kbd>M</kbd>
              <span>Toggle mute</span>
            </div>
            <div className="shortcut-item">
              <kbd>L</kbd>
              <span>Toggle this panel</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd>
              <span>Close modal</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <Button
          variant="primary"
          className="fab rounded-circle"
          onClick={() => setShowLegend(s => !s)}
          title="Keyboard shortcuts"
        >
          ❓
        </Button>
        
        {showTop && (
          <Button
            variant="secondary"
            className="fab rounded-circle"
            onClick={() => scrollToTop()}
            title="Back to top"
          >
            ⬆️
          </Button>
        )}
      </div>
    </Container>
  );
}

export default Animation;