import React, { useState } from 'react'
import { Card, Container, Row, Col, CardGroup, NavDropdown, Modal, Button } from 'react-bootstrap';
import maskm from '../../assets/images/maskm.png';
import img4 from '../../assets/images/TruckB_01.jpg';
import img5 from '../../assets/images/shield1.png';
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
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
          <iframe width="640" height="360" src="https://www.youtube.com/embed/1BP8ezuSDT4" 
          title="YouTube video player" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen></iframe>
          
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
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
            What we do
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Nibh cras pulvinar mattis nunc. Mollis aliquam ut porttitor leo a. 
          Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. 
          Volutpat diam ut venenatis tellus in metus vulputate.

          </p>
          <Card.Img src={(img4)} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
        </div>  
      <h2 class="top_text"> Welcome to Nebula 3D</h2>
      <p class="top-p"> My name is Colin Nebula and I am a 3D Artist and a computer enthusiast. </p>
      <NavDropdown.Divider />
        <Col ms={'auto'}>
    <Card className=" bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img src={maskm} className="card-image rounded" 
      alt="Card image" />
      <Card.ImgOverlay>
        <Card.Title>Mask of Malice</Card.Title>
        <Card.Text>
          This Mask is a high ploy mesh. It was modeled, Uv, normal maps, and texture using blender.
          ZBrush was used to add detail. Photoshop was used for color and grunge mapping.
        </Card.Text>
        
      </Card.ImgOverlay>
    </Card>

    <h2 class="middle_text"> Colin Nebula 3D portfolio</h2>
    <NavDropdown.Divider />

    <CardGroup>
    <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img variant="top" src={img5} 
      className="card-image rounded" 
      alt="Card image"/>
      <Card.Body>
        <Card.Title>Demo Reel</Card.Title>
        <Card.Text>
        This Demo Reel displays my 3D Modeling and Texturing skills utilizing industry software.
        Some of the programs used include Autodesk Maya, Photoshop, xNormal, and After Effects.
        </Card.Text>
      </Card.Body>
      <Card.Footer>
      <Button variant="outline-primary" onClick={() => setLgShow(true)}>View reel here</Button>{' '}
        
      </Card.Footer>
    </Card>
    <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img variant="top" src={img4} className="card-image rounded" 
      alt="Card image"/>
      <Card.Body>
        <Card.Title>Military Truck</Card.Title>
        <Card.Text>
          This card has supporting text below as a natural lead-in to
          additional content.{' '}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
      <Button variant="outline-primary" onClick={() => setLgShow1(true)}>View here</Button>{' '}
        
      </Card.Footer>
    </Card>
    </CardGroup>
    </Col>
    </Row>
    <br />
    <NavDropdown.Divider />
    <Container fluid>
    <Row>
    <Col className="icons">
    <div>
    <SocialIcon url="https://github.com/ColinNebula" network="github"  />

    <SocialIcon url="https://www.linkedin.com/in/colin-nebula-07176022/" network="linkedin" />

    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" bgColor="#ff5a01" />
    </div>
    </Col>
    </Row>
    
    </Container>
    </Container>
    
  );
}

export default Home;