from fastapi import (
    FastAPI,
    HTTPException,
    Body
)
from datetime import datetime, timedelta, timezone
from services.ai_intelligence_service import (
    get_ai_intelligence
)
from services.warning_engine_service import (
    generate_warning
)
from services.recommendation_engine_service import (
    generate_smart_recommendations
)
from services.anomaly_service import (
    detect_solar_anomaly
)
from services.explainability_service import (
    explain_tomorrow_prediction
)
from services.savings_service import (
    calculate_predicted_savings
)

from fastapi.middleware.cors import (
    CORSMiddleware
)
from services.production_drop_service import (
    detect_production_drop
)
from typing import Optional


from services.weather_service import (
    get_solarflux_weather
)

from services.solar_prediction_service import (
    predict_tomorrow_solar,
    predict_solar_range
)


from database import (
    dashboard_collection,
    weather_collection,
    alerts_collection,
    impact_collection,
    recommendations_collection,
    energy_history_collection,
    telemetry_collection
)


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="SolarFlux API",
    description=(
        "Backend API for SolarFlux "
        "Smart Solar Monitoring System"
    ),
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message":
            "SolarFlux API is running",

        "status":
            "online"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
def health_check():

    return {
        "status":
            "healthy",

        "service":
            "SolarFlux Backend"
    }


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

@app.get("/api/dashboard/summary")
def dashboard_summary():

    data = dashboard_collection.find_one(
        {},
        {"_id": 0}
    )

    if not data:

        return {
            "message":
                "No dashboard data found"
        }

    return data


# ============================================================
# CURRENT WEATHER
# ============================================================

@app.get("/api/weather/current")
def get_current_weather(

    location: Optional[str] = None,

    latitude: Optional[float] = None,

    longitude: Optional[float] = None
):

    if not location and (
        latitude is None
        or longitude is None
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Provide a location "
                "or GPS coordinates."
            )
        )


    try:

        weather_data = (
            get_solarflux_weather(

                location=location,

                latitude=latitude,

                longitude=longitude
            )
        )


        weather_collection.update_one(

            {},

            {
                "$set":
                    weather_data
            },

            upsert=True
        )


        return weather_data


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "WEATHER ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to fetch "
                "weather data."
            )
        )


# ============================================================
# AI SOLAR PREDICTION
# ============================================================

@app.get(
    "/api/ai/solar-prediction"
)


def get_solar_prediction(

    location: Optional[str] = None,

    latitude: Optional[float] = None,

    longitude: Optional[float] = None
):
    

    if not location and (
        latitude is None
        or longitude is None
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Provide a location "
                "or GPS coordinates."
            )
        )


    try:

        prediction = (
            predict_tomorrow_solar(

                location=location,

                latitude=latitude,

                longitude=longitude
            )
        )


        return prediction


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "SOLAR PREDICTION ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate "
                "solar prediction."
            )
        )

# ============================================================
# FUTURE SOLAR ENERGY RANGE FORECAST
# ============================================================

@app.get(
    "/api/ai/solar-forecast-range"
)
def get_solar_forecast_range(

    start_date: str,

    end_date: str,

    location: Optional[str] = None,

    latitude: Optional[float] = None,

    longitude: Optional[float] = None
):

    # --------------------------------------------------------
    # LOCATION VALIDATION
    # --------------------------------------------------------

    if not location and (
        latitude is None
        or longitude is None
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Provide a location "
                "or GPS coordinates."
            )
        )


    try:

        return predict_solar_range(

            start_date=
                start_date,

            end_date=
                end_date,

            location=
                location,

            latitude=
                latitude,

            longitude=
                longitude
        )


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "SOLAR RANGE FORECAST ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate "
                "future solar energy forecast."
            )
        )
# ============================================================
# ALERTS
# ============================================================

@app.get("/api/alerts")
def get_alerts():

    alerts = list(

        alerts_collection.find(
            {},
            {"_id": 0}
        )
    )

    return alerts


# ============================================================
# IMPACT
# ============================================================

@app.get("/api/impact/today")
def get_today_impact():

    data = impact_collection.find_one(
        {},
        {"_id": 0}
    )

    if not data:

        return {
            "message":
                "No impact data found"
        }

    return data


# ============================================================
# RECOMMENDATIONS
# ============================================================

@app.get("/api/recommendations")
def get_recommendations():

    data = (
        recommendations_collection
        .find_one(
            {},
            {"_id": 0}
        )
    )

    if not data:

        return {
            "message":
                "No recommendations found"
        }

    return data


# ============================================================
# ENERGY HISTORY
# ============================================================

