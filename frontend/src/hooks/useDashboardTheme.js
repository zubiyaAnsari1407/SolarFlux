import { useEffect, useState } from "react";
import { dashboardThemes } from "../themes/dashboardThemes";

function getThemeFromTime(hour) {
  if (hour >= 5 && hour < 11) {
    return "morning";
  }

  if (hour >= 11 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 20) {
    return "evening";
  }

  return "night";
}

function useDashboardTheme(manualTheme = null) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const automaticTheme = getThemeFromTime(
    currentTime.getHours()
  );

  const activeTheme =
    manualTheme || automaticTheme;

  return {
    currentTime,
    themeName: activeTheme,
    automaticTheme,
    theme: dashboardThemes[activeTheme],
  };
}

export default useDashboardTheme;