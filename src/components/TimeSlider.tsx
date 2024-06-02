import React from 'react';

import "./TimeSlider.scss"

const times = Array.from(Array(12).keys()).map((num) => `${2 * (num + 1)}`) //:00

const TimeSlider = () => {
    return (
        <div className='TimeSlider'>
            {times.map((time, index) => (
                <div key={index} className='time-block'>{time}</div>
            ))}
        </div>
    );
};

export default TimeSlider;