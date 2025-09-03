import React, { useState } from 'react';
import { Container, Row, Col, Modal, Form, Button, Alert } from 'react-bootstrap';
import { 
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBell,
  FaCheck
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { emailjsConfig, createEmailTemplate } from '../../utils/emailConfig';
import './Footer.css';

function Footer() {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeForm, setSubscribeForm] = useState({
    name: '',
    email: ''
  });
  const [subscribeStatus, setSubscribeStatus] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!subscribeForm.name.trim() || !subscribeForm.email.trim()) {
      setSubscribeStatus('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeForm.email)) {
      setSubscribeStatus('Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);
    setSubscribeStatus('');

    try {
      // Check if already subscribed
      const subscribers = JSON.parse(localStorage.getItem('portfolio_subscribers') || '[]');
      if (subscribers.includes(subscribeForm.email)) {
        setSubscribeStatus('You are already subscribed to updates!');
        setIsSubscribing(false);
        return;
      }

      // Create email template
      const templateParams = createEmailTemplate(subscribeForm.name, subscribeForm.email);

      // Send email via EmailJS
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.publicKey
      );

      // Save to localStorage
      subscribers.push(subscribeForm.email);
      localStorage.setItem('portfolio_subscribers', JSON.stringify(subscribers));
      
      // Success
      setSubscribeStatus('🎉 Thank you for subscribing! Check your email for a welcome message.');
      setSubscribeForm({ name: '', email: '' });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowSubscribeModal(false);
        setSubscribeStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('There was an error processing your subscription. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubscribeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
                  <span>colinnebula@gmail.com</span>
                </div>
                <div className="contact-item">
                  <FaPhone />
                  <span>+1 (416) 856-5764</span>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>Toronto ON, Canada</span>
                </div>
              </div>
              
              <div className="footer-cta">
                <button 
                  className="btn btn-primary subscribe-btn"
                  onClick={() => setShowSubscribeModal(true)}
                >
                  <FaBell className="me-2" />
                  Subscribe to Updates
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Subscription Modal */}
        <Modal 
          show={showSubscribeModal} 
          onHide={() => setShowSubscribeModal(false)}
          centered
          className="subscribe-modal"
        >
          <Modal.Header closeButton className="subscribe-modal-header">
            <Modal.Title>
              <FaBell className="me-2" />
              Subscribe to Updates
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="subscribe-modal-body">
            <div className="subscribe-intro">
              <p>Stay updated with my latest 3D projects, tutorials, and creative insights!</p>
              <ul className="subscribe-benefits">
                <li><FaCheck className="me-2" />Latest project updates</li>
                <li><FaCheck className="me-2" />Behind-the-scenes content</li>
                <li><FaCheck className="me-2" />Exclusive tutorials</li>
                <li><FaCheck className="me-2" />Creative process insights</li>
              </ul>
            </div>
            
            {subscribeStatus && (
              <Alert 
                variant={subscribeStatus.includes('🎉') ? 'success' : 'danger'}
                className="subscribe-alert"
              >
                {subscribeStatus}
              </Alert>
            )}
            
            <Form onSubmit={handleSubscribe}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={subscribeForm.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  disabled={isSubscribing}
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={subscribeForm.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  disabled={isSubscribing}
                />
              </Form.Group>
              
              <div className="d-grid">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  disabled={isSubscribing}
                  className="subscribe-submit-btn"
                >
                  {isSubscribing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <FaBell className="me-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

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