import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 3, viewMode = 'cards' }) => {
  return viewMode === 'cards' ? (
    <Row className="g-4">
      {Array.from({ length: count }).map((_, index) => (
        <Col xs={12} md={6} lg={4} key={index}>
          <Card className="skeleton-card h-100">
            <div className="skeleton-image"></div>
            <Card.Body>
              <div className="skeleton-badge"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
              <div className="skeleton-tags">
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
              </div>
              <div className="skeleton-actions">
                <div className="skeleton-button"></div>
                <div className="skeleton-icon"></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  ) : (
    <div className="update-list-view">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-list-item" key={index}>
          <div className="skeleton-list-thumbnail"></div>
          <div className="skeleton-list-content">
            <div className="skeleton-badge"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-list-footer">
              <div className="skeleton-tag"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
