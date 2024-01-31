
import React, {useState} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import logoD from '../../assets/images/logoD.png';
import byte3 from '../../assets/images/byte3.png';
import { Card, Container, Button, Col, Row, CardGroup, NavDropdown, Modal } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';

function VfxVideoEditing() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
 

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
          VFX Demo Reel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          This VFX demo reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles, 
          and other aspects to help complete the project. 
          Photoshop and Maya were used predominantly.
          <br />
          <br />
          Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
          My job was to very precisely rotoscope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments. 
          This was accomplished utilizing Nuke primarily.

          </p>
          <div className="iframe">
          <iframe width="640" height="360" src="https://www.youtube.com/embed/tFwtXZw_VzM" 
          title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen></iframe>
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
                Byte Size Soccer Videos
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                A promotion video which teaches kids all about soccer.
                The soccer videos and images were all provided by the client.
                The audio and sound effects are royalty free.
                The post visual effects were added using after effects.
                The 3D models were done using Maya software and Photoshop.
              </p>
              <div className="iframe">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/1wI6aDte_1Q"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </Modal.Body>
          </Modal>
    </>
        </div>

        <div>
      <>
      
    </>
        </div>
            <h2 class="top_text"> VFX and Video Editing</h2>
            <p class="top-p">Videos are rendered though a 3D software and worked on in post production, for added effects.</p>
            <NavDropdown.Divider />
                <Col ms={"auto"}>
                <CardGroup>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={logoD} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>VFX Demo</Card.Title>
                    <Card.Text>
                    My Visual effects demo of some projects I have worked on in the film industry. 
                    
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-primary" size="sm" onClick={() => setLgShow(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={byte3} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>Video editing</Card.Title>
                    <Card.Text>
                    Video editing is one of my skill set.  
                    Software used include After effects, Nuke and Adobe Photoshop. 
                    {' '}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-primary" size="sm"onClick={() => setLgShow1(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
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

export default VfxVideoEditing;
