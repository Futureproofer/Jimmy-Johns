import React from 'react';
import { CurrencyPair, PairAlertConfig, Timeframe } from '../types/trading';
import { TRADING_PAIRS } from '../data/assets';
import { Bell, BellOff, Mail, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight, Clock, Sliders, X, PlusCircle, CheckCircle2 } from 'lucide-react';

interface AlertControlsProps {
  pair: CurrencyPair;
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  config: PairAlertConfig;
  allConfigs: Record<string, PairAlertConfig>;
  onUpdateConfig: (updated: Partial<PairAlertConfig>) => void;
  onUpdatePairConfig: (pairId: string, updated: Partial<PairAlertConfig>) => void;
  onSelectPair: (pair: CurrencyPair) => void;
  onTriggerSimulatedBreakout: (direction: 'BUY' | 'SELL') => void;
  isTriggering: boolean;
}

export const AlertControls: React.FC<AlertControlsProps> = ({
  pair,
  selectedTimeframe,
  onSelectTimeframe,
  config,
  allConfigs,
  onUpdateConfig,
  onUpdatePairConfig,
  onSelectPair,
  onTriggerSimulatedBreakout,
  isTriggering,
}) => {
  const timeframes: Timeframe[] = ['5m', '15m', '1h'];

  // List of all currently activated pairs
  const activatedPairs = TRADING_PAIRS.filter((p) => {
    const c = allConfigs[p.id];
    return c && c.enabled && (c.timeframes['5m'] || c.timeframes['15m'] || c.timeframes['1h']);
  });

  // Toggle quick activation for the current pair
  const handleToggleCurrentPair = (enable: boolean) => {
    if (enable) {
      onUpdateConfig({
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        allowBuy: true,
        allowSell: true,
        timeframes: {
          ...config.timeframes,
          [selectedTimeframe]: true,
        },
      });
    } else {
      onUpdateConfig({
        enabled: false,
        emailEnabled: false,
        pushEnabled: false,
      });
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3 sm:p-4 space-y-4">
      
      {/* =========================================================================
          TOP ROW: Active Chart Timeframe + Activated Pairs Widget + Master Toggle
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        
        {/* 1. Left: Active Chart Timeframe */}
        <div className="shrink-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Active Chart Timeframe
          </span>
          <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800">
            {timeframes.map((tf) => {
              const isSelected = selectedTimeframe === tf;
              const hasAlert = config.enabled && config.timeframes[tf];
              return (
                <button
                  key={tf}
                  onClick={() => onSelectTimeframe(tf)}
                  className={`min-h-[36px] px-3.5 py-1 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tf.toUpperCase()}</span>
                  {hasAlert && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                      }`}
                      title={`${tf} alert active`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Middle Widget: ACTIVATED PAIRS (In the space to the right of Active Chart Timeframe) */}
        <div className="flex-1 min-w-0 bg-[#0b1120] border border-slate-800/90 rounded-xl p-2 sm:px-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  activatedPairs.length > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                }`}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Activated Pairs
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                {activatedPairs.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Only active pairs dispatch emails &amp; push
            </span>
          </div>

          {/* Activated Pairs Badges Carousel / Container */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {activatedPairs.length === 0 ? (
              <div className="flex items-center justify-between w-full py-1 text-xs text-slate-400">
                <span className="text-[11px] truncate text-slate-400">
                  No pairs active (All emails muted by default).
                </span>
                <button
                  onClick={() => handleToggleCurrentPair(true)}
                  className="ml-2 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0 shadow-sm"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Activate {pair.symbol}</span>
                </button>
              </div>
            ) : (
              activatedPairs.map((p) => {
                const c = allConfigs[p.id];
                const isCurrent = p.id === pair.id;
                const activeTfs = (['5m', '15m', '1h'] as const).filter((tf) => c?.timeframes[tf]);

                return (
                  <div
                    key={p.id}
                    className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                        : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <button
                      onClick={() => onSelectPair(p)}
                      className="flex items-center gap-1.5 text-left font-bold truncate"
                      title={`Switch chart to ${p.symbol}`}
                    >
                      <span>{p.symbol}</span>
                      <div className="flex items-center gap-0.5">
                        {activeTfs.map((tf) => (
                          <span
                            key={tf}
                            className="px-1 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-emerald-300 border border-slate-700"
                          >
                            {tf}
                          </span>
                        ))}
                      </div>
                    </button>

                    {/* Quick Deactivate 'x' Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePairConfig(p.id, {
                          enabled: false,
                          emailEnabled: false,
                          pushEnabled: false,
                        });
                      }}
                      className="p-0.5 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors ml-0.5"
                      title={`Deactivate alerts for ${p.symbol}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. Right: Current Selected Pair Master Alert Toggle */}
        <div className="shrink-0 flex items-center gap-3 bg-slate-900/80 p-2 sm:px-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              {config.enabled ? (
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <BellOff className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{pair.symbol} Alerts</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {config.enabled ? 'ACTIVE (EMAILS ON)' : 'OFF (MUTED)'}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleToggleCurrentPair(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

      </div>

      {/* Grid of Alert Triggers (5m vs 15m vs 1h & Buy vs Sell) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            Alert Filters &amp; Timeframe Subscriptions for {pair.symbol}
          </span>
          <span className="text-[11px] text-slate-400">
            {config.enabled ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Activated
              </span>
            ) : (
              <span className="text-slate-500">Muted until toggled</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2">
          
          {/* 5 Minute Chart Alerts */}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
              config.timeframes['5m'] && config.enabled
                ? 'bg-blue-950/20 border-blue-500/30'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <div>
                <span className="text-xs font-semibold text-white block">5 Minute Chart</span>
                <span className="text-[10px] text-slate-400">Scalp OB Breakouts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.timeframes['5m']}
              onChange={(e) => {
                const checked = e.target.checked;
                onUpdateConfig({
                  enabled: checked ? true : config.enabled,
                  emailEnabled: checked ? true : config.emailEnabled,
                  pushEnabled: checked ? true : config.pushEnabled,
                  allowBuy: checked ? true : config.allowBuy,
                  allowSell: checked ? true : config.allowSell,
                  timeframes: { ...config.timeframes, '5m': checked },
                });
              }}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* 15 Minute Chart Alerts */}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
              config.timeframes['15m'] && config.enabled
                ? 'bg-blue-950/20 border-blue-500/30'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <div>
                <span className="text-xs font-semibold text-white block">15 Minute Chart</span>
                <span className="text-[10px] text-slate-400">Intraday Breakouts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.timeframes['15m']}
              onChange={(e) => {
                const checked = e.target.checked;
                onUpdateConfig({
                  enabled: checked ? true : config.enabled,
                  emailEnabled: checked ? true : config.emailEnabled,
                  pushEnabled: checked ? true : config.pushEnabled,
                  allowBuy: checked ? true : config.allowBuy,
                  allowSell: checked ? true : config.allowSell,
                  timeframes: { ...config.timeframes, '15m': checked },
                });
              }}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* 1 Hour Chart Alerts */}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
              config.timeframes['1h'] && config.enabled
                ? 'bg-blue-950/20 border-blue-500/30'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <div>
                <span className="text-xs font-semibold text-white block">1 Hour Chart</span>
                <span className="text-[10px] text-slate-400">Macro OB Breakouts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.timeframes['1h']}
              onChange={(e) => {
                const checked = e.target.checked;
                onUpdateConfig({
                  enabled: checked ? true : config.enabled,
                  emailEnabled: checked ? true : config.emailEnabled,
                  pushEnabled: checked ? true : config.pushEnabled,
                  allowBuy: checked ? true : config.allowBuy,
                  allowSell: checked ? true : config.allowSell,
                  timeframes: { ...config.timeframes, '1h': checked },
                });
              }}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Buy Breakout Signals */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Buy Signals</span>
                <span className="text-[10px] text-emerald-400/80">Bullish OB Breakouts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.allowBuy}
              onChange={(e) => onUpdateConfig({ allowBuy: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Sell Breakdown Signals */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Sell Signals</span>
                <span className="text-[10px] text-rose-400/80">Bearish OB Breakouts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.allowSell}
              onChange={(e) => onUpdateConfig({ allowSell: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600 bg-slate-800 border-slate-700 focus:ring-rose-500 cursor-pointer"
            />
          </div>

          {/* Delivery Channels */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-slate-300">
                <Bell className="w-3.5 h-3.5 text-blue-400" />
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Push &amp; Email</span>
                <span className="text-[10px] text-slate-400">Entry, SL, TP1, TP2</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-mono font-bold ${
                  config.enabled ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {config.enabled ? 'ARMED' : 'MUTED'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Double-Check Live Data Guarantee Banner */}
      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs">
            <span className="font-semibold text-emerald-300 block sm:inline">
              Live Data Double-Check Guarantee:
            </span>{' '}
            <span className="text-slate-400 text-[11px]">
              Every signal cross-validates live exchange quote, spread &amp; 3-tick confirmation filter before firing push or email.
            </span>
          </div>
        </div>
        <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
          VERIFIED ON
        </span>
      </div>

      {/* Manual Immediate Test Triggers */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="text-xs text-slate-400">
          Test real-time indicator trigger for <strong className="text-white">{pair.symbol} ({selectedTimeframe})</strong>:
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTriggerSimulatedBreakout('BUY')}
            disabled={isTriggering}
            className="flex-1 sm:flex-none min-h-[40px] px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Test Buy Signal</span>
          </button>

          <button
            onClick={() => onTriggerSimulatedBreakout('SELL')}
            disabled={isTriggering}
            className="flex-1 sm:flex-none min-h-[40px] px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Test Sell Signal</span>
          </button>
        </div>
      </div>

    </div>
  );
};
