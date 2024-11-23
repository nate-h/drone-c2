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

export interface OLDDrone {
  id: number;
  model: string;
  events: Array<Event>;
  vehicleUpdates: Array<VehicleUpdate>;
}

export interface Drone {
  tail_number: string;
  model: string;
  max_cargo_weight: number;
}
