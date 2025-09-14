import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodingSessionFormProps {
  onAddSession: (hours: number, description: string) => void;
}

export default function CodingSessionForm({ onAddSession }: CodingSessionFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      toast.error('Please enter valid hours');
      return;
    }

    onAddSession(hoursNum, description);
    setHours('');
    setDescription('');
    setIsExpanded(false);
    toast.success('Coding session logged!');
  };

  if (!isExpanded) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Log Coding Session</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Log Coding Session</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-300 mb-2">
            Hours Coded
          </label>
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 2.5"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            What did you work on? (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe what you coded today..."
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Log Session
          </button>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setHours('');
              setDescription('');
            }}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}