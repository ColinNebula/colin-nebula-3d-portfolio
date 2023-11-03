import React from 'react';
import cnLogo from '../../assets/images/cnLogo.png';
import { Button } from 'react-bootstrap';
import home from '../../components/Home';
import {  Link } from "react-router-dom";

function Landing() {
 
    <br />
    return (
        
        <div className="landing">
        <img className="logo" src={cnLogo} alt="logo" />
        <h1> Welcome <span className="welcome"> to </span> my online,
        <br />
        <span className="lastly"> 3D Portfolio</span>
        </h1>
        
        <Button className="button" variant="outline-primary">
        <a className="line" href="https://colinnebula.github.io/colin-nebula-3d-portfolio/home"> View Portfolio</a>
        </Button>
        
        </div>
    );

}

export default Landing;