
# NYC Interactive Map & AI Predictive Engine

An interactive, elegant, and minimal map of New York City's neighborhoods and landmarks. Beyond a simple map, this project serves as a powerful real estate and franchise predictive engine powered by an Express backend, simulated LSTM modeling, and Google's cutting-edge Gemini AI models.

## The Business Problem & Motivation

Retail expansion is expensive, and poor location choices consistently lead to major financial losses. To succeed, businesses need predictive insights that reveal future opportunities before companies move in, rather than just relying on current market conditions. 

This project is a direct evolution of my previous gentrification model, which predicted housing prices and identified high and low gentrification risks across NYC neighborhoods. Utilizing AI-driven rapid prototyping, I pivoted from predicting housing growth alone to predicting where businesses may choose to expand next. The core research question driving this engine is: **"How will NYC neighborhoods change within the next 5 years, and how will those changes influence retail locations?"**.

## Featured Case Study: Starbucks Expansion Strategy

To demonstrate the business application of this predictive model, we analyzed a real-world scenario: *Where would a Starbucks open next?*. If we can accurately predict where a massive brand like Starbucks wants to expand, investors can buy property earlier and businesses can significantly reduce their risk of loss.

Based on the predictive model, here is the growth outlook:

### High Growth Predictions:
* **Long Island City:** This area is continuously constructing new apartment buildings. It successfully attracts both residents and office workers, a demographic that probably needs coffee to start their day.
* **Downtown Brooklyn:** This neighborhood benefits from nearby colleges, office buildings, newly constructed residential buildings, and major transit availability. This infrastructure leads to an increase in foot traffic, which is a major indicator of positive business performance.

### Lower Growth Predictions:
* **Financial District**
* **Battery Park City**

### Why Not Establish in High-Traffic Hubs like SoHo or Midtown?
While neighborhoods like SoHo and Midtown have massive foot traffic, the model deprioritizes them for new franchise expansion for two reasons:
1.  There are already many Starbucks locations around that area, which creates competition with the brand itself.
2.  Retail corridors in areas like SoHo demand some of the highest rents in the country, minimizing profit margins.

## Data Collection & Predictive Metrics

To generate these 5-year forecasts, the LSTM network and AI synthesis engine rely on a robust collection of open-source information. 

**Datasets Used:**
* NYC Open Data
* US Census Data
* Kaggle Datasets
* GitHub Open-Source Repositories

**Variables Tracked:**
* Business licenses
* Commercial zoning changes
* Retail density and foot traffic
* Commercial leases
* Population shifts
* Housing trends
* Existing retail store locations

## Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Leaflet, Lucide React
* **Backend:** Node.js, Express, TypeScript
* **AI Integration:** `@google/genai` (Gemini 3.5 Flash & Gemini 3.1 Pro Preview)

## Key API Endpoints (Backend)

* `GET /api/renewal-forecast` - Fetches the baseline LSTM forecasts for major NYC neighborhoods
* `GET /api/renewal-forecast/:id` - Fetches specific forecast data for a targeted neighborhood
* `POST /api/ai-analysis` - Triggers the dual-model Gemini engine, expecting `id`, `name`, `borough`, and `currentMetrics` in the request body to generate a grounded 2031 predictive urban planning report

## Limitations

While this model provides deep strategic insights, there are current limitations to the data:
* Many public datasets were incomplete, especially for Staten Island.
* Most of the datasets utilized were from 2018-2022.
* There are a lot of current economic events shifting the market right now, which can thus shift the predictions. For example, mass deportation could cause an increase in construction and production costs, leading to a decrease in new buildings.
