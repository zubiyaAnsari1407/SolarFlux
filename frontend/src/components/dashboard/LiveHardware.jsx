import { motion } from "motion/react";

import {
  Activity,
  Gauge,
  Sun,
  Thermometer,
  Zap,
  Wifi,
  WifiOff,
} from "lucide-react";


function LiveHardware({
  theme,
  data,
  online,
  lastUpdated,
}) {

  const readings = [

    {
      title: "Panel Voltage",
      value:
        data?.voltage !== undefined
          ? data.voltage.toFixed(3)
          : "--",
      unit: "V",
      icon: Gauge,
    },

    {
      title: "Solar Current",
      value:
        data?.current !== undefined
          ? data.current.toFixed(3)
          : "--",
      unit: "mA",
      icon: Activity,
    },

    {
      title: "Solar Power",
      value:
        data?.power !== undefined
          ? data.power.toFixed(3)
          : "--",
      unit: "mW",
      icon: Zap,
    },

    {
      title: "Panel Temperature",
      value:
        data?.temperature !== undefined
          ? data.temperature.toFixed(2)
          : "--",
      unit: "°C",
      icon: Thermometer,
    },

    {
      title: "Light Level",
      value:
        data?.light !== undefined
          ? data.light
          : "--",
      unit: data?.lightUnit ?? "ADC",
      icon: Sun,
    },

  ];


  return (

    <motion.section

      initial={{
        opacity: 0,
        y: 25,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="mt-6 rounded-3xl border p-6 backdrop-blur-2xl"

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

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-3">

            <h2 className="text-lg font-semibold">
              Live Hardware Monitoring
            </h2>

            <div
              className="flex items-center gap-2 rounded-full px-3 py-1 text-xs"
              style={{
                backgroundColor:
                  online
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(239,68,68,0.12)",

                color:
                  online
                    ? "#22c55e"
                    : "#ef4444",
              }}
            >

              {online ? (
                <Wifi size={14} />
              ) : (
                <WifiOff size={14} />
              )}

              {online
                ? "ESP32 ONLINE"
                : "ESP32 OFFLINE"}

            </div>

          </div>


          <p
            className="mt-2 text-xs"
            style={{
              color:
                theme.muted,
            }}
          >
            Real-time readings from
            INA219, DS18B20 and LDR
          </p>

        </div>


        {lastUpdated && (

          <div
            className="text-xs"
            style={{
              color:
                theme.muted,
            }}
          >

            Updated:{" "}

            {new Date(
              lastUpdated
            ).toLocaleTimeString()}

          </div>

        )}

      </div>


      {/* SENSOR CARDS */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        {readings.map(
          ({
            title,
            value,
            unit,
            icon: Icon,
          }) => (

            <motion.div

              key={title}

              whileHover={{
                y: -4,
              }}

              className="rounded-2xl border p-4"

              style={{
                borderColor:
                  theme.border,

                backgroundColor:
                  theme.weatherCard ||
                  theme.cardBg,
              }}

            >

              <Icon
                size={20}
                style={{
                  color:
                    theme.solar ||
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
                {title}
              </p>


              <div className="mt-2 flex items-end gap-1">

                <span className="text-2xl font-semibold">

                  {online
                    ? value
                    : "--"}

                </span>

                <span
                  className="mb-1 text-xs"
                  style={{
                    color:
                      theme.muted,
                  }}
                >
                  {unit}
                </span>

              </div>

            </motion.div>

          )
        )}

      </div>


      {/* BOTTOM STATUS */}

      <div
        className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs"
        style={{
          borderColor:
            theme.border,

          color:
            theme.muted,
        }}
      >

        <span>
          Light Status:{" "}
          <strong>
            {online
              ? data?.lightStatus ??
                "UNKNOWN"
              : "OFFLINE"}
          </strong>
        </span>


        <span>

          INA219:{" "}

          <strong>

            {online
              ? data?.inaConnected
                ? "CONNECTED"
                : "NOT CONNECTED"

              : "OFFLINE"}

          </strong>

        </span>

      </div>

    </motion.section>

  );
}


export default LiveHardware;