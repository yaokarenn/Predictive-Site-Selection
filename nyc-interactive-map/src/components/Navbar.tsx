import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Moon, 
  Sun, 
  Map, 
  Layers, 
  Building, 
  MapPin, 
  Navigation, 
  ChevronDown 
} from "lucide-react";
import { MapViewFilter, Neighborhood } from "../types";
import { NYC_NEIGHBORHOODS } from "../data/nycData";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeFilter: MapViewFilter;
  onChangeFilter: (filter: MapViewFilter) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onSelectNeighborhood: (neighborhood: Neighborhood) => void;
  allNtas?: any[];
}

export default function Navbar({
  darkMode,
  onToggleDarkMode,
  activeFilter,
  onChangeFilter,
  searchQuery,
  onChangeSearchQuery,
  onSelectNeighborhood,
  allNtas,
}: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filterOptions: { val: MapViewFilter; label: string; desc: string }[] = [
    { val: "all", label: "🗺️ Explore All Layers", desc: "Show landmarks, parks, and cultural spots" },
    { val: "landmarks", label: "🏛️ Iconic Landmarks", desc: "Highlight monuments, skyscrapers, and bridges" },
    { val: "parks", label: "🌳 Parks & Nature", desc: "Highlight botanical gardens, paths, and coastal lawns" },
    { val: "culture", label: "🎭 Art & Culture", desc: "Show museums, historical theaters, and music sites" }
  ];

  // Dynamic filter label
  const currentFilterOption = filterOptions.find(o => o.val === activeFilter) || filterOptions[0];

  // Filtered list of search suggestions
  const suggestions = searchQuery.trim() === "" 
    ? [] 
    : allNtas && allNtas.length > 0
      ? allNtas.filter(n => 
          n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          n.borough.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(n.id).toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6).map(n => ({
          id: n.id,
          name: n.name,
          borough: n.borough,
          centroid: n.centroid,
          polygonPoints: [] as [number, number][],
          description: "",
          keyAesthetics: [] as string[],
          keyStats: { vibe: "", character: "", historicNotes: "" },
          landmarks: [],
          diningSpots: [],
          greenSpaces: []
        }))
      : NYC_NEIGHBORHOODS.filter(n => 
          n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          n.borough.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

  // Close suggestions or dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={`w-full py-4 px-4 md:px-6 border-b transition-all duration-300 ${
      darkMode 
        ? "bg-nat-card-dark border-nat-border-dark text-nat-text-dark" 
        : "bg-nat-card-light border-nat-border-light text-nat-text-light"
    }`} id="nyc-applet-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* APP BRAND / LOGO TITLE */}
        <div className="flex items-center gap-2.5" id="brand-container-nav">
          <div className={`p-2 rounded-xl flex items-center justify-center ${
            darkMode ? "bg-nat-accent-dark/20 text-nat-accent-dark" : "bg-nat-accent-light/10 text-nat-accent-light"
          }`}>
            <Map className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold font-sans tracking-tight flex items-center gap-1.5 leading-none">
              NYC Interactive Map
            </h1>
            <span className={`text-[10px] font-mono tracking-widest ${darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"}`}>
              METROPOLITAN CARTOGRAPHY v1.0
            </span>
          </div>
        </div>

        {/* MIDDLE ACTIONS: SEARCH BAR & DROPDOWN FILTER & TOGGLES */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow max-w-2xl justify-end">
          
          {/* SEARCH COMPONENT WITH AUTOCONNECT AUTOSUGGEST */}
          <div ref={searchContainerRef} className="relative flex-grow sm:max-w-xs" id="nav-search-wrapper">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-nat-muted-dark" : "text-nat-muted-light"
              }`} />
              <input
                type="text"
                placeholder="Search neighborhood (e.g. DUMBO, Harlem)..."
                value={searchQuery}
                onFocus={() => setShowSearchSuggestions(true)}
                onChange={(e) => {
                  onChangeSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 transition-all duration-200 ${
                  darkMode 
                    ? "bg-nat-bg-dark border-nat-border-dark text-nat-text-dark placeholder-nat-muted-dark/50 focus:border-nat-accent-dark focus:ring-nat-accent-dark/20" 
                    : "bg-nat-bg-light border-nat-border-light text-nat-text-light placeholder-nat-muted-light/50 focus:border-nat-accent-light focus:ring-nat-accent-light/20"
                }`}
                id="search-input-field"
              />
            </div>

            {/* Suggestions Box */}
            {showSearchSuggestions && suggestions.length > 0 && (
              <div className={`absolute left-0 right-0 mt-1.5 overflow-hidden rounded-xl border shadow-xl z-50 ${
                darkMode 
                  ? "bg-nat-card-dark border-nat-border-dark divide-nat-border-dark text-nat-text-dark" 
                  : "bg-nat-card-light border-nat-border-light divide-nat-border-light text-nat-text-light"
              }`}>
                <div className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider ${
                  darkMode ? "bg-nat-bg-dark text-nat-muted-dark" : "bg-nat-bg-light text-nat-muted-light"
                }`}>
                  Neighborhoods Found
                </div>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    id={`suggestion-btn-${suggestion.id}`}
                    onClick={() => {
                      onSelectNeighborhood(suggestion);
                      onChangeSearchQuery(suggestion.name);
                      setShowSearchSuggestions(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors duration-150 ${
                      darkMode ? "hover:bg-[#2d2c25]" : "hover:bg-nat-bg-light"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-nat-accent-light dark:text-nat-accent-dark flex-shrink-0" id={`pin-icon-${suggestion.id}`} />
                      <span className="font-semibold">{suggestion.name}</span>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      darkMode ? "bg-nat-bg-dark text-nat-accent-dark" : "bg-nat-bg-light text-nat-accent-light"
                    }`}>
                      {suggestion.borough}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VIEW FILTER DROPDOWN */}
          <div ref={filterDropdownRef} className="relative cursor-pointer" id="view-filter-dropdown-wrapper">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border transition-all duration-200 ${
                darkMode 
                  ? "bg-nat-card-dark border-nat-border-dark text-nat-text-dark hover:bg-[#2d2c25]" 
                  : "bg-nat-card-light border-nat-border-light text-nat-text-light hover:bg-[#f3f1eb]"
              }`}
              id="filter-dropdown-toggle"
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-nat-accent-light dark:text-nat-accent-dark" />
                <span>{currentFilterOption.label}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-nat-accent-light dark:text-nat-accent-dark" />
            </button>

            {/* Dropdown Options */}
            {showDropdown && (
              <div className={`absolute right-0 left-0 sm:left-auto sm:w-64 mt-1.5 rounded-xl border shadow-2xl z-50 overflow-hidden divide-y ${
                darkMode 
                  ? "bg-nat-card-dark border-nat-border-dark divide-nat-border-dark" 
                  : "bg-nat-card-light border-nat-border-light divide-nat-border-light"
              }`}>
                {filterOptions.map((option) => (
                  <button
                    key={option.val}
                    id={`filter-opt-${option.val}`}
                    onClick={() => {
                      onChangeFilter(option.val);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors duration-150 flex flex-col gap-0.5 ${
                      activeFilter === option.val 
                        ? darkMode ? "bg-[#2d302a] text-[#ECE9E2]" : "bg-[#f2f4f0] text-[#334230]"
                        : darkMode ? "hover:bg-[#2d2c25] text-nat-muted-dark" : "hover:bg-nat-bg-light text-nat-muted-light"
                    }`}
                  >
                    <span className="text-xs font-semibold">{option.label}</span>
                    <span className="text-[10px] opacity-80 leading-snug">{option.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LIGHT / DARK MODE TOGGLE */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-200 active:scale-95 ${
              darkMode 
                ? "bg-nat-card-dark border-nat-border-dark text-[#C6A475] hover:bg-[#2d2c25]" 
                : "bg-nat-card-light border-nat-border-light text-[#A98C70] hover:bg-[#f3f1eb]"
            }`}
            title={darkMode ? "Switch to Architectural Light view" : "Switch to Night blueprint view"}
            id="theme-toggler-btn"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </div>
    </header>
  );
}
