import pandas as pd
import numpy as np
import joblib

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


# ============================================================
# FILES
# ============================================================

DATA_FILE = "solarflux_ml_features.csv"
MODEL_FILE = "solarflux_best_model.joblib"

PREDICTION_FILE = "solarflux_2023_test_predictions.csv"


# ============================================================
# LOAD DATA + MODEL
# ============================================================

print("Loading ML dataset...")

df = pd.read_csv(DATA_FILE)

df["date"] = pd.to_datetime(
    df["date"],
    errors="coerce"
)


print("Loading trained model...")

model_bundle = joblib.load(
    MODEL_FILE
)

model = model_bundle["model"]
model_name = model_bundle["model_name"]
features = model_bundle["features"]


TARGET = "solar_generation_kwh"


print(
    f"Model loaded: {model_name}"
)


# ============================================================
# 2023 TEST SET
# ============================================================

test_df = df[
    df["year"] == 2023
].copy()


X_test = test_df[features]
y_test = test_df[TARGET]


print(
    f"Testing rows: {len(test_df)}"
)


# ============================================================
# PREDICT
# ============================================================

predictions = model.predict(
    X_test
)


# Prevent impossible negative predictions
predictions = np.clip(
    predictions,
    0,
    None
)


test_df[
    "predicted_solar_generation_kwh"
] = predictions


test_df[
    "prediction_error_kwh"
] = (
    test_df[
        "predicted_solar_generation_kwh"
    ]
    -
    test_df[
        TARGET
    ]
)


test_df[
    "absolute_error_kwh"
] = (
    test_df[
        "prediction_error_kwh"
    ]
    .abs()
)


# ============================================================
# GLOBAL METRICS
# ============================================================

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

r2 = r2_score(
    y_test,
    predictions
)


print()
print("=" * 60)
print("FINAL MODEL VALIDATION")
print("=" * 60)

print(
    f"MAE  : {mae:.4f} kWh"
)

print(
    f"RMSE : {rmse:.4f} kWh"
)

print(
    f"R²   : {r2:.4f}"
)


# ============================================================
# CITY-WISE PERFORMANCE
# ============================================================

print()
print("=" * 60)
print("CITY-WISE PERFORMANCE")
print("=" * 60)


city_results = []


for city in sorted(
    test_df["city"].unique()
):

    city_df = test_df[
        test_df["city"] == city
    ]

    city_actual = city_df[TARGET]

    city_predicted = city_df[
        "predicted_solar_generation_kwh"
    ]


    city_mae = mean_absolute_error(
        city_actual,
        city_predicted
    )


    city_rmse = np.sqrt(
        mean_squared_error(
            city_actual,
            city_predicted
        )
    )


    city_r2 = r2_score(
        city_actual,
        city_predicted
    )


    city_results.append({
        "city": city,
        "mae": city_mae,
        "rmse": city_rmse,
        "r2": city_r2
    })


city_results_df = pd.DataFrame(
    city_results
)


print(
    city_results_df
    .round(4)
    .to_string(index=False)
)


# ============================================================
# WORST PREDICTIONS
# ============================================================

print()
print("=" * 60)
print("10 LARGEST PREDICTION ERRORS")
print("=" * 60)


worst_predictions = (
    test_df
    .sort_values(
        "absolute_error_kwh",
        ascending=False
    )
    [
        [
            "city",
            "date",
            TARGET,
            "predicted_solar_generation_kwh",
            "absolute_error_kwh"
        ]
    ]
    .head(10)
)


worst_predictions_display = worst_predictions.copy()

numeric_cols = [
    "solar_generation_kwh",
    "predicted_solar_generation_kwh",
    "absolute_error_kwh"
]

worst_predictions_display[numeric_cols] = (
    worst_predictions_display[numeric_cols]
    .round(3)
)

print(
    worst_predictions_display.to_string(
        index=False
    )
)
# ============================================================
# TARGET / PREDICTION RANGE
# ============================================================

print()
print("=" * 60)
print("PREDICTION RANGE")
print("=" * 60)

print(
    f"Actual minimum: "
    f"{y_test.min():.3f} kWh"
)

print(
    f"Actual maximum: "
    f"{y_test.max():.3f} kWh"
)

print(
    f"Predicted minimum: "
    f"{predictions.min():.3f} kWh"
)

print(
    f"Predicted maximum: "
    f"{predictions.max():.3f} kWh"
)


# ============================================================
# SAVE TEST RESULTS
# ============================================================

test_df[
    [
        "city",
        "date",
        TARGET,
        "predicted_solar_generation_kwh",
        "prediction_error_kwh",
        "absolute_error_kwh"
    ]
].to_csv(
    PREDICTION_FILE,
    index=False
)


print()
print(
    f"Predictions saved as: "
    f"{PREDICTION_FILE}"
)

print()

print("=" * 60)
print("FINAL MODEL CHECK COMPLETE")
print("=" * 60)