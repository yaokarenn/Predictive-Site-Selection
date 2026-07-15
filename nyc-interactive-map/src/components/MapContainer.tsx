import React, { useRef, useEffect } from "react";
import L from "leaflet";
import { Plus, Minus, RotateCcw, Map as MapIcon, Compass, X, Sparkles, AlertCircle } from "lucide-react";
import { Neighborhood, MapViewFilter } from "../types";
import { NYC_NEIGHBORHOODS } from "../data/nycData";
import { getNeighborhoodCensusData } from "../utils/censusData";
import { runRenewalLSTMForecast } from "../utils/lstm";

interface MapContainerProps {
  darkMode: boolean;
  activeFilter: MapViewFilter;
  searchQuery: string;
  selectedNeighborhood: Neighborhood | null;
  onSelectNeighborhood: (neighborhood: Neighborhood | null) => void;
  geoJsonData: any;
  heatmapMode: boolean;
  forecasts: Record<string, any>;
}

// Heatmap scale (yellow starting to deep red) representing predicted urban renewal scores [0, 1]
export function getHeatmapRed(score: number): string {
  if (score > 0.90) return "#bd0026"; // Deep intense red
  if (score > 0.75) return "#f03b20"; // Vibrant red
  if (score > 0.55) return "#fd8d3c"; // Vivid orange
  if (score > 0.35) return "#feb24c"; // Warm amber/yellow-orange
  if (score > 0.15) return "#fed976"; // Bright golden yellow
  return "#ffffcc";                   // Soft pale yellow
}

// Coordinate lookups for neighborhoods
const NEIGHBORHOOD_GEO_CENTROIDS: Record<string, [number, number]> = {
  "wash-heights": [40.8417, -73.9394],
  "harlem": [40.8116, -73.9465],
  "central-park": [40.7850, -73.9683],
  "upper-west-side": [40.7870, -73.9754],
  "upper-east-side": [40.7717, -73.9594],
  "chelsea-hk": [40.7516, -73.9984],
  "midtown": [40.7549, -73.9840],
  "greenwich-soho": [40.7262, -74.0040],
  "east-village-les": [40.7228, -73.9856],
  "fidi": [40.7075, -74.0113],
  "williamsburg": [40.7081, -73.9571],
  "dumbo-heights": [40.6985, -73.9934],
  "downtown-brooklyn": [40.6908, -73.9859],
  "park-slope": [40.6690, -73.9806],
  "coney-island": [40.5755, -73.9707],
  "astoria-lic": [40.7595, -73.9324],
  "flushing-corona": [40.7424, -73.8458],
  "south-bronx": [40.8126, -73.9182],
  "bronx-park-fordham": [40.8576, -73.8794],
  "st-george-north": [40.6430, -74.0818]
};

// Real GPS Coordinate lookup for specific landmarks
const LANDMARK_GEO_COORDS: Record<string, [number, number]> = {
  "the-cloisters": [40.8649, -73.9317],
  "little-red-lighthouse": [40.8506, -73.947],
  "apollo-theater": [40.8097, -73.9501],
  "bethesda-fountain": [40.7737, -73.9708],
  "amnh": [40.7813, -73.974],
  "lincoln-center": [40.7725, -73.9843],
  "the-met": [40.7794, -73.9632],
  "guggenheim": [40.783, -73.959],
  "the-high-line": [40.748, -74.0048],
  "chelsea-market": [40.742, -74.0062],
  "empire-state": [40.7484, -73.9857],
  "times-square": [40.758, -73.9855],
  "grand-central": [40.7527, -73.9772],
  "stonewall-inn": [40.7338, -74.0021],
  "washington-sq-arch": [40.7308, -73.9973],
  "tenement-museum": [40.7188, -73.9901],
  "one-wtc": [40.7127, -74.0134],
  "charging-bull": [40.7056, -74.0134],
  "williamsburg-bridge": [40.7126, -73.9723],
  "brooklyn-bridge": [40.7061, -73.9969],
  "barclays-center": [40.6826, -73.9754],
  "brooklyn-museum": [40.6712, -73.9638],
  "cyclone": [40.5758, -73.9786],
  "moma-ps1": [40.7456, -73.9477],
  "unisphere": [40.7461, -73.8448],
  "louis-armstrong-house": [40.7528, -73.8624],
  "yankee-stadium": [40.8296, -73.9262],
  "bronx-zoo": [40.8506, -73.877],
  "nybg": [40.8617, -73.8802],
  "si-ferry": [40.6437, -74.0731],
  "snug-harbor": [40.6444, -74.1028]
};

