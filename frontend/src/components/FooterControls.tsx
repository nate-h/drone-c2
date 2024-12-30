import React, { useEffect, useState } from 'react';

import './FooterControls.scss';

import { generateTimestamps, secondsToTimeString } from '../utils';
import {
  pause,
  resume,
  reset,
  updateMinTime,
  updateMaxTime,
  updateTime,
  advanceTime,
  TimerState,
} from '../store/timer';
import { ReactComponent as PauseIcon } from '../assets/pause-icon.svg';
import { ReactComponent as PlayIcon } from '../assets/play-icon.svg';
import { ReactComponent as ResetIcon } from '../assets/reset-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

const FooterControls = () => {
  const dispatch = useDispatch();
  const timer: TimerState = useSelector((state: RootState) => state.timer);

  // Start timer.
  useEffect(() => {
    if (!timer.isActive) {
      return;
    }
    const interval = 1000 / timer.fps;
    const intervalId = setInterval(() => {
      dispatch(advanceTime());
    }, interval);
    return () => clearInterval(intervalId);
  }, [dispatch, timer]);

  const timestamps = generateTimestamps(timer.minTime, timer.maxTime, 9);

  const onSliderClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    dispatch(updateTime(newValue));
  };

  // Start time.
  const [startDate, setStartDate] = useState('2025-01-01');
  const onStartDateChange = (event: any) => {
    setStartDate(event.target.value);
  };
  const onStartTimeChange = (event: any) => {
    updateMinTime(event.target.value);
  };

  // End time.
  const [endDate, setEndDate] = useState('2025-01-01');
  const onEndDateChange = (event: any) => {
    setEndDate(event.target.value);
  };
  const onEndTimeChange = (event: any) => {
    updateMaxTime(event.target.value);
  };

  return (
    <div className='FooterControls'>
      <div style={{ position: 'absolute', left: 5, bottom: 100, zIndex: 10000 }}>
        {secondsToTimeString(timer.time)}
      </div>
      <div className='time-domain'>
        Start
        <input type='date' value={startDate} onChange={onStartDateChange}></input>
        <input
          type='text'
          value={secondsToTimeString(timer.minTime)}
          onChange={onStartTimeChange}
        />
        End
        <input type='date' value={endDate} onChange={onEndDateChange}></input>
        <input type='text' value={secondsToTimeString(timer.maxTime)} onChange={onEndTimeChange} />
      </div>
      <div className='time-slider'>
        <input
          type='range'
          min={timer.minTime}
          max={timer.maxTime}
          value={timer.time}
          onChange={onSliderClick}
          onMouseDown={() => dispatch(pause())}
          onMouseUp={() => dispatch(resume())}
          list='time-labels'
        ></input>

        <datalist id='time-labels'>
          {timestamps.map((time, index) => (
            <option key={index} value={time} label={secondsToTimeString(time)}></option>
          ))}
        </datalist>
      </div>
      <ul className='time-controls'>
        {timer.isActive ? (
          <PauseIcon onClick={() => dispatch(pause())} />
        ) : (
          <PlayIcon onClick={() => dispatch(resume())} />
        )}
        <ResetIcon onClick={() => dispatch(reset())} />
      </ul>
    </div>
  );
};

export default FooterControls;
