// src/components/dashboard/SystemHealth.jsx

import { motion } from "motion/react";

import {
  Gauge,
  Sun,
  BatteryCharging,
  Cpu,
  Wifi,
  ShieldCheck,
} from "lucide-react";

/* ============================================================
   TEMPORARY HEALTH VALUES

   Later these values will come from:
   GET /api/system-health
============================================================ */

const defaultHealth = [
  {
    label: "Solar Panel",
    value: 96,
    icon: Sun,
  },
  {
    label: "Battery",
    value: 94,
    icon: BatteryCharging,
  },
  {
    label: "Sensors",
    value: 100,
    icon: Gauge,
  },
  {
    label: "ESP32",
    value: 100,
    icon: Cpu,
  },
];

function SystemHealth({
  theme,
  data,
}) {
  /* ==========================================================
     BACKEND SYSTEM STATUS

     FastAPI currently returns:
     {
       system_status: "Optimal"
     }
  ========================================================== */

  const systemStatus =
    data?.system_status ?? "Unknown";

  const isHealthy =
    systemStatus === "Optimal" ||
    systemStatus === "Healthy" ||
    systemStatus === "Online";

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
      className="relative overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-1000"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
        color: theme.text,
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h3 className="font-semibold">
            System Health
          </h3>

          <p
            className="mt-1 text-xs"
            style={{
              color: theme.muted,
            }}
          >
            Hardware and sensor status
          </p>

        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: theme.softBlue,
            color: isHealthy
              ? theme.success
              : theme.secondary,
          }}
        >
          <ShieldCheck
            size={20}
            strokeWidth={1.8}
          />
        </div>

      </div>

      {/* =====================================================
          OVERALL STATUS
      ===================================================== */}

      <div
        className="mt-5 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.softBlue,
          color: isHealthy
            ? theme.success
            : theme.secondary,
        }}
      >
        <motion.span
          animate={{
            opacity: [1, 0.35, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: isHealthy
              ? theme.success
              : theme.secondary,
          }}
        />

        System Status: {systemStatus}

      </div>

      {/* =====================================================
          HEALTH BARS
      ===================================================== */}

      <div className="mt-6 space-y-5">

        {defaultHealth.map(
          (item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.label}>

                <div className="mb-2 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Icon
                      size={14}
                      style={{
                        color:
                          index === 0
                            ? theme.solar
                            : index === 1
                            ? theme.battery
                            : theme.primary,
                      }}
                    />

                    <span className="text-xs">
                      {item.label}
                    </span>

                  </div>

                  <span
                    className="text-xs"
                    style={{
                      color: theme.muted,
                    }}
                  >
                    {item.value}%
                  </span>

                </div>

                <div
                  className="h-2 overflow-hidden rounded-full"
                  style={{
                    backgroundColor: theme.border,
                  }}
                >
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: `${item.value}%`,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                    }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        item.value >= 90
                          ? theme.success
                          : theme.secondary,
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* =====================================================
          CONNECTION STATUS
      ===================================================== */}

      <div
        className="mt-6 flex items-center gap-2 border-t pt-4 text-[10px]"
        style={{
          borderColor: theme.border,
          color: theme.muted,
        }}
      >
        <Wifi
          size={12}
          style={{
            color: theme.success,
          }}
        />

        ESP32 connection active

      </div>

    </motion.section>
  );
}

export default SystemHealth;