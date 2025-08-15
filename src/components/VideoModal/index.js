import React from 'react';
import { Modal } from 'react-bootstrap';

const VideoModal = ({ show, onHide, title, description, videoSrc }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
        <div className="ratio ratio-16x9">
          <iframe
            src={videoSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default VideoModal;
