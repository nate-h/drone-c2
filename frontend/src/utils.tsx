export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const timeStringToSeconds = (time: string): number => {
  const match = time.match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)/i);
  if (!match) {
    throw new Error("Invalid time format. Expected 'HH:MM AM/PM' or 'HH:MM:SS AM/PM'.");
  }

  const [_, hours, minutes, seconds = '0', period] = match;
  const isPM = period.toUpperCase() === 'PM';
  const totalHours = (parseInt(hours) % 12) + (isPM ? 12 : 0);
  return totalHours * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};

export const secondsToTimeString = (seconds: number, includeSecond = false): string => {
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (includeSecond) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

export const generateTimestamps = (start: number, end: number, count: number): string[] => {
  const interval = (end - start) / (count - 1);

  const timestamps = [];
  for (let i = 0; i < count; i++) {
    const timestampInSeconds = start + i * interval;
    timestamps.push(secondsToTimeString(Math.round(timestampInSeconds), false));
  }

  return timestamps;
};
