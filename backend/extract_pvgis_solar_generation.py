import csv
import time
import requests
from datetime import datetime


# ============================================================
# PVGIS API
# ============================================================

API_URL = "https://re.jrc.ec.europa.eu/api/v5_3/seriescalc"

START_YEAR = 2020
END_YEAR = 2023

OUTPUT_FILE = "solarflux_pvgis_generation_2020_2023.csv"


# ============================================================
# REFERENCE PV SYSTEM
# ============================================================

# Same standardized residential system for every city
PEAK_POWER_KW = 5.0

# PVGIS system losses percentage
SYSTEM_LOSS_PERCENT = 14

# Crystalline silicon panels
PV_TECHNOLOGY = "crystSi"

# Free-standing mounting
MOUNTING_PLACE = "free"


# ============================================================
# CITIES
# ============================================================

CITIES = [
    {
        "city": "Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777
    },
    {
        "city": "Pune",
        "latitude": 18.5204,
        "longitude": 73.8567
    },
    {
        "city": "Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090
    },
    {
        "city": "Jaipur",
        "latitude": 26.9124,
        "longitude": 75.7873
    },
    {
        "city": "Bengaluru",
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    {
        "city": "Hyderabad",
        "latitude": 17.3850,
        "longitude": 78.4867
    },
    {
        "city": "Kolkata",
        "latitude": 22.5726,
        "longitude": 88.3639
    },
    {
        "city": "Chennai",
        "latitude": 13.0827,
        "longitude": 80.2707
    }
]


# ============================================================
# FETCH PVGIS DATA
# ============================================================

def fetch_city_pvgis(city_data):

    city = city_data["city"]
    latitude = city_data["latitude"]
    longitude = city_data["longitude"]

    print(f"Fetching PVGIS data for {city}...")

    params = {
        "lat": latitude,
        "lon": longitude,

        "startyear": START_YEAR,
        "endyear": END_YEAR,

        # Calculate photovoltaic production
        "pvcalculation": 1,

        "peakpower": PEAK_POWER_KW,

        "pvtechchoice": PV_TECHNOLOGY,

        "mountingplace": MOUNTING_PLACE,

        "loss": SYSTEM_LOSS_PERCENT,

        # Fixed solar installation
        "trackingtype": 0,

        # Let PVGIS choose optimum panel inclination
        # and orientation for the location
        "optimalangles": 1,

        # Satellite-based solar radiation dataset
        "raddatabase": "PVGIS-ERA5",

        # Request JSON
        "outputformat": "json"
    }

    response = requests.get(
        API_URL,
        params=params,
        timeout=180
    )

    if response.status_code != 200:

        print()
        print(f"PVGIS ERROR for {city}")
        print(f"Status Code: {response.status_code}")
        print(response.text[:1000])

        response.raise_for_status()

    return response.json()


# ============================================================
# PARSE PVGIS TIME
# ============================================================

def parse_pvgis_time(time_string):

    # PVGIS generally returns:
    # YYYYMMDD:HHMM
    #
    # Example:
    # 20200101:0010

    return datetime.strptime(
        time_string,
        "%Y%m%d:%H%M"
    )


# ============================================================
# CSV HEADERS
# ============================================================

HEADERS = [
    "city",
    "latitude",
    "longitude",

    "date_time",
    "date",

    "year",
    "month",
    "day",
    "hour",

    "pv_power_w",
    "solar_generation_kwh",

    "global_irradiance_wm2",
    "sun_height_deg",
    "air_temperature_c",
    "wind_speed_ms",
]


# ============================================================
# CREATE DATASET
# ============================================================

total_rows = 0


with open(
    OUTPUT_FILE,
    "w",
    newline="",
    encoding="utf-8"
) as file:

    writer = csv.writer(file)

    writer.writerow(HEADERS)


    for city_data in CITIES:

        data = fetch_city_pvgis(
            city_data
        )


        hourly_data = (
            data
            .get("outputs", {})
            .get("hourly", [])
        )


        if not hourly_data:

            raise ValueError(
                f"No hourly PVGIS data returned "
                f"for {city_data['city']}."
            )


        for row in hourly_data:

            dt = parse_pvgis_time(
                row["time"]
            )


            # ------------------------------------------------
            # PVGIS P value
            # ------------------------------------------------
            #
            # P = PV system power in watts
            #
            # Since each row represents approximately
            # one hourly interval:
            #
            # Wh = W × 1 hour
            #
            # kWh = W / 1000
            # ------------------------------------------------

            pv_power_w = float(
                row.get("P", 0) or 0
            )

            solar_generation_kwh = (
                pv_power_w / 1000
            )


            # PVGIS additional outputs
            global_irradiance = float(
                row.get("G(i)", 0) or 0
            )

            sun_height = float(
                row.get("H_sun", 0) or 0
            )

            air_temperature = float(
                row.get("T2m", 0) or 0
            )

            wind_speed = float(
                row.get("WS10m", 0) or 0
            )


            writer.writerow([

                city_data["city"],

                city_data["latitude"],
                city_data["longitude"],

                row["time"],

                dt.date().isoformat(),

                dt.year,
                dt.month,
                dt.day,
                dt.hour,

                round(
                    pv_power_w,
                    3
                ),

                round(
                    solar_generation_kwh,
                    5
                ),

                round(
                    global_irradiance,
                    3
                ),

                round(
                    sun_height,
                    3
                ),

                round(
                    air_temperature,
                    3
                ),

                round(
                    wind_speed,
                    3
                ),
            ])


            total_rows += 1


        print(
            f"{city_data['city']} complete "
            f"({len(hourly_data)} rows)"
        )


        # Small pause to be polite to API
        time.sleep(1)


# ============================================================
# DONE
# ============================================================

print()
print("=" * 60)

print(
    "PVGIS solar generation extraction complete"
)

print("=" * 60)

print(
    f"Total rows: {total_rows}"
)

print(
    f"Saved as: {OUTPUT_FILE}"
)

print()

print(
    f"PV system size: "
    f"{PEAK_POWER_KW} kWp"
)

print(
    f"System losses: "
    f"{SYSTEM_LOSS_PERCENT}%"
)

print(
    f"Period: "
    f"{START_YEAR}-{END_YEAR}"
)

print()

print(
    "This target is generated using the "
    "PVGIS photovoltaic performance model."
)