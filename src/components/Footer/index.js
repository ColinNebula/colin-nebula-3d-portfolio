import React from 'react';
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

function Footer() {
    const year = new Date().getFullYear();
    const iconStyle = { width: 28, height: 28, marginRight: 12, verticalAlign: 'middle' };

    return (
        <footer className="footer" role="contentinfo" style={{ padding: 16, textAlign: 'center' }}>
            <nav aria-label="Social links" style={{ marginBottom: 12 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'inline-flex', alignItems: 'center' }}>
                    <li>
                        <a href="https://github.com/ColinNebula" target="_blank" rel="noopener noreferrer" aria-label="Colin Nebula on GitHub" title="GitHub">
                            <FaGithub style={iconStyle} />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/colin-nebula-07176022/" target="_blank" rel="noopener noreferrer" aria-label="Colin Nebula on LinkedIn" title="LinkedIn">
                            <FaLinkedin style={iconStyle} />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="Colin Nebula on YouTube" title="YouTube">
                            <FaYoutube style={iconStyle} />
                        </a>
                    </li>
                </ul>
            </nav>

            <div style={{ marginTop: 8 }}>
                <a href="/" title="Home" aria-label="Home" style={{ marginRight: 12, color: 'inherit', textDecoration: 'none' }}>
                    <i className="fa fa-home fa-fw" aria-hidden="true"></i>&nbsp;Home
                </a>
                <span style={{ display: 'block', marginTop: 8 }}>
                    &copy; {year} <a href="mailto:colinnebula@gmail.com" aria-label="Email Colin Nebula">colinnebula@gmail.com</a>
                </span>
            </div>
        </footer>
    );
}

export default Footer;