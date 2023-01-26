import React from 'react';
import Particles from 'react-tsparticles'
import useWindowDimensions from '../utils/WindowSize';

function Canvas() {
    const state ={ width: window.innerWidth, height: window.innerHeight };
    const { width } = useWindowDimensions();
    if (width > 465) {
        
        return (
            <Particles
        params={{
            "particles": {
                "number":{
                    "value": 50
                },
                "size": {
                    "value": 3
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode":
                        "repulse"
                    }
                }
            }
        }}/>
        
    );
}
}
export default Canvas;