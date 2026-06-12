import React, { useState, useEffect } from 'react';
import { UserMetrics, MacroBreakdown, Habit, MealPlan, MealItem, ChatMessage } from './types';
import BodyMetricsForm from './components/BodyMetricsForm';
import BaahidaJidhkaaga from './components/BaahidaJidhkaaga';
import WeightChart from './components/WeightChart';
import HabitsTracker from './components/HabitsTracker';
import MealPlanPanel from './components/MealPlan';
import AICoach from './components/AICoach';

import { Dumbbell, LogOut, User, Sparkles, RefreshCw, Layers } from 'lucide-react';

const DEFAULT_METRICS: UserMetrics = {
  name: "Maxamed",
  age: 25,
  gender: "Rag",
  weight: 85,
  height: 175,
  activity: "Jimicsi Fudud",
  goal: "Baruur Dhimis",
};

const DEFAULT_HABITS: Habit[] = [
  { id: "h1", text: "Cabbay 3L oo biyo ah", done: true },
  { id: "h2", text: "Jimicsiga maanta", done: true },
  { id: "h3", text: "7 saacadood oo hurdo ah", done: false },
  { id: "h4", text: "Ma jiro sonkor lagu daray", done: false },
];

const DEFAULT_MEALS: MealPlan[] = [
  {
    id: "qurac",
    title: "Qurac (Breakfast)",
    icon: "🍳",
    calories: 450,
    items: [
      { name: "Boorash Oats", amount: "60g" },
      { name: "3 Ukun (Caddaan)", amount: "3 xabo" },
      { name: "1 Tufaax ah", amount: "1 xabo" },
    ],
  },
  {
    id: "qado",
    title: "Qado (Lunch)",
    icon: "🍗",
    calories: 720,
    items: [
      { name: "Digaag Duban", amount: "150g" },
      { name: "Bariis Bunni", amount: "150g" },
      { name: "Salad Khudaar", amount: "-" },
    ],
  },
  {
    id: "casho",
    title: "Casho (Dinner)",
    icon: "🐟",
    calories: 630,
    items: [
      { name: "Kalluun la dubay", amount: "150g" },
      { name: "Avokaado", amount: "0.5 xabo" },
      { name: "Khudaar Uumi leh", amount: "-" },
    ],
  },
];

