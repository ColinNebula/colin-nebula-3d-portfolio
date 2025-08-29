import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaGithub, 
  FaLinkedin, 
  FaYoutube, 
  FaTwitter, 
  FaInstagram, 
  FaBehance, 
  FaArtstation, 
  FaEnvelope, 
  FaHome, 
  FaHeart 
} from "react-icons/fa";
import './Footer.css';

function Footer({ setCurrentTab }) {
    const year = new Date().getFullYear();

    // Social media links with icons and labels
    const socialLinks = [
        { icon: <FaGithub />, label: 'GitHub', url: 'https://github.com/ColinNebula', color: '#333' },
        { icon: <FaLinkedin />, label: 'LinkedIn', url: 'https://www.linkedin.com/in/colin-nebula-07176022/', color: '#0077b5' },
        { icon: <FaYoutube />, label: 'YouTube', url: 'https://www.youtube.com/', color: '#ff0000' },
        { icon: <FaTwitter />, label: 'Twitter', url: 'https://twitter.com/', color: '#1da1f2' },
        { icon: <FaInstagram />, label: 'Instagram', url: 'https://www.instagram.com/', color: '#e1306c' },
        { icon: <FaBehance />, label: 'Behance', url: 'https://www.behance.net/', color: '#053eff' },
        { icon: <FaArtstation />, label: 'ArtStation', url: 'https://www.artstation.com/', color: '#13aff0' },
    ];

    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <Container>
                <Row>
                    <Col md={6}>
                        <h5>Colin Nebula 3D</h5>
                        <p>3D Artist & Developer</p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <p>&copy; {year} Colin Nebula. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;