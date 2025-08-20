import React, { useState, useEffect, useRef } from 'react';
import { Card, Container, Row, Col, CardGroup, NavDropdown, Modal, Button } from 'react-bootstrap';
import sword from '../../assets/images/sword.png';
import demoR from '../../assets/images/3dModels.png';
import './Home.css';
import SocialIcons from '../SocialIcons';

export const Home = () => {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  // new features: autoplay / mute / legend / share feedback (persisted)
  const [autoplay, setAutoplay] = useState(() => {
    try { return localStorage.getItem('nebula_autoplay') === '1'; } catch { return false; }
  });
  const [muted, setMuted] = useState(() => {
    try {
      const v = localStorage.getItem('nebula_muted');
      return v == null ? true : v === '1';
    } catch { return true; }
  });
  const [showLegend, setShowLegend] = useState(() => {
    try { return localStorage.getItem('nebula_showLegend') === '1'; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem('nebula_showLegend', showLegend ? '1' : '0'); } catch (e) {} }, [showLegend]);
  const [shareMsg3D, setShareMsg3D] = useState('');
  const [shareMsgVFX, setShareMsgVFX] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');
  // modal announcements for screen readers
  const [modalAnnounce, setModalAnnounce] = useState('');
  // preconnect tracking
  const ytPrefetched = useRef(false);
  const docsPrefetched = useRef(false);

  // persist autoplay/mute
  useEffect(() => {
    try {
      localStorage.setItem('nebula_autoplay', autoplay ? '1' : '0');
      localStorage.setItem('nebula_muted', muted ? '1' : '0');
    } catch (e) {}
  }, [autoplay, muted]);

  // refs for potential focus management
  const modal3DRef = useRef(null);
  const modalVfxRef = useRef(null);
  // iframe refs so we can pause players
  const featuredIframeRef = useRef(null);
  const modal3DIframeRef = useRef(null);
  const modalVfxIframeRef = useRef(null);
  // detect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // preconnect helper called on hover (speed up iframe load)
  const preconnectYouTube = () => {
    try {
      if (ytPrefetched.current || typeof document === 'undefined') return;
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
      ytPrefetched.current = true;
    } catch (e) {}
  };

  // simple analytics for external opens
  const noteOpen = (label) => { try { console.info('analytics', 'open_link', label); } catch (e) {} };

  const preconnectDocs = () => {
    try {
      if (docsPrefetched.current || typeof document === 'undefined') return;
      const host = new URL('/documents/resume-cn-25.pdf', window.location.origin).origin;
      if (!document.querySelector(`link[rel="preconnect"][href="${host}"]`)) {
        const l = document.createElement('link');
        l.rel = 'preconnect';
        l.href = host;
        l.crossOrigin = 'anonymous';
        document.head.appendChild(l);
      }
      docsPrefetched.current = true;
    } catch (e) {}
  };

  // share helpers (Twitter / LinkedIn)
  const openShareWindow = (platform, url) => {
    try {
      let shareUrl = '';
      if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Check out this reel from Colin Nebula')}`;
      } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      } else return;
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=460');
      console.info('analytics', 'share', platform, url);
    } catch (e) {}
  };

  // basic focus trap for open modals (keeps Tab inside modal)
  useEffect(() => {
    const trap = (e) => {
      if (!(lgShow || lgShow1)) return;
      if (e.key !== 'Tab') return;
      const modal = document.querySelector('.custom-modal.show .modal-content');
      if (!modal) return;
      const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [lgShow, lgShow1]);

  // when a modal opens, focus its close button and announce
  useEffect(() => {
    if (lgShow) {
      setModalAnnounce('Opened 3D demo reel');
      const delay = prefersReducedMotion ? 0 : 80;
      setTimeout(() => {
        const el = document.querySelector('.custom-modal.show .btn-close');
        if (el && typeof el.focus === 'function') el.focus();
      }, delay);
    } else if (lgShow1) {
      setModalAnnounce('Opened VFX reel');
      const delay = prefersReducedMotion ? 0 : 80;
      setTimeout(() => {
        const el = document.querySelector('.custom-modal.show .btn-close');
        if (el && typeof el.focus === 'function') el.focus();
      }, delay);
    } else {
      // clear announcement shortly after close
      const t = setTimeout(() => setModalAnnounce(''), 800);
      return () => clearTimeout(t);
    }
  }, [lgShow, lgShow1, prefersReducedMotion]);

  // feature: project filter ('all' | '3d' | 'vfx')
  const [filter, setFilter] = useState(() => {
    try { return localStorage.getItem('nebula_filter') || 'all'; } catch { return 'all'; }
  });
  // persist filter
  useEffect(() => {
    try { localStorage.setItem('nebula_filter', filter); } catch (e) {}
  }, [filter]);
  // feature: back to top visibility
  const [showTop, setShowTop] = useState(false);
  // accessibility announcement for filter changes
  const [announce, setAnnounce] = useState('');
  // current year used in footer
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // set a helpful document title
  useEffect(() => {
    document.title = 'Colin Nebula — 3D Portfolio';
  }, []);

  // announce filter changes for screen readers
  useEffect(() => {
    if (!announce) return;
    const t = setTimeout(() => setAnnounce(''), 1200);
    return () => clearTimeout(t);
  }, [announce]);

  // helper: scroll to top safely
  const scrollToTop = (behavior = 'smooth') => {
    if (typeof window !== 'undefined' && window.scrollTo) {
      // respect user's reduced-motion preference
      const finalBehavior = prefersReducedMotion ? 'auto' : behavior;
      window.scrollTo({ top: 0, behavior: finalBehavior });
    }
  };

  // open 3D modal and scroll to top first
  const open3DModal = () => {
    scrollToTop();
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => {
      console.info('analytics', 'open_modal', '3d_demo');
      // pause hero player to avoid overlapping audio
      pauseYouTube(featuredIframeRef);
      setLgShow(true);
      setAnnounce('Opened 3D demo reel');
    }, delay);
  };

  // open VFX modal and scroll to top first
  const openVFXModal = () => {
    scrollToTop();
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => {
      console.info('analytics', 'open_modal', 'vfx_reel');
      // pause hero player to avoid overlapping audio
      pauseYouTube(featuredIframeRef);
      setLgShow1(true);
      setAnnounce('Opened VFX reel');
    }, delay);
  };

  // handle filter change with announcement
  const changeFilter = (value) => {
    setFilter(value);
    setAnnounce(`Filter set to ${value}`);
    scrollToTop('auto');
  };
  const resetFilter = () => {
    setFilter('all');
    try { localStorage.removeItem('nebula_filter'); } catch (e) {}
    setAnnounce('Filter reset to all');
    scrollToTop('auto');
  };

  // reel URLs (canonical)
  const reel3DUrl = 'https://www.youtube.com/watch?v=mPxmNbMpO7A';
  const reelVfxUrl = 'https://www.youtube.com/watch?v=tFwtXZw_VzM';

  // helper: build embed src honoring autoplay & mute
  const getEmbedSrc = (videoId) => {
    const params = new URLSearchParams();
    params.set('rel', '0');
    params.set('modestbranding', '1');
    params.set('playsinline', '1');
    params.set('enablejsapi', '1');
    try { if (typeof window !== 'undefined' && window.location && window.location.origin) params.set('origin', window.location.origin); } catch (e) {}
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('mute', '1');
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // pause a youtube iframe (requires enablejsapi=1)
  const pauseYouTube = (ref) => {
    try {
      const f = ref && ref.current;
      if (!f || !f.contentWindow) return;
      const msg = JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] });
      f.contentWindow.postMessage(msg, '*');
    } catch (e) {}
  };

  // copy helper with accessible feedback + analytics
  const copyToClipboard = async (text, setMsg) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
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
    } catch (err) {
      setMsg('Copy failed');
      setTimeout(() => setMsg(''), 1400);
    }
  };

  // keyboard shortcuts: 1 -> open 3D modal, 2 -> open VFX modal, A -> autoplay, M -> mute, L -> legend
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === '1') {
        // open 3D modal (reuse existing helper behavior)
        open3DModal();
      } else if (k === '2') {
        openVFXModal();
      } else if (k === 'a') {
        setAutoplay(s => !s);
      } else if (k === 'm') {
        setMuted(s => !s);
      } else if (k === 'l') {
        setShowLegend(s => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [autoplay, muted, prefersReducedMotion]);

  const downloadResume = async () => {
    const url = '/documents/resume-cn-25.pdf';
    try {
      setDownloadLoading(true);
      setDownloadMsg('Starting download...');
      console.info('analytics', 'download_resume', url);
      // Try to fetch and download as blob so browsers save with filename instead of opening
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'resume-cn-25.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      setDownloadMsg('Download started');
      setTimeout(() => setDownloadMsg(''), 1800);
    } catch (e) {
      // fallback: open in new tab
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
        setDownloadMsg('Opened in new tab');
        setTimeout(() => setDownloadMsg(''), 1800);
      } catch (err) {
        setDownloadMsg('Download failed');
        setTimeout(() => setDownloadMsg(''), 1800);
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Container fluid className="home-container">
      {/* small help button to toggle legend (persisted) */}
      <button
        onClick={() => setShowLegend(s => !s)}
        aria-label="Toggle shortcuts legend"
        title="Shortcuts (L)"
        style={{
          position: 'fixed',
          left: 12,
          bottom: 70,
          zIndex: 1300,
          width: 36,
          height: 36,
          borderRadius: 18,
          border: 'none',
          background: 'var(--primary)',
          color: 'var(--light)',
          cursor: 'pointer'
        }}
      >?</button>
      {/* skip link for keyboard users */}
      <a href="#main-content" className="visually-hidden focusable" style={{position:'absolute',left:8,top:8,zIndex:2000}}>Skip to content</a>
      <div id="main-content" />
      {/* live region for modal open/close (polite) */}
      <div aria-live="polite" className="visually-hidden">{modalAnnounce}</div>
      {/* on-screen legend */}
      {showLegend && (
        <div style={{
          position: 'fixed', left: 12, bottom: 12, zIndex: 1200,
          background: 'var(--card-bg)', color: 'var(--text)',
          padding: '8px 10px', borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
        }}>
          <div style={{ fontSize: 12, marginBottom: 6 }}><strong>Shortcuts</strong></div>
          <div style={{ fontSize: 12 }}>1: Open 3D • 2: Open VFX • A: Toggle Autoplay • M: Toggle Mute • L: Toggle Legend</div>
          <button className="btn btn-sm btn-link" onClick={() => setShowLegend(false)} aria-label="Close legend">Close</button>
        </div>
      )}

      {/* Modal for 2014 Demo Reel */}
      <div>
        <>
          <Modal
            size="xl"
            show={lgShow}
            onHide={() => { setLgShow(false); setAnnounce(''); setModalAnnounce(''); pauseYouTube(modal3DIframeRef); }}
            aria-labelledby="example-modal-sizes-title-lg"
            ref={modal3DRef}
            className="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
                2014 Demo Reel
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Objects were modeled, UV unwrapped, and textured in Maya 3D software.
                Sculpted in ZBrush and painted in Photoshop.
                Post effects were done using Fusion.
              </p>
              <div className="ratio ratio-21x9">
                <iframe
                  ref={modal3DIframeRef}
                  loading="lazy"
                  width="100%"
                  height="480"
                  src={getEmbedSrc('mPxmNbMpO7A')}
                  title="2014 Demo Reel"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <a onMouseEnter={preconnectYouTube} onClick={() => noteOpen(reel3DUrl)} className="btn btn-sm btn-outline-primary" href={reel3DUrl} target="_blank" rel="noopener noreferrer" title="Open 3D reel on YouTube">Open on YouTube</a>
                <button aria-label="Copy 3D reel link" title="Copy link" className="btn btn-sm btn-outline-secondary" onClick={() => { copyToClipboard(reel3DUrl, setShareMsg3D); }}>
                  Copy link
                </button>
                <button aria-label="Share 3D on Twitter" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('twitter', reel3DUrl)}>Tweet</button>
                <button aria-label="Share 3D on LinkedIn" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('linkedin', reel3DUrl)}>LinkedIn</button>
                {/* visible share feedback */}
                {shareMsg3D && <span role="status" style={{ marginLeft: 8, fontSize: 12, color: 'var(--primary)' }}>{shareMsg3D}</span>}
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

      {/* Modal for VFX Reel 2024 */}
      <div>
        <>
          <Modal
            size="xl"
            show={lgShow1}
            onHide={() => { setLgShow1(false); setModalAnnounce(''); pauseYouTube(modalVfxIframeRef); }}
            aria-labelledby="example-modal-sizes-title-lg"
            className="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
                VFX Reel 2024
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Thank you for viewing my most recent reel. All objects were created in Blender.
                After Effects was used for camera and motion tracking of the raw footage.
              </p>
              <div className="ratio ratio-16x9">
                <iframe
                  ref={modalVfxIframeRef}
                  loading="lazy"
                  width="100%"
                  height="480"
                  src={getEmbedSrc('mPxmNbMpO7A')}
                  title="VFX Reel 2024"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <a onMouseEnter={preconnectYouTube} onClick={() => noteOpen(reelVfxUrl)} className="btn btn-sm btn-outline-primary" href={reelVfxUrl} target="_blank" rel="noopener noreferrer" title="Open VFX reel on YouTube">Open on YouTube</a>
                <button aria-label="Copy VFX reel link" title="Copy link" className="btn btn-sm btn-outline-secondary" onClick={() => { copyToClipboard(reelVfxUrl, setShareMsgVFX); }}>
                  Copy link
                </button>
                <button aria-label="Share VFX on Twitter" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('twitter', reelVfxUrl)}>Tweet</button>
                <button aria-label="Share VFX on LinkedIn" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('linkedin', reelVfxUrl)}>LinkedIn</button>
                {shareMsgVFX && <span role="status" style={{ marginLeft: 8, fontSize: 12, color: 'var(--primary)' }}>{shareMsgVFX}</span>}
              </div>

              <br />
              <br />
              <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
                Past VFX Projects
              </Modal.Title>
              <br />
              <p>
                This VFX reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles,
                and other aspects to help complete the project.
                Photoshop and Maya were used predominantly.
                <br />
                <br />
                Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
                My job was to very precisely roto-scope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments.
                This was accomplished utilizing Nuke primarily.
              </p>
              <div className="ratio ratio-16x9">
                <iframe
                  loading="lazy"
                  width="100%"
                  height="480"
                  src={getEmbedSrc('tFwtXZw_VzM')}
                  title="Past VFX Projects"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </Modal.Body>
          </Modal>
        </>
      </div>

      {/* Introduction Section */}
      <Col xs={12} className="text-center intro-section">
        <h2 className="top_text"> Welcome to Nebula 3D</h2>
        <p className="top-p">
          My name is Colin Nebula, and I am a 3D Artist and a computer enthusiast. Thank you for visiting my online portfolio!
        </p>
        <div style={{ margin: '10px 0' }}>
          <button
            onMouseEnter={preconnectDocs}
            onClick={downloadResume}
            className="btn btn-outline-primary"
            title="Download resume"
            aria-live="polite"
            aria-busy={downloadLoading}
            disabled={downloadLoading}
            style={{ marginRight: 8 }}
          >
            {downloadLoading ? 'Downloading…' : 'Download Resume'}
          </button>
          <span className="visually-hidden" aria-live="polite">{downloadMsg}</span>
          <span style={{ marginLeft: 8 }}>Filter:</span>
          <div role="tablist" aria-label="Project filters" style={{ display: 'inline-block', marginLeft: 8 }}>
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => changeFilter('all')} aria-pressed={filter === 'all'} style={{ marginLeft: 6 }}>All</button>
            <button className={`btn btn-sm ${filter === '3d' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => changeFilter('3d')} aria-pressed={filter === '3d'} style={{ marginLeft: 6 }}>3D</button>
            <button className={`btn btn-sm ${filter === 'vfx' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => changeFilter('vfx')} aria-pressed={filter === 'vfx'} style={{ marginLeft: 6 }}>VFX</button>
            <button className="btn btn-sm btn-outline-dark" onClick={resetFilter} title="Reset filter" style={{ marginLeft: 8 }} aria-label="Reset filter">Reset</button>
           </div>
          {/* active filter label */}
          <span aria-hidden="true" style={{ marginLeft: 10, fontSize: 12, color: 'var(--muted)' }}>
            {filter === 'all' ? 'Showing: All' : filter === '3d' ? 'Showing: 3D' : 'Showing: VFX'}
          </span>
           {/* live region for screen readers */}
           <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999 }}>{announce}</div>
         </div>
        <NavDropdown.Divider />
      </Col>

      {/* Featured VFX Reel */}
      <Col xs={12} className="mb-4 px-0">
        <Card
          className="overflow bg-dark text-white shadow-lg"
          style={{
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            width: '100vw',
            borderRadius: 0
          }}
        >
          <div className="ratio ratio-21x9"> {/* cinematic 21:9 */}
            <iframe
              ref={featuredIframeRef}
              loading="lazy"
              width="100%"
              height="720"
              src={getEmbedSrc('tFwtXZw_VzM')}
              title="VFX Blender Reel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              onMouseEnter={preconnectYouTube}
            />
          </div>
          <Card.ImgOverlay style={{ pointerEvents: 'none', left: 24, bottom: 24 }}>
            <Card.Title style={{ fontSize: 28, fontWeight: 700 }}>VFX Blender Reel</Card.Title>
            <Card.Text style={{ fontSize: 16 }}>
              This is my most recent VFX reel created with Blender and After Effects.
            </Card.Text>
          </Card.ImgOverlay>
        </Card>
      </Col>

      {/* Portfolio Overview */}
      <Col xs={12} className="text-center portfolio-overview">
        <h2 className="middle_text"> Colin Nebula 3D Portfolio</h2>
        <p className="mid-p">
          3D modeling is a fun and continuous learning process: creating, animating, learning, and improving.
        </p>
        <NavDropdown.Divider />
      </Col>

      {/* Demo Reels Card Group */}
      <Col xs={12}>
        <CardGroup>
          { (filter === 'all' || filter === '3d') && (
            <Card className="overflow bg-dark text-white shadow-lg" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open3DModal(); }}
              role="button" aria-label="Open 3D Modeling Demo Reel">
              <Card.Img variant="top" src={demoR} className="card-image rounded" alt="Demo Reel" loading="lazy" />
              <Card.Body>
                <Card.Title>3D Modeling Demo Reel</Card.Title>
                <Card.Text>
                  This demo reel showcases my 3D modeling and texturing skills using industry-standard software such as Blender, Zbrush, Photoshop, xNormal, and After Effects.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <Button onMouseEnter={preconnectYouTube} variant="outline-warning" onClick={open3DModal} aria-label="View 3D reel">View Reel</Button>
                  <button aria-label="Copy 3D reel link" title="Copy 3D link" className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(reel3DUrl, setShareMsg3D)}>Copy</button>
                  <a onMouseEnter={preconnectYouTube} onClick={() => noteOpen(reel3DUrl)} className="btn btn-sm btn-outline-primary" href={reel3DUrl} target="_blank" rel="noopener noreferrer" title="Open 3D reel on YouTube">Open</a>
                  <button aria-label="Share 3D on Twitter" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('twitter', reel3DUrl)}>Tweet</button>
                  <button aria-label="Share 3D on LinkedIn" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('linkedin', reel3DUrl)}>LinkedIn</button>
                 {shareMsg3D && <span role="status" aria-hidden="false" style={{marginLeft:8, fontSize:12, color:'var(--primary)'}}>{shareMsg3D}</span>}
                </div>
               </Card.Footer>
             </Card>
           )}

          { (filter === 'all' || filter === 'vfx') && (
            <Card className="overflow bg-dark text-white shadow-lg" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openVFXModal(); }}
              role="button" aria-label="Open VFX Reel">
              <Card.Img variant="top" src={sword} className="card-image rounded" alt="VFX Reel" loading="lazy" />
              <Card.Body>
                <Card.Title>VFX Reel</Card.Title>
                <Card.Text>
                  This VFX reel displays post-production effects and includes some of the work I was involved with at Intelligent Creatures Toronto.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <Button onMouseEnter={preconnectYouTube} variant="outline-warning" onClick={openVFXModal} aria-label="View VFX reel">View Reel</Button>
                  <button aria-label="Copy VFX reel link" title="Copy VFX link" className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(reelVfxUrl, setShareMsgVFX)}>Copy</button>
                  <a onMouseEnter={preconnectYouTube} onClick={() => noteOpen(reelVfxUrl)} className="btn btn-sm btn-outline-primary" href={reelVfxUrl} target="_blank" rel="noopener noreferrer" title="Open VFX reel on YouTube">Open</a>
                  <button aria-label="Share VFX on Twitter" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('twitter', reelVfxUrl)}>Tweet</button>
                  <button aria-label="Share VFX on LinkedIn" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow('linkedin', reelVfxUrl)}>LinkedIn</button>
                 {shareMsgVFX && <span role="status" aria-hidden="false" style={{marginLeft:8, fontSize:12, color:'var(--primary)'}}>{shareMsgVFX}</span>}
                </div>
               </Card.Footer>
             </Card>
           )}
         </CardGroup>
       </Col>
      {/* ensure back-to-top respects reduced-motion elsewhere if present */}
      {/* Footer Section (semantic and accessible) */}
      <footer id="site-footer" role="contentinfo" className="footer" aria-label="Site footer">
        <Container fluid>
          <Row className="align-items-center py-3">
            <Col md={8} className="text-md-start text-center">
              <div className="rights">© {currentYear} Colin Nebula</div>
            </Col>
            <Col md={4} className="icons text-md-end text-center">
              <div aria-label="Social links"><SocialIcons /></div>
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

export default Home;