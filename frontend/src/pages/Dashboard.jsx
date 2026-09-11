import {
  useEffect,
  useState,
} from "react";

import useDashboardTheme
  from "../hooks/useDashboardTheme";

import LocationSearch
  from "../components/dashboard/LocationSearch";

import {
  getDashboardSummary,
  getAlerts,
  getTodayImpact,
  getRecommendations,
  getEnergyHistory,
  getAIIntelligence,
} from "../services/dashboardApi";

import DashboardNavbar
  from "../components/dashboard/DashboardNavbar";

import DashboardHeader
  from "../components/dashboard/DashboardHeader";

import KpiCards
  from "../components/dashboard/KpiCards";

import EnergyChart
  from "../components/dashboard/EnergyChart";

import WeatherCard
  from "../components/dashboard/WeatherCard";
  import FutureEnergyForecast
  from "../components/dashboard/FutureEnergyForecast";

import EnergyFlow
  from "../components/dashboard/EnergyFlow";

import BatteryStatus
  from "../components/dashboard/BatteryStatus";

import SystemHealth
  from "../components/dashboard/SystemHealth";

import Alerts
  from "../components/dashboard/Alerts";

import ImpactCard
  from "../components/dashboard/ImpactCard";

import Recommendation
  from "../components/dashboard/Recommendation";

import ThemePreview
  from "../components/dashboard/ThemePreview";


// ============================================================
// SIMPLE HUMAN-FRIENDLY XAI EXPLANATION
// ============================================================

function buildSimpleExplanation(
  topFactors = [],
  forecastInputs = {}
) {

  if (
    !Array.isArray(topFactors) ||
    topFactors.length === 0
  ) {

    return (
      "SolarFlux AI is analyzing tomorrow's weather " +
      "conditions to explain the predicted solar generation."
    );
  }


  const findFactor = (featureNames) =>
    topFactors.find(
      (factor) =>
        featureNames.includes(
          factor.feature
        )
    );


  // ==========================================================
  // FIND SHAP FACTORS
  // ==========================================================

  const cloudFactor =
    findFactor([
      "avg_cloud_cover_pct",
    ]);


  const sunshineFactor =
    findFactor([
      "sunshine_hours",
    ]);


  const humidityFactor =
    findFactor([
      "avg_humidity_pct",
    ]);


  const seasonalFactor =
    findFactor([
      "day_of_year_cos",
      "day_of_year_sin",
      "month_cos",
      "month_sin",
    ]);


  const temperatureFactor =
    findFactor([
      "avg_temperature_c",
    ]);


  const radiationFactor =
    findFactor([
      "avg_shortwave_radiation_wm2",
    ]);


  const sentences = [];


  // ==========================================================
  // CLOUD COVER
  // ==========================================================

  if (cloudFactor) {

    const cloudValue =
      Math.round(
        Number(
          cloudFactor.value
        )
      );


    if (
      cloudFactor.impactDirection ===
      "negative"
    ) {

      sentences.push(
        `Tomorrow's solar generation may be lower because ` +
        `cloud cover is high at around ${cloudValue}%.`
      );

    } else {

      sentences.push(
        `Cloud cover is around ${cloudValue}%, ` +
        `which may support better solar generation tomorrow.`
      );
    }
  }


  // ==========================================================
  // SEASONAL CONDITIONS
  // ==========================================================

  if (seasonalFactor) {

    if (
      seasonalFactor.impactDirection ===
      "negative"
    ) {

      sentences.push(
        "Seasonal conditions may also slightly reduce generation."
      );

    } else {

      sentences.push(
        "Seasonal conditions are favorable for solar generation."
      );
    }
  }


  // ==========================================================
  // SUNSHINE HOURS
  // ==========================================================

  if (sunshineFactor) {

    const sunshineValue =
      Number(
        sunshineFactor.value
      ).toFixed(1);


    if (
      sunshineFactor.impactDirection ===
      "positive"
    ) {

      sentences.push(
        `About ${sunshineValue} hours of sunshine can help ` +
        `improve solar output.`
      );

    } else {

      sentences.push(
        `Only about ${sunshineValue} hours of sunshine are expected, ` +
        `which may reduce solar output.`
      );
    }
  }


  // ==========================================================
  // HUMIDITY
  // ==========================================================

  /*
    Priority:
    1. Use SHAP humidity value if humidity is one of the important factors.
    2. Otherwise use forecast average humidity.
  */

  const humidityValue =
    humidityFactor
      ? Math.round(
          Number(
            humidityFactor.value
          )
        )
      : forecastInputs?.averageHumidity !==
        undefined
      ? Math.round(
          Number(
            forecastInputs.averageHumidity
          )
        )
      : null;


  if (
    humidityValue !== null &&
    !Number.isNaN(humidityValue)
  ) {

    if (
      humidityFactor?.impactDirection ===
      "negative"
    ) {

      sentences.push(
        `High humidity of around ${humidityValue}% may also ` +
        `slightly reduce performance.`
      );

    } else if (
      humidityValue >= 80
    ) {

      sentences.push(
        `Humidity is also high at around ${humidityValue}%, ` +
        `which may slightly affect solar performance.`
      );
    }
  }


  // ==========================================================
  // TEMPERATURE FALLBACK
  // ==========================================================

  if (
    sentences.length < 3 &&
    temperatureFactor
  ) {

    const temperatureValue =
      Number(
        temperatureFactor.value
      ).toFixed(1);


    if (
      temperatureFactor.impactDirection ===
      "negative"
    ) {

      sentences.push(
        `An average temperature of about ${temperatureValue}°C ` +
        `may slightly reduce panel efficiency.`
      );

    } else {

      sentences.push(
        `An average temperature of about ${temperatureValue}°C ` +
        `is favorable for solar generation.`
      );
    }
  }


  // ==========================================================
  // SOLAR RADIATION FALLBACK
  // ==========================================================

  if (
    sentences.length < 3 &&
    radiationFactor
  ) {

    const radiationValue =
      Math.round(
        Number(
          radiationFactor.value
        )
      );


    if (
      radiationFactor.impactDirection ===
      "positive"
    ) {

      sentences.push(
        `Solar radiation of around ${radiationValue} W/m² ` +
        `is expected to support generation.`
      );

    } else {

      sentences.push(
        `Solar radiation is around ${radiationValue} W/m², ` +
        `which may reduce expected generation.`
      );
    }
  }


  // ==========================================================
  // FINAL FALLBACK
  // ==========================================================

  if (sentences.length === 0) {

    return (
      "Tomorrow's weather conditions are influencing " +
      "the predicted solar generation."
    );
  }


  return sentences.join(" ");
}


