// src/components/dashboard/WeatherCard.jsx

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "motion/react";

import {
  CloudSun,
  Sun,
  Cloud,
  Wind,
  Droplets,
  BrainCircuit,
  MapPin,
  Sparkles,
  Gauge,
  CloudRain,
  Clock3,
  RefreshCw,
} from "lucide-react";

import morningWeather
  from "../../assets/weather-card-morning-img.png";

import afternoonWeather
  from "../../assets/weather-card-afternoon-img.png";

import eveningWeather
  from "../../assets/weather-card-evening-img.png";

import nightWeather
  from "../../assets/weather-card-night-img.png";


const weatherBackgrounds = {
  morning: morningWeather,
  afternoon: afternoonWeather,
  evening: eveningWeather,
  night: nightWeather,
};


const defaultWeatherData = {

  temperature:
    "--",

  feelsLike:
    "--",

  condition:
    "Select a location",

  location:
    "Location not selected",

  humidity:
    "--",

  windSpeed:
    "--",

  cloudCover:
    "--",

  sunlightHours:
    "--",

  today: {

    rainExpected:
      false,

    rainProbability:
      null,

    rainWindow:
      null,
  },

  tomorrow: {

    high:
      "--",

    low:
      "--",

    condition:
      "Waiting for forecast",

    rainProbability:
      "--",

    rainExpected:
      false,

    rainWindow:
      null,
  },
};


const defaultPredictionData = {

  generation:
    "--",

  expectedSaving:
    "--",

  explanation:
    "Select a location to generate SolarFlux AI prediction and explanation.",
};


const themeWeatherContent = {

  morning: {

    label:
      "Morning Forecast",

    description:
      "Fresh sunlight conditions with good early solar potential.",
  },


  afternoon: {

    label:
      "Daylight Forecast",

    description:
      "Strong sunlight conditions with high solar generation potential.",
  },


  evening: {

    label:
      "Sunset Forecast",

    description:
      "Solar production is gradually reducing as daylight fades.",
  },


  night: {

    label:
      "Night Forecast",

    description:
      "Solar generation is inactive while tomorrow's conditions are being analyzed.",
  },
};


