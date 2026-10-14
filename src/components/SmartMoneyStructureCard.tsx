import React from 'react';
import { SMCAnalysis } from '../services/smartMoneyEngine';
import { Target, Layers, ArrowUp, ArrowDown, Activity, Sparkles, ShieldCheck } from 'lucide-react';

interface SmartMoneyStructureCardProps {
  analysis: SMCAnalysis;
}

export const SmartMoneyStructureCard: React.FC<SmartMoneyStructureCardProps> = ({ analysis }) => {
  const { pair, timeframe, bullishOB, bearishOB, liquidityPools, structure } = analysis;

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3.5">
      
      {/* Title & Structure Tag */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
              Smart Money Structure
            </h3>
            <span className="text-[10px] text-slate-400">
              [Trading Finder] OB Signal Setups Logic
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            BOS BULLISH
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {timeframe.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Order Blocks Status (Demand vs Supply) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        
        {/* Bullish Order Block (Demand Zone) */}
        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5" /> Bullish Order Block (OB)
            </span>
            <span className="text-[10px] font-mono text-emerald-400/80">
              {bullishOB.strengthScore}% Quality
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs font-mono">
            <span className="text-slate-400">Demand Zone:</span>
            <span className="font-bold text-white">
              {bullishOB.low} – {bullishOB.high}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-emerald-500/10">
            <span>Mitigation: {bullishOB.mitigationPercent}%</span>
            <span className="text-emerald-400 font-medium">Fresh Institutional Demand</span>
          </div>
        </div>

        {/* Bearish Order Block (Supply Zone) */}
        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5" /> Bearish Order Block (OB)
            </span>
            <span className="text-[10px] font-mono text-rose-400/80">
              {bearishOB.strengthScore}% Quality
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs font-mono">
            <span className="text-slate-400">Supply Zone:</span>
            <span className="font-bold text-white">
              {bearishOB.low} – {bearishOB.high}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-rose-500/10">
            <span>Mitigation: {bearishOB.mitigationPercent}%</span>
            <span className="text-rose-400 font-medium">Unmitigated Supply</span>
          </div>
        </div>

      </div>

      {/* Liquidity Structure Pools (BSL vs SSL) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Key Liquidity Pools & Sweeps
        </span>
        <div className="space-y-1.5">
          {liquidityPools.slice(0, 3).map((pool) => (
            <div
              key={pool.id}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    pool.type === 'BSL' ? 'bg-blue-400' : 'bg-amber-400'
                  }`}
                />
                <span className="text-slate-300 truncate">{pool.label}</span>
                {pool.swept && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold shrink-0">
                    SWEPT
                  </span>
                )}
              </div>
              <span className="font-mono font-bold text-slate-200 shrink-0 ml-2">
                {pool.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Setup Logic Guidance */}
      <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Trigger Conditions:</strong> Alerts fire when price sweeps liquidity into the Order Block zone and confirms an impulsive Break of Structure (BOS) candle close on {timeframe}.
        </p>
      </div>

    </div>
  );
};
