'use client';

import React, { useState } from 'react';
import { X, Zap, Check, Lock } from 'lucide-react';
import { PLANS, formatXAF, type PlanId } from '@/lib/premiumConfig';
import { usePremium } from '@/contexts/PremiumContext';

interface Props {
  featureName: string;
  featureNameFr?: string;
  requiredPlan?: PlanId;
  onClose: () => void;
}

export default function UpgradeModal({ featureName, featureNameFr, requiredPlan = 'starter', onClose }: Props) {
  const { simulatePlan } = usePremium();
  const [simulated, setSimulated] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const targetPlan = PLANS.find(p => p.id === requiredPlan) ?? PLANS[1];
  const price = billing === 'monthly' ? targetPlan.priceMonthly : targetPlan.priceYearly;

  function handleSimulate() {
    simulatePlan(requiredPlan);
    setSimulated(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-zinc-950 to-zinc-800 px-6 py-8 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 transition-all">
            <X size={15}/>
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
            <Lock size={20} className="text-white"/>
          </div>
          <h2 className="text-lg font-black">Premium Feature</h2>
          <p className="text-sm text-zinc-400 mt-1">
            <span className="text-white font-semibold">{featureName}</span>
            {featureNameFr && <span className="text-zinc-500"> / {featureNameFr}</span>}
            {' '}requires the <span className="text-blue-400 font-semibold capitalize">{targetPlan.nameEn}</span> plan.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Billing toggle */}
          <div className="flex items-center gap-2 bg-zinc-50 rounded-xl p-1">
            {(['monthly','yearly'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${billing===b?'bg-white shadow-sm text-zinc-900':'text-zinc-500'}`}>
                {b === 'monthly' ? 'Monthly / Mensuel' : 'Yearly – Save 25% / Annuel'}
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="text-center">
            <span className="text-4xl font-black text-zinc-900">{formatXAF(price)}</span>
            <span className="text-zinc-400 text-sm ml-1">/ month</span>
            {billing === 'yearly' && <p className="text-xs text-emerald-600 mt-1">Billed annually — save 25%</p>}
          </div>

          {/* Key features */}
          <div className="space-y-2">
            {targetPlan.featuresEn.slice(1, 6).map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                <Check size={13} className="text-emerald-500 shrink-0 mt-0.5"/>{f}
              </div>
            ))}
          </div>

          {/* Simulation notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            <p className="font-semibold mb-0.5">🚧 Payment integration coming soon</p>
            <p>We are integrating local payment options (MTN MoMo, Orange Money, bank transfer). Use the simulation button below to test premium features now.</p>
          </div>

          <div className="flex gap-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition-all">
              Later / Plus tard
            </button>
            <button onClick={handleSimulate} disabled={simulated}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-60">
              {simulated ? <><Check size={14}/>Activated!</> : <><Zap size={14}/>Try Premium (Simulation)</>}
            </button>
          </div>

          <p className="text-center text-[10px] text-zinc-400">
            Simulation resets on page refresh · No charge applied
          </p>
        </div>
      </div>
    </div>
  );
}
