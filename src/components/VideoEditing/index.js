
import React, {useState} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import logoD from '../../assets/images/logoD.png';
import nbg from '../../assets/images/nbg.png';
import byte3 from '../../assets/images/byte3.png';
import { Card, Container, Button, Col, Row, CardGroup, NavDropdown, Modal } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';

function VfxVideoEditing() {
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

          </p>
          <div className="ratio ratio-16x9">
          <iframe 
          width="640" 
          height="360" 
          src="https://www.youtube.com/embed/tFwtXZw_VzM" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>
          <br />
          <br />
        <p>
            Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
            My job was to very precisely rotoscope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments. 
            This was accomplished utilizing Nuke primarily.
        </p>
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
          VFX Reel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          This VFX demo reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles, 
          and other aspects to help complete the project. 
          Photoshop and Maya were used predominantly.
          <br />
          <br />

          </p>
          <div className="ratio ratio-16x9">
      <iframe 
      width="560" 
      height="315" 
      src="https://www.youtube.com/embed/mPxmNbMpO7A?si=akRyOXO_rVHT5zDC" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
      </iframe>
      </div>
          <br />
          <br />
        <p>
            Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
            My job was to very precisely rotoscope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments. 
            This was accomplished utilizing Nuke primarily.
        </p>
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
              A promotional video that takes young players through various drills and techniques to learn how to play soccer. 
              Raw footage was provided by the client and the finished product is a result of VFX and video editing as well as, 
              sound incorporation with effects 
              </p>
              <div className="ratio ratio-16x9">
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
              <br />
              <p>
              <ul>
              <li>Created a marking style educational video that promotes Olympian, the late Tony Waiters, dispensing valuable soccer techniques to the next generation
              </li>
              <li>for attention, grabbing, and to highlight key points, individual 3-D objects were added in and animated</li>
              <li>Footage was sequenced for a linear development so that young players can learn the technique or drill easily in this flipped curriculum</li>
              <li>Planning prior to, customizing the result, and conferring on final shots with the client helped incorporate their vision throughout </li>
              <li>Smooth and error-free transition allows for an enjoyable viewing experience</li>
              <li>Integration of appealing text and images was done to keep young players engaged in watching the video to the end just in time for their soccer practice </li>
              <li>Primary usage of Adobe Suite: Photoshop & After Effects, and Maya</li>
              </ul>
              </p>

            </Modal.Body>
          </Modal>
    </>
        </div>

        <div>
      <>
      
    </>
        </div>
            <h2 class="top_text"> VFX and Video Editing</h2>
            <p class="top-p">Videos are rendered though a 3D software and worked on in post production for added effects</p>
            <NavDropdown.Divider />
                <Col ms={"auto"}>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={nbg} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                  <br/>
                    <Card.Title>Colin Nebula 2024 VFX Reel</Card.Title>
                    <Card.Text>
                    Visual effects demo of some projects I have worked on in the film industry 
                    
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-warning" size="sm" onClick={() => setLgShow2(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                  <br/>
                </Card>
                <CardGroup>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={logoD} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>VFX Reel</Card.Title>
                    <Card.Text>
                    Visual effects demo of some projects I have worked on in the film industry 
                    
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-warning" size="sm" onClick={() => setLgShow(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                  <br/>
                </Card>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src={byte3} className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>Video Editing</Card.Title>
                    <Card.Text>
                    Video editing is part of my skill set  
                    Software used include After Effects, Nuke and Adobe Photoshop 
                    {' '}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-warning" size="sm"onClick={() => setLgShow1(true)}>View video here</Button>{' '}
                    
                  </Card.Footer>
                  <br/>
                </Card>
                
              </CardGroup>
              <br/>
              
                
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
