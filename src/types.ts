/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserMetrics {
  name: string;
  age: number;
  gender: "Rag" | "Dumar";
  weight: number; // in KG
  height: number; // in CM
  activity: "Jimicsi Fudud" | "Jimicsi Culus" | "Jimicsi Dhexdhexaad";
  goal: "Baruur Dhimis" | "Muruq Dhisid" | "Miisaan Ilaalin";
}

export interface MacroBreakdown {
  calories: number;
  water: number; // liters
  workoutTime: number; // minutes
  protein: number; // g
  carbs: number; // g
  fats: number; // g
}

export interface Habit {
  id: string;
  text: string;
  done: boolean;
}

export interface MealItem {
  name: string;
  amount: string;
}

export interface MealPlan {
  id: "qurac" | "qado" | "casho";
  title: string;
  icon: string;
  calories: number;
  items: MealItem[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
