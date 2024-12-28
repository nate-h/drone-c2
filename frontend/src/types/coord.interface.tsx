export type LatLon = [number, number];

export type LatLonArray = LatLon[];

export interface Location {
  name: string;
  lat: number;
  lon: number;
  alt: number;
}
