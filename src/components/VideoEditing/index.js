import React, {useState, useEffect, useRef, useCallback} from "react";
import vfxDemo from '../../assets/images/Sniper_wireCombo0001.jpg';
import videoProduction from '../../assets/images/byte3.png';
import motionGraphics from '../../assets/images/shapeAnimation.png';
import { Card, Container, Button, NavDropdown, Modal, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNotifications } from '../../App';
import VideoPlayer from './VideoPlayer';
import VideoPlaylist from './VideoPlaylist';
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

  // Featured hero video - can be easily changed to any video platform
  const [heroVideoUrl, setHeroVideoUrl] = useState('https://www.youtube.com/watch?v=mPxmNbMpO7A');
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Example video URLs for different platforms
  const videoExamples = {
    youtube: REEL.recent.url,
    vimeo: 'https://vimeo.com/76979871', // Example Vimeo video
    dailymotion: 'https://www.dailymotion.com/video/x7tgad0', // Example DailyMotion video
    tiktok: 'https://www.tiktok.com/@username/video/1234567890', // Example TikTok (limited embed)
    instagram: 'https://www.instagram.com/p/ABC123/', // Example Instagram post
    twitter: 'https://twitter.com/user/status/1234567890', // Example Twitter video
    // twitch: 'https://www.twitch.tv/videos/123456789', // Example Twitch VOD
  };

  // Colin Nebula Reels Collection
  const colinNebulaReels = [
    {
      title: "Colin Nebula 2024 VFX Reel",
      url: REEL.recent.url,
      description: "Latest visual effects showcase featuring advanced compositing and motion tracking",
      duration: "3:45",
      thumbnail: vfxDemo,
      tags: ["VFX", "Motion Tracking", "Compositing", "2024"],
      platform: "youtube"
    },
    {
      title: "VFX Demo Reel",
      url: REEL.demo.url,
      description: "Professional visual effects demonstration showcasing various techniques",
      duration: "4:12",
      thumbnail: motionGraphics,
      tags: ["VFX", "Demo", "Professional", "Effects"],
      platform: "youtube"
    },
    {
      title: "Byte3 Animation Demo", 
      url: REEL.byte.url,
      description: "3D animation and rigging demonstration with character work",
      duration: "2:30",
      thumbnail: videoProduction,
      tags: ["3D Animation", "Rigging", "Character", "Blender"],
      platform: "youtube"
    }
  ];

  // Sample playlist for demonstration
  const [samplePlaylist] = useState(colinNebulaReels);

  // Playlist state management

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlistAutoAdvance, setPlaylistAutoAdvance] = useState(false);
  const [playlistShuffle, setPlaylistShuffle] = useState(false);

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      setHeroVideoUrl(customUrl.trim());
      setIsHeroPlaying(false);
      setShowCustomInput(false);
      setCustomUrl('');
      showNotification('Custom video URL loaded!', 'success');
    }
  };

  const handleReelSelect = (reel) => {
    setHeroVideoUrl(reel.url);
    setIsHeroPlaying(false);
    showNotification(`Now loading: ${reel.title}`, 'info', 2000);
  };

  const handlePlatformSwitch = (platform, url) => {
    setHeroVideoUrl(url);
    setIsHeroPlaying(false);
    showNotification(`Switched to ${platform} video`, 'info', 2000);
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
                
                <div className="player-controls d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center mb-4">
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <a 
                      className="btn btn-primary rounded-pill flex-grow-1" 
                      href={REEL.demo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-youtube me-2"></i>Open on YouTube
                    </a>
                    <button 
                      className="btn btn-outline-secondary rounded-pill flex-grow-1" 
                      onClick={() => copyToClipboard(REEL.demo.url)}
                    >
                      <i className="bi bi-link-45deg me-2"></i>Copy link
                    </button>
                  </div>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <label className="form-check form-switch d-flex align-items-center">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-2" 
                        checked={autoplay} 
                        onChange={() => setAutoplay(v => !v)} 
                      /> 
                      <span className="form-check-label">Autoplay</span>
                    </label>
                    <label className="form-check form-switch d-flex align-items-center">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-2" 
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
                
                <div className="player-controls d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center mb-4">
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <a 
                      className="btn btn-primary rounded-pill flex-grow-1" 
                      href={REEL.recent.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-youtube me-2"></i>Open on YouTube
                    </a>
                    <button 
                      className="btn btn-outline-secondary rounded-pill flex-grow-1" 
                      onClick={() => copyToClipboard(REEL.recent.url)}
                    >
                      <i className="bi bi-link-45deg me-2"></i>Copy link
                    </button>
                  </div>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <label className="form-check form-switch d-flex align-items-center">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-2" 
                        checked={autoplay} 
                        onChange={() => setAutoplay(v => !v)} 
                      /> 
                      <span className="form-check-label">Autoplay</span>
                    </label>
                    <label className="form-check form-switch d-flex align-items-center">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-2" 
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
                
                <div className="player-controls d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center mb-4">
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <a 
                      className="btn btn-primary rounded-pill flex-grow-1" 
                      href={REEL.byte.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-youtube me-2"></i>Open on YouTube
                    </a>
                    <button 
                      className="btn btn-outline-secondary rounded-pill flex-grow-1" 
                      onClick={() => copyToClipboard(REEL.byte.url)}
                    >
                      <i className="bi bi-link-45deg me-2"></i>Copy link
                    </button>
                  </div>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <label className="form-check form-switch d-flex align-items-center">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-2" 
                        checked={autoplay} 
                        onChange={() => setAutoplay(v => !v)} 
                      /> 
                      <span className="form-check-label">Autoplay</span>
                    </label>
                    <label className="form-check form-switch d-flex align-items-center">
                      <input 
                        type="checkbox" 
                        className="form-check-input me-2" 
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

        <div className="text-center mb-4 mb-lg-5 px-2">
          <h1 className="display-4 display-lg-3 fw-bold mb-3 text-gradient">VFX and Video Editing</h1>
          <p className="lead fs-6 fs-lg-5 mb-4 text-muted">
            Professional video production combining 3D software rendering with advanced post-production effects
          </p>
          <hr className="border-2 border-primary w-50 w-lg-25 mx-auto mb-4 mb-lg-5" />
        </div>

        <div className="px-2 px-lg-4 px-xl-5 px-xxl-0">
          {/* Featured VFX Reel 2024 - Enhanced hero section */}
          <section className="featured-showcase mb-5" role="banner" aria-labelledby="hero-title">
            <Card className="bg-dark text-white shadow-lg border-0">
              <div className="position-relative w-100" style={{ padding: 0, margin: 0 }}>
                <VideoPlayer
                  url={heroVideoUrl}
                  poster=""
                  title={colinNebulaReels.find(reel => reel.url === heroVideoUrl)?.title || "Colin Nebula 2024 VFX Reel"}
                  onPlay={() => {
                    setIsHeroPlaying(true);
                    console.info('analytics', 'hero_video_play', 'youtube');
                  }}
                  onPause={() => setIsHeroPlaying(false)}
                  className="hero-video-player video-player"
                />
                
                {/* Video info overlay - only show when not playing */}
                {!isHeroPlaying && (
                  <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-dark" style={{ zIndex: 4, pointerEvents: 'none', background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)', padding: '2rem 1rem 1rem 1rem' }}>
                    <div className="row align-items-end g-3" style={{ pointerEvents: 'auto' }}>
                      <div className="col-md-8 col-xl-9">
                        <h2 id="hero-title" className="h2 fw-bold mb-2 text-white transition-all">
                          {colinNebulaReels.find(reel => reel.url === heroVideoUrl)?.title || "Colin Nebula 2024 VFX Reel"}
                        </h2>
                        <p className="fs-6 fs-lg-5 mb-3 text-white-50 transition-all">
                          {colinNebulaReels.find(reel => reel.url === heroVideoUrl)?.description || "Watch the latest visual effects showcase created with Blender and After Effects"}
                        </p>
                        <div className="d-flex flex-wrap gap-2 align-items-center mb-3" role="list">
                          <span className="badge bg-primary px-2 px-lg-3 py-1 py-lg-2 transition-all" role="listitem">
                            {heroVideoUrl.includes('youtube') ? 'YouTube' : 
                             heroVideoUrl.includes('vimeo') ? 'Vimeo' : 
                             heroVideoUrl.includes('dailymotion') ? 'DailyMotion' :
                             heroVideoUrl.includes('twitch') ? 'Twitch' : 'Video'}
                          </span>
                          {/* Dynamic tags based on selected reel */}
                          {(colinNebulaReels.find(reel => reel.url === heroVideoUrl)?.tags || ["Blender", "After Effects", "Motion Tracking"]).map((tag, index) => (
                            <span key={index} className="badge bg-secondary px-2 px-lg-3 py-1 py-lg-2 transition-all" role="listitem">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Colin's Reels Selector */}
                        <div className="mb-3">
                          <small className="text-white-50 d-block mb-2">My Reels:</small>
                          <div className="d-flex flex-wrap gap-1">
                            {colinNebulaReels.map((reel, index) => (
                              <Button
                                key={index}
                                variant={heroVideoUrl === reel.url ? "primary" : "outline-light"}
                                size="sm"
                                className="px-2 py-1 fw-semibold"
                                onClick={() => handleReelSelect(reel)}
                                title={reel.description}
                              >
                                {reel.title.includes('2024') ? '2024 Reel' : 
                                 reel.title.includes('Demo') ? 'Demo Reel' : 
                                 reel.title.includes('Byte3') ? 'Byte3' : 
                                 `Reel ${index + 1}`}
                              </Button>
                            ))}
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="px-2 py-1 fw-semibold"
                              onClick={() => {
                                navigator.clipboard.writeText(heroVideoUrl);
                                showNotification('Video URL copied to clipboard!', 'success', 2000);
                              }}
                              title="Copy current video URL"
                            >
                              <i className="bi bi-clipboard me-1"></i>Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-xl-3 text-center text-md-end">
                        <div className="d-flex flex-column gap-2">
                          <small className="text-white-50 mb-1">Video Platforms:</small>
                          
                          {/* Primary Platforms */}
                          <div className="d-flex gap-1 mb-2">
                            <Button 
                              variant={heroVideoUrl === videoExamples.youtube ? "warning" : "outline-light"} 
                              size="sm" 
                              className="px-2 py-1 fw-semibold flex-grow-1"
                              onClick={() => handlePlatformSwitch('YouTube', videoExamples.youtube)}
                              title="Switch to YouTube video"
                            >
                              <i className="bi bi-youtube me-1"></i>YouTube
                            </Button>
                            <Button 
                              variant={heroVideoUrl === videoExamples.vimeo ? "warning" : "outline-light"} 
                              size="sm" 
                              className="px-2 py-1 fw-semibold flex-grow-1"
                              onClick={() => handlePlatformSwitch('Vimeo', videoExamples.vimeo)}
                              title="Switch to Vimeo video"
                            >
                              <i className="bi bi-vimeo me-1"></i>Vimeo
                            </Button>
                          </div>
                          
                          {/* Social Media Platforms */}
                          <div className="d-flex gap-1 mb-2">
                            <Button 
                              variant={heroVideoUrl === videoExamples.tiktok ? "warning" : "outline-light"} 
                              size="sm" 
                              className="px-2 py-1 fw-semibold flex-grow-1"
                              onClick={() => handlePlatformSwitch('TikTok', videoExamples.tiktok)}
                              title="Switch to TikTok video"
                            >
                              <i className="bi bi-tiktok me-1"></i>TikTok
                            </Button>
                            <Button 
                              variant={heroVideoUrl === videoExamples.instagram ? "warning" : "outline-light"} 
                              size="sm" 
                              className="px-2 py-1 fw-semibold flex-grow-1"
                              onClick={() => handlePlatformSwitch('Instagram', videoExamples.instagram)}
                              title="Switch to Instagram video"
                            >
                              <i className="bi bi-instagram me-1"></i>IG
                            </Button>
                            <Button 
                              variant={heroVideoUrl === videoExamples.twitter ? "warning" : "outline-light"} 
                              size="sm" 
                              className="px-2 py-1 fw-semibold flex-grow-1"
                              onClick={() => handlePlatformSwitch('Twitter/X', videoExamples.twitter)}
                              title="Switch to Twitter/X video"
                            >
                              <i className="bi bi-twitter-x me-1"></i>X
                            </Button>
                          </div>
                          
                          {/* Additional Options */}
                          <div className="d-flex gap-1 mb-2">
                            <Button 
                              variant={heroVideoUrl === videoExamples.dailymotion ? "warning" : "outline-light"} 
                              size="sm" 
                              className="px-2 py-1 fw-semibold flex-grow-1"
                              onClick={() => handlePlatformSwitch('DailyMotion', videoExamples.dailymotion)}
                              title="Switch to DailyMotion video"
                            >
                              <i className="bi bi-camera-video me-1"></i>Daily
                            </Button>
                            <Button 
                              variant={showPlaylist ? "warning" : "outline-info"} 
                              size="sm" 
                              className="px-2 py-1 fw-semibold flex-grow-1"
                              onClick={() => {
                                setShowPlaylist(!showPlaylist);
                                showNotification(
                                  showPlaylist ? 'Playlist hidden' : 'Playlist shown', 
                                  'info', 
                                  1500
                                );
                              }}
                              title="Toggle playlist mode"
                            >
                              <i className="bi bi-collection-play me-1"></i>Playlist
                            </Button>
                          </div>
                          
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="px-3 py-1 fw-semibold"
                            onClick={() => {
                              setShowCustomInput(!showCustomInput);
                              showNotification(
                                showCustomInput ? 'Custom URL input hidden' : 'Custom URL input shown', 
                                'info', 
                                1500
                              );
                            }}
                            title="Enter custom video URL"
                          >
                            <i className="bi bi-link-45deg me-1"></i>Custom URL
                          </Button>
                          
                          {showCustomInput && (
                            <div className="mt-2">
                              <InputGroup size="sm">
                                <Form.Control
                                  type="url"
                                  placeholder="Enter video URL..."
                                  value={customUrl}
                                  onChange={(e) => setCustomUrl(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleCustomUrl()}
                                  className="bg-dark text-light border-secondary"
                                  style={{ fontSize: '0.8rem' }}
                                />
                                <Button 
                                  variant="outline-success" 
                                  onClick={handleCustomUrl}
                                  disabled={!customUrl.trim()}
                                  title="Load custom video"
                                >
                                  <i className="bi bi-check-lg"></i>
                                </Button>
                              </InputGroup>
                              <small className="text-white-50 mt-1 d-block">
                                Supports YouTube, Vimeo, TikTok, Instagram, Twitter, DailyMotion
                              </small>
                              <small className="text-white-50 mt-1 d-block">
                                <strong>Shortcuts:</strong> Space = Play/Pause, Esc = Stop, F = Fullscreen
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* Playlist Section */}
          {showPlaylist && (
            <section className="playlist-showcase mb-5">
              <div className="text-center mb-4">
                <h2 className="h2 fw-bold mb-3">
                  <i className="bi bi-collection-play me-2 text-warning"></i>
                  Video Playlist
                </h2>
                <p className="fs-6 text-muted mb-4">
                  Experience multi-platform video playlist with auto-advance and shuffle features
                </p>
              </div>
              
              <VideoPlaylist 
                videos={samplePlaylist}
                autoAdvance={playlistAutoAdvance}
                shuffle={playlistShuffle}
                onVideoChange={(video) => {
                  console.log('Playlist video changed:', video.title);
                  showNotification(`Now playing: ${video.title}`, 'info');
                }}
                onAutoAdvanceChange={setPlaylistAutoAdvance}
                onShuffleChange={setPlaylistShuffle}
                className="shadow-lg"
              />
            </section>
          )}

          {/* Portfolio grid section */}
          <div className="portfolio-grid">
            <div className="text-center mb-4 mb-lg-5">
              <h2 className="h1 fw-bold mb-3">Portfolio Showcase</h2>
              <p className="fs-6 fs-lg-5 text-muted mb-4">
                Combining 2D and 3D tools to create compelling visual narratives
              </p>
            </div>

            <div className="row g-4">
              <div className="col-12 col-lg-6 col-xl-4 mb-4 mb-lg-0">
                <Card className="portfolio-card bg-dark text-white shadow-lg border-0 h-100 overflow-hidden">
                  <div className="position-relative">
                    <div className="ratio ratio-16x9">
                      <img 
                        loading="lazy" 
                        src={vfxDemo} 
                        className="card-img-top object-fit-cover transition-transform" 
                        alt="VFX Demo Reel - Professional Visual Effects Showcase"
                        onError={(e) => {
                          console.error('Failed to load vfxDemo image:', vfxDemo);
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('image-error');
                        }}
                        onLoad={(e) => {
                          console.log('vfxDemo image loaded successfully');
                          e.target.style.display = 'block';
                          e.target.parentElement.classList.add('image-loaded');
                        }}
                      />
                    </div>
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 opacity-0 transition-opacity d-flex align-items-center justify-content-center">
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
                    <div className="position-absolute top-3 end-3">
                      <span className="badge bg-danger bg-opacity-90 px-3 py-2 rounded-pill">
                        <i className="bi bi-award me-1"></i>Professional VFX
                      </span>
                    </div>
                  </div>
                  
                  <Card.Body className="p-3 p-lg-4 d-flex flex-column">
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-danger mb-2">Film Industry</span>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>2:35 min
                        </small>
                      </div>
                      <Card.Title className="h4 fw-bold mb-3">VFX Demo Reel</Card.Title>
                      <Card.Text className="text-white-50 flex-grow-1 lh-relaxed">
                        Professional visual effects demonstration showcasing industry experience 
                        in commercial and television production environments including rotoscoping, 
                        compositing, and 3D integration.
                      </Card.Text>
                    </div>
                    
                    <div className="border-top border-secondary pt-3 mt-auto">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <small className="text-muted">
                          <i className="bi bi-tools me-1"></i>Maya • Photoshop • Nuke • After Effects
                        </small>
                      </div>
                      
                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="flex-grow-1"
                          onClick={(e) => { 
                            lastActiveRef.current = e.currentTarget; 
                            scrollToTopAndOpen(() => setLgShow(true), 'demo'); 
                          }}
                        >
                          <i className="bi bi-play me-1"></i>Watch Demo
                        </Button>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-secondary flex-grow-1 flex-sm-grow-0" 
                            onClick={() => copyToClipboard(REEL.demo.url)}
                            title="Copy link"
                          >
                            <i className="bi bi-link-45deg"></i>
                            <span className="d-sm-none ms-1">Copy</span>
                          </button>
                          <a 
                            className="btn btn-sm btn-outline-primary flex-grow-1 flex-sm-grow-0" 
                            href={REEL.demo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Open on YouTube"
                          >
                            <i className="bi bi-youtube"></i>
                            <span className="d-sm-none ms-1">YouTube</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-12 col-lg-6 col-xl-4 mb-4 mb-lg-0">
                <Card className="portfolio-card bg-dark text-white shadow-lg border-0 h-100 overflow-hidden">
                  <div className="position-relative">
                    <div className="ratio ratio-16x9">
                      <img 
                        loading="lazy" 
                        src={videoProduction} 
                        className="card-img-top object-fit-cover transition-transform" 
                        alt="Byte Size Soccer - Educational Video Production"
                        onError={(e) => {
                          console.error('Failed to load videoProduction image:', videoProduction);
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('image-error');
                        }}
                        onLoad={(e) => {
                          console.log('videoProduction image loaded successfully');
                          e.target.style.display = 'block';
                          e.target.parentElement.classList.add('image-loaded');
                        }}
                      />
                    </div>
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 opacity-0 transition-opacity d-flex align-items-center justify-content-center">
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
                    <div className="position-absolute top-3 end-3">
                      <span className="badge bg-success bg-opacity-90 px-3 py-2 rounded-pill">
                        <i className="bi bi-mortarboard me-1"></i>Educational
                      </span>
                    </div>
                  </div>
                  
                  <Card.Body className="p-3 p-lg-4 d-flex flex-column">
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-success mb-2">Client Project</span>
                        <small className="text-muted">
                          <i className="bi bi-star-fill me-1"></i>Featured Work
                        </small>
                      </div>
                      <Card.Title className="h4 fw-bold mb-3">Educational Video Production</Card.Title>
                      <Card.Text className="text-white-50 flex-grow-1 lh-relaxed">
                        Complete video editing workflow for Byte Size Soccer featuring motion graphics, 
                        3D integration, sound design, and educational content optimization for young athletes.
                      </Card.Text>
                    </div>
                    
                    <div className="border-top border-secondary pt-3 mt-auto">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <small className="text-muted">
                          <i className="bi bi-tools me-1"></i>After Effects • Photoshop • Maya • Premiere Pro
                        </small>
                      </div>
                      
                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="flex-grow-1"
                          onClick={(e) => { 
                            lastActiveRef.current = e.currentTarget; 
                            scrollToTopAndOpen(() => setLgShow1(true), 'byte'); 
                          }}
                        >
                          <i className="bi bi-play me-1"></i>Watch Video
                        </Button>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-secondary flex-grow-1 flex-sm-grow-0" 
                            onClick={() => copyToClipboard(REEL.byte.url)}
                            title="Copy link"
                          >
                            <i className="bi bi-link-45deg"></i>
                            <span className="d-sm-none ms-1">Copy</span>
                          </button>
                          <a 
                            className="btn btn-sm btn-outline-primary flex-grow-1 flex-sm-grow-0" 
                            href={REEL.byte.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Open on YouTube"
                          >
                            <i className="bi bi-youtube"></i>
                            <span className="d-sm-none ms-1">YouTube</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              
              {/* Additional Motion Graphics Card */}
              <div className="col-12 col-lg-6 col-xl-4 mb-4 mb-lg-0">
                <Card className="portfolio-card bg-dark text-white shadow-lg border-0 h-100 overflow-hidden">
                  <div className="position-relative">
                    <div className="ratio ratio-16x9">
                      <img 
                        loading="lazy" 
                        src={motionGraphics} 
                        className="card-img-top object-fit-cover transition-transform" 
                        alt="Motion Graphics and Animation Work"
                        onError={(e) => {
                          console.error('Failed to load motionGraphics image:', motionGraphics);
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('image-error');
                        }}
                        onLoad={(e) => {
                          console.log('motionGraphics image loaded successfully');
                          e.target.style.display = 'block';
                          e.target.parentElement.classList.add('image-loaded');
                        }}
                      />
                    </div>
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 opacity-0 transition-opacity d-flex align-items-center justify-content-center">
                      <Button 
                        variant="outline-light" 
                        size="lg" 
                        className="rounded-pill px-4"
                        onClick={(e) => { 
                          lastActiveRef.current = e.currentTarget; 
                          scrollToTopAndOpen(() => setLgShow2(true), 'recent'); 
                        }}
                      >
                        <i className="bi bi-play-fill me-2"></i>View Reel
                      </Button>
                    </div>
                    <div className="position-absolute top-3 end-3">
                      <span className="badge bg-primary bg-opacity-90 px-3 py-2 rounded-pill">
                        <i className="bi bi-magic me-1"></i>Motion Graphics
                      </span>
                    </div>
                  </div>
                  
                  <Card.Body className="p-3 p-lg-4 d-flex flex-column">
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-primary mb-2">Latest Work</span>
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>2024
                        </small>
                      </div>
                      <Card.Title className="h4 fw-bold mb-3">Motion Graphics & Animation</Card.Title>
                      <Card.Text className="text-white-50 flex-grow-1 lh-relaxed">
                        Advanced motion graphics and 3D animation showcase featuring camera tracking, 
                        compositing, and seamless integration of CGI elements with live-action footage.
                      </Card.Text>
                    </div>
                    
                    <div className="border-top border-secondary pt-3 mt-auto">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <small className="text-muted">
                          <i className="bi bi-tools me-1"></i>Blender • After Effects • Cinema 4D
                        </small>
                      </div>
                      
                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="flex-grow-1"
                          onClick={(e) => { 
                            lastActiveRef.current = e.currentTarget; 
                            scrollToTopAndOpen(() => setLgShow2(true), 'recent'); 
                          }}
                        >
                          <i className="bi bi-play me-1"></i>Watch Reel
                        </Button>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-secondary flex-grow-1 flex-sm-grow-0" 
                            onClick={() => copyToClipboard(REEL.recent.url)}
                            title="Copy link"
                          >
                            <i className="bi bi-link-45deg"></i>
                            <span className="d-sm-none ms-1">Copy</span>
                          </button>
                          <a 
                            className="btn btn-sm btn-outline-primary flex-grow-1 flex-sm-grow-0" 
                            href={REEL.recent.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Open on YouTube"
                          >
                            <i className="bi bi-youtube"></i>
                            <span className="d-sm-none ms-1">YouTube</span>
                          </a>
                        </div>
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
