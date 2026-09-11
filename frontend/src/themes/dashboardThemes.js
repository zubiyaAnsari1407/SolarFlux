// src/themes/dashboardThemes.js

import morningImg from "../assets/morning-img.png";
import afternoonImg from "../assets/afternoon-img.png";
import eveningImg from "../assets/evening-img.png";
import nightImg from "../assets/night-img.png";

export const dashboardThemes = {
  morning: {
    name: "Morning",
    isDark: false,

    // Background
    backgroundImage: morningImg,
   overlay: "rgba(255, 248, 230, 0.38)",

navbarBg: "rgba(255,255,255,0.82)",
headerBg: "rgba(255,255,255,0.72)",
cardBg: "rgba(255,255,255,0.70)",
chartBg: "rgba(255,255,255,0.91)",
weatherCard: "rgba(255,250,235,0.76)",

text: "#102B3C",
muted: "#4F6878",

    border: "rgba(255,255,255,0.68)",

    primary: "#DB9D27",
    secondary: "#63B4E3",

    solar: "#E9A52C",
    consumption: "#E57C4F",
    battery: "#318DBA",
    success: "#4DA779",

    softGold: "rgba(255,232,174,0.72)",
    softBlue: "rgba(220,239,250,0.72)",
    softOrange: "rgba(255,224,207,0.72)",

    impactBg: "rgba(37,75,95,0.78)",
  },

  afternoon: {
    name: "Afternoon",
    isDark: false,

    backgroundImage: afternoonImg,

    // Slight warm overlay so image feels golden-hour
    overlay: "rgba(255, 230, 190, 0.30)",

    navbarBg: "rgba(255,255,255,0.70)",
    headerBg: "rgba(255,250,240,0.55)",
    cardBg: "rgba(255,255,255,0.56)",

    chartBg: "rgba(255,255,255,0.84)",

    weatherCard: "rgba(255,240,212,0.55)",

    text: "#203748",
    muted: "#627987",

    border: "rgba(255,255,255,0.64)",

    primary: "#E78E35",
    secondary: "#F1B94D",

    solar: "#F0AC36",
    consumption: "#E9784F",
    battery: "#398EB8",
    success: "#4DA779",

    softGold: "rgba(255,232,169,0.74)",
    softBlue: "rgba(219,239,248,0.72)",
    softOrange: "rgba(255,219,198,0.72)",

    impactBg: "rgba(129,76,49,0.78)",
  },

  evening: {
    name: "Evening",
    isDark: true,

    backgroundImage: eveningImg,

    // Darker overlay for strong white-text readability
    overlay: "rgba(24, 29, 70, 0.46)",

    navbarBg: "rgba(28,35,82,0.60)",
    headerBg: "rgba(55,55,110,0.38)",
    cardBg: "rgba(72,72,126,0.34)",

    // More opaque than normal cards
    chartBg: "rgba(51,55,105,0.62)",

    weatherCard: "rgba(83,72,120,0.38)",

    text: "#FFFFFF",
    muted: "#D4D7EA",

    border: "rgba(255,255,255,0.18)",

    primary: "#98A3DF",
    secondary: "#EF946A",

    solar: "#F4BA4D",
    consumption: "#F17C55",
    battery: "#6CC8BA",
    success: "#63D69B",

    softGold: "rgba(244,186,77,0.18)",
    softBlue: "rgba(152,163,223,0.18)",
    softOrange: "rgba(239,148,106,0.18)",

    impactBg: "rgba(39,42,88,0.68)",
  },

  night: {
    name: "Night",
    isDark: true,

    backgroundImage: nightImg,

    // Night image remains visible but content stays readable
    overlay: "rgba(3, 14, 25, 0.58)",

    navbarBg: "rgba(6,22,36,0.68)",
    headerBg: "rgba(11,31,47,0.54)",
    cardBg: "rgba(13,35,52,0.52)",

    chartBg: "rgba(9,28,44,0.78)",

    weatherCard: "rgba(13,42,65,0.58)",

    text: "#F4F8FA",
    muted: "#A9BAC5",

    border: "rgba(147,188,212,0.16)",

    primary: "#4A96C0",
    secondary: "#F0A542",

    solar: "#F0AB3D",
    consumption: "#E47B46",
    battery: "#4BCB91",
    success: "#48D493",

    softGold: "rgba(240,171,61,0.16)",
    softBlue: "rgba(74,150,192,0.16)",
    softOrange: "rgba(228,123,70,0.16)",

    impactBg: "rgba(6,25,39,0.76)",
  },
};