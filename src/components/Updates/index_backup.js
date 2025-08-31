import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Badge, Form, Modal, Button, Spinner } from 'react-bootstrap';
import { useNotifications } from '../../App';

// Skeleton loader component
const SkeletonLoader = ({ count, viewMode }) => {
  return (
    <div className={`skeleton-container ${viewMode}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`skeleton-card ${viewMode === 'list' ? 'skeleton-list' : ''}`}>
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Back to top component
const BackToTop = ({ show }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <Button
      className="back-to-top-btn position-fixed"
      onClick={scrollToTop}
      style={{
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        borderRadius: '50%',
        width: '50px',
        height: '50px'
      }}
      aria-label="Back to top"
    >
      <i className="bi bi-arrow-up"></i>
    </Button>
  );
};

// Enhanced sample updates with more detailed content - moved outside component
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
  
  // State for updates data
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering and sorting state
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Additional state for enhanced features
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeName, setSubscribeName] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  
  // Sample update categories with associated icons/colors
  const categories = {
    'project': { label: 'Project Update', icon: '🚀', color: 'primary' },
    'release': { label: 'New Release', icon: '✨', color: 'success' },
    'news': { label: 'News', icon: '📰', color: 'info' },
    'event': { label: 'Event', icon: '📅', color: 'warning' },
    'announcement': { label: 'Announcement', icon: '📣', color: 'danger' }
  };

  // Add the missing calculateReadingTime function
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? '< 1 min read' : `${readingTime} min read`;
  };

  // Add the missing shareUpdate function
  const shareUpdate = (update, platform) => {
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
  };

  // Fetch updates (simulated API call with sample data)
  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use the enhancedSampleUpdates from outside the component
      setUpdates(enhancedSampleUpdates);
      setError(null);
    } catch (err) {
      setError('Failed to load updates. Please try again.');
      console.error('Error fetching updates:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since enhancedSampleUpdates is constant

  // Fetch updates (simulated API call with sample data)
  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/updates');
        // const data = await response.json();
        
        setUpdates(enhancedSampleUpdates);
        setError(null);
      } catch (err) {
        setError('Failed to load updates. Please try again later.');
        console.error('Error fetching updates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
    showNotification('Updates page loaded', 'info', 2000, {
      category: 'navigation',
      icon: '📄'
    });
  }, [showNotification, enhancedSampleUpdates]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // New state for bookmarked updates (persisted to localStorage)
  const [bookmarkedUpdates, setBookmarkedUpdates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nebula_bookmarked_updates') || '[]');
    } catch {
      return [];
    }
  });
  
  // New state for view history
  const [viewHistory, setViewHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nebula_update_view_history') || '[]');
    } catch {
      return [];
    }
  });
  
  // Track if it's the first visit
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('nebula_updates_visited');
  });
  
  // Additional filter for bookmarked items
  const [showBookmarked, setShowBookmarked] = useState(false);
  
  // Accessibility improvements - focus management
  const listRef = React.useRef(null);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  
  // Track scrolling for "back to top" button
  const [showBackToTop, setShowBackToTop] = useState(false);

  // For react-intersection-observer (used for animations)
  const inView = true; // Simplified for this fix
  const observerRef = React.useRef(null);

  // Optimization: Use useMemo for filtered updates
  const enhancedFilteredUpdates = useMemo(() => {
    return updates
      .filter(update => {
        // Apply bookmarks filter if active
        if (showBookmarked && !bookmarkedUpdates.includes(update.id)) {
          return false;
        }
        
        // Apply category filter if not 'all'
        if (filter !== 'all' && update.category !== filter) {
          return false;
        }
        
        // Apply search filter if search query exists
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            update.title.toLowerCase().includes(query) ||
            update.content.toLowerCase().includes(query) ||
            (update.tags && update.tags.some(tag => tag.toLowerCase().includes(query)))
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'oldest') {
          return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'popular') {
          const viewsA = viewHistory.find(v => v.id === a.id)?.viewCount || 0;
          const viewsB = viewHistory.find(v => v.id === b.id)?.viewCount || 0;
          return viewsB - viewsA;
        }
        return 0;
      })
      .map(update => ({
        ...update,
        isBookmarked: bookmarkedUpdates.includes(update.id),
        viewCount: viewHistory.find(v => v.id === update.id)?.viewCount || 0,
        lastViewed: viewHistory.find(v => v.id === update.id)?.lastViewed || null,
      }));
  }, [updates, filter, searchQuery, sortBy, showBookmarked, bookmarkedUpdates, viewHistory]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = enhancedFilteredUpdates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(enhancedFilteredUpdates.length / itemsPerPage);

  // Toggle bookmark status for an update
  const toggleBookmark = useCallback((updateId) => {
    setBookmarkedUpdates(prev => {
      const isAlreadyBookmarked = prev.includes(updateId);
      const newBookmarks = isAlreadyBookmarked
        ? prev.filter(id => id !== updateId)
        : [...prev, updateId];
      
      localStorage.setItem('nebula_bookmarked_updates', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  // Track update viewing
  const trackUpdateView = useCallback((updateId) => {
    setViewHistory(prev => {
      const now = new Date().toISOString();
      const existingIndex = prev.findIndex(item => item.id === updateId);
      
      let newHistory;
      if (existingIndex >= 0) {
        newHistory = [...prev];
        newHistory[existingIndex] = { 
          ...newHistory[existingIndex], 
          viewCount: (newHistory[existingIndex].viewCount || 0) + 1,
          lastViewed: now
        };
      } else {
        newHistory = [...prev, { id: updateId, firstViewed: now, lastViewed: now, viewCount: 1 }];
      }
      
      localStorage.setItem('nebula_update_view_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Open detail modal with tracking
  const openDetailModal = useCallback((update) => {
    setActiveUpdate(update);
    setShowDetailModal(true);
    trackUpdateView(update.id);
  }, [trackUpdateView]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of updates section
    document.getElementById('updates-container').scrollIntoView({ behavior: 'smooth' });
  };

  // Handle subscription form submission
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) {
      setSubscribeMessage('Please enter your email address.');
      return;
    }
    
    setSubscribeLoading(true);
    setSubscribeMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribeSuccess(true);
      setSubscribeMessage('Thank you for subscribing! You will receive updates about new projects and releases.');
      setSubscribeEmail('');
      setSubscribeName('');
      
      // Close modal after success
      setTimeout(() => {
        setShowSubscribeModal(false);
        // Reset success state after modal closes
        setTimeout(() => setSubscribeSuccess(false), 500);
      }, 2000);
      
    } catch (err) {
      setSubscribeMessage('Sorry, there was an error processing your subscription. Please try again.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  // Keyboard navigation for updates list
  const handleKeyNavigation = useCallback((e, updates) => {
    if (updates.length === 0) return;
    
    // Arrow keys for navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveItemIndex(prevIndex => {
        let newIndex;
        if (e.key === 'ArrowDown') {
          newIndex = prevIndex < updates.length - 1 ? prevIndex + 1 : 0;
        } else {
          newIndex = prevIndex > 0 ? prevIndex - 1 : updates.length - 1;
        }
        
        // Scroll the item into view if needed
        const items = listRef.current?.querySelectorAll('.update-card, .update-list-item');
        if (items && items[newIndex]) {
          items[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        return newIndex;
      });
    }
    
    // Enter key to open detail
    if (e.key === 'Enter' && activeItemIndex >= 0 && activeItemIndex < updates.length) {
      openDetailModal(updates[activeItemIndex]);
    }
  }, [activeItemIndex, openDetailModal]);

  return (
    <Container id="updates-container" className="updates-container py-5">
      {/* Professional Hero Section */}
      <div className="updates-hero" ref={observerRef}>
        <div className="updates-hero-content fade-in">
          <h1 className="updates-title">Latest Updates</h1>
          <p className="updates-subtitle">
            Stay current with my latest projects, releases, and professional insights. 
            Discover behind-the-scenes content, tutorials, and announcements about my creative journey.
          </p>
          
          <div className="updates-stats">
            <div className="stat-item">
              <span className="stat-number">{updates.length}</span>
              <span className="stat-label">Total Updates</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.keys(categories).length}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{bookmarkedUpdates.length}</span>
              <span className="stat-label">Bookmarked</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{viewHistory.length}</span>
              <span className="stat-label">Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* First visit welcome message */}
      {isFirstVisit && (
        <Alert 
          variant="info" 
          className="welcome-alert" 
          dismissible 
          onClose={() => {
            setIsFirstVisit(false);
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
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          categories={categories}
          showBookmarked={showBookmarked}
          setShowBookmarked={setShowBookmarked}
          bookmarkedCount={bookmarkedUpdates.length}
          setCurrentPage={setCurrentPage}
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
              {enhancedFilteredUpdates.length > 0 && ` • Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, enhancedFilteredUpdates.length)}`}
            </span>
          </p>
        </div>
        <div>
          <Button 
            variant="primary" 
            size="sm" 
            className="subscribe-button"
            onClick={() => setShowSubscribeModal(true)}
          >
            <i className="bi bi-envelope me-2"></i>Subscribe for Updates
          </Button>
        </div>
      </div>

      {/* Updates List - with improved transitions and accessibility */}
      <div 
        className={`update-container ${viewMode === 'cards' ? 'card-view' : 'list-view'}`}
        ref={listRef}
        tabIndex={-1}
        aria-live="polite"
      >
        {loading ? (
          <SkeletonLoader count={3} viewMode={viewMode} />
        ) : error ? (
          <div className="text-center py-5">
            <div className="error-message">
              <div className="error-icon mb-3">⚠️</div>
              <h4>Something went wrong</h4>
              <p>{error}</p>
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
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                  setShowBookmarked(false);
                  setCurrentPage(1);
                }}
              >
                <i className="bi bi-x-circle me-2"></i> Clear Filters
              </Button>
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="update-list">
            {currentItems.map((update, index) => (
              <Card 
                key={update.id}
                className={`update-card h-100 ${update.featured ? 'featured-update' : ''} ${activeItemIndex === index ? 'active-card' : ''} ${update.isBookmarked ? 'bookmarked' : ''}`}
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
                        className="update-image card-img-top" 
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
                  
                  <Card.Body className="d-flex flex-column">
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
                    
                    <Card.Title className="update-title">{update.title}</Card.Title>
                    
                    <Card.Text className="update-excerpt">
                      {update.content.length > 120 
                        ? `${update.content.substring(0, 120)}...` 
                        : update.content}
                    </Card.Text>
                    
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
                              // Create a dropdown for share options
                              const dropdown = document.getElementById(`share-dropdown-${update.id}`);
                              if (dropdown) dropdown.classList.toggle('show');
                            }}
                            aria-label="Share options"
                          >
                            <i className="bi bi-share"></i>
                          </Button>
                          
                          {/* Share dropdown */}
                          <div id={`share-dropdown-${update.id}`} className="share-dropdown">
                            <Button 
                              variant="link" 
                              className="share-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                shareUpdate(update, 'twitter');
                              }}
                            >
                              <i className="bi bi-twitter"></i> Twitter
                            </Button>
                            <Button 
                              variant="link" 
                              className="share-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                shareUpdate(update, 'facebook');
                              }}
                            >
                              <i className="bi bi-facebook"></i> Facebook
                            </Button>
                            <Button 
                              variant="link" 
                              className="share-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                shareUpdate(update, 'linkedin');
                              }}
                            >
                              <i className="bi bi-linkedin"></i> LinkedIn
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          // Enhanced List view with animations
          <div className="update-list-view">
            {currentItems.map((update, index) => (
              <div 
                className={`update-list-item ${update.featured ? 'featured-update' : ''} ${activeItemIndex === index ? 'active-item' : ''} ${update.isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => openDetailModal(update)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') openDetailModal(update);
                }}
                tabIndex={0}
                role="button"
                aria-label={`Read more about ${update.title}`}
                key={update.id}
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
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="me-2"
                >
                  Previous
                </Button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Button 
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "primary" : "outline-secondary"}
                      onClick={() => handlePageChange(pageNumber)}
                      className="me-1"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline-secondary" 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
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
        show={showSubscribeModal}
        handleClose={() => setShowSubscribeModal(false)}
        loading={subscribeLoading}
        success={subscribeSuccess}
        email={subscribeEmail}
        setEmail={setSubscribeEmail}
        name={subscribeName}
        setName={setSubscribeName}
        message={subscribeMessage}
        handleSubscribe={handleSubscribe}
      />

      {/* Back to top button */}
      <BackToTop show={showBackToTop} />

      {/* Update Detail Modal with enhanced functionality */}
      {showDetailModal && activeUpdate && (
        <UpdateDetailModal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          update={activeUpdate}
          categories={categories}
          formatDate={formatDate}
          shareUpdate={shareUpdate}
          isBookmarked={bookmarkedUpdates.includes(activeUpdate.id)}
          toggleBookmark={() => toggleBookmark(activeUpdate.id)}
        />
      )}
    </Container>
  );
};

export default Updates;

