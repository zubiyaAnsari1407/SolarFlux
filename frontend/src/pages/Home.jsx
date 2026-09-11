import { Link } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  BrainCircuit,
  CloudSun,
  IndianRupee,
  Cpu,
  Wifi,
  Database,
  BarChart3,
  Sun,
  BatteryCharging,
  TriangleAlert,
  Leaf,
  Zap,
  MapPin,
  ShieldCheck,
  Gauge,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent
} from "motion/react";

import { useState } from "react";
import SpotlightCard from "../components/SpotlightCard";
import heroImage from "../assets/solar-hero.png";
import logo from "../assets/solarflux-logo-removebg-preview.png";


const features = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    text: "Monitor solar generation, consumption, voltage, current, temperature and sunlight in real time.",
  },
  {
    icon: BrainCircuit,
    title: "AI Generation Prediction",
    text: "Machine learning predicts tomorrow's expected solar generation using historical and weather data.",
  },
  {
    icon: MapPin,
    title: "Location-Aware Forecasting",
    text: "Solar predictions are adjusted according to location, cloud cover, rainfall and sunlight conditions.",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    text: "Live weather and next-day forecasts help explain changes in expected solar production.",
  },
  {
    icon: ShieldCheck,
    title: "Explainable AI",
    text: "SolarFlux explains why generation may rise or fall instead of only showing a prediction value.",
  },
  {
    icon: TriangleAlert,
    title: "Smart Anomaly Detection",
    text: "Detect unusual production drops, overheating, battery issues and abnormal system behaviour.",
  },
  {
    icon: Zap,
    title: "Energy Optimization",
    text: "Get actionable suggestions such as the best time to run appliances when solar production is high.",
  },
  {
    icon: IndianRupee,
    title: "Savings Intelligence",
    text: "Track daily and cumulative ₹ savings, grid electricity avoided and predicted savings for tomorrow.",
  },
];

const architecture = [
  {
    icon: Sun,
    title: "Solar Panel",
    text: "Generates clean energy",
  },
  {
    icon: Cpu,
    title: "ESP32 + Sensors",
    text: "Collects live readings",
  },
  {
    icon: Wifi,
    title: "Wi-Fi",
    text: "Transfers sensor data",
  },
  {
    icon: Database,
    title: "Cloud + AI",
    text: "Stores & analyzes data",
  },
  {
    icon: BarChart3,
    title: "Dashboard",
    text: "Turns data into insights",
  },
];

const insights = [
  {
    tag: "Solar Intelligence",
    title: "How weather affects solar generation",
    text: "Cloud cover, temperature and sunlight can significantly influence daily solar production.",
  },
  {
    tag: "AI & Energy",
    title: "Why prediction matters in home solar",
    text: "Knowing tomorrow's expected generation allows users to plan their energy usage more efficiently.",
  },
  {
    tag: "System Health",
    title: "Detecting solar performance loss early",
    text: "Monitoring patterns can help reveal overheating, shading or unexpected drops before they become costly.",
  },
];

function Home() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

useMotionValueEvent(scrollY, "change", (latest) => {
  setScrolled(latest > 80);
});

