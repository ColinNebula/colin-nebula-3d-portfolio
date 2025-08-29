import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  // Get current year for copyright/last updated
  const currentYear = new Date().getFullYear();

  return (
    <Container className="privacy-policy-container py-5">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="privacy-card">
            <Card.Body className="p-4 p-md-5">
              <h1 className="privacy-title text-center mb-4">Privacy Policy</h1>
              <p className="privacy-updated text-muted text-center mb-5">
                Last Updated: {currentYear}
              </p>

              <section className="policy-section">
                <h2>Introduction</h2>
                <p>
                  This Privacy Policy describes how Colin Nebula ("we", "us", or "our") collects, uses, and discloses your 
                  information when you visit this portfolio website. We respect your privacy and are committed to protecting your 
                  personal data.
                </p>
              </section>

              <section className="policy-section">
                <h2>Information We Collect</h2>
                <p>
                  When you visit our website, we may collect certain information automatically, including:
                </p>
                <ul>
                  <li>
                    <strong>Usage Data:</strong> Including your IP address, browser type, referring/exit pages,
                    operating system, date/time stamps, and clickstream data
                  </li>
                  <li>
                    <strong>Device Information:</strong> Including device type, model, and screen resolution
                  </li>
                </ul>
                <p>
                  If you contact us through the website or subscribe to updates, we may also collect:
                </p>
                <ul>
                  <li>
                    <strong>Personal Information:</strong> Such as your name and email address
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Including any messages or feedback you provide
                  </li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul>
                  <li>To provide and maintain our website</li>
                  <li>To notify you about changes to our services or portfolio</li>
                  <li>To respond to your inquiries and communication</li>
                  <li>To analyze usage patterns and improve user experience</li>
                  <li>To send you portfolio updates when requested</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>Cookies and Tracking Technologies</h2>
                <p>
                  We may use cookies, web beacons, and similar tracking technologies to collect information about your
                  browsing activities. These technologies help us analyze website traffic and enhance your experience.
                </p>
                <p>
                  You can set your browser to refuse all or some browser cookies or to alert you when websites set or access 
                  cookies. If you disable or refuse cookies, some parts of this website may become inaccessible or not function properly.
                </p>
              </section>

              <section className="policy-section">
                <h2>Third-Party Services</h2>
                <p>
                  Our website may use third-party services such as Google Analytics, hosting providers, and content delivery networks. 
                  These services may collect information sent by your browser as part of their operations. Their use of your information 
                  is governed by their respective privacy policies.
                </p>
              </section>

              <section className="policy-section">
                <h2>Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information from unauthorized access,
                  alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
                  storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="policy-section">
                <h2>Your Rights</h2>
                <p>Depending on your location, you may have the following rights regarding your data:</p>
                <ul>
                  <li>The right to access information we hold about you</li>
                  <li>The right to request correction of your personal information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to withdraw consent for data processing</li>
                  <li>The right to object to processing of your personal information</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us using the information provided below.
                </p>
              </section>

              <section className="policy-section">
                <h2>Children's Privacy</h2>
                <p>
                  Our website is not intended for children under 16 years of age. We do not knowingly collect personal
                  information from children under 16. If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us.
                </p>
              </section>

              <section className="policy-section">
                <h2>Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. Any changes will be posted on this page
                  with an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section className="policy-section">
                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="contact-info">
                  <strong>Email:</strong> contact@colinnebula.com<br />
                </p>
              </section>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;
