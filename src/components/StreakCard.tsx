import React from 'react';
import { Flame, Target, Clock } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  todayProgress: number;
  dailyGoal: number;
}

export default function StreakCard({ currentStreak, longestStreak, todayProgress, dailyGoal }: StreakCardProps) {
  const progressPercentage = Math.min((todayProgress / dailyGoal) * 100, 100);
  const isGoalMet = todayProgress >= dailyGoal;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Streak */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Flame className={`w-8 h-8 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{currentStreak}</p>
          <p className="text-gray-400 text-sm">Current Streak</p>
        </div>

        {/* Longest Streak */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Target className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{longestStreak}</p>
          <p className="text-gray-400 text-sm">Longest Streak</p>
        </div>

        {/* Today's Progress */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Clock className={`w-8 h-8 ${isGoalMet ? 'text-green-500' : 'text-blue-500'}`} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {todayProgress.toFixed(1)}h
          </p>
          <p className="text-gray-400 text-sm">Today's Progress</p>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isGoalMet ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Goal: {dailyGoal}h ({progressPercentage.toFixed(0)}%)
          </p>
        </div>
      </div>
    </div>
  );
}