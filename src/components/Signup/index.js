import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import Auth from '../../utils/auth';
import { ADD_USER } from '../../utils/mutations';
import './Signup.css';

function Signup() {
  const [formState, setFormState] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addUser] = useMutation(ADD_USER);
  const navigate = useNavigate();

  // Add body class for modal styling
  useEffect(() => {
    document.body.classList.add('signup-modal-open');
    return () => {
      document.body.classList.remove('signup-modal-open');
    };
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAlert(null);

    // Validation
    if (!formState.firstName || !formState.lastName || !formState.email || !formState.password) {
      setAlert({ type: 'danger', message: 'All fields are required' });
      setLoading(false);
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setAlert({ type: 'danger', message: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (formState.password.length < 6) {
      setAlert({ type: 'danger', message: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const mutationResponse = await addUser({
        variables: {
          email: formState.email,
          password: formState.password,
          firstName: formState.firstName,
          lastName: formState.lastName,
        },
      });
      const token = mutationResponse.data.addUser.token;
      Auth.login(token);
      navigate('/');
    } catch (error) {
      setAlert({ type: 'danger', message: error.message || 'Signup failed. Please try again.' });
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
    <div className="signup-modal-backdrop">
      <Card className="signup-modal-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Create Account</h2>
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
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formState.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formState.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3">
            <span>Already have an account? </span>
            <Link to="/login" className="text-decoration-none">
              Sign In
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Signup;
