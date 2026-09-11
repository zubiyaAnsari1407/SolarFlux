# SolarFlux — Development Progress

## AI-Powered Smart Solar Monitoring, Prediction and Optimization System

This document records the development progress of SolarFlux, the major implementation phases, completed modules, current work and upcoming tasks.

---

## Project Development Strategy

SolarFlux was developed incrementally so that major software and hardware modules could be tested independently before full integration.

```text
UI / Dashboard
      ↓
FastAPI Backend
      ↓
MongoDB
      ↓
Weather Intelligence
      ↓
Machine Learning
      ↓
Explainable AI
      ↓
Future Prediction
      ↓
ESP32 Hardware Prototype
      ↓
Live Hardware Integration
```

---

# Phase 1 — Landing Page

## Status: Completed

Completed work:

- Hero section
- Features section
- How SolarFlux Works
- Architecture
- About section
- Insights
- Call to Action
- Footer
- Responsive design
- Smooth scrolling and animations

Design goals:

- Professional SaaS-style interface
- Solar / atmospheric visual identity
- Consistent color palette
- Responsive layout
- Lucide icons
- Clean presentation

---

# Phase 2 — Dashboard UI

## Status: Completed

Completed modules:

- Dashboard Navbar
- Dashboard Header
- Location Search
- KPI Cards
- Energy Production Chart
- Weather Intelligence Card
- Energy Flow
- Battery Status
- System Health
- Alerts & Insights
- Environmental Impact
- Smart Recommendation
- Theme Preview / Theme Switcher

Dynamic themes:

- Morning
- Afternoon
- Evening
- Night

---

# Phase 3 — FastAPI and MongoDB Integration

## Status: Completed

Backend technologies:

- Python
- FastAPI
- Uvicorn
- PyMongo
- MongoDB
- python-dotenv

Initial endpoints:

```text
GET /api/health
GET /api/dashboard/summary
GET /api/alerts
GET /api/impact/today
GET /api/recommendations
GET /api/energy/history
```

MongoDB collections:

```text
dashboard
weather
alerts
impact
recommendations
energy_history
```

Frontend-backend flow:

```text
React Dashboard
      ↓
dashboardApi.js
      ↓
FastAPI
      ↓
MongoDB
      ↓
JSON Response
      ↓
Dashboard Components
```

---

# Phase 4 — Weather + AI/ML Intelligence

## Status: Completed

### Weather Intelligence

APIs:

- Open-Meteo
- Geoapify

Flow:

```text
User Location
     ↓
Geoapify
     ↓
Latitude / Longitude
     ↓
Open-Meteo
     ↓
Weather Processing
     ↓
Dashboard
```

Weather outputs include:

- Temperature
- Feels-like temperature
- Humidity
- Cloud cover
- Wind speed
- Sunshine duration
- Weather condition
- Hourly forecast
- Tomorrow forecast
- Rain probability

### Rain Window Detection

A rain-window algorithm was added to identify meaningful continuous periods of elevated precipitation probability.

Example:

```text
Rain likely between 02:00 PM – 04:00 PM
Chance during window: 91%
```

---

## Machine Learning Dataset Preparation

Historical weather data was prepared with features such as:

- Temperature
- Humidity
- Cloud cover
- Wind speed
- Solar radiation
- Sunshine duration
- Location
- Date

Solar-generation targets were obtained from PVGIS modeled solar generation.

---

## Feature Engineering

Final features include:

```text
latitude
longitude
avg_temperature_c
avg_humidity_pct
avg_cloud_cover_pct
avg_wind_speed_kmh
avg_shortwave_radiation_wm2
sunshine_hours
month_sin
month_cos
day_of_year_sin
day_of_year_cos
```

---

## Model Comparison

Models evaluated:

- Linear Regression
- Random Forest
- XGBoost

Metrics:

- MAE
- RMSE
- R²

XGBoost was selected as the final model.

Final model file:

```text
backend/solarflux_best_model.joblib
```

---

## Tomorrow Solar Prediction

Endpoint:

```text
GET /api/ai/solar-prediction
```

Flow:

```text
Location
   ↓
Open-Meteo Forecast
   ↓
Daily Weather Features
   ↓
XGBoost
   ↓
Predicted Solar Energy
```

---

## Explainable AI

SHAP was integrated to explain predictions.

Possible important factors:

- Cloud cover
- Sunshine duration
- Humidity
- Temperature
- Solar radiation
- Seasonal conditions

---

## Predicted Savings

Formula:

```text
Estimated Saving = Predicted Solar Energy × Electricity Tariff
```

---

## Production Drop Detection

Inputs:

- Expected generation
- Actual generation
- Threshold

Possible levels:

- Normal
- Watch
- Warning
- Critical

---

## Anomaly Detection

Isolation Forest is used to detect unusual operating patterns.

An anomaly indicates unusual behavior; it does not automatically diagnose the physical cause.

---

## Warning and Recommendation Engines

Warnings and recommendations can use:

- Weather risk
- Rain probability
- Production drop
- Anomaly severity
- Battery percentage, when available

---

## Combined AI Intelligence

Endpoint:

```text
GET /api/ai/intelligence
```

Combines:

- Weather
- Prediction
- SHAP explanation
- Savings
- Production analysis
- Anomaly detection
- Warnings
- Recommendations

---

# Review Enhancement — Future Solar Energy Forecast

## Status: Implemented

A review-based feature was added to predict solar generation over a selected future date range.

User inputs:

```text
Location
Start Date
End Date
```

Flow:

```text
Location + Date Range
        ↓
Geoapify
        ↓
Open-Meteo Forecast
        ↓
Daily Feature Engineering
        ↓
XGBoost
        ↓
Date-wise Solar Prediction
```