// Real GPS Coordinate lookup for specific green spaces/parks
const PARK_GEO_COORDS: Record<string, [number, number]> = {
  "Fort Tryon Park": [40.8626, -73.9313],
  "Marcus Garvey Park": [40.8043, -73.9431],
  "The Great Lawn": [40.7812, -73.9665],
  "Riverside Park": [40.7877, -73.9798],
  "Carl Schurz Park": [40.7745, -73.9429],
  "Hudson River Park": [40.747, -74.0101],
  "Bryant Park": [40.7536, -73.9832],
  "Washington Square Park": [40.7308, -73.9973],
  "Tompkins Square Park": [40.7265, -73.9818],
  "The Battery": [40.7013, -74.017],
  "McCarren Park": [40.7214, -73.9495],
  "Brooklyn Bridge Park": [40.7022, -73.9961],
  "Fort Greene Park": [40.6896, -73.974],
  "Prospect Park": [40.6602, -73.969],
  "Coney Island Beach & Boardwalk": [40.574, -73.978],
  "Socrates Sculpture Park": [40.7687, -73.9365],
  "Flushing Meadows-Corona Park": [40.7397, -73.8408],
  "Crotona Park": [40.8385, -73.8996],
  "New York Botanical Garden": [40.8617, -73.8802],
  "Silver Lake Park": [40.6275, -74.095]
};

