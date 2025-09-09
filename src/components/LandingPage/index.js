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
  const [isTouched, setIsTouched] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [touchCount, setTouchCount] = useState(0);
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const [touchIntensity, setTouchIntensity] = useState(0);
  const [touchTrail, setTouchTrail] = useState([]);
  const [isLongPress, setIsLongPress] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [gestureType, setGestureType] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const longPressTimer = useRef(null);

  // Track window width for responsive button text
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get responsive button text based on screen size
  const getButtonText = (defaultText, shortText, iconOnly) => {
    if (windowWidth <= 360) return iconOnly;
    if (windowWidth <= 480) return shortText;
    return defaultText;
  };

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

  // Enhanced touch event handlers for mobile devices
  useEffect(() => {
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const currentTime = Date.now();
      const touchX = (touch.clientX / window.innerWidth) * 100;
      const touchY = (touch.clientY / window.innerHeight) * 100;
      
      setTouchPosition({ x: touchX, y: touchY });
      setTouchStartTime(currentTime);
      setIsTouched(true);
      setGestureType('tap');
      
      // Multi-tap detection
      if (currentTime - lastTouchTime < 300) {
        setTouchCount(prev => prev + 1);
        if (touchCount >= 1) {
          setIsDoubleTap(true);
          setGestureType('double-tap');
          // Triple haptic feedback for double tap
          if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
          }
          setTimeout(() => setIsDoubleTap(false), 800);
        }
      } else {
        setTouchCount(1);
      }
      
      setLastTouchTime(currentTime);
      
      // Long press detection
      longPressTimer.current = setTimeout(() => {
        setIsLongPress(true);
        setGestureType('long-press');
        // Long haptic feedback for long press
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }, 500);
      
      // Create touch trail
      setTouchTrail(prev => [
        ...prev.slice(-8), // Keep last 8 points
        { 
          x: touchX, 
          y: touchY, 
          time: currentTime,
          id: Math.random()
        }
      ]);
      
      // Single tap haptic
      if (navigator.vibrate && touchCount <= 1) {
        navigator.vibrate(30);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const touchX = (touch.clientX / window.innerWidth) * 100;
      const touchY = (touch.clientY / window.innerHeight) * 100;
      
      setTouchPosition({ x: touchX, y: touchY });
      setGestureType('swipe');
      
      // Calculate touch intensity based on movement speed
      const lastTrail = touchTrail[touchTrail.length - 1];
      if (lastTrail) {
        const deltaX = Math.abs(touchX - lastTrail.x);
        const deltaY = Math.abs(touchY - lastTrail.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        setTouchIntensity(Math.min(distance * 2, 100));
      }
      
      // Add to touch trail
      setTouchTrail(prev => [
        ...prev.slice(-8),
        { 
          x: touchX, 
          y: touchY, 
          time: Date.now(),
          id: Math.random()
        }
      ]);
      
      // Cancel long press if moving
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        setIsLongPress(false);
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      const touchDuration = Date.now() - touchStartTime;
      
      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      
      // Determine final gesture type
      if (touchDuration > 500) {
        setGestureType('long-press');
      } else if (isDoubleTap) {
        setGestureType('double-tap');
      } else if (touchTrail.length > 3) {
        setGestureType('swipe');
      } else {
        setGestureType('tap');
      }
      
      // Gradually fade effects
      setTimeout(() => {
        setIsTouched(false);
        setIsLongPress(false);
        setTouchIntensity(0);
      }, 600);
      
      // Clear touch trail after delay
      setTimeout(() => {
        setTouchTrail([]);
        setGestureType(null);
      }, 1000);
    };

    // Add touch event listeners specifically to the title element
    const titleElement = titleRef.current;
    if (titleElement) {
      titleElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      titleElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      titleElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      if (titleElement) {
        titleElement.removeEventListener('touchstart', handleTouchStart);
        titleElement.removeEventListener('touchmove', handleTouchMove);
        titleElement.removeEventListener('touchend', handleTouchEnd);
      }
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [isLoaded, touchCount, lastTouchTime, touchTrail, touchStartTime, isDoubleTap]); // Dependencies for touch logic

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
              <h1 
                ref={titleRef}
                className={`display-1 fw-bold mb-4 text-white landing-title enhanced-title touch-interactive ${isLoaded ? 'animate' : ''} ${isTouched ? 'touched' : ''} ${isDoubleTap ? 'double-tapped' : ''} ${isLongPress ? 'long-pressed' : ''} ${gestureType ? `gesture-${gestureType}` : ''}`}
                style={{
                  '--touch-x': `${touchPosition.x}%`,
                  '--touch-y': `${touchPosition.y}%`,
                  '--touch-intensity': touchIntensity,
                  '--touch-count': touchCount,
                }}
                onClick={() => {
                  // Enhanced haptic feedback for devices that support it
                  if (navigator.vibrate) {
                    navigator.vibrate([50, 30, 50]);
                  }
                  // Trigger a touch-like effect on click for desktop users
                  setIsTouched(true);
                  setGestureType('click');
                  setTimeout(() => {
                    setIsTouched(false);
                    setGestureType(null);
                  }, 800);
                }}
              >
                <span className="welcome-accent enhanced-name">
                  <span className="letter-1">C</span>
                  <span className="letter-2">o</span>
                  <span className="letter-3">l</span>
                  <span className="letter-4">i</span>
                  <span className="letter-5">n</span>
                  <span className="space">&nbsp;</span>
                  <span className="letter-6">N</span>
                  <span className="letter-7">e</span>
                  <span className="letter-8">b</span>
                  <span className="letter-9">u</span>
                  <span className="letter-10">l</span>
                  <span className="letter-11">a</span>
                </span>
                <span className="lastly enhanced-3d">3D</span>
                <div className="text-decoration">
                  <div className="sparkle sparkle-1">✨</div>
                  <div className="sparkle sparkle-2">✦</div>
                  <div className="sparkle sparkle-3">✨</div>
                  <div className="hologram-line"></div>
                  
                  {/* Enhanced Touch Trail for Mobile */}
                  {touchTrail.length > 0 && (
                    <div className="touch-trail-container">
                      {touchTrail.map((point, index) => (
                        <div
                          key={point.id}
                          className={`touch-trail-point ${gestureType ? `trail-${gestureType}` : ''}`}
                          style={{
                            left: `${point.x}%`,
                            top: `${point.y}%`,
                            animationDelay: `${index * 0.1}s`,
                            opacity: (index + 1) / touchTrail.length,
                            transform: `scale(${(index + 1) / touchTrail.length})`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Gesture Type Indicator */}
                  {gestureType && (
                    <div className={`gesture-indicator gesture-${gestureType}`}>
                      {gestureType === 'double-tap' && '🎆'}
                      {gestureType === 'long-press' && '⭐'}
                      {gestureType === 'swipe' && '✨'}
                      {gestureType === 'tap' && '💫'}
                    </div>
                  )}
                </div>
              </h1>
              <p className={`lead mb-5 text-white-50 landing-description typewriter ${isLoaded ? 'animate' : ''}`}>
                Professional 3D Artist & Visual Effects Designer
              </p>
              <p className={`mb-5 text-white-50 landing-description ${isLoaded ? 'animate' : ''}`}>
                Creating stunning digital experiences with cutting-edge technology and artistic vision.
              </p>
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

      {/* Floating Enter Portfolio Button - Bottom Left */}
      <Button 
        as={Link} 
        to="/home" 
        variant="light" 
        className={`floating-portfolio-btn rounded-pill px-3 py-2 fw-semibold ${isLoaded ? 'show' : ''}`}
      >
        <span className="button-text">
          {getButtonText('🚀 Enter Portfolio', '🚀 Enter', '🚀')}
        </span>
        <span className="button-overlay"></span>
      </Button>

      {/* Floating View Work Button - Bottom Right */}
      <Button 
        as={Link} 
        to="/portfolio" 
        variant="outline-light" 
        className={`floating-work-btn rounded-pill px-3 py-2 fw-semibold ${isLoaded ? 'show' : ''}`}
      >
        <span className="button-text">
          {getButtonText('👁️ View Work', '👁️ View', '👁️')}
        </span>
        <span className="button-overlay"></span>
      </Button>
    </div>
  );
};

export default LandingPage;