@app.get("/api/energy/history")
def get_energy_history():

    data = list(

        energy_history_collection.find(
            {},
            {"_id": 0}
        )
    )

    return data


# ============================================================
# LIVE ESP32 SOLAR TELEMETRY
# ============================================================

@app.post("/api/telemetry")
def save_telemetry(reading: dict = Body(...)):
    """Store one ESP32 solar-panel reading for the live production chart."""

    required_fields = [
        "voltage",
        "current",
        "power",
        "temperature",
        "light",
    ]

    try:
        normalized = {
            field: float(reading[field])
            for field in required_fields
        }
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=422,
            detail="Telemetry must include numeric voltage, current, power, temperature and light values."
        )

    now = datetime.now(timezone.utc)

    telemetry_collection.insert_one({
        **normalized,
        "lightStatus": reading.get("lightStatus", "UNKNOWN"),
        "inaConnected": bool(reading.get("inaConnected", False)),
        "recordedAt": now,
    })

    return {
        "status": "saved",
        "recordedAt": now.isoformat(),
    }


@app.get("/api/telemetry/history")
def get_live_solar_history(hours: int = 24):
    """Return hourly averages of real ESP32 solar power for the chart."""

    safe_hours = min(max(hours, 1), 168)
    start = datetime.now(timezone.utc) - timedelta(hours=safe_hours)

    samples = telemetry_collection.find(
        {"recordedAt": {"$gte": start}},
        {"_id": 0, "power": 1, "recordedAt": 1},
    ).sort("recordedAt", 1)

    grouped = {}

    for sample in samples:
        recorded_at = sample.get("recordedAt")
        power_mw = sample.get("power")

        if not isinstance(recorded_at, datetime):
            continue

        try:
            power_kw = float(power_mw) / 1_000_000
        except (TypeError, ValueError):
            continue

        if recorded_at.tzinfo is None:
            recorded_at = recorded_at.replace(tzinfo=timezone.utc)

        local_time = recorded_at.astimezone()
        key = local_time.strftime("%Y-%m-%d %H")

        if key not in grouped:
            grouped[key] = {
                "time": local_time.strftime("%I %p").lstrip("0"),
                "total": 0,
                "count": 0,
            }

        grouped[key]["total"] += power_kw
        grouped[key]["count"] += 1

    return [
        {
            "time": entry["time"],
            "solar": round(entry["total"] / entry["count"], 6),
        }
        for entry in grouped.values()
    ]

# ============================================================
# SHAP EXPLAINABLE AI
# ============================================================

@app.get(
    "/api/ai/solar-explanation"
)
def get_solar_explanation(

    location: Optional[str] = None,

    latitude: Optional[float] = None,

    longitude: Optional[float] = None
):

    if not location and (
        latitude is None
        or longitude is None
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Provide a location "
                "or GPS coordinates."
            )
        )


    try:

        explanation = (
            explain_tomorrow_prediction(

                location=location,

                latitude=latitude,

                longitude=longitude
            )
        )


        return explanation


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "SHAP EXPLANATION ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate "
                "prediction explanation."
            )
        )
    

    # ============================================================
# PREDICTED SAVINGS
# ============================================================

@app.get(
    "/api/ai/predicted-savings"
)
def get_predicted_savings(

    location: Optional[str] = None,

    latitude: Optional[float] = None,

    longitude: Optional[float] = None,

    tariff_per_kwh: float = 8.0
):

    if not location and (
        latitude is None
        or longitude is None
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Provide a location "
                "or GPS coordinates."
            )
        )


    try:

        return calculate_predicted_savings(

            location=location,

            latitude=latitude,

            longitude=longitude,

            tariff_per_kwh=tariff_per_kwh
        )


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "SAVINGS ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to calculate "
                "predicted savings."
            )
        )


        # ============================================================
# PRODUCTION DROP DETECTION
# ============================================================

@app.get(
    "/api/ai/production-drop"
)
def get_production_drop(

    expected_generation_kwh: float,

    actual_generation_kwh: float,

    threshold_percent: float = 15.0
):

    try:

        return detect_production_drop(

            expected_generation_kwh=
                expected_generation_kwh,

            actual_generation_kwh=
                actual_generation_kwh,

            threshold_percent=
                threshold_percent
        )


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "PRODUCTION DROP ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to evaluate "
                "solar production."
            )
        )

        # ============================================================
# ANOMALY DETECTION
# ============================================================

