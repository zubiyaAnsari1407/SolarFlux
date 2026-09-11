from database import alerts_collection

alerts_collection.delete_many({})

alerts_data = [
    {
        "type": "warning",
        "title": "High evening consumption",
        "message": "Household demand is expected to increase during the evening peak.",
        "time": "10 min ago"
    },
    {
        "type": "success",
        "title": "Battery charging normally",
        "message": "Battery charging performance is within the expected operating range.",
        "time": "25 min ago"
    },
    {
        "type": "info",
        "title": "Solar generation stable",
        "message": "Current solar production is stable with no major fluctuations detected.",
        "time": "1 hr ago"
    }
]

alerts_collection.insert_many(alerts_data)

print("SolarFlux alerts inserted successfully")