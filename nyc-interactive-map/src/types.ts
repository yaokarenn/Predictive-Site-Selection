export interface Coordinates {
  x: number;
  y: number;
}

export type BoroughName = "Manhattan" | "Brooklyn" | "Queens" | "The Bronx" | "Staten Island";

export interface DiningSpot {
  name: string;
  type: string;
  specialty: string;
  rating: number;
  priceRange: string;
  description: string;
  coordinates: Coordinates;
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  yearBuilt?: string;
  iconType: "monument" | "building" | "bridge" | "park" | "culture" | "food" | "airport" | "stadium";
  coordinates: Coordinates;
  funFact: string;
  category: "landmark" | "nature" | "culture";
}

export interface Neighborhood {
  id: string;
  name: string;
  borough: BoroughName;
  polygonPoints: [number, number][]; // SVG Polygon points: [[x1, y1], [x2, y2], ...]
  centroid: Coordinates;
  description: string;
  keyAesthetics: string[];
  keyStats: {
    vibe: string;
    character: string;
    historicNotes: string;
  };
  landmarks: Landmark[];
  diningSpots: DiningSpot[];
  greenSpaces: {
    name: string;
    description: string;
    coordinates: Coordinates;
  }[];
}

export type MapViewFilter = "all" | "landmarks" | "parks" | "culture";
