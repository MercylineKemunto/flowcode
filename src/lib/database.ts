interface User {
  id: string;
  name: string;
  email: string;
  daily_goal_hours: number;
  weekly_goal_days: number;
  current_streak: number;
  longest_streak: number;
  total_coding_hours: number;
  created_at: string;
  updated_at: string;
}

interface CodingSession {
  id: string;
  user_id: string;
  date: string;
  hours: number;
  description?: string;
  created_at: string;
}

interface DailyGoal {
  id: string;
  user_id: string;
  date: string;
  goal_hours: number;
  actual_hours: number;
  completed: boolean;
  email_sent: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

class DatabaseManager {
  private storagePrefix = 'flowcode-';

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize default user if not exists
    if (!this.getUser('user-1')) {
      this.createDefaultUser();
    }
    
    // Initialize achievements if not exists
    if (!this.getStorageItem('achievements')) {
      this.createDefaultAchievements();
    }
  }

  private getStorageItem(key: string): any {
    const item = localStorage.getItem(this.storagePrefix + key);
    return item ? JSON.parse(item) : null;
  }

  private setStorageItem(key: string, value: any): void {
    localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
  }

  private createDefaultUser() {
    const user: User = {
      id: 'user-1',
      name: 'Developer',
      email: 'developer@example.com',
      daily_goal_hours: 4.0,
      weekly_goal_days: 7,
      current_streak: 0,
      longest_streak: 0,
      total_coding_hours: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.setStorageItem('user-user-1', user);
  }

  private createDefaultAchievements() {
    const achievements: Achievement[] = [
      { id: 'streak-7', name: 'Week Warrior', description: 'Code for 7 days straight', icon: '🔥', requirement: 7, type: 'streak' },
      { id: 'streak-30', name: 'Monthly Master', description: 'Code for 30 days straight', icon: '🏆', requirement: 30, type: 'streak' },
      { id: 'streak-100', name: 'Century Club', description: 'Code for 100 days straight', icon: '💯', requirement: 100, type: 'streak' },
      { id: 'hours-100', name: 'Centennial Coder', description: 'Code for 100 total hours', icon: '⏱️', requirement: 100, type: 'hours' },
      { id: 'hours-500', name: 'Coding Champion', description: 'Code for 500 total hours', icon: '🥇', requirement: 500, type: 'hours' },
      { id: 'days-50', name: 'Dedication Master', description: 'Complete 50 coding days', icon: '🎯', requirement: 50, type: 'days' },
    ];
    this.setStorageItem('achievements', achievements);
  }

  // User methods
  getUser(id: string): User | null {
    return this.getStorageItem(`user-${id}`);
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.getUser(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.setStorageItem(`user-${id}`, updatedUser);
    return updatedUser;
  }

  // Coding sessions methods
  addCodingSession(userId: string, date: string, hours: number, description?: string): string {
    const id = `session-${Date.now()}`;
    const session: CodingSession = {
      id,
      user_id: userId,
      date,
      hours,
      description,
      created_at: new Date().toISOString()
    };

    // Get existing sessions
    const sessions = this.getStorageItem('sessions') || [];
    sessions.push(session);
    this.setStorageItem('sessions', sessions);

    this.updateDailyGoal(userId, date, hours);
    this.updateUserStats(userId);
    
    return id;
  }

  getCodingSessions(userId: string, limit = 10): CodingSession[] {
    const sessions = this.getStorageItem('sessions') || [];
    return sessions
      .filter((session: CodingSession) => session.user_id === userId)
      .sort((a: CodingSession, b: CodingSession) => {
        if (b.date !== a.date) {
          return b.date.localeCompare(a.date);
        }
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, limit);
  }

  getSessionsByDateRange(userId: string, startDate: string, endDate: string): CodingSession[] {
    const sessions = this.getStorageItem('sessions') || [];
    return sessions
      .filter((session: CodingSession) => 
        session.user_id === userId && 
        session.date >= startDate && 
        session.date <= endDate
      )
      .sort((a: CodingSession, b: CodingSession) => a.date.localeCompare(b.date));
  }

  // Daily goals methods
  updateDailyGoal(userId: string, date: string, additionalHours: number): void {
    const user = this.getUser(userId);
    if (!user) return;

    const goals = this.getStorageItem('daily-goals') || [];
    const existingIndex = goals.findIndex((goal: DailyGoal) => 
      goal.user_id === userId && goal.date === date
    );

    if (existingIndex >= 0) {
      const existing = goals[existingIndex];
      const newActualHours = existing.actual_hours + additionalHours;
      const completed = newActualHours >= existing.goal_hours;
      
      goals[existingIndex] = {
        ...existing,
        actual_hours: newActualHours,
        completed
      };
    } else {
      const id = `goal-${Date.now()}`;
      const completed = additionalHours >= user.daily_goal_hours;
      
      goals.push({
        id,
        user_id: userId,
        date,
        goal_hours: user.daily_goal_hours,
        actual_hours: additionalHours,
        completed,
        email_sent: false
      });
    }

    this.setStorageItem('daily-goals', goals);
  }

  getDailyGoals(userId: string, startDate: string, endDate: string): DailyGoal[] {
    const goals = this.getStorageItem('daily-goals') || [];
    return goals
      .filter((goal: DailyGoal) => 
        goal.user_id === userId && 
        goal.date >= startDate && 
        goal.date <= endDate
      )
      .sort((a: DailyGoal, b: DailyGoal) => a.date.localeCompare(b.date));
  }

  // Update user statistics
  private updateUserStats(userId: string): void {
    const sessions = this.getStorageItem('sessions') || [];
    const userSessions = sessions.filter((session: CodingSession) => session.user_id === userId);
    
    // Update total coding hours
    const totalHours = userSessions.reduce((sum: number, session: CodingSession) => sum + session.hours, 0);

    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak(userId);
    
    // Get longest streak
    const longestStreak = this.calculateLongestStreak(userId);

    this.updateUser(userId, {
      total_coding_hours: totalHours,
      current_streak: currentStreak,
      longest_streak: longestStreak
    });

    this.checkAchievements(userId);
  }

  private calculateCurrentStreak(userId: string): number {
    const goals = this.getStorageItem('daily-goals') || [];
    const completedGoals = goals
      .filter((goal: DailyGoal) => goal.user_id === userId && goal.completed)
      .sort((a: DailyGoal, b: DailyGoal) => b.date.localeCompare(a.date));

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    for (const goal of completedGoals) {
      const goalDate = new Date(goal.date);
      if (goalDate.toDateString() === checkDate.toDateString()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateLongestStreak(userId: string): number {
    const goals = this.getStorageItem('daily-goals') || [];
    const userGoals = goals
      .filter((goal: DailyGoal) => goal.user_id === userId)
      .sort((a: DailyGoal, b: DailyGoal) => a.date.localeCompare(b.date));

    let currentStreak = 0;
    let longestStreak = 0;

    for (const goal of userGoals) {
      if (goal.completed) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return longestStreak;
  }

  // Achievements
  checkAchievements(userId: string): void {
    const user = this.getUser(userId);
    if (!user) return;

    const achievements = this.getStorageItem('achievements') || [];
    const userAchievements = this.getStorageItem('user-achievements') || [];
    
    achievements.forEach((achievement: Achievement) => {
      const hasAchievement = userAchievements.some((ua: UserAchievement) => 
        ua.user_id === userId && ua.achievement_id === achievement.id
      );

      if (!hasAchievement) {
        let earned = false;
        
        switch (achievement.type) {
          case 'streak':
            earned = user.current_streak >= achievement.requirement;
            break;
          case 'hours':
            earned = user.total_coding_hours >= achievement.requirement;
            break;
          case 'days':
            const goals = this.getStorageItem('daily-goals') || [];
            const completedDays = goals.filter((goal: DailyGoal) => 
              goal.user_id === userId && goal.completed
            ).length;
            earned = completedDays >= achievement.requirement;
            break;
        }

        if (earned) {
          this.unlockAchievement(userId, achievement.id);
        }
      }
    });
  }

  unlockAchievement(userId: string, achievementId: string): void {
    const userAchievements = this.getStorageItem('user-achievements') || [];
    const id = `user-achievement-${Date.now()}`;
    
    userAchievements.push({
      id,
      user_id: userId,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString()
    });
    
    this.setStorageItem('user-achievements', userAchievements);
  }

  getUserAchievements(userId: string): any[] {
    const achievements = this.getStorageItem('achievements') || [];
    const userAchievements = this.getStorageItem('user-achievements') || [];
    
    return userAchievements
      .filter((ua: UserAchievement) => ua.user_id === userId)
      .map((ua: UserAchievement) => {
        const achievement = achievements.find((a: Achievement) => a.id === ua.achievement_id);
        return {
          ...achievement,
          unlocked_at: ua.unlocked_at
        };
      })
      .sort((a: any, b: any) => b.unlocked_at.localeCompare(a.unlocked_at));
  }

  getAllAchievements(): Achievement[] {
    return this.getStorageItem('achievements') || [];
  }

  close(): void {
    // No-op for localStorage implementation
  }
}

export const db = new DatabaseManager();