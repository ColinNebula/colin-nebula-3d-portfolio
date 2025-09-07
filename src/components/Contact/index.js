import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaPaperPlane, FaCheckCircle, FaInfoCircle, FaShare, FaHandshake } from 'react-icons/fa';
import './Contact.css';
import { validateEmail } from '../../utils/helpers';

function ContactForm() {
  const [formState, setFormState] = useState({ 
    name: '', 
    email: '', 
    subject: '',
    message: '',
    phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState('light');
  
  const { name, email, subject, message, phone } = formState;

  // Get theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(savedTheme || systemTheme);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validate form
    if (!name.trim()) {
      setErrorMessage('Name is required.');
      setIsSubmitting(false);
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email is required.');
      setIsSubmitting(false);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Message is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success simulation
      console.log('Contact form submitted:', formState);
      setSuccessMessage('Thank you for your message! I\'ll get back to you soon.');
      setFormState({ name: '', email: '', subject: '', message: '', phone: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormState({ ...formState, [fieldName]: value });
    
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="contact-icon" />,
      title: "Email",
      value: "colin@nebula3d.com",
      link: "mailto:colin@nebula3d.com"
    },
    {
      icon: <FaPhone className="contact-icon" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <FaMapMarkerAlt className="contact-icon" />,
      title: "Location",
      value: "San Francisco, CA",
      link: "https://maps.google.com"
    }
  ];

  const socialLinks = [
    {
      icon: <FaLinkedin />,
      name: "LinkedIn",
      url: "https://linkedin.com/in/colin-nebula",
      color: "#0077b5"
    },
    {
      icon: <FaGithub />,
      name: "GitHub", 
      url: "https://github.com/colin-nebula",
      color: theme === 'dark' ? "#fff" : "#333"
    },
    {
      icon: <FaTwitter />,
      name: "Twitter",
      url: "https://twitter.com/colin_nebula",
      color: "#1da1f2"
    }
  ];

  return (
    <div className={`contact-page-wrapper ${theme}`}>
      <div className="contact-page-content">
        <Container className="py-5">
          {/* Header Section */}
          <Row className="mb-5">
            <Col>
              <div className="text-center">
                <h1 className="display-4 fw-bold mb-3 contact-title">Get In Touch</h1>
                <p className="lead contact-subtitle">
                  Have a project in mind? Let's discuss how we can bring your ideas to life.
                </p>
              </div>
            </Col>
          </Row>

          <Row className="g-3 g-lg-4">
            {/* Contact Form */}
            <Col lg={8} className="order-2 order-lg-1">
              <Card className={`contact-card shadow-lg h-100 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white'}`}>
                <Card.Body className="p-3 p-md-4">
                  <h3 className="mb-3 mb-md-4 d-flex align-items-center">
                    <FaPaperPlane className="me-2 text-primary" />
                    <span className="d-none d-sm-inline">Send a Message</span>
                    <span className="d-sm-none">Message</span>
                  </h3>
                  
                  {errorMessage && (
                    <Alert variant="danger" className="mb-3">
                      {errorMessage}
                    </Alert>
                  )}
                  
                  {successMessage && (
                    <Alert variant="success" className="mb-3">
                      <FaCheckCircle className="me-2" />
                      {successMessage}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-2 g-md-3">
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-2 g-md-3">
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Subject</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={subject}
                            onChange={handleChange}
                            placeholder="Project discussion, etc."
                            className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>Message *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={message}
                        onChange={handleChange}
                        placeholder="Tell me about your project, ideas, or how I can help you..."
                        className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                        required
                        style={{ minHeight: '120px', resize: 'vertical' }}
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-100 contact-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          <span className="d-none d-sm-inline">Sending Message...</span>
                          <span className="d-sm-none">Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="me-2" />
                          <span className="d-none d-sm-inline">Send Message</span>
                          <span className="d-sm-none">Send</span>
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Info Sidebar */}
            <Col lg={4} className="order-1 order-lg-2">
              <div className="contact-sidebar">
                {/* Contact Information */}
                <Card className={`contact-card shadow-lg mb-3 mb-lg-4 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white'}`}>
                  <Card.Body className="p-3 p-lg-4">
                    <h4 className="mb-3 mb-lg-4 d-flex align-items-center">
                      <FaInfoCircle className="me-2 text-primary d-lg-none" size={20} />
                      <span className="d-none d-sm-inline">Contact Information</span>
                      <span className="d-sm-none">Contact Info</span>
                    </h4>
                    {contactInfo.map((info, index) => (
                      <div key={index} className="contact-info-item mb-2 mb-lg-3">
                        <div className="d-flex align-items-start">
                          <div className="contact-icon-wrapper me-2 me-lg-3 flex-shrink-0">
                            {info.icon}
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="mb-1 small fw-medium">{info.title}</h6>
                            <a 
                              href={info.link} 
                              className="text-decoration-none contact-link small text-break"
                              target={info.link.startsWith('http') ? '_blank' : '_self'}
                              rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                            >
                              {info.value}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                {/* Social Links */}
                <Card className={`contact-card shadow-lg mb-3 mb-lg-4 ${theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white'}`}>
                  <Card.Body className="p-3 p-lg-4">
                    <h4 className="mb-3 mb-lg-4 d-flex align-items-center">
                      <FaShare className="me-2 text-primary d-lg-none" size={20} />
                      <span className="d-none d-sm-inline">Connect With Me</span>
                      <span className="d-sm-none">Social</span>
                    </h4>
                    <div className="social-links">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link d-flex align-items-center"
                          style={{ '--social-color': social.color }}
                          title={social.name}
                        >
                          <span className="social-icon me-2 flex-shrink-0">{social.icon}</span>
                          <span className="social-name text-truncate">
                            <span className="d-none d-sm-inline">{social.name}</span>
                            <span className="d-sm-none">{social.name.split(' ')[0]}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Call to Action */}
                <Card className="contact-card cta-card shadow-lg">
                  <Card.Body className="p-3 p-lg-4 text-center text-white">
                    <FaHandshake className="mb-2 mb-lg-3" size={24} />
                    <h5 className="mb-2 mb-lg-3">
                      <span className="d-none d-sm-inline">Ready to Start?</span>
                      <span className="d-sm-none">Let's Start!</span>
                    </h5>
                    <p className="mb-2 mb-lg-3 opacity-75 small">
                      <span className="d-none d-sm-inline">
                        Let's turn your vision into reality with cutting-edge 3D design and development.
                      </span>
                      <span className="d-sm-none">
                        Turn your vision into reality!
                      </span>
                    </p>
                    <Button variant="outline-light" size="sm" href="/portfolio">
                      <span className="d-none d-sm-inline">View Portfolio</span>
                      <span className="d-sm-none">Portfolio</span>
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

          {/* Additional Info */}
          <Row className="mt-5">
            <Col>
              <div className="text-center">
                <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                  <strong>Response Time:</strong> I typically respond within 24 hours. 
                  For urgent inquiries, please call directly.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ContactForm;
