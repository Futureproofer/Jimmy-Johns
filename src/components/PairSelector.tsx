import React, { useState, useRef, useEffect } from 'react';
import { CurrencyPair, AssetCategory } from '../types/trading';
import { createCustomCurrencyPair } from '../data/assets';
import { ChevronDown, Search, Check, Flame, Plus, Bell, Sparkles } from 'lucide-react';

interface PairSelectorProps {
  selectedPair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
  activePairsIds: string[];
  allPairs: CurrencyPair[];
  onAddCustomPair: (pair: CurrencyPair) => void;
}

export const PairSelector: React.FC<PairSelectorProps> = ({
  selectedPair,
  onSelectPair,
  activePairsIds,
  allPairs,
  onAddCustomPair,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const normalizedSearch = search.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredPairs = allPairs.filter((pair) => {
    const pairNormSymbol = pair.symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matchesSearch =
      pairNormSymbol.includes(normalizedSearch) ||
      pair.symbol.toLowerCase().includes(search.toLowerCase()) ||
      pair.displayName.toLowerCase().includes(search.toLowerCase()) ||
      pair.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pair.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle adding custom pair from search input
  const handleAddSearchAsCustomPair = () => {
    if (!search.trim()) return;
    const newPair = createCustomCurrencyPair(search.trim());
    onAddCustomPair(newPair);
    onSelectPair(newPair);
    setSearch('');
    setIsOpen(false);
  };

  // Popular quick-switch chips for 1-tap mobile selection
  const popularSymbols = ['GBP/USD', 'EUR/USD', 'XAU/USD', 'USOIL', 'NZD/USD', 'EUR/CAD', 'NZD/CAD', 'USD/JPY'];
  const popularPairs = allPairs.filter((p) => popularSymbols.includes(p.symbol));

  return (
    <div className="w-full flex flex-col gap-2" ref={dropdownRef}>
      
      {/* Top Row: Dropdown Trigger & Popular Quick Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        
        {/* Main Dropdown Trigger Button */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full min-h-[48px] px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#131d34] border border-slate-700/80 flex items-center justify-between text-left transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {selectedPair.category === 'commodity' ? '🪙' : selectedPair.category === 'crypto' ? '₿' : '💱'}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight truncate">
                    {selectedPair.symbol}
                  </span>
                  {activePairsIds.includes(selectedPair.id) && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Alerts Active" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {selectedPair.displayName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-200">
                  {selectedPair.basePrice.toFixed(selectedPair.digits)}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Spread {selectedPair.spreadPips} p
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown Menu Modal / Sheet */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
              
              {/* Search & Custom Pair Input Header */}
              <div className="p-2.5 bg-[#0b1120] border-b border-slate-800 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search or type any pair (e.g. EURCAD, NZDCAD, US30)..."
                    className="w-full pl-8 pr-20 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && search.trim()) {
                        handleAddSearchAsCustomPair();
                      }
                    }}
                  />
                  {search.trim().length > 1 && (
                    <button
                      onClick={handleAddSearchAsCustomPair}
                      className="absolute right-1.5 top-1.5 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                  {(['all', 'forex', 'commodity', 'crypto'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat === 'all' ? `All Assets (${allPairs.length})` : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant "Add Custom Pair" Action Row if searching */}
              {search.trim().length > 2 && !allPairs.some((p) => p.symbol.toLowerCase() === search.trim().toLowerCase()) && (
                <div className="p-2 bg-emerald-950/30 border-b border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Want to scan <strong>{search.toUpperCase()}</strong>?</span>
                  </div>
                  <button
                    onClick={handleAddSearchAsCustomPair}
                    className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add {search.toUpperCase()}</span>
                  </button>
                </div>
              )}

              {/* Pairs List */}
              <div className="max-h-[280px] sm:max-h-[340px] overflow-y-auto divide-y divide-slate-800/60 p-1">
                {filteredPairs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                    <p>No asset matching &ldquo;{search}&rdquo; in defaults.</p>
                    <button
                      onClick={handleAddSearchAsCustomPair}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add &ldquo;{search.toUpperCase()}&rdquo; to terminal</span>
                    </button>
                  </div>
                ) : (
                  filteredPairs.map((pair) => {
                    const isSelected = pair.id === selectedPair.id;
                    const hasAlert = activePairsIds.includes(pair.id);

                    return (
                      <button
                        key={pair.id}
                        onClick={() => {
                          onSelectPair(pair);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={`w-full min-h-[44px] px-3 py-2 rounded-lg flex items-center justify-between text-left transition-colors ${
                          isSelected
                            ? 'bg-emerald-950/40 border border-emerald-500/30 text-white'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm font-bold text-white tracking-wide">
                            {pair.symbol}
                          </span>
                          <span className="text-xs text-slate-400 truncate">
                            {pair.displayName.replace(`${pair.symbol} `, '')}
                          </span>
                          {hasAlert && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              <Bell className="w-2.5 h-2.5" /> ON
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 ml-2">
                          <span className="font-mono text-xs font-semibold text-slate-200">
                            {pair.basePrice.toFixed(pair.digits)}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

            </div>
          )}
        </div>

        {/* Quick-Switch Chips Carousel (Mobile-friendly horizontal scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {popularPairs.map((p) => {
            const isSelected = p.id === selectedPair.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPair(p)}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
                }`}
              >
                <span>{p.symbol}</span>
                {activePairsIds.includes(p.id) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                )}
              </button>
            );
          })}

          {/* Quick "+ Add Pair" chip */}
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300"
            title="Search or add any pair"
          >
            <Plus className="w-3 h-3" />
            <span>Search &amp; Add</span>
          </button>
        </div>

      </div>

    </div>
  );
};
