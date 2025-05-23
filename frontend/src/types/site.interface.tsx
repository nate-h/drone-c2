export interface Site {
  name: string;
  site_type: 'airfield' | 'poi';
  latitude: number;
  longitude: number;
  elevation: number;
}

export type Sites = Record<string, Site>;
