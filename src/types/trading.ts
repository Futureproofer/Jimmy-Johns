export type Timeframe = '5m' | '15m' | '1h';

export type AssetCategory = 'forex' | 'commodity' | 'crypto';

export interface CurrencyPair {
  id: string;
  symbol: string;
  displayName: string;
  tvSymbol: string;
  category: AssetCategory;
  basePrice: number;
  pipSize: number;
  digits: number;
  spreadPips: number;
  description: string;
}

export interface PairAlertConfig {
  pairId: string;
  enabled: boolean;
  timeframes: {
    '5m': boolean;
    '15m': boolean;
    '1h': boolean;
  };
  allowBuy: boolean;
  allowSell: boolean;
  minRiskReward: number;
  pushEnabled: boolean;
  emailEnabled: boolean;
  doubleCheckRequired: boolean;
}

export type StructureType = 'BOS_BULLISH' | 'BOS_BEARISH' | 'CHOCH_BULLISH' | 'CHOCH_BEARISH' | 'RANGING';

export interface OrderBlock {
  id: string;
  type: 'BULLISH' | 'BEARISH';
  high: number;
  low: number;
  timeframe: Timeframe;
  createdAt: string;
  mitigated: boolean;
  mitigationPercent: number;
  strengthScore: number; // 0-100
}

export interface LiquidityPool {
  id: string;
  type: 'BSL' | 'SSL'; // Buy-Side Liquidity vs Sell-Side Liquidity
  level: number;
  label: string;
  swept: boolean;
  sweptAt?: string;
  sweepPrice?: number;
}

export interface DoubleCheckReport {
  verified: boolean;
  timestamp: string;
  liveBid: number;
  liveAsk: number;
  spreadPips: number;
  candleConfirmationCount: number;
  orderBlockIntegrityScore: number; // 0-100
  latencyMs: number;
  verificationSource: string;
  checks: {
    liveQuoteInRange: boolean;
    candleClosedBeyondTrigger: boolean;
    spreadWithinTolerance: boolean;
    orderBlockUnmitigated: boolean;
    riskRewardCompliant: boolean;
  };
}

export interface SignalSetup {
  id: string;
  pairId: string;
  symbol: string;
  displayName: string;
  tvSymbol: string;
  timeframe: Timeframe;
  direction: 'BUY' | 'SELL';
  triggerType: 'BULLISH_OB_BREAKOUT' | 'BEARISH_OB_BREAKDOWN';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskReward: number;
  pipsRisk: number;
  pipsReward1: number;
  pipsReward2: number;
  orderBlock: OrderBlock;
  liquiditySwept: string;
  structure: StructureType;
  doubleCheck: DoubleCheckReport;
  timestamp: string;
  pushSent: boolean;
  emailSent: boolean;
  emailRecipients: string[];
}

export interface MailingListRecipient {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  addedAt: string;
  alertsReceived: number;
  lastAlertAt?: string;
}

export interface MarketTicker {
  pairId: string;
  price: number;
  bid: number;
  ask: number;
  change24h: number;
  high24h: number;
  low24h: number;
  lastUpdated: string;
}
