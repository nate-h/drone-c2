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
  waypoints: Array<Waypoint>;
}
