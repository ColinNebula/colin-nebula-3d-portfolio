import React, { useState } from 'react';
import { Button, Container, Card, Form } from 'react-bootstrap';
import EmailVerification from '../EmailVerification';
import { UserManager, validateEmail } from '../../utils/userValidation';

const EmailVerificationTest = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testName, setTestName] = useState('Test User');
  const [message, setMessage] = useState('');

  const handleStartVerification = () => {
    if (!validateEmail(testEmail)) {
      setMessage('Please enter a valid email address');
      return;
    }
    
    setMessage('Starting email verification...');
    setShowVerification(true);
  };

  const handleVerificationComplete = (success) => {
    if (success) {
      setMessage(`✅ Email verification completed successfully for ${testEmail}!`);
    } else {
      setMessage('❌ Email verification failed or was cancelled.');
    }
    setShowVerification(false);
  };

  const createTestUser = () => {
    const userData = {
      email: testEmail,
      password: 'TestPassword123!',
      firstName: testName.split(' ')[0] || 'Test',
      lastName: testName.split(' ')[1] || 'User'
    };

    const result = UserManager.addUser(userData);
    
    if (result.success) {
      setMessage(`✅ Test user created: ${result.user.email}`);
    } else {
      setMessage(`❌ Failed to create user: ${result.message}`);
    }
  };

  const clearTestData = () => {
    localStorage.removeItem('nebula_users');
    setMessage('🗑️ Test data cleared from localStorage');
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>
          <h3>🔐 Email Verification System Test</h3>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Test Email</Form.Label>
            <Form.Control
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email address"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Test Name</Form.Label>
            <Form.Control
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Enter test user name"
            />
          </Form.Group>
          
          <div className="d-grid gap-2 mb-3">
            <Button variant="primary" onClick={handleStartVerification}>
              🧪 Test Email Verification Flow
            </Button>
            <Button variant="secondary" onClick={createTestUser}>
              👤 Create Test User
            </Button>
            <Button variant="warning" onClick={clearTestData}>
              🗑️ Clear Test Data
            </Button>
          </div>
          
          {message && (
            <div className="alert alert-info mt-3">
              {message}
            </div>
          )}
          
          <div className="mt-4">
            <h5>📊 Test Information</h5>
            <ul>
              <li><strong>Purpose:</strong> Test email verification component independently</li>
              <li><strong>EmailJS:</strong> {process.env.REACT_APP_EMAILJS_SERVICE_ID ? '✅ Configured' : '❌ Not configured'}</li>
              <li><strong>User Storage:</strong> localStorage (demo mode)</li>
              <li><strong>Verification:</strong> 6-digit code with 10-minute expiry</li>
            </ul>
          </div>
          
          <div className="mt-3">
            <h6>🔧 Setup Required:</h6>
            <ol>
              <li>Configure EmailJS credentials in environment variables</li>
              <li>Create verification email template in EmailJS</li>
              <li>Test with real email address for full functionality</li>
            </ol>
          </div>
        </Card.Body>
      </Card>
      
      {/* Email Verification Modal */}
      <EmailVerification
        show={showVerification}
        onHide={() => setShowVerification(false)}
        userEmail={testEmail}
        userName={testName}
        onVerificationComplete={handleVerificationComplete}
      />
    </Container>
  );
};

export default EmailVerificationTest;