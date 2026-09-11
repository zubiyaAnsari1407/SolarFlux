from pathlib import Path
from datetime import (
    datetime,
    date,
    timedelta
)

import joblib
import numpy as np
import pandas as pd

from services.weather_service import (
    fetch_weather,
    fetch_weather_range
)


# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = Path(
    __file__
).resolve().parent.parent


MODEL_PATH = (
    BASE_DIR
    / "solarflux_best_model.joblib"
)


# ============================================================
# LOAD MODEL ONCE
# ============================================================

if not MODEL_PATH.exists():

    raise FileNotFoundError(
        f"Solar prediction model not found: {MODEL_PATH}"
    )


model_bundle = joblib.load(
    MODEL_PATH
)


model = model_bundle[
    "model"
]

model_name = model_bundle[
    "model_name"
]

model_features = model_bundle[
    "features"
]


# ============================================================
# SAFE AVERAGE
# ============================================================

def safe_average(
    values
):

    valid_values = [

        value

        for value
        in values

        if value is not None
    ]


    if not valid_values:

        return 0.0


    return float(
        np.mean(
            valid_values
        )
    )


# ============================================================
# PREPARE FEATURES FOR ANY DATE
# ============================================================

def prepare_date_features(
    raw_weather,
    target_date
):

    hourly = (
        raw_weather[
            "hourly"
        ]
    )

    daily = (
        raw_weather[
            "daily"
        ]
    )

    location_data = (
        raw_weather[
            "location_data"
        ]
    )


    # --------------------------------------------------------
    # FIND DAILY INDEX
    # --------------------------------------------------------

    daily_dates = (
        daily.get(
            "time",
            []
        )
    )


    if (
        target_date
        not in daily_dates
    ):

        raise ValueError(
            f"Weather forecast for {target_date} is not available."
        )


    daily_index = (
        daily_dates.index(
            target_date
        )
    )


    # --------------------------------------------------------
    # FIND ALL HOURS FOR TARGET DATE
    # --------------------------------------------------------

    hourly_indices = [

        index

        for index, time_string
        in enumerate(
            hourly.get(
                "time",
                []
            )
        )

        if time_string.startswith(
            target_date
        )
    ]


    if not hourly_indices:

        raise ValueError(
            f"Hourly weather forecast for {target_date} is not available."
        )


    # --------------------------------------------------------
    # DAILY AVERAGES
    # --------------------------------------------------------

    avg_temperature = (
        safe_average([

            hourly[
                "temperature_2m"
            ][i]

            for i
            in hourly_indices
        ])
    )


    avg_humidity = (
        safe_average([

            hourly[
                "relative_humidity_2m"
            ][i]

            for i
            in hourly_indices
        ])
    )


    avg_cloud_cover = (
        safe_average([

            hourly[
                "cloud_cover"
            ][i]

            for i
            in hourly_indices
        ])
    )


    avg_wind_speed = (
        safe_average([

            hourly[
                "wind_speed_10m"
            ][i]

            for i
            in hourly_indices
        ])
    )


    avg_shortwave_radiation = (
        safe_average([

            hourly[
                "shortwave_radiation"
            ][i]

            for i
            in hourly_indices
        ])
    )


    # --------------------------------------------------------
    # SUNSHINE HOURS
    # --------------------------------------------------------

    sunshine_values = (
        daily.get(
            "sunshine_duration",
            []
        )
    )


    if (
        daily_index
        < len(
            sunshine_values
        )
    ):

        sunshine_seconds = (
            sunshine_values[
                daily_index
            ]
            or 0
        )

    else:

        sunshine_seconds = 0


    sunshine_hours = (
        sunshine_seconds
        / 3600
    )


    # --------------------------------------------------------
    # DATE FEATURES
    # --------------------------------------------------------

    target_dt = (
        datetime.strptime(
            target_date,
            "%Y-%m-%d"
        )
    )


    month = (
        target_dt.month
    )


    day_of_year = (
        target_dt
        .timetuple()
        .tm_yday
    )


    month_sin = (
        np.sin(
            2
            * np.pi
            * month
            / 12
        )
    )


    month_cos = (
        np.cos(
            2
            * np.pi
            * month
            / 12
        )
    )


    day_of_year_sin = (
        np.sin(
            2
            * np.pi
            * day_of_year
            / 365.25
        )
    )


    day_of_year_cos = (
        np.cos(
            2
            * np.pi
            * day_of_year
            / 365.25
        )
    )


    # --------------------------------------------------------
    # FINAL FEATURES
    # --------------------------------------------------------

    features = {

        "latitude":
            float(
                location_data[
                    "latitude"
                ]
            ),

        "longitude":
            float(
                location_data[
                    "longitude"
                ]
            ),

        "avg_temperature_c":
            avg_temperature,

        "avg_humidity_pct":
            avg_humidity,

        "avg_cloud_cover_pct":
            avg_cloud_cover,

        "avg_wind_speed_kmh":
            avg_wind_speed,

        "avg_shortwave_radiation_wm2":
            avg_shortwave_radiation,

        "sunshine_hours":
            sunshine_hours,

        "month_sin":
            month_sin,

        "month_cos":
            month_cos,

        "day_of_year_sin":
            day_of_year_sin,

        "day_of_year_cos":
            day_of_year_cos
    }


    return features