const heroY = useTransform(scrollY, [0, 700], [0, 120]);
const heroScale = useTransform(scrollY, [0, 700], [1, 1.06]);

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
  return (

    <div className="bg-[#F5F9FC] text-[#163047] overflow-x-hidden">

      {/* ================= GLOBAL NAVBAR ================= */}
<motion.nav
  initial={{ opacity: 0, y: -25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="fixed left-0 right-0 top-0 z-[9999] px-4 pt-4 md:px-6"
>
  <motion.div
    animate={{
      maxWidth: scrolled ? "1100px" : "1280px",
      paddingTop: scrolled ? "10px" : "14px",
      paddingBottom: scrolled ? "10px" : "14px",
    }}
    transition={{
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    }}
    className={`mx-auto flex items-center justify-between rounded-2xl border px-5 backdrop-blur-2xl transition-all duration-300 md:px-6 ${
      scrolled
        ? "border-[#DCEFFA] bg-white/95 shadow-[0_12px_40px_rgba(11,95,145,0.14)]"
        : "border-white/20 bg-white/10 shadow-lg shadow-black/5"
    }`}
  >
    {/* Logo */}
    <Link to="/" className="flex items-center">
      <motion.img
        src={logo}
        alt="SolarFlux Logo"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.25 }}
        className={`w-auto object-contain transition-all duration-300 ${
          scrolled ? "h-9" : "h-10"
        }`}
      />
    </Link>

    {/* Links */}
    <div
      className={`hidden items-center gap-7 text-sm lg:flex ${
        scrolled ? "text-[#668195]" : "text-white/85"
      }`}
    >
      {[
        ["Features", "#features"],
        ["How It Works", "#technology"],
        ["Why SolarFlux", "#why-solarflux"],
        ["About", "#about"],
        ["Insights", "#insights"],
      ].map(([name, link]) => (
        <motion.a
          key={name}
          href={link}
          whileHover={{ y: -2 }}
          className={`font-medium transition-colors ${
            scrolled
              ? "hover:text-[#1389C9]"
              : "hover:text-white"
          }`}
        >
          {name}
        </motion.a>
      ))}
    </div>

    {/* Dashboard */}
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        to="/dashboard"
        className="group flex items-center gap-2 rounded-xl bg-[#1389C9] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#0B5F91]/20 transition hover:bg-[#0B5F91]"
      >
        Dashboard

        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </motion.div>
  </motion.div>
</motion.nav>

{/* ================= HERO ================= */}
<section className="relative min-h-screen overflow-hidden">

  {/* Background Parallax */}
  <motion.div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url(${heroImage})`,
      y: heroY,
      scale: heroScale,
    }}
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#092F4A]/90 via-[#0B5F91]/55 to-transparent" />

  <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-8">

    {/* Hero Content */}
    <div className="flex min-h-[76vh] items-center">

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl"
      >

        {/* Badge */}
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md"
        >
          <motion.span
            animate={{
              opacity: [1, 0.4, 1],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-2 w-2 rounded-full bg-[#63B4E3]"
          />

          AI-Powered Solar Monitoring Platform
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-5xl font-semibold leading-[1.06] tracking-tight text-white md:text-7xl"
        >
          Smarter Solar.
          <br />

          <span className="bg-gradient-to-r from-white to-[#9ED8F5] bg-clip-text text-transparent">
            Clearer Decisions.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-base leading-7 text-white/75 md:text-lg"
        >
          Monitor your solar system, predict tomorrow&apos;s generation,
          understand performance issues and track real savings through one
          intelligent platform.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={item}
          className="mt-9 flex flex-wrap gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-[#1389C9] px-7 py-4 font-medium text-white shadow-xl shadow-sky-950/20"
            >
              Open Dashboard

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          <motion.a
            whileHover={{
              scale: 1.03,
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
            href="#features"
            className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-medium text-white backdrop-blur-lg"
          >
            Explore Features
          </motion.a>
        </motion.div>

      </motion.div>
    </div>

    {/* Hero Stats */}
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.9,
      }}
      className="pb-8"
    >
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl md:grid-cols-4">

        {[
          ["24/7", "Real-Time Monitoring"],
          ["AI", "Generation Prediction"],
          ["Live", "Weather Intelligence"],
          ["₹", "Savings Tracking"],
        ].map(([value, label], index) => (
          <motion.div
            key={label}
            whileHover={{
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1 + index * 0.12,
            }}
            className="border-white/15 px-5 py-5 text-center md:border-r md:last:border-r-0"
          >
            <h3 className="text-2xl font-semibold text-white">
              {value}
            </h3>

            <p className="mt-1 text-xs text-white/65">
              {label}
            </p>
          </motion.div>
        ))}

      </div>
    </motion.div>

  </div>
</section>
{/* ================= FEATURES ================= */}
<section id="features" className="py-28">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1389C9]">
        Smart Solar Intelligence
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#163047] md:text-5xl">
        More than just monitoring.
      </h2>

      <p className="mt-5 leading-7 text-[#668195]">
        SolarFlux converts raw solar and weather data into predictions,
        explanations, alerts and practical decisions.
      </p>
    </motion.div>

    {/* Feature Cards */}
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
    >
      {features.map(({ icon: Icon, title, text }) => (
        <motion.div
          key={title}
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
              scale: 0.96,
            },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          transition={{ duration: 0.25 }}
        >
          <SpotlightCard className="h-full rounded-3xl border border-[#DCEFFA] bg-white p-7 shadow-sm">

            {/* Icon */}
            <motion.div
              whileHover={{
                rotate: 6,
                scale: 1.08,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5FC] text-[#1389C9]"
            >
              <Icon size={22} />
            </motion.div>

            {/* Title */}
            <h3 className="mt-6 text-lg font-semibold text-[#163047]">
              {title}
            </h3>

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-[#668195]">
              {text}
            </p>

            {/* Bottom animated line */}
            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#1389C9] to-[#63B4E3] transition-all duration-500 group-hover:w-full" />

          </SpotlightCard>
        </motion.div>
      ))}
    </motion.div>

  </div>
</section>

     {/* ================= HOW IT WORKS / ARCHITECTURE ================= */}
<section
  id="technology"
  className="relative overflow-hidden bg-gradient-to-br from-[#0B5F91] via-[#1389C9] to-[#63B4E3] py-28"
>
  {/* Background glow */}
  <motion.div
    animate={{
      x: [0, 80, 0],
      y: [0, -40, 0],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
  />

  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
        How It Works
      </p>

      <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
        From sunlight to intelligence.
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-white/70">
        SolarFlux connects solar hardware, IoT sensors, cloud intelligence
        and AI into one complete smart-energy ecosystem.
      </p>
    </motion.div>

    {/* Flow */}
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.16,
          },
        },
      }}
      className="relative mt-16 grid gap-5 md:grid-cols-5"
    >
      {architecture.map(({ icon: Icon, title, text }, index) => (
        <motion.div
          key={title}
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
              scale: 0.92,
            },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="group relative rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl"
        >
          {/* Connector */}
          {index < architecture.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.4 + index * 0.15,
              }}
              className="absolute left-[90%] top-1/2 hidden h-[2px] w-[30%] origin-left bg-white/35 md:block"
            />
          )}

          {/* Icon */}
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.12,
            }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white"
          >
            <Icon size={25} />
          </motion.div>

          <p className="mt-5 font-medium text-white">
            {title}
          </p>

          <p className="mt-2 text-xs text-white/60">
            {text}
          </p>

          <span className="mt-5 block text-xs text-white/35">
            0{index + 1}
          </span>
        </motion.div>
      ))}
    </motion.div>

  </div>
</section>
     
     {/* ================= WHY SOLARFLUX ================= */}
<section
  id="why-solarflux"
  className="relative overflow-hidden py-28 bg-[#F5F9FC]"
>

  {/* Soft background glow */}
  <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#DCEFFA]/60 blur-3xl" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

    <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

      {/* LEFT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1389C9]">
          Why SolarFlux
        </p>

        <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#163047] md:text-5xl">
          Solar monitoring that goes
          <span className="text-[#1389C9]"> beyond raw data.</span>
        </h2>

        <p className="mt-6 max-w-xl leading-7 text-[#668195]">
          SolarFlux does more than show energy numbers. It combines IoT,
          weather intelligence, AI prediction and explainable insights to help
          users understand what is happening, what may happen next and what
          action they should take.
        </p>

        {/* Mini points */}
        <div className="mt-8 space-y-4">

          {[
            "Monitor your solar system in real time",
            "Predict tomorrow's energy generation",
            "Understand why performance changes",
            "Get smart recommendations and alerts",
          ].map((point, index) => (

            <motion.div
              key={point}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.12,
                duration: 0.5,
              }}
              className="flex items-center gap-3"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DCEFFA]">
                <div className="h-2 w-2 rounded-full bg-[#1389C9]" />
              </div>

              <p className="text-sm text-[#163047]">
                {point}
              </p>
            </motion.div>

          ))}

        </div>
      </motion.div>

      {/* RIGHT CARDS */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.13,
            },
          },
        }}
        className="grid gap-4 sm:grid-cols-2"
      >

        {[
          [
            Cpu,
            "Low-Cost IoT Hardware",
            "ESP32-based modular system designed to stay affordable and customizable.",
          ],
          [
            BrainCircuit,
            "AI + Explainable AI",
            "Predict solar generation and understand the reason behind every prediction.",
          ],
          [
            Gauge,
            "Actionable Intelligence",
            "Receive useful recommendations instead of only seeing graphs and numbers.",
          ],
          [
            Leaf,
            "Complete Transparency",
            "Track energy, system health, savings and environmental impact in one place.",
          ],
        ].map(([Icon, title, text], index) => (

          <motion.div
            key={title}
            variants={{
              hidden: {
                opacity: 0,
                y: 40,
                scale: 0.95,
              },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
            className={index === 1 || index === 3 ? "sm:translate-y-8" : ""}
          >

            <SpotlightCard className="h-full rounded-3xl border border-[#DCEFFA] bg-white p-7 shadow-sm">

              <motion.div
                whileHover={{
                  scale: 1.1,
                  rotate: 6,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5FC] text-[#1389C9]"
              >
                <Icon size={23} />
              </motion.div>

              <h3 className="mt-5 font-semibold text-[#163047]">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#668195]">
                {text}
              </p>

              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#1389C9] to-[#63B4E3] transition-all duration-500 group-hover:w-full" />

            </SpotlightCard>

          </motion.div>

        ))}

      </motion.div>

    </div>
  </div>
</section>
     {/* ================= ABOUT ================= */}
<section
  id="about"
  className="relative overflow-hidden bg-white py-28"
>
  {/* soft background glow */}
  <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#DCEFFA]/70 blur-3xl" />
  <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#63B4E3]/10 blur-3xl" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

    <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">

      {/* Left */}
      <motion.div
        initial={{ opacity: 0, x: -45 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1389C9]">
          About SolarFlux
        </p>

        <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#163047] md:text-5xl">
          One platform connecting
          <span className="text-[#1389C9]"> energy, IoT and AI.</span>
        </h2>

        <p className="mt-6 max-w-xl text-base leading-7 text-[#668195]">
          SolarFlux is an intelligent solar monitoring and optimization
          platform built for homes and small solar setups. It combines live
          sensor data, weather intelligence and machine learning to help users
          understand, predict and improve solar performance.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#B9DDF0] bg-[#F5F9FC] px-4 py-2 text-sm text-[#0B5F91]"
        >
          <Sun size={16} />
          Built for smarter, cleaner energy
        </motion.div>
      </motion.div>

      {/* Right visual */}
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative"
      >

        <div className="rounded-[2rem] bg-gradient-to-br from-[#0B5F91] to-[#63B4E3] p-8 shadow-2xl shadow-[#0B5F91]/15">

          <div className="grid grid-cols-2 gap-4">

            {[
              [Activity, "Monitor", "Live energy data"],
              [CloudSun, "Forecast", "Weather intelligence"],
              [BrainCircuit, "Predict", "AI-powered insights"],
              [Gauge, "Optimize", "Smarter energy use"],
            ].map(([Icon, title, text], index) => (

              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + index * 0.12,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                }}
                className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg"
              >
                <motion.div
                  whileHover={{
                    rotate: 6,
                    scale: 1.1,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white"
                >
                  <Icon size={21} />
                </motion.div>

                <h3 className="mt-4 font-semibold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-xs text-white/65">
                  {text}
                </p>
              </motion.div>

            ))}

          </div>

          {/* floating badge */}
          <motion.div
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 -left-5 rounded-2xl border border-[#DCEFFA] bg-white px-5 py-4 shadow-xl"
          >
            <p className="text-xs text-[#668195]">
              Solar Intelligence
            </p>
            <p className="mt-1 font-semibold text-[#163047]">
              Monitor → Predict → Optimize
            </p>
          </motion.div>

        </div>
      </motion.div>

    </div>
  </div>
</section>

      {/* ================= INSIGHTS ================= */}
{/* ================= INSIGHTS ================= */}
<section id="insights" className="py-28">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">

    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col justify-between gap-5 md:flex-row md:items-end"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1389C9]">
          Insights
        </p>

        <h2 className="mt-4 text-4xl font-semibold">
          Explore smarter solar.
        </h2>
      </div>

      <p className="max-w-md text-sm leading-6 text-[#668195]">
        Learn how weather, AI and monitoring can improve the performance
        of modern solar systems.
      </p>
    </motion.div>

    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.14,
          },
        },
      }}
      className="mt-12 grid gap-5 md:grid-cols-3"
    >
      {insights.map((article) => (
        <motion.article
          key={article.title}
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
              scale: 0.96,
            },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          whileHover={{
            y: -8,
            scale: 1.015,
          }}
        >
          <SpotlightCard className="h-full rounded-3xl border border-[#DCEFFA] bg-white p-7 shadow-sm">

            <span className="text-xs font-medium text-[#1389C9]">
              {article.tag}
            </span>

            <h3 className="mt-4 text-xl font-semibold leading-snug text-[#163047]">
              {article.title}
            </h3>

            <p className="mt-4 text-sm leading-6 text-[#668195]">
              {article.text}
            </p>

            <button className="group/button mt-7 flex items-center gap-2 text-sm font-medium text-[#0B5F91]">
              Read Insight

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover/button:translate-x-1"
              />
            </button>

            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#1389C9] to-[#63B4E3] transition-all duration-500 group-hover:w-full" />

          </SpotlightCard>
        </motion.article>
      ))}
    </motion.div>
  </div>
</section>
      {/* ================= CTA ================= */}
     {/* ================= CTA ================= */}
<section className="px-6 pb-28">
  <motion.div
    initial={{ opacity: 0, y: 45, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="relative max-w-7xl mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0B5F91] to-[#1389C9] px-8 py-14 text-white md:px-14"
  >

    {/* moving glow */}
    <motion.div
      animate={{
        x: ["-20%", "120%"],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute top-0 h-full w-48 rotate-12 bg-white/10 blur-3xl"
    />

    <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">

      <div>
        <p className="text-sm text-white/65">
          SolarFlux Intelligence Platform
        </p>

        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          Turn sunlight into smarter decisions.
        </h2>
      </div>

      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link
          to="/dashboard"
          className="group flex w-fit items-center gap-2 rounded-xl bg-white px-7 py-4 font-medium text-[#0B5F91]"
        >
          Launch Dashboard

          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </motion.div>

    </div>
  </motion.div>
</section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#092F4A] text-white">
  <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">

    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

      {/* Brand */}
      <div className="lg:col-span-2">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="inline-flex rounded-2xl px-4 py-2"
        >
          <img
            src={logo}
            alt="SolarFlux Logo"
            className="h-12 w-auto object-contain"
          />
        </motion.div>

        <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
          Intelligent solar monitoring, prediction and optimization
          powered by IoT, weather intelligence and AI.
        </p>

      </div>

      {/* Product */}
      <div>
        <h4 className="font-medium">Product</h4>

        <div className="mt-5 space-y-3 text-sm text-white/55">
          <p className="cursor-pointer transition hover:text-white">
            Dashboard
          </p>
          <p className="cursor-pointer transition hover:text-white">
            Monitoring
          </p>
          <p className="cursor-pointer transition hover:text-white">
            Analytics
          </p>
          <p className="cursor-pointer transition hover:text-white">
            Battery
          </p>
        </div>
      </div>

      {/* Intelligence */}
      <div>
        <h4 className="font-medium">Intelligence</h4>

        <div className="mt-5 space-y-3 text-sm text-white/55">
          <p className="cursor-pointer transition hover:text-white">
            Predictions
          </p>
          <p className="cursor-pointer transition hover:text-white">
            Explainable AI
          </p>
          <p className="cursor-pointer transition hover:text-white">
            Weather
          </p>
          <p className="cursor-pointer transition hover:text-white">
            Anomaly Detection
          </p>
        </div>
      </div>

      {/* Platform */}
      <div>
        <h4 className="font-medium">Platform</h4>

        <div className="mt-5 space-y-3 text-sm text-white/55">
          <p className="cursor-pointer transition hover:text-white">
            Features
          </p>
          <p className="cursor-pointer transition hover:text-white">
            How It Works
          </p>
          <p className="cursor-pointer transition hover:text-white">
            About
          </p>
          <p className="cursor-pointer transition hover:text-white">
            Insights
          </p>
        </div>
      </div>

    </div>

    {/* Bottom */}
    <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-7 text-xs text-white/45 md:flex-row">
      <p>© 2026 SolarFlux. All rights reserved.</p>

      <p>
        Built for smarter, cleaner energy.
      </p>
    </div>

  </div>
</footer>
    </div>
  );
}

export default Home;