import pandas as pd


FILE = "solarflux_daily_ml_dataset.csv"

print("Loading dataset...")

df = pd.read_csv(FILE)

print()
print("=" * 60)
print("BASIC DATASET INFO")
print("=" * 60)

print(f"Rows: {len(df)}")
print(f"Columns: {len(df.columns)}")

print()
print("Columns:")
print(df.columns.tolist())


# ============================================================
# MISSING VALUES
# ============================================================

print()
print("=" * 60)
print("MISSING VALUES")
print("=" * 60)

missing = df.isnull().sum()

print(missing[missing > 0])

if missing.sum() == 0:
    print("No missing values found.")


# ============================================================
# DUPLICATES
# ============================================================

print()
print("=" * 60)
print("DUPLICATES")
print("=" * 60)

duplicates = df.duplicated().sum()

print(f"Duplicate rows: {duplicates}")


# ============================================================
# CITY DISTRIBUTION
# ============================================================

print()
print("=" * 60)
print("CITY DISTRIBUTION")
print("=" * 60)

print(
    df["city"]
    .value_counts()
    .sort_index()
)


# ============================================================
# NUMERIC SUMMARY
# ============================================================

print()
print("=" * 60)
print("NUMERIC SUMMARY")
print("=" * 60)

numeric_columns = [
    "avg_temperature_c",
    "avg_humidity_pct",
    "avg_cloud_cover_pct",
    "avg_wind_speed_kmh",
    "avg_shortwave_radiation_wm2",
    "avg_direct_radiation_wm2",
    "avg_diffuse_radiation_wm2",
    "avg_dni_wm2",
    "sunshine_hours",
    "estimated_solar_generation_kwh",
]

print(
    df[numeric_columns]
    .describe()
    .round(3)
)


# ============================================================
# INVALID VALUE CHECKS
# ============================================================

print()
print("=" * 60)
print("INVALID VALUE CHECKS")
print("=" * 60)

checks = {
    "humidity below 0":
        (df["avg_humidity_pct"] < 0).sum(),

    "humidity above 100":
        (df["avg_humidity_pct"] > 100).sum(),

    "cloud cover below 0":
        (df["avg_cloud_cover_pct"] < 0).sum(),

    "cloud cover above 100":
        (df["avg_cloud_cover_pct"] > 100).sum(),

    "negative wind speed":
        (df["avg_wind_speed_kmh"] < 0).sum(),

    "negative solar radiation":
        (df["avg_shortwave_radiation_wm2"] < 0).sum(),

    "negative sunshine hours":
        (df["sunshine_hours"] < 0).sum(),

    "sunshine above 24 hours":
        (df["sunshine_hours"] > 24).sum(),

    "negative solar generation":
        (df["estimated_solar_generation_kwh"] < 0).sum(),
}

for name, count in checks.items():
    print(f"{name}: {count}")


# ============================================================
# TARGET SUMMARY
# ============================================================

print()
print("=" * 60)
print("TARGET SUMMARY")
print("=" * 60)

target = "estimated_solar_generation_kwh"

print(
    df[target]
    .describe()
    .round(3)
)


# ============================================================
# CITY-WISE TARGET
# ============================================================

print()
print("=" * 60)
print("CITY-WISE AVERAGE SOLAR GENERATION")
print("=" * 60)

city_target = (
    df.groupby("city")[target]
    .mean()
    .sort_values(ascending=False)
)

print(
    city_target.round(3)
)


# ============================================================
# FINAL STATUS
# ============================================================

print()
print("=" * 60)
print("VALIDATION COMPLETE")
print("=" * 60)