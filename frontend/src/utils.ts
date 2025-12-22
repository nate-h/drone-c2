import { Drone, Waypoint } from './types/drone.interface';

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const linspaceTimes = (start: number, end: number, count: number): number[] => {
  if (count === 1) {
    return [start];
  }
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

export function findClosestPoints(locations: Waypoint[], t1: number): Waypoint[] {
  if (locations.length === 0) {
    return [];
  }

  const first = locations[0];
  const last = locations[locations.length - 1];

  if (t1 <= new Date(first.timestamp).getTime()) {
    return [first];
  }
  if (t1 >= new Date(last.timestamp).getTime()) {
    return [last];
  }

  let low = 0,
    high = locations.length - 1;

  // Binary search to find the closest time to t1.
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (new Date(locations[mid].timestamp).getTime() < t1) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  const prev = locations[low - 1] || null;
  const curr = locations[low] || null;
  return prev && curr ? [prev, curr] : [prev || curr].filter(Boolean);
}

export const isDroneGrounded = (drone: Drone, time: number, speed: number) => {
  return (
    speed === 0 ||
    time < new Date(drone.waypoints[0].timestamp).getTime() ||
    time > new Date(drone.waypoints[drone.waypoints.length - 1].timestamp).getTime()
  );
};
