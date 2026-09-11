import pandas as pd
import numpy as np


# ============================================================
# FILES
# ============================================================

INPUT_FILE = "solarflux_final_daily_ml_dataset.csv"

OUTPUT_FILE = "solarflux_ml_features.csv"


# ============================================================
# LOAD DATASET
# ============================================================

print("Loading final daily ML dataset...")

df = pd.read_csv(INPUT_FILE)

print(f"Rows loaded: {len(df)}")
print(f"Columns loaded: {len(df.columns)}")


# ============================================================
# TARGET
# ============================================================

TARGET = "solar_generation_kwh"


# ============================================================
# BASIC CHECK
# ============================================================

if TARGET not in df.columns:
    raise ValueError(
        f"Target column '{TARGET}' not found."
    )


# ============================================================
# CONVERT DATE
# ============================================================

df["date"] = pd.to_datetime(
    df["date"],
    errors="coerce"
)

if df["date"].isna().any():
    raise ValueError(
        "Some dates could not be parsed."
    )


# ============================================================
# TIME FEATURES
# ============================================================

# Day number inside the year:
# Jan 1 = 1
# Dec 31 = 365/366

df["day_of_year"] = (
    df["date"]
    .dt.dayofyear
)


# ============================================================
# CYCLICAL MONTH FEATURES
# ============================================================

# Month is cyclical:
# December and January should be close to each other.
#
# Therefore:
# month_sin
# month_cos

df["month_sin"] = np.sin(
    2 * np.pi * df["month"] / 12
)

df["month_cos"] = np.cos(
    2 * np.pi * df["month"] / 12
)


# ============================================================
# CYCLICAL DAY-OF-YEAR FEATURES
# ============================================================

df["day_of_year_sin"] = np.sin(
    2 * np.pi * df["day_of_year"] / 365.25
)

df["day_of_year_cos"] = np.cos(
    2 * np.pi * df["day_of_year"] / 365.25
)


# ============================================================
# SELECT FINAL MODEL FEATURES
# ============================================================

# Important:
#
# We intentionally DO NOT use:
#
# avg_pv_power_w
# avg_direct_radiation_wm2
# avg_diffuse_radiation_wm2
# avg_dni_wm2
#
# avg_pv_power_w would cause target leakage.
#
# Other radiation variables are currently excluded
# so training inputs stay close to what SolarFlux
# can obtain from its live forecast API.


FEATURE_COLUMNS = [

    # Location
    "latitude",
    "longitude",

    # Weather
    "avg_temperature_c",
    "avg_humidity_pct",
    "avg_cloud_cover_pct",
    "avg_wind_speed_kmh",

    # Main solar irradiance feature
    "avg_shortwave_radiation_wm2",

    # Sunlight
    "sunshine_hours",

    # Calendar / seasonal features
    "month_sin",
    "month_cos",
    "day_of_year_sin",
    "day_of_year_cos",
]


# ============================================================
# VERIFY FEATURES
# ============================================================

missing_features = [
    column
    for column in FEATURE_COLUMNS
    if column not in df.columns
]

if missing_features:
    raise ValueError(
        f"Missing feature columns: {missing_features}"
    )


# ============================================================
# CREATE ML DATASET
# ============================================================

# Keep city/date as metadata.
# They will NOT be passed directly into the ML model.

final_columns = [
    "city",
    "date",
    "year",
    "month",
    "day",
] + FEATURE_COLUMNS + [TARGET]


ml_df = df[
    final_columns
].copy()


# ============================================================
# REMOVE INVALID ROWS
# ============================================================

before_rows = len(ml_df)

ml_df = ml_df.dropna()

after_rows = len(ml_df)

removed_rows = before_rows - after_rows


# ============================================================
# REMOVE DUPLICATES
# ============================================================

duplicates = ml_df.duplicated().sum()

if duplicates > 0:
    ml_df = ml_df.drop_duplicates()


# ============================================================
# SORT DATA
# ============================================================

ml_df = ml_df.sort_values(
    by=[
        "date",
        "city"
    ]
).reset_index(drop=True)


# ============================================================
# ROUND GENERATED FEATURES
# ============================================================

cyclic_columns = [
    "month_sin",
    "month_cos",
    "day_of_year_sin",
    "day_of_year_cos",
]

ml_df[cyclic_columns] = (
    ml_df[cyclic_columns]
    .round(6)
)


# ============================================================
# SAVE
# ============================================================

ml_df.to_csv(
    OUTPUT_FILE,
    index=False
)


# ============================================================
# SUMMARY
# ============================================================

print()
print("=" * 60)

print("SolarFlux feature engineering complete")

print("=" * 60)

print(f"Original rows: {before_rows}")

print(
    f"Rows removed because of missing values: "
    f"{removed_rows}"
)

print(
    f"Duplicate rows found: "
    f"{duplicates}"
)

print(
    f"Final rows: "
    f"{len(ml_df)}"
)

print()

print(
    f"Number of ML features: "
    f"{len(FEATURE_COLUMNS)}"
)

print()

print("Final ML features:")

for feature in FEATURE_COLUMNS:
    print(f" - {feature}")

print()

print(
    f"Target: {TARGET}"
)

print()

print(
    f"Saved as: {OUTPUT_FILE}"
)

print()

print(
    "City and date are retained only as metadata."
)

print(
    "They will not be directly passed into the model."
)

print()

print(
    "avg_pv_power_w was excluded to prevent target leakage."
)