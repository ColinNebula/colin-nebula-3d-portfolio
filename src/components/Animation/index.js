
import React, {useState} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import shapeAnimation from '../../assets/images/shapeAnimation.png';
import rundown from '../../assets/images/rundown.png';
import rigging from '../../assets/images/rigging.png';
import { Card, Container, Button, Col, Row, CardGroup, NavDropdown, Modal } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';

function Animation() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);

    return (
        <Container fluid>
            <Row>

        <div>
        <>
      <Modal
        size="xxl-down"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Free Rider Animation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          A short low budget animated film made completely in blender. Very low polygon count for the whole project. 
          Objects were placed in the scene using Blenders particle engine
          </p>

          <div className="ratio ratio-16x9">
          <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/N2WhwHaicR4?si=oH6JWh_VnC-jWj0H" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

      <div>
      <>
      <Modal
        size="xl"
        show={lgShow1}
        onHide={() => setLgShow1(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Facial Rigging Demo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          A short facial rigging demo. Maya was used to model, uv, texture, and rig character. 
          Zbrush was used to add details. 
          Xnormal was used to extract the normal map.

          </p>
          <div className="ratio ratio-16x9">
          <iframe 
          width="640" 
          height="360" 
          src="https://www.youtube.com/embed/lIrnDytiNxA" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <div>
      <>
      <Modal
        size="xl"
        show={lgShow2}
        onHide={() => setLgShow2(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            2D Shape Animation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          This is a short 2D animation using different shapes. 
          Adobe After Effects is the software used in the project.
          
          

          </p>
          <div className="ratio ratio-16x9">
          <iframe width="560" height="315" 
          src="https://www.youtube.com/embed/FVVFcjpg5eA" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>
        
        </Modal.Body>
      </Modal>
    </>
        </div>
            <h2 class="top_text"> Animation and Video Renders</h2>
            <p class="top-p">Videos are rendered though a 3D software and worked on in post production for added effects</p>
            <NavDropdown.Divider />
                <Col ms={"auto"}>
                <CardGroup>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={rundown} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title className="ti-tle">Short Film</Card.Title>
                    <Card.Text>
                    A short film created using only Blender 
                    
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-warning" size="sm" onClick={() => setLgShow(true)}>View video here</Button>{' '}
                    
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
        
        </Col>
      </Row>
      <br />
      <NavDropdown.Divider />

      <Container fluid>
      <Row>
      <div class="col-md-12">
    <div class="rights">
    Colin Nebula 
    </div>
    </div>
    <br />
    <br />
    <Col className="icons">
    <div className="bottom">
    <SocialIcon url="https://github.com/ColinNebula" network="github" bgColor="#2a9d8f" />

    <SocialIcon url="https://www.linkedin.com/in/colin-nebula-07176022/" network="linkedin" />

    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" bgColor="#e63946" />
    </div>
    
    </Col>
    </Row>

    </Container>
    </Container>
    )
}

export default Animation;
