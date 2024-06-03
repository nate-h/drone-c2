import React from 'react';

import "./FooterControls.scss"
import TimeSlider from './TimeSlider';


const FooterControls = () => {
    return (
        <div style={{ height: "10vh" }} className='FooterControls'>
            {/* <select>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
            </select>
            <select>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
            </select> */}
            <TimeSlider />
        </div>
    );
};

export default FooterControls;