import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');
  // modal announcements for screen readers
  const [modalAnnounce, setModalAnnounce] = useState('');
  // subscription UI (enhanced)
  const [email, setEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [signupMsg, setSignupMsg] = useState('');
  const [subscribers, setSubscribers] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('nebula_email_subscribers') || '[]');
      // normalize older string arrays to objects { email, name, ts }
      if (!Array.isArray(raw)) return [];
      return raw.map(item => {
        if (!item) return null;
        if (typeof item === 'string') return { email: item, name: '', ts: new Date().toISOString() };
        if (typeof item === 'object' && item.email) return { email: item.email, name: item.name || '', ts: item.ts || new Date().toISOString() };
        return null;
      }).filter(Boolean);
    } catch {
      return [];
    }
  });
  const [signupSuccess, setSignupSuccess] = useState(''); // transient success toast
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [subscriberBusy, setSubscriberBusy] = useState(false);
  const [subscriberMsg, setSubscriberMsg] = useState('');
  // signup modal control
  const [showSignup, setShowSignup] = useState(false);
  useEffect(() => { try { localStorage.setItem('nebula_email_subscribers', JSON.stringify(subscribers)); } catch(e){} }, [subscribers]);
  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);
  // keyboard: press "s" to focus subscribe input (ignore typing in inputs)
  useEffect(() => {
    const onKey = (e) => {
      if (!e.key) return;
      if (e.key.toLowerCase() !== 's') return;
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const el = document.getElementById('subscribe-email');
      try { el && el.focus && el.focus(); } catch(e){}
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

  // ref to track if YouTube preconnect has been done
  const ytPrefetched = useRef(false);

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

  // ref to track if docs preconnect has been done
  const docsPrefetched = useRef(false);

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

  // remove per-item share msg states and add a single toast state
  const [notifications, setNotifications] = useState([]);
  const notificationTimeouts = useRef(new Map());

  // Clear all timeouts when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      notificationTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, []);

  // Enhanced notification function with more options
  const showNotification = useCallback((props) => {
    const {
      message,
      variant = 'info',
      icon = null,
      duration = 4000,
      dismissible = true,
      progress = true,
      action = null
    } = typeof props === 'string' ? { message: props } : props;

    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    
    // Add new notification to the stack
    setNotifications(prev => [
      ...prev,
      {
        id,
        message,
        variant,
        icon,
        dismissible,
        progress,
        createdAt: Date.now(),
        duration,
        action
      }
    ]);

    // Set timeout to remove notification
    if (duration !== Infinity) {
      const timeoutId = setTimeout(() => {
        dismissNotification(id);
        notificationTimeouts.current.delete(id);
      }, duration);
      
      notificationTimeouts.current.set(id, timeoutId);
    }

    return id; // Return ID so it can be dismissed programmatically
  }, []);

  // Function to dismiss a notification
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, dismissing: true } 
          : notification
      )
    );
    
    // Clear any existing timeout
    if (notificationTimeouts.current.has(id)) {
      clearTimeout(notificationTimeouts.current.get(id));
      notificationTimeouts.current.delete(id);
    }
    
    // Remove the notification after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 300); // Match this to CSS transition duration
  }, []);

  // copy helper with centralized toast feedback + analytics
  const copyToClipboard = async (text, successMessage = 'Copied!') => {
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
      console.info('analytics', 'copy_link', text);
      showNotification({
        message: successMessage,
        variant: 'success',
        icon: '✓',
        duration: 2200
      });
    } catch (err) {
      showNotification({
        message: 'Copy failed',
        variant: 'danger',
        icon: '⚠️',
        duration: 3000
      });
    }
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
      
      showNotification({
        message: `Opened ${platform} share window`,
        variant: 'info',
        icon: platform === 'twitter' ? '𝕏' : 'in',
        duration: 2200
      });
    } catch (e) {
      showNotification({
        message: 'Unable to open share window',
        variant: 'danger',
        icon: '⚠️'
      });
    }
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
      
      showNotification({
        message: 'Starting download...',
        variant: 'info',
        icon: '⬇️',
        duration: 2000,
        dismissible: false
      });
      
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
      
      showNotification({
        message: 'Download started successfully!',
        variant: 'success',
        icon: '✓',
        action: {
          label: 'View Downloads',
          onClick: () => {
            // Could open downloads folder or handle in some way
            console.log('View downloads clicked');
          },
          dismissOnClick: true
        }
      });
      
      setDownloadMsg('Download started');
      setTimeout(() => setDownloadMsg(''), 1800);
    } catch (e) {
      // fallback: open in new tab
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
        showNotification({
          message: 'Opened resume in new tab',
          variant: 'info',
          icon: '🔗',
          duration: 2000
        });
        setDownloadMsg('Opened in new tab');
        setTimeout(() => setDownloadMsg(''), 1800);
      } catch (err) {
        showNotification({
          message: 'Download failed. Please try again later.',
          variant: 'danger',
          icon: '⚠️',
          duration: 4000
        });
        setDownloadMsg('Download failed');
        setTimeout(() => setDownloadMsg(''), 1800);
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  // helper: convert Blob to base64 (data portion only)
  const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read blob'));
      reader.onloadend = () => {
        // reader.result is like "data:<type>;base64,AAAA..."
        const result = reader.result || '';
        const idx = result.indexOf('base64,');
        resolve(idx >= 0 ? result.slice(idx + 7) : result);
      };
      reader.readAsDataURL(blob);
    } catch (e) { reject(e); }
  });


  // subscribe handler: POST email to server (or localStorage), include a welcome attachment when available
  const subscribeEmail = async () => {
    if (subscriberBusy) return false;
    setSubscriberMsg(''); setSignupMsg('');
    const emailTrimmed = ('' + email || '').trim().toLowerCase();
    const nameTrimmed = ('' + signupName || '').trim();
    
    if (!validEmail(emailTrimmed)) { 
      setSignupMsg('Enter a valid email'); 
      return false; 
    }
    
    if (!nameTrimmed) { 
      setSignupMsg('Please enter your name'); 
      return false; 
    }
    
    if (!agreePrivacy) { 
      setSignupMsg('Please agree to the privacy terms'); 
      return false; 
    }
    
    // dedupe
    if (subscribers.some(s => s.email && s.email.toLowerCase() === emailTrimmed)) {
      setSignupMsg('This email is already subscribed');
      return true; // treat as success
    }
    
    setSubscriberBusy(true);
    
    const notificationId = showNotification({
      message: 'Subscribing...',
      variant: 'info',
      icon: '📨',
      dismissible: false,
      progress: false
    });

    // attempt to fetch attachment (optional)
    let attachment = null;
    try {
      const attachUrl = '/documents/welcome.pdf'; // change to your server path (fallback to resume if not present)
      const res = await fetch(attachUrl, { cache: 'no-cache' });
      if (res.ok) {
        const blob = await res.blob();
        const base64 = await blobToBase64(blob);
        attachment = {
          filename: attachUrl.split('/').pop() || 'attachment.pdf',
          contentType: blob.type || 'application/pdf',
          data: base64
        };
      }
    } catch (e) {
      // silently continue without attachment
      console.warn('Attachment fetch failed, proceeding without attachment', e);
      attachment = null;
    }

    try {
      // post attempt with graceful fallback
      const postData = async (url, data) => {
        try {
          const opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'same-origin' };
          const res = await fetch(url, opts);
          if (!res.ok) throw new Error('Network response was not ok');
          return true;
        } catch (e) {
          console.warn('Submit error, falling back to localStorage', e);
          return false;
        }
      };
      const payload = { email: emailTrimmed, name: nameTrimmed, attachment }; // attachment may be null
      const isSuccess = await postData('/api/subscribe', payload);

      // normalize stored item
      const newItem = { email: emailTrimmed, name: nameTrimmed, ts: new Date().toISOString() };
      setSubscribers(prev => [...prev, newItem]);
      setEmail(''); setSignupName(''); setAgreePrivacy(false);

      dismissNotification(notificationId); // Remove the "subscribing" notification
    
      if (isSuccess) {
        setSubscriberMsg('Subscribed! Check your inbox.');
        
        showNotification({
          message: attachment 
            ? 'Subscribed! A welcome email with attachment will be sent.' 
            : 'Thank you for subscribing!',
          variant: 'success',
          icon: '✓',
          duration: 5000,
          action: {
            label: 'View Subscribers',
            onClick: () => setShowSubscribers(true),
            dismissOnClick: true
          }
        });
        
        setSignupMsg(attachment ? 'Thank you — a welcome email with attachment will be sent.' : 'Thank you — you are subscribed.');
      } else {
        setSubscriberMsg('Subscribed (offline).');
        
        showNotification({
          message: 'Subscribed in offline mode.',
          variant: 'warning',
          icon: '⚠️',
          duration: 5000,
        });
        
        setSignupMsg('Subscribed locally; attachment will be sent when online.');
      }
      
      setTimeout(() => setSignupMsg(''), 2400);
      return true;
    } catch (e) {
      dismissNotification(notificationId);
      
      showNotification({
        message: 'Failed to subscribe. Please try again later.',
        variant: 'danger',
        icon: '⚠️',
        duration: 5000,
      });
      
      setSubscriberMsg('Subscription failed');
      console.error('Subscription error', e);
      return false;
    } finally {
      setSubscriberBusy(false);
    }
  };

  // focus name input when signup modal opens
  useEffect(() => {
    if (!showSignup) return;
    const t = setTimeout(() => {
      try {
        const el = document.getElementById('signup-name');
        if (el && typeof el.focus === 'function') el.focus();
      } catch (e) {}
    }, prefersReducedMotion ? 0 : 120);
    return () => clearTimeout(t);
  }, [showSignup, prefersReducedMotion]);

  // copy all subscriber emails to clipboard
  const copyAllSubscribers = async () => {
    try {
      const list = (subscribers || []).map(s => s.email).filter(Boolean).join(', ');
      if (!list) {
        setSubscriberMsg('No subscribers to copy');
        setTimeout(() => setSubscriberMsg(''), 1400);
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(list);
      else {
        const ta = document.createElement('textarea'); ta.value = list; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      setSubscriberMsg('Copied emails');
      setTimeout(() => setSubscriberMsg(''), 1400);
    } catch (e) {
      setSubscriberMsg('Copy failed');
      setTimeout(() => setSubscriberMsg(''), 1400);
    }
  };

  // download subscribers as CSV
  const downloadSubscribersCsv = () => {
    try {
      const rows = ['email,name,ts', ...(subscribers || []).map(s => `${(s.email||'').replace(/"/g,'""')},${(s.name||'').replace(/"/g,'""')},${s.ts||''}`)];
      const csv = rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `subscribers-${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      setSubscriberMsg('Download started');
      setTimeout(() => setSubscriberMsg(''), 1400);
    } catch (e) {
      setSubscriberMsg('Download failed');
      setTimeout(() => setSubscriberMsg(''), 1400);
    }
  };

  // Enhanced card styles with improved full-width layout
  const cardStyles = {
    cardContainer: {
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
      width: '100%', // Changed from maxWidth to width for full container width
      margin: '0',   // Remove auto margin which can cause centering issues
    },
    cardBody: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1,
      padding: '1.25rem', // Consistent padding
      width: '100%' // Full width
    },
    cardImageContainer: {
      overflow: 'hidden',
      position: 'relative',
      paddingTop: '56.25%' // 16:9 aspect ratio
    },
    cardImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      transition: 'transform 0.5s ease'
    },
    cardBadge: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      zIndex: 2,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    cardFooter: {
      background: 'rgba(0, 0, 0, 0.25)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem',
      position: 'relative',
      zIndex: 1
    },
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
      opacity: 0.2,
      transition: 'opacity 0.3s ease'
    },
    cardInfoItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.85rem',
      color: '#b0b0b0',
      margin: '5px 0'
    },
    cardInfoIcon: {
      marginRight: '6px',
      fontSize: '0.9rem'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row', // Default for larger screens
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: 'auto',
      width: '100%', // Ensure button container takes full width
      justifyContent: 'space-between', // Distribute buttons evenly
    },
    primaryButton: {
      flex: '1 0 auto', // Allow button to grow but maintain minimum size
      minWidth: '120px', // Minimum width for readability
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem 1.25rem',
      borderRadius: '50px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      margin: '0 0.25rem 0.25rem 0', // Small margin for spacing
    },
    actionButtons: {
      display: 'flex',
      flexWrap: 'nowrap', // Keep buttons in a row
      gap: '0.5rem',
      alignItems: 'center',
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

      {/* Modal for 2014 Demo Reel - Single instance */}
      <Modal
        size="xl"
        show={lgShow}
        onHide={() => { setLgShow(false); setAnnounce(''); setModalAnnounce(''); pauseYouTube(modal3DIframeRef); }}
        aria-labelledby="modal-3d-reel"
        ref={modal3DRef}
        className="custom-modal video-modal"
        fullscreen="sm-down"
      >
        <Modal.Header closeButton>
          <Modal.Title className="ti-tle" id="modal-3d-reel">
            2014 Demo Reel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 p-sm-3">
          <p className="modal-description">
            Objects were modeled, UV unwrapped, and textured in Maya 3D software.
            Sculpted in ZBrush and painted in Photoshop.
            Post effects were done using Fusion.
          </p>
          <div className="ratio ratio-16x9 video-container">
            <iframe
              ref={modal3DIframeRef}
              loading="lazy"
              src={getEmbedSrc('mPxmNbMpO7A')}
              title="2014 Demo Reel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>
          <div className="modal-actions mt-3 d-flex flex-wrap gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => copyToClipboard(reel3DUrl, '3D reel link copied')}
              aria-label="Copy link to 3D reel"
            >
              Copy Link
            </button>
            <a 
              onMouseEnter={preconnectYouTube} 
              onClick={() => { noteOpen(reel3DUrl); }} 
              className="btn btn-sm btn-outline-primary" 
              href={reel3DUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Watch on YouTube
            </a>
            <button 
              className="btn btn-sm btn-outline-info" 
              onClick={() => openShareWindow('twitter', reel3DUrl)}
              aria-label="Share on social media"
            >
              Share
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for VFX Reel 2024 - Single instance */}
      <Modal
        size="xl"
        show={lgShow1}
        onHide={() => { setLgShow1(false); setModalAnnounce(''); pauseYouTube(modalVfxIframeRef); }}
        aria-labelledby="modal-vfx-reel"
        className="custom-modal video-modal"
        fullscreen="sm-down"
      >
        <Modal.Header closeButton>
          <Modal.Title className="ti-tle" id="modal-vfx-reel">
            VFX Reel 2024
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 p-sm-3">
          <p className="modal-description">
            Thank you for viewing my most recent reel. All objects were created in Blender.
            After Effects was used for camera and motion tracking of the raw footage.
          </p>
          <div className="ratio ratio-16x9 video-container">
            <iframe
              ref={modalVfxIframeRef}
              loading="lazy"
              src={getEmbedSrc('tFwtXZw_VzM')}
              title="VFX Reel 2024"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>
          <div className="modal-actions mt-3 d-flex flex-wrap gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => copyToClipboard(reelVfxUrl, 'VFX reel link copied')}
              aria-label="Copy link to VFX reel"
            >
              Copy Link
            </button>
            <a 
              onMouseEnter={preconnectYouTube} 
              onClick={() => { noteOpen(reelVfxUrl); }} 
              className="btn btn-sm btn-outline-primary" 
              href={reelVfxUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Watch on YouTube
            </a>
            <button 
              className="btn btn-sm btn-outline-info" 
              onClick={() => openShareWindow('twitter', reelVfxUrl)}
              aria-label="Share on social media"
            >
              Share
            </button>
          </div>

          {/* Past VFX Projects section */}
          <div className="mt-4">
            <h4 className="past-projects-title">Past VFX Projects</h4>
            <p className="past-projects-description">
              This VFX reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles,
              and other aspects to help complete the project.
              Photoshop and Maya were used predominantly.
              <br className="d-none d-md-block" />
              <br className="d-none d-md-block" />
              Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
              My job was to very precisely roto-scope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments.
              This was accomplished utilizing Nuke primarily.
            </p>
            <div className="ratio ratio-16x9 mt-3">
              <iframe
                loading="lazy"
                src={getEmbedSrc('tFwtXZw_VzM')}
                title="Past VFX Projects"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Introduction Section - improved responsiveness */}
      <Col xs={12} className="text-center intro-section">
        <h2 className="top_text"> Welcome to Nebula 3D</h2>
        <p className="top-p px-2 px-md-5">
          My name is Colin Nebula, and I am a 3D Artist and a computer enthusiast. Thank you for visiting my online portfolio!
        </p>
        <div className="action-buttons-container">
          <button
            onMouseEnter={preconnectDocs}
            onClick={downloadResume}
            className="btn btn-outline-primary mb-2 mb-sm-0 me-sm-2"
            title="Download resume"
            aria-live="polite"
            aria-busy={downloadLoading}
            disabled={downloadLoading}
          >
            {downloadLoading ? 'Downloading…' : 'Download Resume'}
          </button>
          <button
            type="button"
            className="btn btn-outline-success mb-2 mb-sm-0 me-sm-2"
            title="Sign up for updates"
            aria-label="Sign up"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            onClick={() => setShowSignup(true)}
          >
            Sign up
            <span className="badge bg-secondary" aria-hidden="true" style={{ fontSize: 12 }}>{subscribers.length}</span>
          </button>
          
          {/* Signup modal */}
          <Modal show={showSignup} onHide={() => setShowSignup(false)} centered aria-labelledby="signup-modal-title" fullscreen="sm-down">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const ok = await subscribeEmail();
              if (ok) {
                setShowSignup(false);
                setSignupSuccess('Thanks — you are subscribed.');
                setTimeout(() => setSignupSuccess(''), 3000);
              }
            }}>
              <Modal.Header closeButton>
                <Modal.Title id="signup-modal-title">Sign up for updates</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label htmlFor="signup-name" className="visually-hidden">Full name</label>
                  <input id="signup-name" type="text" className="form-control" placeholder="Your full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                  <label htmlFor="signup-email" className="visually-hidden">Email</label>
                  <input id="signup-email" type="email" className="form-control" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input id="agree-privacy" type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
                    <label htmlFor="agree-privacy" style={{ fontSize: 13 }}>I agree to receive occasional emails. <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a></label>
                  </div>
                  {(signupMsg || subscriberMsg) && <div style={{ marginTop: 6 }} role="status" className={signupMsg ? 'text-success' : 'text-muted'}>{signupMsg || subscriberMsg}</div>}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSignup(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={subscriberBusy || !validEmail(email) || !signupName || !agreePrivacy}>{subscriberBusy ? 'Subscribing…' : 'Subscribe'}</Button>
              </Modal.Footer>
            </form>
          </Modal>
          {/* transient success toast */}
          {signupSuccess && (
            <div aria-live="polite" style={{
              position: 'fixed', right: 16, top: 80, zIndex: 1400,
              background: 'var(--card-bg)', color: 'var(--text)', padding: '8px 12px',
              borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.18)'
            }}>
              <div style={{ fontSize: 13, display:'flex', gap:8, alignItems:'center' }}>
                <span>{signupSuccess}</span>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setShowSubscribers(true)} style={{ marginLeft: 8 }}>View</button>
              </div>
            </div>
          )}
          {/* Subscribers modal (view / copy / export) */}
          <Modal show={showSubscribers} onHide={() => setShowSubscribers(false)} centered aria-labelledby="subscribers-modal-title" size="md">
            <Modal.Header closeButton>
              <Modal.Title id="subscribers-modal-title">Subscribers ({subscribers.length})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {subscribers.length === 0 ? (
                <div>No subscribers yet</div>
              ) : (
                <div style={{ maxHeight: 260, overflow: 'auto' }}>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {subscribers.slice().reverse().map((s, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        <strong>{s.name || '—'}</strong> &lt;{s.email}&gt; <small className="text-muted" style={{ marginLeft: 6 }}>{new Date(s.ts).toLocaleString()}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {subscriberMsg && <div style={{ marginTop: 10 }} role="status">{subscriberMsg}</div>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowSubscribers(false)}>Close</Button>
              <Button variant="outline-primary" onClick={copyAllSubscribers} disabled={subscribers.length === 0}>Copy emails</Button>
              <Button variant="primary" onClick={downloadSubscribersCsv} disabled={subscribers.length === 0}>Download CSV</Button>
            </Modal.Footer>
          </Modal>
          <div className="filter-controls mt-3 mt-sm-0">
            <span className="filter-label me-2">Filter:</span>
            <div role="tablist" aria-label="Project filters" className="d-inline-flex flex-wrap align-items-center">
              <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'} me-1 mb-1`} onClick={() => changeFilter('all')} aria-pressed={filter === 'all'}>All</button>
              <button className={`btn btn-sm ${filter === '3d' ? 'btn-primary' : 'btn-outline-secondary'} me-1 mb-1`} onClick={() => changeFilter('3d')} aria-pressed={filter === '3d'}>3D</button>
              <button className={`btn btn-sm ${filter === 'vfx' ? 'btn-primary' : 'btn-outline-secondary'} me-1 mb-1`} onClick={() => changeFilter('vfx')} aria-pressed={filter === 'vfx'}>VFX</button>
              <button className="btn btn-sm btn-outline-dark me-1 mb-1" onClick={resetFilter} title="Reset filter" aria-label="Reset filter">Reset</button>
            </div>
            {/* active filter label */}
            <span aria-hidden="true" className="filter-status d-block d-sm-inline mt-1 mt-sm-0 ms-sm-2">
              {filter === 'all' ? 'Showing: All' : filter === '3d' ? 'Showing: 3D' : 'Showing: VFX'}
            </span>
          </div>
           {/* live region for screen readers */}
           <div aria-live="polite" aria-atomic="true" className="visually-hidden">{announce}</div>
         </div>
        <NavDropdown.Divider />
      </Col>

      {/* Featured VFX Reel - Fixed full-width implementation */}
      <div className="featured-video-wrapper mb-4">
        <div className="ratio ratio-16x9"> {/* Changed to 16:9 for better mobile compatibility */}
          <iframe
            ref={featuredIframeRef}
            loading="lazy"
            title="VFX Blender Reel"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            onMouseEnter={preconnectYouTube}
            src={getEmbedSrc('tFwtXZw_VzM')}
          />
        </div>
        <div className="video-overlay-content">
          <h3 className="video-title">VFX Blender Reel</h3>
          <p className="video-description d-none d-md-block">
            This is my most recent VFX reel created with Blender and After Effects.
          </p>
        </div>
      </div>

      {/* Portfolio Overview */}
      <Col xs={12} className="text-center portfolio-overview my-4 px-2 px-md-0">
        <h2 className="middle_text">Colin Nebula 3D Portfolio</h2>
        <p className="mid-p px-2 px-md-5"> {/* Added extra padding control */}
          3D modeling is a fun and continuous learning process: creating, animating, learning, and improving.
        </p>
        <NavDropdown.Divider />
      </Col>

      {/* Demo Reels Card Group - Fixed width and spacing issues */}
      <Row className="g-4 mx-0 card-row w-100">
        {(filter === 'all' || filter === '3d') && (
          <Col lg={filter === 'all' ? 6 : 12} md={12} sm={12} className="mb-4 card-column">
            <Card 
              className="overflow bg-dark text-white shadow-lg enhanced-card w-100" 
              style={cardStyles.cardContainer}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open3DModal(); }}
              role="button" 
              aria-label="Open 3D Modeling Demo Reel"
            >
              <div style={cardStyles.cardOverlay} className="card-overlay"></div>
              <div style={cardStyles.cardBadge}>3D Modeling</div>
              
              <div style={cardStyles.cardImageContainer} className="card-image-container">
                <Card.Img 
                  src={demoR} 
                  alt="Demo Reel" 
                  loading="lazy" 
                  style={cardStyles.cardImage}
                  className="card-zoom-image"
                />
              </div>
              
              <Card.Body style={cardStyles.cardBody}>
                <Card.Title className="card-title-enhanced">3D Modeling Demo Reel</Card.Title>
                
                <div className="card-info-items">
                  <div style={cardStyles.cardInfoItem}>
                    <span style={cardStyles.cardInfoIcon}>🕒</span>
                    <span>Duration: 2:45</span>
                  </div>
                  <div style={cardStyles.cardInfoItem}>
                    <span style={cardStyles.cardInfoIcon}>🎬</span>
                    <span className="d-none d-sm-inline">Software: Blender, ZBrush, Photoshop</span>
                    <span className="d-inline d-sm-none">Software: Blender, ZBrush</span>
                  </div>
                </div>
                
                <Card.Text className="my-3 card-description">
                  This demo reel showcases my 3D modeling and texturing skills using industry-standard software such as Blender, Zbrush, Photoshop, xNormal, and After Effects.
                </Card.Text>
                
                <div className="button-container d-flex flex-wrap justify-content-between align-items-center">
                  <Button 
                    onMouseEnter={preconnectYouTube} 
                    variant="outline-warning" 
                    onClick={open3DModal} 
                    aria-label="View 3D reel"
                    className="view-reel-btn mb-2 mb-sm-0 me-2"
                  >
                    <span className="play-icon">▶</span> View Reel
                  </Button>
                  <div className="action-buttons d-flex gap-2 flex-nowrap">
                    <button 
                      aria-label="Copy 3D reel link" 
                      title="Copy 3D link" 
                      className="btn btn-sm btn-outline-secondary btn-card-action" 
                      onClick={() => copyToClipboard(reel3DUrl, '3D reel link copied')}
                    >
                      Copy
                    </button>
                    <button 
                      aria-label="Share 3D reel" 
                      className="btn btn-sm btn-outline-info btn-card-action" 
                      onClick={() => openShareWindow('twitter', reel3DUrl)}
                      title="Share on Twitter"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {(filter === 'all' || filter === 'vfx') && (
          <Col lg={filter === 'all' ? 6 : 12} md={12} sm={12} className="mb-4 card-column">
            <Card 
              className="overflow bg-dark text-white shadow-lg enhanced-card w-100" 
              style={cardStyles.cardContainer}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openVFXModal(); }}
              role="button" 
              aria-label="Open VFX Reel"
            >
              <div style={cardStyles.cardOverlay} className="card-overlay"></div>
              <div style={cardStyles.cardBadge}>VFX</div>
              
              <div style={cardStyles.cardImageContainer} className="card-image-container">
                <Card.Img 
                  src={sword} 
                  alt="VFX Reel" 
                  loading="lazy" 
                  style={cardStyles.cardImage}
                  className="card-zoom-image"
                />
              </div>
              
              <Card.Body style={cardStyles.cardBody}>
                <Card.Title className="card-title-enhanced">VFX Reel</Card.Title>
                
                <div className="card-info-items">
                  <div style={cardStyles.cardInfoItem}>
                    <span style={cardStyles.cardInfoIcon}>🕒</span>
                    <span>Duration: 3:12</span>
                  </div>
                  <div style={cardStyles.cardInfoItem}>
                    <span style={cardStyles.cardInfoIcon}>🎬</span>
                    <span>Software: After Effects, Nuke</span>
                  </div>
                </div>
                
                <Card.Text className="my-3 card-description">
                  This VFX reel displays post-production effects and includes some of the work I was involved with at Intelligent Creatures Toronto.
                </Card.Text>
                
                <div className="button-container d-flex flex-wrap justify-content-between align-items-center">
                  <Button 
                    onMouseEnter={preconnectYouTube} 
                    variant="outline-warning" 
                    onClick={openVFXModal} 
                    aria-label="View VFX reel"
                    className="view-reel-btn mb-2 mb-sm-0 me-2"
                  >
                    <span className="play-icon">▶</span> View Reel
                  </Button>
                  <div className="action-buttons d-flex gap-2 flex-nowrap">
                    <button 
                      aria-label="Copy VFX reel link" 
                      title="Copy VFX link" 
                      className="btn btn-sm btn-outline-secondary btn-card-action" 
                      onClick={() => copyToClipboard(reelVfxUrl, 'VFX reel link copied')}
                    >
                      Copy
                    </button>
                    <button 
                      aria-label="Share VFX reel" 
                      className="btn btn-sm btn-outline-info btn-card-action" 
                      onClick={() => openShareWindow('twitter', reelVfxUrl)}
                      title="Share on Twitter"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Notifications (stacked) */}
      <Col xs={12}>
        <div className="notification-container" aria-live="polite" aria-atomic="true">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`
                notification-toast 
                notification-${notification.variant} 
                ${notification.dismissing ? 'notification-dismissing' : ''}
              `}
              role="alert"
            >
              <div className="notification-content">
                {notification.icon && (
                  <div className="notification-icon">
                    {notification.icon}
                  </div>
                )}
                <div className="notification-message">
                  {notification.message}
                </div>
              </div>
              
              {notification.action && (
                <div className="notification-actions">
                  <button 
                    onClick={() => {
                      notification.action.onClick();
                      if (notification.action.dismissOnClick) {
                        dismissNotification(notification.id);
                      }
                    }}
                    className="notification-action-btn"
                  >
                    {notification.action.label}
                  </button>
                </div>
              )}
              
              {notification.dismissible && (
                <button 
                  onClick={() => dismissNotification(notification.id)} 
                  className="notification-close"
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              )}
              
              {notification.progress && notification.duration !== Infinity && (
                <div 
                  className="notification-progress"
                  style={{
                    animationDuration: `${notification.duration}ms`,
                    animationPlayState: 'running'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </Col>

      {/* Back to top button - improved touch area */}
      {showTop && (
        <button
          onClick={() => scrollToTop()}
          aria-label="Back to top"
          title="Back to top"
          className="back-to-top-btn"
        >
          <span aria-hidden="true">↑</span>
          <span className="visually-hidden">Back to top</span>
        </button>
      )}
    </Container>
  );
}

export default Home;