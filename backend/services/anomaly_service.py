from pathlib import Path

import joblib
import pandas as pd


# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

MODEL_PATH = (
    BASE_DIR
    / "solarflux_anomaly_detector.joblib"
)


# ============================================================
# LOAD MODEL
# ============================================================

if not MODEL_PATH.exists():

    raise FileNotFoundError(
        f"Anomaly model not found: {MODEL_PATH}"
    )


model_bundle = joblib.load(
    MODEL_PATH
)

model = model_bundle["model"]
features = model_bundle["features"]


# ============================================================
# PHYSICS-AWARE SETTINGS
# ============================================================

REFERENCE_SYSTEM_KW = 5.0

REFERENCE_PERFORMANCE_RATIO = 0.80

MIN_USEFUL_RADIATION_WM2 = 300

MIN_GENERATION_EFFICIENCY_PERCENT = 35


# ============================================================
# DETECT SOLAR ANOMALY
# ============================================================

def detect_solar_anomaly(
    temperature_c,
    humidity_pct,
    cloud_cover_pct,
    wind_speed_kmh,
    solar_radiation_wm2,
    solar_generation_kwh
):

    # ========================================================
    # VALIDATION
    # ========================================================

    if not 0 <= humidity_pct <= 100:
        raise ValueError(
            "Humidity must be between 0 and 100."
        )

    if not 0 <= cloud_cover_pct <= 100:
        raise ValueError(
            "Cloud cover must be between 0 and 100."
        )

    if wind_speed_kmh < 0:
        raise ValueError(
            "Wind speed cannot be negative."
        )

    if solar_radiation_wm2 < 0:
        raise ValueError(
            "Solar radiation cannot be negative."
        )

    if solar_generation_kwh < 0:
        raise ValueError(
            "Solar generation cannot be negative."
        )


    # ========================================================
    # ISOLATION FOREST INPUT
    # ========================================================

    feature_values = {

        "temperature_2m_c":
            float(temperature_c),

        "relative_humidity_2m_pct":
            float(humidity_pct),

        "cloud_cover_pct":
            float(cloud_cover_pct),

        "wind_speed_10m_kmh":
            float(wind_speed_kmh),

        "shortwave_radiation_wm2":
            float(solar_radiation_wm2),

        "solar_generation_kwh":
            float(solar_generation_kwh),
    }


    input_df = pd.DataFrame(
        [
            {
                feature: feature_values[feature]
                for feature in features
            }
        ]
    )


    # ========================================================
    # ISOLATION FOREST CHECK
    # ========================================================

    isolation_result = int(
        model.predict(input_df)[0]
    )

    anomaly_score = float(
        model.decision_function(input_df)[0]
    )

    isolation_forest_anomaly = (
        isolation_result == -1
    )


    # ========================================================
    # PHYSICS-AWARE REFERENCE GENERATION
    # ========================================================

    estimated_reference_generation = (

        REFERENCE_SYSTEM_KW
        *
        (
            float(solar_radiation_wm2)
            / 1000
        )
        *
        REFERENCE_PERFORMANCE_RATIO
    )


    # ========================================================
    # GENERATION EFFICIENCY
    # ========================================================

    if estimated_reference_generation > 0:

        generation_efficiency_percent = (

            float(solar_generation_kwh)
            /
            estimated_reference_generation

        ) * 100

    else:

        generation_efficiency_percent = 100.0


    # ========================================================
    # PHYSICS ANOMALY CHECK
    # ========================================================

    physics_anomaly = (

        solar_radiation_wm2
        >= MIN_USEFUL_RADIATION_WM2

        and

        generation_efficiency_percent
        <
        MIN_GENERATION_EFFICIENCY_PERCENT
    )


    # ========================================================
    # HYBRID FINAL DECISION
    # ========================================================

    is_anomaly = (

        isolation_forest_anomaly
        or
        physics_anomaly
    )


    # ========================================================
    # ANOMALY TYPE
    # ========================================================

    if (
        isolation_forest_anomaly
        and physics_anomaly
    ):

        anomaly_type = "hybrid"

    elif physics_anomaly:

        anomaly_type = (
            "performance_underproduction"
        )

    elif isolation_forest_anomaly:

        anomaly_type = (
            "historical_pattern_anomaly"
        )

    else:

        anomaly_type = "none"


    # ========================================================
    # STATUS + MESSAGE
    # ========================================================

    if physics_anomaly:

        status = "anomaly"

        message = (
            "Solar generation is unusually low "
            "for the available solar radiation. "
            "This may indicate system "
            "underperformance and should "
            "be investigated."
        )

    elif isolation_forest_anomaly:

        status = "anomaly"

        message = (
            "The current combination of weather "
            "and solar generation is unusual "
            "compared with historical patterns."
        )

    else:

        status = "normal"

        message = (
            "The current solar generation pattern "
            "is within the expected operating range."
        )


    # ========================================================
    # SEVERITY
    # ========================================================

    if not is_anomaly:

        severity = "normal"

    elif (
        physics_anomaly
        and generation_efficiency_percent < 15
    ):

        severity = "critical"

    elif (
        physics_anomaly
        and generation_efficiency_percent < 35
    ):

        severity = "warning"

    else:

        severity = "watch"


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "isAnomaly":
            is_anomaly,

        "status":
            status,

        "severity":
            severity,

        "anomalyType":
            anomaly_type,

        "anomalyScore":
            round(
                anomaly_score,
                4
            ),

        "message":
            message,

        "checks": {

            "isolationForestAnomaly":
                isolation_forest_anomaly,

            "physicsAnomaly":
                physics_anomaly,

            "referenceGeneration":
                round(
                    estimated_reference_generation,
                    3
                ),

            "generationEfficiencyPercentage":
                round(
                    generation_efficiency_percent,
                    2
                ),

            "minimumExpectedEfficiencyPercentage":
                MIN_GENERATION_EFFICIENCY_PERCENT,

            "minimumUsefulRadiation":
                MIN_USEFUL_RADIATION_WM2
        },

        "inputs": {

            "temperature":
                temperature_c,

            "humidity":
                humidity_pct,

            "cloudCover":
                cloud_cover_pct,

            "windSpeed":
                wind_speed_kmh,

            "solarRadiation":
                solar_radiation_wm2,

            "solarGeneration":
                solar_generation_kwh
        },

        "note": (
            "SolarFlux uses a hybrid anomaly detector "
            "combining Isolation Forest with a "
            "physics-aware solar performance check. "
            "The result identifies unusual behavior "
            "but does not by itself diagnose the "
            "physical cause."
        )
    }