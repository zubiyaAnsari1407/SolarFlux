# SolarFlux

## AI-Powered Smart Solar Monitoring, Prediction and Optimization System

SolarFlux is a smart solar monitoring and decision-support platform designed for small-scale and residential solar systems. It combines a modern React dashboard, FastAPI backend, MongoDB, weather intelligence, machine learning, explainable AI, anomaly detection, savings estimation, smart recommendations, and an ESP32-based hardware prototype.

The aim is to move beyond simple monitoring and answer questions such as:

- How much solar energy may be generated tomorrow?
- How much energy may be produced over a selected future date range?
- Which weather conditions are affecting generation?
- Why did the AI produce a particular prediction?
- Is the system behaving abnormally?
- What action should the user take?
- What are the live readings from the solar hardware prototype?

---

## 1. Main Features

### Smart Solar Dashboard

The dashboard currently includes:

- Solar generation KPI
- Consumption KPI
- Battery information
- Energy generated today
- Energy production chart
- Weather Intelligence
- Live Energy Flow UI
- Battery Status
- System Health
- Environmental Impact
- Alerts & Insights
- Smart Recommendations
- Future Solar Energy Prediction
- Time-based dashboard themes

> Some dashboard values such as household consumption, battery and energy flow are not yet measured by the current physical prototype and should not be treated as live hardware values.

---

## 2. Dynamic Dashboard Themes

SolarFlux supports four dashboard themes:

- Morning
- Afternoon
- Evening
- Night

The theme can change automatically according to time of day, and a manual theme switcher is also available.

---

## 3. Weather Intelligence

SolarFlux uses weather data to support solar generation analysis.

Weather information includes:

- Current temperature
- Feels-like temperature
- Humidity
- Wind speed
- Cloud cover
- Sunshine duration
- Weather condition
- Hourly forecast
- Tomorrow forecast
- Rain probability
- Rain-window detection

Example:

```text
Rain likely between 02:00 PM – 04:00 PM
Chance during window: 91%
```

---

## 4. Solar Generation Prediction

SolarFlux uses a trained XGBoost model to estimate expected solar energy production.

The model uses weather and location-related features such as:

- Latitude
- Longitude
- Average temperature
- Average humidity
- Average cloud cover
- Average wind speed
- Average shortwave solar radiation
- Sunshine duration
- Seasonal sine/cosine features
- Day-of-year features

Models evaluated during development:

- Linear Regression
- Random Forest
- XGBoost

XGBoost was selected as the final model.

The current prediction represents expected production for a standardized **5 kWp** solar installation.

> The prediction target is based on modeled solar-generation data, not long-term measured household inverter data.

---

## 5. Tomorrow Solar Energy Prediction

Flow:

```text
Selected Location
       ↓
Geoapify
       ↓
Latitude / Longitude
       ↓
Open-Meteo Forecast
       ↓
Feature Engineering
       ↓
XGBoost
       ↓
Predicted Solar Energy
```

API:

```text
GET /api/ai/solar-prediction
```

---

## 6. Future Solar Energy Forecast

A review-based enhancement added date-range solar prediction.

The user selects:

```text
Location
Start Date
End Date
```

SolarFlux predicts solar generation for each selected future day and calculates:

- Tomorrow prediction
- Date-wise predicted energy
- Total predicted energy
- Average energy per day
- Weather inputs for each date

API:

```text
GET /api/ai/solar-forecast-range
```

Example request:

```text
/api/ai/solar-forecast-range?location=Mumbai&start_date=2026-09-12&end_date=2026-09-16
```

Future values are **predicted energy**, not measured generation.

---

## 7. Explainable AI

SolarFlux uses SHAP-based explainability to show why the model produced a prediction.

Possible contributing factors include:

- Cloud cover
- Sunshine duration
- Humidity
- Temperature
- Solar radiation
- Seasonal conditions

---

## 8. Predicted Savings

Basic formula:

```text
Estimated Saving = Predicted Solar Energy × Electricity Tariff
```

These are estimates and depend on actual electricity tariff, self-consumption, export rules and net-metering conditions.

---

## 9. Production Drop Detection

SolarFlux can compare expected generation with actual generation and classify a drop as:

- Normal
- Watch
- Warning
- Critical

---

## 10. Anomaly Detection

SolarFlux includes an Isolation Forest based anomaly-detection module.

It can analyze unusual combinations of:

- Temperature
- Humidity
- Cloud cover
- Wind
- Solar radiation
- Solar generation

An anomaly means unusual behavior was detected. It does not automatically diagnose a specific hardware fault.

---

## 11. Smart Warning and Recommendation Engine

SolarFlux combines weather risk, production analysis and anomaly results to generate user-facing warnings and recommendations.

Example:

```text
Weather may reduce solar output tomorrow.
```

---

## 12. Combined AI Intelligence

API:

```text
GET /api/ai/intelligence
```

It combines:

