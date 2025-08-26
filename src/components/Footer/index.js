import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaGithub, 
  FaLinkedin, 
  FaYoutube, 
  FaTwitter, 
  FaInstagram, 
  FaBehance, 
  FaArtstation, 
  FaEnvelope, 
  FaHome, 
  FaHeart 
} from "react-icons/fa";
import './Footer.css';

function Footer({ setCurrentTab }) {
    const year = new Date().getFullYear();

    // Social media links with icons and labels
    const socialLinks = [
        { icon: <FaGithub />, label: 'GitHub', url: 'https://github.com/ColinNebula', color: '#333' },
        { icon: <FaLinkedin />, label: 'LinkedIn', url: 'https://www.linkedin.com/in/colin-nebula-07176022/', color: '#0077b5' },
        { icon: <FaYoutube />, label: 'YouTube', url: 'https://www.youtube.com/', color: '#ff0000' },
        { icon: <FaTwitter />, label: 'Twitter', url: 'https://twitter.com/', color: '#1da1f2' },
        { icon: <FaInstagram />, label: 'Instagram', url: 'https://www.instagram.com/', color: '#e1306c' },
        { icon: <FaBehance />, label: 'Behance', url: 'https://www.behance.net/', color: '#053eff' },
        { icon: <FaArtstation />, label: 'ArtStation', url: 'https://www.artstation.com/', color: '#13aff0' },
    ];

    return (
        <footer className="footer-container">
            <Container>
                <Row className="py-4">
                    {/* About Section */}
                    <Col lg={4} md={6} className="mb-4 mb-md-0">
                        <h5 className="footer-heading">About Colin Nebula</h5>
                        <p className="footer-text">
                            Professional 3D artist and developer specializing in creating immersive digital experiences.
                            Blending technical expertise with artistic vision for compelling visual narratives.
                        </p>
                        <div className="footer-contact mt-3">
                            <div className="d-flex align-items-center mb-2">
                                <FaEnvelope className="me-2" />
                                <a href="mailto:colinnebula@gmail.com" className="footer-link">colinnebula@gmail.com</a>
                            </div>
                        </div>
                    </Col>
                    
                    {/* Quick Links */}
                    <Col lg={3} md={6} className="mb-4 mb-md-0">
                        <h5 className="footer-heading">Quick Links</h5>
                        <ul className="footer-links">
                            <li><a href="/" className="footer-link"><FaHome className="me-2" />Home</a></li>
                            <li><a href="#portfolio" className="footer-link">Portfolio</a></li>
                            <li><a href="#artwork" className="footer-link">Artwork</a></li>
                            <li><a href="#animation" className="footer-link">Animation</a></li>
                            <li><a href="#video-editing" className="footer-link">VFX/Video Editing</a></li>
                            <li><a href="#resume" className="footer-link">Resume</a></li>
                            <li>
                              <a 
                                href="#updates"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentTab("updates");
                                  window.scrollTo(0, 0);
                                }}
                                className="footer-link"
                              >
                                Updates
                              </a>
                            </li>
                        </ul>
                    </Col>
                    
                    {/* Social Media */}
                    <Col lg={5} md={12}>
                        <h5 className="footer-heading">Connect With Me</h5>
                        <div className="social-icons">
                            {socialLinks.map((social, index) => (
                                <a 
                                    key={index} 
                                    href={social.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="social-icon" 
                                    aria-label={social.label}
                                    title={social.label}
                                    style={{ '--hover-color': social.color }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </Col>
                </Row>
                
                {/* Copyright bar */}
                <Row>
                    <Col className="text-center py-3 copyright-bar">
                        <p className="mb-0">
                            &copy; {year} Colin Nebula. All rights reserved. Made with <FaHeart className="heart-icon" /> in USA
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;