import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import maskU from '../../assets/images/maskU.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  // Create floating particles
  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.2,
          direction: Math.random() * Math.PI * 2,
        });
      }
      setParticles(newParticles);
    };

    createParticles();
    window.addEventListener('resize', createParticles);
    return () => window.removeEventListener('resize', createParticles);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

    // Load animation trigger
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          const newX = particle.x + Math.cos(particle.direction) * particle.speed;
          const newY = particle.y + Math.sin(particle.direction) * particle.speed;
          
          return {
            ...particle,
            // Wrap around screen
            x: newX > window.innerWidth ? 0 : newX < 0 ? window.innerWidth : newX,
            y: newY > window.innerHeight ? 0 : newY < 0 ? window.innerHeight : newY,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`landing-page min-vh-100 d-flex align-items-center justify-content-center ${isLoaded ? 'loaded' : ''}`}
      ref={containerRef}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      }}
    >
      <Container fluid className="landing-container">
        <Row className="landing-content text-center">
          <Col md={7} className="landing-text-col">
            <div className="landing-text-wrapper">
              <h1 className={`display-1 fw-bold mb-4 text-white landing-title ${isLoaded ? 'animate' : ''}`}>
                <span className="welcome-accent">Colin Nebula</span>
                <span className="lastly">3D</span>
              </h1>
              <p className={`lead mb-5 text-white-50 landing-description typewriter ${isLoaded ? 'animate' : ''}`}>
                Professional 3D Artist & Visual Effects Designer
              </p>
              <p className={`mb-5 text-white-50 landing-description ${isLoaded ? 'animate' : ''}`}>
                Creating stunning digital experiences with cutting-edge technology and artistic vision.
              </p>
              <div className={`d-flex gap-3 justify-content-center flex-wrap landing-cta ${isLoaded ? 'animate' : ''}`}>
                <Button 
                  as={Link} 
                  to="/home" 
                  variant="light" 
                  size="lg" 
                  className="rounded-pill px-4 fw-semibold landing-button pulse-glow"
                >
                  <span className="button-text">🚀 Enter Portfolio</span>
                  <span className="button-overlay"></span>
                </Button>
                <Button 
                  as={Link} 
                  to="/portfolio" 
                  variant="outline-light" 
                  size="lg" 
                  className="rounded-pill px-4 fw-semibold landing-button shimmer"
                >
                  <span className="button-text">👁️ View Work</span>
                  <span className="button-overlay"></span>
                </Button>
              </div>
            </div>
          </Col>
          
          <Col md={5} className="landing-logo-col d-flex align-items-center justify-content-center">
            <div className="logo-container">
              <div className="logo-glow"></div>
              <Link to="/portfolio" className="logo-link" aria-label="Go to portfolio">
                <img 
                  className={`landing-logo ${isLoaded ? 'loaded' : ''}`} 
                  src={maskU} 
                  alt="Nebula 3D Logo" 
                  width="320"
                  height="320"
                />
              </Link>
              <div className="logo-particles">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`logo-particle particle-${i + 1}`}></div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="scroll-indicator enhanced">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="scroll-text animated-text">Scroll to discover</div>
          <div className="scroll-arrows">
            <div className="arrow arrow-1"></div>
            <div className="arrow arrow-2"></div>
            <div className="arrow arrow-3"></div>
          </div>
        </div>

        <div className="landing-footer animated-footer">
          <div className="technologies">
            <span className="tech-item">3D Design</span>
            <span className="dot-separator pulse">•</span>
            <span className="tech-item">Visual Effects</span>
            <span className="dot-separator pulse">•</span>
            <span className="tech-item">Animation</span>
          </div>
        </div>
      </Container>
      
      {/* Enhanced Background elements */}
      <div className="bg-elements">
        <div className="bg-circle circle-1 parallax-slow"></div>
        <div className="bg-circle circle-2 parallax-medium"></div>
        <div className="bg-circle circle-3 parallax-fast"></div>
        <div className="bg-circle circle-4"></div>
        <div className="bg-circle circle-5"></div>
        
        {/* Floating Particles */}
        <div className="floating-particles">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
              }}
            ></div>
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="geometric-shapes">
          <div className="triangle triangle-1"></div>
          <div className="triangle triangle-2"></div>
          <div className="hexagon hexagon-1"></div>
          <div className="hexagon hexagon-2"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Interactive Light Effect */}
      <div 
        className="cursor-light" 
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
        }}
      ></div>
    </div>
  );
};

export default LandingPage;