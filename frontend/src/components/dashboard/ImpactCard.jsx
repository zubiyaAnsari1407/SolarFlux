import { motion } from "motion/react";

import {
  Leaf,
  IndianRupee,
  TreePine,
  TrendingUp,
} from "lucide-react";

const defaultData = {
  savingsToday: 285,
  monthlySavings: 4860,
  co2Avoided: 12.4,
  treesEquivalent: 7,
};

function ImpactCard({
  theme,
  data,
}) {
  const safeData = data ?? defaultData;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-1000"
      style={{
        backgroundColor: theme.impactBg,
        borderColor: theme.border,
        color: "#FFFFFF",
      }}
    >

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">
            Today's Impact
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            Clean Energy Impact
          </h3>
        </div>

        <Leaf
          size={22}
          style={{ color: theme.success }}
        />

      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl"
        >
          <IndianRupee
            size={19}
            style={{ color: theme.solar }}
          />

          <p className="mt-5 text-[10px] text-white/55">
            Today's Savings
          </p>

          <p className="mt-1 text-xl font-semibold">
            ₹{safeData.savingsToday}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl"
        >
          <Leaf
            size={19}
            style={{ color: theme.success }}
          />

          <p className="mt-5 text-[10px] text-white/55">
            CO₂ Avoided
          </p>

          <p className="mt-1 text-xl font-semibold">
            {safeData.co2Avoided} kg
          </p>
        </motion.div>

      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-[10px] text-white/50">
              Monthly Savings
            </p>

            <p
              className="mt-1 text-xl font-semibold"
              style={{ color: theme.solar }}
            >
              ₹{safeData.monthlySavings.toLocaleString()}
            </p>
          </div>

          <TrendingUp
            size={20}
            style={{ color: theme.solar }}
          />

        </div>

      </div>

         <div className="mt-4 flex items-center gap-3 text-base leading-6 text-white/75">

  <TreePine 
    size={20} 
    style={{ color: theme.success }} 
  /> 

  Equivalent environmental impact of approximately{" "} 
  {safeData.treesEquivalent} trees. 

</div>

    </motion.section>
  );
}

export default ImpactCard;