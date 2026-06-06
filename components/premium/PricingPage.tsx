'use client';

import React, { useState } from 'react';
import { Check, Zap, Star, Crown, Globe, Lock } from 'lucide-react';
import { PLANS, formatXAF, type PlanId } from '@/lib/premiumConfig';
import { usePremium } from '@/contexts/PremiumContext';

const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  free:    <Globe size={20} className="text-zinc-500"/>,
  starter: <Zap size={20} className="text-blue-600"/>,
  pro:     <Crown size={20} className="text-violet-600"/>,
};

const PLAN_HEADER_COLORS: Record<PlanId, string> = {
  free:    'border-zinc-200 bg-zinc-50',
  starter: 'border-blue-300 bg-blue-600',
  pro:     'border-violet-300 bg-violet-600',
};

export default function PricingPage() {
  const { plan: currentPlan, simulatePlan } = usePremium();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [simulated, setSimulated] = useState<PlanId | null>(null);

  function activate(planId: PlanId) {
    simulatePlan(planId);
    setSimulated(planId);
  }

  return (
    <div className="space-y-8 max-w-5xl ml-23">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
          <Zap size={12}/> Tailored for the African job market / Adapté au marché africain
        </div>
        <h1 className="text-3xl font-black text-zinc-900">Simple, transparent pricing</h1>
        <p className="text-sm text-zinc-500 max-w-xl mx-auto">
          All prices in <strong>XAF (FCFA)</strong>. Payment via MTN MoMo, Orange Money &amp; bank transfer — coming soon.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 bg-zinc-100 rounded-xl p-1 mt-2">
          {(['monthly','yearly'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${billing===b?'bg-white shadow-sm text-zinc-900':'text-zinc-500 hover:text-zinc-700'}`}>
              {b === 'monthly' ? 'Monthly / Mensuel' : 'Yearly / Annuel  🏷️ −25%'}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-3 gap-6">
        {PLANS.map(plan => {
          const isCurrentPlan = currentPlan === plan.id;
          const price = billing === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isPopular = plan.badge === 'Popular';
          const headerDark = plan.id !== 'free';

          return (
            <div key={plan.id}
              className={`relative rounded-2xl border-2 overflow-hidden transition-all ${
                isCurrentPlan ? 'ring-2 ring-offset-2 ring-zinc-900' : ''
              } ${isPopular ? 'border-blue-400 shadow-lg shadow-blue-100' : 'border-zinc-200'}`}>

              {isPopular && (
                <div className="absolute top-0 left-0 right-0 py-1 bg-blue-600 text-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Most Popular</span>
                </div>
              )}

              {/* Header */}
              <div className={`px-6 pt-${isPopular?'8':'5'} pb-5 ${headerDark ? (plan.id==='pro'?'bg-violet-600':'bg-zinc-950') : 'bg-white'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${headerDark?'bg-white/15':'bg-zinc-100'}`}>
                  {PLAN_ICONS[plan.id]}
                </div>
                <h3 className={`text-lg font-black ${headerDark?'text-white':'text-zinc-900'}`}>
                  {plan.nameEn} <span className={`text-sm font-normal ${headerDark?'text-white/60':'text-zinc-400'}`}>/ {plan.nameFr}</span>
                </h3>

                <div className="mt-3">
                  {price === 0 ? (
                    <span className={`text-3xl font-black ${headerDark?'text-white':'text-zinc-900'}`}>Free / Gratuit</span>
                  ) : (
                    <>
                      <span className={`text-3xl font-black ${headerDark?'text-white':'text-zinc-900'}`}>
                        {formatXAF(price)}
                      </span>
                      <span className={`text-sm ml-1 ${headerDark?'text-white/60':'text-zinc-400'}`}>/month</span>
                      {billing === 'yearly' && (
                        <p className={`text-xs mt-0.5 ${headerDark?'text-white/60':'text-zinc-400'}`}>
                          Billed {formatXAF(price * 12)}/year
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="px-6 py-5 space-y-3 bg-white flex-1">
                {plan.featuresEn.map((feat, i) => {
                  const isPremiumFeat = feat.startsWith('✦');
                  const cleanFeat = feat.replace(/✦+\s*/g, '');
                  const frFeat = (plan.featuresFr[i] || '').replace(/✦+\s*/g, '');
                  return (
                    <div key={i} className="flex items-start gap-2">
                      {isPremiumFeat
                        ? <Zap size={12} className="text-blue-500 shrink-0 mt-0.5"/>
                        : <Check size={12} className="text-emerald-500 shrink-0 mt-0.5"/>}
                      <div>
                        <span className="text-xs text-zinc-700">{cleanFeat}</span>
                        {frFeat && frFeat !== cleanFeat && (
                          <span className="text-[10px] text-zinc-400 block">{frFeat}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 bg-white">
                {isCurrentPlan ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-500">
                    <Check size={13}/> Current plan / Plan actuel
                  </div>
                ) : simulated === plan.id ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
                    <Check size={13}/> Simulation active!
                  </div>
                ) : plan.id === 'free' ? (
                  <button onClick={() => activate('free')}
                    className="w-full py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-all">
                    Downgrade / Rétrograder
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-700">
                      <Lock size={11} className="shrink-0"/>
                      Payment via MTN MoMo &amp; Orange Money coming soon
                    </div>
                    <button onClick={() => activate(plan.id)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        plan.id === 'pro'
                          ? 'bg-violet-600 text-white hover:bg-violet-700'
                          : 'bg-zinc-950 text-white hover:bg-zinc-800'
                      }`}>
                      <Zap size={12}/> Try Premium (Simulation)
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming soon payments */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Star size={15} className="text-amber-500" fill="currentColor"/>
          Payment methods coming soon / Méthodes de paiement bientôt disponibles
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name:'MTN Mobile Money', sub:'MTN MoMo Cameroun', color:'bg-yellow-50 border-yellow-200', emoji:'📱' },
            { name:'Orange Money',     sub:'Orange Cameroun',    color:'bg-orange-50 border-orange-200', emoji:'🟠' },
            { name:'Bank Transfer',    sub:'Virement bancaire',  color:'bg-blue-50 border-blue-200',     emoji:'🏦' },
            { name:'Card Payment',     sub:'Visa / Mastercard',  color:'bg-zinc-50 border-zinc-200',     emoji:'💳' },
          ].map(m => (
            <div key={m.name} className={`flex items-center gap-3 p-3 rounded-xl border ${m.color}`}>
              <span className="text-2xl">{m.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-zinc-800">{m.name}</p>
                <p className="text-[10px] text-zinc-500">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          Interested in early access? Contact us: <span className="text-blue-600 font-medium">intervue.cm@gmail.com</span>
        </p>
      </div>
    </div>
  );
}
