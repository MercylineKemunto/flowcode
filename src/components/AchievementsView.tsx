import React from 'react';
import { Trophy, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: string;
  unlocked_at?: string;
}

interface AchievementsViewProps {
  userAchievements: Achievement[];
  allAchievements: Achievement[];
  userStats: any;
}

export default function AchievementsView({ userAchievements, allAchievements, userStats }: AchievementsViewProps) {
  const unlockedIds = userAchievements.map(a => a.id);
  
  const getProgressForAchievement = (achievement: Achievement) => {
    switch (achievement.type) {
      case 'streak':
        return Math.min(userStats.current_streak, achievement.requirement);
      case 'hours':
        return Math.min(userStats.total_coding_hours, achievement.requirement);
      case 'days':
        return Math.min(userStats.completedDays || 0, achievement.requirement);
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-white">Achievements</h2>
        </div>
        <p className="text-gray-400">
          You've unlocked {userAchievements.length} out of {allAchievements.length} achievements!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const progress = getProgressForAchievement(achievement);
          const progressPercentage = Math.min((progress / achievement.requirement) * 100, 100);
          
          return (
            <div
              key={achievement.id}
              className={`rounded-xl p-6 border-2 transition-all duration-300 ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="mb-4">
                  {isUnlocked ? (
                    <div className="text-6xl mb-2">{achievement.icon}</div>
                  ) : (
                    <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      <Lock className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <h3 className={`font-bold text-lg mb-2 ${
                  isUnlocked ? 'text-yellow-300' : 'text-gray-300'
                }`}>
                  {achievement.name}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  isUnlocked ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                
                {isUnlocked ? (
                  <div className="bg-yellow-500/20 rounded-lg p-3">
                    <p className="text-yellow-300 font-semibold">Unlocked!</p>
                    {achievement.unlocked_at && (
                      <p className="text-yellow-400 text-xs mt-1">
                        {new Date(achievement.unlocked_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs">
                      {progress} / {achievement.requirement}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}