export interface VehicleUpdate {
  lat: number;
  lon: number;
  alt: number;
  speed: number;
  fuel: number;
  timestamp: string;
}

export interface Event {
  type: string;
  description: string;
  timestamp: string;
  level: string;
}

export interface Drone {
  id: number;
  model: string;
  events: Array<Event>;
  vehicleUpdates: Array<VehicleUpdate>;
}
