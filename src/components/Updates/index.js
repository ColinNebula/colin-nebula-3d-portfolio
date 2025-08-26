import React, { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import './Updates.css';

// Helper components defined inline for simplicity
const SkeletonLoader = ({ count, viewMode }) => {
  return (
    <div className={`skeleton-container ${viewMode}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton-image"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      ))}
    </div>
  );
};

const BackToTop = ({ show }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return show ? (
    <button
      className="back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  ) : null;
};

// Define the UpdateDetailModal component
const UpdateDetailModal = ({ show, onHide, update, categories, formatDate, shareUpdate, isBookmarked, toggleBookmark }) => {
  if (!update) return null;
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="update-detail-modal"
      aria-labelledby="update-detail-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="update-detail-title">
          <Badge 
            bg={categories[update.category]?.color || 'secondary'}
            className="category-badge me-2"
          >
            <span className="category-icon me-1">
              {categories[update.category]?.icon || '📄'}
            </span>
            {categories[update.category]?.label || 'Update'}
          </Badge>
          {update.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-detail-meta d-flex justify-content-between align-items-center mb-3">
          <div className="date-author">
            <span className="calendar-icon me-2">📅</span> 
            {formatDate(update.date)}
          </div>
          <div className="share-buttons">
            <Button 
              variant="link" 
              className="p-0 me-2 text-muted share-btn"
              onClick={() => shareUpdate(update, 'twitter')}
              title="Share on Twitter"
            >
              <span className="share-icon">𝕏</span>
            </Button>
            <Button 
              variant="link" 
              className="p-0 me-2 text-muted share-btn"
              onClick={() => shareUpdate(update, 'facebook')}
              title="Share on Facebook"
            >
              <span className="share-icon">ⓕ</span>
            </Button>
            <Button 
              variant="link" 
              className="p-0 text-muted share-btn"
              onClick={() => shareUpdate(update, 'linkedin')}
              title="Share on LinkedIn"
            >
              <span className="share-icon">ⓘⓝ</span>
            </Button>
          </div>
        </div>
        
        {update.image && (
          <div className="update-detail-image mb-4">
            <img src={update.image} alt={update.title} className="img-fluid rounded" />
          </div>
        )}
        
        <div className="update-detail-content mb-4">
          <p>{update.content}</p>
          
          {update.detailedContent && (
            <div className="detailed-content" dangerouslySetInnerHTML={{ __html: update.detailedContent }} />
          )}
        </div>
        
        {update.gallery && update.gallery.length > 0 && (
          <div className="update-gallery mb-4">
            <h5 className="gallery-title">Gallery</h5>
            <Row>
              {update.gallery.map((image, index) => (
                <Col xs={6} md={4} key={index} className="gallery-item">
                  <img src={image} alt={`${update.title} ${index + 1}`} className="img-fluid rounded" />
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        {update.tags && update.tags.length > 0 && (
          <div className="tags-section mt-4">
            <h6 className="tags-title">Tags:</h6>
            <div className="tags-list">
              {update.tags.map(tag => (
                <Badge 
                  bg="light" 
                  text="dark" 
                  key={tag} 
                  className="me-2 tag-badge"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between">
          <Button 
            variant="outline-secondary" 
            onClick={onHide}
          >
            Close
          </Button>
          
          <div>
            {update.link && (
              <Button 
                variant="outline-primary" 
                href={update.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="me-2"
              >
                Read More <span className="external-link-icon ms-1">↗</span>
              </Button>
            )}
            
            {update.video && (
              <Button 
                variant="outline-danger" 
                href={update.video} 
                target="_blank" 
                rel="noopener noreferrer"
                className="me-2"
              >
                Watch Video <span className="play-icon ms-1">▶</span>
              </Button>
            )}
            
            {update.registrationLink && (
              <Button 
                variant="primary" 
                href={update.registrationLink} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Register Now <span className="calendar-check-icon ms-1">📆</span>
              </Button>
            )}
          </div>
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
      <Col md={3} className="mb-3 mb-md-0">
        <Form.Group>
          <Form.Label>Filter by Category</Form.Label>
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
      <Col md={3} className="mb-3 mb-md-0">
        <Form.Group>
          <Form.Label>Sort By</Form.Label>
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
      <Col md={4} className="mb-3 mb-md-0">
        <Form.Group>
          <Form.Label>Search Updates</Form.Label>
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
      <Col md={2} className="d-flex align-items-end justify-content-between">
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
        <div className="view-toggle">
          <div className="btn-group">
            <Button 
              variant={viewMode === 'cards' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setViewMode('cards')}
              aria-label="Card view"
              title="Card view"
            >
              <span className="view-icon">□□</span>
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              <span className="view-icon">≡</span>
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
          <li>High-poly model with over 1.2 million triangles (with LODs available)</li>
          <li>PBR textures at 4K resolution</li>
          <li>Full rigging with 120+ bones for detailed animation</li>
          <li>58 unique animation sequences</li>
          <li>Compatible with Unreal Engine 5 and Unity</li>
        </ul>
        <p>This character was designed for next-generation gaming and cinematic applications, with special attention to detail in the facial expressions and armor mechanics.</p>
      `
    },
    {
      id: 2,
      title: "Upcoming Workshop on Environmental Design",
      content: "Join me for a virtual workshop on creating immersive 3D environments for games and VR applications. We'll cover lighting, texture mapping, and performance optimization techniques.",
      date: "2023-11-22T14:00:00Z",
      category: "event",
      registrationLink: "https://workshop.example.com",
      tags: ["workshop", "environment", "VR"]
    },
    {
      id: 3,
      title: "Portfolio Website Updates",
      content: "I've made significant improvements to my portfolio website, including a new dark mode, better mobile responsiveness, and faster loading times for 3D models.",
      date: "2023-11-10T09:15:00Z",
      category: "project",
      tags: ["website", "portfolio", "UX"]
    },
    {
      id: 4,
      title: "Featured in Digital Art Magazine",
      content: "My recent work 'Nebula Voyager' has been featured in this month's issue of Digital Art Magazine. Check out the interview where I discuss my creative process and techniques.",
      date: "2023-11-05T16:45:00Z",
      category: "news",
      link: "https://magazine.example.com/interview",
      tags: ["interview", "feature", "recognition"]
    },
    {
      id: 5,
      title: "New Client Project: Sci-Fi Game Assets",
      content: "I've begun work on an exciting project creating futuristic game assets for an upcoming indie sci-fi game. Stay tuned for behind-the-scenes content and previews.",
      date: "2023-11-01T11:20:00Z",
      category: "project",
      tags: ["client work", "game assets", "sci-fi"]
    },
    {
      id: 6,
      title: "3D Modeling Course Now Available",
      content: "After months of preparation, my comprehensive 3D modeling course is now available online. Learn everything from basic principles to advanced techniques at your own pace.",
      date: "2023-10-25T13:00:00Z",
      category: "announcement",
      link: "https://course.example.com",
      tags: ["course", "education", "tutorials"]
    },
    {
      id: 7,
      title: "VFX Breakdown: Space Battle Sequence",
      content: "I've published a detailed breakdown of how I created the space battle visual effects for Project Nebula, including particle systems, compositing techniques, and rendering optimizations.",
      date: "2023-10-18T15:30:00Z",
      category: "project",
      video: "https://youtube.com/example",
      tags: ["VFX", "breakdown", "tutorial"]
    },
    {
      id: 8,
      title: "Interactive 3D Web Portfolio Launched",
      content: "I've launched a new interactive section of my portfolio that allows visitors to explore and interact with my 3D models directly in the browser using Three.js.",
      date: "2023-12-01T09:00:00Z",
      category: "release",
      featured: true,
      image: "https://via.placeholder.com/800x400?text=Interactive+3D+Portfolio",
      tags: ["web3d", "threejs", "interactive"],
      link: "#interactive-portfolio",
      detailedContent: `
        <p>After months of development, I'm thrilled to announce the launch of my interactive 3D portfolio section.</p>
        <p>Using the power of Three.js and WebGL, visitors can now:</p>
        <ul>
          <li>Rotate, zoom, and inspect my 3D models in real-time</li>
          <li>Toggle different lighting conditions</li>
          <li>View wireframe and texture overlays</li>
          <li>Play animations</li>
        </ul>
        <p>This represents a significant step forward in how I showcase my work, allowing for a more immersive and engaging experience.</p>
      `
    },
    {
      id: 9,
      title: "Behind the Scenes: Creating the Nebula Starship",
      content: "A detailed look at my process for creating the Nebula Starship model, from initial concept sketches to final renders.",
      date: "2023-12-05T14:30:00Z",
      category: "project",
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "https://via.placeholder.com/800x450?text=Nebula+Starship",
      tags: ["behind the scenes", "sci-fi", "modeling"],
      detailedContent: `
        <p>The Nebula Starship project was one of my most complex undertakings, requiring careful attention to both artistic design and technical constraints.</p>
        <h4>Design Philosophy</h4>
        <p>I wanted to create a spacecraft that felt both realistic and visually distinctive. Taking inspiration from contemporary aerospace design and classic sci-fi, the ship features:</p>
        <ul>
          <li>Modular construction with visible panel lines and maintenance access points</li>
          <li>Realistic thruster placement following actual physics principles</li>
          <li>Interior spaces designed with human ergonomics in mind</li>
        </ul>
        <h4>Technical Execution</h4>
        <p>The model consists of over 300 unique components, each modeled separately and then assembled. The final asset includes:</p>
        <ul>
          <li>High and low poly versions (1.5M and 150K triangles respectively)</li>
          <li>Full interior for close-up shots</li>
          <li>Procedural damage system for visual effects</li>
        </ul>
      `
    }
  ];

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
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
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
    // Simplified for this fix
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
      return isAlreadyBookmarked
        ? prev.filter(id => id !== updateId)
        : [...prev, updateId];
    });
  }, []);

  // Track update viewing
  const trackUpdateView = useCallback((updateId) => {
    setViewHistory(prev => {
      const now = new Date().toISOString();
      const existingIndex = prev.findIndex(item => item.id === updateId);
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = { 
          ...updated[existingIndex], 
          viewCount: (updated[existingIndex].viewCount || 0) + 1,
          lastViewed: now
        };
        return updated;
      } else {
        // Add new entry
        return [...prev, { id: updateId, firstViewed: now, lastViewed: now, viewCount: 1 }];
      }
    });
  }, []);

  // Enhanced detail modal open function with tracking
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
      {/* First visit welcome message */}
      {isFirstVisit && (
        <Alert 
          variant="info" 
          className="welcome-alert" 
          dismissible 
          onClose={() => setIsFirstVisit(false)}
        >
          <Alert.Heading>Welcome to Updates!</Alert.Heading>
          <p>This is where you'll find the latest news about my projects, events, and releases. 
          You can filter by category, search for specific updates, or bookmark your favorites.</p>
        </Alert>
      )}

      <Row className="mb-4" ref={observerRef}>
        <Col>
          <div className="fade-in">
            <h2 className="updates-title text-center">Latest Updates</h2>
            <p className="text-center text-muted">
              Stay current with my latest projects, releases, and announcements
            </p>
          </div>
        </Col>
      </Row>

      {/* Filter panel */}
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

      {/* Results stats with improved layout */}
      <Row className="mb-3 align-items-center">
        <Col xs={12} sm={6}>
          <p className="results-count mb-0">
            {enhancedFilteredUpdates.length === 0 ? 
              'No updates found' : 
              enhancedFilteredUpdates.length === 1 ? 
                '1 update found' : 
                `${enhancedFilteredUpdates.length} updates found`
            }
            <span className="d-inline-block ms-2 text-muted results-detail">
              {enhancedFilteredUpdates.length > 0 && `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, enhancedFilteredUpdates.length)}`}
            </span>
          </p>
        </Col>
        <Col xs={12} sm={6} className="text-sm-end mt-2 mt-sm-0">
          <Button 
            variant="primary" 
            size="sm" 
            className="subscribe-button"
            onClick={() => setShowSubscribeModal(true)}
          >
            <i className="bi bi-envelope"></i> Subscribe for Updates
          </Button>
        </Col>
      </Row>

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
          <Row className="update-list g-4">
            {currentItems.map((update, index) => (
              <Col xs={12} md={filter === 'all' ? 6 : 12} lg={filter === 'all' ? 4 : 6} key={update.id}>
                <Card 
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
                  className="pagination-arrow"
                  aria-label="Previous page"
                >
                  <i className="bi bi-chevron-left"></i> Previous
                </Button>
                
                <ul className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show limited page numbers with ellipsis for better UI
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <li key={pageNumber} className="page-item">
                          <Button 
                            variant={currentPage === pageNumber ? "primary" : "outline-secondary"}
                            onClick={() => handlePageChange(pageNumber)}
                            className="pagination-number"
                            aria-label={`Page ${pageNumber}`}
                            aria-current={currentPage === pageNumber ? "page" : undefined}
                          >
                            {pageNumber}
                          </Button>
                        </li>
                      );
                    } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return <li key={pageNumber} className="pagination-ellipsis">...</li>;
                    }
                    return null;
                  })}
                </ul>
                
                <Button 
                  variant="outline-secondary" 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-arrow"
                  aria-label="Next page"
                >
                  Next <i className="bi bi-chevron-right"></i>
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

