import React, { useState } from 'react';
import { MealPlan, MealItem } from '../types';
import { Utensils, Plus, Trash2 } from 'lucide-react';

interface MealPlanPanelProps {
  meals: MealPlan[];
  onAddFoodItem: (mealId: "qurac" | "qado" | "casho", item: MealItem) => void;
  onRemoveFoodItem: (mealId: "qurac" | "qado" | "casho", index: number) => void;
  onUpdateCalories: (mealId: "qurac" | "qado" | "casho", calories: number) => void;
}

export default function MealPlanPanel({
  meals,
  onAddFoodItem,
  onRemoveFoodItem,
  onUpdateCalories,
}: MealPlanPanelProps) {
  // Toggle form states for each meal type
  const [activeFormMeal, setActiveFormMeal] = useState<"qurac" | "qado" | "casho" | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");

  const handleAddItemSubmit = (mealId: "qurac" | "qado" | "casho", e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      onAddFoodItem(mealId, {
        name: itemName.trim(),
        amount: itemAmount.trim() || "-",
      });
      setItemName("");
      setItemAmount("");
      setActiveFormMeal(null);
    }
  };

  const getMealIconEmoji = (id: string) => {
    switch (id) {
      case "qurac": return "🍳";
      case "qado": return "🍗";
      case "casho": return "🐟";
      default: return "🥗";
    }
  };

  return (
    <section className="bg-surface-card p-6 md:p-8 rounded-xl border border-border-subtle shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-container/10 rounded-lg border border-primary-container/20">
          <Utensils className="h-6 w-6 text-primary-container" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">Qorshaha Cuntada Maanta</h2>
          <p className="text-xs text-text-secondary">Wixii aad cuni lahayd maanta oo dhan si aad u gaarto hadafkaaga.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-surface-input p-6 rounded-xl border border-border-subtle hover:border-primary-container/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Meal Header */}
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-border-subtle/50">
                <span className="text-lg font-bold text-primary-container flex items-center gap-1.5">
                  <span className="text-2xl">{getMealIconEmoji(meal.id)}</span>
                  {meal.title}
                </span>
                <span className="text-xs font-semibold bg-surface-card border border-border-subtle px-2.5 py-1 rounded text-on-surface-variant">
                  {meal.calories} Kcal
                </span>
              </div>

              {/* Meal Food items list */}
              <ul className="space-y-3">
                {meal.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center group/item py-2 border-b border-border-subtle/30 text-sm"
                  >
                    <span className="text-on-background hover:text-text-primary transition-colors flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-container/40"></span>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-on-surface-variant bg-surface-card border border-border-subtle px-1.5 py-0.5 rounded">
                        {item.amount}
                      </span>
                      <button
                        onClick={() => onRemoveFoodItem(meal.id, idx)}
                        className="opacity-0 group-hover/item:opacity-100 text-text-secondary hover:text-error-red transition-all p-0.5 rounded"
                        title="Tirtir"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick adding form */}
            <div className="mt-5">
              {activeFormMeal === meal.id ? (
                <form onSubmit={(e) => handleAddItemSubmit(meal.id, e)} className="space-y-2.5 bg-surface-card p-3 rounded-lg border border-border-subtle">
                  <div>
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="Cuntada (t.g. Ukun)"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full bg-surface-input border border-border-subtle rounded px-2.5 py-1 text-xs text-on-background focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cadadka (t.g. 3 xabo, 100g)"
                      value={itemAmount}
                      onChange={(e) => setItemAmount(e.target.value)}
                      className="w-full bg-surface-input border border-border-subtle rounded px-2.5 py-1 text-xs text-on-background focus:outline-none focus:border-primary-container"
                    />
                    <button
                      type="submit"
                      className="bg-primary-container text-on-primary font-bold px-3 rounded text-xs hover:bg-amber-400 cursor-pointer"
                    >
                      Ok
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormMeal(null)}
                      className="bg-surface-input border border-border-subtle text-text-secondary px-2 rounded text-xs hover:text-text-primary cursor-pointer"
                    >
                      X
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setItemName("");
                    setItemAmount("");
                    setActiveFormMeal(meal.id);
                  }}
                  className="w-full py-1.5 border border-dashed border-border-subtle hover:border-primary-container/40 rounded-lg text-xs text-text-secondary hover:text-primary-container transition-colors cursor-pointer font-semibold"
                >
                  + Ku dar Cunto (Add Item)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
