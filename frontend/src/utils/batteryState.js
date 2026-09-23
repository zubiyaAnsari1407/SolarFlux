const DEFAULT_BATTERY = {
  percentage: 78,
  status: "Charging",
  power: 1.67,
  estimatedTime: "2.8 hrs",
  capacity: 12.4,
  health: 94,
};

function toPercentage(value, fallback) {
  const percentage = Number(value);

  return Number.isFinite(percentage)
    ? Math.min(100, Math.max(0, Math.round(percentage)))
    : fallback;
}

/**
 * Keeps every dashboard component on the same battery reading. The INA219
 * payload describes the solar panel, so its voltage must not be used to
 * calculate battery charge. A future hardware battery payload can provide
 * batteryPercentage and batteryStatus explicitly.
 */
export function getBatteryState({
  dashboardBattery,
  hardwareData,
  hardwareOnline = false,
} = {}) {
  const hasLiveBatteryReading =
    hardwareOnline &&
    hardwareData?.batteryPercentage !== null &&
    hardwareData?.batteryPercentage !== undefined &&
    Number.isFinite(Number(hardwareData?.batteryPercentage));

  return {
    ...DEFAULT_BATTERY,
    ...dashboardBattery,
    percentage: toPercentage(
      hasLiveBatteryReading
        ? hardwareData.batteryPercentage
        : dashboardBattery?.percentage,
      DEFAULT_BATTERY.percentage,
    ),
    status:
      (hasLiveBatteryReading && hardwareData?.batteryStatus) ||
      dashboardBattery?.status ||
      DEFAULT_BATTERY.status,
    power:
      hardwareData?.batteryPower ??
      dashboardBattery?.power ??
      DEFAULT_BATTERY.power,
    isLive: hasLiveBatteryReading,
  };
}
