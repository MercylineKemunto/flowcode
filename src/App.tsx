import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { db } from './lib/database';
import Header from './components/Header';
import StreakCard from './components/StreakCard';
import CodingSessionForm from './components/CodingSessionForm';
import RecentSessions from './components/RecentSessions';
import WeeklyCalendar from './components/WeeklyCalendar';
import EmailNotificationStatus from './components/EmailNotificationStatus';
import AchievementsView from './components/AchievementsView';
import SettingsView from './components/SettingsView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [allAchievements, setAllAchievements] = useState<any[]>([]);

  const userId = 'user-1';

  useEffect(() => {
    loadUserData();
    loadSessions();
    loadDailyGoals();
    loadAchievements();
  }, []);

  const loadUserData = () => {
    const userData = db.getUser(userId);
    setUser(userData);
  };

  const loadSessions = () => {
    const sessionsData = db.getCodingSessions(userId, 10);
    setSessions(sessionsData);
  };

  const loadDailyGoals = () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const goalsData = db.getDailyGoals(userId, startDate, endDate);
    setDailyGoals(goalsData);
  };

  const loadAchievements = () => {
    const userAchievements = db.getUserAchievements(userId);
    const allAchievementsData = db.getAllAchievements();
    setAchievements(userAchievements);
    setAllAchievements(allAchievementsData);
  };

  const handleAddSession = (hours: number, description: string) => {
    const today = new Date().toISOString().split('T')[0];
    db.addCodingSession(userId, today, hours, description);
    
    // Refresh all data
    loadUserData();
    loadSessions();
    loadDailyGoals();
    loadAchievements();
  };

  const handleUpdateSettings = (updates: any) => {
    db.updateUser(userId, updates);
    loadUserData();
  };

  // Get today's progress
  const today = new Date().toISOString().split('T')[0];
  const todayGoal = dailyGoals.find(goal => goal.date === today);
  const todayProgress = todayGoal?.actual_hours || 0;
  const dailyGoal = user?.daily_goal_hours || 4;

  const renderView = () => {
    switch (currentView) {
      case 'achievements':
        return (
          <AchievementsView
            userAchievements={achievements}
            allAchievements={allAchievements}
            userStats={user}
          />
        );
      case 'settings':
        return (
          <SettingsView
            user={user}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-3">
                <StreakCard
                  currentStreak={user?.current_streak || 0}
                  longestStreak={user?.longest_streak || 0}
                  todayProgress={todayProgress}
                  dailyGoal={dailyGoal}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <CodingSessionForm onAddSession={handleAddSession} />
              
              <WeeklyCalendar goals={dailyGoals} />
              
              <EmailNotificationStatus
                todayProgress={todayProgress}
                dailyGoal={dailyGoal}
                emailSent={todayGoal?.email_sent || false}
              />
              
              <div className="xl:col-span-2">
                <RecentSessions sessions={sessions} />
              </div>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
      />
      
      {renderView()}
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#ffffff',
            border: '1px solid #4B5563',
          },
        }}
      />
    </div>
  );
}

export default App;