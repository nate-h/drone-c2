import { extractTime, findClosestPoints, isDroneGrounded, linspaceTimes } from './utils';
import { Drone, Waypoint } from './types/drone.interface';

describe('Utils', () => {
  describe('extractTime', () => {
    it('should convert milliseconds to 24-hour time format', () => {
      const time = new Date('2025-01-01T13:45:00Z').getTime();
      expect(extractTime(time)).toBe('13:45');
    });

    it('should pad single digit hours and minutes with zeros', () => {
      const time = new Date('2025-01-01T09:05:00Z').getTime();
      expect(extractTime(time)).toBe('09:05');
    });

    it('should handle midnight correctly', () => {
      const time = new Date('2025-01-01T00:00:00Z').getTime();
      expect(extractTime(time)).toBe('00:00');
    });

    it('should handle noon correctly', () => {
      const time = new Date('2025-01-01T12:00:00Z').getTime();
      expect(extractTime(time)).toBe('12:00');
    });
  });

  describe('linspaceTimes', () => {
    it('should generate evenly spaced times between start and end', () => {
      const result = linspaceTimes(0, 100, 5);
      expect(result).toEqual([0, 25, 50, 75, 100]);
    });

    it('should handle count of 1', () => {
      const result = linspaceTimes(10, 20, 1);
      expect(result).toEqual([10]);
    });

    it('should handle count of 2', () => {
      const result = linspaceTimes(0, 10, 2);
      expect(result).toEqual([0, 10]);
    });

    it('should work with negative numbers', () => {
      const result = linspaceTimes(-10, 10, 3);
      expect(result).toEqual([-10, 0, 10]);
    });
  });

  describe('findClosestPoints', () => {
    const createWaypoint = (timestamp: string): Waypoint => ({
      latitude: 0,
      longitude: 0,
      altitude: 0,
      heading: 0,
      speed: 0,
      fuel: 100,
      timestamp,
    });

    it('should return empty array for empty waypoints', () => {
      const result = findClosestPoints([], 1000);
      expect(result).toEqual([]);
    });

    it('should return first waypoint when time is before all waypoints', () => {
      const waypoints = [
        createWaypoint('2025-01-01T10:00:00Z'),
        createWaypoint('2025-01-01T11:00:00Z'),
        createWaypoint('2025-01-01T12:00:00Z'),
      ];
      const time = new Date('2025-01-01T09:00:00Z').getTime();
      const result = findClosestPoints(waypoints, time);
      expect(result).toEqual([waypoints[0]]);
    });

    it('should return last waypoint when time is after all waypoints', () => {
      const waypoints = [
        createWaypoint('2025-01-01T10:00:00Z'),
        createWaypoint('2025-01-01T11:00:00Z'),
        createWaypoint('2025-01-01T12:00:00Z'),
      ];
      const time = new Date('2025-01-01T13:00:00Z').getTime();
      const result = findClosestPoints(waypoints, time);
      expect(result).toEqual([waypoints[2]]);
    });

    it('should return two surrounding waypoints when time is between them', () => {
      const waypoints = [
        createWaypoint('2025-01-01T10:00:00Z'),
        createWaypoint('2025-01-01T11:00:00Z'),
        createWaypoint('2025-01-01T12:00:00Z'),
      ];
      const time = new Date('2025-01-01T10:30:00Z').getTime();
      const result = findClosestPoints(waypoints, time);
      expect(result).toEqual([waypoints[0], waypoints[1]]);
    });

    it('should handle time exactly matching a waypoint', () => {
      const waypoints = [
        createWaypoint('2025-01-01T10:00:00Z'),
        createWaypoint('2025-01-01T11:00:00Z'),
        createWaypoint('2025-01-01T12:00:00Z'),
      ];
      const time = new Date('2025-01-01T11:00:00Z').getTime();
      const result = findClosestPoints(waypoints, time);
      // Should return the exact waypoint and the one before
      expect(result.length).toBe(2);
      expect(result).toContainEqual(waypoints[1]);
    });

    it('should handle single waypoint', () => {
      const waypoints = [createWaypoint('2025-01-01T10:00:00Z')];
      const time = new Date('2025-01-01T10:30:00Z').getTime();
      const result = findClosestPoints(waypoints, time);
      expect(result).toEqual([waypoints[0]]);
    });

    it('should use binary search efficiently for large datasets', () => {
      // Create 1000 waypoints
      const waypoints: Waypoint[] = [];
      for (let i = 0; i < 1000; i++) {
        const date = new Date('2025-01-01T10:00:00Z');
        date.setMinutes(date.getMinutes() + i);
        waypoints.push(createWaypoint(date.toISOString()));
      }

      const time = new Date('2025-01-01T15:30:00Z').getTime(); // 330 minutes in
      const result = findClosestPoints(waypoints, time);
      expect(result.length).toBe(2);
    });
  });

  describe('isDroneGrounded', () => {
    const createDrone = (waypoints: Waypoint[]): Drone => ({
      tailNumber: 'TEST-001',
      model: 'TestModel',
      maxCargoWeight: 100,
      imagePath: 'test.png',
      waypoints,
    });

    const createWaypoint = (timestamp: string): Waypoint => ({
      latitude: 0,
      longitude: 0,
      altitude: 0,
      heading: 0,
      speed: 0,
      fuel: 100,
      timestamp,
    });

    it('should return true when speed is 0', () => {
      const drone = createDrone([createWaypoint('2025-01-01T10:00:00Z')]);
      const time = new Date('2025-01-01T10:00:00Z').getTime();
      expect(isDroneGrounded(drone, time, 0)).toBe(true);
    });

    it('should return false when speed is greater than 0', () => {
      const drone = createDrone([createWaypoint('2025-01-01T10:00:00Z')]);
      const time = new Date('2025-01-01T10:00:00Z').getTime();
      expect(isDroneGrounded(drone, time, 50)).toBe(false);
    });

    it('should return true when time is before first waypoint', () => {
      const drone = createDrone([
        createWaypoint('2025-01-01T10:00:00Z'),
        createWaypoint('2025-01-01T11:00:00Z'),
      ]);
      const time = new Date('2025-01-01T09:00:00Z').getTime();
      expect(isDroneGrounded(drone, time, 50)).toBe(true);
    });

    it('should return true when time is after last waypoint', () => {
      const drone = createDrone([
        createWaypoint('2025-01-01T10:00:00Z'),
        createWaypoint('2025-01-01T11:00:00Z'),
      ]);
      const time = new Date('2025-01-01T12:00:00Z').getTime();
      expect(isDroneGrounded(drone, time, 50)).toBe(true);
    });

    it('should return false when time is within waypoint range and speed > 0', () => {
      const drone = createDrone([
        createWaypoint('2025-01-01T10:00:00Z'),
        createWaypoint('2025-01-01T11:00:00Z'),
      ]);
      const time = new Date('2025-01-01T10:30:00Z').getTime();
      expect(isDroneGrounded(drone, time, 50)).toBe(false);
    });
  });
});
