import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Alert, Button, Form, Modal, Badge } from 'react-bootstrap';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  // Get current year for copyright/last updated
  const currentYear = new Date().getFullYear();
  
  // State for tracking viewed sections
  const [viewedSections, setViewedSections] = useState(new Set());
  const [lastViewedSection, setLastViewedSection] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  
  // State for email notification signup
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');
  
  // Refs for section tracking
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  // Section tracking setup
  useEffect(() => {
    // Load viewed sections from localStorage
    const saved = localStorage.getItem('privacy-policy-viewed-sections');
    if (saved) {
      setViewedSections(new Set(JSON.parse(saved)));
    }
    
    const lastViewed = localStorage.getItem('privacy-policy-last-viewed');
    if (lastViewed) {
      setLastViewedSection(lastViewed);
    }

    // Setup Intersection Observer for section tracking
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId) {
              setViewedSections(prev => {
                const newViewed = new Set(prev);
                newViewed.add(sectionId);
                localStorage.setItem('privacy-policy-viewed-sections', JSON.stringify([...newViewed]));
                return newViewed;
              });
              setLastViewedSection(sectionId);
              localStorage.setItem('privacy-policy-last-viewed', sectionId);
            }
          }
        });
        
        // Calculate reading progress
        const visibleSections = entries.filter(entry => entry.isIntersecting).length;
        const totalSections = entries.length;
        setReadingProgress(Math.round((visibleSections / totalSections) * 100));
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle email notification signup
  const handleNotificationSignup = async (e) => {
    e.preventDefault();
    setNotificationStatus('sending');
    
    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would send this to your email service
      console.log('Notification signup:', notificationEmail);
      
      setNotificationStatus('success');
      setNotificationEmail('');
      
      setTimeout(() => {
        setShowNotificationModal(false);
        setNotificationStatus('');
      }, 2000);
    } catch (error) {
      setNotificationStatus('error');
    }
  };

  // Scroll to last viewed section
  const scrollToLastViewed = () => {
    if (lastViewedSection && sectionRefs.current[lastViewedSection]) {
      sectionRefs.current[lastViewedSection].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Register section ref
  const setSectionRef = (sectionId) => (ref) => {
    sectionRefs.current[sectionId] = ref;
  };

  return (
    <Container fluid className="privacy-policy-container py-5">
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${readingProgress}%`,
        height: '4px',
        backgroundColor: '#007bff',
        zIndex: 1000,
        transition: 'width 0.3s ease'
      }}></div>

      <Row className="justify-content-center">
        <Col xs={12} sm={11} md={10} lg={9} xl={8}>
          {/* Last Viewed Section Alert */}
          {lastViewedSection && (
            <Alert variant="info" className="mb-4 d-flex justify-content-between align-items-center">
              <span>Continue reading from where you left off</span>
              <Button variant="outline-info" size="sm" onClick={scrollToLastViewed}>
                Go to Section {lastViewedSection.replace('section-', '')}
              </Button>
            </Alert>
          )}

          {/* Related Documents & Compliance */}
          <Card className="mb-4 related-documents-card">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col md={8}>
                  <h6 className="mb-2">Related Documents & Compliance</h6>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge bg="primary" className="me-2">
                      <i className="fas fa-file-contract me-1"></i>
                      Terms of Service
                    </Badge>
                    <Badge bg="secondary" className="me-2">
                      <i className="fas fa-cookie-bite me-1"></i>
                      Cookie Policy
                    </Badge>
                    <Badge bg="success" className="me-2">
                      <i className="fas fa-shield-alt me-1"></i>
                      GDPR Compliant
                    </Badge>
                    <Badge bg="info" className="me-2">
                      <i className="fas fa-balance-scale me-1"></i>
                      CCPA Ready
                    </Badge>
                  </div>
                </Col>
                <Col md={4} className="text-md-end mt-2 mt-md-0">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setShowNotificationModal(true)}
                  >
                    <i className="fas fa-bell me-1"></i>
                    Get Updates
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="privacy-card shadow-sm">
            <Card.Body className="p-3 p-sm-4 p-md-5">
              <div className="privacy-header text-center mb-4 mb-md-5">
                <h1 className="privacy-title">Privacy Policy</h1>
                <p className="privacy-updated text-muted">
                  Effective Date: September 4, {currentYear} | Last Updated: September 4, {currentYear}
                </p>
              </div>

              <Alert variant="info" className="mb-4">
                <Alert.Heading>Important Notice</Alert.Heading>
                By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with these terms, please discontinue use of this website immediately.
              </Alert>

              <div className="policy-content">
                <section 
                  className="policy-section mb-4 mb-md-5" 
                  id="section-1" 
                  ref={setSectionRef('section-1')}
                >
                  <h2 className="section-title">
                    1. Introduction and Scope
                    {viewedSections.has('section-1') && (
                      <Badge bg="success" className="ms-2 fs-6">
                        <i className="fas fa-check"></i> Read
                      </Badge>
                    )}
                  </h2>
                  <p className="section-text">
                    This Privacy Policy ("Policy") describes how Colin Nebula ("we", "us", "our", "Company", or "Data Controller") 
                    collects, processes, uses, stores, and discloses personal information when you visit or interact with our portfolio 
                    website located at <strong>colinnebula.github.io/colin-nebula-3d-portfolio</strong> (the "Website" or "Service").
                  </p>
                  <p className="section-text">
                    We are committed to protecting and respecting your privacy in accordance with applicable data protection laws, 
                    including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), where applicable.
                  </p>
                </section>

                <section 
                  className="policy-section mb-4 mb-md-5" 
                  id="section-2" 
                  ref={setSectionRef('section-2')}
                >
                  <h2 className="section-title">
                    2. Information We Collect
                    {viewedSections.has('section-2') && (
                      <Badge bg="success" className="ms-2 fs-6">
                        <i className="fas fa-check"></i> Read
                      </Badge>
                    )}
                  </h2>
                  
                  <div className="subsection mb-4">
                    <h3 className="subsection-title">2.1 Information You Provide Directly</h3>
                    <p className="section-text">We may collect personal information that you voluntarily provide to us, including:</p>
                    <ul className="policy-list">
                      <li className="list-item">
                        <strong>Contact Information:</strong> Name, email address, phone number, and mailing address when you contact us
                      </li>
                      <li className="list-item">
                        <strong>Communication Data:</strong> Messages, inquiries, feedback, project requests, and any other information you choose to provide
                      </li>
                      <li className="list-item">
                        <strong>Subscription Data:</strong> Email address and preferences when subscribing to updates or newsletters
                      </li>
                      <li className="list-item">
                        <strong>Professional Information:</strong> Company name, job title, and project requirements for business inquiries
                      </li>
                    </ul>
                  </div>

                  <div className="subsection mb-4">
                    <h3 className="subsection-title">2.2 Information Collected Automatically</h3>
                    <p className="section-text">When you visit our Website, we automatically collect certain technical information:</p>
                    <ul className="policy-list">
                      <li className="list-item">
                        <strong>Technical Data:</strong> IP address, browser type and version, operating system, device identifiers, 
                        time zone settings, browser plug-in types and versions
                      </li>
                      <li className="list-item">
                        <strong>Usage Data:</strong> Information about how you use our Website, including pages visited, time spent, 
                        referring websites, search terms, and interaction patterns
                      </li>
                      <li className="list-item">
                        <strong>Performance Data:</strong> Website performance metrics, error logs, and diagnostic information
                      </li>
                      <li className="list-item">
                        <strong>Location Data:</strong> General geographic location derived from IP address (country/region level)
                      </li>
                    </ul>
                  </div>

                  <div className="subsection">
                    <h3 className="subsection-title">2.3 Information from Third Parties</h3>
                    <p className="section-text">We may receive information about you from third-party services such as:</p>
                    <ul className="policy-list">
                      <li className="list-item">Analytics providers (Google Analytics)</li>
                      <li className="list-item">Email service providers (EmailJS)</li>
                      <li className="list-item">Hosting and content delivery network providers</li>
                      <li className="list-item">Social media platforms (if you interact with our content)</li>
                    </ul>
                  </div>
                </section>

                <section 
                  className="policy-section mb-4 mb-md-5" 
                  id="section-3" 
                  ref={setSectionRef('section-3')}
                >
                  <h2 className="section-title">
                    3. Legal Basis for Processing
                    {viewedSections.has('section-3') && (
                      <Badge bg="success" className="ms-2 fs-6">
                        <i className="fas fa-check"></i> Read
                      </Badge>
                    )}
                  </h2>
                  <p className="section-text">We process your personal information under the following legal bases:</p>
                  <ul className="policy-list">
                    <li className="list-item">
                      <strong>Legitimate Interest:</strong> To operate and improve our Website, analyze usage patterns, and protect against fraud
                    </li>
                    <li className="list-item">
                      <strong>Consent:</strong> When you provide explicit consent for specific processing activities (e.g., newsletter subscriptions)
                    </li>
                    <li className="list-item">
                      <strong>Contractual Necessity:</strong> To respond to your inquiries and provide requested information or services
                    </li>
                    <li className="list-item">
                      <strong>Legal Compliance:</strong> To comply with applicable laws and regulatory requirements
                    </li>
                  </ul>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">4. How We Use Your Information</h2>
                  <p className="section-text">We process your personal information for the following purposes:</p>
                  
                  <div className="subsection mb-3">
                    <h3 className="subsection-title">4.1 Service Provision</h3>
                    <ul className="policy-list">
                      <li className="list-item">Provide, operate, and maintain our Website and services</li>
                      <li className="list-item">Respond to your inquiries, comments, and requests</li>
                      <li className="list-item">Process and fulfill service requests or project consultations</li>
                    </ul>
                  </div>

                  <div className="subsection mb-3">
                    <h3 className="subsection-title">4.2 Communication and Marketing</h3>
                    <ul className="policy-list">
                      <li className="list-item">Send portfolio updates, newsletters, and promotional materials (with consent)</li>
                      <li className="list-item">Notify you about changes to our services or policies</li>
                      <li className="list-item">Provide customer support and technical assistance</li>
                    </ul>
                  </div>

                  <div className="subsection">
                    <h3 className="subsection-title">4.3 Analytics and Improvement</h3>
                    <ul className="policy-list">
                      <li className="list-item">Analyze Website usage and user behavior to improve user experience</li>
                      <li className="list-item">Monitor and analyze trends, usage patterns, and activities</li>
                      <li className="list-item">Detect, prevent, and address technical issues and security threats</li>
                    </ul>
                  </div>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">5. Cookies and Tracking Technologies</h2>
                  <div className="subsection mb-3">
                    <h3 className="subsection-title">5.1 Types of Cookies We Use</h3>
                    <ul className="policy-list">
                      <li className="list-item">
                        <strong>Essential Cookies:</strong> Necessary for basic website functionality and security
                      </li>
                      <li className="list-item">
                        <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Website
                      </li>
                      <li className="list-item">
                        <strong>Functional Cookies:</strong> Remember your preferences and settings
                      </li>
                      <li className="list-item">
                        <strong>Performance Cookies:</strong> Collect information about Website performance and errors
                      </li>
                    </ul>
                  </div>
                  <div className="subsection">
                    <h3 className="subsection-title">5.2 Managing Cookies</h3>
                    <p className="section-text">
                      You can control cookies through your browser settings. However, disabling certain cookies may limit 
                      Website functionality. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
                    </p>
                  </div>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">6. Data Sharing and Disclosure</h2>
                  <p className="section-text">We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
                  <ul className="policy-list">
                    <li className="list-item">
                      <strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our Website (hosting, analytics, email services)
                    </li>
                    <li className="list-item">
                      <strong>Legal Compliance:</strong> When required by law, court order, or government request
                    </li>
                    <li className="list-item">
                      <strong>Business Protection:</strong> To protect our rights, property, or safety, or that of our users
                    </li>
                    <li className="list-item">
                      <strong>Consent:</strong> With your explicit consent for specific sharing purposes
                    </li>
                  </ul>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">7. Data Security and Protection</h2>
                  <p className="section-text">
                    We implement industry-standard security measures to protect your personal information, including:
                  </p>
                  <ul className="policy-list">
                    <li className="list-item">Encryption of data in transit and at rest</li>
                    <li className="list-item">Regular security assessments and updates</li>
                    <li className="list-item">Access controls and authentication procedures</li>
                    <li className="list-item">Secure hosting and infrastructure</li>
                  </ul>
                  <p className="section-text">
                    However, no method of transmission over the Internet or electronic storage is 100% secure. 
                    While we strive to protect your personal information, we cannot guarantee absolute security.
                  </p>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">8. Data Retention</h2>
                  <p className="section-text">
                    We retain personal information only for as long as necessary to fulfill the purposes outlined in this Policy, 
                    unless a longer retention period is required by law. Specific retention periods include:
                  </p>
                  <ul className="policy-list">
                    <li className="list-item">Contact inquiries: 3 years from last communication</li>
                    <li className="list-item">Newsletter subscriptions: Until you unsubscribe</li>
                    <li className="list-item">Analytics data: 26 months (Google Analytics default)</li>
                    <li className="list-item">Technical logs: 90 days</li>
                  </ul>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">9. Your Rights and Choices</h2>
                  <p className="section-text">Depending on your jurisdiction, you may have the following rights:</p>
                  <ul className="policy-list">
                    <li className="list-item">
                      <strong>Access:</strong> Request access to your personal information we hold
                    </li>
                    <li className="list-item">
                      <strong>Rectification:</strong> Request correction of inaccurate or incomplete information
                    </li>
                    <li className="list-item">
                      <strong>Erasure:</strong> Request deletion of your personal information ("right to be forgotten")
                    </li>
                    <li className="list-item">
                      <strong>Portability:</strong> Request transfer of your data in a structured, machine-readable format
                    </li>
                    <li className="list-item">
                      <strong>Restriction:</strong> Request limitation of processing under certain circumstances
                    </li>
                    <li className="list-item">
                      <strong>Objection:</strong> Object to processing based on legitimate interests
                    </li>
                    <li className="list-item">
                      <strong>Withdraw Consent:</strong> Withdraw consent for processing where applicable
                    </li>
                  </ul>
                  <p className="section-text">
                    To exercise these rights, please contact us using the information provided below. We will respond within 30 days.
                  </p>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">10. International Data Transfers</h2>
                  <p className="section-text">
                    Your information may be transferred to and processed in countries other than your country of residence. 
                    We ensure appropriate safeguards are in place for such transfers, including adequacy decisions or 
                    standard contractual clauses approved by relevant authorities.
                  </p>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">11. Children's Privacy</h2>
                  <p className="section-text">
                    Our Website is not intended for individuals under 16 years of age. We do not knowingly collect personal 
                    information from children under 16. If you are a parent or guardian and believe your child has provided 
                    us with personal information, please contact us immediately, and we will take steps to remove such information.
                  </p>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">12. Third-Party Links and Services</h2>
                  <p className="section-text">
                    Our Website may contain links to third-party websites or services. This Privacy Policy does not apply to 
                    such third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
                  </p>
                </section>

                <section className="policy-section mb-4 mb-md-5">
                  <h2 className="section-title">13. Changes to This Privacy Policy</h2>
                  <p className="section-text">
                    We reserve the right to update this Privacy Policy at any time. Material changes will be communicated through:
                  </p>
                  <ul className="policy-list">
                    <li className="list-item">Prominent notice on our Website</li>
                    <li className="list-item">Email notification to registered users</li>
                    <li className="list-item">Updated "Last Modified" date at the top of this Policy</li>
                  </ul>
                  <p className="section-text">
                    Your continued use of our Website after any changes constitutes acceptance of the updated Policy.
                  </p>
                </section>

                <section className="policy-section">
                  <h2 className="section-title">14. Contact Information</h2>
                  <p className="section-text">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                    please contact us:
                  </p>
                  <div className="contact-info bg-light p-4 rounded">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <p className="mb-2">
                          <strong>Data Controller:</strong><br />
                          Colin Nebula<br />
                          3D Artist & Digital Creator
                        </p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <p className="mb-2">
                          <strong>Email:</strong><br />
                          <a href="mailto:colinnebula@gmail.com" className="text-decoration-none">
                            colinnebula@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <p className="mb-0">
                          <strong>Website:</strong><br />
                          <a href="https://colinnebula.github.io/colin-nebula-3d-portfolio/" className="text-decoration-none">
                            colinnebula.github.io/colin-nebula-3d-portfolio
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-warning bg-opacity-10 border border-warning rounded">
                    <p className="mb-0">
                      <strong>Response Time:</strong> We will respond to your privacy-related inquiries within 30 days. 
                      For urgent matters, please indicate "URGENT - Privacy Request" in your subject line.
                    </p>
                  </div>
                </section>
              </div>
            </Card.Body>
          </Card>

          {/* Reading Progress Summary */}
          <Card className="mt-4 progress-summary-card">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col md={8}>
                  <h6 className="mb-1">Reading Progress</h6>
                  <p className="mb-0 text-muted">
                    You've viewed {viewedSections.size} of 14 sections ({Math.round((viewedSections.size / 14) * 100)}% complete)
                  </p>
                </Col>
                <Col md={4} className="text-md-end mt-2 mt-md-0">
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(viewedSections.size / 14) * 100}%` }}
                    ></div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Email Notification Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-bell me-2"></i>
            Privacy Policy Updates
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Stay informed about changes to our Privacy Policy. We'll only send notifications 
            when there are material updates that affect your privacy rights.
          </p>
          
          <Form onSubmit={handleNotificationSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                required
                disabled={notificationStatus === 'sending'}
              />
              <Form.Text className="text-muted">
                We respect your privacy and will never share your email with third parties.
              </Form.Text>
            </Form.Group>

            {notificationStatus === 'success' && (
              <Alert variant="success">
                <i className="fas fa-check-circle me-2"></i>
                Successfully subscribed! You'll receive notifications about policy updates.
              </Alert>
            )}

            {notificationStatus === 'error' && (
              <Alert variant="danger">
                <i className="fas fa-exclamation-triangle me-2"></i>
                There was an error signing up. Please try again.
              </Alert>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setShowNotificationModal(false)}
                disabled={notificationStatus === 'sending'}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={notificationStatus === 'sending' || !notificationEmail}
              >
                {notificationStatus === 'sending' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-envelope me-2"></i>
                    Subscribe
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PrivacyPolicy;
