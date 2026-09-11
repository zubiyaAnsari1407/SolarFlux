from database import impact_collection

impact_collection.delete_many({})

impact_data = {
    "savingsToday": 285,
    "monthlySavings": 4860,
    "co2Avoided": 12.4,
    "treesEquivalent": 7
}

impact_collection.insert_one(impact_data)

print("SolarFlux impact data inserted successfully")