import React from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap';

export const Home = () => {
  return (
    <Container fluid>
      <Row>
        <Col ms={'auto'}>
    <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdesign4users.com%2Fwp-content%2Fuploads%2F2019%2F06%2Falex-kuskov-3d-art-1.jpg&f=1&nofb=1&ipt=d2826d405690126291673d6c5607829c17541fa302f5195335d0a985ebda91f6&ipo=images/100px270" className="rounded" 
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
    </Col>
    </Row>
    </Container>
  );
}

export default Home;