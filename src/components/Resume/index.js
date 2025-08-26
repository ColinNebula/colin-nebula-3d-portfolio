import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ProgressBar, Tabs, Tab, Badge, Alert } from 'react-bootstrap';
import { 
  FaEnvelope, FaPhone, FaGlobe, FaGithub, FaLinkedin, FaPrint, FaDownload, 
  FaFileAlt, FaFileWord, FaFilePdf, FaStar, FaCertificate, FaCode,
  FaRegLightbulb, FaLanguage, FaBriefcase, FaMapMarkerAlt, FaQrcode
} from 'react-icons/fa';
import './Resume.css';

// Note: To enable PDF generation, install these packages:
// npm install --save html2canvas jspdf

const Resume = () => {
  const resumeRef = useRef();
  const [activeTab, setActiveTab] = useState('main');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Check system preference for dark mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // Enhanced skill data with ratings
  const skills = {
    modeling: [
      { name: 'Blender', rating: 95 },
      { name: 'Maya', rating: 85 },
      { name: 'ZBrush', rating: 80 },
      { name: 'Cinema 4D', rating: 75 },
      { name: 'Character Rigging', rating: 90 },
      { name: 'Animation Principles', rating: 85 }
    ],
    development: [
      { name: 'JavaScript/TypeScript', rating: 90 },
      { name: 'React.js', rating: 85 },
      { name: 'Three.js', rating: 95 },
      { name: 'WebGL', rating: 80 },
      { name: 'Node.js', rating: 75 },
      { name: 'HTML/CSS', rating: 90 }
    ],
    design: [
      { name: 'Adobe Creative Suite', rating: 85 },
      { name: 'After Effects', rating: 90 },
      { name: 'Premiere Pro', rating: 80 },
      { name: 'Substance Painter', rating: 85 },
      { name: 'UI/UX Design', rating: 75 },
      { name: 'Texturing', rating: 90 }
    ],
    // New skill section: Soft Skills
    soft: [
      { name: 'Team Leadership', rating: 90 },
      { name: 'Project Management', rating: 85 },
      { name: 'Problem Solving', rating: 95 },
      { name: 'Communication', rating: 85 },
      { name: 'Time Management', rating: 80 },
      { name: 'Adaptability', rating: 90 }
    ],
    // New skill section: Languages
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Intermediate (B2)' },
      { name: 'French', level: 'Basic (A2)' }
    ]
  };

  // Additional certifications and badges
  const additionalCertifications = [
    { title: "Unity Certified Developer", year: 2021, issuer: "Unity Technologies", badge: <FaCode /> },
    { title: "AWS Cloud Practitioner", year: 2020, issuer: "Amazon Web Services", badge: <FaGlobe /> },
    { title: "Digital Animation Excellence", year: 2019, issuer: "Animation World Festival", badge: <FaStar /> }
  ];
  
  // Testimonials from clients/colleagues
  const testimonials = [
    {
      text: "Colin delivered exceptional 3D visualizations that exceeded our expectations. His technical knowledge combined with creative vision produced stunning results.",
      author: "Sarah Johnson",
      position: "Creative Director, Visualize Studios"
    },
    {
      text: "Working with Colin was a game-changer for our project. His ability to transform complex ideas into beautiful 3D environments is unparalleled.",
      author: "Michael Chen",
      position: "Lead Developer, TechVision"
    },
    {
      text: "Colin's expertise in both artistic design and technical implementation made him invaluable to our team. His work consistently raised the bar.",
      author: "Alexandra Davis",
      position: "Project Manager, Interactive Media"
    }
  ];

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF download - simplified to use browser print dialog
  const handleDownloadPDF = () => {
    alert(
      "Direct PDF export requires additional packages.\n\n" +
      "To enable this feature, run:\n" +
      "npm install --save html2canvas jspdf\n\n" +
      "For now, please use the Print button and save as PDF from your browser."
    );
    
    // Alternative: Use the print dialog and suggest saving as PDF
    window.print();
  };

  // Sample downloadable resume files
  const resumeFiles = [
    { name: "Resume - PDF", icon: <FaFilePdf />, url: "/downloads/Colin_Nebula_Resume.pdf" },
    { name: "Resume - Word", icon: <FaFileWord />, url: "/downloads/Colin_Nebula_Resume.docx" },
    { name: "Resume - Text", icon: <FaFileAlt />, url: "/downloads/Colin_Nebula_Resume.txt" },
    // Add new resume format
    { name: "Interactive Resume", icon: <FaQrcode />, url: "/downloads/Colin_Nebula_Interactive.html" }
  ];
  
  // Download sample files
  const handleDownloadFile = (url, filename) => {
    // This is a placeholder - in a real app, these files would exist
    alert(`In a production environment, this would download ${filename}. Currently this is just a demonstration.`);
  };

  // Toggle color scheme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container className={`resume-container my-5 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="theme-toggle-container mb-3">
        <Button 
          variant={darkMode ? "light" : "dark"} 
          size="sm" 
          onClick={toggleTheme}
          className="theme-toggle-btn"
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </div>
      
      {/* Resume Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3 resume-tabs"
      >
        <Tab eventKey="main" title="Resume">
          <div className="d-flex justify-content-between mb-4 resume-actions align-items-center">
            <h2 className="resume-page-title mb-0">Professional Resume</h2>
            
            <div>
              <Button variant="outline-primary" className="me-2" onClick={handlePrint}>
                <FaPrint className="me-1" /> Print
              </Button>
              <Button 
                variant="primary" 
                onClick={handleDownloadPDF}
              >
                <FaDownload className="me-1" /> Save as PDF
              </Button>
            </div>
          </div>
          
          <div className="resume-wrapper" ref={resumeRef}>
            <div className="resume-paper">
              {/* Header/Contact Information */}
              <header className="resume-header">
                <div className="text-center mb-4">
                  <h1 className="resume-name">Colin Nebula</h1>
                  <h2 className="resume-title">3D Artist & Developer</h2>
                  
                  <div className="resume-contact">
                    <span><FaEnvelope /> colinnebula@gmail.com</span>
                    <span><FaPhone /> (555) 123-4567</span>
                    <span><FaGlobe /> colinnebula.com</span>
                    <span><FaGithub /> github.com/ColinNebula</span>
                    <span><FaLinkedin /> linkedin.com/in/colinnebula</span>
                    <span><FaMapMarkerAlt /> New York, NY (Remote Available)</span>
                  </div>
                </div>
                
                {/* New: Professional tagline */}
                <div className="professional-tagline text-center">
                  <p>"Creating immersive digital worlds where technology meets artistic expression"</p>
                </div>
              </header>

              <main>
                {/* Summary Section */}
                <section className="resume-section">
                  <h3 className="section-title">Professional Summary</h3>
                  <div className="section-content">
                    <p>Creative 3D artist and developer with over 5 years of experience in creating immersive digital experiences. 
                    Specialized in 3D modeling, animation, and developing interactive web applications. Passionate about blending 
                    technical expertise with artistic vision to create compelling visual narratives and functional applications.</p>
                    
                    {/* New: Key highlights */}
                    <div className="key-highlights mt-3">
                      <Row>
                        <Col md={4}>
                          <div className="highlight-item">
                            <div className="highlight-icon"><FaBriefcase /></div>
                            <div className="highlight-text">5+ Years Experience</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="highlight-item">
                            <div className="highlight-icon"><FaCertificate /></div>
                            <div className="highlight-text">6 Professional Certifications</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="highlight-item">
                            <div className="highlight-icon"><FaRegLightbulb /></div>
                            <div className="highlight-text">12+ Completed Projects</div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </section>

                {/* Skills Section - Enhanced with visual ratings */}
                <section className="resume-section">
                  <h3 className="section-title">Technical Skills</h3>
                  <div className="section-content">
                    <Row>
                      {/* Existing skills columns */}
                      <Col md={4}>
                        <h4 className="skill-category">3D Modeling & Animation</h4>
                        <ul className="skill-list-rated">
                          {skills.modeling.map((skill, index) => (
                            <li key={index}>
                              <div className="d-flex justify-content-between">
                                <span>{skill.name}</span>
                                <span className="skill-rating">{skill.rating}%</span>
                              </div>
                              <ProgressBar 
                                now={skill.rating} 
                                variant={skill.rating > 85 ? "success" : skill.rating > 70 ? "info" : "primary"} 
                                className="skill-progress"
                              />
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col md={4}>
                        <h4 className="skill-category">Development</h4>
                        <ul className="skill-list-rated">
                          {skills.development.map((skill, index) => (
                            <li key={index}>
                              <div className="d-flex justify-content-between">
                                <span>{skill.name}</span>
                                <span className="skill-rating">{skill.rating}%</span>
                              </div>
                              <ProgressBar 
                                now={skill.rating} 
                                variant={skill.rating > 85 ? "success" : skill.rating > 70 ? "info" : "primary"} 
                                className="skill-progress"
                              />
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col md={4}>
                        <h4 className="skill-category">Design & VFX</h4>
                        <ul className="skill-list-rated">
                          {skills.design.map((skill, index) => (
                            <li key={index}>
                              <div className="d-flex justify-content-between">
                                <span>{skill.name}</span>
                                <span className="skill-rating">{skill.rating}%</span>
                              </div>
                              <ProgressBar 
                                now={skill.rating} 
                                variant={skill.rating > 85 ? "success" : skill.rating > 70 ? "info" : "primary"} 
                                className="skill-progress"
                              />
                            </li>
                          ))}
                        </ul>
                      </Col>
                    </Row>
                    
                    {/* New: Additional Skills Sections */}
                    <Row className="mt-4">
                      <Col md={6}>
                        <h4 className="skill-category">Soft Skills</h4>
                        <ul className="skill-list-rated">
                          {skills.soft.map((skill, index) => (
                            <li key={index}>
                              <div className="d-flex justify-content-between">
                                <span>{skill.name}</span>
                                <span className="skill-rating">{skill.rating}%</span>
                              </div>
                              <ProgressBar 
                                now={skill.rating} 
                                variant="warning" 
                                className="skill-progress"
                              />
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h4 className="skill-category">Languages</h4>
                        <div className="language-skills">
                          {skills.languages.map((lang, index) => (
                            <div key={index} className="language-item">
                              <FaLanguage className="language-icon" />
                              <div className="language-details">
                                <strong>{lang.name}</strong>
                                <span className="language-level">{lang.level}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </section>

                {/* Experience Section - With timeline visualization */}
                <section className="resume-section">
                  <h3 className="section-title">Professional Experience</h3>
                  <div className="section-content">
                    <div className="timeline">
                      {/* First experience */}
                      <div className="experience-item timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="experience-header">
                            <h4>Senior 3D Artist & Developer</h4>
                            <div className="experience-subheader">
                              <span className="company">Nebula Digital Studios</span>
                              <span className="duration">2020 - Present</span>
                            </div>
                          </div>
                          <ul className="responsibility-list">
                            <li>Lead a team of 5 artists in creating high-quality 3D assets for interactive web experiences</li>
                            <li>Developed custom Three.js solutions for web-based 3D portfolios and product visualizations</li>
                            <li>Implemented responsive design principles to ensure optimal viewing on all devices</li>
                            <li>Reduced loading times of 3D web assets by 60% through optimization techniques</li>
                            <li>Mentored junior developers in 3D web integration best practices</li>
                          </ul>
                          {/* New: Key achievements */}
                          <div className="key-achievements">
                            <h5>Key Achievements:</h5>
                            <Badge bg="success" className="achievement-badge">Increased Team Productivity by 35%</Badge>
                            <Badge bg="success" className="achievement-badge">Client Satisfaction Rate: 98%</Badge>
                            <Badge bg="success" className="achievement-badge">Optimized Rendering Pipeline</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Remaining experience items */}
                      <div className="experience-item timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="experience-header">
                            <h4>3D Visualization Specialist</h4>
                            <div className="experience-subheader">
                              <span className="company">VirtualCraft Interactive</span>
                              <span className="duration">2018 - 2020</span>
                            </div>
                          </div>
                          <ul className="responsibility-list">
                            <li>Created photorealistic 3D product renderings for marketing campaigns</li>
                            <li>Designed and implemented interactive 3D elements for e-commerce websites</li>
                            <li>Collaborated with UX team to create intuitive 3D interfaces for client projects</li>
                            <li>Developed animation sequences for product demonstrations and promotional videos</li>
                            <li>Pioneered new rendering techniques that improved visual quality while reducing render times</li>
                          </ul>
                        </div>
                      </div>

                      <div className="experience-item timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="experience-header">
                            <h4>Web Developer & 3D Artist</h4>
                            <div className="experience-subheader">
                              <span className="company">CreativeEdge Solutions</span>
                              <span className="duration">2016 - 2018</span>
                            </div>
                          </div>
                          <ul className="responsibility-list">
                            <li>Developed responsive websites with integrated 3D elements using Three.js</li>
                            <li>Created 3D models and animations for use in web and mobile applications</li>
                            <li>Implemented WebGL-based visualizations for data presentation</li>
                            <li>Optimized 3D assets for web deployment across multiple platforms</li>
                            <li>Automated asset processing workflows, saving 10+ hours per week</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Education Section */}
                <section className="resume-section">
                  <h3 className="section-title">Education</h3>
                  <div className="section-content">
                    <div className="education-item timeline-item">
                      <div className="timeline-marker education-marker"></div>
                      <div className="timeline-content">
                        <div className="education-header">
                          <h4>MFA in Digital Arts and Animation</h4>
                          <div className="education-subheader">
                            <span className="institution">Digital Arts Institute</span>
                            <span className="year">2015</span>
                          </div>
                        </div>
                        <p>Specialized in 3D modeling and interactive media. Thesis: "Interactive 3D Environments in Web Applications"</p>
                        <div className="education-highlights">
                          <span className="badge bg-info me-2">Dean's List</span>
                          <span className="badge bg-info me-2">Outstanding Graduate Award</span>
                          <span className="badge bg-info">3.95 GPA</span>
                        </div>
                      </div>
                    </div>

                    <div className="education-item timeline-item">
                      <div className="timeline-marker education-marker"></div>
                      <div className="timeline-content">
                        <div className="education-header">
                          <h4>BS in Computer Science</h4>
                          <div className="education-subheader">
                            <span className="institution">Tech University</span>
                            <span className="year">2013</span>
                          </div>
                        </div>
                        <p>Minor in Digital Media. Focus on graphics programming and web development.</p>
                        <div className="education-highlights">
                          <span className="badge bg-info me-2">Magna Cum Laude</span>
                          <span className="badge bg-info">3.8 GPA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Projects Section */}
                <section className="resume-section">
                  <h3 className="section-title">Notable Projects</h3>
                  <div className="section-content projects-grid">
                    <Row>
                      {/* Project cards */}
                      <Col md={6} className="mb-3">
                        <Card className="project-card h-100">
                          <Card.Body>
                            <Card.Title>Interactive Galaxy Explorer</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Three.js, WebGL, React</Card.Subtitle>
                            <Card.Text>
                              An interactive 3D web application allowing users to explore a procedurally generated galaxy.
                              Featured particle systems with over 10,000 stars and custom shader effects.
                            </Card.Text>
                            <div className="project-links">
                              <a href="#demo" className="btn btn-sm btn-outline-primary me-2">View Demo</a>
                              <a href="#code" className="btn btn-sm btn-outline-secondary">Source Code</a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Card className="project-card h-100">
                          <Card.Body>
                            <Card.Title>Architectural Visualization Suite</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Blender, React, Three.js</Card.Subtitle>
                            <Card.Text>
                              A web-based tool for architects to showcase building designs in interactive 3D,
                              with features for changing materials, lighting, and time-of-day effects in real-time.
                            </Card.Text>
                            <div className="project-links">
                              <a href="#demo" className="btn btn-sm btn-outline-primary me-2">View Demo</a>
                              <a href="#case-study" className="btn btn-sm btn-outline-secondary">Case Study</a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Card className="project-card h-100">
                          <Card.Body>
                            <Card.Title>"Nebula Dreams" Animated Short</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Blender, After Effects</Card.Subtitle>
                            <Card.Text>
                              A 3-minute animated short film exploring abstract cosmic themes.
                              Selected for screening at three international animation festivals.
                            </Card.Text>
                            <div className="project-links">
                              <a href="#watch" className="btn btn-sm btn-outline-primary me-2">Watch Film</a>
                              <a href="#behind-scenes" className="btn btn-sm btn-outline-secondary">Behind the Scenes</a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Card className="project-card h-100">
                          <Card.Body>
                            <Card.Title>E-commerce 3D Product Viewer</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Three.js, React, Node.js</Card.Subtitle>
                            <Card.Text>
                              A customizable product viewer allowing customers to interact with products in 3D,
                              change colors and configurations, and view animations of product features.
                            </Card.Text>
                            <div className="project-links">
                              <a href="#demo" className="btn btn-sm btn-outline-primary me-2">View Demo</a>
                              <a href="#case-study" className="btn btn-sm btn-outline-secondary">Case Study</a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </section>

                {/* Awards/Certifications Section - Enhanced */}
                <section className="resume-section">
                  <h3 className="section-title">Awards & Certifications</h3>
                  <div className="section-content">
                    <Row>
                      <Col lg={8}>
                        <ul className="certification-list">
                          {/* Original certifications */}
                          <li>
                            <div className="certification-header">
                              <span className="certification-title">Best Interactive 3D Experience</span>
                              <span className="certification-year">2021</span>
                            </div>
                            <p>Awarded by Digital Design Awards for the Interactive Galaxy Explorer project</p>
                          </li>
                          <li>
                            <div className="certification-header">
                              <span className="certification-title">WebGL Advanced Certification</span>
                              <span className="certification-year">2020</span>
                            </div>
                            <p>Comprehensive certification in advanced WebGL techniques and optimization</p>
                          </li>
                          <li>
                            <div className="certification-header">
                              <span className="certification-title">Certified Three.js Specialist</span>
                              <span className="certification-year">2019</span>
                            </div>
                            <p>Professional certification in Three.js development and optimization</p>
                          </li>
                          <li>
                            <div className="certification-header">
                              <span className="certification-title">Adobe Certified Expert - After Effects</span>
                              <span className="certification-year">2018</span>
                            </div>
                            <p>Advanced certification in motion graphics and visual effects with Adobe After Effects</p>
                          </li>
                          
                          {/* Additional certifications */}
                          {additionalCertifications.map((cert, index) => (
                            <li key={`additional-${index}`}>
                              <div className="certification-header">
                                <span className="certification-title">
                                  <span className="cert-badge me-2">{cert.badge}</span>
                                  {cert.title}
                                </span>
                                <span className="certification-year">{cert.year}</span>
                              </div>
                              <p>Issued by {cert.issuer}</p>
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col lg={4}>
                        <div className="certification-showcase">
                          <h5>Featured Certification</h5>
                          <div className="featured-cert">
                            <div className="cert-icon"><FaCertificate size={50} /></div>
                            <div className="cert-title">Certified Three.js Specialist</div>
                            <div className="cert-details">Recognized for advanced expertise in 3D web development</div>
                            <Button size="sm" variant="outline-primary" className="mt-2">View Certificate</Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </section>
                
                {/* New Section: Testimonials */}
                <section className="resume-section">
                  <h3 className="section-title">Testimonials</h3>
                  <div className="section-content">
                    <div className="testimonials-container">
                      <Row>
                        {testimonials.map((testimonial, index) => (
                          <Col md={4} key={index}>
                            <div className="testimonial-card">
                              <div className="testimonial-text">"{testimonial.text}"</div>
                              <div className="testimonial-author">
                                <strong>{testimonial.author}</strong>
                                <div className="testimonial-position">{testimonial.position}</div>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </Tab>
        <Tab eventKey="downloads" title="Resume Downloads">
          <div className="resume-downloads-section p-4">
            <h3>Resume Downloads</h3>
            <p className="mb-4">Download my resume in various formats for your convenience.</p>
            
            <Row>
              {resumeFiles.map((file, index) => (
                <Col md={4} key={index} className="mb-3">
                  <Card className="h-100 resume-download-card">
                    <Card.Body className="d-flex flex-column">
                      <div className="file-icon mb-3">
                        {file.icon}
                      </div>
                      <Card.Title>{file.name}</Card.Title>
                      <Card.Text className="text-muted">
                        Click the button below to download this version of my resume.
                      </Card.Text>
                      <Button 
                        variant="primary" 
                        className="mt-auto"
                        onClick={() => handleDownloadFile(file.url, file.name)}
                      >
                        <FaDownload className="me-2" /> Download
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <div className="mt-4 custom-resume-request">
              <h4>Need a custom format?</h4>
              <p>If you need my resume in a different format, please don't hesitate to contact me at <a href="mailto:colinnebula@gmail.com">colinnebula@gmail.com</a>.</p>
            </div>
            
            <div className="mt-4 alert alert-info">
              <h5>Developer Note:</h5>
              <p>
                To enable direct PDF generation, install the required packages:
                <code className="d-block mt-2 p-2 bg-dark text-light">npm install --save html2canvas jspdf</code>
              </p>
            </div>
          </div>
        </Tab>
        
        {/* New Tab: Resume Statistics */}
        <Tab eventKey="stats" title="Resume Stats">
          <div className="resume-stats-section p-4">
            <h3>Resume Performance</h3>
            <p>Track how your resume performs and get insights to improve it.</p>
            
            <Alert variant="info" className="mb-4">
              This feature provides analytics on how your resume performs when shared with others.
            </Alert>
            
            <Row>
              <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <h2>23</h2>
                    <p>Views This Month</p>
                    <ProgressBar now={70} variant="success" />
                    <small className="text-success">↑ 15% from last month</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <h2>5</h2>
                    <p>Downloads</p>
                    <ProgressBar now={50} variant="info" />
                    <small className="text-info">↑ 2 more than last month</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card">
                  <Card.Body>
                    <h2>2:30</h2>
                    <p>Avg. Time Spent</p>
                    <ProgressBar now={80} variant="primary" />
                    <small className="text-primary">↑ 30 seconds improvement</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <div className="mt-4">
              <h4>Viewer Locations</h4>
              <Row>
                <Col md={6}>
                  <ul className="location-list">
                    <li><strong>New York, USA</strong> - 45%</li>
                    <li><strong>San Francisco, USA</strong> - 25%</li>
                    <li><strong>Toronto, Canada</strong> - 15%</li>
                    <li><strong>London, UK</strong> - 10%</li>
                    <li><strong>Other</strong> - 5%</li>
                  </ul>
                </Col>
                <Col md={6} className="d-flex justify-content-center">
                  <div className="map-placeholder">
                    <p className="text-center pt-5">Geographic View</p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Resume;
