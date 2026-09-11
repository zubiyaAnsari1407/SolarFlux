// src/components/dashboard/KpiCards.jsx

import { motion } from "motion/react";

import {
  Sun,
  Zap,
  BatteryCharging,
  Gauge,
  ArrowUpRight,
  Activity,
} from "lucide-react";

function KpiCards({ theme, data }) {
  /* ==========================================================
     BACKEND DATA SAFETY

     FastAPI response structure:

     {
       solar_generation: {
         value: 4.82,
         unit: "kW"
       },

       energy_today: {
         value: 18.6,
         unit: "kWh"
       },

       battery: {
         percentage: 78,
         status: "Charging"
       },

       home_consumption: {
         value: 2.31,
         unit: "kW"
       },

       grid: {
         value: 1.42,
         status: "Exporting"
       },

       system_status: "Optimal"
     }
  ========================================================== */

  const solarGeneration = data?.solar_generation?.value ?? 0;
  const solarUnit = data?.solar_generation?.unit ?? "kW";

  const consumption = data?.home_consumption?.value ?? 0;
  const consumptionUnit = data?.home_consumption?.unit ?? "kW";

  const batteryPercentage = data?.battery?.percentage ?? 0;
  const batteryStatus = data?.battery?.status ?? "Unknown";

  const energyToday = data?.energy_today?.value ?? 0;
  const energyTodayUnit = data?.energy_today?.unit ?? "kWh";

  /* ==========================================================
     KPI CONFIG
  ========================================================== */

  const kpis = [
    {
      title: "Solar Generation",
      value: solarGeneration,
      unit: solarUnit,
      info: "Current solar output",
      icon: Sun,
      accent: theme.solar,
      softBackground: theme.softGold,
    },

    {
      title: "Consumption",
      value: consumption,
      unit: consumptionUnit,
      info: "Current household load",
      icon: Zap,
      accent: theme.consumption,
      softBackground: theme.softOrange,
    },

    {
      title: "Battery",
      value: batteryPercentage,
      unit: "%",
      info: batteryStatus,
      icon: BatteryCharging,
      accent: theme.battery,
      softBackground: theme.softBlue,
    },

    {
      title: "Energy Today",
      value: energyToday,
      unit: energyTodayUnit,
      info: "Generated today",
      icon: Gauge,
      accent: theme.solar,
      softBackground: theme.softGold,
    },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},

        show: {
          transition: {
            staggerChildren: 0.09,
          },
        },
      }}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {kpis.map(
        ({
          title,
          value,
          unit,
          info,
          icon: Icon,
          accent,
          softBackground,
        }) => (
          <motion.div
            key={title}
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
                scale: 0.97,
              },

              show: {
                opacity: 1,
                y: 0,
                scale: 1,
              },
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -6,
              scale: 1.01,
            }}
            className="group relative overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-1000"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.text,
              boxShadow: theme.isDark
                ? "0 12px 35px rgba(0,0,0,0.18)"
                : "0 12px 35px rgba(28,60,75,0.055)",
            }}
          >
            {/* ================================================
                LEFT ACCENT LINE
            ================================================= */}

            <motion.div
              initial={{
                height: "35%",
              }}
              whileHover={{
                height: "100%",
              }}
              transition={{
                duration: 0.35,
              }}
              className="absolute left-0 top-0 w-[4px] rounded-full"
              style={{
                backgroundColor: accent,
              }}
            />

            {/* ================================================
                SOFT AMBIENT GLOW
            ================================================= */}

            <motion.div
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
              style={{
                backgroundColor: accent,
              }}
              initial={{
                opacity: 0.03,
              }}
              whileHover={{
                opacity: theme.isDark ? 0.2 : 0.14,
                scale: 1.2,
              }}
              transition={{
                duration: 0.4,
              }}
            />

            {/* ================================================
                TOP
            ================================================= */}

            <div className="relative flex items-start justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{
                    color: theme.muted,
                  }}
                >
                  {title}
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.25,
                    }}
                    className="text-3xl font-semibold tracking-tight"
                    style={{
                      color: theme.text,
                    }}
                  >
                    {value}
                  </motion.p>

                  {unit && (
                    <span
                      className="mb-1 text-sm"
                      style={{
                        color: theme.muted,
                      }}
                    >
                      {unit}
                    </span>
                  )}
                </div>
              </div>

              {/* ICON */}

              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.1,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: softBackground,
                  color: accent,
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={1.8}
                />
              </motion.div>
            </div>

            {/* ================================================
                BOTTOM INFO
            ================================================= */}

            <div
              className="relative mt-6 flex items-center gap-2 text-xs"
              style={{
                color: theme.muted,
              }}
            >
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                style={{
                  color: accent,
                }}
              />

              <span>{info}</span>
            </div>

            {/* ================================================
                LIVE ACTIVITY INDICATOR
            ================================================= */}

            <div className="relative mt-5 flex items-center justify-between">
              <div
                className="flex items-center gap-2 text-[10px]"
                style={{
                  color: theme.muted,
                }}
              >
                <Activity
                  size={12}
                  style={{
                    color: theme.success,
                  }}
                />

                Live reading
              </div>

              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((bar) => (
                  <motion.span
                    key={bar}
                    animate={{
                      height: [
                        "5px",
                        `${9 + bar * 2}px`,
                        "5px",
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: bar * 0.12,
                    }}
                    className="w-[3px] rounded-full"
                    style={{
                      backgroundColor: accent,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )
      )}
    </motion.section>
  );
}

export default KpiCards;