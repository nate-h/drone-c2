import { useState, useEffect } from 'react';

interface TimerOptions {
  initialValue?: string; // Initial time as a string, e.g., "10:00 AM".
  fps?: number; // Frames per second used in interval.
  minTime?: string; // Minimum time as a string, e.g., "10:00 AM".
  maxTime?: string; // Maximum time as a string, e.g., "12:00 PM".
  timeDelta?: number; // Time delta in seconds.
}

const timeStringToSeconds = (time: string): number => {
  const [hours, minutes, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i)!.slice(1);
  const isPM = period.toUpperCase() === 'PM';
  const totalHours = (parseInt(hours) % 12) + (isPM ? 12 : 0);
  return totalHours * 3600 + parseInt(minutes) * 60;
};

const secondsToTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor((seconds % 3600) / 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

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