function Dashboard() {

  // =========================================================
  // DATA
  // =========================================================

  const [
    dashboardData,
    setDashboardData,
  ] = useState(null);


  const [
    weatherData,
    setWeatherData,
  ] = useState(null);


  const [
    aiData,
    setAiData,
  ] = useState(null);


  const [
    alertsData,
    setAlertsData,
  ] = useState([]);


  const [
    impactData,
    setImpactData,
  ] = useState(null);


  const [
    recommendationData,
    setRecommendationData,
  ] = useState(null);


  const [
    energyHistory,
    setEnergyHistory,
  ] = useState([]);


  const [
    locationInput,
    setLocationInput,
  ] = useState("");


  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(false);


  const [
    locationError,
    setLocationError,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(null);


  // =========================================================
  // THEME
  // =========================================================

  const [
    manualTheme,
    setManualTheme,
  ] = useState(null);


  const {
    currentTime,
    theme,
    themeName,
    automaticTheme,
  } = useDashboardTheme(
    manualTheme
  );


  // =========================================================
  // INITIAL DASHBOARD LOAD
  // =========================================================

  useEffect(() => {

    async function loadDashboardData() {

      try {

        const [
          dashboardResult,
          alertsResult,
          impactResult,
          recommendationResult,
          energyHistoryResult,
        ] = await Promise.all([

          getDashboardSummary(),
          getAlerts(),
          getTodayImpact(),
          getRecommendations(),
          getEnergyHistory(),
        ]);


        setDashboardData(
          dashboardResult
        );

        setAlertsData(
          alertsResult
        );

        setImpactData(
          impactResult
        );

        setRecommendationData(
          recommendationResult
        );

        setEnergyHistory(
          energyHistoryResult
        );

      } catch (err) {

        console.error(
          "Dashboard API Error:",
          err
        );


        setError(
          "Unable to load dashboard data"
        );

      } finally {

        setLoading(
          false
        );
      }
    }


    loadDashboardData();

  }, []);


  // =========================================================
  // LOAD LOCATION AI INTELLIGENCE
  // =========================================================

  async function loadLocationIntelligence({
    location = null,
    latitude = null,
    longitude = null,
  }) {

    const batteryPercentage =
      dashboardData?.battery?.percentage ??
      null;


    const result =
      await getAIIntelligence({

        location,

        latitude,

        longitude,

        tariffPerKwh: 8,

        batteryPercentage,
      });


    setAiData(
      result
    );


    setWeatherData({

      ...result.weather,

      location:
        result.weather?.location ??
        result.location,
    });


    return result;
  }


  // =========================================================
  // MANUAL LOCATION
  // =========================================================

  async function handleManualLocationSearch(
    e
  ) {

    e.preventDefault();


    const location =
      locationInput.trim();


    if (!location) {

      setLocationError(
        "Please enter a location."
      );

      return;
    }


    try {

      setWeatherLoading(
        true
      );

      setLocationError(
        ""
      );


      await loadLocationIntelligence({
        location,
      });


    } catch (error) {

      console.error(
        "Manual location AI error:",
        error
      );


      setLocationError(
        error.message ||
        "Unable to load SolarFlux intelligence for this location."
      );


    } finally {

      setWeatherLoading(
        false
      );
    }
  }


  // =========================================================
  // GPS LOCATION
  // =========================================================

  function handleUseMyLocation() {

    if (!navigator.geolocation) {

      setLocationError(
        "Location service is not supported by this browser."
      );

      return;
    }


    setWeatherLoading(
      true
    );

    setLocationError(
      ""
    );


    navigator.geolocation
      .getCurrentPosition(

        async (position) => {

          try {

            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;


            await loadLocationIntelligence({
              latitude,
              longitude,
            });


          } catch (error) {

            console.error(
              "GPS AI error:",
              error
            );


            setLocationError(
              error.message ||
              "Unable to load SolarFlux intelligence using your location."
            );


          } finally {

            setWeatherLoading(
              false
            );
          }
        },


        (error) => {

          console.error(
            "Browser location error:",
            error
          );


          if (error.code === 1) {

            setLocationError(
              "Location permission was denied. You can enter your location manually."
            );

          } else if (
            error.code === 2
          ) {

            setLocationError(
              "Your location could not be detected. Please enter it manually."
            );

          } else {

            setLocationError(
              "Location request timed out. Please try again or enter your location manually."
            );
          }


          setWeatherLoading(
            false
          );
        },


        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
  }


  // =========================================================
  // EASY EXPLAINABLE AI TEXT
  // =========================================================

  const simpleAIExplanation =
    buildSimpleExplanation(

      aiData?.explanation?.topFactors ??
      [],

      aiData?.prediction?.forecastInputs ??
      {}
    );


  // =========================================================
  // AI PREDICTION FOR WEATHER CARD
  // =========================================================

  const aiPredictionData =
    aiData
      ? {

          generation:
            aiData?.prediction
              ?.predictedGeneration ??
            "--",


          expectedSaving:
            aiData?.savings
              ?.estimatedSavings ??
            "--",


          explanation:
            simpleAIExplanation,
        }

      : undefined;


  // =========================================================
  // AI ALERTS
  // =========================================================

  const aiWarnings =
    aiData?.warning?.warnings ??
    [];


  const aiAlertsForUI =
    aiWarnings.map(
      (warning, index) => ({

        id:
          `ai-${warning.source}-${index}`,

        type:
          warning.severity ??
          "info",

        title:
          warning.title,

        message:
          warning.message,

        time:
          warning.source ===
          "weather"
            ? "Tomorrow forecast"
            : "AI intelligence",
      })
    );


  // =========================================================
  // WEATHER FALLBACK ALERT
  // =========================================================

  const weatherAlertForUI =
    !aiData &&
    weatherData?.weatherAlert

      ? {

          id:
            "weather-alert",

          type:
            weatherData
              .weatherAlert
              .type ??
            "warning",

          title:
            weatherData
              .weatherAlert
              .title,

          message:
            weatherData
              .weatherAlert
              .message,

          time:
            "Tomorrow forecast",
        }

      : null;


  // =========================================================
  // FINAL ALERT LIST
  // =========================================================

  const combinedAlerts = [

    ...aiAlertsForUI,

    ...(weatherAlertForUI
      ? [weatherAlertForUI]
      : []),

    ...alertsData,
  ];


  // =========================================================
  // SMART RECOMMENDATION
  // =========================================================

  const smartRecommendationData =
    aiData?.recommendation ??
    recommendationData;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center">

        <p>
          Loading SolarFlux dashboard...
        </p>

      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="flex min-h-screen items-center justify-center">

        <p>
          {error}
        </p>

      </div>
    );
  }


  // =========================================================
  // DASHBOARD UI
  // =========================================================

  return (

    <div
      className="relative min-h-screen overflow-x-hidden transition-colors duration-1000"

      style={{
        color:
          theme.text,
      }}
    >

      {/* BACKGROUND */}

      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"

        style={{
          backgroundImage:
            `url(${theme.backgroundImage})`,
        }}
      />


      {/* OVERLAY */}

      <div
        className="pointer-events-none fixed inset-0 z-[1] transition-colors duration-1000"

        style={{
          backgroundColor:
            theme.overlay,
        }}
      />


      <div className="relative z-10">

        <DashboardNavbar

          theme={
            theme
          }

          themeName={
            themeName
          }

          currentTime={
            currentTime
          }
        />


        <main className="mx-auto max-w-[1500px] px-6 py-8 lg:px-8">

          <DashboardHeader

            theme={
              theme
            }

            themeName={
              themeName
            }

            currentTime={
              currentTime
            }
          />


          <LocationSearch

            locationInput={
              locationInput
            }

            setLocationInput={
              setLocationInput
            }

            onManualSearch={
              handleManualLocationSearch
            }

            onUseMyLocation={
              handleUseMyLocation
            }

            loading={
              weatherLoading
            }

            theme={
              theme
            }
          />


          {locationError && (

            <div
              style={{
                marginBottom:
                  "14px",

                fontSize:
                  "14px",

                color:
                  "#b45309",
              }}
            >
              {locationError}
            </div>
          )}


          {/* KPI CARDS */}

          <KpiCards

            theme={
              theme
            }

            data={
              dashboardData
            }
          />


          {/* ROW 1 */}

          <div className="mt-6 grid items-stretch gap-6 xl:grid-cols-[1.6fr_0.8fr]">

            <div className="h-full">

              <EnergyChart

                theme={
                  theme
                }

                data={
                  energyHistory
                }
              />

            </div>


            <div className="h-full">

              <WeatherCard

                theme={
                  theme
                }

                themeName={
                  themeName
                }

                weatherData={
                  weatherData
                }

                predictionData={
                  aiPredictionData
                }
              />

            </div>

          </div>

{/* FUTURE SOLAR ENERGY FORECAST */}

<FutureEnergyForecast

  theme={
    theme
  }

  initialLocation={
    locationInput ||
    weatherData?.location ||
    ""
  }
/>
          {/* ROW 2 */}

          <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-3">

            <div className="h-full">

              <EnergyFlow

                theme={
                  theme
                }

                data={
                  dashboardData
                }
              />

            </div>


            <div className="h-full">

              <BatteryStatus

                theme={
                  theme
                }

                data={
                  dashboardData
                    ?.battery
                }
              />

            </div>


            <div className="h-full">

              <SystemHealth

                theme={
                  theme
                }

                data={
                  dashboardData
                }
              />

            </div>

          </div>


          {/* ROW 3 */}

          <div className="mt-6 grid items-stretch gap-6 xl:grid-cols-[0.8fr_1.2fr]">

            <div className="h-full">

              <ImpactCard

                theme={
                  theme
                }

                data={
                  impactData
                }
              />

            </div>


            <div className="h-full">

              <Alerts

                theme={
                  theme
                }

                data={
                  combinedAlerts
                }
              />

            </div>

          </div>


          {/* SMART RECOMMENDATION */}

          <Recommendation

            theme={
              theme
            }

            themeName={
              themeName
            }

            data={
              smartRecommendationData
            }
          />

        </main>

      </div>


      {/* THEME SWITCHER */}

      <ThemePreview

        activeTheme={
          manualTheme
        }

        automaticTheme={
          automaticTheme
        }

        setManualTheme={
          setManualTheme
        }
      />

    </div>
  );
}


export default Dashboard;