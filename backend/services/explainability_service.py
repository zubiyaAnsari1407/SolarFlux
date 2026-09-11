import numpy as np
import pandas as pd
import shap

from services.weather_service import fetch_weather

from services.solar_prediction_service import (
    model,
    model_name,
    model_features,
    prepare_tomorrow_features
)


# ============================================================
# SHAP EXPLAINER
# ============================================================

print("Loading SHAP explainer...")

explainer = shap.TreeExplainer(
    model
)

print("SHAP explainer ready.")


# ============================================================
# FRIENDLY FEATURE NAMES
# ============================================================

FEATURE_LABELS = {

    "latitude":
        "Location latitude",

    "longitude":
        "Location longitude",

    "avg_temperature_c":
        "Average temperature",

    "avg_humidity_pct":
        "Humidity",

    "avg_cloud_cover_pct":
        "Cloud cover",

    "avg_wind_speed_kmh":
        "Wind speed",

    "avg_shortwave_radiation_wm2":
        "Solar radiation",

    "sunshine_hours":
        "Sunshine duration",

    "month_sin":
        "Seasonal month pattern",

    "month_cos":
        "Seasonal month pattern",

    "day_of_year_sin":
        "Seasonal day pattern",

    "day_of_year_cos":
        "Seasonal day pattern",
}


# ============================================================
# FEATURE UNITS
# ============================================================

FEATURE_UNITS = {

    "latitude":
        "°",

    "longitude":
        "°",

    "avg_temperature_c":
        "°C",

    "avg_humidity_pct":
        "%",

    "avg_cloud_cover_pct":
        "%",

    "avg_wind_speed_kmh":
        "km/h",

    "avg_shortwave_radiation_wm2":
        "W/m²",

    "sunshine_hours":
        "hours",

    "month_sin":
        "",

    "month_cos":
        "",

    "day_of_year_sin":
        "",

    "day_of_year_cos":
        "",
}


# ============================================================
# SAFE FLOAT
# ============================================================

def safe_float(value):

    if isinstance(
        value,
        np.ndarray
    ):

        value = value.flatten()[0]

    return float(value)


# ============================================================
# BUILD HUMAN EXPLANATION
# ============================================================

def build_reason(
    feature_name,
    feature_value,
    shap_value
):

    label = FEATURE_LABELS.get(
        feature_name,
        feature_name
    )

    unit = FEATURE_UNITS.get(
        feature_name,
        ""
    )


    if shap_value > 0:

        direction_text = (
            "increased the expected solar generation"
        )

    else:

        direction_text = (
            "reduced the expected solar generation"
        )


    # Friendly explanation for important weather variables
    if feature_name == "avg_cloud_cover_pct":

        if shap_value < 0:

            return (
                f"Cloud cover of "
                f"{feature_value:.1f}% "
                f"reduced the expected solar output."
            )

        return (
            f"Cloud conditions contributed positively "
            f"to the prediction."
        )


    if feature_name == "avg_shortwave_radiation_wm2":

        return (
            f"Average solar radiation of "
            f"{feature_value:.1f} W/m² "
            f"{direction_text}."
        )


    if feature_name == "sunshine_hours":

        return (
            f"About "
            f"{feature_value:.1f} hours of sunshine "
            f"{direction_text}."
        )


    if feature_name == "avg_humidity_pct":

        return (
            f"Humidity of "
            f"{feature_value:.1f}% "
            f"{direction_text}."
        )


    if feature_name == "avg_temperature_c":

        return (
            f"Average temperature of "
            f"{feature_value:.1f}°C "
            f"{direction_text}."
        )


    if feature_name == "avg_wind_speed_kmh":

        return (
            f"Average wind speed of "
            f"{feature_value:.1f} km/h "
            f"{direction_text}."
        )


    # Generic fallback
    value_text = (
        f"{feature_value:.2f}{unit}"
        if unit
        else f"{feature_value:.2f}"
    )

    return (
        f"{label} ({value_text}) "
        f"{direction_text}."
    )


