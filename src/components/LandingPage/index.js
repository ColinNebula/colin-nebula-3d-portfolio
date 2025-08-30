import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import maskU from '../../assets/images/maskU.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Colin Nebula 3D - Professional 3D Artist';
    
    // Add meta description if not present
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = 'Professional 3D Artist and Visual Effects Designer showcasing cutting-edge digital art and animations.';
      document.head.appendChild(metaDescription);
    }
  }, []);

  return (
    <div className="landing-page min-vh-100 d-flex align-items-center justify-content-center">
      <Container fluid className="landing-container">
        <Row className="landing-content text-center">
          <Col md={7} className="landing-text-col">
            <div className="landing-text-wrapper">
              <h1 className="display-1 fw-bold mb-4 text-white">
                Colin Nebula 3D
              </h1>
              <p className="lead mb-5 text-white-50">
                Professional 3D Artist & Visual Effects Designer
              </p>
              <p className="mb-5 text-white-50">
                Creating stunning digital experiences with cutting-edge technology and artistic vision.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  as={Link} 
                  to="/home" 
                  variant="light" 
                  size="lg" 
                  className="rounded-pill px-4 fw-semibold"
                >
                  🚀 Enter Portfolio
                </Button>
                <Button 
                  as={Link} 
                  to="/portfolio" 
                  variant="outline-light" 
                  size="lg" 
                  className="rounded-pill px-4 fw-semibold"
                >
                  👁️ View Work
                </Button>
              </div>
            </div>
          </Col>
          
          <Col md={5} className="landing-logo-col d-flex align-items-center justify-content-center">
            <div className="logo-container">
              <Link to="/portfolio" className="logo-link" aria-label="Go to portfolio">
                <img 
                  className={`landing-logo`} 
                  src={maskU} 
                  alt="Nebula 3D Logo" 
                  width="320"
                  height="320"
                />
              </Link>
            </div>
          </Col>
        </Row>
        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="scroll-text">Scroll to discover</div>
        </div>

        <div className="landing-footer">
          <div className="technologies">
            <span>3D Design</span>
            <span className="dot-separator">•</span>
            <span>Visual Effects</span>
            <span className="dot-separator">•</span>
            <span>Animation</span>
          </div>
        </div>
      </Container>
      
      {/* Background elements */}
      <div className="bg-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>
    </div>
  );
};

export default LandingPage;