from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

# Get MongoDB settings
MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Connect to MongoDB
client = MongoClient(MONGO_URL)

# Select SolarFlux database
db = client[DATABASE_NAME]

# Collections
dashboard_collection = db["dashboard"]
weather_collection = db["weather"]
alerts_collection = db["alerts"]
impact_collection = db["impact"]
recommendations_collection = db["recommendations"]
energy_history_collection = db["energy_history"]
telemetry_collection = db["telemetry"]
