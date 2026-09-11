import pandas as pd
import numpy as np
import joblib

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from xgboost import XGBRegressor


# ============================================================
# FILES
# ============================================================

INPUT_FILE = "solarflux_ml_features.csv"

RESULT_FILE = "solarflux_model_results.csv"

BEST_MODEL_FILE = "solarflux_best_model.joblib"


# ============================================================
# LOAD DATA
# ============================================================

print("Loading ML dataset...")

df = pd.read_csv(INPUT_FILE)

df["date"] = pd.to_datetime(
    df["date"],
    errors="coerce"
)

print(f"Rows loaded: {len(df)}")


# ============================================================
# FEATURES
# ============================================================

FEATURES = [

    "latitude",
    "longitude",

    "avg_temperature_c",
    "avg_humidity_pct",
    "avg_cloud_cover_pct",
    "avg_wind_speed_kmh",

    "avg_shortwave_radiation_wm2",
    "sunshine_hours",

    "month_sin",
    "month_cos",

    "day_of_year_sin",
    "day_of_year_cos",
]


TARGET = "solar_generation_kwh"


# ============================================================
# TIME-BASED TRAIN / TEST SPLIT
# ============================================================

train_df = df[
    df["year"] <= 2022
].copy()

test_df = df[
    df["year"] == 2023
].copy()


print()
print("=" * 60)

print("TRAIN / TEST SPLIT")

print("=" * 60)

print(
    f"Training rows: {len(train_df)}"
)

print(
    f"Testing rows: {len(test_df)}"
)


X_train = train_df[FEATURES]

y_train = train_df[TARGET]

X_test = test_df[FEATURES]

y_test = test_df[TARGET]


# ============================================================
# MODELS
# ============================================================

models = {

    "Linear Regression":
        LinearRegression(),

    "Random Forest":
        RandomForestRegressor(
            n_estimators=300,
            random_state=42,
            n_jobs=-1,
            max_depth=None
        ),

    "XGBoost":
        XGBRegressor(
            n_estimators=500,
            learning_rate=0.05,
            max_depth=6,

            subsample=0.9,

            colsample_bytree=0.9,

            random_state=42,

            objective="reg:squarederror",

            n_jobs=-1
        )
}


# ============================================================
# TRAIN MODELS
# ============================================================

results = []

trained_models = {}


print()
print("=" * 60)

print("MODEL TRAINING")

print("=" * 60)


for model_name, model in models.items():

    print()
    print(
        f"Training {model_name}..."
    )

    model.fit(
        X_train,
        y_train
    )


    predictions = model.predict(
        X_test
    )


    # --------------------------------------------------------
    # METRICS
    # --------------------------------------------------------

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


    results.append({

        "model": model_name,

        "mae": mae,

        "rmse": rmse,

        "r2": r2
    })


    trained_models[
        model_name
    ] = model


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
# MODEL COMPARISON
# ============================================================

results_df = pd.DataFrame(
    results
)


results_df = results_df.sort_values(
    by="rmse",
    ascending=True
).reset_index(drop=True)


print()
print("=" * 60)

print("MODEL COMPARISON")

print("=" * 60)

print(
    results_df.to_string(
        index=False
    )
)


# ============================================================
# SAVE RESULTS
# ============================================================

results_df.to_csv(
    RESULT_FILE,
    index=False
)


# ============================================================
# SELECT BEST MODEL
# ============================================================

best_model_name = (
    results_df.iloc[0]["model"]
)


best_model = trained_models[
    best_model_name
]


joblib.dump(
    {
        "model": best_model,

        "model_name":
            best_model_name,

        "features":
            FEATURES
    },

    BEST_MODEL_FILE
)


# ============================================================
# FINAL OUTPUT
# ============================================================

print()
print("=" * 60)

print("BEST MODEL")

print("=" * 60)

print(
    f"Selected model: "
    f"{best_model_name}"
)

print(
    f"Saved as: "
    f"{BEST_MODEL_FILE}"
)

print(
    f"Metrics saved as: "
    f"{RESULT_FILE}"
)