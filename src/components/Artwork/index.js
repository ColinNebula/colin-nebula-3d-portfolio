import React from 'react';
import { capitalizeFirstLetter } from '../../utils/helpers';
import { Card, CardGroup, Container, Row, Col, Button } from 'react-bootstrap/';

function Artwork() {
  return (
    <Container fluid>
      <Row>
        <Col ms={'auto'}>
    <CardGroup>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F3dprintingindustry.com%2Fwp-content%2Fuploads%2F2016%2F04%2Fart-1024x646.jpg&f=1&nofb=1&ipt=e82d698b474310c5c554b98fb0fe2c20d4ea257a9ad0a71b46971df08424b4a8&ipo=images/100px160" className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="outline-primary" size="sm">Primary</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpapers.co%2Fwallpaper%2Fpapers.co-bb01-digital-art-color-circle-illustration-art-3d-36-3840x2400-4k-wallpaper.jpg&f=1&nofb=1&ipt=4bb59499184508c353be1d1a59723aedff9cc79fbcc78ed44441f56de893db23&ipo=images/100px160" className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This card has supporting text below as a natural lead-in to
            additional content.{' '}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary" size="sm">Primary</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
      <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
        <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pixelstalk.net%2Fwp-content%2Fuploads%2F2016%2F09%2F3D-Abstract-Art-Background.jpg&f=1&nofb=1&ipt=ca9a6421535ff0b5222c200a37f84cdc4d30bdcf4cc08f33a0753af60dbd3c68&ipo=images/100px160" className="rounded" alt="Card image" />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary" size="sm">Primary</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    </CardGroup>
        </Col>
      </Row>
    </Container>
  )
}
export default Artwork;
