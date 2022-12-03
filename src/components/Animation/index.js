
import React, {useState} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
// import SniperRifle from '../../assets/images/SniperRifleTestxx6.jpg';
import { Card, Container, Button, Col, Row, CardGroup } from 'react-bootstrap';


function Animation() {

    return (
        <Container fluid>
            <Row>
                <Col ms={"auto"}>
                <CardGroup>
                <Card className="shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.sketchfab.com%2Fmodels%2F7327dc1dafa34222bb0e1f71d7c5102b%2Fthumbnails%2Fce8ded829a254046ba4e7e24f24fc53e%2F6b83033856604611a256e6b7c23a43c7.jpeg&f=1&nofb=1&ipt=250c39f9aae33b6f4167945527fbaeee25cbf59ce3394fcae089bc37b0c046df&ipo=images/100px160" className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                      This is a wider card with supporting text below as a natural lead-in
                      to additional content. This content is a little bit longer.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-primary" size="sm">Video</Button>{' '}
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </Card.Footer>
                </Card>
                <Card className="shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2018%2F10%2F04%2F147084-space-3d-art-planet-stars.jpg&f=1&nofb=1&ipt=5df166e91601e2a54f1c26a247a5d23404d941e1380df5bfa49d780c48c175cf&ipo=images/100px160" className="rounded" 
                  alt="Card image" />
                  <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                      This card has supporting text below as a natural lead-in to
                      additional content.gymry, dryruyoy  rdtydy{' '}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <Button variant="outline-primary" size="sm">Video</Button>{' '}
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </Card.Footer>
                </Card>
                <Card className="shadow-lg" style={{ color: "#000", width: "auto" }}>
                  <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2017%2F03%2F27%2F440249-abstract-3D.jpg&f=1&nofb=1&ipt=43290cf58251f642eedd14c190f9b82c7a1557e22ba6d8c8c0167a63203ddaea&ipo=images/100px160" className="rounded" 
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
                  <Button variant="outline-primary" size="sm">Video</Button>{' '}
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </Card.Footer>
                </Card>
              </CardGroup>
        
        </Col>
        </Row>
    </Container>
    )
}

export default Animation;
