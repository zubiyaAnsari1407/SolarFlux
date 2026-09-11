// src/components/dashboard/EnergyFlow.jsx

import { motion } from "motion/react";

import {
  Sun,
  BatteryCharging,
  House,
  Activity,
} from "lucide-react";

const defaultData = {
  solarPower: 4.82,
  batteryPower: 1.67,
  consumption: 3.15,
  batteryMode: "Charging",
};

function EnergyFlow({
  theme,
  data,
}) {
  /* ==========================================================
     MERGE BACKEND DATA WITH TEMPORARY FALLBACKS
  ========================================================== */

  const flowData = {
    solarPower:
      data?.solar_generation?.value ??
      defaultData.solarPower,

    consumption:
      data?.home_consumption?.value ??
      defaultData.consumption,

    batteryMode:
      data?.battery?.status ??
      defaultData.batteryMode,

    // Backend me abhi battery power field nahi hai
    batteryPower:
      defaultData.batteryPower,
  };

  const flowItems = [
    {
      name: "Solar",
      value: `${flowData.solarPower} kW`,
      status: "Generating",
      icon: Sun,
      color: theme.solar,
      background: theme.softGold,
    },

    {
      name: "Battery",
      value: `${flowData.batteryPower} kW`,
      status: flowData.batteryMode,
      icon: BatteryCharging,
      color: theme.battery,
      background: theme.softBlue,
    },

    {
      name: "Home",
      value: `${flowData.consumption} kW`,
      status: "Consuming",
      icon: House,
      color: theme.consumption,
      background: theme.softOrange,
    },
  ];

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
      className="relative h-full w-full overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-1000"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
        color: theme.text,
        boxShadow: theme.isDark
          ? "0 14px 40px rgba(0,0,0,0.18)"
          : "0 14px 40px rgba(30,60,75,0.07)",
      }}
    >
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between">

        <div>
          <h3
            className="font-semibold"
            style={{
              color: theme.text,
            }}
          >
            Live Energy Flow
          </h3>

          <p
            className="mt-1 text-xs"
            style={{
              color: theme.muted,
            }}
          >
            Real-time power distribution
          </p>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
          style={{
            backgroundColor: theme.softBlue,
            color: theme.success,
          }}
        >
          <motion.span
            animate={{
              opacity: [1, 0.35, 1],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: theme.success,
            }}
          />

          Live
        </div>

      </div>

      {/* ================= ENERGY FLOW ================= */}

      <div className="mt-9 flex items-center justify-between">

        {flowItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className="flex flex-1 items-center"
            >
              {/* NODE */}

              <motion.div
                whileHover={{
                  y: -5,
                  scale: 1.04,
                }}
                className="min-w-[82px] text-center"
              >
                <motion.div
                  animate={
                    index === 0
                      ? {
                          boxShadow: [
                            `0 0 0px ${theme.solar}00`,
                            `0 0 25px ${theme.solar}55`,
                            `0 0 0px ${theme.solar}00`,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                  }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: item.background,
                    color: item.color,
                  }}
                >
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                  />
                </motion.div>

                <p
                  className="mt-3 text-xs"
                  style={{
                    color: theme.muted,
                  }}
                >
                  {item.name}
                </p>

                <p
                  className="mt-1 text-sm font-semibold"
                  style={{
                    color: theme.text,
                  }}
                >
                  {item.value}
                </p>

                <p
                  className="mt-1 text-[10px] font-medium"
                  style={{
                    color: item.color,
                  }}
                >
                  {item.status}
                </p>

              </motion.div>

              {/* FLOW LINE */}

              {index < flowItems.length - 1 && (
                <div className="mx-2 flex flex-1 items-center">

                  <div
                    className="relative h-[2px] w-full overflow-hidden rounded-full"
                    style={{
                      backgroundColor: theme.border,
                    }}
                  >
                    <motion.div
                      animate={{
                        x: ["-100%", "250%"],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute h-full w-8 rounded-full"
                      style={{
                        backgroundColor:
                          index === 0
                            ? theme.solar
                            : theme.battery,
                      }}
                    />

                  </div>

                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* ================= BOTTOM STATUS ================= */}

      <div
        className="mt-7 flex items-center gap-2 border-t pt-4 text-xs"
        style={{
          borderColor: theme.border,
          color: theme.muted,
        }}
      >
        <Activity
          size={13}
          style={{
            color: theme.success,
          }}
        />

        Power flow updates automatically from live sensor data
      </div>

    </motion.section>
  );
}

export default EnergyFlow;