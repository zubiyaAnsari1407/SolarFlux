from database import dashboard_collection

dashboard_collection.delete_many({})

dashboard_data = {
    "solar_generation": {
        "value": 4.82,
        "unit": "kW"
    },
    "energy_today": {
        "value": 18.6,
        "unit": "kWh"
    },
    "battery": {
        "percentage": 78,
        "status": "Charging"
    },
    "home_consumption": {
        "value": 2.31,
        "unit": "kW"
    },
    "grid": {
        "value": 1.42,
        "status": "Exporting"
    },
    "system_status": "Optimal"
}

dashboard_collection.insert_one(dashboard_data)

print("SolarFlux dashboard data inserted successfully")

