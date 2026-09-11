from database import recommendations_collection

recommendations_collection.delete_many({})

recommendation_data = {
    "morning": {
        "title": "Prepare for today's solar peak",
        "text": "Solar generation is increasing. Consider scheduling higher-energy appliances for the upcoming peak sunlight window."
    },

    "afternoon": {
        "title": "Use high-power appliances now",
        "text": "Solar production is currently strong. Running high-energy appliances now can increase direct solar usage and reduce grid dependency."
    },

    "evening": {
        "title": "Shift to stored solar energy",
        "text": "Solar generation is decreasing as daylight fades. Battery power can now support evening household consumption."
    },

    "night": {
        "title": "Let your battery do the work",
        "text": "Solar generation is inactive. Your system can use stored battery energy while preparing tomorrow's solar forecast."
    }
}

recommendations_collection.insert_one(recommendation_data)

print("SolarFlux recommendations inserted successfully")