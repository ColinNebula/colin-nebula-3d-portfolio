import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaEye, FaClock, FaPalette } from 'react-icons/fa';
import img1 from '../../assets/images/LifeDrawingWeb_05.jpg';
import img2 from '../../assets/images/LifeDrawingWeb_03.jpg';
import img3 from '../../assets/images/LifeDrawingWeb_06.jpg';
import './Artwork.css';


// Artwork data with enhanced details
const artworkData = [
  {
    id: 1,
    title: "Five Minute Pose",
    description: "Capturing the essence of human form in just five minutes. This piece demonstrates the ability to quickly identify and render the most essential elements of figure drawing while maintaining proportion and gesture.",
    image: img1,
    duration: "5 minutes",
    medium: "Digital Drawing",
    category: "Life Drawing",
    detailDescription: `This five-minute pose showcases the fundamentals of gesture drawing and quick character study. 
    Working with live models requires immediate decision-making about which details to prioritize. 
    The challenge lies in capturing the model's essence, posture, and energy within the time constraint while maintaining accurate proportions.`
  },
  {
    id: 2,
    title: "One Minute Gesture",
    description: "Quick gesture capture focusing on the flow and movement of the human body. These rapid sketches train the eye to see essential forms and develop confidence in mark-making.",
    image: img2,
    duration: "1 minute",
    medium: "Digital Drawing",
    category: "Gesture Study",
    detailDescription: `One-minute poses are the ultimate test of an artist's ability to distill complex forms into their most essential elements.
    This exercise develops visual instincts and helps build a vocabulary of human movement and expression.
    The focus is entirely on capturing the gesture and energy rather than detailed rendering.`
  },
  {
    id: 3,
    title: "Dynamic Figure Study",
    description: "An expressive one-minute study that emphasizes movement and energy. This piece demonstrates how to convey motion and emotion through confident, decisive strokes.",
    image: img3,
    duration: "1 minute",
    medium: "Digital Drawing",
    category: "Figure Study",
    detailDescription: `This dynamic figure study captures a moment of movement and expression. 
    Working within the one-minute timeframe forces the artist to make bold, confident decisions about line quality and emphasis.
    The result is a drawing that feels alive with energy and spontaneity, showcasing the raw skill of observational drawing.`
  }
];

const Artwork = () => {
  // State management
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Accessibility and performance
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll handler for back-to-top button
  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 300);
  }, []);

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }, [prefersReducedMotion]);

  // Modal handlers
  const openModal = useCallback((artwork) => {
    setSelectedArtwork(artwork);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedArtwork(null);
  }, []);

  // Effects
  useEffect(() => {
    // Simulate loading for smooth entrance animations
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, closeModal]);

  return (
    <div className="artwork-container">
      {/* Hero Section */}
      <section className="artwork-hero">
        <div className="artwork-hero-content">
          <Container>
            <Row>
              <Col lg={8} className="mx-auto">
                <h1 className={`artwork-title ${!isLoading ? 'fade-in-up' : ''}`}>
                  2D Artwork & Life Drawing
                </h1>
                <p className={`artwork-subtitle ${!isLoading ? 'fade-in-up delay-1' : ''}`}>
                  Classical art and life drawing skills form the foundation of artistic excellence. 
                  These studies capture the essence of human form through rapid observation and confident mark-making.
                </p>
                
                <div className={`artwork-stats ${!isLoading ? 'fade-in-up delay-2' : ''}`}>
                  <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Hours Practiced</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Featured Pieces</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Techniques</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="artwork-gallery">
        <Container>
          <div className="section-header">
            <h2 className={`section-title ${!isLoading ? 'fade-in-up' : ''}`}>
              Featured Artwork
            </h2>
            <p className={`section-description ${!isLoading ? 'fade-in-up delay-1' : ''}`}>
              A collection of life drawing studies showcasing rapid observation skills and 
              the ability to capture human form under time constraints.
            </p>
          </div>

          <Row>
            <Col>
              <div className="artwork-grid">
                {artworkData.map((artwork, index) => (
                  <Card 
                    key={artwork.id} 
                    className={`artwork-card ${!isLoading ? 'fade-in-up' : ''} ${!isLoading ? `delay-${index + 1}` : ''}`}
                  >
                    <div className="position-relative overflow-hidden">
                      <Card.Img 
                        variant="top" 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="artwork-card-img"
                        loading="lazy"
                      />
                    </div>
                    
                    <Card.Body className="artwork-card-body">
                      <Card.Title className="artwork-card-title">
                        {artwork.title}
                      </Card.Title>
                      
                      <div className="mb-2 d-flex align-items-center gap-3 text-muted small">
                        <span className="d-flex align-items-center gap-1">
                          <FaClock size={12} />
                          {artwork.duration}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <FaPalette size={12} />
                          {artwork.medium}
                        </span>
                      </div>
                      
                      <Card.Text className="artwork-card-text">
                        {artwork.description}
                      </Card.Text>
                    </Card.Body>
                    
                    <Card.Footer className="artwork-card-footer">
                      <Button 
                        className="artwork-view-btn"
                        onClick={() => openModal(artwork)}
                        aria-label={`View details for ${artwork.title}`}
                      >
                        <FaEye className="me-2" size={14} />
                        View Details
                      </Button>
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced Modal */}
      <Modal
        show={showModal}
        onHide={closeModal}
        size="xl"
        centered
        className="artwork-modal"
        aria-labelledby="artwork-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="artwork-modal-title">
            {selectedArtwork?.title}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {selectedArtwork && (
            <Row>
              <Col lg={8}>
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="modal-artwork-img img-fluid w-100"
                />
              </Col>
              <Col lg={4}>
                <div className="mb-3">
                  <h5 className="text-warning mb-2">Artwork Details</h5>
                  <div className="mb-2">
                    <strong>Duration:</strong> {selectedArtwork.duration}
                  </div>
                  <div className="mb-2">
                    <strong>Medium:</strong> {selectedArtwork.medium}
                  </div>
                  <div className="mb-3">
                    <strong>Category:</strong> {selectedArtwork.category}
                  </div>
                </div>
                
                <div className="modal-description">
                  <h6 className="text-warning mb-2">About This Piece</h6>
                  <p>{selectedArtwork.detailDescription}</p>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>

      {/* Enhanced Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
          title="Back to top"
        >
          ↑
          <span className="visually-hidden">Back to top</span>
        </button>
      )}
    </div>
  );
};

export default Artwork;