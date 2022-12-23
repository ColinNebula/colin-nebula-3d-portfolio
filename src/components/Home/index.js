import React from 'react'
import { Card, Container, Row, Col, CardGroup, NavDropdown } from 'react-bootstrap';

export const Home = () => {
  return (
    <Container fluid>
      <Row>
      <h2 class="top_text"> Welcome to Nebula 3D</h2>
      <NavDropdown.Divider />
        <Col ms={'auto'}>
    <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdesign4users.com%2Fwp-content%2Fuploads%2F2019%2F06%2Falex-kuskov-3d-art-1.jpg&f=1&nofb=1&ipt=d2826d405690126291673d6c5607829c17541fa302f5195335d0a985ebda91f6&ipo=images/100px270" className="card-image rounded" 
      alt="Card image" />
      <Card.ImgOverlay>
        <Card.Title>Card title</Card.Title>
        <Card.Text>
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </Card.Text>
        <Card.Text>Last updated 3 mins ago</Card.Text>
      </Card.ImgOverlay>
    </Card>

    <h2 class="middle_text"> Welcome to Nebula 3D</h2>
    <NavDropdown.Divider />

    <CardGroup>
    <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.ZBXzE3Lsa6lVA0dkRd66TwHaEK%26pid%3DApi&f=1&ipt=2a2a7795d8df817207f1325abc61a3a333529ba4f003e8014338ebb476ff9330&ipo=images/100px160" />
      <Card.Body>
        <Card.Title>Card title</Card.Title>
        <Card.Text>
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Last updated 3 mins ago</small>
      </Card.Footer>
    </Card>
    <Card className="overflow bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.JEO6_HmvVUDbW4-m7k8LHQHaEK%26pid%3DApi&f=1&ipt=8cc6817c9f24b620799f6268f369c30d5b3104953c2ac86695c313231727d2ef&ipo=images/100px160" />
      <Card.Body>
        <Card.Title>Card title</Card.Title>
        <Card.Text>
          This card has supporting text below as a natural lead-in to
          additional content.{' '}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Last updated 3 mins ago</small>
      </Card.Footer>
    </Card>
    </CardGroup>
    </Col>
    </Row>
    <br />
    <NavDropdown.Divider />
    </Container>
    
  );
}

export default Home;