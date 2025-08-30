import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import './About.css';

const About = () => {
    const skills = [
        { name: 'Blender', level: 95, category: '3D Modeling' },
        { name: 'Maya', level: 90, category: '3D Animation' },
        { name: 'ZBrush', level: 85, category: 'Sculpting' },
        { name: 'After Effects', level: 88, category: 'Motion Graphics' },
        { name: 'Photoshop', level: 92, category: 'Texturing' },
        { name: 'Substance Painter', level: 87, category: 'Texturing' },
        { name: 'Unity', level: 80, category: 'Game Engine' },
        { name: 'Unreal Engine', level: 75, category: 'Game Engine' }
    ];

    const experiences = [
        {
            title: 'Senior 3D Artist',
            company: 'Digital Studio Pro',
            period: '2022 - Present',
            description: 'Leading 3D animation projects and mentoring junior artists.'
        },
        {
            title: '3D Animator',
            company: 'Creative Solutions Inc.',
            period: '2020 - 2022',
            description: 'Created character animations and visual effects for commercial projects.'
        }
    ];

    return (
        <section className="about-section py-5">
            <Container>
                {/* Header */}
                <Row className="mb-5">
                    <Col lg={8} className="mx-auto text-center">
                        <h1 className="display-4 fw-bold mb-4">About Colin</h1>
                        <p className="lead text-muted">
                            Passionate 3D artist with over 5 years of experience creating stunning 
                            digital content and bringing creative visions to life.
                        </p>
                    </Col>
                </Row>

                {/* Bio Section */}
                <Row className="mb-5">
                    <Col lg={6} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h3 className="h4 mb-3">My Journey</h3>
                                <p className="text-muted">
                                    Started as a hobbyist animator and evolved into a professional 3D artist 
                                    specializing in character animation, environmental design, and visual effects. 
                                    I'm passionate about pushing the boundaries of digital art and storytelling.
                                </p>
                                <p className="text-muted">
                                    My work spans across various industries including gaming, film, and advertising, 
                                    always striving to create compelling visual narratives that engage and inspire audiences.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h3 className="h4 mb-3">Philosophy</h3>
                                <p className="text-muted">
                                    I believe that great 3D art combines technical excellence with creative storytelling. 
                                    Every project is an opportunity to learn something new and push creative boundaries.
                                </p>
                                <p className="text-muted">
                                    Whether it's a complex character rig or a simple motion graphics piece, 
                                    I approach each project with attention to detail and passion for the craft.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Skills Section */}
                <Row className="mb-5">
                    <Col>
                        <h2 className="h3 mb-4 text-center">Technical Skills</h2>
                        <Row>
                            {skills.map((skill, index) => (
                                <Col lg={3} md={4} sm={6} key={index} className="mb-3">
                                    <div className="skill-item p-3 text-center">
                                        <h5 className="h6 mb-2">{skill.name}</h5>
                                        <Badge bg="primary" className="mb-2">{skill.category}</Badge>
                                        <div className="progress" style={{ height: '6px' }}>
                                            <div 
                                                className="progress-bar bg-primary" 
                                                style={{ width: `${skill.level}%` }}
                                                role="progressbar"
                                                aria-valuenow={skill.level}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                aria-label={`${skill.name} skill level: ${skill.level}%`}
                                            />
                                        </div>
                                        <small className="text-muted">{skill.level}%</small>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Experience Section */}
                <Row className="mb-5">
                    <Col>
                        <h2 className="h3 mb-4 text-center">Experience</h2>
                        <Row>
                            {experiences.map((exp, index) => (
                                <Col lg={6} key={index} className="mb-4">
                                    <Card className="border-0 shadow-sm">
                                        <Card.Body className="p-4">
                                            <h4 className="h5 mb-2">{exp.title}</h4>
                                            <h5 className="h6 text-primary mb-2">{exp.company}</h5>
                                            <Badge bg="secondary" className="mb-3">{exp.period}</Badge>
                                            <p className="text-muted mb-0">{exp.description}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* CTA Section */}
                <Row>
                    <Col lg={8} className="mx-auto text-center">
                        <Card className="border-0 bg-primary text-white">
                            <Card.Body className="p-4">
                                <h3 className="h4 mb-3">Let's Work Together</h3>
                                <p className="mb-4">
                                    Interested in collaborating on your next project? 
                                    I'm always excited to work on new and challenging creative endeavors.
                                </p>
                                <Button 
                                    variant="light" 
                                    size="lg" 
                                    className="rounded-pill px-4"
                                    href="mailto:colinnebula@gmail.com"
                                >
                                    Get In Touch
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default About;
