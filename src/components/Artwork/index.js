import React, { useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '../../utils/helpers';
import { Card, CardGroup, Container, Row, Col, Button, NavDropdown, Modal } from 'react-bootstrap/';
import img1 from '../../assets/images/LifeDrawingWeb_05.jpg';
import img2 from '../../assets/images/LifeDrawingWeb_03.jpg';
import img3 from '../../assets/images/LifeDrawingWeb_06.jpg';
import SocialIcons from '../SocialIcons';

function Artwork() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
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
          <Card.Img src={img1} className="rounded img-fluid" style={{width: '100%', height: 'auto'}} alt="Five minute pose" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
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
          <Card.Img src={img2} className="rounded img-fluid" style={{width: '100%', height: 'auto'}} alt="One minute pose" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
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
          <Card.Img src={img3} className="rounded img-fluid" style={{width: '100%', height: 'auto'}} alt="One minute pose" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
        </div>
        <br/>
        <br/>
      <h2 class="top_text"> 2D Artwork and Life Drawing </h2>
      <p class="mid-p"> Classical art and life drawing skills are essential as an artist
      </p>
      <NavDropdown.Divider />
        <Col ms={'auto'}>
    <CardGroup>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src={img1} className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title className="ti-tle">Five Minute Pose </Card.Title>
          <Card.Text>
          Five minute pose with a live model 
          Five minutes to capture as many details as possible
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="outline-warning" size="sm" onClick={() => setLgShow(true)}>View here</Button>{' '}
          
        </Card.Footer>
        <br/>
      </Card>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src={img2} className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title className="ti-tle">One Minute Pose</Card.Title>
          <Card.Text>
            One minute pose with live model. The pose changes every minute 
            {' '}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-warning" size="sm" onClick={() => setLgShow1(true)}>View Here</Button>{' '}
          
        </Card.Footer>
        <br/>
      </Card>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src={img3} className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title className="ti-tle">One Minute Pose</Card.Title>
          <Card.Text>
            One minute pose with a live model. 
            Capture as many details as possible within a minute
      
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-warning" size="sm" onClick={() => setLgShow2(true)}>View here</Button>{' '}
          
        </Card.Footer>
        <br/>
      </Card>
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
export default Artwork;

