import React from 'react';
import maskU from '../../assets/images/maskU.png';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Landing() {
    return (
        <div className="landing">
            <br />
            <h1>
                Welcome <span className="welcome"> to </span> my online,
                <br />
                <Link to="/home">
                  <img className="logo" src={maskU} alt="logo" />
                </Link>
                <span className="lastly"> 3D Portfolio</span>
            </h1>
        </div>
    );
}

export default Landing;