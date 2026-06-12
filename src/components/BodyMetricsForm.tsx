import React, { useState } from 'react';
import { UserMetrics } from '../types';
import { UserPlus, Dumbbell } from 'lucide-react';

interface BodyMetricsFormProps {
  initialMetrics: UserMetrics;
  onCalculate: (metrics: UserMetrics) => void;
  bmi: number;
  bmiStatus: string;
}

export default function BodyMetricsForm({
  initialMetrics,
  onCalculate,
  bmi,
  bmiStatus,
}: BodyMetricsFormProps) {
  const [name, setName] = useState(initialMetrics.name);
  const [age, setAge] = useState(initialMetrics.age);
  const [gender, setGender] = useState<"Rag" | "Dumar">(initialMetrics.gender);
  const [weight, setWeight] = useState(initialMetrics.weight);
  const [height, setHeight] = useState(initialMetrics.height);
  const [activity, setActivity] = useState<UserMetrics['activity']>(initialMetrics.activity);
  const [goal, setGoal] = useState<UserMetrics['goal']>(initialMetrics.goal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({
      name: name || "Maxamed",
      age: Number(age) || 25,
      gender,
      weight: Number(weight) || 85,
      height: Number(height) || 175,
      activity,
      goal,
    });
  };

  const getBmiColor = (status: string) => {
    if (status.includes("Caadi")) return "text-success-green";
    if (status.includes("Miisaan Fudud")) return "text-blue-400";
    if (status.includes("Cayni") || status.includes("Ebyan")) return "text-red-400";
    return "text-amber-400";
  };

  return (
    <div className="space-y-6">
      {/* Metrics Card */}
      <section className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Dumbbell className="text-primary-container h-6 w-6" />
          <h2 className="text-xl font-bold text-text-primary">Xogta Jidhkaaga</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Magacaaga
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-input border border-border-subtle rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:border-primary-container transition-all"
              placeholder="Tusaale: Maxamed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Da'da
              </label>
              <input
                type="number"
                value={age || ''}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-surface-input border border-border-subtle rounded-lg px-4 py-2 text-on-background focus:outline-none focus:border-primary-container"
                placeholder="25"
                min="1"
                max="120"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Jinsiga
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "Rag" | "Dumar")}
                className="w-full bg-surface-input border border-border-subtle rounded-lg px-3 py-2 text-on-background focus:outline-none focus:border-primary-container"
              >
                <option value="Rag">Rag (Male)</option>
                <option value="Dumar">Dumar (Female)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Miisaanka (KG)
              </label>
              <input
                type="number"
                value={weight || ''}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-surface-input border border-border-subtle rounded-lg px-4 py-2 text-on-background focus:outline-none focus:border-primary-container"
                placeholder="85"
                min="1"
                max="300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Dhererka (CM)
              </label>
              <input
                type="number"
                value={height || ''}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-surface-input border border-border-subtle rounded-lg px-4 py-2 text-on-background focus:outline-none focus:border-primary-container"
                placeholder="175"
                min="50"
                max="250"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Hab-nololeedka (Activity)
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as UserMetrics['activity'])}
              className="w-full bg-surface-input border border-border-subtle rounded-lg px-3 py-2 text-on-background focus:outline-none focus:border-primary-container"
            >
              <option value="Jimicsi Fudud">Jimicsi Fudud (Lightly Active)</option>
              <option value="Jimicsi Dhexdhexaad">Jimicsi Dhexdhexaad (Moderate)</option>
              <option value="Jimicsi Culus">Jimicsi Culus (Very Active)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Yoolkaaga (Goals)
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as UserMetrics['goal'])}
              className="w-full bg-surface-input border border-border-subtle rounded-lg px-3 py-2 text-on-background focus:outline-none focus:border-primary-container"
            >
              <option value="Baruur Dhimis">Baruur Dhimis (Fat Loss)</option>
              <option value="Muruq Dhisid">Muruq Dhisid (Muscle Gain)</option>
              <option value="Miisaan Ilaalin">Miisaan Ilaalin (Maintenance)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-container hover:bg-amber-400 active:scale-95 text-on-primary font-bold py-3 rounded-lg transition-all duration-150 shadow-sm uppercase text-sm tracking-wider cursor-pointer"
          >
            XISAABI QORSHAHAAGA
          </button>
        </form>
      </section>

      {/* BMI Status Card */}
      <div className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-lg">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">BMI STATUS</p>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold ${getBmiColor(bmiStatus)} transition-colors duration-150`}>
              {bmiStatus}
            </h3>
            <p className="text-sm text-on-surface-variant font-medium">{bmi.toFixed(1)} BMI</p>
          </div>
          <div className="p-3 bg-surface-input rounded-lg border border-border-subtle">
            <svg
              className={`h-8 w-8 ${getBmiColor(bmiStatus)}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
