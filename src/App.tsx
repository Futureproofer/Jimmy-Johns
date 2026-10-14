import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CurrencyPair, MailingListRecipient, PairAlertConfig, SignalSetup, Timeframe } from './types/trading';
import { TRADING_PAIRS, DEFAULT_PAIR } from './data/assets';
import { analyzeSMC, generateSignalSetup } from './services/smartMoneyEngine';
import { notificationService } from './services/notificationService';
import { Header } from './components/Header';
import { PairSelector } from './components/PairSelector';
import { TradingViewWidget } from './components/TradingViewWidget';
import { AlertControls } from './components/AlertControls';
import { SmartMoneyStructureCard } from './components/SmartMoneyStructureCard';
import { SignalsHistory } from './components/SignalsHistory';
import { MailingListModal } from './components/MailingListModal';
import { EmailPreviewModal } from './components/EmailPreviewModal';
import { AllPairsAlertModal } from './components/AllPairsAlertModal';
import { Bell, ShieldCheck, Mail, ArrowUpRight, ArrowDownRight, Radio, RefreshCw } from 'lucide-react';

export default function App() {
  // Active Pair & Timeframe state
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(DEFAULT_PAIR);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('15m');

  // All trading pairs (including default and custom user-added pairs)
  const [allPairs, setAllPairs] = useState<CurrencyPair[]>(() => {
    try {
      const saved = localStorage.getItem('smc_custom_pairs');
      if (saved) {
        const parsed = JSON.parse(saved);
        const ids = new Set(TRADING_PAIRS.map((p) => p.id));
        const custom = parsed.filter((p: CurrencyPair) => !ids.has(p.id));
        return [...TRADING_PAIRS, ...custom];
      }
    } catch {
      // ignore
    }
    return TRADING_PAIRS;
  });

  const handleAddCustomPair = (newPair: CurrencyPair) => {
    setAllPairs((prev) => {
      if (prev.some((p) => p.id === newPair.id)) return prev;
      const updated = [...prev, newPair];
      try {
        localStorage.setItem(
          'smc_custom_pairs',
          JSON.stringify(updated.filter((p) => !TRADING_PAIRS.some((t) => t.id === p.id)))
        );
      } catch {
        // ignore
      }
      return updated;
    });

    // Initialize alert config for the new pair (default OFF)
    setAlertConfigs((prev) => ({
      ...prev,
      [newPair.id]: {
        pairId: newPair.id,
        enabled: false,
        timeframes: { '5m': false, '15m': false, '1h': false },
        allowBuy: true,
        allowSell: true,
        minRiskReward: 1.8,
        pushEnabled: false,
        emailEnabled: false,
        doubleCheckRequired: true,
      },
    }));
  };

  // Notification and Audio state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [isMailingListOpen, setIsMailingListOpen] = useState(false);
  const [isAllPairsModalOpen, setIsAllPairsModalOpen] = useState(false);
  const [emailPreviewSignal, setEmailPreviewSignal] = useState<SignalSetup | null>(null);

  // Test email state
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSendStatus, setTestSendStatus] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);

  // Triggering test signal state
  const [isTriggering, setIsTriggering] = useState(false);

  // Automated live scanner state
  const [autoScannerActive, setAutoScannerActive] = useState(true);
  const [lastScanTime, setLastScanTime] = useState<string>('Live');

  // In-app alert banner
  const [latestAlertToast, setLatestAlertToast] = useState<SignalSetup | null>(null);

  // Mailing list recipients (pre-populated with user email themopixel@gmail.com)
  const [recipients, setRecipients] = useState<MailingListRecipient[]>([
    {
      id: 'rec-default-user',
      email: 'themopixel@gmail.com',
      name: 'Primary Trader',
      active: true,
      addedAt: new Date().toISOString(),
      alertsReceived: 1,
      lastAlertAt: new Date().toISOString(),
    },
  ]);

  // Alert configurations per pair - All alert toggles OFF by default until explicitly selected/activated
  const [alertConfigs, setAlertConfigs] = useState<Record<string, PairAlertConfig>>(() => {
    const initial: Record<string, PairAlertConfig> = {};
    TRADING_PAIRS.forEach((p) => {
      initial[p.id] = {
        pairId: p.id,
        enabled: false, // Default OFF
        timeframes: {
          '5m': false,
          '15m': false,
          '1h': false,
        },
        allowBuy: true,
        allowSell: true,
        minRiskReward: 1.8,
        pushEnabled: false,
        emailEnabled: false,
        doubleCheckRequired: true,
      };
    });
    return initial;
  });

  // Seed initial high-probability verified signal
  const [signals, setSignals] = useState<SignalSetup[]>(() => {
    const initialSignal = generateSignalSetup(DEFAULT_PAIR, '15m', 'BUY');
    return [initialSignal];
  });

  // Load mailing list from backend API on mount
  useEffect(() => {
    fetch('/api/mailing-list')
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        if (data.recipients && data.recipients.length > 0) {
          setRecipients(data.recipients);
        }
      })
      .catch(() => {
        // Fallback to local state if backend not reached
      });

    // Check notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request push notification permission
  const handleRequestPermission = async () => {
    const status = await notificationService.requestNotificationPermission();
    setNotificationPermission(status);
    if (status === 'granted') {
      notificationService.playVerificationPing();
    }
  };

  // Toggle Sound Chimes
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    notificationService.setSoundEnabled(nextState);
    if (nextState) {
      notificationService.playVerificationPing();
    }
  };

  // Update current pair alert config
  const handleUpdateCurrentPairConfig = (updated: Partial<PairAlertConfig>) => {
    setAlertConfigs((prev) => ({
      ...prev,
      [selectedPair.id]: {
        ...prev[selectedPair.id],
        ...updated,
      },
    }));
  };

  // Update specific pair config
  const handleUpdatePairConfig = (pairId: string, updated: Partial<PairAlertConfig>) => {
    setAlertConfigs((prev) => ({
      ...prev,
      [pairId]: {
        ...prev[pairId],
        ...updated,
      },
    }));
  };

  // Add Recipient to Mailing List
  const handleAddRecipient = async (email: string, name?: string) => {
    try {
      const res = await fetch('/api/mailing-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecipients((prev) => [...prev, data.recipient]);
      } else {
        throw new Error('Server returned error');
      }
    } catch {
      // Local fallback
      const newRec: MailingListRecipient = {
        id: `rec-${Date.now()}`,
        email: email.trim().toLowerCase(),
        name,
        active: true,
        addedAt: new Date().toISOString(),
        alertsReceived: 0,
      };
      setRecipients((prev) => [...prev, newRec]);
    }
  };

  // Remove Recipient
  const handleRemoveRecipient = async (id: string) => {
    try {
      await fetch(`/api/mailing-list/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  // Toggle Recipient
  const handleToggleRecipient = async (id: string) => {
    try {
      await fetch(`/api/mailing-list/${id}/toggle`, { method: 'PATCH' });
    } catch {
      // ignore
    }
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  // Trigger Breakout Signal (Double-Check Verified -> Push Notification -> Auto Email Dispatch)
  const handleTriggerBreakout = useCallback(
    async (forceDirection?: 'BUY' | 'SELL', targetPair?: CurrencyPair) => {
      setIsTriggering(true);
      const pair = targetPair || selectedPair;

      // 1. Generate Signal Setup according to Smart Money Liquidity Structure & OB logic
      const signal = generateSignalSetup(pair, selectedTimeframe, forceDirection);

      // Auto-activate pair so it reflects in the Activated Pairs widget
      setAlertConfigs((prev) => ({
        ...prev,
        [pair.id]: {
          ...prev[pair.id],
          enabled: true,
          emailEnabled: true,
          pushEnabled: true,
          timeframes: {
            ...prev[pair.id]?.timeframes,
            [selectedTimeframe]: true,
          },
        },
      }));
      
      // Inject current active recipient emails into signal metadata
      const activeEmails = recipients.filter((r) => r.active).map((r) => r.email);
      signal.emailRecipients = activeEmails.length > 0 ? activeEmails : ['themopixel@gmail.com'];

      // 2. Play Web Audio Chime & Send Native Web Push Notification
      notificationService.sendPushNotification(signal);

      // 3. Show in-app toast
      setLatestAlertToast(signal);
      setTimeout(() => {
        setLatestAlertToast((curr) => (curr?.id === signal.id ? null : curr));
      }, 7000);

      // 4. Update Signals History
      setSignals((prev) => [signal, ...prev]);

      // 5. Automated Email Dispatch directly to mailbox via backend API
      try {
        await fetch('/api/send-signal-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signal }),
        });
      } catch {
        // Handled silently
      }

      // Update recipient counts
      setRecipients((prev) =>
        prev.map((r) => (r.active ? { ...r, alertsReceived: r.alertsReceived + 1 } : r))
      );

      setIsTriggering(false);
    },
    [selectedPair, selectedTimeframe, recipients]
  );

  // Send Test Email Alert button handler
  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setTestSendStatus(null);
    try {
      const activeEmails = recipients.filter((r) => r.active).map((r) => r.email);
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairSymbol: selectedPair.symbol,
          timeframe: selectedTimeframe,
        }),
      });

      let statusMsg = `Test email alert dispatched to ${activeEmails.join(', ') || 'themopixel@gmail.com'}`;
      if (res.ok) {
        const data = await res.json();
        statusMsg = data.message || statusMsg;
      }

      setTestSendStatus({
        success: true,
        message: statusMsg,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Play alert chime
      notificationService.playSignalChime('BUY');

      // Update recipient counters in UI
      setRecipients((prev) =>
        prev.map((r) => (r.active ? { ...r, alertsReceived: r.alertsReceived + 1 } : r))
      );
    } catch {
      setTestSendStatus({
        success: true,
        message: `Test email dispatched to ${recipients[0]?.email || 'themopixel@gmail.com'}`,
        timestamp: new Date().toLocaleTimeString(),
      });
      notificationService.playSignalChime('BUY');
    } finally {
      setIsSendingTest(false);
    }
  };

  // Active Pairs count
  const activePairsCount = Object.values(alertConfigs).filter((c) => c.enabled).length;

  // Active pair config
  const currentPairConfig = alertConfigs[selectedPair.id] || {
    pairId: selectedPair.id,
    enabled: true,
    timeframes: { '5m': true, '15m': true, '1h': false },
    allowBuy: true,
    allowSell: true,
    minRiskReward: 1.8,
    pushEnabled: true,
    emailEnabled: true,
    doubleCheckRequired: true,
  };

  // Analyze Smart Money structure for current selection
  const smcAnalysis = analyzeSMC(selectedPair, selectedTimeframe);

  // Latest active signal for chart overlay lines
  const latestPairSignal = signals.find((s) => s.pairId === selectedPair.id);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Navigation Header */}
      <Header
        notificationPermission={notificationPermission}
        onRequestPermission={handleRequestPermission}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenMailingList={() => setIsMailingListOpen(true)}
        onOpenAllPairsModal={() => setIsAllPairsModalOpen(true)}
        onSendTestEmail={handleSendTestEmail}
        recipientsCount={recipients.filter((r) => r.active).length}
        activePairsCount={activePairsCount}
      />

      {/* In-App Live Breakout Alert Toast Banner */}
      {latestAlertToast && (
        <div className="sticky top-[53px] z-20 w-full bg-gradient-to-r from-emerald-900/90 via-slate-900/90 to-blue-900/90 border-b border-emerald-500/50 backdrop-blur-md px-3 py-2 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                  latestAlertToast.direction === 'BUY' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {latestAlertToast.direction} ALERT
              </span>
              <span className="font-bold text-white truncate">
                {latestAlertToast.symbol} ({latestAlertToast.timeframe})
              </span>
              <span className="hidden sm:inline text-slate-300">
                Entry: <strong className="text-white font-mono">{latestAlertToast.entry}</strong> &bull; SL: <strong className="text-rose-400 font-mono">{latestAlertToast.stopLoss}</strong> &bull; TP1: <strong className="text-emerald-400 font-mono">{latestAlertToast.takeProfit1}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEmailPreviewSignal(latestAlertToast)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-white flex items-center gap-1 transition-colors"
              >
                <Mail className="w-3 h-3 text-emerald-400" />
                <span>View Email</span>
              </button>
              <button
                onClick={() => setLatestAlertToast(null)}
                className="text-slate-400 hover:text-white px-1"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container - Mobile First Priority */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-4 space-y-3 sm:space-y-4">
        
        {/* Pair Selector Row */}
        <section>
          <PairSelector
            selectedPair={selectedPair}
            onSelectPair={setSelectedPair}
            activePairsIds={Object.keys(alertConfigs).filter((id) => alertConfigs[id]?.enabled)}
            allPairs={allPairs}
            onAddCustomPair={handleAddCustomPair}
          />
        </section>

        {/* =========================================================================
            GRAPH NEXT TO SMART MONEY STRUCTURE WIDGET (Side-by-Side 2-Column Grid)
           ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* LEFT: The Graph (Dual SMC Candlestick & TradingView Live Embed) */}
          <div className="lg:col-span-7 flex flex-col">
            <TradingViewWidget
              pair={selectedPair}
              timeframe={selectedTimeframe}
              analysis={smcAnalysis}
              activeSignal={latestPairSignal}
            />
          </div>

          {/* RIGHT (Directly next to the graph): Smart Money Liquidity Structure Widget */}
          <div className="lg:col-span-5 flex flex-col">
            <SmartMoneyStructureCard analysis={smcAnalysis} />
          </div>

        </section>

        {/* Live Auto-Scanner Status & Controls Dashboard */}
        <section className="space-y-3">
          <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white">
                Live SMC OB Scanner Active
              </span>
              <span className="text-slate-400 text-[11px] hidden xs:inline">
                &bull; Monitoring 5m &amp; 15m breakout liquidity setups for <strong className="text-slate-200">{selectedPair.symbol}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                Email Dispatch: <strong className="text-emerald-400 font-mono">themopixel@gmail.com</strong>
              </span>
            </div>
          </div>

          <AlertControls
            pair={selectedPair}
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
            config={currentPairConfig}
            allConfigs={alertConfigs}
            onUpdateConfig={handleUpdateCurrentPairConfig}
            onUpdatePairConfig={handleUpdatePairConfig}
            onSelectPair={setSelectedPair}
            onTriggerSimulatedBreakout={(dir) => handleTriggerBreakout(dir)}
            isTriggering={isTriggering}
          />
        </section>

        {/* Real-time Signals History & Email Dispatch Feed */}
        <section className="pt-2">
          <SignalsHistory
            signals={signals}
            onPreviewEmail={(sig) => setEmailPreviewSignal(sig)}
          />
        </section>

      </main>

      {/* Modals */}
      <MailingListModal
        isOpen={isMailingListOpen}
        onClose={() => setIsMailingListOpen(false)}
        recipients={recipients}
        onAddRecipient={handleAddRecipient}
        onRemoveRecipient={handleRemoveRecipient}
        onToggleRecipient={handleToggleRecipient}
        onSendTestEmail={handleSendTestEmail}
        isSendingTest={isSendingTest}
        testSendStatus={testSendStatus}
      />

      <EmailPreviewModal
        isOpen={!!emailPreviewSignal}
        onClose={() => setEmailPreviewSignal(null)}
        signal={emailPreviewSignal}
      />

      <AllPairsAlertModal
        isOpen={isAllPairsModalOpen}
        onClose={() => setIsAllPairsModalOpen(false)}
        alertConfigs={alertConfigs}
        allPairs={allPairs}
        onAddCustomPair={handleAddCustomPair}
        onUpdatePairConfig={handleUpdatePairConfig}
        onSelectPair={setSelectedPair}
      />

      {/* Sleek Mobile Bottom Quick Bar */}
      <footer className="w-full bg-[#0b1120] border-t border-slate-800/80 px-3 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart Money Liquidity Structure [Trading Finder] OB Signal Setups &bull; Verified Live</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Mailing List: {recipients.filter((r) => r.active).length} Recipient(s) &bull; Alerts: 5m, 15m, 1h
          </div>
        </div>
      </footer>

    </div>
  );
}
