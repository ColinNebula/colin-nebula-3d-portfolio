import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // Add body class for modal styling
  useEffect(() => {
    document.body.classList.add('forgot-password-modal-open');
    return () => {
      document.body.classList.remove('forgot-password-modal-open');
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!email) {
      setAlert({ type: 'danger', message: 'Please enter your email address' });
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual forgot password API call
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setAlert({ type: 'danger', message: data.message || 'Failed to send reset email' });
        setLoading(false);
        return;
      }

      setEmailSent(true);
      setAlert({ type: 'success', message: 'Password reset instructions have been sent to your email' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Network error. Please try again.' });
    }
    setLoading(false);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password-modal-backdrop">
      <Card className="forgot-password-modal-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Reset Password</h2>
            <Button variant="outline-secondary" size="sm" onClick={handleBackToHome}>
              ✕
            </Button>
          </div>

          {alert && (
            <Alert variant={alert.type} className="mb-3">
              {alert.message}
            </Alert>
          )}

          {!emailSent ? (
            <>
              <p className="text-muted mb-4">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </Button>
                </div>
              </Form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="text-success fs-1 mb-3">✉️</div>
                <h4>Check Your Email</h4>
                <p className="text-muted">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              <Button variant="outline-primary" onClick={() => setEmailSent(false)}>
                Try Different Email
              </Button>
            </div>
          )}

          <div className="text-center mt-4">
            <span>Remember your password? </span>
            <Link to="/login" className="text-decoration-none">
              Back to Sign In
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ForgotPassword;