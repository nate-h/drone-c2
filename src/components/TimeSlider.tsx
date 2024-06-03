import React from 'react';

import "./TimeSlider.scss"

const times = Array.from(Array(12).keys()).map((num) => `${2 * (num + 1)}`) //:00

const TimeSlider = () => {

    const sliderCB = (v: React.ChangeEvent<HTMLInputElement>) => {
        console.log('v', v)
    }

    return (
        <div className='TimeSlider'>
            <input type='range' onChange={sliderCB}></input>
            <ul>
                {times.map((time, index) => (
                    <li key={index}>{time}</li>
                ))}
            </ul>
        </div>
    );
};

export default TimeSlider;