import React, { useState } from 'react';
import { CurrencyPair, Timeframe, SignalSetup } from '../types/trading';
import { SMCAnalysis } from '../services/smartMoneyEngine';
import { SMCInteractiveChart } from './SMCInteractiveChart';
import { ExternalLink, Maximize2, Minimize2, BarChart2, TrendingUp, RefreshCw } from 'lucide-react';

interface TradingViewWidgetProps {
  pair: CurrencyPair;
  timeframe: Timeframe;
  analysis: SMCAnalysis;
  activeSignal?: SignalSetup | null;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  pair,
  timeframe,
  analysis,
  activeSignal,
}) => {
  const [chartType, setChartType] = useState<'smc' | 'tv'>('smc');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Timeframe interval for TradingView
  const tvInterval = timeframe === '5m' ? '5' : timeframe === '15m' ? '15' : '60';

  // Direct TradingView embed iframe URL
  const tvEmbedUrl = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
    pair.tvSymbol
  )}&interval=${tvInterval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=rgba(11,17,32,1)&theme=dark&style=1&timezone=Etc%2FUTC&studies=%5B%5D&withdateranges=1&showpopupbutton=1&popupwidth=1000&popupheight=650&locale=en`;

  const tvDirectUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(pair.tvSymbol)}`;

  return (
    <div
      className={`relative flex flex-col bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none bg-[#090d16]'
          : 'w-full'
      }`}
    >
      {/* Top Chart Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#0d1527] border-b border-slate-800 text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Chart Engine Switcher Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setChartType('smc')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                chartType === 'smc'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>SMC Order Block Chart</span>
            </button>
            <button
              onClick={() => setChartType('tv')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                chartType === 'tv'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3 h-3" />
              <span>TradingView Live</span>
            </button>
          </div>

          <span className="text-slate-600 hidden xs:inline">·</span>
          <span className="font-mono text-xs font-bold text-white hidden sm:inline">
            {pair.symbol} ({timeframe.toUpperCase()})
          </span>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1.5">
          {chartType === 'tv' && (
            <button
              onClick={() => setIframeKey((k) => k + 1)}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reload TradingView Chart"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}

          <a
            href={tvDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
            title="Open in full TradingView tab"
          >
            <span>TradingView</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full flex-1">
        {chartType === 'smc' ? (
          <SMCInteractiveChart
            pair={pair}
            timeframe={timeframe}
            analysis={analysis}
            activeSignal={activeSignal}
          />
        ) : (
          <div className="relative w-full h-[360px] sm:h-[450px] bg-[#090d16]">
            <iframe
              key={iframeKey}
              src={tvEmbedUrl}
              title={`TradingView Chart ${pair.symbol}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
};
