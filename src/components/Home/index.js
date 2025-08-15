import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, CardGroup, NavDropdown, Modal, Button } from 'react-bootstrap';
import sword from '../../assets/images/sword.png';
import demoR from '../../assets/images/3dModels.png';
import './Home.css';
import SocialIcons from '../SocialIcons';

export const Home = () => {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  // feature: project filter ('all' | '3d' | 'vfx')
  const [filter, setFilter] = useState('all');
  // feature: back to top visibility
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Container fluid className="home-container">
      <Row>
        {/* Modal for 2014 Demo Reel */}
        <div>
          <>
            <Modal
              size="xl"
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
              className="custom-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
                  2014 Demo Reel
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Objects were modeled, UV unwrapped, and textured in Maya 3D software.
                  Sculpted in ZBrush and painted in Photoshop.
                  Post effects were done using Fusion.
                </p>
                <div className="ratio ratio-21x9">
                  <iframe
                    loading="lazy"
                    width="100%"
                    height="480"
                    src="https://www.youtube.com/embed/mPxmNbMpO7A?si=akRyOXO_rVHT5zDC"
                    title="2014 Demo Reel"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </Modal.Body>
            </Modal>
          </>
        </div>

        {/* Modal for VFX Reel 2024 */}
        <div>
          <>
            <Modal
              size="xl"
              show={lgShow1}
              onHide={() => setLgShow1(false)}
              aria-labelledby="example-modal-sizes-title-lg"
              className="custom-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
                  VFX Reel 2024
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Thank you for viewing my most recent reel. All objects were created in Blender.
                  After Effects was used for camera and motion tracking of the raw footage.
                </p>
                <div className="ratio ratio-16x9">
                  <iframe
                    loading="lazy"
                    width="100%"
                    height="480"
                    src="https://www.youtube.com/embed/mPxmNbMpO7A?si=Akv33m0cXFxl7nhV"
                    title="VFX Reel 2024"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  >
                  </iframe>
                </div>

                <br />
                <br />
                <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
                  Past VFX Projects
                </Modal.Title>
                <br />
                <p>
                  This VFX reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles,
                  and other aspects to help complete the project.
                  Photoshop and Maya were used predominantly.
                  <br />
                  <br />
                  Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
                  My job was to very precisely roto-scope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments.
                  This was accomplished utilizing Nuke primarily.
                </p>
                <div className="ratio ratio-16x9">
                  <iframe
                    loading="lazy"
                    width="100%"
                    height="480"
                    src="https://www.youtube.com/embed/tFwtXZw_VzM"
                    title="Past VFX Projects"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  >
                  </iframe>
                </div>
              </Modal.Body>
            </Modal>
          </>
        </div>

        {/* Introduction Section */}
        <Col xs={12} className="text-center intro-section">
          <h2 className="top_text"> Welcome to Nebula 3D</h2>
          <p className="top-p">
            My name is Colin Nebula, and I am a 3D Artist and a computer enthusiast. Thank you for visiting my online portfolio!
          </p>
          <div style={{ margin: '12px 0' }}>
            <a href="../documents/resume-cn-25.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary" title="Download resume" style={{ marginRight: 8 }}>
              Download Resume
            </a>
            <span style={{ marginLeft: 8 }}>Filter:</span>
            <div role="tablist" aria-label="Project filters" style={{ display: 'inline-block', marginLeft: 8 }}>
              <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('all')} aria-pressed={filter === 'all'} style={{ marginLeft: 6 }}>All</button>
              <button className={`btn btn-sm ${filter === '3d' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('3d')} aria-pressed={filter === '3d'} style={{ marginLeft: 6 }}>3D</button>
              <button className={`btn btn-sm ${filter === 'vfx' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('vfx')} aria-pressed={filter === 'vfx'} style={{ marginLeft: 6 }}>VFX</button>
            </div>
          </div>
          <NavDropdown.Divider />
        </Col>

        {/* Featured VFX Reel */}
        <Col xs={12} className="mb-4">
          <Card className="bg-dark text-white shadow-lg">
            <div className="ratio ratio-16x9"> {/* Changed to 16x9 for better responsiveness */}
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/mPxmNbMpO7A?si=akRyOXO_rVHT5zDC"
                title="VFX Blender Reel"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              >
              </iframe>
            </div>
            <Card.ImgOverlay>
              <Card.Title>VFX Blender Reel</Card.Title>
              <Card.Text>
                This is my most recent VFX reel created with Blender and After Effects.
              </Card.Text>
            </Card.ImgOverlay>
          </Card>
        </Col>

        {/* Portfolio Overview */}
        <Col xs={12} className="text-center portfolio-overview">
          <h2 className="middle_text"> Colin Nebula 3D Portfolio</h2>
          <p className="mid-p">
            3D modeling is a fun and continuous learning process: creating, animating, learning, and improving.
          </p>
          <NavDropdown.Divider />
        </Col>

        {/* Demo Reels Card Group */}
        <Col xs={12}>
          <CardGroup>
            { (filter === 'all' || filter === '3d') && (
              <Card className="overflow bg-dark text-white shadow-lg" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLgShow(true); }}
                role="button" aria-label="Open 3D Modeling Demo Reel">
                <Card.Img variant="top" src={demoR} className="card-image rounded" alt="Demo Reel" />
                <Card.Body>
                  <Card.Title>3D Modeling Demo Reel</Card.Title>
                  <Card.Text>
                    This demo reel showcases my 3D modeling and texturing skills using industry-standard software such as Blender, Zbrush, Photoshop, xNormal, and After Effects.
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button variant="outline-warning" onClick={() => setLgShow(true)} aria-label="View 3D reel">View Reel</Button>
                </Card.Footer>
              </Card>
            )}

            { (filter === 'all' || filter === 'vfx') && (
              <Card className="overflow bg-dark text-white shadow-lg" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLgShow1(true); }}
                role="button" aria-label="Open VFX Reel">
                <Card.Img variant="top" src={sword} className="card-image rounded" alt="VFX Reel" />
                <Card.Body>
                  <Card.Title>VFX Reel</Card.Title>
                  <Card.Text>
                    This VFX reel displays post-production effects and includes some of the work I was involved with at Intelligent Creatures Toronto.
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button variant="outline-warning" onClick={() => setLgShow1(true)} aria-label="View VFX reel">View Reel</Button>
                </Card.Footer>
              </Card>
            )}
          </CardGroup>
        </Col>
      </Row>

      <NavDropdown.Divider />

      {/* Footer Section */}
      <Container fluid className="footer">
        <Row>
          <Col md={12} className="text-center">
            <div className="rights">
              Colin Nebula
            </div>
          </Col>

          <Col xs={12} className="icons text-center">
            <SocialIcons />
          </Col>
        </Row>
      </Container>
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 30,
            zIndex: 999,
            padding: '10px 14px',
            borderRadius: 6,
            border: 'none',
            background: '#0ea5e9',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
          }}
        >
          ↑ Top
        </button>
      )}
    </Container>
  );
}

export default Home;