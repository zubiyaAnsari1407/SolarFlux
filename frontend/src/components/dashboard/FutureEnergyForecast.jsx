import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "motion/react";

import {
  CalendarDays,
  MapPin,
  Sun,
  Zap,
  TrendingUp,
  LoaderCircle,
  Sparkles,
  BrainCircuit,
  Cloud,
} from "lucide-react";

import {
  getSolarForecastRange,
} from "../../services/dashboardApi";


// ============================================================
// DATE HELPERS
// ============================================================

function formatInputDate(date) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;
}


function formatDisplayDate(
  dateString
) {

  if (!dateString) {
    return "";
  }


  const date =
    new Date(
      `${dateString}T00:00:00`
    );


  return date.toLocaleDateString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",
    }
  );
}


// ============================================================
// COMPONENT
// ============================================================

function FutureEnergyForecast({
  theme,
  initialLocation = "",
}) {

  // =========================================================
  // DATES
  // =========================================================

  const today =
    useMemo(
      () => new Date(),
      []
    );


  const tomorrow =
    useMemo(
      () => {

        const date =
          new Date();

        date.setDate(
          date.getDate() + 1
        );

        return date;
      },
      []
    );


  const defaultEndDate =
    useMemo(
      () => {

        const date =
          new Date();

        date.setDate(
          date.getDate() + 5
        );

        return date;
      },
      []
    );


  const maxDate =
    useMemo(
      () => {

        const date =
          new Date();

        date.setDate(
          date.getDate() + 15
        );

        return date;
      },
      []
    );


  // =========================================================
  // STATE
  // =========================================================

  const [
    location,
    setLocation,
  ] = useState(
    initialLocation
  );


  const [
    startDate,
    setStartDate,
  ] = useState(
    formatInputDate(
      tomorrow
    )
  );


  const [
    endDate,
    setEndDate,
  ] = useState(
    formatInputDate(
      defaultEndDate
    )
  );


  const [
    forecastData,
    setForecastData,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // =========================================================
  // SYNC DASHBOARD LOCATION
  // =========================================================

  useEffect(() => {

    if (
      initialLocation &&
      initialLocation.trim()
    ) {

      const timeoutId = window.setTimeout(() => {
        setLocation(initialLocation);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;

  }, [
    initialLocation,
  ]);


  // =========================================================
  // GENERATE FORECAST
  // =========================================================

  async function handleGenerateForecast(
    event
  ) {

    event.preventDefault();


    const cleanLocation =
      location.trim();


    // --------------------------------------------------------
    // LOCATION VALIDATION
    // --------------------------------------------------------

    if (!cleanLocation) {

      setError(
        "Please enter a location."
      );

      return;
    }


    // --------------------------------------------------------
    // DATE VALIDATION
    // --------------------------------------------------------

    if (
      !startDate ||
      !endDate
    ) {

      setError(
        "Please select start and end dates."
      );

      return;
    }


    const selectedStart =
      new Date(
        `${startDate}T00:00:00`
      );


    const selectedEnd =
      new Date(
        `${endDate}T00:00:00`
      );


    if (
      selectedEnd <
      selectedStart
    ) {

      setError(
        "End date cannot be before start date."
      );

      return;
    }


    // --------------------------------------------------------
    // API CALL
    // --------------------------------------------------------

    try {

      setLoading(
        true
      );


      setError(
        ""
      );


      const result =
        await getSolarForecastRange({

          location:
            cleanLocation,

          startDate,

          endDate,
        });


      console.log(
        "Future Solar Forecast:",
        result
      );


      setForecastData(
        result
      );


    } catch (err) {

      console.error(
        "Future forecast error:",
        err
      );


      setError(
        err?.message ||
        "Unable to generate future solar forecast."
      );


    } finally {

      setLoading(
        false
      );
    }
  }


  // =========================================================
  // THEME COLORS
  // =========================================================

  const isDarkTheme =
    theme?.isDark === true;


  const solarColor =
    theme?.solar ||
    "#C48A5F";


  const textColor =
    isDarkTheme
      ? "#FFFFFF"
      : "#1F2B3A";


  const mutedColor =
    isDarkTheme
      ? "rgba(255,255,255,0.68)"
      : "#5B7089";


  const secondaryTextColor =
    isDarkTheme
      ? "rgba(255,255,255,0.82)"
      : "#31445A";


  const borderColor =
    isDarkTheme
      ? "rgba(255,255,255,0.16)"
      : "rgba(49,68,90,0.16)";


  const cardBackground =
    isDarkTheme
      ? "rgba(17,31,48,0.82)"
      : "rgba(255,255,255,0.94)";


  const innerBackground =
    isDarkTheme
      ? "rgba(255,255,255,0.06)"
      : "rgba(246,248,250,0.94)";


  const inputBackground =
    isDarkTheme
      ? "rgba(255,255,255,0.07)"
      : "#F7F9FB";


  // =========================================================
  // SAFE FORECAST ARRAY
  //
  // IMPORTANT:
  // Earlier this variable was missing.
  // forecast.map() caused the white screen after Generate.
  // =========================================================

  const forecast =
    Array.isArray(
      forecastData?.forecast
    )
      ? forecastData.forecast
      : [];


  // =========================================================
  // SAFE SUMMARY VALUES
  // =========================================================

  const tomorrowPrediction =
    forecastData
      ?.tomorrowPrediction
      ?? "--";


  const totalPredictedEnergy =
    forecastData
      ?.totalPredictedEnergy
      ?? "--";


  const averageDailyEnergy =
    forecastData
      ?.averageDailyEnergy
      ?? "--";


  // =========================================================
  // UI
  // =========================================================

  return (

    <motion.section

      initial={{
        opacity:
          0,

        y:
          20,
      }}

      whileInView={{
        opacity:
          1,

        y:
          0,
      }}

      viewport={{
        once:
          true,

        amount:
          0.1,
      }}

      transition={{
        duration:
          0.6,

        ease:
          [0.22, 1, 0.36, 1],
      }}

      className="mt-6 rounded-3xl border p-6 shadow-xl backdrop-blur-xl"

      style={{

        backgroundColor:
          cardBackground,

        borderColor,

        color:
          textColor,

        boxShadow:
          isDarkTheme

            ? "0 20px 55px rgba(0,0,0,0.25)"

            : "0 20px 55px rgba(28,60,75,0.10)",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-start gap-3">

          <div

            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"

            style={{
              backgroundColor:
                `${solarColor}22`,

              color:
                solarColor,
            }}
          >

            <BrainCircuit
              size={22}
              strokeWidth={1.8}
            />

          </div>


          <div>

            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"

              style={{
                color:
                  solarColor,
              }}
            >
              AI Future Forecast
            </p>


            <h3 className="mt-1 text-xl font-semibold">

              Future Solar Energy Prediction

            </h3>


            <p
              className="mt-1 max-w-2xl text-xs leading-5"

              style={{
                color:
                  mutedColor,
              }}
            >

              Select a location and future date range to predict
              daily solar energy using weather forecasts and
              the SolarFlux XGBoost model.

            </p>

          </div>

        </div>


        {/* MODEL BADGE */}

        <div

          className="flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium"

          style={{
            borderColor,

            backgroundColor:
              innerBackground,

            color:
              secondaryTextColor,
          }}
        >

          <Sparkles
            size={12}

            style={{
              color:
                solarColor,
            }}
          />

          5 kWp AI Forecast

        </div>

      </div>


      {/* =====================================================
          FORECAST FORM
      ===================================================== */}

      <form

        onSubmit={
          handleGenerateForecast
        }

        className="mt-6 grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
      >

        {/* ===================================================
            LOCATION
        =================================================== */}

        <div>

          <label
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em]"

            style={{
              color:
                mutedColor,
            }}
          >
            Location
          </label>


          <div className="relative">

            <MapPin
              size={15}

              className="absolute left-3 top-1/2 -translate-y-1/2"

              style={{
                color:
                  mutedColor,
              }}
            />


            <input

              type="text"

              value={
                location
              }

              onChange={
                (
                  event
                ) =>
                  setLocation(
                    event.target.value
                  )
              }

              placeholder="Mumbai"

              className="h-11 w-full rounded-xl border pl-9 pr-3 text-sm outline-none transition focus:ring-2"

              style={{
                borderColor,

                backgroundColor:
                  inputBackground,

                color:
                  textColor,

                "--tw-ring-color":
                  `${solarColor}55`,
              }}
            />

          </div>

        </div>


        {/* ===================================================
            START DATE
        =================================================== */}

        <div>

          <label
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em]"

            style={{
              color:
                mutedColor,
            }}
          >
            Start Date
          </label>


          <div className="relative">

            <CalendarDays
              size={15}

              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"

              style={{
                color:
                  mutedColor,
              }}
            />


            <input

              type="date"

              value={
                startDate
              }

              min={
                formatInputDate(
                  today
                )
              }

              max={
                formatInputDate(
                  maxDate
                )
              }

              onChange={
                (
                  event
                ) =>
                  setStartDate(
                    event.target.value
                  )
              }

              className="h-11 w-full rounded-xl border pl-9 pr-3 text-sm outline-none transition focus:ring-2"

              style={{
                borderColor,

                backgroundColor:
                  inputBackground,

                color:
                  textColor,

                colorScheme:
                  isDarkTheme
                    ? "dark"
                    : "light",

                "--tw-ring-color":
                  `${solarColor}55`,
              }}
            />

          </div>

        </div>


        {/* ===================================================
            END DATE
        =================================================== */}

        <div>

          <label
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em]"

            style={{
              color:
                mutedColor,
            }}
          >
            End Date
          </label>


          <div className="relative">

            <CalendarDays
              size={15}

              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"

              style={{
                color:
                  mutedColor,
              }}
            />


            <input

              type="date"

              value={
                endDate
              }

              min={
                startDate ||
                formatInputDate(
                  today
                )
              }

              max={
                formatInputDate(
                  maxDate
                )
              }

              onChange={
                (
                  event
                ) =>
                  setEndDate(
                    event.target.value
                  )
              }

              className="h-11 w-full rounded-xl border pl-9 pr-3 text-sm outline-none transition focus:ring-2"

              style={{
                borderColor,

                backgroundColor:
                  inputBackground,

                color:
                  textColor,

                colorScheme:
                  isDarkTheme
                    ? "dark"
                    : "light",

                "--tw-ring-color":
                  `${solarColor}55`,
              }}
            />

          </div>

        </div>


        {/* ===================================================
            GENERATE BUTTON
        =================================================== */}

        <div className="flex items-end">

          <button

            type="submit"

            disabled={
              loading
            }

            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"

            style={{
              backgroundColor:
                solarColor,
            }}
          >

            {loading ? (

              <LoaderCircle
                size={16}
                className="animate-spin"
              />

            ) : (

              <Sun
                size={16}
              />

            )}


            {
              loading
                ? "Predicting..."
                : "Generate Forecast"
            }

          </button>

        </div>

      </form>


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (

        <motion.div

          initial={{
            opacity:
              0,

            y:
              -5,
          }}

          animate={{
            opacity:
              1,

            y:
              0,
          }}

          className="mt-4 rounded-xl border px-4 py-3 text-sm"

          style={{

            borderColor:
              "rgba(196,90,70,0.35)",

            backgroundColor:
              "rgba(196,90,70,0.08)",

            color:
              textColor,
          }}
        >

          {error}

        </motion.div>

      )}


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!forecastData && !loading && (

        <div
          className="mt-6 flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-dashed text-center"

          style={{
            borderColor,

            backgroundColor:
              innerBackground,
          }}
        >

          <Sun
            size={27}

            style={{
              color:
                solarColor,
            }}
          />


          <p className="mt-3 text-sm font-medium">

            Select dates to generate your solar forecast

          </p>


          <p
            className="mt-1 text-xs"

            style={{
              color:
                mutedColor,
            }}
          >

            SolarFlux will show date-wise predicted solar energy.

          </p>

        </div>

      )}


      {/* =====================================================
          LOADING STATE
      ===================================================== */}

      {loading && (

        <div
          className="mt-6 flex min-h-[140px] items-center justify-center rounded-2xl border"

          style={{
            borderColor,

            backgroundColor:
              innerBackground,
          }}
        >

          <div className="text-center">

            <LoaderCircle
              size={27}

              className="mx-auto animate-spin"

              style={{
                color:
                  solarColor,
              }}
            />


            <p className="mt-3 text-sm font-medium">

              Generating solar forecast...

            </p>


            <p
              className="mt-1 text-xs"

              style={{
                color:
                  mutedColor,
              }}
            >

              Analyzing weather conditions with XGBoost.

            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          RESULTS
      ===================================================== */}

      {forecastData && !loading && (

        <motion.div

          initial={{
            opacity:
              0,

            y:
              12,
          }}

          animate={{
            opacity:
              1,

            y:
              0,
          }}

          transition={{
            duration:
              0.45,
          }}

          className="mt-7"
        >

          {/* =================================================
              LOCATION + MODEL
          ================================================= */}

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2 text-xs">

              <MapPin
                size={14}

                style={{
                  color:
                    solarColor,
                }}
              />


              <span
                className="font-medium"

                style={{
                  color:
                    secondaryTextColor,
                }}
              >

                {
                  forecastData?.location ||
                  location
                }

              </span>

            </div>


            <span
              className="text-[11px]"

              style={{
                color:
                  mutedColor,
              }}
            >

              {
                forecastData?.model ||
                "XGBoost"
              }

              {" • "}

              {
                forecastData
                  ?.systemCapacity
                ?? 5
              }{" "}

              {
                forecastData
                  ?.systemCapacityUnit
                ?? "kWp"
              }

            </span>

          </div>


          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="mt-5 grid gap-3 md:grid-cols-3">

            {/* TOMORROW */}

            <motion.div

              whileHover={{
                y:
                  -3,
              }}

              className="rounded-2xl border p-4"

              style={{
                borderColor,

                backgroundColor:
                  innerBackground,
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.12em]"

                    style={{
                      color:
                        mutedColor,
                    }}
                  >
                    Tomorrow Prediction
                  </p>


                  <p
                    className="mt-2 text-2xl font-semibold"

                    style={{
                      color:
                        textColor,
                    }}
                  >

                    {
                      tomorrowPrediction
                    }

                    <span
                      className="ml-1 text-xs font-medium"

                      style={{
                        color:
                          mutedColor,
                      }}
                    >
                      kWh
                    </span>

                  </p>

                </div>


                <Sun
                  size={22}

                  style={{
                    color:
                      solarColor,
                  }}
                />

              </div>

            </motion.div>


            {/* TOTAL */}

            <motion.div

              whileHover={{
                y:
                  -3,
              }}

              className="rounded-2xl border p-4"

              style={{
                borderColor,

                backgroundColor:
                  innerBackground,
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.12em]"

                    style={{
                      color:
                        mutedColor,
                    }}
                  >
                    Total Predicted Energy
                  </p>


                  <p
                    className="mt-2 text-2xl font-semibold"

                    style={{
                      color:
                        textColor,
                    }}
                  >

                    {
                      totalPredictedEnergy
                    }

                    <span
                      className="ml-1 text-xs font-medium"

                      style={{
                        color:
                          mutedColor,
                      }}
                    >
                      kWh
                    </span>

                  </p>

                </div>


                <Zap
                  size={22}

                  style={{
                    color:
                      solarColor,
                  }}
                />

              </div>

            </motion.div>


            {/* AVERAGE */}

            <motion.div

              whileHover={{
                y:
                  -3,
              }}

              className="rounded-2xl border p-4"

              style={{
                borderColor,

                backgroundColor:
                  innerBackground,
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.12em]"

                    style={{
                      color:
                        mutedColor,
                    }}
                  >
                    Average / Day
                  </p>


                  <p
                    className="mt-2 text-2xl font-semibold"

                    style={{
                      color:
                        textColor,
                    }}
                  >

                    {
                      averageDailyEnergy
                    }

                    <span
                      className="ml-1 text-xs font-medium"

                      style={{
                        color:
                          mutedColor,
                      }}
                    >
                      kWh
                    </span>

                  </p>

                </div>


                <TrendingUp
                  size={22}

                  style={{
                    color:
                      solarColor,
                  }}
                />

              </div>

            </motion.div>

          </div>


          {/* =================================================
              DATE-WISE FORECAST
          ================================================= */}

          <div className="mt-5">

            <div className="flex items-center justify-between gap-3">

              <div>

                <p
                  className="text-sm font-semibold"

                  style={{
                    color:
                      textColor,
                  }}
                >

                  Date-wise Energy Forecast

                </p>


                <p
                  className="mt-1 text-[11px]"

                  style={{
                    color:
                      mutedColor,
                  }}
                >

                  Daily predicted solar generation for the selected range

                </p>

              </div>


              <div
                className="rounded-full px-3 py-1 text-[10px]"

                style={{
                  backgroundColor:
                    `${solarColor}14`,

                  color:
                    solarColor,
                }}
              >

                {
                  forecast.length
                }{" "}

                {
                  forecast.length === 1
                    ? "Day"
                    : "Days"
                }

              </div>

            </div>


            {/* =================================================
                DAILY CARDS
            ================================================= */}

            {forecast.length > 0 ? (

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                {
                  forecast.map(
                    (
                      item,
                      index
                    ) => {

                      const predictedEnergy =
                        item
                          ?.predictedEnergy
                        ?? "--";


                      const cloudCover =
                        item
                          ?.weatherInputs
                          ?.averageCloudCover
                        ?? "--";


                      const sunshineHours =
                        item
                          ?.weatherInputs
                          ?.sunshineHours
                        ?? "--";


                      const solarRadiation =
                        item
                          ?.weatherInputs
                          ?.averageSolarRadiation
                        ?? "--";


                      return (

                        <motion.div

                          key={
                            item?.date ||
                            index
                          }

                          initial={{
                            opacity:
                              0,

                            y:
                              10,
                          }}

                          animate={{
                            opacity:
                              1,

                            y:
                              0,
                          }}

                          transition={{
                            delay:
                              index * 0.05,
                          }}

                          whileHover={{
                            y:
                              -4,
                          }}

                          className="rounded-2xl border p-4"

                          style={{
                            borderColor,

                            backgroundColor:
                              innerBackground,
                          }}
                        >

                          {/* DATE */}

                          <div className="flex items-center justify-between">

                            <p
                              className="text-[10px] font-semibold uppercase tracking-[0.12em]"

                              style={{
                                color:
                                  mutedColor,
                              }}
                            >

                              {
                                formatDisplayDate(
                                  item?.date
                                )
                              }

                            </p>


                            <Sun
                              size={15}

                              style={{
                                color:
                                  solarColor,
                              }}
                            />

                          </div>


                          {/* ENERGY */}

                          <p
                            className="mt-3 text-xl font-semibold"

                            style={{
                              color:
                                textColor,
                            }}
                          >

                            {
                              predictedEnergy
                            }

                            <span
                              className="ml-1 text-[10px] font-medium"

                              style={{
                                color:
                                  mutedColor,
                              }}
                            >
                              kWh
                            </span>

                          </p>


                          {/* WEATHER INPUTS */}

                          <div
                            className="mt-3 space-y-1 text-[11px] leading-5"

                            style={{
                              color:
                                secondaryTextColor,
                            }}
                          >

                            <div className="flex items-center gap-1.5">

                              <Cloud
                                size={11}
                              />

                              <span>

                                Cloud:{" "}

                                {
                                  cloudCover
                                }

                                {
                                  cloudCover !== "--"
                                    ? "%"
                                    : ""
                                }

                              </span>

                            </div>


                            <p>

                              Sunshine:{" "}

                              {
                                sunshineHours
                              }

                              {
                                sunshineHours !== "--"
                                  ? " hrs"
                                  : ""
                              }

                            </p>


                            <p>

                              Radiation:{" "}

                              {
                                solarRadiation
                              }

                              {
                                solarRadiation !== "--"
                                  ? " W/m²"
                                  : ""
                              }

                            </p>

                          </div>

                        </motion.div>
                      );
                    }
                  )
                }

              </div>

            ) : (

              <div
                className="mt-4 rounded-2xl border border-dashed p-6 text-center"

                style={{
                  borderColor,

                  color:
                    mutedColor,
                }}
              >

                No date-wise forecast data available.

              </div>

            )}

          </div>


          {/* =================================================
              AI NOTE
          ================================================= */}

          <div
            className="mt-5 flex items-start gap-2 text-[11px] leading-5"

            style={{
              color:
                secondaryTextColor,
            }}
          >

            {/* <Sparkles
              size={13}

              className="mt-0.5 shrink-0"

              style={{
                color:
                  solarColor,
              }}
            /> */}

{/* 
            <span>

              These values are AI-predicted solar energy estimates
              based on future weather conditions. They are not actual
              measured generation readings.

            </span> */}

          </div>

        </motion.div>

      )}

    </motion.section>
  );
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default FutureEnergyForecast;