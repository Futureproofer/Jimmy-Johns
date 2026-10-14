import React from 'react';
import { Bell, BellOff, Volume2, VolumeX, Mail, Layers, ShieldCheck, Activity } from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface HeaderProps {
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMailingList: () => void;
  onOpenAllPairsModal: () => void;
  onSendTestEmail: () => void;
  recipientsCount: number;
  activePairsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  notificationPermission,
  onRequestPermission,
  soundEnabled,
  onToggleSound,
  onOpenMailingList,
  onOpenAllPairsModal,
  onSendTestEmail,
  recipientsCount,
  activePairsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                Smart Money OB Terminal
              </h1>
              <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
              [Trading Finder] OB Breakouts &bull; Double-Checked Signals
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* All Pairs Alerts Overview Button */}
          <button
            onClick={onOpenAllPairsModal}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-200 transition-colors"
            title="Manage alerts across all pairs"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline font-medium">All Pairs</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
              {activePairsCount}
            </span>
          </button>

          {/* Mailing List Button */}
          <button
            onClick={onOpenMailingList}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-200 transition-colors"
            title="Mailing List Recipients"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-medium">Mailing List</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              {recipientsCount}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700/60 text-emerald-400 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
            aria-label="Toggle Sound Alerts"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Push Notification Permission */}
          <button
            onClick={onRequestPermission}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              notificationPermission === 'granted'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
            }`}
            title={notificationPermission === 'granted' ? 'Push Notifications Active' : 'Enable Push Notifications'}
          >
            <Bell className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">
              {notificationPermission === 'granted' ? 'Push Active' : 'Enable Push'}
            </span>
          </button>

          {/* Quick Test Alert Button */}
          <button
            onClick={onSendTestEmail}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm shadow-emerald-900/30 transition-colors"
            title="Send a sample email & push breakout alert"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Test Alert</span>
          </button>

        </div>

      </div>
    </header>
  );
};
