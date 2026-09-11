import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  Bell,
  Settings,
  Wifi,
  Clock3,
  MapPin,
} from "lucide-react";

import logo from "../../assets/solarflux-logo-removebg-preview.png";

function DashboardNavbar({
  theme,
  themeName,
  currentTime,
}) {
  return (
    <header
      className="sticky top-0 z-[999] border-b backdrop-blur-2xl transition-colors duration-1000"
      style={{
        backgroundColor: theme.navbarBg,
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-3 lg:px-8">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-7">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.img
              src={logo}
              alt="SolarFlux"
              whileHover={{
                scale: 1.04,
              }}
              transition={{
                duration: 0.25,
              }}
              className="h-11 w-auto object-contain"
            />
          </Link>

          {/* Divider */}
          <div
            className="hidden h-8 w-px md:block"
            style={{
              backgroundColor: theme.border,
            }}
          />

          {/* System Info */}
          <div className="hidden md:block">

            <p
              className="text-sm font-semibold"
              style={{
                color: theme.text,
              }}
            >
              Home Solar System
            </p>

            <div
              className="mt-1 flex items-center gap-3 text-xs"
              style={{
                color: theme.muted,
              }}
            >
              <span className="flex items-center gap-1.5">
                <Wifi
                  size={12}
                  style={{
                    color: theme.success,
                  }}
                />

                Connected
              </span>

              <span className="flex items-center gap-1.5">
                <MapPin size={12} />

                Mumbai, India
              </span>
            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3">

          {/* Active Theme */}
          <div
            className="hidden items-center gap-2 rounded-xl border px-3 py-2 lg:flex"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.cardBg,
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: theme.primary,
              }}
            />

            <div>
              <p
                className="text-[9px] uppercase tracking-[0.14em]"
                style={{
                  color: theme.muted,
                }}
              >
                Theme
              </p>

              <p
                className="text-xs font-semibold capitalize"
                style={{
                  color: theme.text,
                }}
              >
                {themeName}
              </p>
            </div>
          </div>

          {/* Live Time */}
          <div
            className="hidden items-center gap-3 rounded-xl border px-4 py-2 md:flex"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.cardBg,
            }}
          >
            <Clock3
              size={16}
              style={{
                color: theme.primary,
              }}
            />

            <div>
              <p
                className="text-[9px] uppercase tracking-[0.14em]"
                style={{
                  color: theme.muted,
                }}
              >
                Live Time
              </p>

              <p
                className="text-sm font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Notification */}
          <motion.button
            whileHover={{
              y: -2,
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-1000"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.cardBg,
              color: theme.text,
            }}
          >
            <Bell size={18} />

            <motion.span
              animate={{
                scale: [1, 1.35, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{
                backgroundColor: theme.secondary,
              }}
            />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{
              rotate: 18,
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-1000"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.cardBg,
              color: theme.text,
            }}
          >
            <Settings size={18} />
          </motion.button>

        </div>

      </div>
    </header>
  );
}

export default DashboardNavbar;