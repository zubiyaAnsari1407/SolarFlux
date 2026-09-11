const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// DASHBOARD SUMMARY
// ============================================================

export async function getDashboardSummary() {

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/summary`
  );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch dashboard data"
    );
  }


  return response.json();
}


// ============================================================
// CURRENT WEATHER
// ============================================================

export async function getCurrentWeather({
  location = null,
  latitude = null,
  longitude = null,
} = {}) {

  const params =
    new URLSearchParams();


  if (location) {

    params.append(
      "location",
      location
    );
  }


  if (
    latitude !== null &&
    longitude !== null
  ) {

    params.append(
      "latitude",
      latitude
    );

    params.append(
      "longitude",
      longitude
    );
  }


  const response = await fetch(
    `${API_BASE_URL}/api/weather/current?${params.toString()}`
  );


  if (!response.ok) {

    const errorData =
      await response.json();


    throw new Error(
      errorData.detail ||
      "Failed to fetch weather data"
    );
  }


  return response.json();
}


// ============================================================
// COMBINED AI INTELLIGENCE
// ============================================================

export async function getAIIntelligence({
  location = null,
  latitude = null,
  longitude = null,
  tariffPerKwh = 8,
  batteryPercentage = null,
} = {}) {

  const params =
    new URLSearchParams();


  if (location) {

    params.append(
      "location",
      location
    );
  }


  if (
    latitude !== null &&
    longitude !== null
  ) {

    params.append(
      "latitude",
      latitude
    );

    params.append(
      "longitude",
      longitude
    );
  }


  params.append(
    "tariff_per_kwh",
    tariffPerKwh
  );


  if (
    batteryPercentage !== null &&
    batteryPercentage !== undefined
  ) {

    params.append(
      "battery_percentage",
      batteryPercentage
    );
  }


  const response = await fetch(
    `${API_BASE_URL}/api/ai/intelligence?${params.toString()}`
  );


  if (!response.ok) {

    const errorData =
      await response.json();


    throw new Error(
      errorData.detail ||
      "Failed to fetch SolarFlux AI intelligence"
    );
  }


  return response.json();
}


// ============================================================
// FUTURE SOLAR ENERGY FORECAST
// ============================================================

export async function getSolarForecastRange({
  location = null,
  latitude = null,
  longitude = null,
  startDate,
  endDate,
} = {}) {

  const params =
    new URLSearchParams();


  if (startDate) {

    params.append(
      "start_date",
      startDate
    );
  }


  if (endDate) {

    params.append(
      "end_date",
      endDate
    );
  }


  if (location) {

    params.append(
      "location",
      location
    );
  }


  if (
    latitude !== null &&
    longitude !== null
  ) {

    params.append(
      "latitude",
      latitude
    );

    params.append(
      "longitude",
      longitude
    );
  }


  const response = await fetch(
    `${API_BASE_URL}/api/ai/solar-forecast-range?${params.toString()}`
  );


  if (!response.ok) {

    let errorMessage =
      "Failed to generate future solar forecast";


    try {

      const errorData =
        await response.json();


      errorMessage =
        errorData.detail ||
        errorMessage;

    } catch {

      // Keep fallback message
    }


    throw new Error(
      errorMessage
    );
  }


  return response.json();
}


// ============================================================
// ALERTS
// ============================================================

export async function getAlerts() {

  const response = await fetch(
    `${API_BASE_URL}/api/alerts`
  );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch alerts"
    );
  }


  return response.json();
}


// ============================================================
// IMPACT
// ============================================================

export async function getTodayImpact() {

  const response = await fetch(
    `${API_BASE_URL}/api/impact/today`
  );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch impact data"
    );
  }


  return response.json();
}


// ============================================================
// RECOMMENDATIONS
// ============================================================

export async function getRecommendations() {

  const response = await fetch(
    `${API_BASE_URL}/api/recommendations`
  );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch recommendations"
    );
  }


  return response.json();
}


// ============================================================
// ENERGY HISTORY
// ============================================================

export async function getEnergyHistory() {

  const response = await fetch(
    `${API_BASE_URL}/api/energy/history`
  );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch energy history"
    );
  }


  return response.json();
}