const ESP32_BASE_URL =
  import.meta.env.VITE_ESP32_API_URL ||
  "http://172.20.10.6";

export async function getHardwareData() {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const response = await fetch(
      `${ESP32_BASE_URL}/data`,
      {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(
        `ESP32 returned ${response.status}`
      );
    }

    const data = await response.json();

    return {
      voltage: Number(data.voltage ?? 0),
      current: Number(data.current ?? 0),
      power: Number(data.power ?? 0),
      temperature: Number(
        data.temperature ?? 0
      ),
      light: Number(data.light ?? 0),

      lightUnit: data.lightUnit ?? "ADC",

      lightStatus:
        data.lightStatus ?? "UNKNOWN",

      // Older ESP32 firmware only reports solar-panel values. These optional
      // fields make battery readings available when the firmware provides them.
      batteryPercentage:
        data.batteryPercentage ?? data.battery_percentage,

      batteryStatus:
        data.batteryStatus ?? data.battery_status,

      batteryPower:
        data.batteryPower ?? data.battery_power,

      inaConnected:
        Boolean(data.inaConnected),

      online: true,

      timestamp: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}
