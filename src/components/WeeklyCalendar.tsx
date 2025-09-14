import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface DailyGoal {
  date: string;
  completed: boolean;
  actual_hours: number;
  goal_hours: number;
}

interface WeeklyCalendarProps {
  goals: DailyGoal[];
  weekStart?: Date;
}

export default function WeeklyCalendar({ goals, weekStart = new Date() }: WeeklyCalendarProps) {
  const weekStartDate = startOfWeek(weekStart, { weekStartsOn: 1 }); // Monday start
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
  
  const getGoalForDate = (date: Date) => {
    return goals.find(goal => 
      format(new Date(goal.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">This Week</h3>
      
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, index) => {
          const goal = getGoalForDate(day);
          const isCompleted = goal?.completed || false;
          const hasProgress = (goal?.actual_hours || 0) > 0;
          const todayClass = isToday(day) ? 'ring-2 ring-blue-500' : '';
          
          return (
            <div key={index} className={`text-center ${todayClass} rounded-lg`}>
              <div className="text-xs text-gray-400 mb-2 font-medium">
                {format(day, 'EEE')}
              </div>
              <div className="text-sm text-gray-300 mb-2">
                {format(day, 'dd')}
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : hasProgress
                      ? 'bg-yellow-500 border-yellow-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : hasProgress ? '•' : '○'}
                </div>
                
                {goal && (
                  <div className="text-xs text-gray-500">
                    {goal.actual_hours.toFixed(1)}h
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400">Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-400">In Progress</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <span className="text-gray-400">Not Started</span>
        </div>
      </div>
    </div>
  );
}