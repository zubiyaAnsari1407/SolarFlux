import { motion } from "motion/react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  BarChart3,
  Activity,
  CalendarDays,
} from "lucide-react";

// Displayed only until the first ESP32 reading has been saved to MongoDB.
// Once live history exists, it completely replaces these previous values.
const previousEnergyData = [
  { time: "6 AM", solar: 0.4, usage: 1.2 },
  { time: "8 AM", solar: 1.8, usage: 1.7 },
  { time: "10 AM", solar: 3.7, usage: 2.1 },
  { time: "12 PM", solar: 5.2, usage: 2.8 },
  { time: "2 PM", solar: 4.8, usage: 3.1 },
  { time: "4 PM", solar: 3.6, usage: 2.9 },
  { time: "6 PM", solar: 1.4, usage: 3.4 },
];

/* ============================================================
   CUSTOM TOOLTIP
============================================================ */

function CustomTooltip({
  active,
  payload,
  label,
  theme,
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const solar = payload.find(
    (item) => item.dataKey === "solar"
  );

  const usage = payload.find(
    (item) => item.dataKey === "usage"
  );

  return (
    <div
      className="min-w-[170px] rounded-2xl border p-4 shadow-xl backdrop-blur-xl"
      style={{
        backgroundColor: theme.isDark
          ? "rgba(16,37,56,0.94)"
          : "rgba(255,255,255,0.96)",
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      <p
        className="text-xs font-semibold"
        style={{
          color: theme.text,
        }}
      >
        {label}
      </p>

      <div className="mt-3 space-y-2">

        <div className="flex items-center justify-between gap-5">

          <div className="flex items-center gap-2">

            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: theme.solar,
              }}
            />

            <span
              className="text-xs"
              style={{
                color: theme.muted,
              }}
            >
              Solar Power
            </span>

          </div>

          <span className="text-xs font-semibold">
            {solar?.value ?? 0} kW
          </span>

        </div>

        {usage && (
          <div className="flex items-center justify-between gap-5">

          <div className="flex items-center gap-2">

            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: theme.consumption,
              }}
            />

            <span
              className="text-xs"
              style={{
                color: theme.muted,
              }}
            >
              Usage
            </span>

          </div>

          <span className="text-xs font-semibold">
            {usage?.value ?? 0} kW
          </span>

          </div>
        )}

      </div>
    </div>
  );
}

/* ============================================================
   ENERGY CHART
============================================================ */

function EnergyChart({
  theme,
  data,
  hardwareOnline,
}) {
  /* ==========================================================
     SAFE BACKEND DATA

     Persisted ESP32 readings take priority. Previous dashboard values remain
     visible until the first live reading is saved.
  ========================================================== */

  const hasRecordedData =
    Array.isArray(data)
      && data.length > 0;

  const safeData = hasRecordedData
    ? data
    : previousEnergyData;

  const hasUsage = safeData.some(
    (point) => Number.isFinite(Number(point.usage))
  );

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
        amount: 0.2,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative h-fit overflow-hidden rounded-3xl border px-6 pt-6 pb-15 backdrop-blur-2xl transition-all duration-1000"
      style={{
        backgroundColor: theme.chartBg,
        borderColor: theme.border,
        color: theme.text,
        boxShadow: theme.isDark
          ? "0 16px 45px rgba(0,0,0,0.24)"
          : "0 16px 45px rgba(30,60,75,0.09)",
      }}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div className="flex items-start gap-3">

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: theme.softGold,
              color: theme.solar,
            }}
          >
            <BarChart3
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div>

            <h2
              className="text-lg font-semibold"
              style={{
                color: theme.text,
              }}
            >
              Live Solar Production
            </h2>

            <p
              className="mt-1 text-xs"
              style={{
                color: theme.muted,
              }}
            >
              {hasRecordedData && hasUsage
                ? "Live solar power compared with metered household consumption"
                : hasRecordedData
                ? "ESP32 solar power saved to MongoDB by time"
                : "Previous dashboard values shown until ESP32 history is available"}
            </p>

          </div>

        </div>

        {/* RIGHT CONTROLS */}

        <div className="flex flex-wrap items-center gap-2">

          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.weatherCard,
              color: theme.muted,
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
                backgroundColor: hardwareOnline
                  ? theme.success
                  : theme.secondary,
              }}
            />

            {hardwareOnline ? "ESP32 Live" : "ESP32 Offline"}

          </div>

          <button
            className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.cardBg,
              color: theme.text,
            }}
          >
            <CalendarDays
              size={14}
              style={{
                color: theme.primary,
              }}
            />

            Today
          </button>

        </div>

      </div>

      {/* ======================================================
          LEGEND
      ====================================================== */}

      <div className="mt-6 flex flex-wrap items-center gap-3">

        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
          style={{
            backgroundColor: theme.softGold,
            color: theme.text,
          }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: theme.solar,
            }}
          />

          Solar Power
        </div>

        {hasUsage && (
          <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
          style={{
            backgroundColor: theme.softBlue,
            color: theme.text,
          }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: theme.consumption,
            }}
          />

          Consumption
          </div>
        )}

      </div>

      {/* ======================================================
          CHART
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.985,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.9,
          delay: 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-7 h-[400px] w-full"
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={safeData}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 5"
              vertical={false}
              stroke={
                theme.isDark
                  ? "rgba(255,255,255,0.10)"
                  : "#E7ECEE"
              }
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.muted,
                fontSize: 11,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.muted,
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                `${value}`
              }
            />

            <Tooltip
              cursor={{
                stroke: theme.primary,
                strokeWidth: 1,
                strokeDasharray: "4 4",
                opacity: 0.4,
              }}
              content={(props) => (
                <CustomTooltip
                  {...props}
                  theme={theme}
                />
              )}
            />

            {/* SOLAR */}

            <Area
              type="monotone"
              dataKey="solar"
              stroke={theme.solar}
              strokeWidth={3}
              fill={theme.softGold}
              fillOpacity={
                theme.isDark ? 0.35 : 0.68
              }
              dot={false}
              activeDot={{
                r: 5,
                fill: theme.solar,
                stroke: theme.cardBg,
                strokeWidth: 3,
              }}
              isAnimationActive={true}
              animationBegin={150}
              animationDuration={1900}
              animationEasing="ease-in-out"
            />

            {/* Consumption appears only when a real consumption meter sends it. */}

            {hasUsage && (
              <Area
                type="monotone"
                dataKey="usage"
                stroke={theme.consumption}
                strokeWidth={2.5}
                fill={theme.softBlue}
                fillOpacity={
                  theme.isDark ? 0.18 : 0.35
                }
                dot={false}
                activeDot={{
                  r: 5,
                  fill: theme.consumption,
                  stroke: theme.cardBg,
                  strokeWidth: 3,
                }}
                isAnimationActive={true}
                animationBegin={400}
                animationDuration={2050}
                animationEasing="ease-in-out"
              />
            )}

          </AreaChart>
        </ResponsiveContainer>

      </motion.div>

      {/* ======================================================
          BOTTOM STATUS
      ====================================================== */}

      <div
        className="mt-4 flex flex-col justify-between gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center"
        style={{
          borderColor: theme.border,
          color: theme.muted,
        }}
      >

        <div className="flex items-center gap-2">

          <Activity
            size={29}
            style={{
              color: theme.success,
            }}
          />

          {hasRecordedData
            ? "Live solar readings are saved to MongoDB every minute"
            : "Showing previous dashboard values; waiting for the first ESP32 reading"}

        </div>

        <span>
          Unit: kW
        </span>

      </div>

    </motion.section>
  );
}

export default EnergyChart;
