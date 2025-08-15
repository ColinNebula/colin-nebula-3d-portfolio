import React from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const PortfolioCard = ({ imageSrc, title, text, onButtonClick }) => (
  <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
    <Card.Img variant="top" src={imageSrc} className="card-image rounded" alt={`${title} Thumbnail`} />
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{text}</Card.Text>
    </Card.Body>
    <Card.Footer>
      <Button variant="outline-warning" onClick={onButtonClick}>View reel here</Button>
    </Card.Footer>
  </Card>
);

const VideoModal = ({ show, onHide, title, description, videoSrc }) => (
  <Modal size="lg" show={show} onHide={onHide} aria-labelledby="modal-title">
    <Modal.Header closeButton>
      <Modal.Title id="modal-title">{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{description}</p>
      <div className="ratio ratio-16x9">
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/mPxmNbMpO7A?si=akRyOXO_rVHT5zDC" 
          title="YouTube video player" 
          style={{ border: 0 }} 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen>
        </iframe>
      </div>
    </Modal.Body>
  </Modal>
);

export { PortfolioCard, VideoModal };