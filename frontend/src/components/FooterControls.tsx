import React, { useState } from 'react';

import './FooterControls.scss';
import TimeSlider from './TimeSlider';

import { useTimer } from '../hooks/useTimer';

const FooterControls = () => {
  const timer = useTimer()
  // TODO: add to store.
  const [selectedDate, setSelectedDate] = useState('2024-05-26');
  const onDateChange = (event: any) => {
    setSelectedDate(event.target.value);
  };

  // TODO: add to store and hook to slider.
  const [time, setTime] = useState('12:00');
  const onTimeChange = (event: any) => {
    setTime(event.target.value);
  };

  return (
    <div className='FooterControls'>
      <div className='date-selection'>
        <div className='row'>
          <div style={{ position: "absolute", left: 5, bottom: 5 }}>{timer.value}</div>
          <label>
            Date <input type='date' value={selectedDate} onChange={onDateChange}></input>
          </label>
        </div>
        <div className='row'>
          <label>
            Time <input type='text' value={time} onChange={onTimeChange} />
          </label>
        </div>
      </div>
      <TimeSlider />
    </div>
  );
};

export default FooterControls;
