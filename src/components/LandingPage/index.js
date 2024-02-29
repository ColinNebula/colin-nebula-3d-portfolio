import React from "react";
import cnLogo from '../../assets/images/cnLogo.png';

import BgVideo from '../../assets/videos/bg.mp4'



function LandingPage()  {
   
    return (
        <div className="landing-page">

            <video src={BgVideo} autoPlay muted loop class="video-bg" />
            
            <div className="bg-overlay"></div>
            <div className="bar-over">
           
            </div>
            <h1> Welcome <span className="welcome"> to </span> my online
            <br/>
            <span className="lastly"> 3D Portfolio</span>
            </h1>
        </div>
    )
}

export default LandingPage;