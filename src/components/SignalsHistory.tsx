import React, { useState } from 'react';
import { SignalSetup } from '../types/trading';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Mail, Bell, ExternalLink, Eye, Clock } from 'lucide-react';

interface SignalsHistoryProps {
  signals: SignalSetup[];
  onPreviewEmail: (signal: SignalSetup) => void;
}

export const SignalsHistory: React.FC<SignalsHistoryProps> = ({ signals, onPreviewEmail }) => {
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filteredSignals = signals.filter((s) => {
    if (filter === 'ALL') return true;
    return s.direction === filter;
  });

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3.5">
      
      {/* Header and Filter Buttons */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
            <span>Verified Breakout Signals Feed</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {signals.length}
            </span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time push alerts & emails dispatched upon double-check confirmation
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 self-start xs:self-auto">
          {(['ALL', 'BUY', 'SELL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filter === tab
                  ? tab === 'BUY'
                    ? 'bg-emerald-600 text-white'
                    : tab === 'SELL'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Cards Feed */}
      <div className="space-y-3">
        {filteredSignals.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs bg-slate-900/40 rounded-lg border border-dashed border-slate-800">
            No breakout signals triggered yet for this filter.
            <div className="text-[11px] text-slate-500 mt-1">
              Click &quot;Test Buy Signal&quot; or &quot;Test Sell Signal&quot; above to simulate a live OB trigger.
            </div>
          </div>
        ) : (
          filteredSignals.map((signal) => {
            const isBuy = signal.direction === 'BUY';
            const tvUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(signal.tvSymbol)}`;

            return (
              <div
                key={signal.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isBuy
                    ? 'bg-gradient-to-b from-emerald-950/20 to-[#0f172a] border-emerald-500/30'
                    : 'bg-gradient-to-b from-rose-950/20 to-[#0f172a] border-rose-500/30'
                }`}
              >
                {/* Signal Top Row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold font-mono tracking-wider text-white ${
                        isBuy ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {isBuy ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {signal.direction}
                    </span>

                    <span className="text-sm font-bold text-white tracking-tight">
                      {signal.symbol}
                    </span>

                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 font-bold">
                      {signal.timeframe.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{signal.timestamp}</span>
                  </div>
                </div>

                {/* Execution Levels Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  
                  {/* Entry Price */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Entry Price
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-blue-400">
                      {signal.entry}
                    </span>
                  </div>

                  {/* Stop Loss */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Stop Loss (SL)
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-rose-400">
                      {signal.stopLoss}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {signal.pipsRisk} pips risk
                    </span>
                  </div>

                  {/* Take Profit 1 */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Take Profit 1 (1:2)
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                      {signal.takeProfit1}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      +{signal.pipsReward1} pips
                    </span>
                  </div>

                  {/* Take Profit 2 */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Take Profit 2 (1:3)
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                      {signal.takeProfit2}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-mono font-semibold block">
                      1:{signal.riskReward} R:R
                    </span>
                  </div>

                </div>

                {/* Liquidity Swept Note */}
                <div className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 mb-2.5 leading-relaxed">
                  <span className="text-slate-400 font-semibold">SMC Trigger: </span>
                  {signal.liquiditySwept}
                </div>

                {/* Verification Proof & Action Buttons Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  
                  {/* Double Check Status Badge */}
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="font-semibold">Double-Checked Live Data</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      ({signal.doubleCheck.latencyMs}ms &bull; Spread {signal.doubleCheck.spreadPips}p)
                    </span>
                  </div>

                  {/* Actions: View Email Sent & Open TradingView */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreviewEmail(signal)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="View HTML email sent to recipients"
                    >
                      <Mail className="w-3 h-3 text-emerald-400" />
                      <span>Email Dispatched</span>
                      <Eye className="w-3 h-3 text-slate-400 ml-0.5" />
                    </button>

                    <a
                      href={tvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white transition-colors"
                    >
                      <span>Chart</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
