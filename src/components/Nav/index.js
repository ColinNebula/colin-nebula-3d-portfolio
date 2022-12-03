import React from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logo from '../../assets/images/logo.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation(props) {
    const { currentTab, setCurrentTab } = props;
  return (
    <Navbar bg="dark" expand="md" variant="dark" sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand href="/home">
        <img src={logo} width="90px" height="40px" alt="logo" />
        Colin Nebula 3D 
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className={currentTab === "/" ? "mx-2 navActive" : "mx-2"}>
            <span onClick={() => setCurrentTab("home")}>Home</span>
            </Nav.Link>

            <Nav.Link className={currentTab === "portfolio" ? "mx-2 navActive" : "mx-2"}>
            <span onClick={() => setCurrentTab("portfolio")}>Portfolio</span>
            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item className={currentTab === "artwork" ? "mx-2 navActive" : "mx-2"}>
              <span onClick={() => setCurrentTab("artwork")}>Artwork</span>
              </NavDropdown.Item>

              <NavDropdown.Item className={currentTab === "animation" ? "mx-2 navActive" : "mx-2"}>
              <span onClick={() => setCurrentTab("animation")}>Animation</span>

              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;