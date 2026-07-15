import React, { useState, useEffect } from "react";
import { 
  X, 
  MapPin, 
  Building2, 
  Trees, 
  Palette, 
  Compass, 
  Navigation, 
  HelpCircle, 
  Heart, 
  Award, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Bookmark,
  TrendingUp,
  Brain,
  Cpu,
  RefreshCw,
  Search
} from "lucide-react";
import { Neighborhood, Landmark, DiningSpot } from "../types";
import { NYC_NEIGHBORHOODS } from "../data/nycData";
import { getNeighborhoodCensusData } from "../utils/censusData";
import { runRenewalLSTMForecast } from "../utils/lstm";

interface SidebarProps {
  darkMode: boolean;
  selectedNeighborhood: Neighborhood | null;
  onClose: () => void;
  onRecenter: (neighborhood: Neighborhood) => void;
  onSelectNeighborhoodById: (id: string) => void;
  forecasts: Record<string, any>;
  isAnalyzingAi: boolean;
  aiAnalysisReport: string | null;
  onTriggerAiAnalysis: (id: string, name: string, borough: string) => void;
  allNtas?: any[];
}

export default function Sidebar({
  darkMode,
  selectedNeighborhood,
  onClose,
  onRecenter,
  onSelectNeighborhoodById,
  forecasts,
  isAnalyzingAi,
  aiAnalysisReport,
  onTriggerAiAnalysis,
  allNtas = [],
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"about" | "census" | "landmarks" | "parks" | "forecast">("about");
  const [showTechnicalLstmDetails, setShowTechnicalLstmDetails] = useState(false);
  const [showMethodologyDetails, setShowMethodologyDetails] = useState(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
  const [leaderboardMode, setLeaderboardMode] = useState<"groups" | "all">("groups");

  useEffect(() => {
    if (selectedNeighborhood) {
      // Switch to census tab on selection
      setActiveTab("census");
    }
  }, [selectedNeighborhood]);

  // Precompute ranked items for the Structural Evolution Index
  const rankedItems = React.useMemo(() => {
    return [...NYC_NEIGHBORHOODS].map(n => {
      const forecast = forecasts[n.id] || runRenewalLSTMForecast(n.id, n.borough, n.name);
      return {
        ...n,
        score: forecast?.score2031 ?? 0.0,
        scorePct: ((forecast?.score2031 ?? 0.0) * 100).toFixed(1)
      };
    }).sort((a, b) => b.score - a.score);
  }, [forecasts]);

  // Precompute ranked items for the Structural Evolution Index of 100+ fine-grained sectors
  const rankedAllItems = React.useMemo(() => {
    if (!allNtas || allNtas.length === 0) return [];
    return allNtas.map(nta => {
      const forecast = forecasts[nta.id] || runRenewalLSTMForecast(nta.id, nta.borough, nta.name);
      return {
        id: nta.id,
        name: nta.name,
        borough: nta.borough,
        description: `Official statistical sector (NTA Code: ${nta.id.split('-').pop()?.toUpperCase() || ''}) in ${nta.borough}.`,
        score: forecast?.score2031 ?? 0.0,
        scorePct: ((forecast?.score2031 ?? 0.0) * 100).toFixed(1)
      };
    }).sort((a, b) => b.score - a.score);
  }, [allNtas, forecasts]);

  const activeRankedItems = leaderboardMode === "groups" ? rankedItems : rankedAllItems;

  const filteredRankedItems = React.useMemo(() => {
    if (!leaderboardSearch) return activeRankedItems;
    const query = leaderboardSearch.toLowerCase();
    return activeRankedItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.borough.toLowerCase().includes(query)
    );
  }, [activeRankedItems, leaderboardSearch]);

  const getBoroughColorClass = (borough: string) => {
    switch (borough) {
      case "Manhattan": return darkMode ? "text-[#E6B392] bg-[#BF8B6E]/20 border-[#BF8B6E]/40" : "text-[#8C5333] bg-[#F7ECE4] border-[#EAD5C8]";
      case "Brooklyn": return darkMode ? "text-[#A7B7A3] bg-[#7A8B7B]/20 border-[#7A8B7B]/40" : "text-[#3D4C3E] bg-[#EDF2ED] border-[#DAE5DA]";
      case "Queens": return darkMode ? "text-[#E1C297] bg-[#C6A475]/20 border-[#C6A475]/40" : "text-[#7B5E35] bg-[#F8F3EA] border-[#ECDDC5]";
      case "The Bronx": return darkMode ? "text-[#CCA685] bg-[#A98C70]/20 border-[#A98C70]/40" : "text-[#62472F] bg-[#F5ECE2] border-[#EAD0B7]";
      case "Staten Island": return darkMode ? "text-[#A7C0C5] bg-[#879FA5]/20 border-[#879FA5]/40" : "text-[#405C62] bg-[#EEF5F6] border-[#D4E4E6]";
      default: return "";
    }
  };

  return (
    <div 
      className={`relative w-full md:w-[420px] lg:w-[460px] h-[75vh] md:h-full flex flex-col transition-all duration-300 md:border-r border-t md:border-t-0 select-none overflow-hidden ${
        darkMode 
          ? "bg-nat-card-dark text-nat-text-dark border-nat-border-dark shadow-sm" 
          : "bg-nat-card-light text-nat-text-light border-nat-border-light shadow-sm"
      }`}
      id="nyc-sidebar-panel"
    >
      {/* CASE A: NO NEIGHBORHOOD SELECTED -> DISPLAY DEFAULT LANDING MINI-DASHBOARD */}
      {!selectedNeighborhood ? (
        <div className="flex-1 overflow-y-auto p-5 md:p-6 flex flex-col gap-5 scrollbar-thin" id="default-dashboard-wrapper">
          
          {/* Header */}
          <div className="space-y-1 mt-1" id="leaderboard-welcome-header">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#A98C70] dark:text-[#C6A475]">
                Commercial Expansion & Investment Index
              </span>
            </div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-stone-900 dark:text-stone-100">
              Corporate Footprint & Yield Leaderboard
            </h2>
            <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400 font-sans">
              Ranked overview of New York City neighborhoods experiencing high-density commercial expansion. Redder zones indicate top prospects for upcoming national retail branches (e.g., Starbucks or Dunkin') and premium multi-family real estate acquisitions.
            </p>
          </div>

          {/* Methodology & Data Sources Card */}
          <div className={`p-4 rounded-xl border space-y-3.5 ${
            darkMode ? "bg-stone-950/40 border-[#2f2c25]" : "bg-orange-50/25 border-orange-100/70 shadow-sm"
          }`} id="datacenter-methodology-card">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C6A475]" />
              <h3 className="font-bold text-stone-800 dark:text-stone-100 text-[11px] uppercase tracking-wide font-mono">
                🔮 Predictive Methodology Overview
              </h3>
            </div>
            
            <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
              Elite retail companies use online web research and geographic mapping to decide where to place their next branches. Our system models this intelligence dynamically over a 5-year outlook.
            </p>

            <div className="grid grid-cols-2 gap-3 pb-1">
              {/* Datasets Used */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] uppercase font-mono font-bold text-rose-700 dark:text-rose-400 tracking-wider">
                  📂 Datasets Used
                </span>
                <ul className="space-y-1 text-[10.5px] text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> NYC Open Data
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> US Census Data
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> Kaggle Datasets
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> GitHub Open-Source
                  </li>
                </ul>
              </div>

              {/* Variables Tracked */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] uppercase font-mono font-bold text-rose-700 dark:text-rose-400 tracking-wider">
                  📊 Variables Tracked
                </span>
                <ul className="space-y-1 text-[10.5px] text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> Business licenses
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> Zoning changes
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> Retail density
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-stone-300 dark:text-stone-600">•</span> Commercial leases
                  </li>
                </ul>
              </div>
            </div>

            {/* Collapsible details covering remaining user variables & intuition */}
            <div className="pt-1.5 border-t border-dashed border-stone-200 dark:border-stone-850">
              <button 
                onClick={() => setShowMethodologyDetails(!showMethodologyDetails)}
                className="flex items-center justify-between w-full text-[10px] uppercase font-mono font-bold text-[#A88B6E] dark:text-[#C6A475] hover:opacity-85"
                id="toggle-methodology-btn"
              >
                <span>{showMethodologyDetails ? "Hide full methodology" : "View full tracked variables & model intuition"}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showMethodologyDetails ? "rotate-90" : ""}`} />
              </button>
              
              {showMethodologyDetails && (
                <div className="mt-2.5 space-y-2 pl-1.5 text-[10.5px] text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-[#C6A475] animate-fade-in">
                  <p>
                    <strong>Remaining Tracked Variables:</strong> In addition to licensing, zoning changes, active leasing, and local retail density metrics, our model tracks:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><strong>Population shifts:</strong> Residential demographic moves and household incomes.</li>
                    <li><strong>Housing trends:</strong> Multi-family zoning permits and residential rental yields.</li>
                    <li><strong>Existing retail locations:</strong> Geospatial locations of competitors to evaluate cannibalization.</li>
                  </ul>
                  <p className="italic">
                    <strong>Model Intuition:</strong> By scraping online patterns, locating existing stores, and evaluating density variables, our LSTM model outputs the 5-year likelihood scores. Grounding-enabled AI then combines these with real-time web searches to generate customized investor guides.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div className="relative flex-shrink-0" id="leaderboard-search-box">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search hotspots by neighborhood or borough..."
              value={leaderboardSearch}
              onChange={(e) => setLeaderboardSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none transition-all ${
                darkMode
                  ? "bg-stone-900 border-[#2f2c25] text-stone-100 focus:border-[#C6A475]/50"
                  : "bg-stone-50 border border-stone-200 text-stone-800 focus:border-[#A98C70]/50 focus:bg-white"
              }`}
            />
          </div>

          {/* Mode Toggle between 20 Core Hubs and 100+ fine-grained sectors */}
          {allNtas && allNtas.length > 0 && (
            <div className={`p-0.5 rounded-xl border flex items-center justify-between text-[10px] font-mono font-bold uppercase select-none ${
              darkMode ? "bg-stone-950 border-[#2f2c25]" : "bg-stone-100 border-stone-200"
            }`} id="leaderboard-segmented-control">
              <button
                onClick={() => setLeaderboardMode("groups")}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  leaderboardMode === "groups"
                    ? (darkMode ? "bg-[#2d2c25] text-white" : "bg-white text-stone-900 shadow-sm")
                    : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
                id="btn-lead-groups"
              >
                20 Core Hubs
              </button>
              <button
                onClick={() => setLeaderboardMode("all")}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  leaderboardMode === "all"
                    ? (darkMode ? "bg-[#2d2c25] text-white" : "bg-white text-stone-900 shadow-sm")
                    : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
                id="btn-lead-all-sectors"
              >
                All {allNtas.length}+ Sectors
              </button>
            </div>
          )}

          {/* Leaderboard Scroll List */}
          <div className="space-y-2 flex-1" id="leaderboard-ranked-list">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider font-bold text-stone-400 dark:text-stone-500 uppercase px-1">
              <span>District Ranking</span>
              <span>2031 Expansion & Yield Likelihood</span>
            </div>
            
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredRankedItems.map((item, idx) => {
                const isTopThree = idx < 3 && !leaderboardSearch;
                const scoreNumeric = parseFloat(item.scorePct);
                const scoreColor = scoreNumeric > 75 
                  ? "text-rose-600 dark:text-rose-400 font-bold" 
                  : scoreNumeric > 50 
                    ? "text-amber-600 dark:text-amber-500 font-semibold" 
                    : "text-emerald-600 dark:text-emerald-500";

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectNeighborhoodById(item.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all duration-200 active:scale-[0.99] hover:shadow-sm ${
                      darkMode
                        ? "bg-stone-900/60 hover:bg-[#25241e] border-[#2f2c25] hover:border-[#C6A475]/40"
                        : "bg-stone-50 hover:bg-white border-stone-150 hover:border-[#A98C70]/50"
                    }`}
                    id={`leaderboard-item-${item.id}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Rank badge */}
                      <span className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center font-mono text-[11px] font-black shrink-0 ${
                        isTopThree
                          ? idx === 0
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                            : idx === 1
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                              : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                          : "bg-stone-200/50 dark:bg-stone-850 text-stone-500"
                      }`}>
                        {idx + 1}
                      </span>
                      
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold font-sans text-stone-800 dark:text-stone-200 flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{item.name}</span>
                          <span className={`text-[8.5px] font-semibold px-2 py-0 border rounded-full capitalize shrink-0 ${getBoroughColorClass(item.borough)}`}>
                            {item.borough}
                          </span>
                        </h4>
                        <p className="text-[10px] text-stone-450 dark:text-slate-400 line-clamp-1 mt-0.5 font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-0.5 justify-center pl-2 shrink-0">
                      <span className={`text-[12px] font-mono tracking-tight ${scoreColor}`}>
                        {item.scorePct}%
                      </span>
                      <span className="text-[7.5px] font-mono uppercase tracking-widest text-[#A98C70] dark:text-[#C6A475] font-bold">
                        Evolution Model
                      </span>
                    </div>
                  </button>
                );
              })}
              
              {filteredRankedItems.length === 0 && (
                <div className="text-center py-8 text-stone-400">
                  No districts matching that search.
                </div>
              )}
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-auto pt-4 border-t border-dashed border-stone-250 dark:border-stone-850 flex items-center justify-between text-[10px] font-mono text-stone-400" id="sidebar-footer">
            <span>© 2026 NYC Grid System</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 animate-pulse text-[#C6A475]" />
              LSTM 2031 Recurrence
            </span>
          </div>

        </div>
      ) : (
        /* CASE B: NEIGHBORHOOD DETAILED VIEW */
        <div className="flex-1 flex flex-col h-full overflow-hidden" id="neighborhood-details-wrapper">
          
          {/* Header Bar */}
          <div className={`p-4 border-b flex items-center justify-between ${
            darkMode ? "bg-nat-bg-dark/40 border-nat-border-dark" : "bg-nat-bg-light/40 border-nat-border-light"
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-widest ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
              District Profile
            </span>
            <div className="flex items-center gap-2">
              {/* Recenter Navigation Button */}
              <button
                onClick={() => onRecenter(selectedNeighborhood)}
                className={`p-1.5 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${
                  darkMode ? "bg-nat-bg-dark border-nat-border-dark text-nat-accent-dark hover:bg-[#2d2c25]" : "bg-nat-card-light border-nat-border-light text-nat-accent-light hover:bg-nat-bg-light"
                }`}
                title="Zoom/Recenter map here"
                id="recenter-district-btn"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${
                  darkMode ? "bg-nat-bg-dark border-nat-border-dark text-nat-muted-dark hover:text-nat-text-dark" : "bg-nat-card-light border-nat-border-light text-nat-muted-light hover:text-nat-text-light"
                }`}
                title="Dismiss and close panel"
                id="close-district-panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Neighborhood Name Title Card */}
          <div className="p-5 space-y-2 flex-shrink-0" id="district-title-card">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${getBoroughColorClass(selectedNeighborhood.borough)}`}>
                {selectedNeighborhood.borough}
              </span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase border ${
                darkMode ? "bg-nat-bg-dark border-nat-border-dark text-nat-muted-dark" : "bg-nat-bg-light border-nat-border-light text-nat-muted-light"
              }`}>
                Zone {String(selectedNeighborhood.id).toUpperCase().substring(0, 4)}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-sans text-rose-450 hover:text-blue-500 transition-colors">
              {selectedNeighborhood.name}
            </h2>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
              {selectedNeighborhood.description}
            </p>
          </div>

          {/* TAB DECK SELECTOR (About, Census, Landmarks, Parks, Forecast) */}
          <div className="px-3 flex-shrink-0" id="bento-tab-deck-selectors">
            <div className={`p-1 rounded-xl flex items-center justify-between border gap-0.5 ${
              darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-nat-bg-light border-nat-border-light"
            }`}>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 py-1 rounded-lg text-[10px] xs:text-[11px] font-semibold text-center transition-all duration-150 ${
                  activeTab === "about"
                    ? darkMode ? "bg-[#2d2c25] text-white shadow-sm font-bold" : "bg-white text-stone-900 shadow-sm font-bold"
                    : "text-slate-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
                id="tab-btn-about"
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("census")}
                className={`flex-1 py-1 rounded-lg text-[10px] xs:text-[11px] font-semibold text-center transition-all duration-150 ${
                  activeTab === "census"
                    ? darkMode ? "bg-[#2d2c25] text-white shadow-sm font-bold" : "bg-white text-stone-900 shadow-sm font-bold"
                    : "text-slate-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
                id="tab-btn-census"
              >
                Demographic
              </button>
              <button
                onClick={() => setActiveTab("landmarks")}
                className={`flex-1 py-1 rounded-lg text-[10px] xs:text-[11px] font-semibold text-center transition-all duration-150 ${
                  activeTab === "landmarks"
                    ? darkMode ? "bg-[#2d2c25] text-white shadow-sm font-bold" : "bg-white text-stone-900 shadow-sm font-bold"
                    : "text-slate-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
                id="tab-btn-landmarks"
              >
                Landmarks
              </button>
              <button
                onClick={() => setActiveTab("parks")}
                className={`flex-1 py-1 rounded-lg text-[10px] xs:text-[11px] font-semibold text-center transition-all duration-150 ${
                  activeTab === "parks"
                    ? darkMode ? "bg-[#2d2c25] text-white shadow-sm font-bold" : "bg-white text-stone-900 shadow-sm font-bold"
                    : "text-slate-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
                id="tab-btn-parks"
              >
                Parks
              </button>
              <button
                onClick={() => setActiveTab("forecast")}
                className={`flex-1 py-1 rounded-lg text-[10px] xs:text-[11px] font-semibold text-center transition-all duration-150 ${
                  activeTab === "forecast"
                    ? darkMode ? "bg-[#2d2c25] text-white shadow-sm font-bold" : "bg-white text-stone-900 shadow-sm font-bold"
                    : "text-slate-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
                id="tab-btn-forecast"
              >
                Forecast
              </button>
            </div>
          </div>

          {/* TAB CARD CONTENTS */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin" id="bento-tab-deck-contents-wrapper">
            
            {/* CENSUS / DEMOGRAPHICS TAB */}
            {activeTab === "census" && (
              <div className="space-y-4 animate-fade-in" id="tab-content-census">
                {(() => {
                  const census = getNeighborhoodCensusData(
                    selectedNeighborhood.name,
                    selectedNeighborhood.borough,
                    selectedNeighborhood.id
                  );
                  return (
                    <div className="space-y-4">
                      {/* Demographics Pill Statistics */}
                      <div className="grid grid-cols-2 gap-3" id="sidebar-census-stats-grid">
                        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                          darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-nat-bg-light border-nat-border-light"
                        }`}>
                          <span className="opacity-60 text-[10px] font-mono uppercase tracking-wider">Est. Population</span>
                          <span className="text-base font-bold font-sans mt-0.5 text-orange-400">
                            {census.totalPopulation.toLocaleString()}
                          </span>
                        </div>
                        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                          darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-nat-bg-light border-nat-border-light"
                        }`}>
                          <span className="opacity-60 text-[10px] font-mono uppercase tracking-wider">Median Age</span>
                          <span className="text-base font-bold font-sans mt-0.5 text-[#7A8B7B]">
                            {census.medianAge} yrs
                          </span>
                        </div>
                      </div>

                      {/* Race Breakdown */}
                      <div className="space-y-2.5">
                        <span className="font-semibold block uppercase text-[10.5px] tracking-wider text-[#C6A475] font-mono">Race & Ethnicity Share</span>
                        <div className="space-y-2 text-xs">
                          {/* White */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-0.5">
                              <span className="font-medium text-stone-600 dark:text-slate-300 text-[11px]">White</span>
                              <span className="font-bold">{census.race.white}%</span>
                            </div>
                            <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#CCA685] h-full rounded-full transition-all duration-500" style={{ width: `${census.race.white}%` }} />
                            </div>
                          </div>

                          {/* Black */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-0.5">
                              <span className="font-medium text-stone-600 dark:text-slate-300 text-[11px]">Black or African American</span>
                              <span className="font-bold">{census.race.black}%</span>
                            </div>
                            <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                              <div className="bg-orange-400 h-full rounded-full transition-all duration-500" style={{ width: `${census.race.black}%` }} />
                            </div>
                          </div>

                          {/* Hispanic */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-0.5">
                              <span className="font-medium text-stone-600 dark:text-slate-300 text-[11px]">Hispanic or Latino</span>
                              <span className="font-bold">{census.race.hispanic}%</span>
                            </div>
                            <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#C6A475] h-full rounded-full transition-all duration-500" style={{ width: `${census.race.hispanic}%` }} />
                            </div>
                          </div>

                          {/* Asian */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-0.5">
                              <span className="font-medium text-stone-600 dark:text-slate-300 text-[11px]">Asian</span>
                              <span className="font-bold">{census.race.asian}%</span>
                            </div>
                            <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#7A8B7B] h-full rounded-full transition-all duration-500" style={{ width: `${census.race.asian}%` }} />
                            </div>
                          </div>

                          {/* Other */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-0.5">
                              <span className="font-medium text-stone-600 dark:text-slate-300 text-[11px]">Other / Two or more</span>
                              <span className="font-bold">{census.race.other}%</span>
                            </div>
                            <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                              <div className="bg-stone-400 dark:bg-stone-500 h-full rounded-full transition-all duration-500" style={{ width: `${census.race.other}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Age Distribution Breakdown */}
                      <div className="space-y-2 pt-1">
                        <span className="font-semibold block uppercase text-[10.5px] tracking-wider text-[#C6A475] font-mono">Age Distribution Share</span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`p-2 rounded-xl border text-center ${darkMode ? 'bg-nat-bg-dark/40 border-nat-border-dark/60' : 'bg-nat-bg-light/60 border-nat-border-light'}`}>
                            <span className="opacity-70 block text-[10px]">Under 18</span>
                            <span className="text-xs font-bold text-[#7A8B7B] mt-0.5 block">{census.age.under18}%</span>
                          </div>
                          <div className={`p-2 rounded-xl border text-center ${darkMode ? 'bg-nat-bg-dark/40 border-nat-border-dark/60' : 'bg-nat-bg-light/60 border-nat-border-light'}`}>
                            <span className="opacity-70 block text-[10px]">18–34 yrs</span>
                            <span className="text-xs font-bold text-orange-400 mt-0.5 block">{census.age.age18to34}%</span>
                          </div>
                          <div className={`p-2 rounded-xl border text-center ${darkMode ? 'bg-nat-bg-dark/40 border-nat-border-dark/60' : 'bg-nat-bg-light/60 border-nat-border-light'}`}>
                            <span className="opacity-70 block text-[10px]">35–64 yrs</span>
                            <span className="text-xs font-bold text-[#C6A475] mt-0.5 block">{census.age.age35to64}%</span>
                          </div>
                          <div className={`p-2 rounded-xl border text-center ${darkMode ? 'bg-nat-bg-dark/40 border-nat-border-dark/60' : 'bg-nat-bg-light/60 border-nat-border-light'}`}>
                            <span className="opacity-70 block text-[10px]">65+ yrs</span>
                            <span className="text-xs font-bold text-stone-450 mt-0.5 block">{census.age.above65}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Historical Narrative */}
                      <div className={`p-3 rounded-xl border space-y-1.5 select-text ${
                        darkMode ? "bg-nat-bg-dark border-nat-border-dark text-nat-muted-dark" : "bg-nat-bg-light border-nat-border-light text-nat-muted-light"
                      }`}>
                        <strong className="font-semibold block uppercase text-[10px] tracking-wider font-mono text-[#C6A475]">Historical Profile & Evolution</strong>
                        <p className="text-[11px] leading-relaxed italic">
                          {census.history}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ABOUT / OVERVIEW TAB */}
            {activeTab === "about" && (
              <div className="space-y-4 animate-fade-in" id="tab-content-about">
                {/* Visual Aesthetics */}
                <div className="space-y-2">
                  <h4 className={`text-[10px] font-mono uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-stone-500"}`}>
                    Visual Aesthetics & Vibe
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNeighborhood.keyAesthetics.map((aes, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-medium border ${
                          darkMode 
                            ? "bg-nat-bg-dark/40 border-nat-border-dark/60 text-nat-text-dark" 
                            : "bg-nat-bg-light/60 border-nat-border-light text-nat-text-light"
                        }`}
                      >
                        ✨ {aes}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Characteristics Bento */}
                <div className="space-y-3 pt-2">
                  <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                    darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-nat-card-light border-nat-border-light shadow-sm"
                  }`}>
                    {/* Character */}
                    <div className="space-y-0.5">
                      <span className={`text-[9px] font-mono uppercase tracking-wider block ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
                        Character Profile
                      </span>
                      <p className="text-xs font-medium leading-relaxed">
                        {selectedNeighborhood.keyStats.character}
                      </p>
                    </div>
                    {/* Vibe */}
                    <div className="space-y-0.5">
                      <span className={`text-[9px] font-mono uppercase tracking-wider block ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
                        The Street Vibe
                      </span>
                      <p className="text-xs font-medium leading-relaxed text-nat-accent-light dark:text-nat-accent-dark">
                        {selectedNeighborhood.keyStats.vibe}
                      </p>
                    </div>
                    {/* Ancient Notes */}
                    <div className="space-y-0.5 pt-1 border-t border-dashed border-nat-border-light dark:border-nat-border-dark">
                      <span className={`text-[9px] font-mono uppercase tracking-wider block ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
                        Historical Roots
                      </span>
                      <p className={`text-[11px] leading-relaxed italic ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
                        {selectedNeighborhood.keyStats.historicNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LANDMARKS TAB */}
            {activeTab === "landmarks" && (
              <div className="space-y-3 animate-fade-in" id="tab-content-landmarks">
                {selectedNeighborhood.landmarks.length === 0 ? (
                  <p className="text-xs font-medium text-slate-400 p-2 text-center">No landmarks mapped in this precise grid cell yet.</p>
                ) : (
                  selectedNeighborhood.landmarks.map((landmark) => (
                    <div 
                      key={landmark.id} 
                      className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                        darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-nat-card-light border-nat-border-light shadow-sm"
                      }`}
                      id={`landmark-card-${landmark.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-nat-accent-light dark:text-nat-accent-dark" />
                          <h4 className="text-xs font-bold font-sans">{landmark.name}</h4>
                        </div>
                        {landmark.yearBuilt && (
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md ${
                            darkMode ? "bg-nat-bg-dark border-nat-border-dark text-nat-muted-dark" : "bg-nat-bg-light border-nat-border-light text-nat-muted-light"
                          }`}> Est. {landmark.yearBuilt}</span>
                        )}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
                        {landmark.description}
                      </p>
                      
                      {/* Fun Fact Capsule */}
                      <div className={`p-2.5 rounded-lg border text-[10px] leading-relaxed flex items-start gap-1.5 ${
                        darkMode ? "bg-[#4a3f35]/20 border-[#BF8B6E]/20 text-[#CCA685]" : "bg-[#F7ECE4] border-[#EAD5C8] text-[#8C5333]"
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-[#BF8B6E] flex-shrink-0 mt-0.5" />
                        <p className="m-0">
                          <strong className="font-semibold">Fun Fact:</strong> {landmark.funFact}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* PARKS TAB */}
            {activeTab === "parks" && (
              <div className="space-y-3 animate-fade-in" id="tab-content-parks">
                {selectedNeighborhood.greenSpaces.length === 0 ? (
                  <p className="text-xs font-medium text-slate-400 p-2 text-center">No specific nature reserves mapped in this segment yet.</p>
                ) : (
                  selectedNeighborhood.greenSpaces.map((park, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                        darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-nat-card-light border-nat-border-light shadow-sm"
                      }`}
                      id={`park-card-${idx}`}
                    >
                      <div className="flex items-center gap-2">
                        <Trees className="w-4 h-4 text-[#7A8B7B]" />
                        <h4 className="text-xs font-bold font-sans text-nat-accent-light dark:text-nat-accent-dark">{park.name}</h4>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
                        {park.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* FORECAST TAB: LSTM + GEMINI REAL-TIME DUAL FORECASTER */}
            {activeTab === "forecast" && (() => {
              const forecast = forecasts[selectedNeighborhood.id] || runRenewalLSTMForecast(selectedNeighborhood.id, selectedNeighborhood.borough, selectedNeighborhood.name);
              const scorePct = ((forecast?.score2031 ?? 0.0) * 100).toFixed(1);
              const recentHistory = forecast?.history || [];
              const latestStats = recentHistory[recentHistory.length - 1] || {};
              const earliestStats = recentHistory[0] || {};

              return (
                <div className="space-y-4 animate-fade-in text-xs select-text" id="tab-content-forecast">
                  
                  {/* Score Hero Card */}
                  <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 relative overflow-hidden ${
                    darkMode ? "bg-nat-bg-dark border-nat-border-dark" : "bg-stone-50 border-nat-border-light shadow-sm"
                  }`}>
                    {/* Background visual highlight */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/5 rounded-full blur-xl pointer-events-none" />

                    <div className="flex items-center gap-1.5 justify-center">
                      <Brain className="w-5 h-5 text-[#cb181d]" />
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-500">
                        LSTM 2031 Expansion Forecasting
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold tracking-tight font-sans text-rose-700 dark:text-rose-500">
                        {scorePct}%
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-450 text-center">
                      Franchise Footprint & Multi-Family Real Estate Yield Potential
                    </span>

                    <p className="text-[11px] leading-relaxed opacity-75 max-w-sm mt-1">
                      Trained recursively on local foot traffic, adaptive reuse, and permits to model the high-probability path for brand-name retailers and upscale apartments.
                    </p>
                  </div>

                  {/* Corporate Site Selection Logic & Real Estate Yield Education Block */}
                  <div className={`p-4 rounded-xl border space-y-3 ${
                    darkMode ? "bg-[#1c1b17] border-[#2f2c25]" : "bg-orange-50/45 border-orange-100 shadow-sm"
                  }`} id="retail-site-selection-guide">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold font-sans text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>How Retail Brands & Real Estate Investors Code This Data</span>
                    </div>
                    
                    <p className="text-[11.5px] leading-relaxed text-stone-605 dark:text-stone-305">
                      Elite consumer retail corporations (like <strong>Starbucks</strong> or <strong>Dunkin'</strong>) use location intelligence systems (like Esri and proprietary geospatial analytics) to scout upcoming expansion opportunities. Here are the core factors they weigh when launching new physical stores, matched directly with our 2031 index:
                    </p>

                    <div className="space-y-2.5 pt-1.5">
                      <div className="flex gap-2">
                        <span className="text-xs">📍</span>
                        <div className="space-y-0.5">
                          <h6 className="font-bold text-stone-800 dark:text-stone-200 text-[11px]">Geospatial Analytics & Traffic Flow</h6>
                          <p className="text-[10.5px] leading-relaxed text-stone-550 dark:text-stone-400">
                            Brands target high-density, signalized street corners capture outbound commuter loops (the morning rush side of the road). The LSTM's <strong>Pedestrian Foot Traffic Index</strong> signals these premium capture potentials.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="text-xs">📈</span>
                        <div className="space-y-0.5">
                          <h6 className="font-bold text-stone-800 dark:text-stone-200 text-[11px]">Target Demographics & Household Wealth</h6>
                          <p className="text-[10.5px] leading-relaxed text-stone-550 dark:text-stone-400">
                            Brand site suitability checkers look for strong workforce density and rising median incomes to support luxury pricing models, mapped dynamically here via <strong>Household Income Ratio</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="text-xs">🏢</span>
                        <div className="space-y-0.5">
                          <h6 className="font-bold text-stone-800 dark:text-stone-200 text-[11px]">Multifamily Real Estate & Investor Yields</h6>
                          <p className="text-[10.5px] leading-relaxed text-stone-550 dark:text-stone-400">
                            When national chains move in, they act as an institutional stamp of validation. Real estate investors track these corporate patterns as a reliable leading indicator indicating it is time to acquire multi-family rental assets or condominium buildings near these high-momentum transit nodes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2022-2026 Shift Indicators */}
                  <div className="space-y-2.5">
                    <span className="font-semibold block uppercase text-[10.5px] tracking-wider text-[#C6A475] font-mono">
                      recurrent business & investment indicators (2022 ➔ 2026)
                    </span>

                    <div className="space-y-3">
                      {/* Property Values */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-stone-705 dark:text-slate-300">Residential Apartment Value (Rent & Purchase Yields)</span>
                          <span className="font-mono text-stone-500">
                            {earliestStats?.propertyValueIndex?.toFixed(1)} ➔ <strong className="text-stone-850 dark:text-white">{latestStats?.propertyValueIndex?.toFixed(1)}</strong>
                          </span>
                        </div>
                        <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full flex overflow-hidden">
                          <div className="bg-rose-300 h-full rounded-full" style={{ width: `${(earliestStats?.propertyValueIndex || 3) * 10}%` }} />
                          <div className="bg-rose-500 h-full" style={{ width: `${Math.max(0, ((latestStats?.propertyValueIndex || 5) - (earliestStats?.propertyValueIndex || 3)) * 10)}%` }} />
                        </div>
                      </div>

                      {/* Foot Traffic patterns */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-stone-705 dark:text-slate-300">Pedestrian Foot Traffic (Franchise Demographics)</span>
                          <span className="font-mono text-stone-500">
                            {earliestStats?.footTrafficIndex?.toFixed(1)} ➔ <strong className="text-stone-850 dark:text-white">{latestStats?.footTrafficIndex?.toFixed(1)}</strong>
                          </span>
                        </div>
                        <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full flex overflow-hidden">
                          <div className="bg-rose-300 h-full rounded-full" style={{ width: `${(earliestStats?.footTrafficIndex || 3) * 10}%` }} />
                          <div className="bg-rose-500 h-full" style={{ width: `${Math.max(0, ((latestStats?.footTrafficIndex || 5) - (earliestStats?.footTrafficIndex || 3)) * 10)}%` }} />
                        </div>
                      </div>

                      {/* Redevelopment permits progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-stone-705 dark:text-slate-300">New Construction & Multi-Family Housing Permits</span>
                          <span className="font-mono text-stone-500">
                            {earliestStats?.permitsRate?.toFixed(1)} ➔ <strong className="text-stone-850 dark:text-white">{latestStats?.permitsRate?.toFixed(1)}</strong>
                          </span>
                        </div>
                        <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full flex overflow-hidden">
                          <div className="bg-rose-300 h-full rounded-full" style={{ width: `${(earliestStats?.permitsRate || 3) * 10}%` }} />
                          <div className="bg-rose-500 h-full" style={{ width: `${Math.max(0, ((latestStats?.permitsRate || 5) - (earliestStats?.permitsRate || 3)) * 10)}%` }} />
                        </div>
                      </div>

                      {/* Creative conversion spaces */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-stone-705 dark:text-slate-300">Commercial Adaptive Retail Space Availability</span>
                          <span className="font-mono text-stone-500">
                            {earliestStats?.industrialConversion?.toFixed(1)} ➔ <strong className="text-stone-850 dark:text-white">{latestStats?.industrialConversion?.toFixed(1)}</strong>
                          </span>
                        </div>
                        <div className="w-full bg-stone-150 dark:bg-stone-850 h-2 rounded-full flex overflow-hidden">
                          <div className="bg-rose-300 h-full rounded-full" style={{ width: `${(earliestStats?.industrialConversion || 1) * 10}%` }} />
                          <div className="bg-rose-500 h-full" style={{ width: `${Math.max(0, ((latestStats?.industrialConversion || 3) - (earliestStats?.industrialConversion || 1)) * 10)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Technical Details of LSTM hidden gates */}
                  <div className={`p-2.5 rounded-xl border ${
                    darkMode ? "bg-nat-bg-dark/50 border-nat-border-dark" : "bg-stone-50/50 border-nat-border-light"
                  }`}>
                    <button
                      onClick={() => setShowTechnicalLstmDetails(!showTechnicalLstmDetails)}
                      className="w-full flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider text-[#A98C70] dark:text-[#C6A475] font-bold"
                      type="button"
                    >
                      <span className="flex items-center gap-1.5 justify-start">
                        <Cpu className="w-3.5 h-3.5" />
                        {showTechnicalLstmDetails ? "Hide LSTM Cells" : "Inspect LSTM Neural vectors"}
                      </span>
                      <span>{showTechnicalLstmDetails ? "▲" : "▼"}</span>
                    </button>

                    {showTechnicalLstmDetails && (
                      <div className="mt-2.5 space-y-2 border-t border-dashed border-stone-200 dark:border-stone-850 pt-2 font-mono text-[10px] leading-relaxed transition-all">
                        <div className="flex justify-between">
                          <span>Final Hidden State (h_t):</span>
                          <span className="font-bold text-amber-600">
                            {forecast?.lstmModelDetails?.lastHiddenState?.toFixed(6)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Cell State (C_t):</span>
                          <span className="font-bold text-amber-600">
                            {forecast?.lstmModelDetails?.lastCellState?.toFixed(6)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-2 bg-stone-150/40 dark:bg-stone-900/60 p-2 rounded-lg">
                          <div>
                            <span className="block text-[8.5px] opacity-60">FORGET GATE (f_t)</span>
                            <span className="text-rose-500 font-bold">{forecast?.lstmModelDetails?.activeGates?.forget?.toFixed(4)}</span>
                          </div>
                          <div>
                            <span className="block text-[8.5px] opacity-60">INPUT GATE (i_t)</span>
                            <span className="text-emerald-500 font-bold">{forecast?.lstmModelDetails?.activeGates?.input?.toFixed(4)}</span>
                          </div>
                          <div>
                            <span className="block text-[8.5px] opacity-60">CANDIDATE CELL (C_tilde)</span>
                            <span className="text-blue-500 font-bold">{forecast?.lstmModelDetails?.activeGates?.candidate?.toFixed(4)}</span>
                          </div>
                          <div>
                            <span className="block text-[8.5px] opacity-60">OUTPUT GATE (o_t)</span>
                            <span className="text-purple-500 font-bold">{forecast?.lstmModelDetails?.activeGates?.output?.toFixed(4)}</span>
                          </div>
                        </div>
                        <p className="text-[8.5px] opacity-60 m-0 leading-normal italic text-center">
                          *BPTT weights computed recursively to minimize variance against NYC census trajectories.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dual-Model Gemini AI Report Section */}
                  <div className="pt-2">
                    <span className="font-semibold block uppercase text-[10.5px] tracking-wider text-[#C6A475] font-mono mb-2">
                      Dual-Model AI Prediction synthesis
                    </span>

                    {!aiAnalysisReport && !isAnalyzingAi ? (
                      <div className={`p-4 rounded-xl border text-center space-y-3 ${
                        darkMode ? "bg-nat-bg-dark/40 border-nat-border-dark" : "bg-stone-50 border-nat-border-light shadow-sm"
                      }`}>
                        <p className="text-[11px] opacity-75">
                          Synthesize recent 2022-2026 indicators with real-time web-searched development reports using Gemini models.
                        </p>
                        <button
                          onClick={() => onTriggerAiAnalysis(selectedNeighborhood.id, selectedNeighborhood.name, selectedNeighborhood.borough)}
                          className="py-2 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 mx-auto active:scale-95"
                          id="trigger-ai-analysis-btn"
                          type="button"
                        >
                          <Brain className="w-4 h-4 animate-pulse" />
                          <span>Generate 5-Year Planning Synthesis</span>
                        </button>
                      </div>
                    ) : isAnalyzingAi ? (
                      <div className={`p-5 rounded-xl border flex flex-col items-center justify-center gap-3 text-center ${
                        darkMode ? "bg-nat-bg-dark/40 border-nat-border-dark" : "bg-stone-50 border-nat-border-light shadow-sm"
                      }`}>
                        <div className="flex items-center gap-1 justify-center">
                          <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
                          <span className="w-2 h-2 rounded-full bg-orange-550 animate-bounce delay-100"></span>
                          <span className="w-2 h-2 rounded-full bg-orange-700 animate-bounce delay-200"></span>
                        </div>
                        <p className="text-xs font-mono opacity-80 leading-relaxed max-w-xs uppercase tracking-wider text-orange-500 font-bold">
                          1️⃣ Grounding with <strong className="text-amber-600">gemini-3.5-flash</strong> Google Search news...<br/>
                          2️⃣ Thinking with <strong className="text-amber-600 font-sans">3.1-pro-preview</strong> inside hidden states...
                        </p>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-xl border space-y-3 relative ${
                        darkMode ? "bg-nat-bg-dark/20 border-nat-border-dark" : "bg-stone-50 border-nat-border-light shadow-sm"
                      }`}>
                        {/* Header action panel */}
                        <div className="flex justify-between items-center border-b border-dashed border-stone-200 dark:border-stone-850 pb-2">
                          <span className="flex items-center gap-1.5 font-bold font-mono text-[10px] text-orange-500 uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            MARKET ANALYSIS: COMPLETE
                          </span>
                          <button
                            onClick={() => onTriggerAiAnalysis(selectedNeighborhood.id, selectedNeighborhood.name, selectedNeighborhood.borough)}
                            className="text-[9px] font-mono text-stone-505 dark:text-stone-405 hover:text-orange-500 flex items-center gap-1 uppercase font-bold"
                            title="Refetch report"
                            type="button"
                          >
                            <RefreshCw className="w-3 h-3 text-stone-400" />
                            Regenerate
                          </button>
                        </div>
                        
                        {/* Report Markdown Rendering */}
                        <div className="text-[11px] leading-relaxed space-y-2 text-stone-700 dark:text-stone-300 max-h-[220px] overflow-y-auto pr-1 select-text scrollbar-thin">
                          {aiAnalysisReport.split('\n').map((line, lIdx) => {
                            const trimmed = line.trim();
                            if (trimmed.startsWith('#')) {
                              const level = (trimmed.match(/#/g) || []).length;
                              const cleanText = trimmed.replace(/#/g, '').trim();
                              return (
                                <h5 key={lIdx} className={`font-bold tracking-tight text-orange-500 font-sans mt-3 mb-1.5 ${
                                  level === 1 ? 'text-sm' : 'text-xs'
                                }`}>
                                  {cleanText}
                                </h5>
                              );
                            }
                            if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                              return (
                                <li key={lIdx} className="list-disc ml-4 font-sans text-stone-605 dark:text-stone-305 mt-1">
                                  {trimmed.slice(1).trim()}
                                </li>
                              );
                            }
                            if (trimmed.match(/^\d+\./)) {
                              return (
                                <div key={lIdx} className="pl-2 font-sans text-stone-605 dark:text-stone-305 mt-1">
                                  {trimmed}
                                </div>
                              );
                            }
                            return (
                              <p key={lIdx} className="font-sans text-stone-600 dark:text-stone-405 mt-1 leading-normal">
                                {trimmed}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

          </div>

          {/* Quick Stats Panel Footer */}
          <div className={`p-4 border-t text-[10px] text-center font-mono flex items-center justify-between ${
            darkMode ? "bg-nat-bg-dark/40 border-nat-border-dark text-nat-muted-dark" : "bg-nat-bg-light text-nat-muted-light border-nat-border-light"
          }`} id="neighborhood-card-footer">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C6A475]" />
              EST. REGION: OLD NY
            </span>
            <span className="text-slate-550">
              NYC DATA SOURCE MAPS
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