function WeatherCard({
  theme,
  themeName,
  weatherData,
  predictionData,
}) {

  // =========================================================
  // LAST UPDATED
  // =========================================================

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(null);


  useEffect(() => {

    if (
      weatherData &&
      weatherData.location &&
      weatherData.location !==
        "Location not selected"
    ) {

      setLastUpdated(
        new Date()
      );
    }

  }, [
    weatherData,
  ]);


  const formattedLastUpdated =
    lastUpdated
      ? lastUpdated.toLocaleTimeString(
          [],
          {
            hour:
              "2-digit",

            minute:
              "2-digit",
          }
        )
      : "--:--";


  // =========================================================
  // SAFE DATA
  // =========================================================

  const safeWeatherData =
    weatherData ??
    defaultWeatherData;


  const safePredictionData =
    predictionData ??
    defaultPredictionData;


  const safeToday =
    safeWeatherData?.today ??
    defaultWeatherData.today;


  const safeTomorrow =
    safeWeatherData?.tomorrow ??
    defaultWeatherData.tomorrow;


  // =========================================================
  // TODAY RAIN
  // =========================================================

  const shouldShowTodayRain =
    safeToday?.rainExpected ===
      true
    &&
    Boolean(
      safeToday?.rainWindow
    );


  // =========================================================
  // TOMORROW RAIN
  // =========================================================

  const tomorrowHasRainWindow =
    safeTomorrow?.rainExpected ===
      true
    &&
    Boolean(
      safeTomorrow?.rainWindow
    );


  // =========================================================
  // THEME
  // =========================================================

  const weatherImage =
    weatherBackgrounds[
      themeName
    ] ??
    afternoonWeather;


  const content =
    themeWeatherContent[
      themeName
    ] ??
    themeWeatherContent
      .afternoon;


  const imageOverlay =
    themeName === "morning"

      ? "rgba(10, 18, 14, 0.36)"

      : themeName === "afternoon"

      ? "rgba(26, 57, 108, 0.42)"

      : themeName === "evening"

      ? "rgba(24, 24, 66, 0.48)"

      : "rgba(3, 15, 29, 0.58)";


  const morningMetricBg =
    themeName === "morning"

      ? "rgba(10, 18, 100, 0.24)"

      : undefined;


  const morningStrongBg =
    themeName === "morning"

      ? "rgba(10, 28, 80, 0.30)"

      : undefined;


  return (

    <motion.section

      initial={{
        opacity: 0,
        x: 35,
      }}

      whileInView={{
        opacity: 1,
        x: 0,
      }}

      viewport={{
        once: true,
        amount: 0.2,
      }}

      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}

      className="group relative min-h-[420px] overflow-hidden rounded-3xl border shadow-xl"

      style={{
        borderColor:
          theme.border,

        color:
          "#FFFFFF",

        boxShadow:
          theme.isDark

            ? "0 18px 50px rgba(0,0,0,0.28)"

            : "0 18px 50px rgba(28,60,75,0.12)",
      }}
    >

      {/* BACKGROUND */}

      <motion.div

        key={
          themeName
        }

        initial={{
          opacity: 0,
          scale: 1.05,
        }}

        animate={{
          opacity: 1,
          scale: 1,
        }}

        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}

        className="absolute inset-0 bg-cover bg-center"

        style={{
          backgroundImage:
            `url(${weatherImage})`,
        }}
      />


      {/* OVERLAY */}

      <div
        className="absolute inset-0 transition-colors duration-1000"

        style={{
          backgroundColor:
            imageOverlay,
        }}
      />


      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-[1px]" />


      {/* MOVING LIGHT */}

      <motion.div

        animate={{
          x: [-60, 80, -60],
          y: [0, -25, 0],
        }}

        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}

        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl"

        style={{
          backgroundColor:

            themeName === "night"

              ? "rgba(105,165,205,0.18)"

              : themeName === "evening"

              ? "rgba(240,145,105,0.20)"

              : "rgba(255,220,130,0.22)",
        }}
      />


      {/* CONTENT */}

      <div className="relative z-10 flex h-full flex-col p-6 md:p-7">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <motion.div

              animate={{
                rotate:
                  themeName === "morning" ||
                  themeName === "afternoon"

                    ? [0, 6, -4, 0]

                    : 0,
              }}

              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}

              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl"
            >

              <CloudSun
                size={22}
                strokeWidth={1.8}
              />

            </motion.div>


            <div>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/65">
                {content.label}
              </p>


              <h3 className="mt-1 text-xl font-semibold">
                Weather Intelligence
              </h3>


              <div className="mt-1 flex items-center gap-1.5 text-xs text-white/65">

                <MapPin
                  size={12}
                />

                {
                  safeWeatherData.location
                }

              </div>

            </div>

          </div>


          {/* =================================================
              LIVE + LAST UPDATED
          ================================================= */}

          <div className="flex flex-wrap items-center justify-end gap-2">

            {/* LIVE */}

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[10px] backdrop-blur-xl">

              <motion.span

                animate={{
                  opacity:
                    [1, 0.35, 1],

                  scale:
                    [1, 1.25, 1],
                }}

                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}

                className="h-2 w-2 rounded-full"

                style={{
                  backgroundColor:
                    theme.success,
                }}
              />

              <span className="font-medium">
                Live
              </span>

            </div>


            {/* LAST UPDATED */}

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[10px] backdrop-blur-xl">

              <RefreshCw
                size={11}
                className="text-white/65"
              />

              <span className="text-white/55">
                Updated
              </span>

              <span className="font-medium text-white/90">
                {
                  formattedLastUpdated
                }
              </span>

            </div>

          </div>

        </div>


        {/* CURRENT WEATHER */}

        <div className="mt-8 flex items-end gap-4">

          <motion.p

            key={
              `${themeName}-${safeWeatherData.temperature}`
            }

            initial={{
              opacity: 0,
              y: 15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            className="text-6xl font-light tracking-tight"
          >

            {
              safeWeatherData.temperature
            }°

          </motion.p>


          <div className="mb-1">

            <p className="text-sm font-medium">

              {
                safeWeatherData.condition
              }

            </p>


            <p className="mt-1 text-xs text-white/65">

              Feels like{" "}

              {
                safeWeatherData.feelsLike
              }°

            </p>

          </div>

        </div>


        <p className="mt-4 max-w-sm text-xs leading-5 text-white/70">

          {
            content.description
          }

        </p>


        {/* =================================================
            TODAY RAIN
        ================================================= */}

        {shouldShowTodayRain && (

          <motion.div

            whileHover={{
              y: -2,
            }}

            className="mt-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/10 px-4 py-3 backdrop-blur-xl"

            style={{
              backgroundColor:
                morningMetricBg,
            }}
          >

            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"

              style={{
                backgroundColor:
                  "rgba(255,255,255,0.12)",
              }}
            >

              <CloudRain
                size={17}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Today's Rain
              </p>


              <p className="mt-1 text-[11px] font-medium text-white/85">

                {
                  safeToday.rainWindow
                }

              </p>


              <p className="mt-1 text-[10px] text-white/60">

                Chance during window:{" "}

                {
                  safeToday.rainProbability
                }%

              </p>

            </div>

          </motion.div>

        )}


        {/* WEATHER METRICS */}

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">

          {/* HUMIDITY */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="rounded-2xl border border-white/15 bg-black/10 p-3 backdrop-blur-xl"
            style={{
              backgroundColor:
                morningMetricBg,
            }}
          >

            <Droplets
              size={16}
              className="text-white/85"
            />

            <p className="mt-3 text-[9px] uppercase tracking-wider text-white/50">
              Humidity
            </p>

            <p className="mt-1 text-xs font-semibold">
              {
                safeWeatherData.humidity
              }%
            </p>

          </motion.div>


          {/* WIND */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="rounded-2xl border border-white/15 bg-black/10 p-3 backdrop-blur-xl"
            style={{
              backgroundColor:
                morningMetricBg,
            }}
          >

            <Wind
              size={16}
              className="text-white/85"
            />

            <p className="mt-3 text-[9px] uppercase tracking-wider text-white/50">
              Wind
            </p>

            <p className="mt-1 text-xs font-semibold">
              {
                safeWeatherData.windSpeed
              } km/h
            </p>

          </motion.div>


          {/* CLOUD */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="rounded-2xl border border-white/15 bg-black/10 p-3 backdrop-blur-xl"
            style={{
              backgroundColor:
                morningMetricBg,
            }}
          >

            <Cloud
              size={16}
              className="text-white/85"
            />

            <p className="mt-3 text-[9px] uppercase tracking-wider text-white/50">
              Clouds
            </p>

            <p className="mt-1 text-xs font-semibold">
              {
                safeWeatherData.cloudCover
              }%
            </p>

          </motion.div>


          {/* SUNLIGHT */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="rounded-2xl border border-white/15 bg-black/10 p-3 backdrop-blur-xl"
            style={{
              backgroundColor:
                morningMetricBg,
            }}
          >

            <Sun
              size={16}
              style={{
                color:
                  theme.solar,
              }}
            />

            <p className="mt-3 text-[9px] uppercase tracking-wider text-white/50">
              Sunlight
            </p>

            <p className="mt-1 text-xs font-semibold">
              {
                safeWeatherData.sunlightHours
              } hrs
            </p>

          </motion.div>

        </div>


        <div className="my-6 h-px bg-white/15" />


        {/* AI PREDICTION + TOMORROW */}

        <div className="grid gap-3 md:grid-cols-2">

          {/* AI */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-xl"
            style={{
              backgroundColor:
                morningStrongBg,
            }}
          >

            <div className="flex items-center gap-3">

              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "rgba(255,255,255,0.14)",
                }}
              >

                <BrainCircuit
                  size={18}
                  strokeWidth={1.8}
                />

              </div>


              <div>

                <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">
                  AI Prediction
                </p>


                <p className="mt-1 text-xl font-semibold">

                  {
                    safePredictionData.generation
                  } kWh

                </p>

              </div>

            </div>


            <p className="mt-3 text-[11px] leading-5 text-white/65">
              Expected solar generation tomorrow.
            </p>

          </motion.div>


          {/* TOMORROW */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="rounded-2xl border border-white/15 bg-black/12 p-4 backdrop-blur-xl"
            style={{
              backgroundColor:
                morningStrongBg,
            }}
          >

            <div className="flex items-center gap-3">

              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "rgba(255,255,225,0.14)",
                  color:
                    theme.solar,
                }}
              >

                <Sun
                  size={18}
                  strokeWidth={1.8}
                />

              </div>


              <div>

                <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">
                  Tomorrow
                </p>


                <p className="mt-1 text-sm font-semibold">

                  {
                    safeTomorrow.high
                  }°

                  {" / "}

                  {
                    safeTomorrow.low
                  }°

                </p>

              </div>

            </div>


            <div className="mt-3 space-y-1.5">

              <p className="text-[11px] text-white/70">

                {
                  safeTomorrow.condition
                }

              </p>


              {tomorrowHasRainWindow ? (

                <>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/80">

                    <Clock3
                      size={13}
                    />

                    <span>
                      {
                        safeTomorrow.rainWindow
                      }
                    </span>

                  </div>


                  <div className="flex items-center gap-1.5 text-[10px] text-white/60">

                    <Droplets
                      size={12}
                    />

                    <span>

                      Chance during window:{" "}

                      {
                        safeTomorrow.rainProbability
                      }%

                    </span>

                  </div>
                </>

              ) : (

                <div className="flex items-center gap-1.5 text-[11px] text-white/70">

                  <Droplets
                    size={13}
                  />

                  <span>
                    No significant rain window expected
                  </span>

                </div>
              )}

            </div>

          </motion.div>

        </div>


        {/* EXPLAINABLE AI */}

        <motion.div

          initial={{
            opacity: 0,
            y: 10,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          className="mt-4 rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-xl"

          style={{
            backgroundColor:
              morningStrongBg,
          }}
        >

          <div className="flex items-start gap-3">

            <Sparkles
              size={17}
              className="mt-0.5 shrink-0"
              style={{
                color:
                  theme.solar,
              }}
            />


            <div>

              <p
                className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                style={{
                  color:
                    theme.solar,
                }}
              >
                Explainable AI
              </p>


              <p className="mt-2 text-base leading-6 text-white/80">

                {
                  safePredictionData.explanation
                }

              </p>

            </div>

          </div>

        </motion.div>


        {/* SAVINGS */}

        <div
          className="mt-4 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl"
          style={{
            backgroundColor:
              morningMetricBg,
          }}
        >

          <div className="flex items-center gap-2 text-xs text-white/60">

            <Gauge
              size={14}
            />

            Expected saving tomorrow

          </div>


          <span
            className="font-semibold"
            style={{
              color:
                theme.solar,
            }}
          >

            ₹{
              safePredictionData
                .expectedSaving
            }

          </span>

        </div>

      </div>

    </motion.section>
  );
}


export default WeatherCard;