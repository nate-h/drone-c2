export interface Event {
  type: string;
  description: string;
  timestamp: string;
  level: string;
}

export interface Waypoint {
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
  fuel: number;
  timestamp: string;
}

export interface Drone {
  tailNumber: string;
  model: string;
  maxCargoWeight: number;
  imagePath: string;
  waypoints: Array<Waypoint>;
}

export type Drones = Record<string, Drone>;

export interface DroneState {
  isGrounded: boolean;
  showPath: boolean;
}

export type DroneStates = Record<string, DroneState>;