export default function App() {
  // --- States ---
  const [metrics, setMetrics] = useState<UserMetrics>(() => {
    const saved = localStorage.getItem('kheyre_metrics');
    return saved ? JSON.parse(saved) : DEFAULT_METRICS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('kheyre_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [meals, setMeals] = useState<MealPlan[]>(() => {
    const saved = localStorage.getItem('kheyre_meals');
    return saved ? JSON.parse(saved) : DEFAULT_MEALS;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('kheyre_chat');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>(undefined);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // --- Calculations ---
  const calculateMacros = (m: UserMetrics): MacroBreakdown => {
    // BMR (Mifflin-St Jeor Equation)
    const bmr = m.gender === "Rag"
      ? (10 * m.weight) + (6.25 * m.height) - (5 * m.age) + 5
      : (10 * m.weight) + (6.25 * m.height) - (5 * m.age) - 161;

    // TDEE Activity multiplier
    let multiplier = 1.2;
    if (m.activity === "Jimicsi Dhexdhexaad") multiplier = 1.4;
    if (m.activity === "Jimicsi Culus") multiplier = 1.6;
    const tdee = bmr * multiplier;

    // Goal modifiers
    let calories = Math.round(tdee);
    if (m.goal === "Baruur Dhimis") {
      calories = Math.round(tdee - 500);
    } else if (m.goal === "Muruq Dhisid") {
      calories = Math.round(tdee + 300);
    }
    if (calories < 1200) calories = 1200; // safety ceiling

    // Standard Macro Split (30% Protein, 45% Carbs, 25% Fats)
    const protein = Math.round((calories * 0.30) / 4);
    const carbs = Math.round((calories * 0.45) / 4);
    const fats = Math.round((calories * 0.25) / 9);

    // Water recommendations
    const water = (m.weight * 0.035) + (m.gender === "Rag" ? 0.6 : 0.3);

    // Workout time recommendation
    let workoutTime = 30;
    if (m.activity === "Jimicsi Dhexdhexaad") workoutTime = 45;
    if (m.activity === "Jimicsi Culus") workoutTime = 60;

    return { calories, water, workoutTime, protein, carbs, fats };
  };

  const macros = calculateMacros(metrics);

  const heightInMeters = metrics.height / 100;
  const bmi = metrics.weight / (heightInMeters * heightInMeters);
  
  let bmiStatus = "Heer Caadi ah";
  if (bmi < 18.5) bmiStatus = "Miisaan yar (Underweight)";
  else if (bmi >= 18.5 && bmi < 25) bmiStatus = "Heer Caadi ah (Normal)";
  else if (bmi >= 25 && bmi < 30) bmiStatus = "Yara Buuxa (Overweight)";
  else bmiStatus = "Cayni aad ah (Obese)";

  // --- Effects for Storage persistence ---
  useEffect(() => {
    localStorage.setItem('kheyre_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('kheyre_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('kheyre_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('kheyre_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  // --- Action Handlers ---
  const handleCalculate = (newMetrics: UserMetrics) => {
    setMetrics(newMetrics);
    
    // Scale meal calories based on goals automatically!
    const mealCals = calculateMacros(newMetrics).calories;
    const quracShare = Math.round(mealCals * 0.25);
    const qadoShare = Math.round(mealCals * 0.45);
    const cashoShare = Math.round(mealCals * 0.30);

    setMeals(prev => prev.map(m => {
      if (m.id === "qurac") return { ...m, calories: quracShare };
      if (m.id === "qado") return { ...m, calories: qadoShare };
      return { ...m, calories: cashoShare };
    }));

    triggerNotification("Qorshahaaga caafimaad waa la xisaabiyay!");
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const handleAddHabit = (text: string) => {
    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      text,
      done: false,
    };
    setHabits(prev => [...prev, newHabit]);
    triggerNotification("Hab cusub ayaa lagu daray!");
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleAddFoodItem = (mealId: "qurac" | "qado" | "casho", item: MealItem) => {
    setMeals(prev => prev.map(m => m.id === mealId ? { ...m, items: [...m.items, item] } : m));
    triggerNotification("Cunto cusub ayaa lagu daray!");
  };

  const handleRemoveFoodItem = (mealId: "qurac" | "qado" | "casho", index: number) => {
    setMeals(prev => prev.map(m => m.id === mealId ? {
      ...m,
      items: m.items.filter((_, i) => i !== index)
    } : m));
  };

  const handleUpdateCalories = (mealId: "qurac" | "qado" | "casho", calories: number) => {
    setMeals(prev => prev.map(m => m.id === mealId ? { ...m, calories } : m));
  };

  // --- Gemini API handler ---
  const handleSendMessage = async (messageText: string) => {
    const userMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsSending(true);
    setApiError(undefined);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send history as context (slice to keep lightweight)
        body: JSON.stringify({
          message: messageText,
          history: chatHistory.slice(-5)
        }),
      });

      if (!response.ok) {
        throw new Error("Waan ku guuldareysanay inaan AI la xiriirno.");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `m_${Date.now() + 1}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatHistory(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setApiError(err?.message || "Khalad aan la aqoon ayaa dhacay. Fadlan hubi in GEMINI_API_KEY uu yaalo secrets.");
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    triggerNotification("Wadahadalka waa la tirtiray!");
  };

  // --- Custom Navigation Scroll Trigger ---
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background-dark text-on-background min-h-screen pb-24 md:pb-12 text-sm">
      
      {/* Toast Notifications */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-[100] bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 animate-fade-in border border-amber-400">
          <Sparkles className="h-4 w-4" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Top Navigation Bar Header */}
      <header className="fixed top-0 w-full z-50 bg-background-dark/80 backdrop-blur-xl border-b border-border-subtle shadow-sm">
        <div className="flex justify-between items-center h-16 px-4 md:px-8 w-full max-w-7xl mx-auto">
          {/* Logo block */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-1.5 bg-primary-container/10 rounded-lg border border-primary-container/20">
              <Dumbbell className="text-primary-container h-6 w-6" />
            </div>
            <span className="font-sans text-xl font-extrabold text-primary-container uppercase tracking-tight">
              KHEYRE FIT
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-primary-container font-extrabold border-b-2 border-primary-container pb-1 text-xs uppercase tracking-wider cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('meal-plan')}
              className="text-text-secondary font-semibold hover:text-primary-container transition-colors duration-200 text-xs uppercase tracking-wider cursor-pointer"
            >
              Meals
            </button>
            <button
              onClick={() => scrollToSection('coach-ai')}
              className="text-text-secondary font-semibold hover:text-primary-container transition-colors duration-200 text-xs uppercase tracking-wider cursor-pointer"
            >
              Coach
            </button>
            <button
              onClick={() => scrollToSection('habits-box')}
              className="text-text-secondary font-semibold hover:text-primary-container transition-colors duration-200 text-xs uppercase tracking-wider cursor-pointer"
            >
              Habits
            </button>
          </nav>

          {/* Actions panel */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-success-green/10 border border-success-green/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
              <span className="text-[10px] font-bold text-success-green uppercase tracking-wider font-mono">
                Live Optimizer
              </span>
            </div>
            
            <div className="flex gap-2.5">
              <button 
                onClick={() => handleCalculate(DEFAULT_METRICS)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-primary-container hover:bg-surface-card transition-all cursor-pointer"
                title="Dib u daji xogta"
              >
                <RefreshCw className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={() => triggerNotification(`Ku soo dhowaad, maxamed!`)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-primary-container hover:bg-surface-card transition-all cursor-pointer"
              >
                <User className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={() => triggerNotification("Waa lagu bixi doonaa goor dhow!")}
                className="p-1.5 rounded-lg text-text-secondary hover:text-error-red hover:bg-surface-card transition-all cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Dashboard Content */}
      <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Top welcome banner */}
        <section className="bg-surface-card rounded-xl border border-border-subtle p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-container/[0.03] to-transparent pointer-events-none"></div>
          <div>
            <span className="text-[10px] bg-primary-container/10 border border-primary-container/20 text-primary-container px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
              Macalinkaaga Caafimaadka
            </span>
            <h1 className="text-xl md:text-2xl font-black text-text-primary">
              Ku soo dhowow Kheyre Fit, {metrics.name}!
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Qorsheynta miisaankaaga iyo cuntada Soomaalida si sahlan oo caqliyeed ku kooban.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollToSection('coach-ai')}
              className="bg-primary-container hover:bg-amber-400 text-on-primary font-bold px-4 py-2.5 rounded-lg transition-all duration-150 text-xs shadow-md shadow-primary-container/10 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              Waydii Macalinka AI
            </button>
          </div>
        </section>

        {/* 3-Column main Grid segment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Body metrics inputs & BMI (Span 3) */}
          <aside className="lg:col-span-3 space-y-6">
            <BodyMetricsForm 
              initialMetrics={metrics} 
              onCalculate={handleCalculate}
              bmi={bmi}
              bmiStatus={bmiStatus}
            />
          </aside>

          {/* Column 2: Core output cards & Weight progress (Span 6) */}
          <section className="lg:col-span-6 space-y-6">
            <BaahidaJidhkaaga macros={macros} />
            <WeightChart currentWeight={metrics.weight} goal={metrics.goal} />
          </section>

          {/* Column 3: Habits completions & Calendar index (Span 3) */}
          <aside id="habits-box" className="lg:col-span-3 h-full">
            <HabitsTracker 
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          </aside>

        </div>

        {/* Column 4: Bottom full width panels with section anchoring */}
        <div id="meal-plan" className="pt-2">
          <MealPlanPanel 
            meals={meals}
            onAddFoodItem={handleAddFoodItem}
            onRemoveFoodItem={handleRemoveFoodItem}
            onUpdateCalories={handleUpdateCalories}
          />
        </div>

        <div id="coach-ai" className="pt-2">
          <AICoach 
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            errorMessage={apiError}
            onClearChat={handleClearChat}
          />
        </div>

      </main>

      {/* Bottom Nav bar for viewports where mobile holds focus */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 bg-background-dark/95 backdrop-blur-lg border-t border-border-subtle shadow-xl z-50 rounded-t-xl pb-safe">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center text-primary-container p-2 active:scale-95 transition-all cursor-pointer"
        >
          <Dumbbell className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => scrollToSection('meal-plan')}
          className="flex flex-col items-center justify-center text-text-secondary hover:text-primary-container p-2 active:scale-95 transition-all cursor-pointer"
        >
          <Layers className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1 font-sans">Meals</span>
        </button>

        <button
          onClick={() => scrollToSection('coach-ai')}
          className="flex flex-col items-center justify-center text-text-secondary hover:text-primary-container p-2 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Coach</span>
        </button>

        <button
          onClick={() => scrollToSection('habits-box')}
          className="flex flex-col items-center justify-center text-text-secondary hover:text-primary-container p-2 active:scale-95 transition-all cursor-pointer"
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </nav>

    </div>
  );
}
