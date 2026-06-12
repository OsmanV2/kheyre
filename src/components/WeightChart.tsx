import { TrendingUp } from 'lucide-react';

interface WeightChartProps {
  currentWeight: number;
  goal: "Baruur Dhimis" | "Muruq Dhisid" | "Miisaan Ilaalin";
}

export default function WeightChart({ currentWeight, goal }: WeightChartProps) {
  // Logic to simulate weekly progress based on current weight and goal
  const isLoss = goal === "Baruur Dhimis";
  const isGain = goal === "Muruq Dhisid";

  const diff = isLoss ? 1.5 : isGain ? -1.2 : 0.1;

  // Let's create actual weight values
  const w1 = Number((currentWeight + diff * 3).toFixed(1));
  const w2 = Number((currentWeight + diff * 2).toFixed(1));
  const w3 = Number((currentWeight + diff * 1).toFixed(1));
  const wActual = currentWeight;

  // Let's set targets (Goal is e.g. 5kg less for dhimis, 4kg more for dhisid)
  const targetWeight = isLoss ? currentWeight - 5 : isGain ? currentWeight + 4 : currentWeight;

  // Render heights as percentages of the max of all weights
  const maxWeight = Math.max(w1, w2, w3, wActual, targetWeight) * 1.1;

  const h1 = `${(w1 / maxWeight) * 100}%`;
  const h2 = `${(w2 / maxWeight) * 100}%`;
  const h3 = `${(w3 / maxWeight) * 100}%`;
  const hActual = `${(wActual / maxWeight) * 100}%`;

  const targetHeight = `${(targetWeight / maxWeight) * 100}%`;

  return (
    <div className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-container" />
          Kordhinta & Dhimista Miisaanka (Weight Progress)
        </h3>
        <div className="flex gap-4">
          <span className="text-xs text-text-secondary flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_4px_rgba(255,193,7,0.5)]"></span> 
            Jiheeye (Actual)
          </span>
          <span className="text-xs text-text-secondary flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-border-subtle"></span> 
            Yoolka (Goal: {targetWeight.toFixed(1)} kg)
          </span>
        </div>
      </div>

      {/* Styled barchart container */}
      <div className="h-44 flex items-end justify-between gap-4 px-2 pt-6 relative border-b border-border-subtle/50">
        
        {/* Goal guideline overlay */}
        <div 
          className="absolute left-0 right-0 border-t border-dashed border-border-subtle z-0 flex justify-end items-start"
          style={{ bottom: targetHeight }}
        >
          <span className="text-[9px] text-text-secondary bg-background-dark/80 px-1.5 py-0.5 rounded -mt-2.5 border border-border-subtle select-none font-mono">
            Yoolka: {targetWeight}kg
          </span>
        </div>

        {/* Week 1 column */}
        <div className="flex-1 bg-surface-input rounded-t-lg relative group h-[85%] z-10">
          <div 
            className="absolute bottom-0 w-full bg-primary-container/20 hover:bg-primary-container/30 transition-all rounded-t-lg ease-out duration-300" 
            style={{ height: h1 }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-background-dark px-1.5 py-0.5 rounded border border-border-subtle z-20">
              {w1}kg
            </span>
          </div>
        </div>

        {/* Week 2 column */}
        <div className="flex-1 bg-surface-input rounded-t-lg relative group h-[85%] z-10">
          <div 
            className="absolute bottom-0 w-full bg-primary-container/20 hover:bg-primary-container/30 transition-all rounded-t-lg ease-out duration-300" 
            style={{ height: h2 }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-background-dark px-1.5 py-0.5 rounded border border-border-subtle z-20">
              {w2}kg
            </span>
          </div>
        </div>

        {/* Week 3 column */}
        <div className="flex-1 bg-surface-input rounded-t-lg relative group h-[85%] z-10">
          <div 
            className="absolute bottom-0 w-full bg-primary-container/20 hover:bg-primary-container/30 transition-all rounded-t-lg ease-out duration-300" 
            style={{ height: h3 }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-background-dark px-1.5 py-0.5 rounded border border-border-subtle z-20">
              {w3}kg
            </span>
          </div>
        </div>

        {/* Hadda (Current Week) column - styled prominently */}
        <div className="flex-1 bg-surface-input rounded-t-lg relative group h-[85%] z-10">
          <div 
            className="absolute bottom-0 w-full bg-primary-container rounded-t-lg transition-all ease-out duration-300 shadow-[0_-4px_12px_rgba(255,193,7,0.3)] hover:brightness-110" 
            style={{ height: hActual }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-primary-container bg-background-dark px-1.5 py-0.5 rounded border border-primary-container/30 z-20">
              {wActual}kg
            </span>
          </div>
        </div>
      </div>

      {/* Weekday titles */}
      <div className="flex justify-between mt-4 text-xs font-semibold text-text-secondary">
        <span>Asbuuc 1</span>
        <span>Asbuuc 2</span>
        <span>Asbuuc 3</span>
        <span className="text-primary-container font-extrabold uppercase animate-pulse">Hadda</span>
      </div>
    </div>
  );
}
