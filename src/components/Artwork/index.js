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
            Five minute pose
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          This image is a render of a five minute pose. 
          Drawing and adding more details of a live model within five minutes.  
          
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
            One minute pose
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
           Capturing the lines of the human body. One minute render of a live model. 
          

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
            One minute pose
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          A one minute pose of a live model. 
          Capturing details and motion within a minute. 
          

          </p>
          <Card.Img src={(img3)} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
        </div>
      <h2 class="top_text"> 2D Artwork and life drawing </h2>
      <p class="mid-p"> Classical art and life drawing skills are essential as an artist.
      </p>
      <NavDropdown.Divider />
        <Col ms={'auto'}>
    <CardGroup>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src={img1} className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title>Five Minute pose </Card.Title>
          <Card.Text>
          Five minute pose with a live model. 
          Five minutes to capture as many details as possible.
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
            One minute pose with live model. The pose changes every minute. 
            {' '}
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
            One minute pose with a live model. 
            Capture as many details as possible within a minute.
      
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
    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" bgColor="#ff5a01" />
    </div>
    </Container>
  )
}
export default Artwork;
