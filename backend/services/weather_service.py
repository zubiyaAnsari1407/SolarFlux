import os
import requests

from datetime import datetime
from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GEOAPIFY_API_KEY = os.getenv(
    "GEOAPIFY_API_KEY"
)


# ============================================================
# API URLS
# ============================================================

WEATHER_API_URL = (
    "https://api.open-meteo.com/v1/forecast"
)

REVERSE_GEOCODING_URL = (
    "https://nominatim.openstreetmap.org/reverse"
)

GEOAPIFY_GEOCODING_URL = (
    "https://api.geoapify.com/v1/geocode/search"
)


# ============================================================
# FORMAT TIME
# ============================================================

def format_time_12_hour(time_string):

    if not time_string:
        return None

    time_part = time_string[11:16]

    parsed_time = datetime.strptime(
        time_part,
        "%H:%M"
    )

    return parsed_time.strftime(
        "%I:%M %p"
    )


# ============================================================
# MANUAL LOCATION → LATITUDE / LONGITUDE
# ============================================================

def get_coordinates(location):

    location = location.strip()

    if not location:
        raise ValueError(
            "Location cannot be empty."
        )

    if not GEOAPIFY_API_KEY:
        raise ValueError(
            "Geoapify API key is missing."
        )


    params = {

        "text":
            location,

        "format":
            "json",

        "lang":
            "en",

        "limit":
            5,

        "filter":
            "countrycode:in",

        "apiKey":
            GEOAPIFY_API_KEY
    }


    response = requests.get(
        GEOAPIFY_GEOCODING_URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    results = data.get(
        "results",
        []
    )


    if not results:

        raise ValueError(
            f"Location '{location}' could not be verified."
        )


    place = results[0]


    latitude = place.get(
        "lat"
    )

    longitude = place.get(
        "lon"
    )


    if (
        latitude is None
        or longitude is None
    ):

        raise ValueError(
            "Valid coordinates could not be found."
        )


    area = (
        place.get("suburb")
        or place.get("district")
        or place.get("name")
    )


    city = (
        place.get("city")
        or place.get("county")
    )


    state = place.get(
        "state",
        ""
    )


    country = place.get(
        "country",
        ""
    )


    location_parts = []


    for part in [
        area,
        city,
        state,
        country
    ]:

        if (
            part
            and part not in location_parts
        ):

            location_parts.append(
                part
            )


    display_name = ", ".join(
        location_parts
    )


    if not display_name:

        display_name = place.get(
            "formatted",
            location
        )


    return {

        "latitude":
            latitude,

        "longitude":
            longitude,

        "name":
            display_name,

        "country":
            "",

        "admin1":
            "",

        "timezone":
            "auto"
    }


# ============================================================
# GPS → READABLE LOCATION
# ============================================================

def reverse_geocode_coordinates(
    latitude,
    longitude
):

    params = {

        "lat":
            latitude,

        "lon":
            longitude,

        "format":
            "jsonv2",

        "zoom":
            14,

        "addressdetails":
            1
    }


    headers = {

        "User-Agent":
            "SolarFlux-Smart-Solar-Monitoring/1.0"
    }


    response = requests.get(
        REVERSE_GEOCODING_URL,
        params=params,
        headers=headers,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    address = data.get(
        "address",
        {}
    )


    area = (
        address.get("suburb")
        or address.get("neighbourhood")
        or address.get("city_district")
        or address.get("quarter")
        or address.get("borough")
    )


    city = (
        address.get("city")
        or address.get("town")
        or address.get("municipality")
        or address.get("village")
    )


    state = address.get(
        "state",
        ""
    )


    country = address.get(
        "country",
        ""
    )


    location_parts = []


    for part in [
        area,
        city,
        state,
        country
    ]:

        if (
            part
            and part not in location_parts
        ):

            location_parts.append(
                part
            )


    display_name = ", ".join(
        location_parts
    )


    if not display_name:

        display_name = data.get(
            "display_name",
            "Current Location"
        )


    return {

        "latitude":
            latitude,

        "longitude":
            longitude,

        "name":
            display_name,

        "country":
            "",

        "admin1":
            "",

        "timezone":
            "auto"
    }


# ============================================================
# WEATHER CODE → CONDITION
# ============================================================

def get_weather_condition(code):

    weather_codes = {

        0:
            "Clear Sky",

        1:
            "Mostly Clear",

        2:
            "Partly Cloudy",

        3:
            "Cloudy",

        45:
            "Foggy",

        48:
            "Foggy",

        51:
            "Light Drizzle",

        53:
            "Drizzle",

        55:
            "Heavy Drizzle",

        61:
            "Light Rain",

        63:
            "Rain",

        65:
            "Heavy Rain",

        80:
            "Light Rain Showers",

        81:
            "Rain Showers",

        82:
            "Heavy Rain Showers",

        95:
            "Thunderstorm",

        96:
            "Thunderstorm",

        99:
            "Severe Thunderstorm"
    }


    return weather_codes.get(
        code,
        "Unknown"
    )


# ============================================================
# FETCH WEATHER
# ============================================================

def fetch_weather(
    location=None,
    latitude=None,
    longitude=None
):

    # GPS
    if (
        latitude is not None
        and longitude is not None
    ):

        location_data = (
            reverse_geocode_coordinates(
                latitude,
                longitude
            )
        )


    # MANUAL LOCATION
    elif location:

        location = location.strip()


        if len(location) < 2:

            raise ValueError(
                "Please enter a valid location."
            )


        location_data = (
            get_coordinates(
                location
            )
        )


    else:

        raise ValueError(
            "Provide either a location or GPS coordinates."
        )


    latitude_value = (
        location_data[
            "latitude"
        ]
    )


    longitude_value = (
        location_data[
            "longitude"
        ]
    )


    timezone = (
        location_data[
            "timezone"
        ]
    )


    params = {

        "latitude":
            latitude_value,

        "longitude":
            longitude_value,


        "current": [

            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "cloud_cover",
            "wind_speed_10m",
            "weather_code"
        ],


        "hourly": [

            "temperature_2m",
            "relative_humidity_2m",
            "cloud_cover",
            "wind_speed_10m",
            "precipitation_probability",
            "shortwave_radiation",
            "weather_code"
        ],


        "daily": [

            "temperature_2m_max",
            "temperature_2m_min",
            "weather_code",
            "sunshine_duration",
            "precipitation_probability_max"
        ],


        "timezone":
            timezone,

        "forecast_days":
            2
    }


    response = requests.get(
        WEATHER_API_URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    weather = response.json()

    weather[
        "location_data"
    ] = location_data


    return weather


# ============================================================
# FIND BEST CONTINUOUS RAIN WINDOW
# ============================================================

def detect_rain_window(
    hourly,
    target_date,
    threshold=60,
    start_index=0
):

    times = hourly.get(
        "time",
        []
    )


    probabilities = hourly.get(
        "precipitation_probability",
        []
    )


    qualifying = []


    for i in range(
        start_index,
        len(times)
    ):

        time_value = times[i]


        if not time_value.startswith(
            target_date
        ):
            continue


        probability = (
            probabilities[i]
        )


        if (
            probability is not None
            and probability >= threshold
        ):

            qualifying.append({
                "index":
                    i,

                "time":
                    time_value,

                "probability":
                    probability
            })


    # No meaningful rain
    if not qualifying:

        return {

            "rainExpected":
                False,

            "startTime":
                None,

            "endTime":
                None,

            "durationHours":
                0,

            "averageRainProbability":
                0,

            "maxRainProbability":
                0,

            "displayText":
                None
        }


    # ========================================================
    # GROUP CONSECUTIVE HOURS
    # ========================================================

    groups = []

    current_group = [
        qualifying[0]
    ]


    for item in qualifying[1:]:

        previous = (
            current_group[-1]
        )


        if (
            item["index"]
            ==
            previous["index"] + 1
        ):

            current_group.append(
                item
            )

        else:

            groups.append(
                current_group
            )

            current_group = [
                item
            ]


    groups.append(
        current_group
    )


    # ========================================================
    # PICK MOST MEANINGFUL WINDOW
    #
    # Prefer:
    # 1. Longer continuous rain period
    # 2. Higher average probability
    # ========================================================

    best_group = max(

        groups,

        key=lambda group: (
            len(group),
            sum(
                x["probability"]
                for x in group
            ) / len(group)
        )
    )


    start_time = (
        best_group[0][
            "time"
        ]
    )


    end_time = (
        best_group[-1][
            "time"
        ]
    )


    values = [

        item["probability"]

        for item
        in best_group
    ]


    average_probability = round(

        sum(values)
        / len(values)
    )


    max_probability = max(
        values
    )


    start_display = (
        format_time_12_hour(
            start_time
        )
    )


    end_display = (
        format_time_12_hour(
            end_time
        )
    )


    # Single-hour window
    if (
        start_time == end_time
    ):

        display_text = (
            f"Rain likely around "
            f"{start_display}"
        )

    else:

        display_text = (
            f"Rain likely between "
            f"{start_display}–{end_display}"
        )


    return {

        "rainExpected":
            True,

        "startTime":
            start_time,

        "endTime":
            end_time,

        "durationHours":
            len(
                best_group
            ),

        "averageRainProbability":
            average_probability,

        "maxRainProbability":
            max_probability,

        "displayText":
            display_text
    }


# ============================================================
# SMART WEATHER ALERT
# ============================================================

def generate_weather_alert(
    weather_data
):

    rain = weather_data[
        "rainForecast"
    ]


    if not rain[
        "rainExpected"
    ]:

        return None


    rain_window = (
        rain["displayText"]
    )


    probability = (
        rain[
            "averageRainProbability"
        ]
    )


    return {

        "type":
            "warning",

        "title":
            "Rain expected tomorrow",

        "message":
            (
                f"{rain_window}. "
                f"Average rain chance during this period "
                f"is around {probability}%. "
                f"Solar generation may be lower tomorrow. "
                f"Use available solar energy efficiently "
                f"and keep the battery sufficiently charged."
            )
    }


# ============================================================
# SOLARFLUX WEATHER FORMAT
# ============================================================

def get_solarflux_weather(
    location=None,
    latitude=None,
    longitude=None
):

    raw_data = fetch_weather(

        location=location,

        latitude=latitude,

        longitude=longitude
    )


    current = raw_data[
        "current"
    ]


    daily = raw_data[
        "daily"
    ]


    hourly = raw_data[
        "hourly"
    ]


    location_data = raw_data[
        "location_data"
    ]


    # ========================================================
    # SUNLIGHT HOURS TODAY
    # ========================================================

    sunlight_hours = round(

        daily[
            "sunshine_duration"
        ][0] / 3600,

        1
    )


    # ========================================================
    # CURRENT HOUR
    # ========================================================

    current_time = (
        current[
            "time"
        ]
    )


    current_hour = (
        current_time[:13]
        + ":00"
    )


    try:

        start_index = (
            hourly[
                "time"
            ].index(
                current_hour
            )
        )

    except ValueError:

        start_index = 0


    # ========================================================
    # NEXT 6 HOURS
    # ========================================================

    hourly_forecast = []


    for i in range(

        start_index,

        min(
            start_index + 6,
            len(
                hourly["time"]
            )
        )
    ):

        hourly_forecast.append({

            "time":
                hourly[
                    "time"
                ][i],

            "temperature":
                hourly[
                    "temperature_2m"
                ][i],

            "humidity":
                hourly[
                    "relative_humidity_2m"
                ][i],

            "cloudCover":
                hourly[
                    "cloud_cover"
                ][i],

            "windSpeed":
                hourly[
                    "wind_speed_10m"
                ][i],

            "rainProbability":
                hourly[
                    "precipitation_probability"
                ][i],

            "solarRadiation":
                hourly[
                    "shortwave_radiation"
                ][i],

            "condition":
                get_weather_condition(
                    hourly[
                        "weather_code"
                    ][i]
                )
        })


    # ========================================================
    # TODAY + TOMORROW DATE
    # ========================================================

    unique_dates = []


    for time_value in hourly[
        "time"
    ]:

        date_value = (
            time_value[:10]
        )


        if (
            date_value
            not in unique_dates
        ):

            unique_dates.append(
                date_value
            )


    today_date = (
        unique_dates[0]
        if len(unique_dates) >= 1
        else None
    )


    tomorrow_date = (
        unique_dates[1]
        if len(unique_dates) >= 2
        else None
    )


    # ========================================================
    # TODAY RAIN
    #
    # Only check remaining hours of today.
    # ========================================================

    if today_date:

        today_rain_forecast = (
            detect_rain_window(

                hourly=
                    hourly,

                target_date=
                    today_date,

                threshold=
                    60,

                start_index=
                    start_index
            )
        )

    else:

        today_rain_forecast = {

            "rainExpected":
                False,

            "displayText":
                None,

            "averageRainProbability":
                0
        }


    # ========================================================
    # TOMORROW RAIN
    # ========================================================

    if tomorrow_date:

        rain_forecast = (
            detect_rain_window(

                hourly=
                    hourly,

                target_date=
                    tomorrow_date,

                threshold=
                    60,

                start_index=
                    0
            )
        )

    else:

        rain_forecast = {

            "rainExpected":
                False,

            "displayText":
                None,

            "averageRainProbability":
                0,

            "maxRainProbability":
                0
        }


    # ========================================================
    # LOCATION DISPLAY
    # ========================================================

    if (
        latitude is not None
        and longitude is not None
    ):

        display_location = (
            location_data[
                "name"
            ]
        )


    else:

        location_parts = [

            location_data[
                "name"
            ],

            location_data[
                "admin1"
            ],

            location_data[
                "country"
            ]
        ]


        location_parts = [

            part

            for part
            in location_parts

            if part
        ]


        display_location = (
            ", ".join(
                location_parts
            )
        )


    # ========================================================
    # REPRESENTATIVE TOMORROW RAIN CHANCE
    # ========================================================

    if rain_forecast[
        "rainExpected"
    ]:

        tomorrow_rain_probability = (
            rain_forecast[
                "averageRainProbability"
            ]
        )

    else:

        # No >=60% continuous rain window.
        # Keep daily maximum only as fallback.
        tomorrow_rain_probability = (
            daily[
                "precipitation_probability_max"
            ][1]
        )


    # ========================================================
    # FINAL WEATHER RESPONSE
    # ========================================================

    weather_data = {

        "requestedLocation":
            location,


        "temperature":
            current[
                "temperature_2m"
            ],


        "feelsLike":
            current[
                "apparent_temperature"
            ],


        "condition":
            get_weather_condition(
                current[
                    "weather_code"
                ]
            ),


        "location":
            display_location,


        "latitude":
            location_data[
                "latitude"
            ],


        "longitude":
            location_data[
                "longitude"
            ],


        "humidity":
            current[
                "relative_humidity_2m"
            ],


        "windSpeed":
            current[
                "wind_speed_10m"
            ],


        "cloudCover":
            current[
                "cloud_cover"
            ],


        "sunlightHours":
            sunlight_hours,


        # ====================================================
        # TODAY
        # ====================================================

        "today": {

            "rainExpected":
                today_rain_forecast[
                    "rainExpected"
                ],

            "rainProbability":
                (
                    today_rain_forecast[
                        "averageRainProbability"
                    ]

                    if today_rain_forecast[
                        "rainExpected"
                    ]

                    else None
                ),

            "rainWindow":
                today_rain_forecast.get(
                    "displayText"
                )
        },


        # ====================================================
        # TOMORROW
        # ====================================================

        "tomorrow": {

            "high":
                daily[
                    "temperature_2m_max"
                ][1],

            "low":
                daily[
                    "temperature_2m_min"
                ][1],

            "condition":
                get_weather_condition(
                    daily[
                        "weather_code"
                    ][1]
                ),

            "rainProbability":
                tomorrow_rain_probability,

            "rainExpected":
                rain_forecast[
                    "rainExpected"
                ],

            "rainWindow":
                rain_forecast.get(
                    "displayText"
                )
        },


        "hourlyForecast":
            hourly_forecast,


        "todayRainForecast":
            today_rain_forecast,


        "rainForecast":
            rain_forecast
    }


    # ========================================================
    # SMART WEATHER ALERT
    # ========================================================

    weather_alert = (
        generate_weather_alert(
            weather_data
        )
    )


    weather_data[
        "weatherAlert"
    ] = weather_alert


    return weather_data
# ============================================================
# FETCH WEATHER FOR FUTURE DATE RANGE
# ============================================================

def fetch_weather_range(
    start_date,
    end_date,
    location=None,
    latitude=None,
    longitude=None
):

    # --------------------------------------------------------
    # LOCATION
    # --------------------------------------------------------

    if (
        latitude is not None
        and longitude is not None
    ):

        location_data = (
            reverse_geocode_coordinates(
                latitude,
                longitude
            )
        )


    elif location:

        location = location.strip()

        if len(location) < 2:

            raise ValueError(
                "Please enter a valid location."
            )

        location_data = (
            get_coordinates(
                location
            )
        )


    else:

        raise ValueError(
            "Provide either a location or GPS coordinates."
        )


    latitude_value = (
        location_data[
            "latitude"
        ]
    )

    longitude_value = (
        location_data[
            "longitude"
        ]
    )


    # --------------------------------------------------------
    # OPEN-METEO RANGE REQUEST
    # --------------------------------------------------------

    params = {

        "latitude":
            latitude_value,

        "longitude":
            longitude_value,

        "hourly": [

            "temperature_2m",

            "relative_humidity_2m",

            "cloud_cover",

            "wind_speed_10m",

            "shortwave_radiation"
        ],

        "daily": [

            "sunshine_duration"
        ],

        "timezone":
            "auto",

        "start_date":
            start_date,

        "end_date":
            end_date
    }


    response = requests.get(
        WEATHER_API_URL,
        params=params,
        timeout=15
    )


    if response.status_code != 200:

        try:

            error_data = (
                response.json()
            )

            reason = (
                error_data.get(
                    "reason",
                    "Weather forecast is not available for this date range."
                )
            )

        except Exception:

            reason = (
                "Weather forecast is not available for this date range."
            )


        raise ValueError(
            reason
        )


    weather = response.json()


    weather[
        "location_data"
    ] = location_data


    return weather