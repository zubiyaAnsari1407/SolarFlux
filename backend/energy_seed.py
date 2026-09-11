from database import energy_history_collection

energy_history_collection.delete_many({})

energy_data = [
    {
        "time": "6 AM",
        "solar": 0.4,
        "usage": 1.2
    },
    {
        "time": "8 AM",
        "solar": 1.8,
        "usage": 1.7
    },
    {
        "time": "10 AM",
        "solar": 3.7,
        "usage": 2.1
    },
    {
        "time": "12 PM",
        "solar": 5.2,
        "usage": 2.8
    },
    {
        "time": "2 PM",
        "solar": 4.8,
        "usage": 3.1
    },
    {
        "time": "4 PM",
        "solar": 3.6,
        "usage": 2.9
    },
    {
        "time": "6 PM",
        "solar": 1.4,
        "usage": 3.4
    }
]

energy_history_collection.insert_many(energy_data)

print("SolarFlux energy history inserted successfully")