'use client';

import React, { createContext, useContext, useState } from 'react';
import type { PlanId } from '@/lib/premiumConfig';
import { FEATURE_GATES } from '@/lib/premiumConfig';

interface PremiumContextType {
  plan:       PlanId;
  can:        (feature: keyof typeof FEATURE_GATES) => boolean;
  /** Simulation only — set to 'starter' or 'pro' for demo */
  simulatePlan: (p: PlanId) => void;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be inside PremiumProvider');
  return ctx;
}

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  // Default free — swap to 'starter' | 'pro' for simulation
  const [plan, setPlan] = useState<PlanId>('free');

  const can = (feature: keyof typeof FEATURE_GATES) => FEATURE_GATES[feature](plan);

  return (
    <PremiumContext.Provider value={{ plan, can, simulatePlan: setPlan }}>
      {children}
    </PremiumContext.Provider>
  );
}
