/** Premium plans, feature gates, and pricing in XAF */

export type PlanId = 'free' | 'starter' | 'pro';

export interface Plan {
  id:           PlanId;
  nameEn:       string;
  nameFr:       string;
  priceMonthly: number;   // XAF
  priceYearly:  number;   // XAF/year (shown as /month)
  color:        string;
  badge?:       string;
  featuresEn:   string[];
  featuresFr:   string[];
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    nameEn: 'Free', nameFr: 'Gratuit',
    priceMonthly: 0, priceYearly: 0,
    color: 'bg-zinc-50 border-zinc-200',
    featuresEn: [
      '3 interview sessions / month',
      'English interviews only',
      'Global sector packs (4)',
      'Standard CV builder (2 templates)',
      '3 cover letters / month',
      '5 job applications tracked',
      'Basic STAR feedback',
      'Whiteboard diagrams',
    ],
    featuresFr: [
      '3 sessions d\'entretien / mois',
      'Entretiens en anglais uniquement',
      'Packs sectoriels mondiaux (4)',
      'Créateur de CV standard (2 modèles)',
      '3 lettres de motivation / mois',
      '5 candidatures suivies',
      'Feedback STAR de base',
      'Tableaux blancs avec diagrammes',
    ],
  },
  {
    id: 'starter',
    nameEn: 'Starter', nameFr: 'Starter',
    priceMonthly: 4900, priceYearly: 3675,  // 49k/year → 3675/month
    color: 'bg-blue-50 border-blue-300',
    badge: 'Popular',
    featuresEn: [
      'Everything in Free',
      '✦ Unlimited interview sessions',
      '✦ French & English mode',
      '✦ All African sector packs (9)',
      '✦ African/Europass CV format + photo',
      '✦ Unlimited cover letters',
      '✦ Unlimited job applications',
      '✦ Advanced STAR report + PDF export',
      '✦ Priority support',
    ],
    featuresFr: [
      'Tout du plan Gratuit',
      '✦ Sessions illimitées',
      '✦ Mode français & anglais',
      '✦ Tous les packs africains (9)',
      '✦ Format CV africain/Europass + photo',
      '✦ Lettres de motivation illimitées',
      '✦ Candidatures illimitées',
      '✦ Rapport STAR avancé + export PDF',
      '✦ Support prioritaire',
    ],
  },
  {
    id: 'pro',
    nameEn: 'Pro', nameFr: 'Pro',
    priceMonthly: 12900, priceYearly: 9675,
    color: 'bg-violet-50 border-violet-300',
    featuresEn: [
      'Everything in Starter',
      '✦✦ Company-specific question banks',
      '✦✦ AI CV analysis vs job description',
      '✦✦ Salary benchmarks in XAF',
      '✦✦ Scholarship / study abroad prep',
      '✦✦ Healthcare & NGO sector packs',
      '✦✦ Monthly coaching session',
      '✦✦ University / team licences',
    ],
    featuresFr: [
      'Tout du plan Starter',
      '✦✦ Banques de questions par entreprise',
      '✦✦ Analyse IA du CV vs offre d\'emploi',
      '✦✦ Benchmarks salariaux en XAF',
      '✦✦ Préparation bourses / études à l\'étranger',
      '✦✦ Packs santé et ONG',
      '✦✦ Session de coaching mensuelle',
      '✦✦ Licences université / équipe',
    ],
  },
];

/** Feature gate checks — call these before rendering premium features */
export const FEATURE_GATES = {
  frenchMode:        (plan: PlanId) => plan !== 'free',
  africanSectors:    (plan: PlanId) => plan !== 'free',
  africanCVFormat:   (plan: PlanId) => plan !== 'free',
  unlimitedSessions: (plan: PlanId) => plan !== 'free',
  unlimitedCVSaves:  (plan: PlanId) => plan !== 'free',
  pdfExport:         (plan: PlanId) => plan !== 'free',
  companyPacks:      (plan: PlanId) => plan === 'pro',
  salaryBenchmarks:  (plan: PlanId) => plan === 'pro',
  healthSector:      (plan: PlanId) => plan === 'pro',
  ngoSector:         (plan: PlanId) => plan === 'pro',
};

export function formatXAF(amount: number): string {
  if (amount === 0) return 'Gratuit / Free';
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
}
