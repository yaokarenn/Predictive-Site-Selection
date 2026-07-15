import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MapContainer from "./components/MapContainer";
import { Neighborhood, MapViewFilter } from "./types";
import { NYC_NEIGHBORHOODS } from "./data/nycData";
import { HelpCircle, Info, MapPin, Sparkles, Eye, EyeOff } from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<MapViewFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  
  // Real NTA GeoJSON dynamic state
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [allNtas, setAllNtas] = useState<any[]>([]);
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(true);

  // 2031 Forecasting & Heatmap States
  const [heatmapMode, setHeatmapMode] = useState<boolean>(true);
  const [forecasts, setForecasts] = useState<Record<string, any>>({});
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [aiAnalysisReport, setAiAnalysisReport] = useState<string | null>(null);

  // Pre-load LSTM Forecasts from Server API or fall back gracefully
  useEffect(() => {
    fetch("/api/renewal-forecast")
      .then(res => {
        if (!res.ok) throw new Error("Forecast API not responsive");
        return res.json();
      })
      .then(data => {
        if (data && data.success && Array.isArray(data.forecasts)) {
          const dict: Record<string, any> = {};
          data.forecasts.forEach((f: any) => {
            if (f && f.id) dict[f.id] = f;
          });
          setForecasts(dict);
        } else if (data && typeof data === "object") {
          setForecasts(data);
        }
      })
      .catch(err => {
        console.warn("Forecast API offline, utilizing high-fidelity local real-time forecast fallback engine.", err);
      });
  }, []);

  // Flush AI report when active selection shifts
  useEffect(() => {
    setAiAnalysisReport(null);
  }, [selectedNeighborhood?.id]);

  const handleTriggerAiAnalysis = async (id: string, name: string, borough: string) => {
    setIsAnalyzingAi(true);
    setAiAnalysisReport(null);
    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, borough }),
      });
      if (!response.ok) {
        throw new Error("Network request returned negative response status");
      }
      const data = await response.json();
      setAiAnalysisReport(data.report || "No analysis report was generated.");
    } catch (err: any) {
      console.error("Gemini AI planning synthesis failed:", err);
      setAiAnalysisReport(
        "# AI Architectural Planning Report Error\n\n" +
        "Could not generate real-time 2031 urban prediction. This usually occurs if the background server endpoint is offline or if the Gemini API is blocked.\n\n" +
        "**Technical details:**\n" +
        "- " + err.message
      );
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("nyc-map-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (!savedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Fetch and dynamically merge official fine-grained NYC neighborhood boundaries for all 5 boroughs
  useEffect(() => {
    setIsLoadingMap(true);
    const base = "https://raw.githubusercontent.com/blackmad/neighborhoods/master/";
    const files = [
      { name: "manhattan.geojson", borough: "Manhattan" },
      { name: "brooklyn.geojson", borough: "Brooklyn" },
      { name: "queens.geojson", borough: "Queens" },
      { name: "bronx.geojson", borough: "The Bronx" },
      { name: "staten-island.geojson", borough: "Staten Island" }
    ];

    Promise.all(
      files.map(file =>
        fetch(base + file.name)
          .then(res => {
            if (!res.ok) throw new Error(`Could not load ${file.name}`);
            return res.json();
          })
          .then(data => {
            // Tag features with borough and normalise properties consistently
            const features = (data.features || []).map((f: any) => {
              f.properties = f.properties || {};
              const rawName = f.properties.neighborhood || f.properties.name || f.properties.neighborhood_name || f.properties.Neighborhood || "";
              const cleanName = rawName.replace(/-\s*[^,]+/g, "").replace(/\(.*?\)/g, "").trim();
              
              f.properties.name = cleanName;
              f.properties.borough = file.borough;
              
              const rawId = f.properties.id || f.properties.cartodb_id || cleanName;
              const code = `${file.borough}-${rawId}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              f.properties.id = code;
              f.properties.code = code;
              
              return f;
            });
            return { borough: file.borough, features };
          })
      )
    )
      .then(results => {
        let allFeatures: any[] = [];
        results.forEach(res => {
          allFeatures = allFeatures.concat(res.features);
        });

        const mergedGeoJson = {
          type: "FeatureCollection",
          features: allFeatures
        };

        setGeoJsonData(mergedGeoJson);

        const parsed = allFeatures.map((f: any) => {
          const props = f.properties || {};
          const code = props.id || props.code;
          const cleanName = props.name;
          const borough = props.borough;

          // Simple polygon centroid math
          let centroid = { x: -74.0060, y: 40.7128 };
          if (f.geometry) {
            if (f.geometry.type === "Polygon" && f.geometry.coordinates[0]) {
              const coords = f.geometry.coordinates[0];
              let sumX = 0, sumY = 0;
              coords.forEach((c: number[]) => {
                sumX += c[0];
                sumY += c[1];
              });
              centroid = { x: sumX / coords.length, y: sumY / coords.length };
            } else if (f.geometry.type === "MultiPolygon" && f.geometry.coordinates[0]?.[0]) {
              const coords = f.geometry.coordinates[0][0];
              let sumX = 0, sumY = 0;
              coords.forEach((c: number[]) => {
                sumX += c[0];
                sumY += c[1];
              });
              centroid = { x: sumX / coords.length, y: sumY / coords.length };
            }
          }

          return {
            id: code,
            name: cleanName,
            borough: borough,
            centroid: centroid,
            feature: f
          };
        });

        setAllNtas(parsed);
        setIsLoadingMap(false);
      })
      .catch(err => {
        console.error("Error loading fine-grained NYC datasets", err);
        setIsLoadingMap(false);
      });
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem("nyc-map-theme", newVal ? "dark" : "light");
      return newVal;
    });
  };

  const mapBoroughName = (boro: string): any => {
    const b = boro.trim().toLowerCase();
    if (b.includes("manhattan")) return "Manhattan";
    if (b.includes("brooklyn")) return "Brooklyn";
    if (b.includes("queens")) return "Queens";
    if (b.includes("bronx")) return "The Bronx";
    if (b.includes("staten")) return "Staten Island";
    return "Manhattan";
  };

  const matchCuratedNeighborhood = (ntaName: string, boro: string): Neighborhood | null => {
    const cleanNta = ntaName.toLowerCase();
    const cleanBoro = boro.trim().toLowerCase();

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

  const handleSelectNeighborhood = (neighborhood: Neighborhood | null) => {
    if (!neighborhood) {
      setSelectedNeighborhood(null);
      setSearchQuery("");
      return;
    }

    // Attempt to match curated neighborhood profile
    const curatedMatch = NYC_NEIGHBORHOODS.find(n => n.id === neighborhood.id) || 
                         matchCuratedNeighborhood(neighborhood.name, neighborhood.borough);

    if (curatedMatch) {
      setSelectedNeighborhood({
        ...curatedMatch,
        centroid: neighborhood.centroid // Keep exact geographic centroid!
      });
      setSearchQuery(curatedMatch.name);
    } else {
      // Create high-fidelity dynamic NTA profile
      const dynamicNta: Neighborhood = {
        id: neighborhood.id,
        name: neighborhood.name,
        borough: mapBoroughName(neighborhood.borough),
        polygonPoints: [],
        centroid: neighborhood.centroid,
        description: `Located in the borough of ${neighborhood.borough}, ${neighborhood.name} is an official Neighborhood Tabulation Area (NTA) in New York City. Bounded officially as statistical planning zone ${neighborhood.id} by the Department of City Planning, this district encompasses a vital residential, historical, and commercial component of the city's diverse landscape.`,
        keyAesthetics: ["Local independent venues", "Classic brickwork architecture", "Tree-lined sidewalk streets", "Traditional NYC storefronts"],
        keyStats: {
          vibe: "Lively, authentic & neighborhood-focused",
          character: "Historic and active city residential corridor",
          historicNotes: "Formed and utilized by the NYC Department of City Planning to analyze demographic indices, local infrastructure, and regional resources accurately."
        },
        landmarks: [],
        diningSpots: [],
        greenSpaces: []
      };
      setSelectedNeighborhood(dynamicNta);
      setSearchQuery(neighborhood.name);
    }
  };

  const handleSelectNeighborhoodById = (id: string) => {
    // 1. Search curated list
    const target = NYC_NEIGHBORHOODS.find(n => n.id === id);
    if (target) {
      // Find geo centroid if loaded
      const matchedGeo = allNtas.find(nta => nta.name.toLowerCase().includes(target.name.toLowerCase()));
      handleSelectNeighborhood({
        ...target,
        centroid: matchedGeo ? matchedGeo.centroid : { x: -74.0060, y: 40.7128 }
      });
    } else {
      // 2. Search all NTAs list
      const targetNta = allNtas.find(nta => nta.id === id);
      if (targetNta) {
        handleSelectNeighborhood({
          id: targetNta.id,
          name: targetNta.name,
          borough: targetNta.borough,
          polygonPoints: [],
          centroid: targetNta.centroid,
          description: "",
          keyAesthetics: [],
          keyStats: { vibe: "", character: "", historicNotes: "" },
          landmarks: [],
          diningSpots: [],
          greenSpaces: []
        });
      }
    }
  };

  const handleRecenter = (neighborhood: Neighborhood) => {
    setSelectedNeighborhood({ ...neighborhood });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      darkMode ? "bg-nat-bg-dark text-nat-text-dark" : "bg-nat-bg-light text-nat-text-light"
    }`} id="nyc-interactive-map-app-root">
      
      {/* HEADER / NAVIGATION BAR */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        onSelectNeighborhood={handleSelectNeighborhood}
        allNtas={allNtas}
      />

      {/* DUPLEX INTERFACE (Sidebar & Map View) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden max-h-[calc(100vh-76px)]" id="nyc-duplex-content-layer">
        
        {/* DETAILED DISTRICT SIDEBAR PROFILE */}
        <div className={`w-full md:w-auto flex-shrink-0 flex flex-col rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 ${
          darkMode ? "border-nat-border-dark" : "border-nat-border-light-dark border-nat-border-light"
        }`} id="district-sidebar-container">
          <Sidebar
            darkMode={darkMode}
            selectedNeighborhood={selectedNeighborhood}
            onClose={() => handleSelectNeighborhood(null)}
            onRecenter={handleRecenter}
            onSelectNeighborhoodById={handleSelectNeighborhoodById}
            forecasts={forecasts}
            isAnalyzingAi={isAnalyzingAi}
            aiAnalysisReport={aiAnalysisReport}
            onTriggerAiAnalysis={handleTriggerAiAnalysis}
            allNtas={allNtas}
          />
        </div>

        {/* MAP CONTAINER CANVAS */}
        <div className="flex-grow flex flex-col min-w-0" id="cartography-canvas-container">
          {isLoadingMap ? (
            <div className={`flex-grow rounded-2xl border flex flex-col items-center justify-center min-h-[60vh] md:h-full gap-4 ${
              darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-nat-bg-light border-nat-border-light text-nat-text-light"
            }`}>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse delay-200"></span>
              </div>
              <p className="text-xs font-mono tracking-widest uppercase opacity-70">
                Charting All NYC NTA Boundaries...
              </p>
            </div>
          ) : (
            <MapContainer
              darkMode={darkMode}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
              selectedNeighborhood={selectedNeighborhood}
              onSelectNeighborhood={handleSelectNeighborhood}
              geoJsonData={geoJsonData}
              heatmapMode={heatmapMode}
              forecasts={forecasts}
            />
          )}

          {/* Dynamic contextual legend below map */}
          <div className={`mt-3 p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all text-xs ${
            darkMode 
              ? "bg-[#1d1c16] border-[#2f2c25] text-[#ccc7bc]" 
              : "bg-white border-stone-200 text-stone-800 shadow-sm"
          }`} id="cartography-contextual-legend">
            {heatmapMode ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto text-center sm:text-left">
                <span className="font-bold uppercase text-[9.5px] font-mono tracking-wider text-[#A98C70] dark:text-[#C6A475]">
                  2031 Corporate Franchise & Yield Potential:
                </span>
                <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 font-mono">
                  <span>Low (0%)</span>
                  {/* Yellow to red gradient steps */}
                  <div className="h-3 w-32 rounded overflow-hidden flex border border-stone-200/30 dark:border-stone-800">
                    <span className="flex-1" style={{ backgroundColor: "#ffffcc" }} title="< 15%" />
                    <span className="flex-1" style={{ backgroundColor: "#fed976" }} title="15% - 35%" />
                    <span className="flex-1" style={{ backgroundColor: "#feb24c" }} title="35% - 55%" />
                    <span className="flex-1" style={{ backgroundColor: "#fd8d3c" }} title="55% - 75%" />
                    <span className="flex-1" style={{ backgroundColor: "#f03b20" }} title="75% - 90%" />
                    <span className="flex-1" style={{ backgroundColor: "#bd0026" }} title="> 90%" />
                  </div>
                  <span>High (100%)</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3.5 flex-wrap justify-center sm:justify-start">
                <span className="font-bold uppercase text-[9.5px] font-mono tracking-wider text-[#A98C70] dark:text-[#C6A475]">
                  Map Legend:
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#7d8b68] dark:text-[#a1b18a]">
                  <span className="w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-700 inline-block" style={{ backgroundColor: darkMode ? "#a1b18a" : "#7d8b68" }} />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  <span className="w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-700 inline-block" style={{ backgroundColor: darkMode ? "#342f27" : "#ebe3d5" }} />
                  <span>Other Zones</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-nat-accent-light dark:bg-nat-accent-dark inline-block"></span>
                  <span>Landmarks & Culture</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7A8B7B] inline-block"></span>
                  <span>Parks</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              {!heatmapMode && (
                <div className="hidden lg:flex items-center gap-1 text-[10px] italic text-stone-400 dark:text-stone-500 mr-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A475]" />
                  <span>Select any zone for investor yield metrics & corporate expansion predictions</span>
                </div>
              )}
              <button
                onClick={() => setHeatmapMode(prev => !prev)}
                className={`py-1.5 px-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold select-none transition-all duration-200 active:scale-[0.98] w-full sm:w-auto ${
                  heatmapMode
                    ? "bg-[#bd0026] border-transparent text-white hover:bg-[#a10020]"
                    : darkMode
                      ? "bg-[#2d2c25] border-[#3f3b32] text-[#fff6e6] hover:bg-[#3d3c35]"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 shadow-sm"
                }`}
                id="toggle-heatmap-footer-button"
              >
                {heatmapMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{heatmapMode ? "Disable 2031 Heatmap" : "Enable 2031 Heatmap"}</span>
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
