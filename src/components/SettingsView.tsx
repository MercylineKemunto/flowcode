import React, { useState } from 'react';
import { Save, Settings as SettingsIcon, Mail, Target, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsViewProps {
  user: any;
  onUpdateSettings: (updates: any) => void;
}

export default function SettingsView({ user, onUpdateSettings }: SettingsViewProps) {
  const [dailyGoalHours, setDailyGoalHours] = useState(user?.daily_goal_hours || 4);
  const [weeklyGoalDays, setWeeklyGoalDays] = useState(user?.weekly_goal_days || 7);
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    onUpdateSettings({
      dailyGoalHours,
      weeklyGoalDays,
      email,
      name
    });
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <SettingsIcon className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Settings</h2>
        </div>
        <p className="text-gray-400">
          Customize your coding goals and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Goal Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-white">Coding Goals</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-300 mb-2">
                Daily Coding Goal (Hours)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="dailyGoal"
                  min="0.5"
                  max="12"
                  step="0.5"
                  value={dailyGoalHours}
                  onChange={(e) => setDailyGoalHours(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-white font-bold min-w-[3rem] text-right">
                  {dailyGoalHours}h
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Recommended: 2-6 hours per day for sustainable progress
              </p>
            </div>
            
            <div>
              <label htmlFor="weeklyGoal" className="block text-sm font-medium text-gray-300 mb-2">
                Weekly Coding Days
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="weeklyGoal"
                  min="1"
                  max="7"
                  step="1"
                  value={weeklyGoalDays}
                  onChange={(e) => setWeeklyGoalDays(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-white font-bold min-w-[3rem] text-right">
                  {weeklyGoalDays} days
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                How many days per week do you want to code?
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Mail className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Daily Reminders</p>
                <p className="text-gray-400 text-sm">Get reminded if you haven't coded today</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Streak Alerts</p>
                <p className="text-gray-400 text-sm">Warning before losing your streak</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Achievement Notifications</p>
                <p className="text-gray-400 text-sm">Celebrate when you unlock achievements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-semibold text-white">Your Stats</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-white">{user?.total_coding_hours?.toFixed(1) || '0'}</p>
              <p className="text-gray-400 text-sm">Total Hours</p>
            </div>
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-white">{user?.current_streak || 0}</p>
              <p className="text-gray-400 text-sm">Current Streak</p>
            </div>
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-white">{user?.longest_streak || 0}</p>
              <p className="text-gray-400 text-sm">Longest Streak</p>
            </div>
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-white">
                {Math.ceil((user?.total_coding_hours || 0) / (user?.daily_goal_hours || 4))}
              </p>
              <p className="text-gray-400 text-sm">Days Coded</p>
            </div>
          </div>
        </div>

        {/* Payment Integration */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">$</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Premium Features</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Unlock Premium FlowCode</h4>
              <ul className="text-gray-300 text-sm space-y-1 mb-4">
                <li>• Advanced analytics and insights</li>
                <li>• Custom streak goals and challenges</li>
                <li>• Export your coding data</li>
                <li>• Priority email notifications</li>
                <li>• Dark/light theme options</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://flutterwave.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium text-center transition-colors"
                >
                  Set up Flutterwave Account
                </a>
                <button
                  disabled
                  className="flex-1 px-4 py-3 bg-gray-600 rounded-lg text-gray-400 font-medium cursor-not-allowed"
                >
                  Coming Soon - Premium
                </button>
              </div>
              
              <p className="text-gray-500 text-xs mt-3">
                Create your Flutterwave account to enable premium features with M-Pesa and card payments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}