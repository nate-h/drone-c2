import { useState, useEffect } from 'react';
import { timeStringToSeconds, secondsToTimeString } from '../utils';

interface TimerOptions {
  initialValue?: string; // Initial time as a string, e.g., "10:00 AM".
  fps?: number; // Frames per second used in interval.
  minTime?: string; // Minimum time as a string, e.g., "10:00 AM".
  maxTime?: string; // Maximum time as a string, e.g., "12:00 PM".
  timeDelta?: number; // Time delta in seconds.
}

export const useTimer = ({
  initialValue = '10:00 AM',
  fps = 1,
  minTime = '10:00 AM',
  maxTime = '12:00 PM',
  timeDelta = 10,
}: TimerOptions = {}) => {
  const [currentMinTime, setMinTime] = useState(timeStringToSeconds(minTime));
  const [currentMaxTime, setMaxTime] = useState(timeStringToSeconds(maxTime));
  const [value, setValue] = useState(timeStringToSeconds(initialValue));
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const interval = 1000 / fps;

    const intervalId = setInterval(() => {
      setValue((prevValue) => {
        const newValue = prevValue + timeDelta;
        return newValue >= currentMaxTime ? currentMinTime : newValue;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [fps, isActive, currentMinTime, currentMaxTime, timeDelta]);

  const pause = () => setIsActive(false);
  const resume = () => setIsActive(true);
  const reset = () => setValue(timeStringToSeconds(initialValue));
  const updateMinTime = (newMinTime: string) => setMinTime(timeStringToSeconds(newMinTime));
  const updateMaxTime = (newMaxTime: string) => setMaxTime(timeStringToSeconds(newMaxTime));

  return {
    value: secondsToTimeString(value),
    minTime,
    maxTime,
    isActive,
    controls: {
      pause,
      resume,
      reset,
      updateMinTime,
      updateMaxTime,
    },
  };
};
