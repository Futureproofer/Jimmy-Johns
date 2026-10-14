import { CurrencyPair } from '../types/trading';

export const TRADING_PAIRS: CurrencyPair[] = [
  // Major Forex - GBP & EUR & USD
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    displayName: 'GBP/USD (British Pound)',
    tvSymbol: 'FX:GBPUSD',
    category: 'forex',
    basePrice: 1.3045,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 0.8,
    description: 'Major currency pair between the British Pound and US Dollar',
  },
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    displayName: 'EUR/USD (Euro)',
    tvSymbol: 'FX:EURUSD',
    category: 'forex',
    basePrice: 1.0872,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 0.6,
    description: 'World\'s most traded currency pair',
  },
  // Commodities - Gold & Oil & Silver
  {
    id: 'xauusd',
    symbol: 'XAU/USD',
    displayName: 'Gold (XAU/USD)',
    tvSymbol: 'OANDA:XAUUSD',
    category: 'commodity',
    basePrice: 2684.50,
    pipSize: 0.1,
    digits: 2,
    spreadPips: 2.2,
    description: 'Spot Gold priced in US Dollars',
  },
  {
    id: 'usoil',
    symbol: 'USOIL',
    displayName: 'Crude Oil (WTI)',
    tvSymbol: 'TVC:USOIL',
    category: 'commodity',
    basePrice: 71.85,
    pipSize: 0.01,
    digits: 2,
    spreadPips: 2.8,
    description: 'West Texas Intermediate Crude Oil spot price',
  },
  {
    id: 'xagusd',
    symbol: 'XAG/USD',
    displayName: 'Silver (XAG/USD)',
    tvSymbol: 'OANDA:XAGUSD',
    category: 'commodity',
    basePrice: 31.65,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 1.8,
    description: 'Spot Silver priced in US Dollars',
  },

  // USD & NZD & JPY & AUD Majors
  {
    id: 'nzdusd',
    symbol: 'NZD/USD',
    displayName: 'NZD/USD (Kiwi)',
    tvSymbol: 'FX:NZDUSD',
    category: 'forex',
    basePrice: 0.6085,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.1,
    description: 'New Zealand Dollar against US Dollar',
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    displayName: 'USD/JPY (Yen)',
    tvSymbol: 'FX:USDJPY',
    category: 'forex',
    basePrice: 149.35,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 0.7,
    description: 'US Dollar against Japanese Yen',
  },
  {
    id: 'audusd',
    symbol: 'AUD/USD',
    displayName: 'AUD/USD (Aussie)',
    tvSymbol: 'FX:AUDUSD',
    category: 'forex',
    basePrice: 0.6720,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 0.9,
    description: 'Australian Dollar against US Dollar',
  },
  {
    id: 'usdcad',
    symbol: 'USD/CAD',
    displayName: 'USD/CAD (Loonie)',
    tvSymbol: 'FX:USDCAD',
    category: 'forex',
    basePrice: 1.3780,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.0,
    description: 'US Dollar against Canadian Dollar',
  },
  {
    id: 'usdchf',
    symbol: 'USD/CHF',
    displayName: 'USD/CHF (Swissy)',
    tvSymbol: 'FX:USDCHF',
    category: 'forex',
    basePrice: 0.8625,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.0,
    description: 'US Dollar against Swiss Franc safe-haven',
  },

  // CAD Crosses requested (EUR/CAD, NZD/CAD, etc.)
  {
    id: 'eurcad',
    symbol: 'EUR/CAD',
    displayName: 'EUR/CAD (Euro/Canadian Dollar)',
    tvSymbol: 'FX:EURCAD',
    category: 'forex',
    basePrice: 1.4980,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.3,
    description: 'Euro against Canadian Dollar',
  },
  {
    id: 'nzdcad',
    symbol: 'NZD/CAD',
    displayName: 'NZD/CAD (Kiwi/Loonie)',
    tvSymbol: 'FX:NZDCAD',
    category: 'forex',
    basePrice: 0.8385,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.5,
    description: 'New Zealand Dollar against Canadian Dollar',
  },
  {
    id: 'gbpcad',
    symbol: 'GBP/CAD',
    displayName: 'GBP/CAD (Pound/Loonie)',
    tvSymbol: 'FX:GBPCAD',
    category: 'forex',
    basePrice: 1.7985,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.7,
    description: 'British Pound against Canadian Dollar',
  },
  {
    id: 'audcad',
    symbol: 'AUD/CAD',
    displayName: 'AUD/CAD (Aussie/Loonie)',
    tvSymbol: 'FX:AUDCAD',
    category: 'forex',
    basePrice: 0.9260,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.4,
    description: 'Australian Dollar against Canadian Dollar',
  },

  // EUR & GBP Crosses
  {
    id: 'eurgbp',
    symbol: 'EUR/GBP',
    displayName: 'EUR/GBP (Euro/Pound)',
    tvSymbol: 'FX:EURGBP',
    category: 'forex',
    basePrice: 0.8335,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 0.9,
    description: 'European Cross pair between Euro and British Pound',
  },
  {
    id: 'euraud',
    symbol: 'EUR/AUD',
    displayName: 'EUR/AUD (Euro/Aussie)',
    tvSymbol: 'FX:EURAUD',
    category: 'forex',
    basePrice: 1.6180,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.4,
    description: 'Euro against Australian Dollar',
  },
  {
    id: 'eurnzd',
    symbol: 'EUR/NZD',
    displayName: 'EUR/NZD (Euro/Kiwi)',
    tvSymbol: 'FX:EURNZD',
    category: 'forex',
    basePrice: 1.7865,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.8,
    description: 'Euro against New Zealand Dollar',
  },
  {
    id: 'eurjpy',
    symbol: 'EUR/JPY',
    displayName: 'EUR/JPY (Euro/Yen)',
    tvSymbol: 'FX:EURJPY',
    category: 'forex',
    basePrice: 162.30,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 1.1,
    description: 'Euro against Japanese Yen',
  },
  {
    id: 'gbpjpy',
    symbol: 'GBP/JPY',
    displayName: 'GBP/JPY (Guppy/Dragon)',
    tvSymbol: 'FX:GBPJPY',
    category: 'forex',
    basePrice: 194.80,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 1.4,
    description: 'High volatility cross between British Pound and Japanese Yen',
  },
  {
    id: 'gbpaud',
    symbol: 'GBP/AUD',
    displayName: 'GBP/AUD (Pound/Aussie)',
    tvSymbol: 'FX:GBPAUD',
    category: 'forex',
    basePrice: 1.9410,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.6,
    description: 'British Pound against Australian Dollar',
  },
  {
    id: 'gbpnzd',
    symbol: 'GBP/NZD',
    displayName: 'GBP/NZD (Pound/Kiwi)',
    tvSymbol: 'FX:GBPNZD',
    category: 'forex',
    basePrice: 2.1435,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 2.1,
    description: 'British Pound against New Zealand Dollar',
  },

  // NZD & AUD & JPY Crosses
  {
    id: 'audnzd',
    symbol: 'AUD/NZD',
    displayName: 'AUD/NZD (Aussie/Kiwi)',
    tvSymbol: 'FX:AUDNZD',
    category: 'forex',
    basePrice: 1.1045,
    pipSize: 0.0001,
    digits: 5,
    spreadPips: 1.4,
    description: 'Australasian cross pair',
  },
  {
    id: 'audjpy',
    symbol: 'AUD/JPY',
    displayName: 'AUD/JPY (Aussie/Yen)',
    tvSymbol: 'FX:AUDJPY',
    category: 'forex',
    basePrice: 100.35,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 1.2,
    description: 'Risk barometer cross currency',
  },
  {
    id: 'nzdjpy',
    symbol: 'NZD/JPY',
    displayName: 'NZD/JPY (Kiwi/Yen)',
    tvSymbol: 'FX:NZDJPY',
    category: 'forex',
    basePrice: 90.85,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 1.4,
    description: 'New Zealand Dollar against Japanese Yen',
  },
  {
    id: 'cadjpy',
    symbol: 'CAD/JPY',
    displayName: 'CAD/JPY (Loonie/Yen)',
    tvSymbol: 'FX:CADJPY',
    category: 'forex',
    basePrice: 108.40,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 1.3,
    description: 'Oil sensitive cross pair',
  },
  {
    id: 'chfjpy',
    symbol: 'CHF/JPY',
    displayName: 'CHF/JPY (Swissy/Yen)',
    tvSymbol: 'FX:CHFJPY',
    category: 'forex',
    basePrice: 173.15,
    pipSize: 0.01,
    digits: 3,
    spreadPips: 1.5,
    description: 'Cross between Swiss Franc and Japanese Yen',
  },

  // Crypto & Indices
  {
    id: 'btcusd',
    symbol: 'BTC/USD',
    displayName: 'Bitcoin (BTC/USD)',
    tvSymbol: 'BINANCE:BTCUSDT',
    category: 'crypto',
    basePrice: 67450.00,
    pipSize: 1.0,
    digits: 2,
    spreadPips: 5.0,
    description: 'Bitcoin / US Dollar high liquidity market',
  },
  {
    id: 'ethusd',
    symbol: 'ETH/USD',
    displayName: 'Ethereum (ETH/USD)',
    tvSymbol: 'BINANCE:ETHUSDT',
    category: 'crypto',
    basePrice: 2620.00,
    pipSize: 0.1,
    digits: 2,
    spreadPips: 1.8,
    description: 'Ethereum smart contract network asset',
  },
  {
    id: 'us30',
    symbol: 'US30',
    displayName: 'Dow Jones (US30)',
    tvSymbol: 'FOREXCOM:DJI',
    category: 'commodity',
    basePrice: 42980.00,
    pipSize: 1.0,
    digits: 2,
    spreadPips: 3.5,
    description: 'Wall Street 30 Major US Equity Index',
  },
  {
    id: 'nas100',
    symbol: 'NAS100',
    displayName: 'Nasdaq 100 (NAS100)',
    tvSymbol: 'FOREXCOM:NSXUSD',
    category: 'commodity',
    basePrice: 20250.00,
    pipSize: 1.0,
    digits: 2,
    spreadPips: 2.5,
    description: 'US Tech 100 Index',
  },
];

