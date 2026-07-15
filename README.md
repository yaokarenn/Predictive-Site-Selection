
# NYC Interactive Map & AI Predictive Engine

An interactive, elegant, and minimal map of New York City's neighborhoods and landmarks. Beyond a simple map, this project serves as a powerful real estate and franchise predictive engine powered by an Express backend, simulated LSTM modeling, and Google's cutting-edge Gemini AI models.

## Background & Motivation

This project is a direct evolution of my previous repository, the NYC Housing Crisis project. Utilizing AI-driven rapid prototyping, I wanted to pivot the focus from a purely socio-economic lens to a strategic commercial perspective. By building upon the original mapping infrastructure, this application now evaluates neighborhood viability specifically for corporate franchise expansion and multi-family real estate investments.

## Features

* **Interactive Cartography:** A fully responsive Leaflet-powered map featuring search navigation, filterable views, and a dedicated dark mode
* **LSTM Renewal Forecasting:** Simulates neural network predictions for neighborhood trends across all NYC boroughs based on metrics like pedestrian density, housing permits, and commercial leases
* **Dual-Model Gemini AI Analysis:**
    * **Google Search Grounding:** Uses `gemini-3.5-flash` connected to Google Search to pull real-time, recent (2022+) news, foot traffic, and development trends
    * **Advanced High-Thinking Synthesis:** Feeds grounded data and LSTM metrics into `gemini-3.1-pro-preview` using High Thinking Mode to generate highly detailed, 5-year (2031) predictive reports for real estate investors and franchise planners

## Data & Predictive Metrics

To generate accurate 5-year forecasts for commercial and residential viability, the LSTM network and AI synthesis engine rely on four core data pillars. These metrics were selected for their direct impact on real estate yields and corporate site-selection strategies:

* **Residential Apartment Value Trends:** Tracks pricing shifts and historical valuations. This is critical for real estate investors attempting to identify undervalued markets for prime rental acquisitions
* **Pedestrian Foot Traffic Density:** Measures local pedestrian flow and density patterns. This serves as the primary metric major retail brands (like Starbucks or Dunkin') use to determine the profitability of a new lease
* **New Construction & Housing Permits:** Indicates the physical redevelopment momentum of a neighborhood, highlighting where multi-family zoning and gentrification are actively expanding
* **Commercial Adaptive Retail Spacing:** Measures existing space suitability and industrial conversions, showing whether a neighborhood can physically accommodate modern, high-end commercial franchise layouts

## Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Leaflet, Lucide React
* **Backend:** Node.js, Express, TypeScript
* **AI Integration:** `@google/genai` (Gemini 3.5 Flash & Gemini 3.1 Pro Preview)

## Key API Endpoints (Backend)

* `GET /api/renewal-forecast` - Fetches the baseline LSTM forecasts for major NYC neighborhoods
* `GET /api/renewal-forecast/:id` - Fetches specific forecast data for a targeted neighborhood
* `POST /api/ai-analysis` - Triggers the dual-model Gemini engine, expecting `id`, `name`, `borough`, and `currentMetrics` in the request body to generate a grounded 2031 predictive urban planning report
