
import React, {useState} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import shapeAnimation from '../../assets/images/shapeAnimation.png';
import logoD from '../../assets/images/logoD.png';
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
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Logo Animation Demo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          A short logo animation demo. 
          Maya was used to model, uv, texture the objects.
          Adobe After Effects was used to create color textures.

          </p>
          <iframe width="640" height="360" src="https://www.youtube.com/embed/WcK6dYu5yI0" 
          title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

      <div>
      <>
      <Modal
        size="lg"
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
          <iframe width="640" height="360" 
          src="https://www.youtube.com/embed/lIrnDytiNxA" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <div>
      <>
      <Modal
        size="lg"
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
          <iframe width="560" height="315" 
          src="https://www.youtube.com/embed/FVVFcjpg5eA" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
        
        </Modal.Body>
      </Modal>
    </>
        </div>
            <h2 class="top_text"> Animation and video renders</h2>
            <p class="top-p">Videos are rendered though a 3D software and worked on in post production, for added effects.</p>
            <NavDropdown.Divider />
                <Col ms={"auto"}>
                <CardGroup>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={logoD} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>Logo Animation</Card.Title>
                    <Card.Text>
                    A 3D model logo. 
                    Maya was used to model, uv, and texture the object.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-primary" size="sm" onClick={() => setLgShow(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={rigging} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>Lip sync and rigging</Card.Title>
                    <Card.Text>
                    Facial rigging demo. 
                    Maya was used to model, uv, texture, and rig character.
                    {' '}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-primary" size="sm"onClick={() => setLgShow1(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
                  <Card.Img variant="top" src={shapeAnimation} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>2D Shape Animation</Card.Title>
                    <Card.Text>
                      Utilizing shapes and lines to  
                      Blender was used to model, uv, and texture the object.
                      
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-primary" size="sm" onClick={() => setLgShow2(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                </Card>
              </CardGroup>
        
        </Col>
      </Row>
      <br />
      <NavDropdown.Divider />
      <div>
    <SocialIcon url="https://github.com/ColinNebula" network="github" bgColor="#2a9d8f" />

    <SocialIcon url="https://www.linkedin.com/in/colin-nebula-07176022/" network="linkedin" />

    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" bgColor="#e63946" />
    </div>
    </Container>
    )
}

export default Animation;
