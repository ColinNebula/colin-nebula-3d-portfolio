import React, { useState } from 'react'
import { Card, Container, Row, Col, CardGroup, NavDropdown, Modal, Button } from 'react-bootstrap';
// import maskm from '../../assets/images/maskm.png';
import sword from '../../assets/images/sword.png';
import rundown from '../../assets/images/rundown.png';
import demoR from '../../assets/images/3dModels.png';
// import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { SocialIcon } from 'react-social-icons';
export const Home = () => {
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
            2014 Demo Reel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Objects were modeled, Uv, Textured in Maya 3d software. 
          Sculpted in Zbrush and painted in photoshop. 
          Post effects were done using fusion.

          </p>
          <div className="iframe">
          <iframe width="640" 
          height="360" class="iframe" 
          src="https://www.youtube.com/embed/1BP8ezuSDT4" 
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
        size="lg"
        show={lgShow1}
        onHide={() => setLgShow1(false)}
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
      <h2 class="top_text"> Welcome to Nebula 3D</h2>
      <p class="top-p"> My name is Colin Nebula and I am a 3D Artist and a computer enthusiast. Thank you for visiting.</p>
      <NavDropdown.Divider />

    <Col ms={'auto'}>
    <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img src={rundown} className="card-image rounded" 
      alt="Card image" />
      <Card.ImgOverlay>
        <Card.Title></Card.Title>
        <Card.Text>
        
        </Card.Text>
        
      </Card.ImgOverlay>
    </Card>

    <h2 class="middle_text"> Colin Nebula 3D Portfolio</h2>
    <p class="mid-p">3D modeling is fun and it is also a learning process: 
    creating, animating learning, and improving</p>
    <NavDropdown.Divider />

    <CardGroup>
    <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img variant="top" src={demoR} 
      className="card-image rounded" 
      alt="Card image"/>
      <Card.Body>
        <Card.Title>Demo Reel</Card.Title>
        <Card.Text>
        This Demo Reel displays my 3D Modeling and Texturing skills utilizing industry software.
        Some of the programs used include Blender, Zbrush, Photoshop, xNormal, and After Effects
        </Card.Text>
      </Card.Body>
      <Card.Footer>
      <Button variant="outline-warning" onClick={() => setLgShow(true)}>View reel here</Button>{' '}
        
      </Card.Footer>
    </Card>
    <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img variant="top" src={sword} className="card-image rounded" 
      alt="Card image"/>
      <Card.Body>
        <Card.Title>VFX Reel</Card.Title>
        <Card.Text>
          This VFX Reel displays post production effect. 
          It contains some of the work I was tasked with at Intelligent Creatures Toronto
          {' '}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
      <Button variant="outline-warning" onClick={() => setLgShow1(true)}>View reel here</Button>{' '}
        
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
    
  );
}

export default Home;