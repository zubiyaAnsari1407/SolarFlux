from database import weather_collection

weather_collection.delete_many({})

weather_data = {
    "temperature": 29,
    "feelsLike": 31,
    "condition": "Partly Cloudy",
    "location": "Mumbai, India",

    "humidity": 62,
    "windSpeed": 12,
    "cloudCover": 38,
    "sunlightHours": 6.4,

    "tomorrow": {
        "high": 31,
        "low": 25,
        "condition": "Mostly Sunny"
    }
}

weather_collection.insert_one(weather_data)

print("SolarFlux weather data inserted successfully")