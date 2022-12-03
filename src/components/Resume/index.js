import React from 'react';
import ProfilePic from '../../assets/images/profile.jpg';

import {  
	FaGithub, 
	FaHtml5, 
	FaCss3Alt, 
	FaJsSquare, 
	FaBootstrap, 
	FaNode, FaReact, 
	FaNpm, 
	FaCloudDownloadAlt 
} 
from "react-icons/fa";

function Resume() {
    return (
        <section>
            <div className="center" id="resume">
				<h1 className="page-header">Resume</h1>
			</div>
            <div className="center">
				<img
					src={ProfilePic}
					alt="about-me"
					className="photo"
				/>
			</div>
            <div className="about-me">
                <p>
                <FaHtml5/>HTML | <FaCss3Alt/>CSS | <FaJsSquare/>JavaScript | AJAX | <FaBootstrap/>Bootstrap | Rest  | MYSQL | NoSQL | <FaReact/>React | MERN | 
                MongoDB | SQL | JQuery | <FaGithub/>Git | Responsive Design | DOM | Progressive Web Applications (PWA)
                </p>
            </div>
        </section>
    );
}

export default Resume;