import React, { useState, useEffect } from 'react';
import { Code2, Download, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface VSCodeIntegrationProps {
  user: any;
}

export default function VSCodeIntegration({ user }: VSCodeIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    // Check if VS Code extension has synced recently
    const lastSyncTime = localStorage.getItem('flowcode-vscode-last-sync');
    if (lastSyncTime) {
      setLastSync(lastSyncTime);
      setIsConnected(true);
    }

    // Listen for VS Code sync events
    const handleVSCodeSync = (event: CustomEvent) => {
      const { hours, date } = event.detail;
      toast.success(`VS Code synced ${hours.toFixed(2)} hours for ${date}`);
      setLastSync(new Date().toISOString());
      setIsConnected(true);
      localStorage.setItem('flowcode-vscode-last-sync', new Date().toISOString());
    };

    window.addEventListener('flowcode-vscode-sync' as any, handleVSCodeSync);
    return () => window.removeEventListener('flowcode-vscode-sync' as any, handleVSCodeSync);
  }, []);

  const downloadExtension = () => {
    // In a real implementation, this would download the .vsix file
    toast.success('Extension download started! Check the vscode-extension folder in your project.');
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(user?.id || 'user-1');
    toast.success('User ID copied to clipboard!');
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast.success('App URL copied to clipboard!');
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center space-x-2 mb-6">
        <Code2 className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">VS Code Integration</h3>
        {isConnected && (
          <div className="flex items-center space-x-1 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Connected</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Connection Status */}
        <div className={`p-4 rounded-lg border ${
          isConnected 
            ? 'bg-green-900/30 border-green-700' 
            : 'bg-orange-900/30 border-orange-700'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-400" />
            )}
            <h4 className={`font-medium ${
              isConnected ? 'text-green-300' : 'text-orange-300'
            }`}>
              {isConnected ? 'VS Code Extension Connected' : 'VS Code Extension Not Connected'}
            </h4>
          </div>
          <p className={`text-sm ${
            isConnected ? 'text-green-400' : 'text-orange-400'
          }`}>
            {isConnected 
              ? `Last sync: ${lastSync ? new Date(lastSync).toLocaleString() : 'Unknown'}`
              : 'Install and configure the VS Code extension to automatically track coding time'
            }
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Setup Instructions:</h4>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <p className="text-white font-medium">Download Extension</p>
                <p className="text-gray-400 text-sm mb-2">Get the FlowCode VS Code extension</p>
                <button
                  onClick={downloadExtension}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Extension</span>
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <div>
                <p className="text-white font-medium">Install in VS Code</p>
                <p className="text-gray-400 text-sm">Install the .vsix file in VS Code</p>
                <code className="block bg-gray-900 p-2 rounded text-green-400 text-sm mt-1">
                  code --install-extension flowcode-tracker-0.0.1.vsix
                </code>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <p className="text-white font-medium">Configure Extension</p>
                <p className="text-gray-400 text-sm mb-2">Copy these settings to VS Code</p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 text-sm">App URL:</span>
                    <code className="bg-gray-900 px-2 py-1 rounded text-green-400 text-sm flex-1">
                      {window.location.origin}
                    </code>
                    <button
                      onClick={copyAppUrl}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 text-sm">User ID:</span>
                    <code className="bg-gray-900 px-2 py-1 rounded text-green-400 text-sm flex-1">
                      {user?.id || 'user-1'}
                    </code>
                    <button
                      onClick={copyUserId}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                4
              </div>
              <div>
                <p className="text-white font-medium">Start Coding!</p>
                <p className="text-gray-400 text-sm">The extension will automatically track your coding time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Extension Features:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Automatic time tracking based on VS Code activity</li>
            <li>• Smart session detection with inactivity pausing</li>
            <li>• Real-time coding time display in status bar</li>
            <li>• Hourly auto-sync to FlowCode app</li>
            <li>• Manual sync and stats viewing</li>
            <li>• Configurable minimum session times</li>
          </ul>
        </div>
      </div>
    </div>
  );
}