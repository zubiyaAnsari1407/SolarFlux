// src/components/dashboard/BatteryStatus.jsx

import { motion } from "motion/react";

import {
  BatteryCharging,
  Clock3,
  Activity,
  Gauge,
} from "lucide-react";

/* ============================================================
   TEMPORARY FALLBACK DATA

   percentage + status ab FastAPI / MongoDB se aa rahe hain.

   Baaki values later battery API / ESP32 se aayengi.
============================================================ */

const defaultData = {
  percentage: 78,
  power: 1.67,
  mode: "Charging",
  estimatedTime: "2.8 hrs",
  capacity: 12.4,
  health: 94,
};

function BatteryStatus({
  theme,
  data,
}) {
  /* ==========================================================
     MERGE BACKEND DATA WITH TEMPORARY FALLBACK DATA
  ========================================================== */

  const batteryData = {
    ...defaultData,

    percentage:
      data?.percentage ??
      defaultData.percentage,

    mode:
      data?.status ??
      defaultData.mode,
  };

  /* ==========================================================
     CIRCULAR GAUGE
  ========================================================== */

  const circumference = 289;

  const offset =
    circumference -
    (circumference * batteryData.percentage) / 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative h-full overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-1000"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
        color: theme.text,
        boxShadow: theme.isDark
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
            Battery Status
          </h3>

          <p
            className="mt-1 text-xs"
            style={{
              color: theme.muted,
            }}
          >
            Storage performance
          </p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: theme.softBlue,
            color: theme.battery,
          }}
        >
          <BatteryCharging
            size={20}
            strokeWidth={1.8}
          />
        </div>

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mt-7 flex items-center gap-7">

        {/* CIRCULAR GAUGE */}

        <div className="relative h-28 w-28 shrink-0">

          <svg
            width="112"
            height="112"
            viewBox="0 0 112 112"
            className="-rotate-90"
          >
            <circle
              cx="56"
              cy="56"
              r="46"
              fill="none"
              stroke={theme.border}
              strokeWidth="9"
            />

            <motion.circle
              cx="56"
              cy="56"
              r="46"
              fill="none"
              stroke={theme.battery}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{
                strokeDashoffset: circumference,
              }}
              whileInView={{
                strokeDashoffset: offset,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

          </svg>

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="text-center">

              <p className="text-2xl font-semibold">
                {batteryData.percentage}%
              </p>

              <p
                className="text-[9px]"
                style={{
                  color: theme.muted,
                }}
              >
                Charged
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            BATTERY INFO
        =================================================== */}

        <div className="flex-1 space-y-4">

          {/* CURRENT FLOW */}

          <div className="flex items-start gap-3">

            <BatteryCharging
              size={16}
              style={{
                color: theme.battery,
              }}
            />

            <div>

              <p
                className="text-[10px]"
                style={{
                  color: theme.muted,
                }}
              >
                Current Flow
              </p>

              <p className="text-sm font-semibold">
                {batteryData.power} kW
              </p>

              <p
                className="text-[10px] font-medium"
                style={{
                  color: theme.success,
                }}
              >
                {batteryData.mode}
              </p>

            </div>

          </div>

          {/* ESTIMATED TIME */}

          <div className="flex items-start gap-3">

            <Clock3
              size={16}
              style={{
                color: theme.primary,
              }}
            />

            <div>

              <p
                className="text-[10px]"
                style={{
                  color: theme.muted,
                }}
              >
                Estimated Time
              </p>

              <p className="text-sm font-semibold">
                {batteryData.estimatedTime}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM METRICS
      ===================================================== */}

      <div
        className="mt-7 grid grid-cols-2 gap-3 border-t pt-4"
        style={{
          borderColor: theme.border,
        }}
      >

        {/* CAPACITY */}

        <div>

          <div
            className="flex items-center gap-2 text-[10px]"
            style={{
              color: theme.muted,
            }}
          >
            <Activity size={12} />

            Capacity
          </div>

          <p className="mt-1 text-sm font-semibold">
            {batteryData.capacity} kWh
          </p>

        </div>

        {/* BATTERY HEALTH */}

        <div>

          <div
            className="flex items-center gap-2 text-[10px]"
            style={{
              color: theme.muted,
            }}
          >
            <Gauge size={12} />

            Battery Health
          </div>

          <p
            className="mt-1 text-sm font-semibold"
            style={{
              color: theme.success,
            }}
          >
            {batteryData.health}%
          </p>

        </div>

      </div>

    </motion.section>
  );
}

export default BatteryStatus;