@app.get(
    "/api/ai/anomaly-detection"
)
def get_anomaly_detection(

    temperature_c: float,

    humidity_pct: float,

    cloud_cover_pct: float,

    wind_speed_kmh: float,

    solar_radiation_wm2: float,

    solar_generation_kwh: float
):

    try:

        return detect_solar_anomaly(

            temperature_c=
                temperature_c,

            humidity_pct=
                humidity_pct,

            cloud_cover_pct=
                cloud_cover_pct,

            wind_speed_kmh=
                wind_speed_kmh,

            solar_radiation_wm2=
                solar_radiation_wm2,

            solar_generation_kwh=
                solar_generation_kwh
        )


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "ANOMALY DETECTION ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to perform "
                "anomaly detection."
            )
        )

        # ============================================================
# RULE-BASED WARNING ENGINE
# ============================================================

@app.get(
    "/api/ai/warning-engine"
)
def get_warning_engine(

    weather_risk: bool = False,

    production_severity: str = "normal",

    anomaly_detected: bool = False,

    anomaly_severity: str = "normal"
):

    weather_alert = None

    if weather_risk:

        weather_alert = {
            "title":
                "Weather may reduce solar output",

            "message":
                "Forecast weather conditions may reduce solar generation."
        }


    production_drop = {
        "severity":
            production_severity,

        "message":
            "Solar production is below the expected level."
    }


    anomaly_result = {
        "isAnomaly":
            anomaly_detected,

        "severity":
            anomaly_severity,

        "message":
            "Unusual solar generation behavior was detected."
    }


    return generate_warning(
        weather_alert=
            weather_alert,

        production_drop=
            production_drop,

        anomaly_result=
            anomaly_result
    )

    # ============================================================
# SMART RECOMMENDATION ENGINE
# ============================================================

@app.get(
    "/api/ai/smart-recommendation"
)
def get_smart_recommendation(

    weather_risk: bool = False,

    rain_probability: float = 0,

    production_drop_percent: float = 0,

    anomaly_detected: bool = False,

    anomaly_severity: str = "normal",

    battery_percentage: Optional[float] = None
):

    try:

        if not 0 <= rain_probability <= 100:

            raise ValueError(
                "Rain probability must be between 0 and 100."
            )


        if production_drop_percent < 0:

            raise ValueError(
                "Production drop percentage cannot be negative."
            )


        if (
            battery_percentage is not None
            and not 0 <= battery_percentage <= 100
        ):

            raise ValueError(
                "Battery percentage must be between 0 and 100."
            )


        return generate_smart_recommendations(

            weather_risk=
                weather_risk,

            rain_probability=
                rain_probability,

            production_drop_percent=
                production_drop_percent,

            anomaly_detected=
                anomaly_detected,

            anomaly_severity=
                anomaly_severity,

            battery_percentage=
                battery_percentage
        )


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "RECOMMENDATION ENGINE ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate "
                "smart recommendation."
            )
        )
    # ============================================================
# COMBINED AI INTELLIGENCE
# ============================================================

@app.get(
    "/api/ai/intelligence"
)
def get_combined_ai_intelligence(

    location: Optional[str] = None,

    latitude: Optional[float] = None,

    longitude: Optional[float] = None,

    tariff_per_kwh: float = 8.0,

    expected_generation_kwh: Optional[float] = None,

    actual_generation_kwh: Optional[float] = None,

    sensor_temperature_c: Optional[float] = None,

    sensor_humidity_pct: Optional[float] = None,

    sensor_cloud_cover_pct: Optional[float] = None,

    sensor_wind_speed_kmh: Optional[float] = None,

    sensor_solar_radiation_wm2: Optional[float] = None,

    battery_percentage: Optional[float] = None
):

    if not location and (
        latitude is None
        or longitude is None
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Provide a location "
                "or GPS coordinates."
            )
        )


    try:

        return get_ai_intelligence(

            location=location,

            latitude=latitude,

            longitude=longitude,

            tariff_per_kwh=
                tariff_per_kwh,

            expected_generation_kwh=
                expected_generation_kwh,

            actual_generation_kwh=
                actual_generation_kwh,

            sensor_temperature_c=
                sensor_temperature_c,

            sensor_humidity_pct=
                sensor_humidity_pct,

            sensor_cloud_cover_pct=
                sensor_cloud_cover_pct,

            sensor_wind_speed_kmh=
                sensor_wind_speed_kmh,

            sensor_solar_radiation_wm2=
                sensor_solar_radiation_wm2,

            battery_percentage=
                battery_percentage
        )


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except Exception as e:

        print(
            "AI INTELLIGENCE ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate "
                "SolarFlux AI intelligence."
            )
        )
