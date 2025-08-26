import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import maskU from '../../assets/images/maskU.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

function Landing() {
    const [loaded, setLoaded] = useState(false);
    const [animateTitle, setAnimateTitle] = useState(false);

    // Trigger animations after component mounts
    useEffect(() => {
        const timer1 = setTimeout(() => setLoaded(true), 100);
        const timer2 = setTimeout(() => setAnimateTitle(true), 600);
        
        // Cleanup timers
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className={`landing-page ${loaded ? 'loaded' : ''}`}>
            <Container fluid className="landing-container">
                <Row className="landing-content">
                    <Col md={7} className="landing-text-col">
                        <div className="landing-text-wrapper">
                            <h1 className={`landing-title ${animateTitle ? 'animate' : ''}`}>
                                Welcome <span className="welcome-accent">to</span> my online,
                                <br />
                                <span className="lastly">3D Portfolio</span>
                            </h1>
                            
                            <div className={`landing-description ${animateTitle ? 'animate' : ''}`}>
                                <p>Explore the world of 3D design, modeling, and visual effects created by Colin Nebula.</p>
                                <p>Immerse yourself in creative digital art and innovative visual experiences.</p>
                            </div>
                            
                            <div className={`landing-cta ${animateTitle ? 'animate' : ''}`}>
                                <Link to="/home" className="main-cta-link">
                                    <Button variant="primary" size="lg" className="landing-button">
                                        Explore Portfolio
                                    </Button>
                                </Link>
                                <Link to="/about" className="secondary-cta-link">
                                    <Button variant="outline-light" size="lg" className="landing-button ms-3">
                                        About Me
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    
                    <Col md={5} className="landing-logo-col d-flex align-items-center justify-content-center">
                        <div className="logo-container">
                            <Link to="/home" className="logo-link" aria-label="Go to portfolio home">
                                <img 
                                    className={`landing-logo ${loaded ? 'loaded' : ''}`} 
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
}

export default Landing;