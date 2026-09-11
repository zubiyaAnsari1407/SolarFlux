import pandas as pd
import joblib

from sklearn.ensemble import IsolationForest


# ============================================================
# FILES
# ============================================================

INPUT_FILE = "solarflux_final_hourly_ml_dataset.csv"

MODEL_FILE = "solarflux_anomaly_detector.joblib"


# ============================================================
# LOAD DATA
# ============================================================

print("Loading hourly solar dataset...")

df = pd.read_csv(
    INPUT_FILE
)

print(f"Rows loaded: {len(df)}")


# ============================================================
# ANOMALY FEATURES
# ============================================================

FEATURES = [
    "temperature_2m_c",
    "relative_humidity_2m_pct",
    "cloud_cover_pct",
    "wind_speed_10m_kmh",
    "shortwave_radiation_wm2",
    "solar_generation_kwh",
]


# ============================================================
# CHECK COLUMNS
# ============================================================

missing = [
    column
    for column in FEATURES
    if column not in df.columns
]

if missing:
    raise ValueError(
        f"Missing columns: {missing}"
    )


# ============================================================
# CLEAN DATA
# ============================================================

training_df = (
    df[FEATURES]
    .copy()
)


training_df = (
    training_df
    .apply(
        pd.to_numeric,
        errors="coerce"
    )
)


training_df = (
    training_df
    .dropna()
)


# ============================================================
# REMOVE NIGHT HOURS
# ============================================================

# At night solar generation is naturally zero,
# so keeping all night rows can make anomaly
# detection less useful.

training_df = training_df[
    training_df[
        "shortwave_radiation_wm2"
    ] > 20
].copy()


print(
    f"Training rows after cleaning: "
    f"{len(training_df)}"
)


# ============================================================
# TRAIN ISOLATION FOREST
# ============================================================

print()
print("Training Isolation Forest...")


model = IsolationForest(

    n_estimators=300,

    # Approx expected abnormal fraction.
    # This does NOT mean every future dataset
    # must contain exactly 2% anomalies.
    contamination=0.02,

    random_state=42,

    n_jobs=-1
)


model.fit(
    training_df[FEATURES]
)


# ============================================================
# TRAINING-SAMPLE CHECK
# ============================================================

predictions = model.predict(
    training_df[FEATURES]
)


training_df[
    "anomaly_prediction"
] = predictions


anomaly_count = (
    training_df[
        "anomaly_prediction"
    ] == -1
).sum()


anomaly_percentage = (
    anomaly_count
    / len(training_df)
) * 100


print()
print("=" * 60)
print("ANOMALY MODEL TRAINING COMPLETE")
print("=" * 60)

print(
    f"Detected training anomalies: "
    f"{anomaly_count}"
)

print(
    f"Training anomaly percentage: "
    f"{anomaly_percentage:.2f}%"
)


# ============================================================
# SAVE MODEL
# ============================================================

joblib.dump(
    {
        "model": model,
        "features": FEATURES
    },
    MODEL_FILE
)


print(
    f"Saved as: {MODEL_FILE}"
)