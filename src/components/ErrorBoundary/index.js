import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container fluid className="error-boundary min-vh-100 d-flex align-items-center justify-content-center">
          <Row>
            <Col xs={12} md={8} lg={6} className="mx-auto text-center">
              <div className="error-content p-4">
                <h1 className="display-4 text-danger mb-4">⚠️ Something went wrong</h1>
                <p className="lead mb-4">
                  We apologize for the inconvenience. An unexpected error occurred.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-start mb-4 p-3 bg-light rounded">
                    <summary className="mb-2">Error details (development mode)</summary>
                    <pre className="text-danger">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                <div className="error-actions">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="rounded-pill me-3"
                    onClick={() => window.location.reload()}
                  >
                    🔄 Reload Page
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="lg"
                    className="rounded-pill"
                    onClick={() => window.location.href = '/'}
                  >
                    🏠 Go Home
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