# ============================================================
# RUN MODEL PREDICTION
# ============================================================

def predict_from_features(
    features
):

    feature_row = {

        feature:
            features[
                feature
            ]

        for feature
        in model_features
    }


    input_df = (
        pd.DataFrame(
            [feature_row]
        )
    )


    prediction = (
        model.predict(
            input_df
        )[0]
    )


    prediction = max(
        0,
        float(
            prediction
        )
    )


    return round(
        prediction,
        2
    )


# ============================================================
# PREPARE TOMORROW FEATURES
# ============================================================

def prepare_tomorrow_features(
    raw_weather
):

    daily = (
        raw_weather[
            "daily"
        ]
    )


    if (
        len(
            daily[
                "time"
            ]
        )
        < 2
    ):

        raise ValueError(
            "Tomorrow forecast is not available."
        )


    tomorrow_date = (
        daily[
            "time"
        ][1]
    )


    features = (
        prepare_date_features(
            raw_weather,
            tomorrow_date
        )
    )


    return (
        features,
        tomorrow_date
    )


# ============================================================
# PREDICT TOMORROW SOLAR GENERATION
# ============================================================

def predict_tomorrow_solar(
    location=None,
    latitude=None,
    longitude=None
):

    raw_weather = (
        fetch_weather(

            location=
                location,

            latitude=
                latitude,

            longitude=
                longitude
        )
    )


    (
        features,
        prediction_date
    ) = (
        prepare_tomorrow_features(
            raw_weather
        )
    )


    prediction = (
        predict_from_features(
            features
        )
    )


    location_data = (
        raw_weather[
            "location_data"
        ]
    )


    display_location = (
        location_data.get(
            "name",
            location
            or "Current Location"
        )
    )


    return {

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

        "predictionDate":
            prediction_date,

        "predictedGeneration":
            prediction,

        "unit":
            "kWh",

        "systemCapacity":
            5.0,

        "systemCapacityUnit":
            "kWp",

        "model":
            model_name,

        "forecastInputs": {

            "averageTemperature":
                round(
                    features[
                        "avg_temperature_c"
                    ],
                    2
                ),

            "averageHumidity":
                round(
                    features[
                        "avg_humidity_pct"
                    ],
                    2
                ),

            "averageCloudCover":
                round(
                    features[
                        "avg_cloud_cover_pct"
                    ],
                    2
                ),

            "averageWindSpeed":
                round(
                    features[
                        "avg_wind_speed_kmh"
                    ],
                    2
                ),

            "averageSolarRadiation":
                round(
                    features[
                        "avg_shortwave_radiation_wm2"
                    ],
                    2
                ),

            "sunshineHours":
                round(
                    features[
                        "sunshine_hours"
                    ],
                    2
                )
        }
    }


# ============================================================
# FUTURE SOLAR ENERGY RANGE FORECAST
# ============================================================

