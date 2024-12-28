import { useState, useEffect } from 'react';

interface TimerOptions {
  initialValue?: number;
  interval?: number;
  maxTime?: number;
  timeDelta?: number;
}

export const useTimer = ({
  initialValue = 0,
  interval = 1000,
  maxTime = 1000,
  timeDelta = 10,
}: TimerOptions = {}) => {
  const [value, setValue] = useState(initialValue);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const intervalId = setInterval(() => {
      setValue((value) => (value + timeDelta) % maxTime);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, isActive]);

  const pause = () => setIsActive(false);
  const resume = () => setIsActive(true);
  const reset = () => setValue(initialValue);

  return {
    value,
    isActive,
    controls: {
      pause,
      resume,
      reset,
    },
  };
};
