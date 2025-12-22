import dronesReducer, { setDrones } from './dronesSlice';
import { Drone, Drones } from '../types/drone.interface';

describe('Drones Slice', () => {
  const createMockDrone = (tailNumber: string): Drone => ({
    tailNumber,
    model: 'TestModel',
    maxCargoWeight: 100,
    imagePath: 'test.png',
    waypoints: [
      {
        latitude: 34.0,
        longitude: -117.0,
        altitude: 100,
        heading: 0,
        speed: 50,
        fuel: 100,
        timestamp: '2025-01-01T10:00:00Z',
      },
    ],
  });

  it('should return the initial state', () => {
    const state = dronesReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({});
  });

  describe('setDrones', () => {
    it('should convert array of drones to keyed object by tailNumber', () => {
      const drones: Drone[] = [
        createMockDrone('DRONE-001'),
        createMockDrone('DRONE-002'),
        createMockDrone('DRONE-003'),
      ];

      const state = dronesReducer({}, setDrones(drones));

      expect(Object.keys(state)).toHaveLength(3);
      expect(state['DRONE-001']).toEqual(drones[0]);
      expect(state['DRONE-002']).toEqual(drones[1]);
      expect(state['DRONE-003']).toEqual(drones[2]);
    });

    it('should handle empty array', () => {
      const state = dronesReducer({}, setDrones([]));
      expect(state).toEqual({});
    });

    it('should handle single drone', () => {
      const drone = createMockDrone('SOLO-001');
      const state = dronesReducer({}, setDrones([drone]));

      expect(Object.keys(state)).toHaveLength(1);
      expect(state['SOLO-001']).toEqual(drone);
    });

    it('should replace existing state completely', () => {
      const initialDrones: Drones = {
        'OLD-001': createMockDrone('OLD-001'),
        'OLD-002': createMockDrone('OLD-002'),
      };

      const newDrones: Drone[] = [createMockDrone('NEW-001'), createMockDrone('NEW-002')];

      const state = dronesReducer(initialDrones, setDrones(newDrones));

      expect(Object.keys(state)).toHaveLength(2);
      expect(state['OLD-001']).toBeUndefined();
      expect(state['OLD-002']).toBeUndefined();
      expect(state['NEW-001']).toEqual(newDrones[0]);
      expect(state['NEW-002']).toEqual(newDrones[1]);
    });

    it('should handle drones with special characters in tailNumber', () => {
      const drones: Drone[] = [
        createMockDrone('DRONE-A1'),
        createMockDrone('DRONE_B2'),
        createMockDrone('DRONE.C3'),
      ];

      const state = dronesReducer({}, setDrones(drones));

      expect(state['DRONE-A1']).toEqual(drones[0]);
      expect(state['DRONE_B2']).toEqual(drones[1]);
      expect(state['DRONE.C3']).toEqual(drones[2]);
    });

    it('should handle duplicate tailNumbers by keeping the last occurrence', () => {
      const drone1 = createMockDrone('DUPLICATE');
      const drone2 = { ...createMockDrone('DUPLICATE'), model: 'DifferentModel' };

      const drones: Drone[] = [drone1, drone2];
      const state = dronesReducer({}, setDrones(drones));

      expect(Object.keys(state)).toHaveLength(1);
      expect(state['DUPLICATE'].model).toBe('DifferentModel');
    });

    it('should preserve all drone properties', () => {
      const drone: Drone = {
        tailNumber: 'TEST-001',
        model: 'AdvancedModel',
        maxCargoWeight: 250,
        imagePath: 'advanced.png',
        waypoints: [
          {
            latitude: 34.5,
            longitude: -117.5,
            altitude: 500,
            heading: 90,
            speed: 75,
            fuel: 85,
            timestamp: '2025-01-01T10:00:00Z',
          },
          {
            latitude: 34.6,
            longitude: -117.6,
            altitude: 600,
            heading: 95,
            speed: 80,
            fuel: 80,
            timestamp: '2025-01-01T10:05:00Z',
          },
        ],
      };

      const state = dronesReducer({}, setDrones([drone]));

      expect(state['TEST-001']).toEqual(drone);
      expect(state['TEST-001'].waypoints).toHaveLength(2);
      expect(state['TEST-001'].maxCargoWeight).toBe(250);
    });
  });
});
