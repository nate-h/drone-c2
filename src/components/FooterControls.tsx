import React from 'react';

import "./FooterControls.scss"
import TimeSlider from './TimeSlider';


const FooterControls = () => {
    return (
        <div style={{ height: "10vh" }} className='FooterControls'>
            <h1>Drone C2</h1>
            <TimeSlider />
        </div>
    );
};

export default FooterControls;