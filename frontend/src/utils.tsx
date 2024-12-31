export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const linspaceTimes = (start: number, end: number, count: number): number[] => {
  const interval = (end - start) / (count - 1);
  const times: number[] = [];
  for (let i = 0; i < count; i++) {
    times.push(start + i * interval);
  }
  return times;
};

/** Convert date represented as milliseconds into a 24 hour clock time like 13:01. */
export const extractTime = (time: number): string => {
  const date = new Date(time);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
