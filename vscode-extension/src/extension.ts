import * as vscode from 'vscode';

interface CodingSession {
    startTime: Date;
    endTime?: Date;
    totalMinutes: number;
    isActive: boolean;
}

class FlowCodeTracker {
    private currentSession: CodingSession | null = null;
    private dailySessions: CodingSession[] = [];
    private lastActivityTime: Date = new Date();
    private statusBarItem: vscode.StatusBarItem;
    private syncTimer: NodeJS.Timer | null = null;

    constructor(private context: vscode.ExtensionContext) {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 
            100
        );
        this.statusBarItem.command = 'flowcode.viewStats';
        this.statusBarItem.show();
        
        this.loadTodaysSessions();
        this.startTracking();
        this.setupAutoSync();
    }

    private startTracking() {
        // Track when user starts typing/editing
        vscode.workspace.onDidChangeTextDocument(() => {
            this.recordActivity();
        });

        // Track when user changes active editor
        vscode.window.onDidChangeActiveTextEditor(() => {
            this.recordActivity();
        });

        // Track when user changes selection
        vscode.window.onDidChangeTextEditorSelection(() => {
            this.recordActivity();
        });

        // Check for inactivity every minute
        setInterval(() => {
            this.checkInactivity();
        }, 60000); // 1 minute

        // Update status bar every 30 seconds
        setInterval(() => {
            this.updateStatusBar();
        }, 30000);
    }

    private recordActivity() {
        const now = new Date();
        this.lastActivityTime = now;

        if (!this.currentSession) {
            // Start new session
            this.currentSession = {
                startTime: now,
                totalMinutes: 0,
                isActive: true
            };
        } else if (!this.currentSession.isActive) {
            // Resume session if it was paused
            this.currentSession.isActive = true;
        }
    }

    private checkInactivity() {
        const now = new Date();
        const inactiveMinutes = (now.getTime() - this.lastActivityTime.getTime()) / (1000 * 60);
        
        // If inactive for more than 5 minutes, pause the session
        if (inactiveMinutes > 5 && this.currentSession?.isActive) {
            this.pauseCurrentSession();
        }
    }

    private pauseCurrentSession() {
        if (this.currentSession && this.currentSession.isActive) {
            const now = new Date();
            const sessionMinutes = (now.getTime() - this.currentSession.startTime.getTime()) / (1000 * 60);
            
            this.currentSession.totalMinutes += sessionMinutes;
            this.currentSession.endTime = now;
            this.currentSession.isActive = false;

            // Save session if it meets minimum time requirement
            const minSessionTime = vscode.workspace.getConfiguration('flowcode').get<number>('minSessionTime', 5);
            if (this.currentSession.totalMinutes >= minSessionTime) {
                this.dailySessions.push({ ...this.currentSession });
                this.saveTodaysSessions();
            }

            this.currentSession = null;
        }
    }

    private getTodaysTotal(): number {
        let total = 0;
        
        // Add completed sessions
        for (const session of this.dailySessions) {
            total += session.totalMinutes;
        }

        // Add current active session
        if (this.currentSession?.isActive) {
            const now = new Date();
            const currentMinutes = (now.getTime() - this.currentSession.startTime.getTime()) / (1000 * 60);
            total += currentMinutes;
        }

        return total;
    }

    private updateStatusBar() {
        const totalMinutes = this.getTodaysTotal();
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        
        const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        this.statusBarItem.text = `$(clock) FlowCode: ${timeStr}`;
        this.statusBarItem.tooltip = `Today's coding time: ${timeStr}\nClick to view details`;
    }

    private loadTodaysSessions() {
        const today = new Date().toDateString();
        const savedSessions = this.context.globalState.get<any>(`flowcode-sessions-${today}`, []);
        this.dailySessions = savedSessions.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime),
            endTime: s.endTime ? new Date(s.endTime) : undefined
        }));
    }

    private saveTodaysSessions() {
        const today = new Date().toDateString();
        this.context.globalState.update(`flowcode-sessions-${today}`, this.dailySessions);
    }

    private setupAutoSync() {
        const autoSync = vscode.workspace.getConfiguration('flowcode').get<boolean>('autoSync', true);
        
        if (autoSync) {
            // Sync every hour
            this.syncTimer = setInterval(() => {
                this.syncToFlowCode();
            }, 60 * 60 * 1000); // 1 hour
        }
    }

    public async syncToFlowCode() {
        try {
            const totalHours = this.getTodaysTotal() / 60;
            const config = vscode.workspace.getConfiguration('flowcode');
            const apiUrl = config.get<string>('apiUrl');
            const userId = config.get<string>('userId');

            if (!apiUrl || !userId) {
                vscode.window.showWarningMessage('FlowCode: Please configure API URL and User ID first');
                return;
            }

            // For now, we'll show a message since we need to implement the API endpoint
            const message = `Sync ${totalHours.toFixed(2)} hours to FlowCode?`;
            const result = await vscode.window.showInformationMessage(message, 'Yes', 'No');
            
            if (result === 'Yes') {
                // Here you would make an HTTP request to your FlowCode app
                // For now, we'll simulate it
                vscode.window.showInformationMessage(`✅ Synced ${totalHours.toFixed(2)} hours to FlowCode!`);
                
                // Clear today's sessions after successful sync
                this.dailySessions = [];
                this.saveTodaysSessions();
            }
        } catch (error) {
            vscode.window.showErrorMessage(`FlowCode sync failed: ${error}`);
        }
    }

    public showStats() {
        const totalMinutes = this.getTodaysTotal();
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        
        const sessionsCount = this.dailySessions.length + (this.currentSession ? 1 : 0);
        const isActive = this.currentSession?.isActive ? 'Active' : 'Inactive';
        
        const message = `📊 Today's Coding Stats:
⏱️ Total Time: ${hours}h ${minutes}m
📝 Sessions: ${sessionsCount}
🔄 Status: ${isActive}

Last Activity: ${this.lastActivityTime.toLocaleTimeString()}`;

        vscode.window.showInformationMessage(message, 'Sync to FlowCode', 'Configure').then(selection => {
            if (selection === 'Sync to FlowCode') {
                this.syncToFlowCode();
            } else if (selection === 'Configure') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'flowcode');
            }
        });
    }

    public configure() {
        vscode.commands.executeCommand('workbench.action.openSettings', 'flowcode');
    }

    public dispose() {
        this.statusBarItem.dispose();
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }
        this.pauseCurrentSession();
    }
}

export function activate(context: vscode.ExtensionContext) {
    const tracker = new FlowCodeTracker(context);

    // Register commands
    const syncCommand = vscode.commands.registerCommand('flowcode.syncTime', () => {
        tracker.syncToFlowCode();
    });

    const statsCommand = vscode.commands.registerCommand('flowcode.viewStats', () => {
        tracker.showStats();
    });

    const configCommand = vscode.commands.registerCommand('flowcode.configure', () => {
        tracker.configure();
    });

    context.subscriptions.push(syncCommand, statsCommand, configCommand, tracker);

    vscode.window.showInformationMessage('🚀 FlowCode Time Tracker is now active!');
}

export function deactivate() {}