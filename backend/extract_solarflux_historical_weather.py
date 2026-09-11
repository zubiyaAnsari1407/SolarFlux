import csv
import time
import requests
from datetime import datetime

API_URL = "https://archive-api.open-meteo.com/v1/archive"

START_DATE = "2020-01-01"
END_DATE = "2023-12-31"

OUTPUT_FILE = "solarflux_india_historical_weather_2020_2023.csv"

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

HOURLY_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "cloud_cover",
    "wind_speed_10m",
    "shortwave_radiation",
    "direct_radiation",
    "diffuse_radiation",
    "direct_normal_irradiance",
    "sunshine_duration",
    "is_day",
]

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


def fetch_city_data(city_data):

    city = city_data["city"]
    latitude = city_data["latitude"]
    longitude = city_data["longitude"]

    print(f"Fetching {city}...")

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": START_DATE,
        "end_date": END_DATE,
        "hourly": ",".join(HOURLY_VARIABLES),
        "timezone": "Asia/Kolkata",
        "models": "era5",
    }

    max_retries = 5

    for attempt in range(max_retries):

        try:
            response = requests.get(
                API_URL,
                params=params,
                timeout=120
            )

            if response.status_code == 200:
                return response.json()

            if response.status_code == 429:

                wait_time = 15 * (attempt + 1)

                print(
                    f"Rate limit hit for {city}. "
                    f"Waiting {wait_time} seconds..."
                )

                time.sleep(wait_time)
                continue

            response.raise_for_status()

        except requests.exceptions.RequestException as error:

            if attempt == max_retries - 1:
                raise error

            wait_time = 10 * (attempt + 1)

            print(
                f"Request error for {city}: {error}"
            )

            print(
                f"Retrying in {wait_time} seconds..."
            )

            time.sleep(wait_time)

    raise Exception(
        f"Failed to fetch {city} "
        f"after {max_retries} retries."
    )


with open(
    OUTPUT_FILE,
    "w",
    newline="",
    encoding="utf-8"
) as file:

    writer = csv.writer(file)
    writer.writerow(HEADERS)

    total_rows = 0

    for city_data in CITIES:

        data = fetch_city_data(city_data)

        hourly = data["hourly"]
        times = hourly["time"]

        for i, time_string in enumerate(times):

            dt = datetime.fromisoformat(
                time_string
            )

            writer.writerow([
                city_data["city"],
                city_data["latitude"],
                city_data["longitude"],
                time_string,
                dt.date().isoformat(),
                dt.year,
                dt.month,
                dt.day,
                dt.hour,
                hourly["temperature_2m"][i],
                hourly["relative_humidity_2m"][i],
                hourly["cloud_cover"][i],
                hourly["wind_speed_10m"][i],
                hourly["shortwave_radiation"][i],
                hourly["direct_radiation"][i],
                hourly["diffuse_radiation"][i],
                hourly["direct_normal_irradiance"][i],
                hourly["sunshine_duration"][i],
                hourly["is_day"][i],
            ])

            total_rows += 1

        print(
            f"{city_data['city']} complete "
            f"({len(times)} rows)"
        )

        # Small pause between cities
        # to avoid Open-Meteo rate limiting
        time.sleep(5)


print()
print("=" * 60)

print(
    "Historical dataset created successfully."
)

print("=" * 60)

print(
    f"Total rows: {total_rows}"
)

print(
    f"Saved as: {OUTPUT_FILE}"
)