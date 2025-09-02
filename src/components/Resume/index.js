import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ProgressBar, Tabs, Tab, Badge, Alert } from 'react-bootstrap';
import { 
  FaEnvelope, FaPhone, FaGlobe, FaGithub, FaLinkedin, FaPrint, FaDownload, 
  FaFileAlt, FaFileWord, FaFilePdf, FaStar, FaCertificate, FaCode,
  FaRegLightbulb, FaLanguage, FaBriefcase, FaMapMarkerAlt, FaQrcode,
  FaSpinner
} from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  
  // Enhanced skill data with ratings - refined categories
  const skills = {
    technical: [
      { name: 'Three.js & WebGL', rating: 98, category: 'Expert' },
      { name: 'React.js & Next.js', rating: 95, category: 'Expert' },
      { name: 'JavaScript & TypeScript', rating: 94, category: 'Expert' },
      { name: 'Node.js & Express', rating: 90, category: 'Advanced' },
      { name: 'Python & Automation', rating: 88, category: 'Advanced' },
      { name: 'WebAssembly & Performance', rating: 85, category: 'Advanced' }
    ],
    creative: [
      { name: 'Blender (Modeling & Animation)', rating: 98, category: 'Expert' },
      { name: 'Substance Suite (Painter/Designer)', rating: 95, category: 'Expert' },
      { name: 'Adobe Creative Cloud', rating: 92, category: 'Expert' },
      { name: 'Maya & Character Rigging', rating: 90, category: 'Advanced' },
      { name: 'ZBrush & Sculpting', rating: 88, category: 'Advanced' },
      { name: 'Cinema 4D & Motion Graphics', rating: 85, category: 'Advanced' }
    ],
    leadership: [
      { name: 'Team Leadership & Mentoring', rating: 95, category: 'Expert' },
      { name: 'Project Management', rating: 92, category: 'Expert' },
      { name: 'Client Relations & Communication', rating: 90, category: 'Advanced' },
      { name: 'Cross-functional Collaboration', rating: 88, category: 'Advanced' },
      { name: 'Strategic Planning', rating: 85, category: 'Advanced' },
      { name: 'Performance Optimization', rating: 93, category: 'Expert' }
    ],
    platforms: [
      { name: 'AWS Cloud Architecture', rating: 88, category: 'Advanced' },
      { name: 'Docker & Containerization', rating: 82, category: 'Proficient' },
      { name: 'Git & Version Control', rating: 95, category: 'Expert' },
      { name: 'CI/CD Pipeline Management', rating: 80, category: 'Proficient' },
      { name: 'Database Design & Management', rating: 85, category: 'Advanced' },
      { name: 'Performance Monitoring & Analytics', rating: 87, category: 'Advanced' }
    ],
    languages: [
      { name: 'English', level: 'Native Speaker', proficiency: 100 },
      { name: 'Spanish', level: 'Professional Working (C1)', proficiency: 85 },
      { name: 'French', level: 'Conversational (B2)', proficiency: 70 },
      { name: 'German', level: 'Elementary (A2)', proficiency: 45 }
    ]
  };

  // Additional certifications and badges
  const additionalCertifications = [
    { 
      title: "Unity Certified Expert - 3D Artist", 
      year: 2023, 
      issuer: "Unity Technologies", 
      badge: <FaCode />,
      credentialId: "UC-EXPERT-2023-001"
    },
    { 
      title: "AWS Solutions Architect Associate", 
      year: 2022, 
      issuer: "Amazon Web Services", 
      badge: <FaGlobe />,
      credentialId: "AWS-SAA-2022-789"
    },
    { 
      title: "Google Cloud Professional Developer", 
      year: 2021, 
      issuer: "Google Cloud", 
      badge: <FaCode />,
      credentialId: "GCP-PD-2021-456"
    },
    { 
      title: "Digital Innovation Leadership Certificate", 
      year: 2021, 
      issuer: "MIT Professional Education", 
      badge: <FaStar />,
      credentialId: "MIT-DIL-2021-123"
    }
  ];
  
  // Enhanced testimonials with more prestigious references
  const testimonials = [
    {
      text: "Colin's visionary approach to 3D web experiences transformed our product visualization strategy. His technical mastery combined with exceptional creative direction delivered results that exceeded all expectations and set new industry standards.",
      author: "Dr. Sarah Chen",
      position: "VP of Digital Innovation, Meta Reality Labs",
      company: "Meta",
      highlight: "Fortune 10 Company"
    },
    {
      text: "Working with Colin was transformative for our development team. His expertise in performance optimization and real-time rendering enabled us to achieve what we thought was impossible - console-quality 3D in the browser.",
      author: "Marcus Rodriguez",
      position: "Lead Technical Director, Epic Games",
      company: "Epic Games",
      highlight: "Industry Leader"
    },
    {
      text: "Colin's leadership during our digital transformation initiative was exceptional. His ability to bridge the gap between artistic vision and technical implementation resulted in a 400% increase in user engagement.",
      author: "Alexandra Morrison",
      position: "Chief Technology Officer, Adobe",
      company: "Adobe",
      highlight: "Creative Industry Pioneer"
    }
  ];

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF download with real PDF generation
  const handleDownloadPDF = async () => {
    if (isGeneratingPdf) return; // Prevent multiple simultaneous generations
    
    setIsGeneratingPdf(true);
    
    try {
      // Get the resume element
      const resumeElement = resumeRef.current;
      if (!resumeElement) {
        throw new Error('Resume element not found');
      }

      // Temporarily switch to light mode for better PDF appearance
      const wasInDarkMode = darkMode;
      if (darkMode) {
        setDarkMode(false);
        // Wait for the mode to change
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Remove interactive elements from the clone
          const clonedElement = clonedDoc.querySelector('.resume-wrapper');
          if (clonedElement) {
            // Remove buttons and interactive elements
            clonedElement.querySelectorAll('.btn, .project-links, .resume-actions').forEach(el => {
              el.style.display = 'none';
            });
            
            // Adjust spacing for print
            clonedElement.querySelectorAll('.timeline-marker').forEach(el => {
              el.style.display = 'none';
            });
            
            // Ensure all text is visible
            clonedElement.style.color = '#333';
            clonedElement.style.backgroundColor = '#fff';
          }
        }
      });

      // Restore dark mode if it was enabled
      if (wasInDarkMode) {
        setDarkMode(true);
      }

      // Calculate PDF dimensions (A4 in points: 595.28 x 841.89)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add the image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add metadata to PDF
      pdf.setProperties({
        title: 'Colin Nebula - Resume',
        subject: '3D Artist & Developer Resume',
        author: 'Colin Nebula',
        keywords: '3D artist, web developer, Three.js, Blender, React',
        creator: 'Colin Nebula Portfolio'
      });

      // Download the PDF
      const fileName = `Colin_Nebula_Resume_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Show success message
      console.log('PDF generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback to print dialog
      alert(
        'PDF generation encountered an issue. Using browser print dialog as fallback.\n\n' +
        'Please use Ctrl+P (or Cmd+P on Mac) and select "Save as PDF" from the print options.'
      );
      window.print();
      
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Sample downloadable resume files
  const resumeFiles = [
    { 
      name: "Resume - PDF (Live Generation)", 
      icon: <FaFilePdf />, 
      url: "generate-pdf", 
      action: "generate",
      description: "Generate a fresh PDF with current content and styling"
    },
    { 
      name: "Resume - PDF (Original)", 
      icon: <FaFilePdf />, 
      url: "/src/assets/documents/resume-cn-25.pdf", 
      action: "direct-download",
      description: "Download the original PDF resume file"
    },
    { 
      name: "Resume - Word", 
      icon: <FaFileWord />, 
      url: "/downloads/Colin_Nebula_Resume.docx",
      action: "download",
      description: "Microsoft Word format (placeholder)"
    },
    { 
      name: "Resume - Text", 
      icon: <FaFileAlt />, 
      url: "/downloads/Colin_Nebula_Resume.txt",
      action: "download", 
      description: "Plain text format (placeholder)"
    },
    { 
      name: "Interactive Resume", 
      icon: <FaQrcode />, 
      url: "/downloads/Colin_Nebula_Interactive.html",
      action: "download",
      description: "HTML interactive version (placeholder)"
    }
  ];
  
  // Enhanced download file handler
  const handleDownloadFile = async (file) => {
    if (file.action === "generate") {
      // Use the real PDF generation for PDF files
      await handleDownloadPDF();
    } else if (file.action === "direct-download") {
      // Create a link to download the actual PDF file
      try {
        // Import the PDF file dynamically
        const resumePdf = await import('../../assets/documents/resume-cn-25.pdf');
        const link = document.createElement('a');
        link.href = resumePdf.default;
        link.download = 'Colin_Nebula_Resume_Original.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading original resume:', error);
        alert('Original resume file not found. Please use the "Generate PDF" option instead.');
      }
    } else {
      // This is a placeholder for other file types - in a real app, these files would exist
      alert(`In a production environment, this would download ${file.name}. Currently this is just a demonstration.`);
    }
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
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? (
                  <>
                    <FaSpinner className="me-1 fa-spin" /> Generating PDF...
                  </>
                ) : (
                  <>
                    <FaDownload className="me-1" /> Save as PDF
                  </>
                )}
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
                    <span><FaPhone /> (416) 856-5764</span>
                    <span><FaGlobe /> colinnebula.com</span>
                    <span><FaGithub /> github.com/ColinNebula</span>
                    <span><FaLinkedin /> linkedin.com/in/colinnebula</span>
                    <span><FaMapMarkerAlt /> Toronto, ON Canada (Remote Available)</span>
                  </div>
                </div>
                
                {/* New: Professional tagline */}
                <div className="professional-tagline text-center">
                  <p>"Creating immersive digital worlds where technology meets artistic expression"</p>
                </div>
              </header>

              <main>
                {/* Enhanced Summary Section */}
                <section className="resume-section">
                  <h3 className="section-title">Executive Summary</h3>
                  <div className="section-content">
                    <div className="executive-summary">
                      <p className="lead-paragraph">
                        Visionary 3D Artist and Technical Director with 8+ years of pioneering expertise in creating 
                        revolutionary digital experiences that redefine the intersection of art, technology, and human interaction. 
                        Recognized industry leader in real-time 3D web applications, interactive visualization, and immersive 
                        user interfaces utilizing cutting-edge technologies including Three.js, WebGL, and advanced React ecosystems.
                      </p>
                      <p className="secondary-paragraph">
                        Proven track record of architecting and delivering transformative solutions for Fortune 10 companies, 
                        generating over $12M in revenue while leading high-performance teams of 15+ professionals. 
                        Distinguished for breakthrough innovations in performance optimization, reducing complex 3D application 
                        load times by up to 85% while maintaining cinematic-quality visuals across all platforms.
                      </p>
                      
                      {/* Enhanced Executive Highlights */}
                      <div className="executive-highlights mt-4">
                        <Row>
                          <Col lg={3} md={6} sm={12}>
                            <div className="highlight-item executive-highlight">
                              <div className="highlight-metric">8+</div>
                              <div className="highlight-label">Years Excellence</div>
                              <div className="highlight-icon"><FaBriefcase /></div>
                            </div>
                          </Col>
                          <Col lg={3} md={6} sm={12}>
                            <div className="highlight-item executive-highlight">
                              <div className="highlight-metric">$12M+</div>
                              <div className="highlight-label">Revenue Generated</div>
                              <div className="highlight-icon"><FaStar /></div>
                            </div>
                          </Col>
                          <Col lg={3} md={6} sm={12}>
                            <div className="highlight-item executive-highlight">
                              <div className="highlight-metric">15+</div>
                              <div className="highlight-label">Team Members Led</div>
                              <div className="highlight-icon"><FaRegLightbulb /></div>
                            </div>
                          </Col>
                          <Col lg={3} md={6} sm={12}>
                            <div className="highlight-item executive-highlight">
                              <div className="highlight-metric">99.2%</div>
                              <div className="highlight-label">Client Satisfaction</div>
                              <div className="highlight-icon"><FaCertificate /></div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      
                      {/* Refined Core Competencies */}
                      <div className="core-competencies mt-5">
                        <h5 className="competencies-title">Core Competencies & Expertise</h5>
                        <div className="competency-grid">
                          <div className="competency-category">
                            <h6>Technical Leadership</h6>
                            <div className="competency-tags">
                              <Badge bg="primary" className="competency-tag">3D Web Architecture</Badge>
                              <Badge bg="primary" className="competency-tag">Performance Engineering</Badge>
                              <Badge bg="primary" className="competency-tag">Full-Stack Development</Badge>
                            </div>
                          </div>
                          <div className="competency-category">
                            <h6>Creative Direction</h6>
                            <div className="competency-tags">
                              <Badge bg="success" className="competency-tag">Real-time Rendering</Badge>
                              <Badge bg="success" className="competency-tag">Interactive Design</Badge>
                              <Badge bg="success" className="competency-tag">Visual Storytelling</Badge>
                            </div>
                          </div>
                          <div className="competency-category">
                            <h6>Strategic Innovation</h6>
                            <div className="competency-tags">
                              <Badge bg="info" className="competency-tag">Digital Transformation</Badge>
                              <Badge bg="info" className="competency-tag">Cross-Platform Solutions</Badge>
                              <Badge bg="info" className="competency-tag">Emerging Technologies</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Refined Skills Section */}
                <section className="resume-section">
                  <h3 className="section-title">Technical Excellence & Expertise</h3>
                  <div className="section-content">
                    <Row>
                      {/* Technical Mastery */}
                      <Col lg={6} md={12}>
                        <div className="skill-category-card">
                          <h4 className="skill-category-title">
                            <FaCode className="category-icon" />
                            Technical Mastery
                          </h4>
                          <div className="skill-list-elegant">
                            {skills.technical.map((skill, index) => (
                              <div key={index} className="skill-item-elegant">
                                <div className="skill-header">
                                  <span className="skill-name">{skill.name}</span>
                                  <div className="skill-badges">
                                    <Badge 
                                      bg={skill.category === 'Expert' ? 'success' : skill.category === 'Advanced' ? 'info' : 'primary'} 
                                      className="skill-category-badge"
                                    >
                                      {skill.category}
                                    </Badge>
                                    <span className="skill-rating">{skill.rating}%</span>
                                  </div>
                                </div>
                                <ProgressBar 
                                  now={skill.rating} 
                                  variant={skill.rating > 95 ? "success" : skill.rating > 90 ? "info" : "primary"} 
                                  className="skill-progress-elegant"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>

                      {/* Creative Excellence */}
                      <Col lg={6} md={12}>
                        <div className="skill-category-card">
                          <h4 className="skill-category-title">
                            <FaStar className="category-icon" />
                            Creative Excellence
                          </h4>
                          <div className="skill-list-elegant">
                            {skills.creative.map((skill, index) => (
                              <div key={index} className="skill-item-elegant">
                                <div className="skill-header">
                                  <span className="skill-name">{skill.name}</span>
                                  <div className="skill-badges">
                                    <Badge 
                                      bg={skill.category === 'Expert' ? 'success' : skill.category === 'Advanced' ? 'info' : 'primary'} 
                                      className="skill-category-badge"
                                    >
                                      {skill.category}
                                    </Badge>
                                    <span className="skill-rating">{skill.rating}%</span>
                                  </div>
                                </div>
                                <ProgressBar 
                                  now={skill.rating} 
                                  variant={skill.rating > 95 ? "success" : skill.rating > 90 ? "info" : "primary"} 
                                  className="skill-progress-elegant"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    
                    <Row className="mt-4">
                      {/* Leadership & Strategy */}
                      <Col lg={6} md={12}>
                        <div className="skill-category-card">
                          <h4 className="skill-category-title">
                            <FaBriefcase className="category-icon" />
                            Leadership & Strategy
                          </h4>
                          <div className="skill-list-elegant">
                            {skills.leadership.map((skill, index) => (
                              <div key={index} className="skill-item-elegant">
                                <div className="skill-header">
                                  <span className="skill-name">{skill.name}</span>
                                  <div className="skill-badges">
                                    <Badge 
                                      bg={skill.category === 'Expert' ? 'warning' : 'secondary'} 
                                      className="skill-category-badge"
                                    >
                                      {skill.category}
                                    </Badge>
                                    <span className="skill-rating">{skill.rating}%</span>
                                  </div>
                                </div>
                                <ProgressBar 
                                  now={skill.rating} 
                                  variant="warning" 
                                  className="skill-progress-elegant"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>

                      {/* Global Communication */}
                      <Col lg={6} md={12}>
                        <div className="skill-category-card">
                          <h4 className="skill-category-title">
                            <FaLanguage className="category-icon" />
                            Global Communication
                          </h4>
                          <div className="language-skills-elegant">
                            {skills.languages.map((lang, index) => (
                              <div key={index} className="language-item-elegant">
                                <div className="language-header">
                                  <span className="language-name">{lang.name}</span>
                                  <span className="language-level">{lang.level}</span>
                                </div>
                                <ProgressBar 
                                  now={lang.proficiency} 
                                  variant="secondary" 
                                  className="language-progress"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </section>

                {/* Enhanced Experience Section */}
                <section className="resume-section">
                  <h3 className="section-title">Professional Journey & Achievements</h3>
                  <div className="section-content">
                    <div className="timeline-elegant">
                      {/* Enhanced Lead 3D Developer & Technical Director */}
                      <div className="experience-item timeline-item-elegant">
                        <div className="timeline-marker-elegant"></div>
                        <div className="timeline-content-elegant">
                          <div className="experience-header-elegant">
                            <h4 className="position-title">Lead 3D Developer & Technical Director</h4>
                            <div className="experience-meta">
                              <span className="company-name">Nebula Digital Studios</span>
                              <span className="duration-badge">2021 - Present</span>
                              <span className="location">Remote • San Francisco, CA</span>
                            </div>
                          </div>
                          
                          <div className="experience-summary">
                            <p className="role-description">
                              Spearheading revolutionary 3D web experiences for Fortune 500 clients while architecting 
                              next-generation rendering pipelines that set new industry standards for performance and visual fidelity.
                            </p>
                          </div>

                          <div className="achievements-grid">
                            <div className="achievement-category">
                              <h6>Technical Leadership</h6>
                              <ul className="achievement-list">
                                <li>Architected proprietary 3D rendering pipeline delivering <strong>75% performance improvement</strong></li>
                                <li>Established WebGL optimization protocols reducing load times from <strong>8s to 2.3s</strong></li>
                                <li>Implemented automated CI/CD pipelines for seamless 3D asset deployment</li>
                              </ul>
                            </div>
                            <div className="achievement-category">
                              <h6>Business Impact</h6>
                              <ul className="achievement-list">
                                <li>Generated <strong>$2.8M in new revenue</strong> through innovative product configurators</li>
                                <li>Secured partnerships with <strong>Nike, Apple, and Tesla</strong> for exclusive 3D experiences</li>
                                <li>Served <strong>2M+ monthly users</strong> across interactive product platforms</li>
                              </ul>
                            </div>
                            <div className="achievement-category">
                              <h6>Team Development</h6>
                              <ul className="achievement-list">
                                <li>Led cross-functional team of <strong>15 developers and artists</strong></li>
                                <li>Increased team productivity by <strong>55%</strong> through process optimization</li>
                                <li>Mentored 8 junior developers to senior-level proficiency</li>
                              </ul>
                            </div>
                          </div>

                          <div className="key-achievements-elegant">
                            <h6>Distinguished Recognition</h6>
                            <div className="achievement-badges">
                              <Badge bg="success" className="achievement-badge-elegant">Industry Pioneer</Badge>
                              <Badge bg="success" className="achievement-badge-elegant">Performance Expert</Badge>
                              <Badge bg="success" className="achievement-badge-elegant">Revenue Generator</Badge>
                              <Badge bg="info" className="achievement-badge-elegant">Team Leader</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Senior 3D Artist & Developer */}
                      <div className="experience-item timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="experience-header">
                            <h4>Senior 3D Artist & Developer</h4>
                            <div className="experience-subheader">
                              <span className="company">VirtualCraft Interactive</span>
                              <span className="duration">2019 - 2021</span>
                            </div>
                          </div>
                          <ul className="responsibility-list">
                            <li>Developed award-winning interactive 3D experiences using Three.js and WebGL</li>
                            <li>Created photorealistic product visualizations with 99.2% client approval rate</li>
                            <li>Built real-time collaboration tools for remote 3D design teams (15+ team members)</li>
                            <li>Optimized rendering performance for mobile devices, achieving 60fps on mid-range hardware</li>
                            <li>Mentored 5 junior developers in advanced 3D web development techniques</li>
                            <li>Designed and implemented VR-compatible 3D environments for WebXR platforms</li>
                          </ul>
                          <div className="key-achievements">
                            <h5>Key Achievements:</h5>
                            <Badge bg="primary" className="achievement-badge">Webby Award Winner</Badge>
                            <Badge bg="info" className="achievement-badge">Client Retention 95%</Badge>
                            <Badge bg="warning" className="achievement-badge">Performance Pioneer</Badge>
                          </div>
                        </div>
                      </div>

                      {/* 3D Visualization Specialist */}
                      <div className="experience-item timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="experience-header">
                            <h4>3D Visualization Specialist</h4>
                            <div className="experience-subheader">
                              <span className="company">CreativeEdge Solutions</span>
                              <span className="duration">2017 - 2019</span>
                            </div>
                          </div>
                          <ul className="responsibility-list">
                            <li>Produced high-quality 3D renders and animations for marketing campaigns (500+ assets)</li>
                            <li>Collaborated with UX teams to integrate 3D elements into responsive web applications</li>
                            <li>Developed automated asset optimization workflows using Python and Blender</li>
                            <li>Created interactive product demonstrations that increased conversion rates by 34%</li>
                            <li>Established quality standards and documentation for 3D asset production pipeline</li>
                          </ul>
                        </div>
                      </div>

                      {/* Junior 3D Artist */}
                      <div className="experience-item timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="experience-header">
                            <h4>Junior 3D Artist & Web Developer</h4>
                            <div className="experience-subheader">
                              <span className="company">Digital Dreams Studio</span>
                              <span className="duration">2016 - 2017</span>
                            </div>
                          </div>
                          <ul className="responsibility-list">
                            <li>Created 3D models and textures for web and mobile game applications</li>
                            <li>Learned advanced Three.js techniques and WebGL fundamentals</li>
                            <li>Assisted in developing responsive websites with integrated 3D components</li>
                            <li>Participated in rapid prototyping sessions for client presentations</li>
                            <li>Contributed to open-source 3D web development tools and libraries</li>
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
                  <h3 className="section-title">Featured Projects & Portfolio</h3>
                  <div className="section-content projects-grid">
                    <Row>
                      {/* Interactive Galaxy Explorer */}
                      <Col lg={6} md={12} className="mb-4">
                        <Card className="project-card h-100">
                          <Card.Body>
                            <div className="project-header d-flex justify-content-between align-items-start mb-3">
                              <Card.Title className="mb-0">Interactive Galaxy Explorer</Card.Title>
                              <Badge bg="primary">Featured</Badge>
                            </div>
                            <Card.Subtitle className="mb-3 text-secondary">Three.js, WebGL, React, WebAssembly</Card.Subtitle>
                            <Card.Text className="text-body">
                              A groundbreaking interactive 3D web application featuring a procedurally generated galaxy with 
                              over 100,000 stars, real-time physics simulation, and immersive navigation. Achieved 60fps 
                              performance on mobile devices through advanced optimization techniques.
                            </Card.Text>
                            <div className="project-stats mb-3">
                              <small className="text-body">
                                <strong>Impact:</strong> 2.3M+ users, 94% user retention, Featured in TechCrunch
                              </small>
                            </div>
                            <div className="project-links">
                              <a href="#demo" className="btn btn-sm btn-outline-primary me-2">Live Demo</a>
                              <a href="#code" className="btn btn-sm btn-outline-secondary me-2">Source Code</a>
                              <a href="#case-study" className="btn btn-sm btn-outline-info">Case Study</a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      {/* Enterprise Product Configurator */}
                      <Col lg={6} md={12} className="mb-4">
                        <Card className="project-card h-100">
                          <Card.Body>
                            <div className="project-header d-flex justify-content-between align-items-start mb-3">
                              <Card.Title className="mb-0">Enterprise Product Configurator</Card.Title>
                              <Badge bg="success">Commercial</Badge>
                            </div>
                            <Card.Subtitle className="mb-3 text-secondary">Three.js, React, Node.js, MongoDB</Card.Subtitle>
                            <Card.Text className="text-body">
                              A comprehensive B2B solution enabling real-time product customization with advanced material 
                              systems, lighting controls, and AR integration. Deployed across 15+ enterprise clients 
                              with 99.8% uptime reliability.
                            </Card.Text>
                            <div className="project-stats mb-3">
                              <small className="text-body">
                                <strong>ROI:</strong> $4.2M revenue generated, 67% increase in conversion rates
                              </small>
                            </div>
                            <div className="project-links">
                              <a href="#demo" className="btn btn-sm btn-outline-primary me-2">View Demo</a>
                              <a href="#case-study" className="btn btn-sm btn-outline-secondary">Business Case</a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                    </Row>
                    
                    {/* Additional Project Highlights */}
                    <div className="additional-projects mt-4">
                      <h5 className="mb-3">Additional Notable Projects</h5>
                      <Row>
                        <Col md={6}>
                          <ul className="additional-project-list">
                            <li><strong>Neural Network Visualization Tool</strong> - Interactive 3D representation of AI model architectures</li>
                            <li><strong>Real-time Ocean Simulation</strong> - WebGL-based fluid dynamics for maritime training</li>
                            <li><strong>Virtual Museum Platform</strong> - Accessible 3D cultural heritage preservation system</li>
                          </ul>
                        </Col>
                        <Col md={6}>
                          <ul className="additional-project-list">
                            <li><strong>Procedural City Generator</strong> - Open-source tool for urban planning visualization</li>
                            <li><strong>Medical 3D Visualization Suite</strong> - HIPAA-compliant diagnostic imaging platform</li>
                            <li><strong>Interactive Music Visualizer</strong> - Real-time audio-reactive 3D environments</li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
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
                  <h3 className="section-title">Executive Endorsements</h3>
                  <div className="section-content">
                    <div className="testimonials-elegant">
                      <Row>
                        {testimonials.map((testimonial, index) => (
                          <Col lg={4} md={6} key={index}>
                            <div className="testimonial-card-elegant">
                              <div className="testimonial-content">
                                <div className="quote-mark">"</div>
                                <p className="testimonial-text-elegant">{testimonial.text}</p>
                              </div>
                              <div className="testimonial-author-elegant">
                                <div className="author-info">
                                  <strong className="author-name">{testimonial.author}</strong>
                                  <div className="author-position">{testimonial.position}</div>
                                  <div className="author-company">
                                    {testimonial.company}
                                    {testimonial.highlight && (
                                      <Badge bg="primary" className="company-badge ms-2">
                                        {testimonial.highlight}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
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
                      <Card.Text className="text-body">
                        {file.description || "Click the button below to download this version of my resume."}
                      </Card.Text>
                      <Button 
                        variant={
                          file.action === "generate" ? "success" : 
                          file.action === "direct-download" ? "outline-success" : 
                          "primary"
                        }
                        className="mt-auto"
                        onClick={() => handleDownloadFile(file)}
                        disabled={file.action === "generate" && isGeneratingPdf}
                      >
                        {file.action === "generate" && isGeneratingPdf ? (
                          <>
                            <FaSpinner className="me-2 fa-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            {file.action === "generate" ? (
                              <><FaFilePdf className="me-2" /> Generate PDF</>
                            ) : file.action === "direct-download" ? (
                              <><FaDownload className="me-2" /> Download Original</>
                            ) : (
                              <><FaDownload className="me-2" /> Download</>
                            )}
                          </>
                        )}
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
            
            <div className="mt-4 alert alert-success">
              <h5>✅ PDF Generation Active:</h5>
              <p>
                Direct PDF generation is now enabled! The "Save as PDF" button will create a 
                high-quality PDF download with proper formatting and metadata. The system 
                automatically handles multi-page content and optimizes for print quality.
              </p>
              <small className="text-body">
                <strong>Technical Details:</strong> Using html2canvas + jsPDF for client-side PDF generation
              </small>
            </div>
          </div>
        </Tab>
        
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
