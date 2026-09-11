import { motion } from "motion/react";
import {
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Clock3,
} from "lucide-react";

const themeOptions = [
  {
    name: "morning",
    label: "Morning",
    icon: Sun,
  },
  {
    name: "afternoon",
    label: "Afternoon",
    icon: CloudSun,
  },
  {
    name: "evening",
    label: "Evening",
    icon: Sunset,
  },
  {
    name: "night",
    label: "Night",
    icon: Moon,
  },
];

function ThemePreview({
  activeTheme,
  automaticTheme,
  setManualTheme,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.7,
      }}
     className="fixed bottom-3 left-1/2 z-[9999] -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-2xl border border-white/30 bg-white/90 p-1.5 shadow-2xl backdrop-blur-xl">

        {/* AUTO */}
        <button
          onClick={() => setManualTheme(null)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
            activeTheme === null
              ? "bg-[#173247] text-white"
              : "text-[#668195] hover:bg-[#F2F6F8]"
          }`}
        >
          <Clock3 size={15} />

          <span>Auto</span>
        </button>

        <div className="mx-1 h-5 w-px bg-[#DCE6EA]" />

        {/* THEMES */}
        {themeOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.name}
              onClick={() =>
                setManualTheme(option.name)
              }
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                activeTheme === option.name
                  ? "bg-[#1389C9] text-white shadow-sm"
                  : "text-[#668195] hover:bg-[#F2F6F8]"
              }`}
            >
              <Icon size={16} strokeWidth={1.8} />

              <span className="hidden sm:inline">
                {option.label}
              </span>
            </button>
          );
        })}

      </div>

      {/* Automatic Mode Indicator */}
      {activeTheme === null && (
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#668195]">
          <Clock3 size={11} />

          <span>
            Auto mode • Current theme:{" "}
            <span className="font-semibold capitalize">
              {automaticTheme}
            </span>
          </span>
        </div>
      )}

    </motion.div>
  );
}

export default ThemePreview;