export default function MapContainer({
  darkMode,
  activeFilter,
  searchQuery,
  selectedNeighborhood,
  onSelectNeighborhood,
  geoJsonData,
  heatmapMode,
  forecasts,
}: MapContainerProps) {
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Helper to extract feature details from any NTA or merged GeoJSON standard
  const getFeatureProps = (feature: any) => {
    const props = feature.properties || {};
    const code = String(props.id || props.code || props.NTACode || props.ntacode || props.NTA2020 || props.nta2020 || "");
    const rawName = props.name || props.neighborhood || props.NTAName || props.ntaname || props.NTA2020Name || props.nta2020name || "";
    // Elegantly slice off descriptors & parenthesis
    const name = rawName.replace(/-\s*[^,]+/g, "").replace(/\(.*?\)/g, "").trim();
    const borough = props.borough || props.BoroName || props.boroname || props.boro_name || "";
    return { code, name, borough };
  };

  // Resolve curated neighborhood from feature properties using the exact same logic as App.tsx
  const getCuratedNeighborhoodForFeature = (code: string, name: string, borough: string) => {
    const cleanNta = name.toLowerCase();
    const cleanBoro = borough.trim().toLowerCase();

    const match = NYC_NEIGHBORHOODS.find(n => {
      const cleanCuratedName = n.name.toLowerCase();
      const cleanCuratedBoro = n.borough.trim().toLowerCase();

      // Ensure the boroughs match correctly
      const isBoroMatch = (cleanCuratedBoro === cleanBoro) ||
                          (cleanCuratedBoro.includes("bronx") && cleanBoro.includes("bronx")) ||
                          (cleanCuratedBoro.includes("staten") && cleanBoro.includes("staten"));

      if (!isBoroMatch) return false;

      // Direct match of the names
      if (cleanCuratedName === cleanNta) return true;

      // Substring match only if the name is specific (length > 4) to prevent "co" or "green" matching
      if (cleanCuratedName.length > 4 && cleanNta.includes(cleanCuratedName)) return true;
      if (cleanNta.length > 4 && cleanCuratedName.includes(cleanNta)) return true;
      
      // Special alignments
      if (n.id === "fidi" && (cleanNta.includes("financial district") || cleanNta.includes("battery park city"))) return true;
      if (n.id === "chelsea-hk" && (cleanNta.includes("chelsea") || cleanNta.includes("hell's kitchen") || cleanNta.includes("hells kitchen"))) return true;
      if (n.id === "dumbo-heights" && (cleanNta.includes("dumbo") || cleanNta.includes("brooklyn heights") || cleanNta.includes("vinegar hill"))) return true;
      if (n.id === "east-village-les" && (cleanNta.includes("east village") || cleanNta.includes("lower east side") || cleanNta.includes("chinatown") || cleanNta.includes("little italy"))) return true;
      if (n.id === "astoria-lic" && (cleanNta.includes("astoria") || cleanNta.includes("long island city") || cleanNta.includes("queensbridge") || cleanNta.includes("steinway"))) return true;
      if (n.id === "flushing-corona" && (cleanNta.includes("flushing") || cleanNta.includes("corona") || cleanNta.includes("willets point"))) return true;
      if (n.id === "bronx-park-fordham" && (cleanNta.includes("fordham") || cleanNta.includes("bronx park") || cleanNta.includes("belmont"))) return true;
      if (n.id === "south-bronx" && (cleanNta.includes("mott haven") || cleanNta.includes("melrose") || cleanNta.includes("hunts point") || cleanNta.includes("port morris"))) return true;
      if (n.id === "st-george-north" && (cleanNta.includes("st. george") || cleanNta.includes("st george") || cleanNta.includes("snug harbor") || cleanNta.includes("stapleton"))) return true;
      
      return false;
    });

    return match || null;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet instance
    const map = L.map(mapContainerRef.current, {
      center: [40.7428, -73.9860], // Centered over Midtown Manhattan
      zoom: 11.5,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // Add Tile layer
    const tileUrl = darkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const tileLayer = L.tileLayer(tileUrl, { maxZoom: 19 });
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Add Markers group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Trigger initial load resizing
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Map Tile Mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = darkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const newTileLayer = L.tileLayer(tileUrl, { maxZoom: 19 });
    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [darkMode]);

  // Handle Polygons Style Rendering
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoJsonData) return;

    if (geoJsonLayerRef.current) {
      const prevLayer = geoJsonLayerRef.current;
      try {
        prevLayer.eachLayer((layer: any) => {
          try {
            if (layer.closeTooltip) {
              layer.closeTooltip();
            }
            if (layer.unbindTooltip) {
              layer.unbindTooltip();
            }
            layer.off();
          } catch (e) {}
        });
      } catch (e) {}

      try {
        if (typeof map.closeTooltip === "function") {
          map.closeTooltip();
        }
      } catch (e) {}

      try {
        map.removeLayer(prevLayer);
      } catch (e) {}
    }

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const { code, name, borough } = getFeatureProps(feature);
        const match = getCuratedNeighborhoodForFeature(code, name, borough);
        const forecastId = match ? match.id : code;
        const isSelected = selectedNeighborhood?.id === forecastId;
        const isSearched =
          searchQuery && name.toLowerCase().includes(searchQuery.toLowerCase());

        if (heatmapMode) {
          const forecast = forecasts[forecastId] || runRenewalLSTMForecast(forecastId, match ? match.borough : borough, match ? match.name : name);
          const score = forecast ? (forecast.score2031 ?? 0.0) : 0.0;
          return {
            fillColor: getHeatmapRed(score),
            fillOpacity: isSelected ? 0.65 : isSearched ? 0.50 : 0.35,
            color: isSelected ? "#ffffff" : "#6f1d1d",
            weight: isSelected ? 2.5 : isSearched ? 1.8 : 0.8,
            dashArray: isSelected ? "" : "2",
          };
        }

        return {
          fillColor: isSelected
            ? (darkMode ? "#a1b18a" : "#7d8b68")
            : isSearched
              ? (darkMode ? "#cfad7e" : "#af814f")
              : (darkMode ? "#343029" : "#EBE3D5"),
          fillOpacity: isSelected ? 0.35 : isSearched ? 0.25 : 0.08,
          color: isSelected
            ? (darkMode ? "#cfd3c1" : "#738b5d")
            : isSearched
              ? (darkMode ? "#dfb072" : "#99734d")
              : (darkMode ? "#403a31" : "#d3c8b4"),
          weight: isSelected ? 2.5 : isSearched ? 2.0 : 1.0,
          dashArray: isSelected ? "" : "3",
        };
      },
      onEachFeature: (feature, layer) => {
        const { code, name, borough } = getFeatureProps(feature);
        const match = getCuratedNeighborhoodForFeature(code, name, borough);
        const forecastId = match ? match.id : code;
        const finalName = match ? match.name : name;
        const finalBoro = match ? match.borough : borough;
        const forecast = forecasts[forecastId] || runRenewalLSTMForecast(forecastId, finalBoro, finalName);
        const scorePct = ((forecast?.score2031 ?? 0.0) * 100).toFixed(1);

        // Bind high-contrast clean tooltip statically
        layer.bindTooltip(
          `
          <div class="p-1 font-sans text-stone-900 select-none">
            <span class="block text-xs font-bold">${finalName}</span>
            <span class="block text-[9px] font-mono mt-0.5 tracking-wider uppercase text-amber-700 font-semibold">
              ${finalBoro} • Code ${code}
            </span>
            ${heatmapMode ? `<span class="block text-[10px] font-semibold text-rose-800 mt-1 font-sans">2031 Corp Branch & Yield Prob: ${scorePct}%</span>` : ''}
          </div>
          `,
          { sticky: true, className: "custom-hover-tooltip" }
        );

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            const isSelected = selectedNeighborhood?.id === forecastId;
            // Highlight hover
            if (!isSelected) {
              if (heatmapMode) {
                const score = forecast ? (forecast.score2031 ?? 0.0) : 0.0;
                l.setStyle({
                  fillColor: getHeatmapRed(Math.min(1.0, score + 0.1)),
                  fillOpacity: 0.55,
                  color: "#ff0000",
                  weight: 1.5,
                });
              } else {
                l.setStyle({
                  fillColor: darkMode ? "#423b32" : "#ddcca8",
                  fillOpacity: 0.25,
                  color: darkMode ? "#dfb072" : "#af814f",
                  weight: 1.8,
                });
              }
            }
          },
          mouseout: (e) => {
            const l = e.target;
            try {
              geoJsonLayer.resetStyle(l);
            } catch (err) {}
          },
          click: (e) => {
            const l = e.target;
            const centroidLatLng = l.getBounds().getCenter();
            
            onSelectNeighborhood({
              id: forecastId,
              name: finalName,
              borough: finalBoro as any,
              centroid: { x: centroidLatLng.lng, y: centroidLatLng.lat },
              polygonPoints: [], 
              description: "",
              keyAesthetics: [],
              keyStats: { vibe: "", character: "", historicNotes: "" },
              landmarks: [],
              diningSpots: [],
              greenSpaces: [],
            });
          },
        });
      },
    });

    geoJsonLayer.addTo(map);
    geoJsonLayerRef.current = geoJsonLayer;
  }, [geoJsonData, selectedNeighborhood?.id, searchQuery, darkMode, heatmapMode, forecasts]);

  // Recenter Map on Selected Neighborhood Coordinate change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedNeighborhood) return;

    // 1. Try to find the matching layer in the geojson output to fit its bounds perfectly
    if (geoJsonLayerRef.current) {
      let matchedLayer: any = null;
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        try {
          const featProps = getFeatureProps(layer.feature);
          const match = getCuratedNeighborhoodForFeature(featProps.code, featProps.name, featProps.borough);
          const forecastId = match ? match.id : featProps.code;
          if (forecastId === selectedNeighborhood.id) {
            matchedLayer = layer;
          }
        } catch (e) {}
      });
      if (matchedLayer) {
        try {
          const bounds = matchedLayer.getBounds();
          map.fitBounds(bounds, { maxZoom: 14, animate: true, duration: 1.2 });
          return;
        } catch (e) {
          console.error("Error setting map fitBounds:", e);
        }
      }
    }

    // 2. Fallback to static centroids lookup mapped globally
    const coords = NEIGHBORHOOD_GEO_CENTROIDS[selectedNeighborhood.id];
    if (coords) {
      map.setView(coords, 14, { animate: true, duration: 1.2 });
      return;
    }

    // 3. Fallback to passed lat/lng coordinates if they look like a real location & not the midtown center default
    const lat = selectedNeighborhood.centroid.y;
    const lng = selectedNeighborhood.centroid.x;
    const isGeo = lat > 35 && lat < 45 && lng < -70 && lng > -75;
    const isMidtownDefault = Math.abs(lat - 40.7128) < 0.001 && Math.abs(lng - (-74.0060)) < 0.001;

    if (isGeo && !isMidtownDefault) {
      map.setView([lat, lng], 14, { animate: true, duration: 1.2 });
    }
  }, [selectedNeighborhood?.id]);

  // Aggregate and Draw Landmarks & Parks Markers Layer
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
  }, [selectedNeighborhood?.id, activeFilter, darkMode]);

  // Zoom / Recenter button handlers
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleReset = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([40.7428, -73.9860], 11.5, { animate: true, duration: 1 });
    onSelectNeighborhood(null);
  };

  return (
    <div 
      className={`relative w-full h-[60vh] md:h-full flex-grow rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm ${
        darkMode 
          ? "border-nat-border-dark bg-nat-bg-dark" 
          : "border-nat-border-light bg-[#F9F7F3]"
      }`}
      id="nyc-interactive-map-frame-wrapper"
    >
      {/* MAP MOUNT CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full z-10" id="nyc-leaflet-core-node" />

      {/* OVERLAY NAVIGATION BUTTONS & CARTO-COMPASS */}
      <div 
        className="absolute top-4 right-4 z-20 flex flex-col gap-2" 
        id="cartography-tactile-zoom-rail"
      >
        <button
          onClick={handleZoomIn}
          className={`p-2.5 rounded-xl border font-bold flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm hover:scale-105 ${
            darkMode 
              ? "bg-nat-card-dark border-nat-border-dark text-[#C6A475] hover:bg-[#2d2c25]" 
              : "bg-nat-card-light border-nat-border-light text-[#A98C70] hover:bg-[#f3f1eb]"
          }`}
          title="Zoom In Closer"
          id="zoom-in-button"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className={`p-2.5 rounded-xl border font-bold flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm hover:scale-105 ${
            darkMode 
              ? "bg-nat-card-dark border-nat-border-dark text-[#C6A475] hover:bg-[#2d2c25]" 
              : "bg-nat-card-light border-nat-border-light text-[#A98C70] hover:bg-[#f3f1eb]"
          }`}
          title="Zoom Out Further"
          id="zoom-out-button"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          className={`p-2.5 rounded-xl border font-bold flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm hover:scale-105 ${
            darkMode 
              ? "bg-nat-card-dark border-nat-border-dark text-[#EBE3D5] hover:bg-[#2d2c25]" 
              : "bg-nat-card-light border-nat-border-light text-stone-700 hover:bg-[#f3f1eb]"
          }`}
          title="Recenter and Reset Grid"
          id="reset-grid-button"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* FLOATING COMPASS CALIBRATOR */}
      <div 
        className={`absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[10px] font-mono tracking-wider transition-all shadow-sm ${
          darkMode 
            ? "bg-nat-card-dark border-nat-border-dark text-[#C6A475]/80" 
            : "bg-nat-card-light border-nat-border-light text-[#A98C70]"
        }`}
        id="tactile-bearing-meter"
      >
        <Compass className="w-3.5 h-3.5 animate-spin-slow" />
        <span className="font-semibold select-none leading-none pt-0.5">GRID SYNCHRONOUS</span>
      </div>

    </div>
  );
}
