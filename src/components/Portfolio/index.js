import React, { useState } from 'react';
import oldBar from '../../assets/images/oldBar.png';
import oldBarAo from '../../assets/images/oldBarAo.png';
import shield1 from '../../assets/images/shield1.png';
import tacticalK from '../../assets/images/tacticalK.png';
import sword from '../../assets/images/sword.png';
import swordd from '../../assets/images/swordd.png';

import swordInfo from '../../assets/images/swordInfo.png';
import cover1 from '../../assets/images/cover1.png';
import maskSide from '../../assets/images/maskSide.png';
import maskO from '../../assets/images/maskO.png';
import wireM from '../../assets/images/wireM.png';
import shield from '../../assets/images/shield.png';
import { Container, Row, Col, Card, Button, NavDropdown, Modal } from 'react-bootstrap';
import CardGroup from 'react-bootstrap/CardGroup';
import { SocialIcon } from 'react-social-icons';


function Portfolio() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);
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
         
        Mask of malice is an original concept for a project currently in progress.
        Blender was used to model, uv, and texture the objects. 
        Painting was done in photoshop
        <br/>
        
        </p>
        <br/>
        <Card.Img src={maskO} className="rounded" alt="Card image" />
        <a href="https://react-bootstrap.github.io/components/modal/"></a>
        <br/>
        <br/>
        <br/>
        <Modal.Title id="example-modal-sizes-title-lg">
            Mask of Malice
          </Modal.Title>
          <p>
          Some of the 2D maps used were generated using Adobe Photoshop, 
          Blender was used to model, uv, and texture the objects.
          Sculpting was done in Zbrush, and normal maps were extracted using Xnormal 
        
        
          </p>
          <br/>
          <Card.Img src={wireM} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
          <br/>
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
            Old 20th Century Bar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Model of a old 20 Centrury bar at night time. 
          Maya was used to model, uv, and texture the objects. 
          Painting was done in photoshop 
          

          </p>
          <Card.Img src={oldBar} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        <br />
        <br />

        <p>
          Low poly count on all objects 
        </p>

        <br />
        <br />

        <Card.Img src={oldBarAo} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>

          <br />
          <br />
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
            3D Riot Shield
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Model of a crowd control shield. 
          Blender was used to model, uv, and texture the objects. 
          Painting was done in Adobe photoshop.

          </p>
          <Card.Img src={shield1} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <div>
      <>
      <Modal
        size="lg"
        show={lgShow3}
        onHide={() => setLgShow3(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Sword
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Sword Model. 
          Blender was used to model, uv, and texture the objects. 
          The sculpting details were done in Zbrush.
          The normal map was baked in Xnormal, and Photoshop was used for painting.
          
          <br/>
          <br/>
          <div className="ratio ratio-16x9">
          <iframe width="560" 
          height="315" 
          src="https://www.youtube.com/embed/hLH3htg2GS0?si=y5onQfNbBUpvm-Os" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>

          </p>
          <br/>
          <Card.Img src={swordd} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>

          <NavDropdown.Divider />
          <br/>

          <p>Blender cycles render.</p>

          <NavDropdown.Divider />
          <br/>
          <Card.Img src={swordInfo} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
        </div>

        <h2 class="middle_text"> Welcome to My Portfolio</h2>
        <p class="top-p"> Here is a collection of objects modeled using various industry 3D softwares</p>
        <NavDropdown.Divider />
        <Col>
      <CardGroup>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
          <Card.Img  variant="top" src={cover1} className="rounded"
          alt="Card image" />
          <Card.Body>
            <Card.Title className="ti-tle">Mask of Malice</Card.Title>
            <Card.Text>
            This mask was modeled in Blender. Zbrush was used to add more details {' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-warning" size="sm" onClick={() => setLgShow(true)}>View here</Button>{' '}
            
            </Card.Footer>
            <br/>
        
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img  src={oldBarAo} className="rounded"
          alt="Card image"/>
          <Card.Body>
            <Card.Title className="ti-tle">Old Bar</Card.Title>
            <Card.Text>
            Utilizing my 3D knowledge to build complicated scenes
           
            {' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-warning" size="sm" onClick={() => setLgShow1(true)}>View here</Button>{' '}
            
          </Card.Footer>
          <br/>
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img src={shield} className="rounded" 
          alt="Card image" />
          <Card.Body>
            <Card.Title className="ti-tle">Riot Shield</Card.Title>
            <Card.Text>
              A shield modeled in Blender
              
            </Card.Text>
            </Card.Body>
        <Card.Footer>
          <Button variant="outline-warning" size="sm" onClick={() => setLgShow2(true)}>View here</Button>{' '}
          
        </Card.Footer>
        <br/>
        </Card>
      </CardGroup>
      <br />
      <NavDropdown.Divider />
      <br />
      <h2 class="middle_text"> Industry software used on all projects</h2>
      <p class="mid-p">Software used include Maya, Blender, Nuke, Fusion, Adobe After Effects, Adobe Photoshop, and Zbrush</p>

      <CardGroup>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
          <Card.Img  src={sword} className="rounded"
          alt="Card image" />
          <Card.Body>
            <Card.Title className="ti-tle">Sword</Card.Title>
            <Card.Text>
            This sword is a 3D model. 
            It was designed, modeled, textured using Blender 
            {' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-warning" size="sm" onClick={() => setLgShow3(true)}>View here</Button>{' '}
            
            </Card.Footer>
            <br/>
        
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img  src={maskSide} className="rounded"
          alt="Card image"/>
          <Card.Body>
            <Card.Title className="ti-tle">3D Model</Card.Title>
            <Card.Text>
            3D face mask
            modeled, UV, and textured in Blender.
            Added details and sculpting using ZBrush{' '}
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <Button variant="outline-warning" size="sm">View here</Button>{' '}
            
          </Card.Footer>
          <br/>
        </Card>

        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img src={tacticalK} className="rounded" 
          alt="Card image" />
          <Card.Body>
            <Card.Title className="ti-tle">Tactical Knife </Card.Title>
            <Card.Text>
              Tactical knife 3D model. Modeled, UV, and textured using Maya 3D software
 
            </Card.Text>
            </Card.Body>
        <Card.Footer>
          <Button variant="outline-warning" size="sm">View here</Button>{' '}
          
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
    <SocialIcon url="https://github.com/ColinNebula" network="github" className="icon" bgColor="#2a9d8f" />
    <SocialIcon url="https://www.linkedin.com/in/colin-nebula-07176022/" network="linkedin" className="icon" />
    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" bgColor="#e63946" />
    </div>

    </Col>

    </Row>

    </Container>
    </Container>

    );
  }
  

export default Portfolio;
