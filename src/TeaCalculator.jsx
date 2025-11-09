import React, { useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import CashCalculator from "./CashCalculator";
import {
  IndianRupee,
  Coffee,
  Droplet,
  Leaf,
  Candy,
  Sparkles,
  CupSoda,
  Copy as CopyIcon
} from "lucide-react";

/* ---------- Calm panel shell ---------- */
const PanelCard: React.FC<
  React.PropsWithChildren<{ className?: string, interactive?: boolean }>
> = ({ children, className = "", interactive = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={interactive ? { y: -2, scale: 1.01 } : undefined}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className={`group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent ${className}`}
  >
    <div className="relative rounded-2xl bg-[#222124]/85 backdrop-blur-md border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.28)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
      <div className="relative z-10">{children}</div>
    </div>
  </motion.div>
);

/* ---------- Stat shells ---------- */
type Tone = "chai" | "cream" | "sky" | "leaf" | "honey";
const toneClasses = (tone: Tone) => {
  switch (tone) {
    case "chai":
      return {
        ring: "from-amber-400 via-amber-300",
        glow: "bg-amber-400/25",
        chip: "bg-amber-400/10 text-amber-200"
      };
    case "cream":
      return {
        ring: "from-orange-300 via-amber-200",
        glow: "bg-orange-300/25",
        chip: "bg-orange-300/10 text-orange-200"
      };
    case "sky":
      return {
        ring: "from-sky-400 via-sky-300",
        glow: "bg-sky-400/25",
        chip: "bg-sky-400/10 text-sky-200"
      };
    case "leaf":
      return {
        ring: "from-emerald-400 via-emerald-300",
        glow: "bg-emerald-400/25",
        chip: "bg-emerald-400/10 text-emerald-200"
      };
    case "honey":
      return {
        ring: "from-amber-500 via-amber-300",
        glow: "bg-amber-500/25",
        chip: "bg-amber-500/10 text-amber-200"
      };
    default:
      return {
        ring: "from-amber-400 via-amber-300",
        glow: "bg-amber-400/25",
        chip: "bg-amber-400/10 text-amber-200"
      };
  }
};

const StatCard: React.FC<
  React.PropsWithChildren<{
    className?: string,
    tone?: Tone,
    icon?: React.ComponentType<any>,
    featured?: boolean
  }>
> = ({
  children,
  className = "",
  tone = "chai",
  icon: Icon,
  featured = false
}) => {
  const t = toneClasses(tone);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        featured ? { rotateY: 6, scale: 1.02 } : { y: -2, scale: 1.01 }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative rounded-2xl p-[1px] bg-gradient-to-br ${t.ring} to-transparent ${className}`}
    >
      {featured && (
        <motion.div
          className={`absolute -inset-6 ${t.glow} blur-3xl rounded-full opacity-40`}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="relative rounded-2xl bg-[#2b2a2d]/90 backdrop-blur-md border border-white/10 shadow-[0_10px_34px_rgba(0,0,0,0.35)] overflow-hidden">
        {Icon ? (
          <div
            className={`absolute top-2 right-2 rounded-full ${t.chip} p-1.5`}
          >
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

const Stat: React.FC<{
  label: string,
  value: React.ReactNode,
  unit?: string,
  note?: React.ReactNode,
  sub?: React.ReactNode
}> = ({ label, value, unit, note, sub }) => (
  <div className="flex h-full items-center justify-center text-center px-3 py-3">
    <div>
      <div className="text-[11px] uppercase tracking-wide text-white/70">
        {label}
      </div>
      <div className="mt-1 flex items-end justify-center gap-1">
        <div className="text-2xl font-semibold leading-none">{value}</div>
        {unit ? (
          <div className="text-[10px] pb-0.5 text-white/70">{unit}</div>
        ) : null}
      </div>
      {note ? (
        <div className="mt-0.5 text-[10px] text-white/60">{note}</div>
      ) : null}
      {sub ? <div className="mt-1 text-xs text-white/60">{sub}</div> : null}
    </div>
  </div>
);

/* ---------- Value Slider ---------- */

const ValueSlider: React.FC<{
  value: number,
  min: number,
  max: number,
  step?: number,
  onChange: (v: number) => void,
  label?: string
}> = ({ value, min, max, step = 1, onChange, label = "Number of cups" }) => {
  const pct = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [value, min, max]
  );
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-base font-medium">{label}</label>
        <div className="text-amber-300 font-semibold">{value}</div>
      </div>
      <div className="relative">
        <div className="h-3 w-full rounded-full bg-[#151417]">
          <div
            className="h-3 rounded-full bg-amber-400"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
          aria-label={label}
        />
        <div
          className="absolute -top-8 translate-x-[-50%] px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-400 text-black"
          style={{ left: `calc(${pct}%)` }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

/* ---------- Steps (simplified) ---------- */
const StepsCard: React.FC<{ steps: string[] }> = ({ steps }) => (
  <PanelCard>
    <div className="px-3 py-3">
      <h3 className="text-base font-semibold text-amber-300 mb-2">Steps</h3>
      <ol className="list-decimal list-inside space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="text-sm leading-snug">
            {s}
          </li>
        ))}
      </ol>
      <p className="text-[11px] text-white/50 mt-3">
        Tip: set a 6:30 alarm in your phone’s Clock app for the rest step.
      </p>
    </div>
  </PanelCard>
);

/* ---------- Main ---------- */
const TeaCalculator = ({ onBack }) => {
  const [showCashCalculator, setShowCashCalculator] = useState(false);
  const [cups, setCups] = useState(6);

  // Ratios
  const milkPerCup = 2 / 3;
  const waterPerCup = 1 / 3;
  const teaLeavesPerCup = 1 / 2;
  const sugarPerCup = 1.25;

  const cupToMl = 125;
  const tbspToG = 8;

  const c = parseInt(String(cups), 10) || 0;
  const totalMilk = c * milkPerCup;
  const totalWater = c * waterPerCup;
  const totalTeaLeaves = c * teaLeavesPerCup;
  const totalSugar = c * sugarPerCup;

  const totalMilkMl = totalMilk * cupToMl;
  const totalWaterMl = totalWater * cupToMl;
  const totalTeaLeavesG = totalTeaLeaves * tbspToG;
  const totalSugarG = totalSugar * tbspToG;

  const AnimatedCounter = ({
    end,
    suffix = "",
    decimals = 0,
    duration = 0.8
  }: {
    end: number,
    suffix?: string,
    decimals?: number,
    duration?: number
  }) => (
    <CountUp
      end={end}
      decimals={decimals}
      suffix={suffix}
      duration={duration}
    />
  );

  const copyDetails = () => {
    const details = `For ${cups} cup(s) of tea:
- ${totalMilk.toFixed(2)} cups (${totalMilkMl.toFixed(0)} ml) milk
- ${totalWater.toFixed(2)} cups (${totalWaterMl.toFixed(
      0
    )} ml) water (+ a little more)
- ${totalTeaLeaves.toFixed(2)} tablespoons (${totalTeaLeavesG.toFixed(
      0
    )} g) tea leaves
- ${totalSugar.toFixed(2)} tablespoons (${totalSugarG.toFixed(0)} g) sugar`;
    navigator.clipboard
      ?.writeText(details)
      .then(() => toast.success("Details copied to clipboard"))
      .catch(() => toast.error("Copy failed"));
  };

  // Steps
  // Steps
  const steps = useMemo(() => {
    const plural = (n: number, one: string, many: string) =>
      n === 1 ? one : many;
    return [
      `Add ingredients to a saucepan`,
      `Boil on high flame ${c} ${plural(
        c,
        "time",
        "times"
      )}. (Let it rise, drop, and repeat.)`,
      `Turn off heat and rest for 6:30 minutes — set a timer in your phone’s Clock app now.`,
      `After resting, boil again on high flame ${c} ${plural(
        c,
        "time",
        "times"
      )}. Strain and serve hot.`
    ];
  }, [c]);

  if (showCashCalculator) return <CashCalculator />;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto text-white font-sans transition-all duration-300">
      {/* Toolbar */}
      <PanelCard className="mb-3">
        <div className="flex items-center justify-between px-3 py-3">
          <h1 className="text-xl font-bold text-amber-300">Tea Calculator</h1>
          <div className="flex gap-2">
            <button
              onClick={copyDetails}
              className="h-10 w-10 rounded-xl bg-white/5 active:scale-95 transition flex items-center justify-center"
              title="Copy ingredient details"
            >
              <CopyIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowCashCalculator(!showCashCalculator)}
              className="h-10 w-10 rounded-xl bg-emerald-400 text-black active:scale-95 transition flex items-center justify-center"
              title="Open cash calculator"
            >
              <IndianRupee className="w-5 h-5" />
            </button>
          </div>
        </div>
      </PanelCard>

      {/* Slider */}
      <PanelCard className="mb-4">
        <div className="px-3 py-4">
          <ValueSlider
            value={c}
            min={1}
            max={20}
            onChange={setCups}
            label="Cups"
          />
        </div>
      </PanelCard>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <StatCard tone="chai" icon={Coffee} featured>
          <div className="flex flex-col items-center justify-center h-full py-4 text-center">
            <h3 className="text-base font-semibold text-amber-300">Cups</h3>
            <div className="mt-1 text-4xl font-bold">
              <AnimatedCounter end={c} />
            </div>
            <div className="text-sm text-white/70 mt-1">of Tea</div>
          </div>
        </StatCard>

        <StatCard tone="cream" icon={CupSoda}>
          <Stat
            label="Milk"
            value={
              <AnimatedCounter
                end={Number(totalMilk.toFixed(2))}
                decimals={2}
              />
            }
            unit="cups"
            sub={
              <AnimatedCounter
                end={Number(totalMilkMl.toFixed(0))}
                suffix=" ml"
              />
            }
          />
        </StatCard>

        <StatCard tone="sky" icon={Droplet}>
          <Stat
            label="Water"
            value={
              <AnimatedCounter
                end={Number(totalWater.toFixed(2))}
                decimals={2}
              />
            }
            unit="cups"
            note="+ a little more"
            sub={
              <AnimatedCounter
                end={Number(totalWaterMl.toFixed(0))}
                suffix=" ml"
              />
            }
          />
        </StatCard>

        <StatCard tone="leaf" icon={Leaf}>
          <Stat
            label="Tea Leaves"
            value={
              <AnimatedCounter
                end={Number(totalTeaLeaves.toFixed(2))}
                decimals={2}
              />
            }
            unit="tbsp"
            sub={
              <AnimatedCounter
                end={Number(totalTeaLeavesG.toFixed(0))}
                suffix=" g"
              />
            }
          />
        </StatCard>

        <StatCard tone="honey" icon={Candy}>
          <Stat
            label="Sugar"
            value={
              <AnimatedCounter
                end={Number(totalSugar.toFixed(2))}
                decimals={2}
              />
            }
            unit="tbsp"
            sub={
              <AnimatedCounter
                end={Number(totalSugarG.toFixed(0))}
                suffix=" g"
              />
            }
          />
        </StatCard>

        <StatCard tone="chai" icon={Sparkles}>
          <div className="flex items-center justify-center h-full px-3 py-3 text-center">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-white/70">
                Add
              </div>
              <div className="mt-2 flex flex-wrap gap-2 justify-center text-[11px] opacity-90">
                <span className="px-2 py-1 rounded-full bg-white/10">
                  Ginger
                </span>
                <span className="px-2 py-1 rounded-full bg-white/10">
                  Tea Masala
                </span>
                <span className="px-2 py-1 rounded-full bg-white/10">
                  Cardamom
                </span>
              </div>
            </div>
          </div>
        </StatCard>
      </div>

      {/* Steps */}
      <div className="mt-4">
        <StepsCard steps={steps} />
      </div>

      <Toaster />
    </div>
  );
};

export default TeaCalculator;
