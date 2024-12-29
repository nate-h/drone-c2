import React from 'react';

import './TimeSlider.scss';
import { generateTimestamps } from '../utils';

const TimeSlider = () => {
  const sliderCB = (v: React.ChangeEvent<HTMLInputElement>) => {
    console.log('v', v);
  };

  const timestamps = generateTimestamps('10:00:00 AM', '12:00:00 PM', 5);

  return (
    <div className='TimeSlider'>
      <input type='range' onChange={sliderCB}></input>
      <ul>
        {timestamps.map((time, index) => (
          <li key={index}>{time}</li>
        ))}
      </ul>
    </div>
  );
};

export default TimeSlider;
