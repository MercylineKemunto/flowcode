import React from 'react';
import { Mail, AlertTriangle, CheckCircle } from 'lucide-react';

interface EmailNotificationStatusProps {
  todayProgress: number;
  dailyGoal: number;
  emailSent: boolean;
}

export default function EmailNotificationStatus({ todayProgress, dailyGoal, emailSent }: EmailNotificationStatusProps) {
  const isGoalMet = todayProgress >= dailyGoal;
  const hoursRemaining = Math.max(0, dailyGoal - todayProgress);
  
  // Simulate email notification logic
  const shouldSendEmail = !isGoalMet && new Date().getHours() >= 20; // After 8 PM
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Mail className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
      </div>
      
      <div className="space-y-4">
        {isGoalMet ? (
          <div className="flex items-center space-x-3 p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-300 font-medium">Goal completed! 🎉</p>
              <p className="text-green-400 text-sm">No reminder email needed today</p>
            </div>
          </div>
        ) : shouldSendEmail ? (
          <div className="flex items-center space-x-3 p-4 bg-orange-900/30 border border-orange-700 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-orange-300 font-medium">Reminder email would be sent!</p>
              <p className="text-orange-400 text-sm">
                You still need {hoursRemaining.toFixed(1)} hours to reach your daily goal
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <Mail className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-blue-300 font-medium">Monitoring your progress...</p>
              <p className="text-blue-400 text-sm">
                {hoursRemaining.toFixed(1)} hours remaining for today's goal
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">How it works:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Daily goal progress is monitored automatically</li>
            <li>• Reminder emails sent if goal isn't met by evening</li>
            <li>• Customize notification times in settings</li>
            <li>• Streak-breaking alerts for motivation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}