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
            <Container fluid className="px-3 px-md-4 px-lg-5">
                {/* Header */}
                <Row className="justify-content-center mb-5">
                    <Col xl={10} lg={10} md={12} className="text-center">
                        <div className="hero-content">
                            <h1 className="display-4 fw-bold mb-4 text-gradient">About Colin</h1>
                            <p className="lead text-muted fs-5">
                                Passionate 3D artist with over 10 years of experience creating stunning 
                                digital content and bringing creative visions to life.
                            </p>
                            <div className="hero-divider mx-auto"></div>
                        </div>
                    </Col>
                </Row>

                {/* Top Cards - List Order Display */}
                <Row className="justify-content-center mb-5">
                    <Col xl={10} lg={11} md={12}>
                        <div className="text-center mb-4">
                            <h2 className="h3 mb-3 text-gradient">Top Highlights</h2>
                            <p className="text-muted">Key insights into my journey and philosophy</p>
                        </div>
                        
                        {/* Top Card #1 - My Journey */}
                        <div className="top-card-item mb-4">
                            <div className="top-card-header d-flex align-items-center mb-3">
                                <div className="top-card-number">
                                    <Badge bg="warning" className="rank-badge">
                                        <i className="fas fa-trophy me-1"></i>
                                        #1
                                    </Badge>
                                </div>
                                <div className="top-card-title ms-3">
                                    <h3 className="h4 mb-1 text-primary">
                                        <i className="fas fa-route me-2"></i>
                                        My Journey
                                    </h3>
                                    <small className="text-muted">Most Important • Professional Path</small>
                                </div>
                            </div>
                            <Card className="border-0 shadow-lg top-card-content journey-card">
                                <Card.Body className="p-4">
                                    <p className="text-muted mb-3">
                                        Started as a hobbyist animator and evolved into a professional 3D artist 
                                        specializing in character animation, environmental design, and visual effects. 
                                        I'm passionate about pushing the boundaries of digital art and storytelling.
                                    </p>
                                    <p className="text-muted mb-0">
                                        My work spans across various industries including gaming, film, and advertising, 
                                        always striving to create compelling visual narratives that engage and inspire audiences.
                                    </p>
                                    <div className="top-card-meta mt-3 pt-3 border-top">
                                        <Row className="g-3">
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Experience</small>
                                                <strong className="text-primary">10+ Years</strong>
                                            </Col>
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Industries</small>
                                                <strong className="text-primary">Gaming, Film, Ads</strong>
                                            </Col>
                                            <Col sm={4} xs={12}>
                                                <small className="text-muted d-block">Specialty</small>
                                                <strong className="text-primary">Character Animation</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        {/* Top Card #2 - Philosophy */}
                        <div className="top-card-item mb-4">
                            <div className="top-card-header d-flex align-items-center mb-3">
                                <div className="top-card-number">
                                    <Badge bg="info" className="rank-badge">
                                        <i className="fas fa-medal me-1"></i>
                                        #2
                                    </Badge>
                                </div>
                                <div className="top-card-title ms-3">
                                    <h3 className="h4 mb-1 text-primary">
                                        <i className="fas fa-lightbulb me-2"></i>
                                        Philosophy
                                    </h3>
                                    <small className="text-muted">Core Values • Creative Approach</small>
                                </div>
                            </div>
                            <Card className="border-0 shadow-lg top-card-content philosophy-card">
                                <Card.Body className="p-4">
                                    <p className="text-muted mb-3">
                                        I believe that great 3D art combines technical excellence with creative storytelling. 
                                        Every project is an opportunity to learn something new and push creative boundaries.
                                    </p>
                                    <p className="text-muted mb-0">
                                        Whether it's a complex character rig or a simple motion graphics piece, 
                                        I approach each project with attention to detail and passion for the craft.
                                    </p>
                                    <div className="top-card-meta mt-3 pt-3 border-top">
                                        <Row className="g-3">
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Focus</small>
                                                <strong className="text-primary">Excellence</strong>
                                            </Col>
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Approach</small>
                                                <strong className="text-primary">Detail-Oriented</strong>
                                            </Col>
                                            <Col sm={4} xs={12}>
                                                <small className="text-muted d-block">Value</small>
                                                <strong className="text-primary">Storytelling</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Bio Section - Original cards now simplified */}
                <Row className="justify-content-center mb-5">
                    <Col xl={10} lg={11} md={12}>
                        <div className="text-center mb-4">
                            <h2 className="h3 mb-3 text-gradient">Additional Details</h2>
                            <p className="text-muted">More about my background and approach</p>
                        </div>
                        
                        {/* Additional Detail #1 - Technical Expertise */}
                        <div className="additional-card-item mb-4">
                            <div className="additional-card-header d-flex align-items-center mb-3">
                                <div className="additional-card-number">
                                    <Badge bg="success" className="rank-badge">
                                        <i className="fas fa-star me-1"></i>
                                        #1
                                    </Badge>
                                </div>
                                <div className="additional-card-title ms-3">
                                    <h3 className="h4 mb-1 text-primary">
                                        <i className="fas fa-tools me-2"></i>
                                        Technical Expertise
                                    </h3>
                                    <small className="text-muted">Skills • Software Proficiency</small>
                                </div>
                            </div>
                            <Card className="border-0 shadow-lg additional-card-content technical-card">
                                <Card.Body className="p-4">
                                    <p className="text-muted mb-3">
                                        Proficient in industry-standard software including Blender, Maya, ZBrush, 
                                        and Substance Painter. Constantly learning new techniques and tools to 
                                        stay at the forefront of 3D technology.
                                    </p>
                                    <p className="text-muted mb-0">
                                        My technical skills are complemented by a strong artistic foundation, 
                                        ensuring both beautiful and functional digital creations.
                                    </p>
                                    <div className="additional-card-meta mt-3 pt-3 border-top">
                                        <Row className="g-3">
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Primary Software</small>
                                                <strong className="text-primary">Blender, Maya</strong>
                                            </Col>
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Specialization</small>
                                                <strong className="text-primary">3D Modeling</strong>
                                            </Col>
                                            <Col sm={4} xs={12}>
                                                <small className="text-muted d-block">Learning</small>
                                                <strong className="text-primary">Continuous</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        {/* Additional Detail #2 - Collaboration */}
                        <div className="additional-card-item mb-4">
                            <div className="additional-card-header d-flex align-items-center mb-3">
                                <div className="additional-card-number">
                                    <Badge bg="primary" className="rank-badge">
                                        <i className="fas fa-award me-1"></i>
                                        #2
                                    </Badge>
                                </div>
                                <div className="additional-card-title ms-3">
                                    <h3 className="h4 mb-1 text-primary">
                                        <i className="fas fa-users me-2"></i>
                                        Collaboration
                                    </h3>
                                    <small className="text-muted">Teamwork • Communication</small>
                                </div>
                            </div>
                            <Card className="border-0 shadow-lg additional-card-content collaboration-card">
                                <Card.Body className="p-4">
                                    <p className="text-muted mb-3">
                                        I thrive in collaborative environments, working closely with directors, 
                                        designers, and other artists to bring shared visions to life. 
                                        Communication and teamwork are essential to great creative work.
                                    </p>
                                    <p className="text-muted mb-0">
                                        Whether leading a team or contributing as a specialist, I bring 
                                        enthusiasm and professionalism to every project.
                                    </p>
                                    <div className="additional-card-meta mt-3 pt-3 border-top">
                                        <Row className="g-3">
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Role</small>
                                                <strong className="text-primary">Team Player</strong>
                                            </Col>
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Strength</small>
                                                <strong className="text-primary">Communication</strong>
                                            </Col>
                                            <Col sm={4} xs={12}>
                                                <small className="text-muted d-block">Approach</small>
                                                <strong className="text-primary">Professional</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Skills Section */}
                <Row className="justify-content-center mb-5">
                    <Col xl={10} lg={11} md={12}>
                        <div className="text-center mb-4">
                            <h2 className="h3 mb-3 text-gradient">Technical Skills</h2>
                            <p className="text-muted">Expertise across industry-leading tools and technologies</p>
                        </div>
                        <Row className="g-3">
                            {skills.map((skill, index) => (
                                <Col xl={3} lg={4} md={6} sm={6} xs={12} key={index}>
                                    <div className="skill-item p-3 text-center h-100">
                                        <h5 className="h6 mb-2 skill-name">{skill.name}</h5>
                                        <Badge bg="primary" className="mb-3 skill-badge">{skill.category}</Badge>
                                        <div className="progress mb-2" style={{ height: '8px' }}>
                                            <div 
                                                className="progress-bar bg-gradient-primary" 
                                                style={{ width: `${skill.level}%` }}
                                                role="progressbar"
                                                aria-valuenow={skill.level}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                aria-label={`${skill.name} skill level: ${skill.level}%`}
                                            />
                                        </div>
                                        <small className="text-muted fw-semibold">{skill.level}%</small>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Experience Section */}
                <Row className="justify-content-center mb-5">
                    <Col xl={10} lg={11} md={12}>
                        <div className="text-center mb-4">
                            <h2 className="h3 mb-3 text-gradient">Experience</h2>
                            <p className="text-muted">Professional journey and key milestones</p>
                        </div>
                        
                        {/* Experience #1 - Senior 3D Artist */}
                        <div className="experience-card-item mb-4">
                            <div className="experience-card-header d-flex align-items-center mb-3">
                                <div className="experience-card-number">
                                    <Badge bg="warning" className="rank-badge">
                                        <i className="fas fa-crown me-1"></i>
                                        #1
                                    </Badge>
                                </div>
                                <div className="experience-card-title ms-3">
                                    <h3 className="h4 mb-1 text-primary">
                                        <i className="fas fa-briefcase me-2"></i>
                                        Senior 3D Artist
                                    </h3>
                                    <small className="text-muted">Current Role • Leadership Position</small>
                                </div>
                            </div>
                            <Card className="border-0 shadow-lg experience-card-content senior-card">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="experience-number me-3">01</div>
                                        <div className="flex-grow-1">
                                            <h4 className="h5 mb-1 text-primary">Senior 3D Artist</h4>
                                            <h5 className="h6 text-secondary mb-2">Digital Studio Pro</h5>
                                            <Badge bg="light" text="dark" className="mb-3">2022 - Present</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">
                                        Leading 3D animation projects and mentoring junior artists.
                                    </p>
                                    <div className="experience-card-meta mt-3 pt-3 border-top">
                                        <Row className="g-3">
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Duration</small>
                                                <strong className="text-primary">3+ Years</strong>
                                            </Col>
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Role</small>
                                                <strong className="text-primary">Leadership</strong>
                                            </Col>
                                            <Col sm={4} xs={12}>
                                                <small className="text-muted d-block">Focus</small>
                                                <strong className="text-primary">Mentoring</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        {/* Experience #2 - 3D Animator */}
                        <div className="experience-card-item mb-4">
                            <div className="experience-card-header d-flex align-items-center mb-3">
                                <div className="experience-card-number">
                                    <Badge bg="info" className="rank-badge">
                                        <i className="fas fa-medal me-1"></i>
                                        #2
                                    </Badge>
                                </div>
                                <div className="experience-card-title ms-3">
                                    <h3 className="h4 mb-1 text-primary">
                                        <i className="fas fa-play me-2"></i>
                                        3D Animator
                                    </h3>
                                    <small className="text-muted">Previous Role • Foundation Experience</small>
                                </div>
                            </div>
                            <Card className="border-0 shadow-lg experience-card-content animator-card">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="experience-number me-3">02</div>
                                        <div className="flex-grow-1">
                                            <h4 className="h5 mb-1 text-primary">3D Animator</h4>
                                            <h5 className="h6 text-secondary mb-2">Creative Solutions Inc.</h5>
                                            <Badge bg="light" text="dark" className="mb-3">2020 - 2022</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">
                                        Created character animations and visual effects for commercial projects.
                                    </p>
                                    <div className="experience-card-meta mt-3 pt-3 border-top">
                                        <Row className="g-3">
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Duration</small>
                                                <strong className="text-primary">2 Years</strong>
                                            </Col>
                                            <Col sm={4} xs={6}>
                                                <small className="text-muted d-block">Type</small>
                                                <strong className="text-primary">Commercial</strong>
                                            </Col>
                                            <Col sm={4} xs={12}>
                                                <small className="text-muted d-block">Specialty</small>
                                                <strong className="text-primary">Animation</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* CTA Section */}
                <Row className="justify-content-center">
                    <Col xl={6} lg={8} md={10} sm={12}>
                        <Card className="border-0 bg-gradient-primary text-white cta-card">
                            <Card.Body className="p-5 text-center">
                                <div className="cta-icon mb-3">
                                    <i className="fas fa-handshake text-white fs-1"></i>
                                </div>
                                <h3 className="h4 mb-3">Let's Work Together</h3>
                                <p className="mb-4 fs-5 opacity-90">
                                    Interested in collaborating on your next project? 
                                    I'm always excited to work on new and challenging creative endeavors.
                                </p>
                                <Button 
                                    variant="light" 
                                    size="lg" 
                                    className="rounded-pill px-5 py-3 fw-semibold cta-button"
                                    href="mailto:colinnebula@gmail.com"
                                >
                                    <i className="fas fa-envelope me-2"></i>
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
