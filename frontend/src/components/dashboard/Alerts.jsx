// src/components/dashboard/Alerts.jsx

import { motion } from "motion/react";

import {
  Bell,
  TriangleAlert,
  CircleCheck,
  Info,
  Clock3,
} from "lucide-react";


const defaultAlerts = [
  {
    id: 1,
    type: "warning",
    title: "High evening consumption",
    message:
      "Household demand is expected to increase during the evening peak.",
    time: "10 min ago",
  },

  {
    id: 2,
    type: "success",
    title: "Battery charging normally",
    message:
      "Battery charging performance is within the expected operating range.",
    time: "25 min ago",
  },

  {
    id: 3,
    type: "info",
    title: "Solar generation stable",
    message:
      "Current solar production is stable with no major fluctuations detected.",
    time: "1 hr ago",
  },
];


function Alerts({
  theme,
  data = defaultAlerts,
}) {

  // =========================================================
  // SAFE DATA
  // =========================================================

  const safeData =
    Array.isArray(data)
      ? data
      : defaultAlerts;


  // =========================================================
  // ALERT STYLE
  // =========================================================

  function getAlertStyle(type) {

    // CRITICAL
    if (type === "critical") {

      return {
        icon: TriangleAlert,
        color: theme.consumption,
        background: theme.softOrange,
      };
    }


    // WARNING
    if (type === "warning") {

      return {
        icon: TriangleAlert,
        color: theme.consumption,
        background: theme.softOrange,
      };
    }


    // SUCCESS
    if (type === "success") {

      return {
        icon: CircleCheck,
        color: theme.success,
        background: theme.softBlue,
      };
    }


    // WATCH
    if (type === "watch") {

      return {
        icon: Info,
        color: theme.primary,
        background: theme.softBlue,
      };
    }


    // INFO / DEFAULT
    return {

      icon: Info,
      color: theme.primary,
      background: theme.softBlue,
    };
  }


  // =========================================================
  // STATUS
  // =========================================================

  const hasCritical =
    safeData.some(
      (alert) =>
        alert.type === "critical"
    );


  const hasWarning =
    safeData.some(
      (alert) =>
        alert.type === "warning"
    );


  const statusColor =
    hasCritical ||
    hasWarning
      ? theme.consumption
      : theme.success;


  return (

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

      transition={{
        duration: 0.6,
      }}

      className="relative h-full overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-1000"

      style={{
        backgroundColor:
          theme.cardBg,

        borderColor:
          theme.border,

        color:
          theme.text,

        boxShadow:
          theme.isDark
            ? "0 14px 40px rgba(0,0,0,0.18)"
            : "0 14px 40px rgba(30,60,75,0.07)",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h3 className="font-semibold">
            Alerts & Insights
          </h3>


          <p
            className="mt-1 text-sm"

            style={{
              color:
                theme.muted,
            }}
          >
            Important system updates
          </p>

        </div>


        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"

          style={{
            backgroundColor:
              theme.softOrange,

            color:
              theme.consumption,
          }}
        >

          <Bell
            size={20}
            strokeWidth={1.8}
          />

        </div>

      </div>


      {/* =====================================================
          STATUS
      ===================================================== */}

      <div
        className="mt-5 flex items-center justify-between rounded-xl border px-4 py-3"

        style={{
          borderColor:
            theme.border,

          backgroundColor:
            theme.softBlue,
        }}
      >

        <div>

          <p
            className="text-[10px] uppercase tracking-[0.16em]"

            style={{
              color:
                theme.muted,
            }}
          >
            Current Status
          </p>


          <p className="mt-1 text-sm font-semibold">

            {safeData.length} active insights

          </p>

        </div>


        <motion.span

          animate={{
            opacity: [1, 0.4, 1],
            scale: [1, 1.15, 1],
          }}

          transition={{
            duration: 2,
            repeat: Infinity,
          }}

          className="h-2.5 w-2.5 rounded-full"

          style={{
            backgroundColor:
              statusColor,
          }}
        />

      </div>


      {/* =====================================================
          ALERT LIST
      ===================================================== */}

      <div className="mt-5 space-y-3">

        {safeData.length > 0 ? (

          safeData.map(
            (alert, index) => {

              const alertStyle =
                getAlertStyle(
                  alert.type
                );


              const Icon =
                alertStyle.icon;


              return (

                <motion.div

                  key={
                    alert.id ??
                    `${alert.type}-${alert.title}-${index}`
                  }

                  initial={{
                    opacity: 0,
                    x: 15,
                  }}

                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}

                  viewport={{
                    once: true,
                  }}

                  transition={{
                    duration: 0.45,
                    delay:
                      index * 0.08,
                  }}

                  whileHover={{
                    x: 4,
                  }}

                  className="rounded-2xl border p-4 transition-all duration-300"

                  style={{
                    borderColor:
                      theme.border,

                    backgroundColor:
                      theme.isDark
                        ? "rgba(255,255,255,0.025)"
                        : "rgba(255,255,255,0.45)",
                  }}
                >

                  <div className="flex items-start gap-3">

                    {/* ICON */}

                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"

                      style={{
                        backgroundColor:
                          alertStyle.background,

                        color:
                          alertStyle.color,
                      }}
                    >

                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />

                    </div>


                    {/* TEXT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <p className="text-sm font-semibold">
                          {alert.title}
                        </p>


                        {alert.type ===
                          "critical" && (

                          <span
                            className="rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider"

                            style={{
                              color:
                                theme.consumption,

                              backgroundColor:
                                theme.softOrange,
                            }}
                          >
                            Critical
                          </span>

                        )}

                      </div>


                      <p
                        className="mt-1 text-sm leading-5"

                        style={{
                          color:
                            theme.muted,
                        }}
                      >
                        {alert.message}
                      </p>


                      <div
                        className="mt-3 flex items-center gap-1.5 text-[10px]"

                        style={{
                          color:
                            theme.muted,
                        }}
                      >

                        <Clock3
                          size={11}
                        />

                        {
                          alert.time ??
                          "SolarFlux AI"
                        }

                      </div>

                    </div>

                  </div>

                </motion.div>
              );
            }
          )

        ) : (

          <div
            className="rounded-2xl border p-4 text-sm"

            style={{
              borderColor:
                theme.border,

              color:
                theme.muted,
            }}
          >
            No active alerts detected.
          </div>

        )}

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="mt-5 border-t pt-4 text-[10px]"

        style={{
          borderColor:
            theme.border,

          color:
            theme.muted,
        }}
      >
        Alerts update automatically using SolarFlux weather,
        prediction and system intelligence.
      </div>

    </motion.section>
  );
}


export default Alerts;