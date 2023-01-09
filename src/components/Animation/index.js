
import React, {useState} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import img4 from '../../assets/images/TruckB_01.jpg';
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
            3D Model Headset Demo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          A short logo animation demo. 
          Maya was used to model, uv, texture the objects.
          Photoshop was used to create color textures. 
          

          </p>
          <iframe width="640" height="360" 
          src="https://www.youtube.com/embed/zj8Vv7ln-r4" 
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
                  <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.sketchfab.com%2Fmodels%2F7327dc1dafa34222bb0e1f71d7c5102b%2Fthumbnails%2Fce8ded829a254046ba4e7e24f24fc53e%2F6b83033856604611a256e6b7c23a43c7.jpeg&f=1&nofb=1&ipt=250c39f9aae33b6f4167945527fbaeee25cbf59ce3394fcae089bc37b0c046df&ipo=images/100px160" className="rounded" 
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
                  <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2018%2F10%2F04%2F147084-space-3d-art-planet-stars.jpg&f=1&nofb=1&ipt=5df166e91601e2a54f1c26a247a5d23404d941e1380df5bfa49d780c48c175cf&ipo=images/100px160" className="rounded" 
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
                  <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2017%2F03%2F27%2F440249-abstract-3D.jpg&f=1&nofb=1&ipt=43290cf58251f642eedd14c190f9b82c7a1557e22ba6d8c8c0167a63203ddaea&ipo=images/100px160" className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>Photorealistic modeling</Card.Title>
                    <Card.Text>
                      A 3D model headset. 
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
    <SocialIcon url="https://github.com/ColinNebula" network="github"  />

    <SocialIcon url="https://www.linkedin.com/in/colin-nebula-07176022/" network="linkedin" />

    <SocialIcon url="mailto:colinnebula@gmail.com" network="mailto" bgColor="#ff5a01" />
    </div>
    </Container>
    )
}

export default Animation;
