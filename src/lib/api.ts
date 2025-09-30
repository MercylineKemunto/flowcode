// API endpoints for VS Code extension integration

export interface VSCodeSyncData {
  userId: string;
  date: string;
  hours: number;
  description?: string;
  source: 'vscode';
}

export class FlowCodeAPI {
  private baseUrl: string;

  constructor(baseUrl: string = window.location.origin) {
    this.baseUrl = baseUrl;
  }

  // Endpoint for VS Code extension to sync coding time
  async syncCodingTime(data: VSCodeSyncData): Promise<{ success: boolean; message: string }> {
    try {
      // For now, we'll use localStorage since we don't have a backend API
      // In a real implementation, this would be a POST request to your backend
      
      const { db } = await import('./database');
      
      // Add the coding session
      const sessionId = db.addCodingSession(
        data.userId,
        data.date,
        data.hours,
        data.description || `VS Code session - ${data.hours.toFixed(2)} hours`
      );

      return {
        success: true,
        message: `Successfully synced ${data.hours.toFixed(2)} hours for ${data.date}`
      };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        message: `Failed to sync: ${error}`
      };
    }
  }

  // Get user's current stats for VS Code extension
  async getUserStats(userId: string): Promise<any> {
    try {
      const { db } = await import('./database');
      const user = db.getUser(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Get today's progress
      const today = new Date().toISOString().split('T')[0];
      const endDate = today;
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dailyGoals = db.getDailyGoals(userId, startDate, endDate);
      const todayGoal = dailyGoals.find(goal => goal.date === today);

      return {
        user,
        todayProgress: todayGoal?.actual_hours || 0,
        dailyGoal: user.daily_goal_hours,
        currentStreak: user.current_streak,
        totalHours: user.total_coding_hours
      };
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }
}

// Global API instance
export const flowCodeAPI = new FlowCodeAPI();

// Expose API for VS Code extension (when running in browser)
if (typeof window !== 'undefined') {
  (window as any).FlowCodeAPI = flowCodeAPI;
}