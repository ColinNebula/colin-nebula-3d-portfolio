import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaArrowUp
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/ColinNebula',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com/in/colinnebula',
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: 'https://twitter.com/colinnebula',
      color: '#1da1f2'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://instagram.com/colinnebula',
      color: '#e4405f'
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      url: 'https://youtube.com/@colinnebula',
      color: '#ff0000'
    }
  ];

  return (
    <footer className="professional-footer">
      <Container fluid>
        {/* Main Footer Content */}
        <Row className="footer-main g-4">
          {/* About Section */}
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-section">
              <h5 className="footer-title">Colin Nebula 3D</h5>
              <p className="footer-description">
                Professional 3D Artist and Computer Enthusiast specializing in 
                3D modeling, animation, and visual effects. Creating stunning 
                digital experiences with cutting-edge technology.
              </p>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={`Visit ${social.name} profile`}
                    title={social.name}
                    style={{ '--hover-color': social.color }}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-subtitle">Quick Links</h6>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/portfolio">Portfolio</a></li>
                <li><a href="/artwork">Artwork</a></li>
                <li><a href="/animation">Animation</a></li>
                <li><a href="/video-editing">VFX</a></li>
                <li><a href="/resume">Resume</a></li>
              </ul>
            </div>
          </Col>

          {/* Services */}
          <Col lg={3} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-subtitle">Services</h6>
              <ul className="footer-links">
                <li><a href="#3d-modeling">3D Modeling</a></li>
                <li><a href="#animation">Animation</a></li>
                <li><a href="#vfx">Visual Effects</a></li>
                <li><a href="#texturing">Texturing</a></li>
                <li><a href="#rendering">Rendering</a></li>
                <li><a href="#consultation">Consultation</a></li>
              </ul>
            </div>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-subtitle">Get In Touch</h6>
              <div className="contact-info">
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:colinnebula@gmail.com">colinnebula@gmail.com</a>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Available Worldwide</span>
                </div>
              </div>
              
              {/* Back to Top Button */}
              <button 
                className="back-to-top-btn"
                onClick={scrollToTop}
                aria-label="Back to top"
                title="Back to top"
              >
                <FaArrowUp />
              </button>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="footer-bottom g-0">
          <Col lg={6} md={12} className="text-center text-lg-start mb-2 mb-lg-0">
            <p className="copyright">
              © {currentYear} Colin Nebula 3D. All rights reserved.
            </p>
          </Col>
          <Col lg={6} md={12} className="text-center text-lg-end">
            <div className="footer-bottom-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="/terms">Terms of Service</a>
              <span className="separator">•</span>
              <span className="made-with">
                Made with <FaHeart className="heart-icon" /> using React
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;