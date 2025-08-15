import React from 'react';
import cnLogo from '../../assets/images/cnLogo.png';
import mbg from '../../assets/images/mbg.png';
import maskU from '../../assets/images/maskU.png';
import { Button } from 'react-bootstrap';
import home from '../../components/Home';
import {  Link } from "react-router-dom";

function Landing() {
    return (
        <div className="landing">
            <br />
            <h1>
                Welcome <span className="welcome"> to </span> my online,
                <br />
                <img className="logo" src={maskU} alt="logo" />
                <span className="lastly"> 3D Portfolio</span>
            </h1>
        </div>
    );
}
/* No additional code needed here; modify inside the component above. 
Replace:
<img className="logo" src={maskU} alt="logo" />

With:
<Link to="/home">
    <img className="logo" src={maskU} alt="logo" />
</Link>
*/
export default Landing;