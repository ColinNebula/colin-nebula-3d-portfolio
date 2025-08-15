import React, {useState, useEffect} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import shapeAnimation from '../../assets/images/shapeAnimation.png';
import rundown from '../../assets/images/rundown.png';
import rigging from '../../assets/images/rigging.png';
import { Card, Container, Button, Col, Row, CardGroup, NavDropdown, Modal } from 'react-bootstrap';
import SocialIcons from '../SocialIcons';

function Animation() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);

  const [showTop, setShowTop] = useState(false);
  
    useEffect(() => {
      const onScroll = () => setShowTop(window.scrollY > 240);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Container fluid>
            <Row>

        <div>
        <>
      <Modal
        fullscreen={true}
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="modal-free-rider-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-free-rider-title">
            Free Rider Animation
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          A short low budget animated film made completely in blender. Very low polygon count for the whole project. 
          Objects were placed in the scene using Blenders particle engine
          </p>

          <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
            <iframe
              title="Free Rider Animation video"
              src="https://www.youtube.com/embed/N2WhwHaicR4?si=oH6JWh_VnC-jWj0H"
              width="100%"
              height="640"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
         
         </Modal.Body>
       </Modal>
     </>
         </div>

      <div>
      <>
      <Modal
        fullscreen={true}
        show={lgShow1}
        onHide={() => setLgShow1(false)}
        aria-labelledby="modal-rigging-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-rigging-title">
            Facial Rigging Demo
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          A short facial rigging demo. Maya was used to model, uv, texture, and rig character. 
          Zbrush was used to add details. 
          Xnormal was used to extract the normal map.

          </p>
                <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
                  <iframe
                    title="Facial Rigging Demo video"
                    src="https://www.youtube.com/embed/lIrnDytiNxA"
                    width="100%"
                    height="640"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <div>
      <>
      <Modal
        fullscreen={true}
        show={lgShow2}
        onHide={() => setLgShow2(false)}
        aria-labelledby="modal-shape-animation-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-shape-animation-title">
            2D Shape Animation
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          This is a short 2D animation using different shapes. 
          Adobe After Effects is the software used in the project.
          
          

          </p>
          <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
            <iframe
              title="2D Shape Animation video"
              src="https://www.youtube.com/embed/FVVFcjpg5eA"
              width="100%"
              height="640"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <div>
      <>
      <Modal
        fullscreen={true}
        show={lgShow3}
        onHide={() => setLgShow3(false)}
        aria-labelledby="modal-bouncing-ball-title"
      >
         <Modal.Header closeButton>
          <Modal.Title id="modal-bouncing-ball-title">
            2D Shape Animation
          </Modal.Title>
         </Modal.Header>
         <Modal.Body>
          <p>
          This is a short 2D animation using different shapes. 
          Adobe After Effects is the software used in the project.
          
          

          </p>
          <div className="ratio ratio-16x9" style={{ minHeight: 360 }}>
            <iframe
              title="Bouncing Ball video"
              src="https://www.youtube.com/embed/FVVFcjpg5eA"
              width="100%"
              height="640"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

            <h2 className="top_text"> Animation and Video Renders</h2>
            <p className="top-p">Videos are rendered through 3D software and worked on in post production for added effects</p>
            <NavDropdown.Divider />
                <Col ms={"auto"}>
                <CardGroup>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={rundown} className="rounded" 
                  alt="Short Film thumbnail" />
                  <Card.Body>
                    <Card.Title className="ti-tle">Short Film</Card.Title>
                    <Card.Text>
                    A short film created using only Blender 
                    
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button aria-label="Open Short Film modal" variant="outline-warning" size="sm" onClick={() => setLgShow(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                  <br/>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={rigging} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title className="ti-tle">Lip Sync and Rigging</Card.Title>
                    <Card.Text>
                    Facial Rigging demo 
                    using Maya to model, UV, texture, and rig the character
                    {' '}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-warning" size="sm"onClick={() => setLgShow1(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                  <br/>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
                  <Card.Img variant="top" src={shapeAnimation} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title className="ti-tle">2D Shape Animation</Card.Title>
                    <Card.Text>
                      Simple shapes and lines animation in After Effects
                      
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-warning" size="sm" onClick={() => setLgShow2(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                  <br/>
                </Card>
                
              </CardGroup>
              <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
              <Card.Img variant="top" src={shapeAnimation} className="rounded" 
              alt="Card image" />
              <Card.Body>
                <Card.Title className="ti-tle">The Bouncing Ball</Card.Title>
                <Card.Text>
                  Simple ball bounce animation to showcase my animation skills
                  
                </Card.Text>
              </Card.Body>
              <Card.Footer>
              <Button variant="outline-warning" size="sm" onClick={() => setLgShow3(true)}>View video here</Button>{' '}
                
              </Card.Footer>
              <br/>
            </Card>
              <CardGroup>

              </CardGroup>
        
        </Col>
      </Row>
      <br />
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
    )
}


export default Animation;
