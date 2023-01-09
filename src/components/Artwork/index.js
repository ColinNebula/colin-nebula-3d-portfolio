import React, { useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/helpers';
import { Card, CardGroup, Container, Row, Col, Button, NavDropdown, Modal } from 'react-bootstrap/';
import img1 from '../../assets/images/LifeDrawingWeb_05.jpg';
import img2 from '../../assets/images/LifeDrawingWeb_03.jpg';
import img3 from '../../assets/images/LifeDrawingWeb_06.jpg';
import { SocialIcon } from 'react-social-icons';
function Artwork() {
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
          <Card.Img src={img1} className="rounded" alt="Card image" />
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
          <Card.Img src={img2} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
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
          <Card.Img src={(img3)} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
        </div>
      <h2 class="top_text"> 2D Artwork and life drawing </h2>
      <NavDropdown.Divider />
        <Col ms={'auto'}>
    <CardGroup>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src={img1} className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title>5 Minute pose </Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="outline-primary" size="sm" onClick={() => setLgShow(true)}>View here</Button>{' '}
          
        </Card.Footer>
      </Card>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src={img2} className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title>One minute pose</Card.Title>
          <Card.Text>
            This card has supporting text below as a natural lead-in to
            additional content.{' '}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary" size="sm" onClick={() => setLgShow1(true)}>View Here</Button>{' '}
          
        </Card.Footer>
      </Card>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src={img3} className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title>One minute pose</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary" size="sm" onClick={() => setLgShow2(true)}>View here</Button>{' '}
          
        </Card.Footer>
      </Card>
    </CardGroup>
        </Col>
      
      </Row>
    <br />
    <NavDropdown.Divider />  
    <div className="icons">
    <SocialIcon url="https://github.com/ColinNebula" network="github"  />
    <SocialIcon url="https://www.linkedin.com/in/colin-nebula-07176022/" network="linkedin" />
    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" />
    </div>
    </Container>
  )
}
export default Artwork;
