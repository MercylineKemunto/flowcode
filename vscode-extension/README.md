# FlowCode Time Tracker - VS Code Extension

Automatically track your coding time in VS Code and sync it with your FlowCode app.

## Features

- **Automatic Time Tracking**: Tracks your coding time based on actual activity (typing, editing, file changes)
- **Smart Session Detection**: Automatically starts/stops sessions based on activity
- **Inactivity Detection**: Pauses tracking after 5 minutes of inactivity
- **Status Bar Integration**: Shows current day's coding time in the status bar
- **Auto-Sync**: Automatically syncs your time to FlowCode app every hour
- **Manual Sync**: Sync your time manually whenever you want
- **Configurable**: Customize minimum session time, auto-sync settings, and more

## Installation

1. Copy the `vscode-extension` folder to your development environment
2. Open the folder in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to launch a new Extension Development Host window
5. The extension will be active in the new window

## Configuration

Open VS Code settings and search for "FlowCode" to configure:

- **FlowCode API URL**: Your FlowCode app URL (default: https://coding-streak-tracke-fjel.bolt.host)
- **User ID**: Your FlowCode user ID (default: user-1)
- **Auto Sync**: Enable/disable automatic hourly syncing
- **Minimum Session Time**: Minimum minutes of activity to count as a coding session

## Usage

### Automatic Tracking
The extension automatically starts tracking when you:
- Type or edit code
- Switch between files
- Change text selection

### Manual Commands
- **Sync Coding Time to FlowCode**: Manually sync your time
- **View Today's Coding Stats**: See detailed stats for today
- **Configure FlowCode Integration**: Open settings

### Status Bar
Click the FlowCode time display in the status bar to view detailed stats and sync options.

## How It Works

1. **Activity Detection**: Monitors VS Code events (typing, file changes, etc.)
2. **Session Management**: Groups continuous activity into coding sessions
3. **Inactivity Handling**: Automatically pauses after 5 minutes of inactivity
4. **Time Calculation**: Accurately calculates total coding time
5. **Sync Integration**: Sends time data to your FlowCode app

## Privacy

- All time tracking data is stored locally in VS Code
- Data is only sent to your FlowCode app when you sync
- No data is sent to third parties

## Development

To package the extension:
```bash
npm install -g vsce
vsce package
```

This creates a `.vsix` file that can be installed in VS Code.

## Support

For issues or questions, please check the FlowCode app documentation or create an issue in the repository.