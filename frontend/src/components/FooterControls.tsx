import React, { useState } from 'react';

import './FooterControls.scss';
import TimeSlider from './TimeSlider';

import { useTimer } from '../hooks/useTimer';
import { ReactComponent as PauseIcon } from '../assets/pause-icon.svg'
import { ReactComponent as PlayIcon } from '../assets/play-icon.svg'
import { ReactComponent as ResetIcon } from '../assets/reset-icon.svg'

const FooterControls = () => {
  const timer = useTimer()

  // Start time.
  const [startDate, setStartDate] = useState('2025-01-01');
  const onStartDateChange = (event: any) => { setStartDate(event.target.value) };
  const [startTime, setStartTime] = useState('10:00');
  const onStartTimeChange = (event: any) => { setStartTime(event.target.value) };

  // End time.
  const [endDate, setEndDate] = useState('2025-01-01');
  const onEndDateChange = (event: any) => { setEndDate(event.target.value) };
  const [endTime, setEndTime] = useState('12:00');
  const onEndTimeChange = (event: any) => { setEndTime(event.target.value) };

  return (
    <div className='FooterControls'>
      <div style={{ position: "absolute", left: 5, bottom: 100, zIndex: 10000 }}>{timer.value}</div>
      <div className='time-domain'>
        Start
        <input type='date' value={startDate} onChange={onStartDateChange}></input>
        <input type='text' value={startTime} onChange={onStartTimeChange} />
        End
        <input type='date' value={endDate} onChange={onEndDateChange}></input>
        <input type='text' value={endTime} onChange={onEndTimeChange} />
      </div>
      <TimeSlider />
      <ul className='time-controls'>
        {timer.isActive ? <PauseIcon onClick={() => timer.controls.pause()} /> : <PlayIcon onClick={() => timer.controls.resume()} />}
        <ResetIcon onClick={() => timer.controls.reset()} />
      </ul>
    </div>
  );
};

export default FooterControls;
