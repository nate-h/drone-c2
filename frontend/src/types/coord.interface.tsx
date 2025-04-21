export type LatLon = [number, number];
export type LatLonZoom = [number, number, number];

export type LatLonArray = LatLon[];

export interface Location {
  name: string;
  lat: number;
  lon: number;
  alt: number;
}
