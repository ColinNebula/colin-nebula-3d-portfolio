import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Alert, Badge, Form, Modal, Button, Spinner } from 'react-bootstrap';
import { useNotifications } from '../../App';
import emailjs from '@emailjs/browser';
import { emailjsConfig, createEmailTemplate } from '../../utils/emailConfig';
import './Updates.css';

// Enhanced Skeleton loader component - STABILIZED
const SkeletonLoader = ({ count, viewMode }) => {
  return (
    <div className={`skeleton-container ${viewMode} no-animations`} style={{ opacity: 1, visibility: 'visible' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={`skeleton-${i}`} className={`skeleton-card ${viewMode === 'list' ? 'skeleton-list' : ''}`}>
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-footer">
              <div className="skeleton-button"></div>
              <div className="skeleton-actions">
                <div className="skeleton-action"></div>
                <div className="skeleton-action"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced sample updates with more detailed content
const enhancedSampleUpdates = [
  {
    id: 1,
    title: "New 3D Character Model Released",
    content: "I'm excited to announce the release of my latest 3D character model, 'Stellar Guardian'. This high-poly character features detailed armor, realistic facial features, and a complete set of animations.",
    date: "2023-11-15T10:30:00Z",
    category: "release",
    image: "https://via.placeholder.com/800x500?text=Stellar+Guardian+Model",
    gallery: [
      "https://via.placeholder.com/800x600?text=Character+Front",
      "https://via.placeholder.com/800x600?text=Character+Side",
      "https://via.placeholder.com/800x600?text=Character+Back"
    ],
    tags: ["character", "3D model", "animation"],
    detailedContent: `
      <p>The <strong>Stellar Guardian</strong> character model represents over 200 hours of detailed work, from concept sketching to final rigging.</p>
      <h4>Key Features:</h4>
      <ul>
        <li>High-resolution textures (4K diffuse, normal, roughness maps)</li>
        <li>Complete facial rig with blend shapes</li>
        <li>Modular armor system for customization</li>
        <li>Motion capture compatible skeleton</li>
      </ul>
      <p>This model is available for commercial use and includes source files for Blender, Maya, and 3ds Max.</p>
    `
  },
  {
    id: 2,
    title: "Animation Reel Update",
    content: "Updated my 2023 animation reel with latest character animations and motion graphics work. Features everything from realistic human movement to stylized creature animations.",
    date: "2023-11-10T14:20:00Z",
    category: "portfolio",
    image: "https://via.placeholder.com/800x500?text=Animation+Reel+2023",
    tags: ["animation", "motion graphics", "reel"],
    detailedContent: `
      <p>This year's animation reel showcases a diverse range of projects completed over the past 12 months.</p>
      <h4>Featured Work:</h4>
      <ul>
        <li>Character walk cycles and combat animations</li>
        <li>Facial animation and lip-sync work</li>
        <li>Motion graphics for client presentations</li>
        <li>Experimental procedural animations</li>
      </ul>
      <p>Each piece demonstrates different techniques and styles, from photorealistic to highly stylized approaches.</p>
    `
  },
  {
    id: 3,
    title: "Tutorial: Advanced Rigging Techniques",
    content: "New comprehensive tutorial series on advanced character rigging techniques in Blender. Covers everything from basic armatures to advanced constraint systems.",
    date: "2023-11-05T09:15:00Z",
    category: "tutorial",
    image: "https://via.placeholder.com/800x500?text=Rigging+Tutorial+Series",
    tags: ["tutorial", "rigging", "blender"],
    detailedContent: `
      <p>This 10-part tutorial series dives deep into character rigging workflows that I've developed over years of professional work.</p>
      <h4>Covered Topics:</h4>
      <ul>
        <li>Armature setup and bone hierarchy</li>
        <li>IK/FK switching systems</li>
        <li>Custom bone shapes and controls</li>
        <li>Facial rigging with drivers</li>
        <li>Cloth and hair simulation setup</li>
      </ul>
      <p>Perfect for intermediate users looking to take their rigging skills to the next level.</p>
    `
  },
  {
    id: 4,
    title: "Client Showcase: Indie Game Assets",
    content: "Proud to share some of the 3D assets I created for the upcoming indie game 'Neon Nightmares'. This cyberpunk-themed project pushed my skills in both modeling and texturing.",
    date: "2023-10-28T16:45:00Z",
    category: "showcase",
    image: "https://via.placeholder.com/800x500?text=Neon+Nightmares+Assets",
    gallery: [
      "https://via.placeholder.com/800x600?text=Cyberpunk+Environment",
      "https://via.placeholder.com/800x600?text=Neon+Props",
      "https://via.placeholder.com/800x600?text=Character+Concepts"
    ],
    tags: ["game assets", "cyberpunk", "client work"],
    detailedContent: `
      <p>Working on <em>Neon Nightmares</em> was an incredible opportunity to explore cyberpunk aesthetics and advanced texturing techniques.</p>
      <h4>Assets Created:</h4>
      <ul>
        <li>15 unique environment props</li>
        <li>3 main character models</li>
        <li>Holographic interface elements</li>
        <li>Atmospheric particle effects</li>
      </ul>
      <p>The project required careful optimization for real-time rendering while maintaining visual quality. All assets were delivered on time and within budget constraints.</p>
    `
  },
  {
    id: 5,
    title: "Behind the Scenes: VFX Breakdown",
    content: "Take a look behind the scenes of my latest VFX project. This breakdown shows the complete process from initial concept to final composite.",
    date: "2023-10-20T11:30:00Z",
    category: "behind-scenes",
    image: "https://via.placeholder.com/800x500?text=VFX+Breakdown",
    tags: ["VFX", "compositing", "breakdown"],
    detailedContent: `
      <p>This VFX sequence involved multiple complex elements that required careful planning and execution.</p>
      <h4>Technical Breakdown:</h4>
      <ul>
        <li>3D tracking and camera solving</li>
        <li>Particle simulation for magical effects</li>
        <li>Advanced compositing with multiple passes</li>
        <li>Color grading and final polish</li>
      </ul>
      <p>The entire project took approximately 6 weeks from concept to completion, with extensive client feedback integration throughout the process.</p>
    `
  }
];

// Update detail modal component
const UpdateDetailModal = ({ show, onHide, update, categories, formatDate, shareUpdate, isBookmarked, toggleBookmark }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{update.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Badge bg={categories[update.category]?.color || 'secondary'}>
            {categories[update.category]?.icon} {categories[update.category]?.label}
          </Badge>
          <small className="text-muted">{formatDate(update.date)}</small>
        </div>
        
        {update.image && (
          <img src={update.image} alt="" className="img-fluid mb-3 rounded" />
        )}
        
        <div dangerouslySetInnerHTML={{ __html: update.detailedContent || update.content }} />
        
        {update.tags && (
          <div className="mt-3">
            {update.tags.map(tag => (
              <Badge key={tag} bg="light" text="dark" className="me-2">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <Button
            variant={isBookmarked ? "warning" : "outline-warning"}
            onClick={toggleBookmark}
            className="me-2"
          >
            <i className={`bi ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
            {isBookmarked ? ' Bookmarked' : ' Bookmark'}
          </Button>
        </div>
        <div>
          <Button variant="outline-secondary" onClick={() => shareUpdate(update, 'twitter')} className="me-2">
            <i className="bi bi-twitter"></i>
          </Button>
          <Button variant="outline-secondary" onClick={() => shareUpdate(update, 'linkedin')}>
            <i className="bi bi-linkedin"></i>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

// FilterPanel component implementation
const FilterPanel = ({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  searchQuery, 
  setSearchQuery, 
  viewMode, 
  setViewMode, 
  categories, 
  showBookmarked, 
  setShowBookmarked, 
  bookmarkedCount, 
  setCurrentPage 
}) => {
  return (
    <Row className="mb-4">
      <Col md={3} className="filter-section">
        <Form.Group>
          <Form.Label className="filter-label">Filter by Category</Form.Label>
          <Form.Select 
            value={filter} 
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Updates</option>
            {Object.entries(categories).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={3} className="filter-section">
        <Form.Group>
          <Form.Label className="filter-label">Sort By</Form.Label>
          <Form.Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={4} className="filter-section">
        <Form.Group>
          <Form.Label className="filter-label">Search Updates</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Form.Group>
      </Col>
      <Col md={2} className="d-flex flex-column">
        <div className="mb-3">
          <Form.Check
            type="switch"
            id="bookmarks-switch"
            label={`Bookmarks (${bookmarkedCount})`}
            checked={showBookmarked}
            onChange={() => {
              setShowBookmarked(!showBookmarked);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="view-toggle">
          <div className="btn-group">
            <Button 
              variant={viewMode === 'cards' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setViewMode('cards')}
              aria-label="Card view"
              title="Card view"
            >
              <span className="view-icon">⊞</span>
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              <span className="view-icon">☰</span>
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

// SubscribeModal component implementation
const SubscribeModal = ({ 
  show, 
  handleClose, 
  loading, 
  success, 
  email, 
  setEmail, 
  name, 
  setName, 
  message, 
  handleSubscribe 
}) => {
  return (
    <Modal 
      show={show} 
      onHide={() => !loading && handleClose()}
      centered
      aria-labelledby="subscribe-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="subscribe-modal-title">Subscribe to Updates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <div className="text-center py-3">
            <div className="success-checkmark">
              <span className="checkmark-icon">✓</span>
            </div>
            <h4>Thank You!</h4>
            <p className="text-success">{message}</p>
          </div>
        ) : (
          <Form onSubmit={handleSubscribe}>
            <Form.Group className="mb-3">
              <Form.Label>Name (optional)</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email address*</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="subscription-consent"
                label="I agree to receive email updates about new projects and releases."
                required
              />
            </Form.Group>
            
            {message && (
              <div className="alert alert-danger">
                {message}
              </div>
            )}
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Subscribing...
                  </>
                ) : 'Subscribe'}
              </Button>
            </div>
            
            <div className="mt-3">
              <small className="text-muted">
                Your information will be used according to our privacy policy. You can unsubscribe at any time.
              </small>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

const Updates = () => {
  const { showNotification } = useNotifications();
  
  // STABILIZED: Initialize EmailJS only once
  useEffect(() => {
    emailjs.init(emailjsConfig.publicKey);
    
    if (emailjsConfig.serviceId === 'YOUR_SERVICE_ID') {
      console.warn('⚠️ EmailJS not configured yet. Please update src/utils/emailConfig.js with your EmailJS credentials.');
      console.log('📖 Setup guide: docs/EMAILJS_SETUP.md');
    } else {
      console.log('✅ EmailJS configured and ready to send emails');
    }
  }, []); // Empty dependency array - run only once
  
  // STABILIZED: State management - consolidated initialization
  const [state, setState] = useState(() => ({
    // Core data
    updates: [],
    loading: true,
    error: null,
    
    // Filter states
    filter: 'all',
    sortBy: 'newest',
    searchQuery: '',
    
    // Pagination
    currentPage: 1,
    
    // UI states
    showSubscribeModal: false,
    subscribeEmail: '',
    subscribeName: '',
    subscribeMessage: '',
    subscribeLoading: false,
    subscribeSuccess: false,
    activeUpdate: null,
    showDetailModal: false,
    
    // Persistent states
    viewMode: (() => {
      try {
        return localStorage.getItem('nebula_updates_view_mode') || 'list';
      } catch {
        return 'list';
      }
    })(),
    bookmarkedUpdates: (() => {
      try {
        return JSON.parse(localStorage.getItem('nebula_bookmarked_updates') || '[]');
      } catch {
        return [];
      }
    })(),
    viewHistory: (() => {
      try {
        return JSON.parse(localStorage.getItem('nebula_update_view_history') || '[]');
      } catch {
        return [];
      }
    })(),
    showBookmarked: false,
    isFirstVisit: !localStorage.getItem('nebula_updates_visited'),
    subscribers: (() => {
      try {
        return JSON.parse(localStorage.getItem('nebula_update_subscribers') || '[]');
      } catch {
        return [];
      }
    })(),
    subscriptionPreferences: (() => {
      try {
        return JSON.parse(localStorage.getItem('nebula_subscription_preferences') || '{}');
      } catch {
        return {};
      }
    })()
  }));

  const itemsPerPage = 5;

  // STABILIZED: Sample update categories
  const categories = useMemo(() => ({
    'project': { label: 'Project Update', icon: '🚀', color: 'primary' },
    'release': { label: 'New Release', icon: '✨', color: 'success' },
    'news': { label: 'News', icon: '📰', color: 'info' },
    'event': { label: 'Event', icon: '📅', color: 'warning' },
    'announcement': { label: 'Announcement', icon: '📣', color: 'danger' },
    'portfolio': { label: 'Portfolio', icon: '🎨', color: 'info' },
    'tutorial': { label: 'Tutorial', icon: '📚', color: 'warning' },
    'showcase': { label: 'Showcase', icon: '🌟', color: 'success' },
    'behind-scenes': { label: 'Behind the Scenes', icon: '🎬', color: 'secondary' }
  }), []);

  // STABILIZED: Helper functions
  const calculateReadingTime = useCallback((content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? '< 1 min read' : `${readingTime} min read`;
  }, []);

  const shareUpdate = useCallback((update, platform) => {
    const url = `${window.location.origin}/updates/${update.id}`;
    const text = `Check out "${update.title}" by Colin Nebula`;
    
    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
    console.info('Analytics: shared update', platform, update.id);
  }, []);

  // STABILIZED: Format date function
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // STABILIZED: Fetch updates - single useEffect for initialization
  useEffect(() => {
    let isMounted = true;
    
    const initializeUpdates = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isMounted) return;
        
        // Use the enhancedSampleUpdates
        setState(prev => ({ 
          ...prev, 
          updates: enhancedSampleUpdates, 
          loading: false,
          error: null 
        }));
        
        // Show notification only once
        showNotification('Updates page loaded', 'info', 2000, {
          category: 'navigation',
          icon: '📄',
          public: true
        });
        
      } catch (err) {
        if (!isMounted) return;
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to load updates. Please try again.',
          loading: false 
        }));
        console.error('Error fetching updates:', err);
      }
    };
    
    initializeUpdates();
    
    return () => {
      isMounted = false;
    };
  }, [showNotification]); // Only depend on showNotification

  // STABILIZED: Persist viewMode preference
  useEffect(() => {
    try {
      localStorage.setItem('nebula_updates_view_mode', state.viewMode);
    } catch (error) {
      console.warn('Failed to save view mode preference:', error);
    }
  }, [state.viewMode]);

  // STABILIZED: Enhanced filtered updates with proper memoization
  const enhancedFilteredUpdates = useMemo(() => {
    if (!state.updates || state.updates.length === 0) return [];
    
    return state.updates
      .filter(update => {
        // Apply bookmarks filter if active
        if (state.showBookmarked && !state.bookmarkedUpdates.includes(update.id)) {
          return false;
        }
        
        // Apply category filter if not 'all'
        if (state.filter !== 'all' && update.category !== state.filter) {
          return false;
        }
        
        // Apply search filter if search query exists
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          return (
            update.title.toLowerCase().includes(query) ||
            update.content.toLowerCase().includes(query) ||
            (update.tags && update.tags.some(tag => tag.toLowerCase().includes(query)))
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        if (state.sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date);
        } else if (state.sortBy === 'oldest') {
          return new Date(a.date) - new Date(b.date);
        } else if (state.sortBy === 'popular') {
          const viewsA = state.viewHistory.find(v => v.id === a.id)?.viewCount || 0;
          const viewsB = state.viewHistory.find(v => v.id === b.id)?.viewCount || 0;
          return viewsB - viewsA;
        }
        return 0;
      })
      .map(update => ({
        ...update,
        isBookmarked: state.bookmarkedUpdates.includes(update.id),
        viewCount: state.viewHistory.find(v => v.id === update.id)?.viewCount || 0,
        lastViewed: state.viewHistory.find(v => v.id === update.id)?.lastViewed || null,
      }));
  }, [state.updates, state.filter, state.searchQuery, state.sortBy, state.showBookmarked, state.bookmarkedUpdates, state.viewHistory]);

  // STABILIZED: Pagination calculations
  const paginationData = useMemo(() => {
    const indexOfLastItem = state.currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = enhancedFilteredUpdates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(enhancedFilteredUpdates.length / itemsPerPage);
    
    return {
      currentItems,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem: Math.min(indexOfLastItem, enhancedFilteredUpdates.length)
    };
  }, [enhancedFilteredUpdates, state.currentPage, itemsPerPage]);

  // STABILIZED: Event handlers with useCallback
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleBookmark = useCallback((updateId) => {
    setState(prev => {
      const isAlreadyBookmarked = prev.bookmarkedUpdates.includes(updateId);
      const newBookmarks = isAlreadyBookmarked
        ? prev.bookmarkedUpdates.filter(id => id !== updateId)
        : [...prev.bookmarkedUpdates, updateId];
      
      try {
        localStorage.setItem('nebula_bookmarked_updates', JSON.stringify(newBookmarks));
      } catch (error) {
        console.warn('Failed to save bookmarks:', error);
      }
      
      return { ...prev, bookmarkedUpdates: newBookmarks };
    });
  }, []);

  const trackUpdateView = useCallback((updateId) => {
    setState(prev => {
      const now = new Date().toISOString();
      const existingIndex = prev.viewHistory.findIndex(item => item.id === updateId);
      
      let newHistory;
      if (existingIndex >= 0) {
        newHistory = [...prev.viewHistory];
        newHistory[existingIndex] = { 
          ...newHistory[existingIndex], 
          viewCount: (newHistory[existingIndex].viewCount || 0) + 1,
          lastViewed: now
        };
      } else {
        newHistory = [...prev.viewHistory, { id: updateId, firstViewed: now, lastViewed: now, viewCount: 1 }];
      }
      
      try {
        localStorage.setItem('nebula_update_view_history', JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Failed to save view history:', error);
      }
      
      return { ...prev, viewHistory: newHistory };
    });
  }, []);

  const openDetailModal = useCallback((update) => {
    setState(prev => ({ 
      ...prev, 
      activeUpdate: update, 
      showDetailModal: true 
    }));
    trackUpdateView(update.id);
  }, [trackUpdateView]);

  const handlePageChange = useCallback((pageNumber) => {
    setState(prev => ({ ...prev, currentPage: pageNumber }));
    document.getElementById('updates-container')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Email validation helper
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Check if email is already subscribed
  const isAlreadySubscribed = useCallback((email) => {
    return state.subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
  }, [state.subscribers]);

  // Handle subscription form submission with real functionality
  const handleSubscribe = useCallback(async (e) => {
    e.preventDefault();
    
    // Reset messages
    setState(prev => ({ ...prev, subscribeMessage: '' }));
    
    // Validation
    if (!state.subscribeEmail.trim()) {
      setState(prev => ({ ...prev, subscribeMessage: 'Please enter your email address.' }));
      showNotification('Email address is required', 'warning', 3000, {
        category: 'updates',
        icon: '⚠️',
        public: true
      });
      return;
    }
    
    if (!validateEmail(state.subscribeEmail.trim())) {
      setState(prev => ({ ...prev, subscribeMessage: 'Please enter a valid email address.' }));
      showNotification('Please enter a valid email address', 'warning', 3000, {
        category: 'updates',
        icon: '⚠️',
        public: true
      });
      return;
    }

    if (!state.subscribeName.trim()) {
      setState(prev => ({ ...prev, subscribeMessage: 'Please enter your name.' }));
      showNotification('Name is required', 'warning', 3000, {
        category: 'updates',
        icon: '⚠️',
        public: true
      });
      return;
    }
    
    const email = state.subscribeEmail.trim().toLowerCase();
    const name = state.subscribeName.trim();
    
    // Check if already subscribed
    if (isAlreadySubscribed(email)) {
      setState(prev => ({ ...prev, subscribeMessage: 'This email is already subscribed to updates.' }));
      showNotification('Email already subscribed', 'info', 3000, {
        category: 'updates',
        icon: 'ℹ️',
        public: true
      });
      return;
    }
    
    setState(prev => ({ ...prev, subscribeLoading: true }));
    
    try {
      // Send confirmation email using EmailJS
      const emailTemplate = createEmailTemplate(name, email);
      
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        emailTemplate,
        emailjsConfig.publicKey
      );
      
      // Create new subscription
      const newSubscription = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
        subscribedAt: new Date().toISOString(),
        isActive: true,
        preferences: {
          newUpdates: true,
          majorReleases: true,
          weeklyDigest: false,
          instantNotifications: false
        },
        metadata: {
          source: 'updates_page',
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct'
        }
      };
      
      // Add to subscribers list
      setState(prev => {
        const updatedSubscribers = [...prev.subscribers, newSubscription];
        
        try {
          localStorage.setItem('nebula_update_subscribers', JSON.stringify(updatedSubscribers));
          localStorage.setItem('nebula_subscription_preferences', JSON.stringify({
            ...prev.subscriptionPreferences,
            [email]: newSubscription.preferences
          }));
        } catch (error) {
          console.warn('Failed to save subscription data:', error);
        }
        
        return { 
          ...prev, 
          subscribers: updatedSubscribers,
          subscriptionPreferences: {
            ...prev.subscriptionPreferences,
            [email]: newSubscription.preferences
          }
        };
      });
      
      // Set success state
      const isEmailConfigured = emailjsConfig.serviceId !== 'YOUR_SERVICE_ID';
      const successMessage = isEmailConfigured 
        ? `Thank you ${name}! You've successfully subscribed to updates. A personalized thank you email with welcome details has been sent to ${email}.`
        : `Thank you ${name}! You've successfully subscribed to updates. A thank you email will be sent once email service is configured.`;
      
      setState(prev => ({ 
        ...prev, 
        subscribeSuccess: true,
        subscribeMessage: successMessage
      }));
      
      // Show success notification
      const notificationMessage = isEmailConfigured
        ? `Welcome ${name}! Thank you email sent to ${email} 📧`
        : `Welcome ${name}! You're now subscribed to updates.`;
      showNotification(notificationMessage, 'success', 5000, {
        category: 'updates',
        icon: '🎉',
        public: true
      });
      
      // Clear form
      setState(prev => ({ 
        ...prev, 
        subscribeEmail: '',
        subscribeName: ''
      }));
      
      // Close modal after success with delay
      setTimeout(() => {
        setState(prev => ({ ...prev, showSubscribeModal: false }));
        
        // Show additional info notification
        setTimeout(() => {
          showNotification('You can manage your subscription preferences in your account settings', 'info', 5000, {
            category: 'updates',
            icon: '⚙️',
            public: true
          });
        }, 1000);
        
        // Reset success state after modal closes
        setTimeout(() => {
          setState(prev => ({ 
            ...prev, 
            subscribeSuccess: false,
            subscribeMessage: ''
          }));
        }, 500);
      }, 3000);
      
    } catch (error) {
      console.error('Subscription error:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Sorry, there was an error processing your subscription. Please try again.';
      
      if (error.text) {
        // EmailJS specific error
        errorMessage = 'Unable to send confirmation email. Please check your email address and try again.';
      }
      
      setState(prev => ({ ...prev, subscribeMessage: errorMessage }));
      showNotification('Subscription failed. Please try again.', 'error', 4000, {
        category: 'updates',
        icon: '❌',
        public: true
      });
    } finally {
      setState(prev => ({ ...prev, subscribeLoading: false }));
    }
  }, [state.subscribeEmail, state.subscribeName, validateEmail, isAlreadySubscribed, showNotification]);

  return (
    <Container id="updates-container" className="updates-container no-animations py-5">
      {/* Professional Hero Section */}
      <div className="updates-hero">
        <div className="updates-hero-content">
          <h1 className="updates-title">Latest Updates</h1>
          <p className="updates-subtitle">
            Stay current with my latest projects, releases, and professional insights. 
            Discover behind-the-scenes content, tutorials, and announcements about my creative journey.
          </p>
          
          <div className="updates-stats">
            <div className="stat-item">
              <span className="stat-number">{state.updates.length}</span>
              <span className="stat-label">Total Updates</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.keys(categories).length}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{state.bookmarkedUpdates.length}</span>
              <span className="stat-label">Bookmarked</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{state.viewHistory.length}</span>
              <span className="stat-label">Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* First visit welcome message */}
      {state.isFirstVisit && (
        <Alert 
          variant="info" 
          className="welcome-alert" 
          dismissible 
          onClose={() => {
            updateState({ isFirstVisit: false });
            localStorage.setItem('nebula_updates_visited', 'true');
          }}
        >
          <Alert.Heading>Welcome to Updates!</Alert.Heading>
          <p>This is where you'll find the latest news about my projects, events, and releases. 
          You can filter by category, search for specific updates, or bookmark your favorites.</p>
        </Alert>
      )}

      {/* Professional Filter panel */}
      <div className="filter-panel">
        <FilterPanel 
          filter={state.filter}
          setFilter={(value) => updateState({ filter: value, currentPage: 1 })}
          sortBy={state.sortBy}
          setSortBy={(value) => updateState({ sortBy: value })}
          searchQuery={state.searchQuery}
          setSearchQuery={(value) => updateState({ searchQuery: value, currentPage: 1 })}
          viewMode={state.viewMode}
          setViewMode={(value) => updateState({ viewMode: value })}
          categories={categories}
          showBookmarked={state.showBookmarked}
          setShowBookmarked={(value) => updateState({ showBookmarked: value, currentPage: 1 })}
          bookmarkedCount={state.bookmarkedUpdates.length}
          setCurrentPage={(value) => updateState({ currentPage: value })}
        />
      </div>

      {/* Professional Results stats with improved layout */}
      <div className="results-header">
        <div>
          <p className="results-count mb-0">
            {enhancedFilteredUpdates.length === 0 ? 
              'No updates found' : 
              enhancedFilteredUpdates.length === 1 ? 
                '1 update found' : 
                `${enhancedFilteredUpdates.length} updates found`
            }
            <span className="results-detail">
              {enhancedFilteredUpdates.length > 0 && ` • Showing ${paginationData.indexOfFirstItem + 1}-${paginationData.indexOfLastItem}`}
            </span>
          </p>
        </div>
        <div>
          <Button 
            variant="primary" 
            size="sm" 
            className="subscribe-button"
            onClick={() => updateState({ showSubscribeModal: true })}
          >
            <i className="bi bi-envelope me-2"></i>Subscribe for Updates
          </Button>
        </div>
      </div>

      {/* STABILIZED: Updates List - with no animations */}
      <div 
        className={`update-container no-animations ${state.viewMode === 'cards' ? 'card-view' : 'list-view'}`}
        style={{ opacity: 1, visibility: 'visible', transform: 'none' }}
        aria-live="polite"
      >
        {state.loading ? (
          <SkeletonLoader count={3} viewMode={state.viewMode} />
        ) : state.error ? (
          <div className="text-center py-5">
            <div className="error-message">
              <div className="error-icon mb-3">⚠️</div>
              <h4>Something went wrong</h4>
              <p>{state.error}</p>
              <Button variant="outline-primary" onClick={() => window.location.reload()}>
                <i className="bi bi-arrow-clockwise me-2"></i> Try Again
              </Button>
            </div>
          </div>
        ) : enhancedFilteredUpdates.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>No updates found</h4>
              <p>Try changing your filters or search query</p>
              <Button 
                variant="outline-primary" 
                onClick={() => updateState({
                  filter: 'all',
                  searchQuery: '',
                  showBookmarked: false,
                  currentPage: 1
                })}
              >
                <i className="bi bi-x-circle me-2"></i> Clear Filters
              </Button>
            </div>
          </div>
        ) : state.viewMode === 'cards' ? (
          <div className="update-list no-animations">
            {paginationData.currentItems.map((update, index) => (
              <div 
                key={`update-${update.id}-${index}`}
                className={`update-card no-animations ${update.featured ? 'featured-update' : ''} ${update.isBookmarked ? 'bookmarked' : ''}`}
                style={{ opacity: 1, visibility: 'visible', transform: 'none' }}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') openDetailModal(update);
                }}
                onClick={() => openDetailModal(update)}
                aria-label={`Update: ${update.title}`}
                data-testid={`update-card-${update.id}`}
              >
                {/* Bookmark button */}
                <Button 
                  variant="link" 
                  className={`bookmark-button ${update.isBookmarked ? 'bookmarked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(update.id);
                  }}
                  aria-label={update.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                  title={update.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  <i className={`bi ${update.isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                </Button>

                {update.featured && (
                  <div className="featured-badge" aria-hidden="true">
                    <i className="bi bi-star-fill"></i> Featured
                  </div>
                )}
                
                {update.image && (
                  <div className="update-image-container">
                    <img
                      src={update.image} 
                      alt="" // Decorative image, title describes content
                      className="update-image" 
                      loading="lazy" // Lazy load images
                    />
                    <div className="image-overlay">
                      <Badge 
                        bg={categories[update.category]?.color || 'secondary'}
                        className="category-badge overlay-badge"
                      >
                        {categories[update.category]?.icon} 
                        {categories[update.category]?.label}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <div className="card-body d-flex flex-column">
                  {!update.image && (
                    <div className="mb-3">
                      <Badge 
                        bg={categories[update.category]?.color || 'secondary'}
                        className="category-badge"
                      >
                        {categories[update.category]?.icon} 
                        {categories[update.category]?.label}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="update-meta d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted date-display">
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatDate(update.date)}
                    </small>
                    <small className="text-muted reading-time">
                      <i className="bi bi-clock me-1"></i>
                      {calculateReadingTime(update.content)}
                    </small>
                  </div>
                  
                  <h3 className="update-title">{update.title}</h3>
                  
                  <p className="update-excerpt">
                    {update.content.length > 120 
                      ? `${update.content.substring(0, 120)}...` 
                      : update.content}
                  </p>
                  
                  {/* Push footer to bottom of card */}
                  <div className="mt-auto">
                    {update.tags && update.tags.length > 0 && (
                      <div className="mb-3 tags-container">
                        {update.tags.slice(0, 3).map(tag => (
                          <Badge 
                            bg="light" 
                            text="dark" 
                            key={tag} 
                            className="me-2 tag-badge"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {update.tags.length > 3 && (
                          <Badge bg="light" text="dark" className="tag-badge">
                            +{update.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="update-actions d-flex justify-content-between align-items-center">
                      <Button 
                        variant="link" 
                        className="read-more-btn p-0"
                        onClick={() => openDetailModal(update)}
                      >
                        Read More <i className="bi bi-arrow-right ms-1"></i>
                      </Button>
                      
                      <div className="action-buttons">
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="action-btn share-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareUpdate(update, 'twitter');
                          }}
                          aria-label="Share on Twitter"
                        >
                          <i className="bi bi-share"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Enhanced List view with animations
          <div className="update-list-view no-animations">
            {paginationData.currentItems.map((update, index) => (
              <div 
                className={`update-list-item no-animations ${update.featured ? 'featured-update' : ''} ${update.isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => openDetailModal(update)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') openDetailModal(update);
                }}
                tabIndex={0}
                role="button"
                aria-label={`Read more about ${update.title}`}
                key={`list-update-${update.id}-${index}`}
                style={{ opacity: 1, visibility: 'visible', transform: 'none' }}
              >
                {/* Bookmark button */}
                <Button 
                  variant="link" 
                  className={`bookmark-button-list ${update.isBookmarked ? 'bookmarked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(update.id);
                  }}
                  aria-label={update.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  <i className={`bi ${update.isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                </Button>

                {/* List item content */}
                <div className="d-flex">
                  {update.image && (
                    <div className="update-thumbnail">
                      <img 
                        src={update.image} 
                        alt="" 
                        loading="lazy" 
                      />
                      {update.featured && (
                        <div className="featured-marker" aria-label="Featured update">
                          <i className="bi bi-star-fill"></i>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="update-content">
                    <div className="update-header d-flex justify-content-between align-items-start flex-wrap">
                      <Badge 
                        bg={categories[update.category]?.color || 'secondary'}
                        className="category-badge"
                      >
                        {categories[update.category]?.icon}
                        {categories[update.category]?.label}
                      </Badge>
                      <span className="text-muted date-display">
                        <i className="bi bi-calendar3 me-1"></i>
                        {formatDate(update.date)}
                      </span>
                    </div>
                    
                    <h3 className="update-list-title">{update.title}</h3>
                    
                    <p className="update-excerpt">
                      {update.content.substring(0, 150)}
                      {update.content.length > 150 && '...'}
                    </p>
                    
                    <div className="update-footer d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        {update.tags && update.tags.length > 0 && (
                          <div className="tags-container">
                            {update.tags.slice(0, 2).map(tag => (
                              <Badge 
                                bg="light" 
                                text="dark" 
                                key={tag} 
                                className="me-1 tag-badge-sm"
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {update.tags.length > 2 && (
                              <Badge bg="light" text="dark" className="tag-badge-sm">
                                +{update.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="link" 
                        className="read-more-btn p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(update);
                        }}
                      >
                        Read More <i className="bi bi-arrow-right ms-1"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Improved pagination with accessibility enhancements */}
      {enhancedFilteredUpdates.length > itemsPerPage && (
        <nav aria-label="Updates pagination" className="mt-4">
          <Row>
            <Col className="d-flex justify-content-center">
              <div className="pagination-container">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => handlePageChange(state.currentPage - 1)} 
                  disabled={state.currentPage === 1}
                  className="me-2"
                >
                  Previous
                </Button>
                
                {[...Array(paginationData.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Button 
                      key={pageNumber}
                      variant={state.currentPage === pageNumber ? "primary" : "outline-secondary"}
                      onClick={() => handlePageChange(pageNumber)}
                      className="me-1"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline-secondary" 
                  onClick={() => handlePageChange(state.currentPage + 1)} 
                  disabled={state.currentPage === paginationData.totalPages}
                  className="ms-1"
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </nav>
      )}

      {/* Subscribe modal */}
      <SubscribeModal
        show={state.showSubscribeModal}
        handleClose={() => updateState({ showSubscribeModal: false })}
        loading={state.subscribeLoading}
        success={state.subscribeSuccess}
        email={state.subscribeEmail}
        setEmail={(value) => updateState({ subscribeEmail: value })}
        name={state.subscribeName}
        setName={(value) => updateState({ subscribeName: value })}
        message={state.subscribeMessage}
        handleSubscribe={handleSubscribe}
      />

      {/* Update Detail Modal with enhanced functionality */}
      {state.showDetailModal && state.activeUpdate && (
        <UpdateDetailModal
          show={state.showDetailModal}
          onHide={() => updateState({ showDetailModal: false })}
          update={state.activeUpdate}
          categories={categories}
          formatDate={formatDate}
          shareUpdate={shareUpdate}
          isBookmarked={state.bookmarkedUpdates.includes(state.activeUpdate.id)}
          toggleBookmark={() => toggleBookmark(state.activeUpdate.id)}
        />
      )}
    </Container>
  );
};

export default Updates;