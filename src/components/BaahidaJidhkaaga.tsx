import React from 'react';
import { MacroBreakdown } from '../types';
import { Flame, Droplet, Dumbbell, BarChart3 } from 'lucide-react';

interface BaahidaJidhkaagaProps {
  macros: MacroBreakdown;
}

export default function BaahidaJidhkaaga({ macros }: BaahidaJidhkaagaProps) {
  return (
    <div className="bg-surface-card p-6 md:p-8 rounded-xl border border-border-subtle shadow-xl relative overflow-hidden">
      {/* Decorative Background Graphic */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <BarChart3 className="h-64 w-64 text-on-background" />
      </div>

      <h2 className="text-2xl font-bold text-primary-container mb-6">Baahida Jidhkaaga</h2>

      {/* Grid of Three Daily Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Calories Card */}
        <div className="bg-surface-input p-4 rounded-xl border border-border-subtle hover:border-primary-container/30 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2 text-primary-container">
            <Flame className="h-5 w-5 fill-primary-container/20" />
            <p className="text-xs font-semibold text-text-secondary uppercase">Cuntada Maanta</p>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            {macros.calories.toLocaleString()} <span className="text-xs font-medium text-on-surface-variant">Kcal</span>
          </p>
        </div>

        {/* Water Card */}
        <div className="bg-surface-input p-4 rounded-xl border border-border-subtle hover:border-primary-container/30 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2 text-primary-container">
            <Droplet className="h-5 w-5 fill-primary-container/20" />
            <p className="text-xs font-semibold text-text-secondary uppercase">Baahida Biyaha</p>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            {macros.water.toFixed(1)} <span className="text-xs font-medium text-on-surface-variant font-sans">Litir</span>
          </p>
        </div>

        {/* Exercises Card */}
        <div className="bg-surface-input p-4 rounded-xl border border-border-subtle hover:border-primary-container/30 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2 text-primary-container">
            <Dumbbell className="h-5 w-5" />
            <p className="text-xs font-semibold text-text-secondary uppercase">Jimicsiga</p>
          </div>
          <p className="text-2xl font-extrabold text-text-primary">
            {macros.workoutTime} <span className="text-xs font-medium text-on-surface-variant font-sans">Daqiiqo</span>
          </p>
        </div>
      </div>

      {/* Macro details bars */}
      <div className="space-y-6">
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-border-subtle pb-2">
          Macros Breakdown (Nafaqooyinka)
        </h4>

        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-text-primary flex items-center gap-1">🥩 Borotiin (Protein)</span>
              <span className="text-primary-container">{macros.protein}g / 30%</span>
            </div>
            <div className="w-full h-3 bg-surface-input rounded-full overflow-hidden border border-border-subtle">
              <div 
                className="h-full bg-primary-container rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(255,193,7,0.3)]"
                style={{ width: '30%' }}
              ></div>
            </div>
          </div>

          {/* Carbohydrates */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-text-primary flex items-center gap-1">🍚 Karbohaydrayt (Carbs)</span>
              <span className="text-primary-container">{macros.carbs}g / 45%</span>
            </div>
            <div className="w-full h-3 bg-surface-input rounded-full overflow-hidden border border-border-subtle">
              <div 
                className="h-full bg-primary-container/70 rounded-full transition-all duration-500 ease-out shadow-[0_0_6px_rgba(255,193,7,0.2)]"
                style={{ width: '45%' }}
              ></div>
            </div>
          </div>

          {/* Fats */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-text-primary flex items-center gap-1">🥑 Dufan Caafimaad (Fats)</span>
              <span className="text-primary-container">{macros.fats}g / 25%</span>
            </div>
            <div className="w-full h-3 bg-surface-input rounded-full overflow-hidden border border-border-subtle">
              <div 
                className="h-full bg-primary-container/40 rounded-full transition-all duration-500 ease-out"
                style={{ width: '25%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
