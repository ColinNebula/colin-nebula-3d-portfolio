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
  FaMapMarkerAlt
} from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/colinnebula',
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
      <Container>
        {/* Main Footer Content */}
        <Row className="footer-main">
          {/* Brand & About Section */}
          <Col lg={5} md={6} sm={12} className="mb-4 mb-lg-0">
            <div className="footer-brand">
              <h3 className="brand-title">Colin Nebula 3D</h3>
              <p className="brand-tagline">Digital Artist & Creative Technologist</p>
              <p className="brand-description">
                Crafting immersive 3D experiences through innovative modeling, 
                animation, and visual effects. Transforming ideas into stunning 
                digital realities with cutting-edge technology and artistic vision.
              </p>
              
              {/* Social Media Links */}
              <div className="social-section">
                <h6 className="social-title">Connect With Me</h6>
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
            </div>
          </Col>

          {/* Navigation Links */}
          <Col lg={2} md={3} sm={6} xs={12} className="mb-4 mb-lg-0">
            <div className="footer-section">
              <h6>Portfolio</h6>
              <ul className="footer-nav">
                <li><a href="#3d-models">3D Models</a></li>
                <li><a href="#animations">Animations</a></li>
                <li><a href="#visual-effects">Visual Effects</a></li>
                <li><a href="#artwork">Digital Artwork</a></li>
                <li><a href="#video-editing">Video Editing</a></li>
              </ul>
            </div>
          </Col>

          {/* Services */}
          <Col lg={2} md={3} sm={6} xs={12} className="mb-4 mb-lg-0">
            <div className="footer-section">
              <h6>Services</h6>
              <ul className="footer-nav">
                <li><a href="#3d-modeling">3D Modeling</a></li>
                <li><a href="#character-design">Character Design</a></li>
                <li><a href="#motion-graphics">Motion Graphics</a></li>
                <li><a href="#product-visualization">Product Viz</a></li>
                <li><a href="#consulting">Consulting</a></li>
              </ul>
            </div>
          </Col>

          {/* Contact & CTA */}
          <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
            <div className="footer-section">
              <h6>Contact</h6>
              <div className="contact-details">
                <div className="contact-item">
                  <FaEnvelope />
                  <span>colin@colinnebula.com</span>
                </div>
                <div className="contact-item">
                  <FaPhone />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>Los Angeles, CA</span>
                </div>
              </div>
              
              <div className="footer-cta">
                <button className="btn btn-primary">
                  Start Your Project
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="footer-bottom">
          <Col md={6}>
            <p>&copy; 2025 Colin Nebula 3D. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>
              <a href="#privacy" className="text-decoration-none me-3">Privacy Policy</a>
              <a href="#terms" className="text-decoration-none">Terms of Service</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;