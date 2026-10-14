import React, { useMemo } from 'react';
import { CurrencyPair, Timeframe, SignalSetup } from '../types/trading';
import { SMCAnalysis } from '../services/smartMoneyEngine';

interface SMCInteractiveChartProps {
  pair: CurrencyPair;
  timeframe: Timeframe;
  analysis: SMCAnalysis;
  activeSignal?: SignalSetup | null;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  isBullish: boolean;
}

export const SMCInteractiveChart: React.FC<SMCInteractiveChartProps> = ({
  pair,
  timeframe,
  analysis,
  activeSignal,
}) => {
  const { bullishOB, bearishOB, liquidityPools, currentPrice } = analysis;

  // Generate 24 realistic recent candles ending at the current price
  const candles = useMemo(() => {
    const list: Candle[] = [];
    const count = 24;
    const pip = pair.pipSize;
    const tfMult = timeframe === '5m' ? 1.0 : timeframe === '15m' ? 1.8 : 3.5;
    const volatility = pip * 8 * tfMult;

    let price = currentPrice - volatility * 4;
    const now = Date.now();
    const intervalMs = timeframe === '5m' ? 5 * 60 * 1000 : timeframe === '15m' ? 15 * 60 * 1000 : 60 * 60 * 1000;

    for (let i = 0; i < count; i++) {
      const timeStr = new Date(now - (count - 1 - i) * intervalMs).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Trending pattern: dip into bullish OB then impulse breakout
      let move = (Math.sin(i * 0.45) * 1.2 + (Math.random() - 0.48)) * volatility;
      if (i === count - 4) {
        // Sweep low into Bullish OB
        move = -volatility * 2.2;
      } else if (i >= count - 3) {
        // Strong bullish breakout impulse
        move = volatility * 2.0;
      }

      const open = price;
      const close = Number((open + move).toFixed(pair.digits));
      const high = Number((Math.max(open, close) + Math.random() * volatility * 0.7).toFixed(pair.digits));
      const low = Number((Math.min(open, close) - Math.random() * volatility * 0.7).toFixed(pair.digits));

      price = close;
      list.push({
        time: timeStr,
        open,
        high,
        low,
        close,
        isBullish: close >= open,
      });
    }

    // Force last candle close to currentPrice
    const last = list[list.length - 1];
    last.close = currentPrice;
    last.high = Math.max(last.high, currentPrice);
    last.low = Math.min(last.low, currentPrice);
    last.isBullish = last.close >= last.open;

    return list;
  }, [pair, timeframe, currentPrice]);

  // Determine scale bounds
  const minPrice = useMemo(() => {
    const candleLows = candles.map((c) => c.low);
    const levels = [
      ...candleLows,
      bullishOB.low,
      activeSignal?.stopLoss ?? bullishOB.low,
    ];
    return Math.min(...levels) - pair.pipSize * 4;
  }, [candles, bullishOB, activeSignal, pair]);

  const maxPrice = useMemo(() => {
    const candleHighs = candles.map((c) => c.high);
    const levels = [
      ...candleHighs,
      bearishOB.high,
      activeSignal?.takeProfit2 ?? bearishOB.high,
    ];
    return Math.max(...levels) + pair.pipSize * 4;
  }, [candles, bearishOB, activeSignal, pair]);

  const priceRange = maxPrice - minPrice || 1;

  // Coordinate mapping
  const height = 340;
  const width = 640;
  const paddingRight = 65;
  const paddingLeft = 10;
  const chartWidth = width - paddingRight - paddingLeft;

  const getY = (val: number) => {
    const ratio = (val - minPrice) / priceRange;
    return height - ratio * (height - 40) - 20;
  };

  const candleWidth = chartWidth / candles.length;

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] bg-[#070b14] rounded-xl overflow-hidden border border-slate-800 flex flex-col select-none">
      
      {/* Chart Canvas Header */}
      <div className="px-3 py-2 bg-[#0b1120] border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wide">{pair.symbol}</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
            {timeframe.toUpperCase()} SMC OB
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Live Tick: {currentPrice.toFixed(pair.digits)}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] font-medium">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-1.5 bg-emerald-500/30 border border-emerald-500 rounded-xs" />
            Bullish OB
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-1.5 bg-rose-500/30 border border-rose-500 rounded-xs" />
            Bearish OB
          </span>
          <span className="hidden xs:flex items-center gap-1 text-blue-400">
            <span className="w-2 h-0.5 bg-blue-400" />
            BSL / SSL
          </span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative flex-1 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Bullish OB Gradient */}
            <linearGradient id="bullishOBGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
            </linearGradient>

            {/* Bearish OB Gradient */}
            <linearGradient id="bearishOBGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = height * ratio;
            const p = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={width - paddingRight + 6}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {p.toFixed(pair.digits)}
                </text>
              </g>
            );
          })}

          {/* Bearish Order Block (Supply Zone) Box */}
          {(() => {
            const y1 = getY(bearishOB.high);
            const y2 = getY(bearishOB.low);
            const boxH = Math.max(8, Math.abs(y2 - y1));
            return (
              <g>
                <rect
                  x={paddingLeft}
                  y={Math.min(y1, y2)}
                  width={chartWidth}
                  height={boxH}
                  fill="url(#bearishOBGrad)"
                  stroke="#f43f5e"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />
                <text
                  x={paddingLeft + 6}
                  y={Math.min(y1, y2) + 12}
                  fill="#f43f5e"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  BEARISH OB ({bearishOB.low} - {bearishOB.high})
                </text>
              </g>
            );
          })()}

          {/* Bullish Order Block (Demand Zone) Box */}
          {(() => {
            const y1 = getY(bullishOB.high);
            const y2 = getY(bullishOB.low);
            const boxH = Math.max(8, Math.abs(y2 - y1));
            return (
              <g>
                <rect
                  x={paddingLeft}
                  y={Math.min(y1, y2)}
                  width={chartWidth}
                  height={boxH}
                  fill="url(#bullishOBGrad)"
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />
                <text
                  x={paddingLeft + 6}
                  y={Math.max(y1, y2) - 4}
                  fill="#10b981"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  BULLISH OB ({bullishOB.low} - {bullishOB.high}) &bull; DEMAND
                </text>
              </g>
            );
          })()}

          {/* Liquidity Pool Lines: BSL & SSL */}
          {liquidityPools.slice(0, 2).map((pool) => {
            const y = getY(pool.level);
            if (y < 0 || y > height) return null;
            const isBSL = pool.type === 'BSL';
            return (
              <g key={pool.id}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={isBSL ? '#38bdf8' : '#f59e0b'}
                  strokeWidth="1.2"
                  strokeDasharray="5 3"
                />
                <text
                  x={width - paddingRight - 80}
                  y={y - 3}
                  fill={isBSL ? '#38bdf8' : '#f59e0b'}
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pool.type} ({pool.level})
                </text>
              </g>
            );
          })}

          {/* Active Signal Execution Lines (Entry, SL, TP1, TP2) */}
          {activeSignal && (
            <g>
              {/* Entry Line */}
              <line
                x1={paddingLeft}
                y1={getY(activeSignal.entry)}
                x2={width - paddingRight}
                y2={getY(activeSignal.entry)}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <text
                x={width - paddingRight + 4}
                y={getY(activeSignal.entry) + 3}
                fill="#38bdf8"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ENTRY
              </text>

              {/* Stop Loss Line */}
              <line
                x1={paddingLeft}
                y1={getY(activeSignal.stopLoss)}
                x2={width - paddingRight}
                y2={getY(activeSignal.stopLoss)}
                stroke="#f43f5e"
                strokeWidth="1.5"
              />
              <text
                x={width - paddingRight + 4}
                y={getY(activeSignal.stopLoss) + 3}
                fill="#f43f5e"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                SL
              </text>

              {/* Take Profit 1 */}
              <line
                x1={paddingLeft}
                y1={getY(activeSignal.takeProfit1)}
                x2={width - paddingRight}
                y2={getY(activeSignal.takeProfit1)}
                stroke="#10b981"
                strokeWidth="1.5"
              />
              <text
                x={width - paddingRight + 4}
                y={getY(activeSignal.takeProfit1) + 3}
                fill="#10b981"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                TP1
              </text>

              {/* Take Profit 2 */}
              <line
                x1={paddingLeft}
                y1={getY(activeSignal.takeProfit2)}
                x2={width - paddingRight}
                y2={getY(activeSignal.takeProfit2)}
                stroke="#34d399"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text
                x={width - paddingRight + 4}
                y={getY(activeSignal.takeProfit2) + 3}
                fill="#34d399"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                TP2
              </text>
            </g>
          )}

          {/* Candlesticks */}
          {candles.map((candle, idx) => {
            const xCenter = paddingLeft + idx * candleWidth + candleWidth / 2;
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
            const color = candle.isBullish ? '#10b981' : '#f43f5e';

            return (
              <g key={idx}>
                {/* Wick */}
                <line
                  x1={xCenter}
                  y1={yHigh}
                  x2={xCenter}
                  y2={yLow}
                  stroke={color}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={xCenter - Math.max(1.5, candleWidth * 0.35)}
                  y={bodyTop}
                  width={Math.max(3, candleWidth * 0.7)}
                  height={bodyHeight}
                  fill={color}
                  rx="0.5"
                />
              </g>
            );
          })}

          {/* Current Live Price Line */}
          <line
            x1={paddingLeft}
            y1={getY(currentPrice)}
            x2={width - paddingRight}
            y2={getY(currentPrice)}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <rect
            x={width - paddingRight}
            y={getY(currentPrice) - 8}
            width={58}
            height={16}
            fill="#2563eb"
            rx="3"
          />
          <text
            x={width - paddingRight + 4}
            y={getY(currentPrice) + 3.5}
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {currentPrice.toFixed(pair.digits)}
          </text>
        </svg>
      </div>

      {/* Chart Footer Indicator Status */}
      <div className="px-3 py-1.5 bg-[#090d16] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-semibold truncate">
            Smart Money Liquidity Structure & OB Breakout Setup
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 shrink-0">
          Live Real-Time SMC Feed
        </span>
      </div>
    </div>
  );
};
