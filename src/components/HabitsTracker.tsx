import React, { useState } from 'react';
import { Habit } from '../types';
import { Check, Plus, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface HabitsTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (text: string) => void;
  onDeleteHabit: (id: string) => void;
}

export default function HabitsTracker({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}: HabitsTrackerProps) {
  const [newHabitText, setNewHabitText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  // Complete count
  const completedCount = habits.filter(h => h.done).length;
  const totalCount = habits.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitText.trim()) {
      onAddHabit(newHabitText.trim());
      setNewHabitText("");
      setIsAdding(false);
    }
  };

  return (
    <section className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-lg h-full flex flex-col justify-between">
      {/* Habits Header */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">
            Qorshaha &amp; Caadooyinka
          </h3>
          <span className="text-xs font-bold bg-primary-container/10 border border-primary-container/20 text-primary-container px-2 py-0.5 rounded-full">
            {completedCount}/{totalCount} Done
          </span>
        </div>

        {/* Habits List */}
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-3 bg-surface-input border rounded-lg hover:border-primary-container/40 transition-colors duration-150 ${
                habit.done ? 'border-primary-container/20' : 'border-border-subtle'
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={habit.done}
                  onChange={() => onToggleHabit(habit.id)}
                  className="rounded text-primary-container focus:ring-primary-container bg-surface-card border-border-subtle h-4 w-4 shrink-0 transition-colors"
                />
                <span
                  className={`text-sm select-none break-all transition-all duration-150 ${
                    habit.done ? 'line-through text-on-surface-variant italic' : 'text-on-background'
                  }`}
                >
                  {habit.text}
                </span>
              </label>

              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="text-text-secondary hover:text-error-red p-1 rounded-md transition-colors"
                title="Tirtir"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Quick add toggle form */}
          {isAdding ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Ku qor caado cusub..."
                value={newHabitText}
                onChange={(e) => setNewHabitText(e.target.value)}
                className="flex-1 bg-surface-input border border-primary-container rounded-lg px-3 py-1.5 text-xs text-on-background focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-container hover:bg-amber-400 text-on-primary font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Kudar
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-surface-input border border-border-subtle text-text-secondary font-medium px-2 py-1.5 rounded-lg text-xs hover:text-text-primary transition-colors cursor-pointer"
              >
                Xir
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2 border border-dashed border-border-subtle rounded-lg text-xs text-text-secondary hover:text-primary-container hover:border-primary-container transition-all cursor-pointer font-semibold"
            >
              + Add Habit (Caado Cusub)
            </button>
          )}
        </div>
      </div>

      {/* Calendar Component */}
      <div className="mt-8 pt-8 border-t border-border-subtle">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary-container" />
            Kalandarka
          </h3>
          <div className="flex gap-1">
            <button className="text-text-secondary hover:bg-surface-input hover:text-text-primary p-1 rounded transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="text-text-secondary hover:bg-surface-input hover:text-text-primary p-1 rounded transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-center mb-4 font-bold text-sm text-text-primary">Juun 2026</div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-extrabold text-text-secondary mb-2 uppercase">
          <span>Ax</span>
          <span>Is</span>
          <span>Ta</span>
          <span>Ar</span>
          <span>Kh</span>
          <span>Ji</span>
          <span>Sa</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center font-sans font-semibold">
          {/* Mock previous month overhang */}
          <div className="p-1.5 text-[10px] text-on-surface-variant/20 select-none">29</div>
          <div className="p-1.5 text-[10px] text-on-surface-variant/20 select-none">30</div>

          {/* June dates */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((day) => {
            const isActive = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`p-1.5 text-[10px] rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-md shadow-primary-container/20 scale-105'
                    : 'hover:bg-surface-input text-on-background'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
