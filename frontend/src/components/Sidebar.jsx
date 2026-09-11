import {
  LayoutDashboard,
  Activity,
  BarChart3,
  BatteryCharging,
  CloudSun,
  BrainCircuit,
  Bell,
  Settings,
  Sun
} from "lucide-react";

const menu = [
  [LayoutDashboard, "Dashboard"],
  [Activity, "Monitoring"],
  [BarChart3, "Analytics"],
  [BatteryCharging, "Battery"],
  [CloudSun, "Weather"],
  [BrainCircuit, "Predictions"],
  [Bell, "Alerts"],
  [Settings, "Settings"],
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#1F2B3A] text-white p-6">

      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[#C48A5F] p-2 rounded-xl">
          <Sun size={25} />
        </div>

        <div>
          <h1 className="text-xl font-semibold">SolarFlux</h1>
          <p className="text-xs text-[#8FADBF]">Smart Solar Intelligence</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menu.map(([Icon, name], index) => (
          <button
            key={name}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
            ${
              index === 0
                ? "bg-[#31445A] text-white"
                : "text-[#8FADBF] hover:bg-[#31445A] hover:text-white"
            }`}
          >
            <Icon size={19} />
            {name}
          </button>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;