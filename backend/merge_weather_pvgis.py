import pandas as pd


WEATHER_FILE = "solarflux_india_historical_weather_2020_2023.csv"
PVGIS_FILE = "solarflux_pvgis_generation_2020_2023.csv"

OUTPUT_HOURLY = "solarflux_final_hourly_ml_dataset.csv"
OUTPUT_DAILY = "solarflux_final_daily_ml_dataset.csv"


print("Loading Open-Meteo weather data...")
weather_df = pd.read_csv(WEATHER_FILE)

print("Loading PVGIS solar generation data...")
pvgis_df = pd.read_csv(PVGIS_FILE)


# ============================================================
# NORMALIZE TIMESTAMPS
# ============================================================

print("Normalizing timestamps...")


# Open-Meteo:
# 2020-01-01T00:00
weather_df["normalized_time"] = pd.to_datetime(
    weather_df["date_time"],
    errors="coerce"
)


# PVGIS:
# 20200101:0010
pvgis_df["normalized_time"] = pd.to_datetime(
    pvgis_df["date_time"],
    format="%Y%m%d:%H%M",
    errors="coerce"
)


# ============================================================
# ROUND PVGIS TO NEAREST HOUR
# ============================================================

# PVGIS timestamps may contain :10 minute offsets,
# while Open-Meteo uses exact hourly timestamps.
#
# Example:
#
# PVGIS      2020-01-01 00:10
# OpenMeteo  2020-01-01 00:00
#
# We normalize both to hourly resolution.

pvgis_df["normalized_time"] = (
    pvgis_df["normalized_time"]
    .dt.floor("h")
)


weather_df["normalized_time"] = (
    weather_df["normalized_time"]
    .dt.floor("h")
)


# ============================================================
# CHECK TIMESTAMP PARSING
# ============================================================

weather_invalid = (
    weather_df["normalized_time"]
    .isna()
    .sum()
)

pvgis_invalid = (
    pvgis_df["normalized_time"]
    .isna()
    .sum()
)

print()
print(f"Invalid weather timestamps: {weather_invalid}")
print(f"Invalid PVGIS timestamps: {pvgis_invalid}")


# ============================================================
# SELECT PVGIS TARGET COLUMNS
# ============================================================

pvgis_target = pvgis_df[
    [
        "city",
        "normalized_time",
        "pv_power_w",
        "solar_generation_kwh",
    ]
].copy()


# ============================================================
# MERGE
# ============================================================

print()
print("Merging weather + PVGIS data...")


merged_df = pd.merge(
    weather_df,
    pvgis_target,
    on=[
        "city",
        "normalized_time"
    ],
    how="inner"
)


print(f"Merged hourly rows: {len(merged_df)}")


# ============================================================
# CLEAN DUPLICATE / UNUSED COLUMNS
# ============================================================

columns_to_drop = [
    "normalized_time",
]

merged_df.drop(
    columns=columns_to_drop,
    inplace=True
)


# ============================================================
# SAVE HOURLY DATASET
# ============================================================

merged_df.to_csv(
    OUTPUT_HOURLY,
    index=False
)


print(
    f"Hourly ML dataset saved as: {OUTPUT_HOURLY}"
)


# ============================================================
# DAILY AGGREGATION
# ============================================================

print()
print("Creating daily ML dataset...")


daily_df = (
    merged_df
    .groupby(
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

        "pv_power_w":
            "mean",

        "solar_generation_kwh":
            "sum"
    })
)


# ============================================================
# SUNSHINE HOURS
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
            "avg_dni_wm2",

        "pv_power_w":
            "avg_pv_power_w"
    },
    inplace=True
)


# ============================================================
# ROUND VALUES
# ============================================================

numeric_columns = [
    "avg_temperature_c",
    "avg_humidity_pct",
    "avg_cloud_cover_pct",
    "avg_wind_speed_kmh",
    "avg_shortwave_radiation_wm2",
    "avg_direct_radiation_wm2",
    "avg_diffuse_radiation_wm2",
    "avg_dni_wm2",
    "avg_pv_power_w",
    "solar_generation_kwh",
    "sunshine_hours",
]


daily_df[numeric_columns] = (
    daily_df[numeric_columns]
    .round(3)
)


# ============================================================
# SAVE DAILY DATASET
# ============================================================

daily_df.to_csv(
    OUTPUT_DAILY,
    index=False
)


print(
    f"Daily ML rows: {len(daily_df)}"
)

print(
    f"Daily ML dataset saved as: {OUTPUT_DAILY}"
)


# ============================================================
# FINAL SUMMARY
# ============================================================

print()
print("=" * 60)

print(
    "SolarFlux weather + PVGIS merge complete"
)

print("=" * 60)

print(
    f"Hourly rows: {len(merged_df)}"
)

print(
    f"Daily rows: {len(daily_df)}"
)

print()

print(
    "ML Target:"
)

print(
    "solar_generation_kwh"
)

print()

print(
    "This target comes from the PVGIS "
    "photovoltaic performance model."
)