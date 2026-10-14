import React, { useState } from 'react';
import { CurrencyPair, PairAlertConfig } from '../types/trading';
import { createCustomCurrencyPair } from '../data/assets';
import { X, Search, Layers, Bell, Check, Clock, Plus, Sparkles } from 'lucide-react';

interface AllPairsAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertConfigs: Record<string, PairAlertConfig>;
  allPairs: CurrencyPair[];
  onAddCustomPair: (pair: CurrencyPair) => void;
  onUpdatePairConfig: (pairId: string, updated: Partial<PairAlertConfig>) => void;
  onSelectPair: (pair: CurrencyPair) => void;
}

export const AllPairsAlertModal: React.FC<AllPairsAlertModalProps> = ({
  isOpen,
  onClose,
  alertConfigs,
  allPairs,
  onAddCustomPair,
  onUpdatePairConfig,
  onSelectPair,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredPairs = allPairs.filter(
    (p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase().replace(/[^a-z0-9]/g, ''))
  );

  const handleAddSearchPair = () => {
    if (!search.trim()) return;
    const newPair = createCustomCurrencyPair(search.trim());
    onAddCustomPair(newPair);
    onSelectPair(newPair);
    setSearch('');
  };

  const toggleAllTimeframe = (tf: '5m' | '15m' | '1h', enable: boolean) => {
    allPairs.forEach((p) => {
      const current = alertConfigs[p.id];
      if (current) {
        onUpdatePairConfig(p.id, {
          enabled: enable ? true : current.enabled,
          emailEnabled: enable ? true : current.emailEnabled,
          pushEnabled: enable ? true : current.pushEnabled,
          timeframes: { ...current.timeframes, [tf]: enable },
        });
      }
    });
  };

  const toggleAllMaster = (enable: boolean) => {
    allPairs.forEach((p) => {
      onUpdatePairConfig(p.id, {
        enabled: enable,
        emailEnabled: enable,
        pushEnabled: enable,
        timeframes: {
          '5m': enable,
          '15m': enable,
          '1h': false,
        },
      });
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Multi-Asset Pairs Alert Dashboard
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure breakout alerts across {allPairs.length} Forex, Commodities, and Crypto assets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Bulk Action Bar & Search */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter or add EUR/CAD, NZD/CAD, Gold, Oil, USD..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {search.trim().length > 1 && !allPairs.some((p) => p.symbol.toLowerCase() === search.trim().toLowerCase()) && (
              <button
                onClick={handleAddSearchPair}
                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add {search.toUpperCase()}</span>
              </button>
            )}

            <button
              onClick={() => toggleAllTimeframe('15m', true)}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Enable All 15m
            </button>
            <button
              onClick={() => toggleAllTimeframe('5m', true)}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Enable All 5m
            </button>
            <button
              onClick={() => toggleAllMaster(true)}
              className="px-2.5 py-1 rounded-md bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-medium transition-colors"
            >
              Enable All Pairs
            </button>
            <button
              onClick={() => toggleAllMaster(false)}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] font-medium transition-colors"
            >
              Mute All
            </button>
          </div>
        </div>

        {/* Pairs Table List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 sm:p-3">
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <div className="col-span-5 sm:col-span-4">Asset / Pair</div>
            <div className="col-span-3 sm:col-span-2 text-center">Alert Active</div>
            <div className="col-span-4 sm:col-span-3 text-center">Timeframes (5m / 15m / 1h)</div>
            <div className="hidden sm:block sm:col-span-3 text-right">Quick Select</div>
          </div>

          {filteredPairs.map((pair) => {
            const config = alertConfigs[pair.id] || {
              pairId: pair.id,
              enabled: false,
              timeframes: { '5m': false, '15m': false, '1h': false },
              allowBuy: true,
              allowSell: true,
              minRiskReward: 1.8,
              pushEnabled: false,
              emailEnabled: false,
              doubleCheckRequired: true,
            };

            return (
              <div
                key={pair.id}
                className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center hover:bg-slate-900/60 rounded-lg transition-colors text-xs"
              >
                {/* Pair Name */}
                <div className="col-span-5 sm:col-span-4 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">
                      {pair.symbol}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {pair.basePrice.toFixed(pair.digits)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {pair.displayName}
                  </div>
                </div>

                {/* Master Active Toggle */}
                <div className="col-span-3 sm:col-span-2 flex justify-center">
                  <button
                    onClick={() => {
                      const nextState = !config.enabled;
                      onUpdatePairConfig(pair.id, {
                        enabled: nextState,
                        emailEnabled: nextState,
                        pushEnabled: nextState,
                        timeframes: nextState
                          ? { ...config.timeframes, '15m': true }
                          : config.timeframes,
                      });
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      config.enabled
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>{config.enabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* Timeframes Switcher */}
                <div className="col-span-4 sm:col-span-3 flex items-center justify-center gap-1">
                  {(['5m', '15m', '1h'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        const nextTf = !config.timeframes[tf];
                        onUpdatePairConfig(pair.id, {
                          enabled: nextTf ? true : config.enabled,
                          emailEnabled: nextTf ? true : config.emailEnabled,
                          pushEnabled: nextTf ? true : config.pushEnabled,
                          timeframes: {
                            ...config.timeframes,
                            [tf]: nextTf,
                          },
                        });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                        config.timeframes[tf] && config.enabled
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* View on Chart */}
                <div className="hidden sm:flex sm:col-span-3 justify-end">
                  <button
                    onClick={() => {
                      onSelectPair(pair);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                  >
                    View Chart &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0b1120] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredPairs.length} Pairs Monitored</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
          >
            Apply &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};
