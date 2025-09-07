import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner, Form } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import { emailjsConfig, createEmailTemplate } from '../../utils/emailConfig';
import './EmailVerification.css';

const EmailVerification = ({ show, onHide, userEmail, userName, onVerificationComplete }) => {
  const [verificationState, setVerificationState] = useState('initial'); // 'initial', 'sending', 'sent', 'verifying', 'verified', 'error'
  const [verificationCode, setVerificationCode] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  // Generate verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  };

  // Send verification email
  const sendVerificationEmail = async (isResend = false) => {
    if (!isResend) {
      setVerificationState('sending');
    }
    setErrorMessage('');

    try {
      const code = generateVerificationCode();
      setVerificationCode(code);

      // Create verification email template
      const verificationTemplate = {
        ...createEmailTemplate(userName, userEmail),
        verification_code: code,
        subject: 'Email Verification - Colin Nebula Portfolio',
        verification_message: `Your verification code is: ${code}`,
        instructions: 'Please enter this code in the verification dialog to complete your account setup.',
        expiry_note: 'This code will expire in 10 minutes for security.',
        security_note: 'If you didn\'t request this verification, please ignore this email.'
      };

      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId, // You'll need a verification template
        verificationTemplate,
        emailjsConfig.publicKey
      );

      setVerificationState('sent');
      
      // Start resend cooldown
      setResendCooldown(60);
      const cooldownTimer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set code expiry (10 minutes)
      setTimeout(() => {
        setVerificationCode('');
        if (verificationState === 'sent') {
          setErrorMessage('Verification code has expired. Please request a new one.');
        }
      }, 10 * 60 * 1000);

    } catch (error) {
      console.error('Failed to send verification email:', error);
      setErrorMessage('Failed to send verification email. Please try again.');
      setVerificationState('error');
    }
  };

  // Verify entered code
  const verifyCode = () => {
    if (!userEnteredCode.trim()) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    if (!verificationCode) {
      setErrorMessage('Verification code has expired. Please request a new one.');
      return;
    }

    setVerificationState('verifying');
    setErrorMessage('');

    // Simulate verification delay
    setTimeout(() => {
      if (userEnteredCode.trim() === verificationCode) {
        setVerificationState('verified');
        setTimeout(() => {
          onVerificationComplete(true);
          onHide();
        }, 2000);
      } else {
        setAttemptCount(prev => prev + 1);
        setErrorMessage('Invalid verification code. Please try again.');
        setVerificationState('sent');
        
        // Lock account after 5 failed attempts
        if (attemptCount >= 4) {
          setErrorMessage('Too many failed attempts. Please request a new verification code.');
          setVerificationCode('');
          setVerificationState('initial');
          setAttemptCount(0);
        }
      }
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && verificationState === 'sent' && userEnteredCode.trim()) {
      verifyCode();
    }
  };

  // Start verification process when modal opens
  useEffect(() => {
    if (show && verificationState === 'initial') {
      sendVerificationEmail();
    }
  }, [show]);

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setVerificationState('initial');
      setVerificationCode('');
      setUserEnteredCode('');
      setErrorMessage('');
      setResendCooldown(0);
      setAttemptCount(0);
    }
  }, [show]);

  const getModalContent = () => {
    switch (verificationState) {
      case 'sending':
        return (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>Sending Verification Email</h5>
            <p className="text-muted">
              We're sending a verification code to<br />
              <strong>{userEmail}</strong>
            </p>
          </div>
        );

      case 'sent':
        return (
          <div className="py-3">
            <div className="text-center mb-4">
              <div className="verification-icon mb-3">📧</div>
              <h5>Check Your Email</h5>
              <p className="text-muted">
                We've sent a 6-digit verification code to<br />
                <strong>{userEmail}</strong>
              </p>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Enter Verification Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="000000"
                value={userEnteredCode}
                onChange={(e) => setUserEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                className="text-center verification-input"
                maxLength={6}
                autoFocus
              />
              <Form.Text className="text-muted">
                Enter the 6-digit code from your email
              </Form.Text>
            </Form.Group>

            {errorMessage && (
              <Alert variant="danger" className="mb-3">
                {errorMessage}
              </Alert>
            )}

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={verifyCode}
                disabled={!userEnteredCode.trim() || userEnteredCode.length !== 6}
              >
                Verify Email
              </Button>
              
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => sendVerificationEmail(true)}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0 
                  ? `Resend code in ${resendCooldown}s` 
                  : 'Resend verification code'
                }
              </Button>
            </div>
          </div>
        );

      case 'verifying':
        return (
          <div className="text-center py-4">
            <Spinner animation="border" variant="success" className="mb-3" />
            <h5>Verifying Code</h5>
            <p className="text-muted">Please wait while we verify your code...</p>
          </div>
        );

      case 'verified':
        return (
          <div className="text-center py-4">
            <div className="verification-success mb-3">✅</div>
            <h5 className="text-success">Email Verified!</h5>
            <p className="text-muted">
              Welcome, {userName}! Your email has been successfully verified.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="py-3">
            <Alert variant="danger" className="mb-3">
              <Alert.Heading>Verification Failed</Alert.Heading>
              {errorMessage || 'An error occurred during email verification.'}
            </Alert>
            <div className="d-grid">
              <Button variant="primary" onClick={() => sendVerificationEmail()}>
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      show={show}
      onHide={verificationState === 'verified' ? onHide : undefined}
      centered
      backdrop="static"
      keyboard={false}
      className="email-verification-modal"
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <div className="d-flex flex-column align-items-center">
            <div className="verification-header-icon mb-2">🔐</div>
            <h4 className="mb-0">Email Verification</h4>
            <small className="text-muted">Required for account security</small>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {getModalContent()}
      </Modal.Body>
      
      {verificationState === 'sent' && (
        <Modal.Footer className="border-0 pt-0">
          <small className="text-muted w-100 text-center">
            Didn't receive the email? Check your spam folder or try resending.
          </small>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default EmailVerification;