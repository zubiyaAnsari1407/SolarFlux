import {
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "motion/react";

import {
  BrainCircuit,
  Zap,
  Moon,
  Sunset,
  Sun,
  ArrowRight,
  X,
  CloudRain,
  Battery,
  IndianRupee,
  Gauge,
  Lightbulb,
} from "lucide-react";


const defaultRecommendationContent = {

  morning: {
    title:
      "Prepare for today's solar peak",

    text:
      "Solar generation is increasing. Consider scheduling higher-energy appliances for the upcoming peak sunlight window.",

    detail:
      "Solar output is expected to increase during the morning. Use this period to prepare for stronger solar generation later in the day.",
  },


  afternoon: {
    title:
      "Use high-power appliances now",

    text:
      "Solar production is currently strong. Running high-energy appliances now can increase direct solar usage and reduce grid dependency.",

    detail:
      "This is usually the strongest solar production period. Using available solar energy directly can reduce dependence on stored battery energy and grid electricity.",
  },


  evening: {
    title:
      "Shift to stored solar energy",

    text:
      "Solar generation is decreasing as daylight fades. Battery power can now support evening household consumption.",

    detail:
      "Solar generation is falling as daylight reduces. Stored battery energy can support evening consumption while preserving enough reserve for later usage.",
  },


  night: {
    title:
      "Let your battery do the work",

    text:
      "Solar generation is inactive. Your system can use stored battery energy while preparing tomorrow's solar forecast.",

    detail:
      "Solar panels are not generating energy at night. Stored battery energy can support household loads while SolarFlux analyzes tomorrow's weather and expected solar generation.",
  },
};


const recommendationIcons = {
  morning: Sun,
  afternoon: Zap,
  evening: Sunset,
  night: Moon,
};


function Recommendation({
  theme,
  themeName,
  data,
}) {

  const [
    showOptimization,
    setShowOptimization,
  ] = useState(false);


  if (!theme) {
    return null;
  }


  const aiRecommendation =
    data?.primaryRecommendation;


  const defaultContent =
    data?.[themeName] ??

    defaultRecommendationContent[
      themeName
    ] ??

    defaultRecommendationContent
      .afternoon;


  const content =
    aiRecommendation
      ? {

          title:
            aiRecommendation.title,

          text:
            aiRecommendation.message,

          detail:
            aiRecommendation.message,

        }

      : defaultContent;


  const ModeIcon =
    recommendationIcons[
      themeName
    ] ?? Zap;


  const priority =
    aiRecommendation?.priority;


  // =========================================================
  // OPTIONAL LIVE / AI DATA
  // =========================================================

  const batteryPercentage =
    data?.batteryPercentage ??
    data?.battery ??
    "--";


  const predictedGeneration =
    data?.predictedGeneration ??
    data?.prediction?.generation ??
    "--";


  const expectedSaving =
    data?.expectedSaving ??
    data?.savings ??
    "--";


  const weatherCondition =
    data?.weatherCondition ??
    data?.weather ??
    "--";


  return (
    <>

      {/* =====================================================
          MAIN RECOMMENDATION CARD
      ===================================================== */}

      <motion.section

        initial={{
          opacity: 0,
          y: 30,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
        }}

        className="relative mt-6 mb-28 overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-1000"

        style={{
          backgroundColor:
            theme.cardBg,

          borderColor:
            theme.border,

          color:
            theme.text,
        }}
      >

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div className="flex gap-4">

            <motion.div

              animate={{
                y: [0, -3, 0],
              }}

              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}

              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"

              style={{
                backgroundColor:
                  theme.softGold,

                color:
                  theme.solar,
              }}
            >

              <BrainCircuit
                size={22}
                strokeWidth={1.8}
              />

            </motion.div>


            <div>

              <div
                className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]"

                style={{
                  color:
                    theme.primary,
                }}
              >

                <ModeIcon
                  size={13}
                />

                SolarFlux Smart Recommendation

              </div>


              <div className="mt-2 flex flex-wrap items-center gap-2">

                <h3 className="text-lg font-semibold">
                  {content.title}
                </h3>


                {priority && (

                  <span
                    className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider"

                    style={{
                      borderColor:
                        theme.border,

                      color:
                        priority === "high"
                          ? theme.consumption
                          : theme.primary,

                      backgroundColor:
                        priority === "high"
                          ? theme.softOrange
                          : theme.softBlue,
                    }}
                  >
                    {priority} priority
                  </span>

                )}

              </div>


              <p
                className="mt-2 max-w-4xl text-sm leading-6"

                style={{
                  color:
                    theme.muted,
                }}
              >
                {content.text}
              </p>


              {data?.recommendationCount >
                1 && (

                <p
                  className="mt-2 text-[11px]"

                  style={{
                    color:
                      theme.muted,
                  }}
                >
                  {
                    data.recommendationCount
                  } optimization insights available
                </p>

              )}

            </div>

          </div>


          {/* BUTTON */}

          <motion.button

            onClick={() =>
              setShowOptimization(true)
            }

            whileHover={{
              y: -2,
              scale: 1.03,
            }}

            whileTap={{
              scale: 0.97,
            }}

            className="flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white"

            style={{
              backgroundColor:
                theme.primary,
            }}
          >

            View Optimization

            <ArrowRight
              size={15}
            />

          </motion.button>

        </div>

      </motion.section>


      {/* =====================================================
          OPTIMIZATION MODAL
      ===================================================== */}

      <AnimatePresence>

        {showOptimization && (

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"

            onClick={() =>
              setShowOptimization(false)
            }
          >

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}

              transition={{
                duration: 0.25,
              }}

              onClick={(event) =>
                event.stopPropagation()
              }

              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border p-6 shadow-2xl"

              style={{
                backgroundColor:
                  theme.cardBg,

                borderColor:
                  theme.border,

                color:
                  theme.text,
              }}
            >

              {/* HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"

                    style={{
                      backgroundColor:
                        theme.softGold,

                      color:
                        theme.solar,
                    }}
                  >
                    <BrainCircuit
                      size={21}
                    />
                  </div>


                  <div>

                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.16em]"

                      style={{
                        color:
                          theme.primary,
                      }}
                    >
                      SolarFlux Optimization
                    </p>


                    <h3 className="mt-1 text-xl font-semibold">
                      {content.title}
                    </h3>

                  </div>

                </div>


                <button

                  onClick={() =>
                    setShowOptimization(false)
                  }

                  className="flex h-9 w-9 items-center justify-center rounded-xl border"

                  style={{
                    borderColor:
                      theme.border,

                    color:
                      theme.muted,
                  }}
                >

                  <X
                    size={17}
                  />

                </button>

              </div>


              {/* DESCRIPTION */}

              <p
                className="mt-5 text-sm leading-6"

                style={{
                  color:
                    theme.muted,
                }}
              >
                {content.detail}
              </p>


              {/* METRICS */}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <div
                  className="rounded-2xl border p-4"

                  style={{
                    borderColor:
                      theme.border,

                    backgroundColor:
                      theme.softBlue,
                  }}
                >

                  <Battery
                    size={18}

                    style={{
                      color:
                        theme.success,
                    }}
                  />


                  <p
                    className="mt-3 text-xs"

                    style={{
                      color:
                        theme.muted,
                    }}
                  >
                    Battery Status
                  </p>


                  <p className="mt-1 text-lg font-semibold">
                    {batteryPercentage}
                    {
                      batteryPercentage !== "--"
                        ? "%"
                        : ""
                    }
                  </p>

                </div>


                <div
                  className="rounded-2xl border p-4"

                  style={{
                    borderColor:
                      theme.border,

                    backgroundColor:
                      theme.softBlue,
                  }}
                >

                  <Sun
                    size={18}

                    style={{
                      color:
                        theme.solar,
                    }}
                  />


                  <p
                    className="mt-3 text-xs"

                    style={{
                      color:
                        theme.muted,
                    }}
                  >
                    Predicted Solar
                  </p>


                  <p className="mt-1 text-lg font-semibold">
                    {predictedGeneration}
                    {
                      predictedGeneration !== "--"
                        ? " kWh"
                        : ""
                    }
                  </p>

                </div>


                <div
                  className="rounded-2xl border p-4"

                  style={{
                    borderColor:
                      theme.border,

                    backgroundColor:
                      theme.softBlue,
                  }}
                >

                  <CloudRain
                    size={18}

                    style={{
                      color:
                        theme.primary,
                    }}
                  />


                  <p
                    className="mt-3 text-xs"

                    style={{
                      color:
                        theme.muted,
                    }}
                  >
                    Weather Condition
                  </p>


                  <p className="mt-1 text-sm font-semibold">
                    {weatherCondition}
                  </p>

                </div>


                <div
                  className="rounded-2xl border p-4"

                  style={{
                    borderColor:
                      theme.border,

                    backgroundColor:
                      theme.softBlue,
                  }}
                >

                  <IndianRupee
                    size={18}

                    style={{
                      color:
                        theme.solar,
                    }}
                  />


                  <p
                    className="mt-3 text-xs"

                    style={{
                      color:
                        theme.muted,
                    }}
                  >
                    Expected Saving
                  </p>


                  <p className="mt-1 text-lg font-semibold">
                    {
                      expectedSaving !== "--"
                        ? `₹${expectedSaving}`
                        : "--"
                    }
                  </p>

                </div>

              </div>


              {/* ACTION */}

              <div
                className="mt-5 rounded-2xl border p-4"

                style={{
                  borderColor:
                    theme.border,

                  backgroundColor:
                    theme.softGold,
                }}
              >

                <div className="flex items-start gap-3">

                  <Lightbulb
                    size={19}

                    className="mt-0.5 shrink-0"

                    style={{
                      color:
                        theme.solar,
                    }}
                  />


                  <div>

                    <p className="text-sm font-semibold">
                      Recommended Action
                    </p>


                    <p
                      className="mt-1 text-sm leading-6"

                      style={{
                        color:
                          theme.muted,
                      }}
                    >
                      {content.text}
                    </p>

                  </div>

                </div>

              </div>


              {/* FOOTER */}

              <div className="mt-6 flex justify-end">

                <button

                  onClick={() =>
                    setShowOptimization(false)
                  }

                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-white"

                  style={{
                    backgroundColor:
                      theme.primary,
                  }}
                >
                  Got it
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </>
  );
}


export default Recommendation;