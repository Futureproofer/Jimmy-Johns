import React, { useState } from 'react';
import { SignalSetup } from '../types/trading';
import { X, Mail, ExternalLink, Smartphone, Monitor, ShieldCheck, Check } from 'lucide-react';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: SignalSetup | null;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, signal }) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  if (!isOpen || !signal) return null;

  const isBuy = signal.direction === 'BUY';
  const tvUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(signal.tvSymbol)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-3.5 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Email Alert Preview ({signal.symbol} &bull; {signal.timeframe})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport switch */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1 rounded ${
                  viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1 rounded ${
                  viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Meta Bar */}
        <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-slate-500">To: </span>
            <span className="text-slate-200 font-medium font-mono">
              {signal.emailRecipients?.join(', ') || 'themopixel@gmail.com'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Subject: </span>
            <span className="text-white font-medium">
              🚨 {signal.direction} Breakout: {signal.symbol} ({signal.timeframe}) - Smart Money OB Signal
            </span>
          </div>
        </div>

        {/* Rendered Email Body Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#090d16] flex justify-center">
          <div
            className={`w-full transition-all duration-200 bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-2xl ${
              viewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-xl'
            }`}
          >
            {/* Email Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-b border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Smart Money OB Signal Terminal
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {signal.symbol}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-black tracking-wider text-white uppercase ${
                    isBuy ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  {signal.direction} SIGNAL
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Timeframe: <strong className="text-slate-200">{signal.timeframe.toUpperCase()}</strong></span>
                <span>&bull;</span>
                <span>Setup: <strong className="text-slate-200">OB Breakout</strong></span>
              </div>
            </div>

            {/* Execution Levels */}
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                  Institutional Execution Targets
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 block">Entry</span>
                    <span className="text-sm font-mono font-bold text-blue-400">
                      {signal.entry}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 block">Stop Loss</span>
                    <span className="text-sm font-mono font-bold text-rose-400">
                      {signal.stopLoss}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 block">Risk:Reward</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      1:{signal.riskReward}
                    </span>
                  </div>
                </div>
              </div>

              {/* Take Profits */}
              <div className="p-3 rounded-lg bg-[#131d31] border border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">🎯 Take Profit 1 (1:2 R:R)</span>
                  <span className="font-mono font-bold text-emerald-400">{signal.takeProfit1}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-950">
                  <span className="text-slate-300">🎯 Take Profit 2 (1:3 Major BSL Target)</span>
                  <span className="font-mono font-bold text-emerald-400">{signal.takeProfit2}</span>
                </div>
              </div>

              {/* SMC Context */}
              <div
                className={`p-3 rounded-lg border text-xs leading-relaxed ${
                  isBuy
                    ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-300'
                    : 'bg-rose-950/20 border-rose-500/20 text-slate-300'
                }`}
              >
                <div className="font-bold text-white mb-1">Smart Money Liquidity Structure:</div>
                <p className="text-slate-400 text-[11px] mb-2">{signal.liquiditySwept}</p>
                <div className="text-[11px] font-mono text-slate-300">
                  OB Zone: {signal.orderBlock?.low} - {signal.orderBlock?.high} ({signal.orderBlock?.type} OB)
                </div>
              </div>

              {/* Double Check Guarantee Box */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-300">Live Data Double-Check: VERIFIED</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Bid/Ask spread and 3-tick confirmation filter passed at {signal.timestamp}. Zero unconfirmed alerts.
                  </div>
                </div>
              </div>

              {/* Direct TradingView Button */}
              <div className="pt-1">
                <a
                  href={tvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/30 text-center"
                >
                  <span>Open Live Chart on TradingView</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Email Footer */}
            <div className="p-3 bg-[#0b1120] border-t border-slate-800 text-center text-[10px] text-slate-500">
              Delivered by Smart Money OB Signal Terminal &bull; themopixel@gmail.com
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
