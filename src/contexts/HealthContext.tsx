import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HealthMetric {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  questions: {
    id: string;
    question: string;
    type: 'scale' | 'boolean' | 'text';
    scale?: { min: number; max: number; labels: string[] };
  }[];
}

export interface DailyEntry {
  date: string;
  responses: Record<string, any>;
  completed: boolean;
}

interface HealthContextType {
  metrics: HealthMetric[];
  dailyEntries: DailyEntry[];
  hasCompletedToday: boolean;
  submitDailyEntry: (responses: Record<string, any>) => void;
  getDailyEntry: (date: string) => DailyEntry | undefined;
}

const healthMetrics: HealthMetric[] = [
  {
    id: 'mood',
    name: 'Mood & Mental Health',
    icon: '🧠',
    color: 'medical-blue',
    description: 'Track your emotional wellbeing and mental state',
    questions: [
      {
        id: 'mood_rating',
        question: 'How would you rate your overall mood today?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] }
      },
      {
        id: 'stress_level',
        question: 'How stressed do you feel today?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['No Stress', 'Low', 'Moderate', 'High', 'Very High'] }
      },
      {
        id: 'anxiety',
        question: 'Did you experience anxiety today?',
        type: 'boolean'
      }
    ]
  },
  {
    id: 'sleep',
    name: 'Sleep Quality',
    icon: '😴',
    color: 'calm-purple',
    description: 'Monitor your sleep patterns and quality',
    questions: [
      {
        id: 'sleep_hours',
        question: 'How many hours did you sleep last night?',
        type: 'scale',
        scale: { min: 0, max: 12, labels: ['0-2h', '3-4h', '5-6h', '7-8h', '9+h'] }
      },
      {
        id: 'sleep_quality',
        question: 'How would you rate your sleep quality?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] }
      },
      {
        id: 'refreshed',
        question: 'Do you feel refreshed after sleeping?',
        type: 'boolean'
      }
    ]
  },
  {
    id: 'exercise',
    name: 'Physical Activity',
    icon: '💪',
    color: 'energy-orange',
    description: 'Track your exercise and physical activity levels',
    questions: [
      {
        id: 'exercise_duration',
        question: 'How many minutes of exercise did you do today?',
        type: 'scale',
        scale: { min: 0, max: 120, labels: ['None', '1-15m', '16-30m', '31-60m', '60+m'] }
      },
      {
        id: 'exercise_intensity',
        question: 'How intense was your physical activity?',
        type: 'scale',
        scale: { min: 1, max: 5, labels: ['Light', 'Light-Moderate', 'Moderate', 'Vigorous', 'Very Vigorous'] }
      },
      {
        id: 'energy_level',
        question: 'How is your energy level today?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['Very Low', 'Low', 'Fair', 'High', 'Very High'] }
      }
    ]
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Diet',
    icon: '🥗',
    color: 'wellness-green',
    description: 'Monitor your eating habits and nutrition',
    questions: [
      {
        id: 'meals_count',
        question: 'How many balanced meals did you have today?',
        type: 'scale',
        scale: { min: 0, max: 5, labels: ['None', '1 meal', '2 meals', '3 meals', '4+ meals'] }
      },
      {
        id: 'water_intake',
        question: 'How much water did you drink today?',
        type: 'scale',
        scale: { min: 1, max: 8, labels: ['<2 cups', '2-4 cups', '4-6 cups', '6-8 cups', '8+ cups'] }
      },
      {
        id: 'healthy_choices',
        question: 'Did you make healthy food choices today?',
        type: 'boolean'
      }
    ]
  },
  {
    id: 'social',
    name: 'Social Connection',
    icon: '👥',
    color: 'focus-indigo',
    description: 'Track your social interactions and relationships',
    questions: [
      {
        id: 'social_interaction',
        question: 'How much meaningful social interaction did you have today?',
        type: 'scale',
        scale: { min: 1, max: 10, labels: ['None', 'Very Little', 'Some', 'Good Amount', 'Plenty'] }
      },
      {
        id: 'support_system',
        question: 'Do you feel supported by friends/family?',
        type: 'boolean'
      },
      {
        id: 'loneliness',
        question: 'Did you feel lonely today?',
        type: 'boolean'
      }
    ]
  }
];

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    // Load existing data from localStorage
    const storedData = localStorage.getItem('pridally_daily_data');
    if (storedData) {
      setDailyEntries(JSON.parse(storedData));
    }
  }, []);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const hasCompletedToday = dailyEntries.some(
    entry => entry.date === getTodayString() && entry.completed
  );

  const submitDailyEntry = (responses: Record<string, any>) => {
    const today = getTodayString();
    const newEntry: DailyEntry = {
      date: today,
      responses,
      completed: true,
    };

    const updatedEntries = dailyEntries.filter(entry => entry.date !== today);
    updatedEntries.push(newEntry);
    
    setDailyEntries(updatedEntries);
    localStorage.setItem('pridally_daily_data', JSON.stringify(updatedEntries));
  };

  const getDailyEntry = (date: string): DailyEntry | undefined => {
    return dailyEntries.find(entry => entry.date === date);
  };

  const value = {
    metrics: healthMetrics,
    dailyEntries,
    hasCompletedToday,
    submitDailyEntry,
    getDailyEntry,
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};