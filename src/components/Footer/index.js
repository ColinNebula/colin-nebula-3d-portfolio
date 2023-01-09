import React from 'react';
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
// import { Card, Container, Row, Col, CardGroup, NavDropdown, Modal, Button } from 'react-bootstrap';
function Footer() {
    return (
        
            <div className="footer">
                <footer>
                        <a href="https://github.com/ColinNebula" target="blank" rel="noopener noreferrer">
                            <li className="logo">
                                <FaGithub />
                            </li>
                        </a>
                        <a href="https://www.linkedin.com/in/colin-nebula-07176022/" target="blank" rel="noopener noreferrer">
                            <li className="logo">
                                <FaLinkedin />
                            </li>
                        </a>
                        <a href="https://www.youtube.com/" target="blank" rel="noopener noreferrer">
                            <li className="logo">
                                <FaYoutube />
                            </li>
                        </a>
                        <div>
                        <a href="/"><i class="fa fa-home fa-fw" aria-hidden="true"></i>&nbsp;Home</a>
                        <br/>
                        
                        &copy; 2022 <a href="mailto:colinnebula@gmail.com">colinnebula@gmail.com</a>
                        </div>
                </footer>
            </div>
        
        );
    }

export default Footer;