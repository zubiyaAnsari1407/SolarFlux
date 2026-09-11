from services.weather_service import (
    get_solarflux_weather
)

from services.solar_prediction_service import (
    predict_tomorrow_solar
)

from services.explainability_service import (
    explain_tomorrow_prediction
)

from services.savings_service import (
    calculate_predicted_savings
)

from services.production_drop_service import (
    detect_production_drop
)

from services.anomaly_service import (
    detect_solar_anomaly
)

from services.warning_engine_service import (
    generate_warning
)

from services.recommendation_engine_service import (
    generate_smart_recommendations
)


# ============================================================
# COMBINED SOLARFLUX AI INTELLIGENCE
# ============================================================

def get_ai_intelligence(
    location=None,
    latitude=None,
    longitude=None,
    tariff_per_kwh=8.0,

    # Optional operational values
    expected_generation_kwh=None,
    actual_generation_kwh=None,

    # Optional sensor values
    sensor_temperature_c=None,
    sensor_humidity_pct=None,
    sensor_cloud_cover_pct=None,
    sensor_wind_speed_kmh=None,
    sensor_solar_radiation_wm2=None,

    battery_percentage=None
):

    # ========================================================
    # WEATHER
    # ========================================================

    weather = get_solarflux_weather(
        location=location,
        latitude=latitude,
        longitude=longitude
    )


    # ========================================================
    # TOMORROW ML PREDICTION
    # ========================================================

    prediction = predict_tomorrow_solar(
        location=location,
        latitude=latitude,
        longitude=longitude
    )


    # ========================================================
    # SHAP EXPLANATION
    # ========================================================

    explanation = explain_tomorrow_prediction(
        location=location,
        latitude=latitude,
        longitude=longitude
    )


    # ========================================================
    # SAVINGS
    # ========================================================

    savings = calculate_predicted_savings(
        location=location,
        latitude=latitude,
        longitude=longitude,
        tariff_per_kwh=tariff_per_kwh
    )


    # ========================================================
    # WEATHER RISK
    # ========================================================

    weather_alert = weather.get(
        "weatherAlert"
    )

    weather_risk = (
        weather_alert is not None
    )

    rain_probability = (
        weather
        .get("tomorrow", {})
        .get("rainProbability", 0)
        or 0
    )


    # ========================================================
    # PRODUCTION DROP
    # ========================================================

    production_drop = None

    if (
        expected_generation_kwh is not None
        and actual_generation_kwh is not None
    ):

        production_drop = detect_production_drop(

            expected_generation_kwh=
                expected_generation_kwh,

            actual_generation_kwh=
                actual_generation_kwh
        )


    # ========================================================
    # ANOMALY DETECTION
    # ========================================================

    anomaly_result = None


    anomaly_inputs_available = all([

        sensor_temperature_c
        is not None,

        sensor_humidity_pct
        is not None,

        sensor_cloud_cover_pct
        is not None,

        sensor_wind_speed_kmh
        is not None,

        sensor_solar_radiation_wm2
        is not None,

        actual_generation_kwh
        is not None,
    ])


    if anomaly_inputs_available:

        anomaly_result = detect_solar_anomaly(

            temperature_c=
                sensor_temperature_c,

            humidity_pct=
                sensor_humidity_pct,

            cloud_cover_pct=
                sensor_cloud_cover_pct,

            wind_speed_kmh=
                sensor_wind_speed_kmh,

            solar_radiation_wm2=
                sensor_solar_radiation_wm2,

            solar_generation_kwh=
                actual_generation_kwh
        )


    # ========================================================
    # WARNING ENGINE
    # ========================================================

    warning_result = generate_warning(

        weather_alert=
            weather_alert,

        production_drop=
            production_drop,

        anomaly_result=
            anomaly_result
    )


    # ========================================================
    # PRODUCTION DROP %
    # ========================================================

    production_drop_percent = 0


    if production_drop:

        production_drop_percent = (
            production_drop.get(
                "dropPercentage",
                0
            )
        )


    # ========================================================
    # ANOMALY VALUES
    # ========================================================

    anomaly_detected = False

    anomaly_severity = "normal"


    if anomaly_result:

        anomaly_detected = (
            anomaly_result.get(
                "isAnomaly",
                False
            )
        )


        anomaly_severity = (
            anomaly_result.get(
                "severity",
                "normal"
            )
        )


    # ========================================================
    # SMART RECOMMENDATION
    # ========================================================

    recommendation = (
        generate_smart_recommendations(

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
    )


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "location":
            prediction["location"],

        "predictionDate":
            prediction["predictionDate"],


        # ====================================================
        # WEATHER
        # ====================================================

        "weather": {

            "location":
                weather.get(
                    "location"
                ),

            "temperature":
                weather.get(
                    "temperature"
                ),

            "feelsLike":
                weather.get(
                    "feelsLike"
                ),

            "condition":
                weather.get(
                    "condition"
                ),

            "humidity":
                weather.get(
                    "humidity"
                ),

            "cloudCover":
                weather.get(
                    "cloudCover"
                ),

            "windSpeed":
                weather.get(
                    "windSpeed"
                ),

            "sunlightHours":
                weather.get(
                    "sunlightHours"
                ),

            "tomorrow":
                weather.get(
                    "tomorrow"
                ),

            "weatherAlert":
                weather_alert
        },


        # ====================================================
        # AI PREDICTION
        # ====================================================

        "prediction":
            prediction,


        # ====================================================
        # EXPLAINABLE AI
        # ====================================================

        "explanation": {

            "method":
                explanation.get(
                    "explanationMethod"
                ),

            "baseGeneration":
                explanation.get(
                    "baseGeneration"
                ),

            "topFactors":
                explanation.get(
                    "topFactors"
                ),

            "positiveFactors":
                explanation.get(
                    "positiveFactors"
                ),

            "negativeFactors":
                explanation.get(
                    "negativeFactors"
                )
        },


        # ====================================================
        # SAVINGS
        # ====================================================

        "savings":
            savings,


        # ====================================================
        # OPERATIONAL INTELLIGENCE
        # ====================================================

        "productionDrop":
            production_drop,

        "anomaly":
            anomaly_result,


        # ====================================================
        # WARNING ENGINE
        # ====================================================

        "warning":
            warning_result,


        # ====================================================
        # SMART RECOMMENDATION
        # ====================================================

        "recommendation":
            recommendation,


        # ====================================================
        # SYSTEM INFO
        # ====================================================

        "system": {

            "model":
                prediction.get(
                    "model"
                ),

            "systemCapacity":
                prediction.get(
                    "systemCapacity"
                ),

            "systemCapacityUnit":
                prediction.get(
                    "systemCapacityUnit"
                ),

            "operationalDataConnected":
                (
                    production_drop
                    is not None

                    or

                    anomaly_result
                    is not None
                )
        }
    }