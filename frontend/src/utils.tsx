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
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  if (includeSecond) {
    return `${displayHours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')} ${period}`;
  } else {
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
};

export const generateTimestamps = (start: string, end: string, count: number): string[] => {
  const startSeconds = timeStringToSeconds(start);
  const endSeconds = timeStringToSeconds(end);
  const interval = (endSeconds - startSeconds) / (count - 1);

  const timestamps = [];
  for (let i = 0; i < count; i++) {
    const timestampInSeconds = startSeconds + i * interval;
    timestamps.push(secondsToTimeString(Math.round(timestampInSeconds), false));
  }

  return timestamps;
};