# ============================================================
# EXPLAIN TOMORROW PREDICTION
# ============================================================

def explain_tomorrow_prediction(
    location=None,
    latitude=None,
    longitude=None
):

    # --------------------------------------------------------
    # REAL FORECAST
    # --------------------------------------------------------

    raw_weather = fetch_weather(
        location=location,
        latitude=latitude,
        longitude=longitude
    )


    # --------------------------------------------------------
    # SAME FEATURES USED BY MODEL
    # --------------------------------------------------------

    features, prediction_date = (
        prepare_tomorrow_features(
            raw_weather
        )
    )


    feature_row = {

        feature:
            features[feature]

        for feature in model_features
    }


    input_df = pd.DataFrame(
        [feature_row],
        columns=model_features
    )


    # --------------------------------------------------------
    # MODEL PREDICTION
    # --------------------------------------------------------

    prediction = float(
        model.predict(
            input_df
        )[0]
    )


    prediction = max(
        0,
        prediction
    )


    # --------------------------------------------------------
    # SHAP VALUES
    # --------------------------------------------------------

    shap_values = explainer.shap_values(
        input_df
    )


    if isinstance(
        shap_values,
        list
    ):

        shap_values = shap_values[0]


    shap_row = np.array(
        shap_values
    )[0]


    # --------------------------------------------------------
    # BASE VALUE
    # --------------------------------------------------------

    base_value = safe_float(
        explainer.expected_value
    )


    # --------------------------------------------------------
    # FEATURE IMPACTS
    # --------------------------------------------------------

    impacts = []


    for index, feature_name in enumerate(
        model_features
    ):

        feature_value = float(
            input_df.iloc[0][
                feature_name
            ]
        )

        shap_value = float(
            shap_row[index]
        )


        impacts.append({

            "feature":
                feature_name,

            "label":
                FEATURE_LABELS.get(
                    feature_name,
                    feature_name
                ),

            "value":
                round(
                    feature_value,
                    3
                ),

            "shapValue":
                round(
                    shap_value,
                    4
                ),

            "absoluteImpact":
                round(
                    abs(shap_value),
                    4
                ),

            "impactDirection":
                (
                    "positive"
                    if shap_value > 0
                    else "negative"
                ),

            "reason":
                build_reason(
                    feature_name,
                    feature_value,
                    shap_value
                )
        })


    # --------------------------------------------------------
    # SORT MOST IMPORTANT FIRST
    # --------------------------------------------------------

    impacts.sort(
        key=lambda item:
            item["absoluteImpact"],
        reverse=True
    )


    # Top four drivers
    top_impacts = impacts[:4]


    # --------------------------------------------------------
    # LOCATION
    # --------------------------------------------------------

    location_data = raw_weather[
        "location_data"
    ]


    display_location = (
        location_data.get(
            "name",
            location or "Current Location"
        )
    )


    # --------------------------------------------------------
    # SIMPLE SUMMARY
    # --------------------------------------------------------

    positive_impacts = [
        item
        for item in top_impacts
        if item[
            "impactDirection"
        ] == "positive"
    ]


    negative_impacts = [
        item
        for item in top_impacts
        if item[
            "impactDirection"
        ] == "negative"
    ]


    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return {

        "location":
            display_location,

        "predictionDate":
            prediction_date,

        "predictedGeneration":
            round(
                prediction,
                2
            ),

        "unit":
            "kWh",

        "model":
            model_name,

        "explanationMethod":
            "SHAP TreeExplainer",

        "baseGeneration":
            round(
                base_value,
                2
            ),

        "topFactors":
            top_impacts,

        "positiveFactors": [

            {
                "label":
                    item["label"],

                "impact":
                    item["shapValue"],

                "reason":
                    item["reason"]
            }

            for item
            in positive_impacts
        ],

        "negativeFactors": [

            {
                "label":
                    item["label"],

                "impact":
                    item["shapValue"],

                "reason":
                    item["reason"]
            }

            for item
            in negative_impacts
        ]
    }