def predict_solar_range(
    start_date,
    end_date,
    location=None,
    latitude=None,
    longitude=None
):

    # --------------------------------------------------------
    # VALIDATE DATES
    # --------------------------------------------------------

    try:

        start_dt = (
            datetime.strptime(
                start_date,
                "%Y-%m-%d"
            ).date()
        )

        end_dt = (
            datetime.strptime(
                end_date,
                "%Y-%m-%d"
            ).date()
        )

    except ValueError:

        raise ValueError(
            "Dates must be in YYYY-MM-DD format."
        )


    today = (
        date.today()
    )


    if start_dt < today:

        raise ValueError(
            "Start date must be today or a future date."
        )


    if end_dt < start_dt:

        raise ValueError(
            "End date cannot be before start date."
        )


    # Open-Meteo forecast horizon
    max_forecast_date = (
        today
        + timedelta(
            days=15
        )
    )


    if end_dt > max_forecast_date:

        raise ValueError(
            "Future solar forecast is currently available "
            "for up to 16 days including today."
        )


    number_of_days = (
        (
            end_dt
            - start_dt
        ).days
        + 1
    )


    # --------------------------------------------------------
    # FETCH RANGE WEATHER
    # --------------------------------------------------------

    raw_weather = (
        fetch_weather_range(

            start_date=
                start_date,

            end_date=
                end_date,

            location=
                location,

            latitude=
                latitude,

            longitude=
                longitude
        )
    )


    location_data = (
        raw_weather[
            "location_data"
        ]
    )


    display_location = (
        location_data.get(
            "name",
            location
            or "Current Location"
        )
    )


    # --------------------------------------------------------
    # PREDICT EACH DAY
    # --------------------------------------------------------

    forecasts = []


    current_date = (
        start_dt
    )


    while (
        current_date
        <= end_dt
    ):

        date_string = (
            current_date.strftime(
                "%Y-%m-%d"
            )
        )


        features = (
            prepare_date_features(
                raw_weather,
                date_string
            )
        )


        predicted_energy = (
            predict_from_features(
                features
            )
        )


        forecasts.append({

            "date":
                date_string,

            "predictedEnergy":
                predicted_energy,

            "unit":
                "kWh",

            "weatherInputs": {

                "averageTemperature":
                    round(
                        features[
                            "avg_temperature_c"
                        ],
                        2
                    ),

                "averageHumidity":
                    round(
                        features[
                            "avg_humidity_pct"
                        ],
                        2
                    ),

                "averageCloudCover":
                    round(
                        features[
                            "avg_cloud_cover_pct"
                        ],
                        2
                    ),

                "averageWindSpeed":
                    round(
                        features[
                            "avg_wind_speed_kmh"
                        ],
                        2
                    ),

                "averageSolarRadiation":
                    round(
                        features[
                            "avg_shortwave_radiation_wm2"
                        ],
                        2
                    ),

                "sunshineHours":
                    round(
                        features[
                            "sunshine_hours"
                        ],
                        2
                    )
            }
        })


        current_date += (
            timedelta(
                days=1
            )
        )


    # --------------------------------------------------------
    # TOTAL + AVERAGE
    # --------------------------------------------------------

    total_energy = round(
        sum(
            item[
                "predictedEnergy"
            ]

            for item
            in forecasts
        ),
        2
    )


    average_energy = round(
        (
            total_energy
            / len(
                forecasts
            )
        )
        if forecasts
        else 0,
        2
    )


    # --------------------------------------------------------
    # TOMORROW VALUE
    # --------------------------------------------------------

    tomorrow_string = (
        (
            today
            + timedelta(
                days=1
            )
        ).strftime(
            "%Y-%m-%d"
        )
    )


    tomorrow_prediction = (
        next(
            (
                item[
                    "predictedEnergy"
                ]

                for item
                in forecasts

                if item[
                    "date"
                ]
                == tomorrow_string
            ),
            None
        )
    )


    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return {

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

        "startDate":
            start_date,

        "endDate":
            end_date,

        "numberOfDays":
            number_of_days,

        "forecast":
            forecasts,

        "tomorrowPrediction":
            tomorrow_prediction,

        "totalPredictedEnergy":
            total_energy,

        "averageDailyEnergy":
            average_energy,

        "unit":
            "kWh",

        "systemCapacity":
            5.0,

        "systemCapacityUnit":
            "kWp",

        "model":
            model_name
    }