export interface Event {
  type: string;
  description: string;
  timestamp: string;
  level: string;
}

export interface Drone {
  id: number;
  model: string;
  timestamp: string;
  battery: number;
  events: Array<Event>;
}
