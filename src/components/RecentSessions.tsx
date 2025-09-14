import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface CodingSession {
  id: string;
  date: string;
  hours: number;
  description?: string;
  created_at: string;
}

interface RecentSessionsProps {
  sessions: CodingSession[];
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Recent Sessions</h3>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No coding sessions yet</p>
          <p className="text-gray-500 text-sm">Start logging your sessions to track your progress!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="bg-gray-900 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {format(new Date(session.date), 'MMM dd, yyyy')}
                  </span>
                  <span className="text-blue-400 font-bold">
                    {session.hours}h
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  {format(new Date(session.created_at), 'HH:mm')}
                </span>
              </div>
              
              {session.description && (
                <p className="text-gray-300 text-sm mt-2">
                  {session.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}