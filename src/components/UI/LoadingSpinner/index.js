import React from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container fluid className="loading-spinner min-vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col xs={12} className="text-center">
          <div className="loading-content">
            <Spinner 
              animation="border" 
              variant="primary" 
              style={{ width: '4rem', height: '4rem' }}
              className="mb-3"
            />
            <h3 className="mb-2">Loading...</h3>
            <p className="text-muted">Please wait while we prepare your content</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;
