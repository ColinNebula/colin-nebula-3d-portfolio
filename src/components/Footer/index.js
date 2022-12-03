import React from 'react';
import { FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

function Footer() {
    return (
            <div className="footer">
                <footer>
                        <a href="https://www.linkedin.com/" target="blank" rel="noopener noreferrer">
                            <li className="logo">
                                <FaLinkedin />
                            </li>
                        </a>
                        <a href="https://github.com/ColinNebula" target="blank" rel="noopener noreferrer">
                            <li className="logo">
                                <FaGithub />
                            </li>
                        </a>
                        <a href="https://www.youtube.com/" target="blank" rel="noopener noreferrer">
                            <li className="logo">
                                <FaYoutube />
                            </li>
                        </a>
                        
                        <div>
                        <a href="/home">Home</a>
                        <br/>
                        &copy; 2022 colinnebula@hotmail.com.
                        </div>
                </footer>
            </div>
        );
    }

export default Footer;