export const DEFAULT_PAIR = TRADING_PAIRS[0]; // GBP/USD

/**
 * Creates a valid CurrencyPair from user input symbol (e.g. "NZDCAD", "EUR/CAD", "SOLUSD")
 */
export function createCustomCurrencyPair(inputSymbol: string): CurrencyPair {
  const clean = inputSymbol.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const id = clean.toLowerCase();

  const isJpy = clean.includes('JPY');
  const isGold = clean.includes('XAU') || clean.includes('GOLD');
  const isOil = clean.includes('OIL') || clean.includes('WTI') || clean.includes('BRENT');
  const isCrypto = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX'].some((c) => clean.includes(c));
  const isIndex = ['US30', 'NAS100', 'SPX', 'GER40', 'UK100', 'DJI'].some((i) => clean.includes(i));

  let category: 'forex' | 'commodity' | 'crypto' = 'forex';
  let pipSize = 0.0001;
  let digits = 5;
  let basePrice = 1.25;
  let tvSymbol = `FX:${clean}`;
  let formattedSymbol = clean.length === 6 ? `${clean.substring(0, 3)}/${clean.substring(3)}` : clean;

  if (isGold) {
    category = 'commodity';
    pipSize = 0.1;
    digits = 2;
    basePrice = 2650.00;
    tvSymbol = `OANDA:${clean}`;
  } else if (isOil) {
    category = 'commodity';
    pipSize = 0.01;
    digits = 2;
    basePrice = 72.00;
    tvSymbol = `TVC:${clean}`;
  } else if (isCrypto) {
    category = 'crypto';
    pipSize = 1.0;
    digits = 2;
    basePrice = 150.00;
    tvSymbol = `BINANCE:${clean}USDT`;
  } else if (isIndex) {
    category = 'commodity';
    pipSize = 1.0;
    digits = 2;
    basePrice = 20000.00;
    tvSymbol = `FOREXCOM:${clean}`;
  } else if (isJpy) {
    pipSize = 0.01;
    digits = 3;
    basePrice = 150.00;
  }

  return {
    id,
    symbol: formattedSymbol,
    displayName: `${formattedSymbol} (Custom Pair)`,
    tvSymbol,
    category,
    basePrice,
    pipSize,
    digits,
    spreadPips: 1.2,
    description: `User-added asset ${formattedSymbol} for Smart Money Breakout Alerts`,
  };
}
