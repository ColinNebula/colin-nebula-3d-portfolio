import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import ProfilePic from '../../assets/images/profile.jpg';
import './About.css'; // Will create this file for custom styling

function About() {
    // Technical skills with proficiency levels
    const technicalSkills = [
        { name: 'JavaScript', level: 90 },
        { name: 'React.js', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'MongoDB', level: 75 },
        { name: 'Express.js', level: 80 },
        { name: 'HTML/CSS', level: 90 },
        { name: 'Responsive Design', level: 85 },
    ];
    
    // Professional skills/strengths
    const professionalSkills = [
        'Problem Solving', 'User Experience', 'Team Collaboration', 
        'Communication', 'Adaptability', 'Project Management', 'Client Relations'
    ];

    return (
        <section className="about-section py-5">
            <Container>
                {/* Header */}
                <Row className="mb-5 text-center">
                    <Col>
                        <h1 className="about-header display-4">About Me</h1>
                        <div className="header-underline mx-auto"></div>
                    </Col>
                </Row>
                
                {/* Main Content Area */}
                <Row className="align-items-center mb-5">
                    {/* Profile Image Column */}
                    <Col lg={5} className="mb-4 mb-lg-0">
                        <div className="profile-image-container">
                            <img
                                src={ProfilePic}
                                alt="Colin - 3D Artist and Developer"
                                className="profile-image"
                            />
                            <div className="image-border-effect"></div>
                        </div>
                    </Col>
                    
                    {/* Bio Column */}
                    <Col lg={7}>
                        <div className="bio-content">
                            <h2 className="section-title">My Journey</h2>
                            <p className="bio-text">
                                Hi, I'm Colin, a full-stack web developer and 3D artist based in Toronto, Canada. 
                                My journey into tech started at the end of 2020 when I lost my corporate sales job due to the pandemic. 
                                I took the opportunity to reinvent myself and pursue a new and challenging career in web development.
                            </p>
                            <p className="bio-text">
                                I'm leveraging my telecommunications sales background to build a more intuitive user experience on the web. 
                                I recently earned a certificate in full-stack web development from the University of Toronto, 
                                with newly developed skills in JavaScript, CSS, React.js, and responsive web design.
                            </p>
                            <p className="bio-text">
                                Known as an innovative problem solver passionate about developing apps, with a focus on the MERN technology stack. 
                                I'm excited to apply my skills as part of a fast-paced, quality-driven team to build better experiences on the web.
                            </p>
                            
                            <div className="personal-interests mt-4">
                                <h3 className="subsection-title">When I'm Not Coding</h3>
                                <p className="bio-text">
                                    I enjoy cooking, spending time with my family, and keeping fit. I've been on a fitness journey since the start of the pandemic and I'm in the best shape of my life. I weight train daily and go for 10km runs several times a week.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
                
                {/* Skills Section */}
                <Row className="skills-section">
                    <Col lg={12} className="mb-4">
                        <h2 className="section-title text-center mb-5">My Skills & Expertise</h2>
                    </Col>
                    
                    {/* Technical Skills */}
                    <Col lg={6} className="mb-4">
                        <Card className="skills-card h-100">
                            <Card.Body>
                                <h3 className="subsection-title">Technical Skills</h3>
                                {technicalSkills.map((skill, index) => (
                                    <div key={index} className="skill-item mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="skill-name">{skill.name}</span>
                                            <span className="skill-percentage">{skill.level}%</span>
                                        </div>
                                        <ProgressBar 
                                            now={skill.level} 
                                            variant={skill.level > 80 ? "success" : "primary"} 
                                            className="skill-bar"
                                        />
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Professional Skills */}
                    <Col lg={6} className="mb-4">
                        <Card className="skills-card h-100">
                            <Card.Body>
                                <h3 className="subsection-title">Professional Strengths</h3>
                                <div className="professional-skills">
                                    {professionalSkills.map((skill, index) => (
                                        <Badge 
                                            key={index} 
                                            pill 
                                            bg="primary" 
                                            className="professional-skill-badge"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                                
                                <div className="mt-4">
                                    <h4 className="experience-title">My Approach</h4>
                                    <ul className="approach-list">
                                        <li>Focusing on intuitive and responsive user interfaces</li>
                                        <li>Balancing creativity with technical functionality</li>
                                        <li>Building applications with performance and accessibility in mind</li>
                                        <li>Bringing ideas to life through both code and 3D visualization</li>
                                        <li>Continuously learning and adapting to new technologies</li>
                                    </ul>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
                {/* Call to Action */}
                <Row className="mt-4 text-center">
                    <Col>
                        <div className="cta-container">
                            <h3 className="cta-title">Interested in working together?</h3>
                            <p className="cta-text">Check out my portfolio or contact me to discuss opportunities.</p>
                            <div className="cta-buttons">
                                <a href="/portfolio" className="btn btn-primary me-3">View Portfolio</a>
                                <a href="/resume" className="btn btn-outline-primary">See Resume</a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default About;
