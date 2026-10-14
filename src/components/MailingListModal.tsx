import React, { useState, useEffect } from 'react';
import { MailingListRecipient } from '../types/trading';
import { X, Mail, Plus, Trash2, CheckCircle2, ShieldCheck, Send, AlertCircle, RefreshCw, Key, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface MailingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: MailingListRecipient[];
  onAddRecipient: (email: string, name?: string) => Promise<void>;
  onRemoveRecipient: (id: string) => Promise<void>;
  onToggleRecipient: (id: string) => Promise<void>;
  onSendTestEmail: () => Promise<void>;
  isSendingTest: boolean;
  testSendStatus: { success: boolean; message: string; timestamp: string } | null;
}

interface EmailConfigStatus {
  configured: boolean;
  provider: 'resend' | 'gmail' | 'smtp' | 'simulated';
  details: string;
}

export const MailingListModal: React.FC<MailingListModalProps> = ({
  isOpen,
  onClose,
  recipients,
  onAddRecipient,
  onRemoveRecipient,
  onToggleRecipient,
  onSendTestEmail,
  isSendingTest,
  testSendStatus,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showSecretsGuide, setShowSecretsGuide] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailConfigStatus | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/email-status')
        .then((res) => res.json())
        .then((data) => setEmailStatus(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newEmail || !newEmail.includes('@') || !newEmail.includes('.')) {
      setError('Please provide a valid email address');
      return;
    }
    try {
      setIsAdding(true);
      await onAddRecipient(newEmail, newName);
      setNewEmail('');
      setNewName('');
    } catch (err: any) {
      setError(err.message || 'Failed to add recipient');
    } finally {
      setIsAdding(false);
    }
  };

  const activeCount = recipients.filter((r) => r.active).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Alert Mailing List & Email Delivery
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct Buy & Sell signals dispatched to your inbox
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

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* Email Delivery Provider Status */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    emailStatus?.configured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span className="text-xs font-bold text-white">
                  Email Dispatch Status:{' '}
                  <span className="font-mono text-emerald-400">
                    {emailStatus?.configured ? `${emailStatus.provider.toUpperCase()} ACTIVE` : 'READY (SECRETS HELPER)'}
                  </span>
                </span>
              </div>

              <button
                onClick={() => setShowSecretsGuide(!showSecretsGuide)}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                <span>Configure Secrets</span>
                {showSecretsGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {emailStatus?.details || 'Configuring live email relay for alerts...'}
            </p>

            {/* Collapsible Secrets Configuration Guide */}
            {showSecretsGuide && (
              <div className="mt-2.5 p-3 rounded-lg bg-[#0b1120] border border-slate-800 text-[11px] text-slate-300 space-y-2 animate-in fade-in duration-150">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>How to connect your inbox (Choose 1 Option):</span>
                </div>

                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-emerald-300">Option 1: Resend (Fastest & Free)</strong>
                    <div className="text-slate-400 mt-0.5">
                      1. Get free API key from <span className="text-blue-400">resend.com</span>
                    </div>
                    <div className="text-slate-400">
                      2. In AI Studio Secrets panel, add: <code className="text-white">RESEND_API_KEY</code>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-blue-300">Option 2: Gmail with App Password</strong>
                    <div className="text-slate-400 mt-0.5">
                      1. In your Google Account &rarr; Security &rarr; 2-Step Verification &rarr; App passwords
                    </div>
                    <div className="text-slate-400">
                      2. Add secrets: <code className="text-white">GMAIL_USER</code> (<code className="text-slate-300">themopixel@gmail.com</code>) &amp; <code className="text-white">GMAIL_APP_PASS</code>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-slate-300">Option 3: Custom SMTP</strong>
                    <div className="text-slate-400 mt-0.5">
                      Add secrets: <code className="text-white">SMTP_HOST</code>, <code className="text-white">SMTP_USER</code>, <code className="text-white">SMTP_PASS</code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Test Email Button & Status Callout */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Verify Alert Delivery
                </span>
                <span className="text-[11px] text-slate-400">
                  Sends full breakout setup sample with live double-check proof
                </span>
              </div>

              <button
                onClick={onSendTestEmail}
                disabled={isSendingTest || activeCount === 0}
                className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>
            </div>

            {testSendStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                  testSendStatus.success
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                }`}
              >
                {testSendStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">{testSendStatus.message}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Timestamp: {testSendStatus.timestamp}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Recipient Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Add Recipient Email
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@example.com"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name (optional)"
                className="w-full sm:w-32 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isAdding}
                className="min-h-[40px] px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {error && <p className="text-[11px] text-rose-400">{error}</p>}
          </form>

          {/* Current Subscribers List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subscribed Recipients ({activeCount} Active)</span>
              <span className="text-[10px]">Instant HTML Delivery</span>
            </div>

            <div className="divide-y divide-slate-800 rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              {recipients.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        rec.active ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                    <div className="truncate">
                      <div className="font-semibold text-white truncate flex items-center gap-1.5">
                        <span>{rec.email}</span>
                        {rec.email === 'themopixel@gmail.com' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 font-mono">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rec.alertsReceived} alerts delivered
                        {rec.name ? ` · ${rec.name}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleRecipient(rec.id)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                        rec.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {rec.active ? 'Active' : 'Paused'}
                    </button>

                    {rec.email !== 'themopixel@gmail.com' && (
                      <button
                        onClick={() => onRemoveRecipient(rec.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                        title="Remove recipient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0b1120] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Double-checked live confirmation on all signals
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
