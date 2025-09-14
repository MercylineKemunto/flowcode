export interface User {
  id: string;
  name: string;
  email: string;
  dailyGoalHours: number;
  weeklyGoalDays: number;
  currentStreak: number;
  longestStreak: number;
  totalCodingHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface CodingSession {
  id: string;
  userId: string;
  date: string;
  hours: number;
  description?: string;
  createdAt: string;
}

export interface DailyGoal {
  id: string;
  userId: string;
  date: string;
  goalHours: number;
  actualHours: number;
  completed: boolean;
  emailSent: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'hours' | 'days';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}