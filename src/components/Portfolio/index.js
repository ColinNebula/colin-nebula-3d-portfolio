import React, { useState } from 'react';
import oldBar from '../../assets/images/oldBar.png';
import oldBarAo from '../../assets/images/oldBarAo.png';
import shield1 from '../../assets/images/shield1.png';
// import TacticalKnife from '../../assets/images/SurvivalKnife_Dis.jpg';
// import Truck from '../../assets/images/TruckB_01.jpeg';
import maskm from '../../assets/images/maskm.png';
import maskall from '../../assets/images/maskall.png';
import shield from '../../assets/images/shield.png';
import { Container, Row, Col, Card, Button, NavDropdown, Modal } from 'react-bootstrap';
import CardGroup from 'react-bootstrap/CardGroup';
import { SocialIcon } from 'react-social-icons';


function Portfolio() {
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
            Mask of Malice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Nibh cras pulvinar mattis nunc. Mollis aliquam ut porttitor leo a. 
          Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. 
          Volutpat diam ut venenatis tellus in metus vulputate.

          </p>
          <Card.Img src={maskall} className="rounded" alt="Card image" />
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
          <Card.Img src={oldBar} className="rounded" alt="Card image" />
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
          <Card.Img src={shield1} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
        </div>
        <h2 class="middle_text"> Welcome to my portfolio</h2>
        <p class="top-p"> Here is a collection of objects modeled using various Industry 3D softwares</p>
        <NavDropdown.Divider />
        <Col>
      <CardGroup>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
          <Card.Img  variant="top" src={maskm} className="rounded"
          alt="Card image" />
          <Card.Body>
            <Card.Title>Mask of Malice</Card.Title>
            <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.{' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-primary" size="sm" onClick={() => setLgShow(true)}>View here</Button>{' '}
            
            </Card.Footer>
        
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img  src={oldBarAo} className="rounded"
          alt="Card image"/>
          <Card.Body>
            <Card.Title>Old Bar</Card.Title>
            <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.{' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-primary" size="sm" onClick={() => setLgShow1(true)}>View here</Button>{' '}
            
          </Card.Footer>
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img src={shield} className="rounded" 
          alt="Card image" />
          <Card.Body>
            <Card.Title>Riot Shield</Card.Title>
            <Card.Text>
              A shield modeled in Blender
              to additional content. This card has even longer content than the
              first to show that equal height action.
            </Card.Text>
            </Card.Body>
        <Card.Footer>
          <Button variant="outline-primary" size="sm" onClick={() => setLgShow2(true)}>View here</Button>{' '}
          
        </Card.Footer>
        </Card>
      </CardGroup>
      <br />
      <NavDropdown.Divider />
      <br />
      <h2 class="middle_text"> Industry software used on all projects</h2>
      <p class="mid-p">Software used include Maya, Blander, nuke, fusion, Adobe After effects, Adobe Photoshop and Zbrush.</p>

      <CardGroup>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
          <Card.Img  variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages4.alphacoders.com%2F116%2F116386.jpg&f=1&nofb=1&ipt=33b66a54d8d03fa8c53694367977d382b16469c022d23693fda90edd32381bc5&ipo=images/100px270" className="rounded"
          alt="Card image" />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.{' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-primary" size="sm">View here</Button>{' '}
            
            </Card.Footer>
        
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2016%2F01%2F271719-digital_art-abstract-colorful-CGI-geometry-lines-3D-circle.jpg&f=1&nofb=1&ipt=fd56c62c702903a9e04ca4d664995aacc6881e58a791ba3b30a0cfc246a2bc25&ipo=images/100px270" className="rounded"
          alt="Card image"/>
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.{' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-primary" size="sm">View here</Button>{' '}
            
          </Card.Footer>
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nutscomputergraphics.com%2Fwp-content%2Fuploads%2F2019%2F09%2FSkyup_Aurelium_with_MakingOf_1080p_Gatti-01143.jpg&f=1&nofb=1&ipt=4df5c5524953a49258af18112f70beb59ba3a56ba23e53ffdbe81939dc83b5b3&ipo=images/100px270" className="rounded" 
          alt="Card image" />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>
              This is a wider card with supporting text below as a natural lead-in
              to additional content. This card has even longer content than the
              first to show that equal height action.
            </Card.Text>
            </Card.Body>
        <Card.Footer>
          <Button variant="outline-primary" size="sm">View here</Button>{' '}
          
        </Card.Footer>
        </Card>
      </CardGroup>
      </Col>
      
      </Row>
      <br />
    <NavDropdown.Divider />
    <br />  
    <Container fluid>
    <Row>
    <Col>
    <SocialIcon url="https://github.com/ColinNebula" network="github" className="icon" />
    <SocialIcon url="https://www.linkedin.com/in/colin-nebula-07176022/" network="linkedin" className="icon" />
    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" bgColor="#ff5a01" />
    </Col>
    </Row>
    </Container>
    </Container>

    );
  }
  

export default Portfolio;