Endpoint:

```text
GET /api/ai/solar-forecast-range
```

Frontend component:

```text
FutureEnergyForecast.jsx
```

The UI displays:

- Location
- Start Date
- End Date
- Generate Forecast button
- Tomorrow prediction
- Total predicted energy
- Average per day
- Date-wise forecast cards
- Cloud cover
- Sunshine duration
- Solar radiation

Future values are labelled as **Predicted Energy**, not Actual Generated Energy.

---

# Phase 5 — ESP32 Hardware Prototype

## Status: Completed as a working hardware prototype

Hardware:

- ESP32 development board
- INA219
- DS18B20
- LDR
- Small solar panel

Current measurements:

- Solar voltage
- Solar current
- Instantaneous solar power
- Probe temperature
- Relative light level

Observed behavior:

- Covered panel gives near-zero output
- One torch produces a small measurable output
- Two torches increase measured output

These are test observations only and are not hardcoded application values.

### Current Hardware Limitations

The prototype does not measure:

- Household consumption
- Grid power
- Inverter output
- Real battery percentage

Therefore these fields must not be presented as live hardware measurements.

### Important Unit Handling

```text
mA / 1000 = A
mW / 1000 = W
mW / 1,000,000 = kW
```

LDR raw values are relative readings and must not be called lux or W/m² unless calibrated.

---

# Phase 6 — ESP32 → FastAPI → MongoDB → React

## Status: In Progress

Target flow:

```text
Solar Panel
      ↓
INA219 + DS18B20 + LDR
      ↓
ESP32
      ↓
Wi-Fi
      ↓
POST /api/telemetry
      ↓
FastAPI
      ↓
MongoDB
      ↓
GET /api/telemetry/latest
      ↓
React Dashboard
```

### Planned Backend Work

```text
backend/schemas/telemetry_schema.py
backend/routes/telemetry.py
backend/main.py
backend/database.py
backend/config.py
backend/.env.example
```

Planned endpoints:

```text
POST /api/telemetry
GET  /api/telemetry/latest
GET  /api/telemetry/history
```

Planned collections:

```text
telemetry_latest
telemetry_history
```

### Planned Frontend Work

```text
frontend/src/hooks/useTelemetry.js
frontend/src/pages/Monitoring.jsx
frontend/src/services/dashboardApi.js
frontend/src/pages/Dashboard.jsx
frontend/src/components/dashboard/TelemetryCards.jsx
frontend/src/components/dashboard/TelemetryChart.jsx
frontend/src/components/dashboard/SystemHealth.jsx
frontend/src/App.jsx
```

Planned live values:

- Solar Voltage
- Solar Current
- Instantaneous Power
- Probe Temperature
- LDR Raw
- Light Status
- ESP32 Online / Offline
- Sensor Status
- Last Update

---

## Planned Telemetry JSON

```json
{
  "device_id": "solarflux-esp32-01",
  "boot_id": "unique-per-boot-id",
  "sequence": 42,
  "uptime_ms": 126000,
  "solar_voltage_v": 0.248,
  "solar_current_ma": 2.1,
  "solar_power_mw": 0.5208,
  "probe_temperature_c": 29.44,
  "ldr_raw": 474,
  "light_status": "VERY_BRIGHT",
  "sensor_status": {
    "ina219": "ok",
    "ds18b20": "ok",
    "ldr": "ok"
  }
}
```

---

# Testing Strategy

## Backend

- Swagger `/docs`
- Response codes
- JSON structure
- Error handling
- MongoDB storage
- API availability

## Frontend

- Dashboard rendering
- Responsive layout
- Theme switching
- Location search
- Loading states
- Error handling
- Future forecast rendering

## Machine Learning

- MAE
- RMSE
- R²
- City-wise sanity checks
- Weather-driven prediction behavior

## Hardware

- Covered-panel test
- Light-response test
- Serial Monitor validation
- Sensor status
- Network disconnect
- Network reconnect
- Unit verification

---

# Current Project Status Summary

| Phase | Work | Status |
|---|---|---|
| Phase 1 | Landing Page | Completed |
| Phase 2 | Dashboard UI | Completed |
| Phase 3 | FastAPI + MongoDB | Completed |
| Phase 4 | Weather + AI/ML Intelligence | Completed |
| Review Enhancement | Future Solar Forecast | Completed |
| Phase 5 | ESP32 Hardware Prototype | Completed |
| Phase 6 | Live Hardware Integration | In Progress |
| Final Stage | Testing + Validation + Deployment | Pending |

---

# Key Development Principles

## Do Not Fabricate Sensor Data

If data is unavailable, display:

```text
Unavailable
--
No Data
```

## Keep Predicted and Measured Data Separate

```text
Predicted Solar Energy
```

is different from:

```text
Measured Solar Energy
```

## Keep Correct Units

Prototype instantaneous power may be in `mW`, while daily solar energy predictions are in `kWh`.

## Keep AI and Fast Sensor Polling Separate

ESP32 telemetry may update every few seconds. Weather and ML predictions should not run for every sensor update.

---

# Immediate Next Tasks

1. Complete ESP32 Wi-Fi telemetry POST.
2. Add FastAPI telemetry schema and routes.
3. Add MongoDB telemetry collections.
4. Add latest/history telemetry endpoints.
5. Build live monitoring page.
6. Add sensor freshness / stale state.
7. Validate end-to-end values against Serial Monitor.
8. Test reconnect behavior.
9. Verify units.
10. Complete final testing and deployment preparation.

---

## Repository

https://github.com/zubiyaAnsari1407/SolarFlux
