import pandas as pd


# ============================================================
# FILES
# ============================================================

INPUT_FILE = (
    "solarflux_india_historical_weather_2023_2025.csv"
)

HOURLY_OUTPUT_FILE = (
    "solarflux_hourly_with_solar_target.csv"
)

DAILY_OUTPUT_FILE = (
    "solarflux_daily_ml_dataset.csv"
)


# ============================================================
# REFERENCE SOLAR SYSTEM
# ============================================================

# Standard reference residential solar system
SYSTEM_CAPACITY_KW = 5.0

# Performance Ratio accounts for approximate losses such as:
# inverter loss, temperature loss, wiring loss, dust, etc.
PERFORMANCE_RATIO = 0.80


# ============================================================
# LOAD HISTORICAL WEATHER DATA
# ============================================================

print("Loading historical weather dataset...")

df = pd.read_csv(INPUT_FILE)

print(f"Rows loaded: {len(df)}")


# ============================================================
# CLEAN REQUIRED COLUMNS
# ============================================================

required_columns = [
    "city",
    "latitude",
    "longitude",
    "date_time",
    "date",
    "year",
    "month",
    "day",
    "hour",
    "temperature_2m_c",
    "relative_humidity_2m_pct",
    "cloud_cover_pct",
    "wind_speed_10m_kmh",
    "shortwave_radiation_wm2",
    "direct_radiation_wm2",
    "diffuse_radiation_wm2",
    "direct_normal_irradiance_wm2",
    "sunshine_duration_seconds",
    "is_day",
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )


# ============================================================
# HANDLE MISSING VALUES
# ============================================================

numeric_columns = [
    "temperature_2m_c",
    "relative_humidity_2m_pct",
    "cloud_cover_pct",
    "wind_speed_10m_kmh",
    "shortwave_radiation_wm2",
    "direct_radiation_wm2",
    "diffuse_radiation_wm2",
    "direct_normal_irradiance_wm2",
    "sunshine_duration_seconds",
    "is_day",
]

df[numeric_columns] = (
    df[numeric_columns]
    .apply(pd.to_numeric, errors="coerce")
)

df[numeric_columns] = (
    df[numeric_columns]
    .fillna(0)
)


# ============================================================
# ESTIMATE HOURLY SOLAR GENERATION
# ============================================================

# Formula:
#
# Solar Energy (kWh)
# =
# System Capacity (kW)
# × Irradiance / 1000
# × Performance Ratio
# × 1 hour
#
# Example:
#
# 5 kW system
# GHI = 800 W/m²
#
# 5 × 0.8 × 0.80
# = 3.2 kWh during that hour


df["estimated_solar_generation_kwh"] = (

    SYSTEM_CAPACITY_KW
    *
    (
        df["shortwave_radiation_wm2"]
        / 1000
    )
    *
    PERFORMANCE_RATIO
)


# ============================================================
# NIGHT SAFETY
# ============================================================

df.loc[
    df["is_day"] == 0,
    "estimated_solar_generation_kwh"
] = 0


# No negative generation allowed
df["estimated_solar_generation_kwh"] = (
    df["estimated_solar_generation_kwh"]
    .clip(lower=0)
)


# Round for clean dataset
df["estimated_solar_generation_kwh"] = (
    df["estimated_solar_generation_kwh"]
    .round(4)
)


# ============================================================
# SAVE HOURLY LABELED DATASET
# ============================================================

df.to_csv(
    HOURLY_OUTPUT_FILE,
    index=False
)

print()
print("Hourly solar target created.")
print(
    f"Saved as: {HOURLY_OUTPUT_FILE}"
)


# ============================================================
# CREATE DAILY ML DATASET
# ============================================================

print()
print("Creating daily ML dataset...")


daily_df = (

    df.groupby(
        [
            "city",
            "latitude",
            "longitude",
            "date",
            "year",
            "month",
            "day"
        ],
        as_index=False
    )

    .agg({

        "temperature_2m_c":
            "mean",

        "relative_humidity_2m_pct":
            "mean",

        "cloud_cover_pct":
            "mean",

        "wind_speed_10m_kmh":
            "mean",

        "shortwave_radiation_wm2":
            "mean",

        "direct_radiation_wm2":
            "mean",

        "diffuse_radiation_wm2":
            "mean",

        "direct_normal_irradiance_wm2":
            "mean",

        "sunshine_duration_seconds":
            "sum",

        "estimated_solar_generation_kwh":
            "sum"
    })
)


# ============================================================
# CONVERT SUNSHINE TO HOURS
# ============================================================

daily_df["sunshine_hours"] = (

    daily_df[
        "sunshine_duration_seconds"
    ]
    / 3600
)


daily_df.drop(
    columns=[
        "sunshine_duration_seconds"
    ],
    inplace=True
)


# ============================================================
# RENAME DAILY FEATURES
# ============================================================

daily_df.rename(
    columns={

        "temperature_2m_c":
            "avg_temperature_c",

        "relative_humidity_2m_pct":
            "avg_humidity_pct",

        "cloud_cover_pct":
            "avg_cloud_cover_pct",

        "wind_speed_10m_kmh":
            "avg_wind_speed_kmh",

        "shortwave_radiation_wm2":
            "avg_shortwave_radiation_wm2",

        "direct_radiation_wm2":
            "avg_direct_radiation_wm2",

        "diffuse_radiation_wm2":
            "avg_diffuse_radiation_wm2",

        "direct_normal_irradiance_wm2":
            "avg_dni_wm2"
    },

    inplace=True
)


# ============================================================
# ROUND NUMERIC VALUES
# ============================================================

columns_to_round = [
    "avg_temperature_c",
    "avg_humidity_pct",
    "avg_cloud_cover_pct",
    "avg_wind_speed_kmh",
    "avg_shortwave_radiation_wm2",
    "avg_direct_radiation_wm2",
    "avg_diffuse_radiation_wm2",
    "avg_dni_wm2",
    "sunshine_hours",
    "estimated_solar_generation_kwh"
]


daily_df[
    columns_to_round
] = daily_df[
    columns_to_round
].round(3)


# ============================================================
# SAVE FINAL DAILY ML DATASET
# ============================================================

daily_df.to_csv(
    DAILY_OUTPUT_FILE,
    index=False
)


print(
    f"Daily rows created: {len(daily_df)}"
)

print(
    f"Saved as: {DAILY_OUTPUT_FILE}"
)


# ============================================================
# SUMMARY
# ============================================================

print()
print("=" * 60)

print(
    "SolarFlux ML dataset preparation complete"
)

print("=" * 60)

print(
    f"Reference solar system: "
    f"{SYSTEM_CAPACITY_KW} kW"
)

print(
    f"Performance ratio: "
    f"{PERFORMANCE_RATIO}"
)

print()

print(
    "IMPORTANT:"
)

print(
    "estimated_solar_generation_kwh "
    "is an engineering estimate, "
    "not measured panel output."
)

print(
    "Real ESP32/inverter generation data "
    "can replace this target later."
)