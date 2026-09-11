// src/components/dashboard/DashboardHeader.jsx

import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  ArrowLeft,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Activity,
  MapPin,
} from "lucide-react";

function DashboardHeader({
  theme,
  themeName,
  currentTime,
}) {
  /* ==========================================================
     GREETING BASED ON ACTIVE THEME

     Manual theme select karne par bhi greeting change hoga.
     Auto mode me current time ke according theme aayega.
  ========================================================== */

  const themeContent = {
    morning: {
      greeting: "Good morning.",
      message: "Your solar system is ready for a productive day.",
      status: "Morning Solar Window",
      icon: Sun,
    },

    afternoon: {
      greeting: "Good afternoon.",
      message: "Your solar system is performing at strong daylight levels.",
      status: "Peak Solar Window",
      icon: CloudSun,
    },

    evening: {
      greeting: "Good evening.",
      message: "Solar production is gradually winding down for the day.",
      status: "Sunset Monitoring",
      icon: Sunset,
    },

    night: {
      greeting: "Night monitoring active.",
      message: "Solar generation is offline while battery and home usage remain monitored.",
      status: "Night Energy Mode",
      icon: Moon,
    },
  };

  const content = themeContent[themeName];
  const ThemeIcon = content.icon;

  /* ==========================================================
     DATE
  ========================================================== */

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 22,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
     className="relative mb-7 overflow-hidden rounded-[30px] border p-7 backdrop-blur-2xl transition-all duration-1000 md:p-8"
     style={{
  backgroundColor: theme.headerBg,
  borderColor: theme.border,
  color: theme.text,
}}
    >

      {/* ======================================================
          AMBIENT DECORATION
      ====================================================== */}

      {/* Main Theme Orb */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.55, 0.8, 0.55],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full blur-2xl"
        style={{
          backgroundColor:
            themeName === "morning"
              ? "#F7D778"
              : themeName === "afternoon"
              ? "#7CC7E8"
              : themeName === "evening"
              ? "#E89068"
              : "#E89B3C",
        }}
      />

      {/* Secondary Sky Orb */}

      <motion.div
        animate={{
          x: [-10, 12, -10],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-28 top-8 h-32 w-32 rounded-full blur-3xl"
        style={{
          backgroundColor:
            themeName === "morning"
              ? "#9ED8F5"
              : themeName === "afternoon"
              ? "#63B4E3"
              : themeName === "evening"
              ? "#8993D4"
              : "#3E8FBD",
          opacity: 0.25,
        }}
      />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 flex flex-col justify-between gap-8 xl:flex-row xl:items-end">

        {/* ================= LEFT ================= */}

        <div>

          {/* Back Link */}

          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-xs transition"
            style={{
              color: theme.muted,
            }}
          >
            <ArrowLeft size={14} />

            Back to SolarFlux
          </Link>

          {/* Intelligence Label */}

          <div
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              color: theme.primary,
            }}
          >
            <Activity size={14} />

            Live Energy Intelligence
          </div>

          {/* Greeting */}

          <div className="mt-4 flex items-start gap-4">

            <motion.div
              animate={{
                rotate:
                  themeName === "morning" ||
                  themeName === "afternoon"
                    ? [0, 8, 0]
                    : 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: theme.softGold,
                color:
                  themeName === "evening"
                    ? theme.secondary
                    : theme.solar,
              }}
            >
              <ThemeIcon size={24} strokeWidth={1.8} />
            </motion.div>

            <div>

              <h1
                className="text-3xl font-semibold tracking-tight md:text-4xl"
                style={{
                  color: theme.text,
                }}
              >
                {content.greeting}
              </h1>

              <p
                className="mt-2 max-w-2xl text-sm leading-6"
                style={{
                  color: theme.muted,
                }}
              >
                {content.message}
              </p>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex flex-wrap items-stretch gap-3">

          {/* Date / Location */}

          <div
            className="min-w-[180px] rounded-2xl border px-4 py-3 backdrop-blur-xl"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.weatherCard,
            }}
          >

            <div
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]"
              style={{
                color: theme.muted,
              }}
            >
              <MapPin size={12} />

              Mumbai, India
            </div>

            <p
              className="mt-2 text-sm font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {formattedDate}
            </p>

          </div>

          {/* Theme Status */}

          <div
            className="min-w-[170px] rounded-2xl border px-4 py-3 backdrop-blur-xl"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.weatherCard,
            }}
          >

            <div
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]"
              style={{
                color: theme.muted,
              }}
            >
              <ThemeIcon
                size={12}
                style={{
                  color: theme.primary,
                }}
              />

              Current Mode
            </div>

            <p
              className="mt-2 text-sm font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {content.status}
            </p>

          </div>

          {/* System Online */}

          <div
            className="flex min-w-[155px] items-center gap-3 rounded-2xl border px-4 py-3"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
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
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: theme.success,
              }}
            />

            <div>

              <p
                className="text-[10px]"
                style={{
                  color: theme.muted,
                }}
              >
                Device Status
              </p>

              <p
                className="text-sm font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                System Online
              </p>

            </div>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default DashboardHeader;