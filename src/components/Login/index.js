import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import Auth from '../../utils/auth';
import './Login.css'; 

function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Add body class for modal styling
  useEffect(() => {
    document.body.classList.add('login-modal-open');
    return () => {
      document.body.classList.remove('login-modal-open');
    };
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!formState.email || !formState.password) {
      setAlert({ type: 'danger', message: 'Please fill in all fields' });
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual login API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setAlert({ type: 'danger', message: data.message || 'Login failed' });
        setLoading(false);
        return;
      }

      const token = data.token;
      if (token) {
        Auth.login(token);
        navigate('/');
      } else {
        setAlert({ type: 'danger', message: 'Authentication token not received' });
      }
    } catch (error) {
      setAlert({ type: 'danger', message: 'Invalid credentials. Please try again.' });
    }
    setLoading(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-modal-backdrop">
      <Card className="login-modal-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Welcome Back</h2>
            <Button variant="outline-secondary" size="sm" onClick={handleBackToHome}>
              ✕
            </Button>
          </div>

          {alert && (
            <Alert variant={alert.type} className="mb-3">
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-decoration-none">
              Create Account
            </Link>
          </div>

          <div className="text-center mt-2">
            <Link to="/forgot-password" className="text-muted text-decoration-none small">
              Forgot your password?
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;