- Weather
- Solar prediction
- SHAP explanation
- Savings
- Production analysis
- Anomaly detection
- Warnings
- Recommendations

---

## 13. Hardware Prototype

The SolarFlux hardware prototype uses:

- ESP32 development board
- INA219 voltage/current sensor
- DS18B20 temperature sensor
- LDR light sensor
- Small solar panel

The current prototype measures:

- Solar voltage
- Solar current
- Instantaneous solar power
- Probe temperature
- Relative light level

The prototype does **not** currently measure:

- Household consumption
- Grid power
- Inverter output
- Real battery state

These values should not be presented as live hardware readings.

---

## 14. Phase 6 Hardware Integration Target

```text
Solar Panel / Sensors
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
 React Monitoring UI
```

Planned telemetry endpoints:

```text
POST /api/telemetry
GET  /api/telemetry/latest
GET  /api/telemetry/history
```

---

## 15. Important Unit Rules

```text
mA / 1000 = A
mW / 1000 = W
mW / 1,000,000 = kW
```

Example: `0.521 mW` must not be displayed as `0.521 kW`.

LDR raw values are relative light readings and must not be labelled as lux or W/m² without calibration.

---

## 16. Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Motion
- Lucide React
- Recharts
- React Router

### Backend
- Python
- FastAPI
- Uvicorn
- PyMongo
- Requests
- python-dotenv
- uv

### Machine Learning
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- SHAP
- Joblib
- Isolation Forest

### Database
- MongoDB

### APIs
- Open-Meteo
- Geoapify
- PVGIS

### IoT
- ESP32
- INA219
- DS18B20
- LDR

---

## 17. Project Structure

```text
SolarFlux/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── config.py
│   ├── seed.py
│   ├── solarflux_best_model.joblib
│   ├── services/
│   └── routes/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── themes/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── Progress.md
└── .gitignore
```

---

## 18. Main Backend APIs

```text
GET /api/health
GET /api/dashboard/summary
GET /api/weather/current
GET /api/alerts
GET /api/impact/today
GET /api/recommendations
GET /api/energy/history

GET /api/ai/solar-prediction
GET /api/ai/solar-forecast-range
GET /api/ai/solar-explanation
GET /api/ai/predicted-savings
GET /api/ai/production-drop
GET /api/ai/anomaly-detection
GET /api/ai/warning-engine
GET /api/ai/smart-recommendation
GET /api/ai/intelligence
```

---

## 19. Installation

### Clone Repository

```bash
git clone https://github.com/zubiyaAnsari1407/SolarFlux.git
cd SolarFlux
```

### Backend Setup

```bash
cd backend
uv sync
```

Create `backend/.env`:

```env
MONGO_URL=mongodb://localhost:27017
DATABASE_NAME=solarflux
GEOAPIFY_API_KEY=YOUR_GEOAPIFY_API_KEY
```

Run backend:

```bash
uv run uvicorn main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 20. Current Status

| Phase | Module | Status |
|---|---|---|
| Phase 1 | Landing Page | Completed |
| Phase 2 | Dashboard UI | Completed |
| Phase 3 | FastAPI + MongoDB Integration | Completed |
| Phase 4 | Weather + AI/ML Intelligence | Completed |
| Phase 5 | ESP32 Hardware Prototype | Completed |
| Phase 6 | ESP32 → FastAPI → MongoDB → React Integration | In Progress |
| Final Stage | Testing, Validation and Deployment | Pending |

---

## 21. Current Limitations

1. Solar prediction uses modeled generation targets rather than long-term real household inverter data.
2. Future predictions depend on weather forecast quality.
3. The physical prototype is a small low-power setup.
4. Household consumption, grid power and real battery data are not currently measured by the hardware prototype.
5. Hardware mW readings must not be directly compared with installation-scale daily kWh predictions.
6. AI predictions and savings are estimates, not guaranteed outcomes.
7. Live ESP32 → FastAPI → MongoDB → React telemetry integration is still under implementation.

---

## 22. Future Scope

- Complete live ESP32 telemetry
- Historical telemetry charts
- Energy integration over time
- Inverter integration
- Battery monitoring
- Household energy meter integration
- Improved fault detection
- Multi-site monitoring
- User-specific model training
- Cloud deployment
- Mobile application
- Notification system
- Long-term performance analysis

---

## Project Goal

SolarFlux aims to transform solar monitoring from:

```text
"What is happening?"
```

into:

```text
"What will happen?"
"Why will it happen?"
"Is something unusual?"
"What should I do?"
```

By combining IoT monitoring, weather intelligence, machine learning and explainable AI, SolarFlux provides a more intelligent approach to solar-energy monitoring and decision support.

---

## Repository

https://github.com/zubiyaAnsari1407/SolarFlux

---

## Note

SolarFlux is an educational and research-oriented engineering prototype. Predicted solar generation, savings and AI recommendations are estimates and should be validated against real operational solar installations before production use.
