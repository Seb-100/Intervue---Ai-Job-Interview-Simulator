/**
 * Sector-specific interview packs — English + French
 * African / Cameroonian job market focus
 */

export type PlanTier = 'free' | 'starter' | 'pro';

export interface SectorQuestion { en: string; fr: string; }
export interface SectorPack {
  id:          string;
  icon:        string;
  nameEn:      string;
  nameFr:      string;
  descEn:      string;
  descFr:      string;
  tier:        PlanTier;       // free = always accessible
  color:       string;         // tailwind bg color
  textColor:   string;
  borderColor: string;
  region:      'global' | 'africa';
  companies:   string[];
  competencies: { en: string; fr: string }[];
  questions:    SectorQuestion[];
  tips:         SectorQuestion[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function q(en: string, fr: string): SectorQuestion { return { en, fr }; }

// ═══════════════════════════════════════════════════════════════════════════════
// FREE — GLOBAL SECTORS
// ═══════════════════════════════════════════════════════════════════════════════
export const SECTOR_PACKS: SectorPack[] = [

  {
    id:'software-engineering', icon:'💻', tier:'free', region:'global',
    nameEn:'Software Engineering',     nameFr:'Génie Logiciel',
    descEn:'Algorithms, system design, code quality', descFr:'Algorithmes, conception de systèmes, qualité du code',
    color:'bg-blue-50',  textColor:'text-blue-700', borderColor:'border-blue-200',
    companies:['Google','Amazon','Microsoft','Startups'],
    competencies:[
      q('Problem solving','Résolution de problèmes'),
      q('Data structures & algorithms','Structures de données et algorithmes'),
      q('System design','Conception de systèmes'),
      q('Code quality & testing','Qualité du code et tests'),
    ],
    questions:[
      q('Walk me through your approach to solving a complex technical problem.',
        'Expliquez votre approche pour résoudre un problème technique complexe.'),
      q('Design a URL shortening service like bit.ly.',
        'Concevez un service de raccourcissement d\'URL comme bit.ly.'),
      q('How do you ensure your code is maintainable and readable?',
        'Comment vous assurez-vous que votre code est maintenable et lisible?'),
      q('Describe a time you had to refactor a legacy codebase.',
        'Décrivez une situation où vous avez dû refactoriser un code existant.'),
      q('What is your approach to debugging a production issue?',
        'Quelle est votre approche pour déboguer un problème en production?'),
    ],
    tips:[
      q('Use STAR for behavioral questions; think aloud for technical ones.',
        'Utilisez STAR pour les questions comportementales; pensez à voix haute pour les techniques.'),
      q('Always clarify requirements before jumping into a solution.',
        'Clarifiez toujours les exigences avant de proposer une solution.'),
    ],
  },

  {
    id:'data-science', icon:'📊', tier:'free', region:'global',
    nameEn:'Data Science & Analytics',  nameFr:'Science des Données',
    descEn:'Statistics, ML, data engineering',    descFr:'Statistiques, ML, ingénierie des données',
    color:'bg-violet-50', textColor:'text-violet-700', borderColor:'border-violet-200',
    companies:['Meta','Airbnb','IBM','Consulting firms'],
    competencies:[
      q('Statistical analysis','Analyse statistique'),
      q('Machine learning','Apprentissage automatique'),
      q('Data visualisation','Visualisation des données'),
      q('SQL & data pipelines','SQL et pipelines de données'),
    ],
    questions:[
      q('Explain the difference between supervised and unsupervised learning.',
        'Expliquez la différence entre l\'apprentissage supervisé et non supervisé.'),
      q('How would you handle missing data in a dataset?',
        'Comment traiteriez-vous les données manquantes dans un jeu de données?'),
      q('Walk me through a data project from problem definition to deployment.',
        'Décrivez un projet de données de la définition du problème au déploiement.'),
      q('What metrics would you use to evaluate a classification model?',
        'Quelles métriques utiliseriez-vous pour évaluer un modèle de classification?'),
    ],
    tips:[
      q('Quantify impact: "my model reduced churn by 12%".',
        'Quantifiez l\'impact: "mon modèle a réduit le taux d\'attrition de 12%".'),
      q('Prepare a portfolio project to discuss in detail.',
        'Préparez un projet de portfolio à discuter en détail.'),
    ],
  },

  {
    id:'product-management', icon:'🎯', tier:'free', region:'global',
    nameEn:'Product Management',  nameFr:'Gestion de Produit',
    descEn:'Strategy, roadmaps, user research', descFr:'Stratégie, feuilles de route, recherche utilisateur',
    color:'bg-amber-50', textColor:'text-amber-700', borderColor:'border-amber-200',
    companies:['Meta','Google','Jumia','Wave','MTN MoMo'],
    competencies:[
      q('Product strategy','Stratégie produit'),
      q('User empathy','Empathie utilisateur'),
      q('Prioritisation','Priorisation'),
      q('Stakeholder management','Gestion des parties prenantes'),
    ],
    questions:[
      q('How would you prioritise features for a mobile money app in Cameroon?',
        'Comment prioriseriez-vous les fonctionnalités d\'une application de mobile money au Cameroun?'),
      q('Describe how you turned user feedback into a product improvement.',
        'Décrivez comment vous avez transformé les retours utilisateurs en amélioration produit.'),
      q('How do you define and measure success for a new feature?',
        'Comment définissez-vous et mesurez-vous le succès d\'une nouvelle fonctionnalité?'),
    ],
    tips:[
      q('Frameworks like RICE, MoSCoW, and OKRs are highly valued.',
        'Les frameworks comme RICE, MoSCoW et OKRs sont très appréciés.'),
    ],
  },

  {
    id:'finance-accounting', icon:'💰', tier:'free', region:'global',
    nameEn:'Finance & Accounting',  nameFr:'Finance & Comptabilité',
    descEn:'Financial analysis, audit, reporting', descFr:'Analyse financière, audit, reporting',
    color:'bg-emerald-50', textColor:'text-emerald-700', borderColor:'border-emerald-200',
    companies:['Big 4','PricewaterhouseCoopers','KPMG Cameroun','Banks'],
    competencies:[
      q('Financial modelling','Modélisation financière'),
      q('IFRS / SYSCOHADA accounting','Comptabilité IFRS / SYSCOHADA'),
      q('Audit & compliance','Audit et conformité'),
      q('Budgeting & forecasting','Budgétisation et prévisions'),
    ],
    questions:[
      q('Explain the difference between IFRS and SYSCOHADA reporting standards.',
        'Expliquez la différence entre les normes IFRS et SYSCOHADA.'),
      q('How do you detect fraud during an audit?',
        'Comment détectez-vous une fraude lors d\'un audit?'),
      q('Walk me through a financial model you built.',
        'Décrivez un modèle financier que vous avez construit.'),
      q('How would you improve the cash flow of a struggling SME?',
        'Comment amélioreriez-vous la trésorerie d\'une PME en difficulté?'),
    ],
    tips:[
      q('Know SYSCOHADA — it is the accounting standard across 17 African countries.',
        'Maîtrisez SYSCOHADA — c\'est la norme comptable dans 17 pays africains.'),
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PREMIUM — AFRICA / CAMEROON SPECIFIC
  // ══════════════════════════════════════════════════════════════════════════════

  {
    id:'oil-gas', icon:'🛢️', tier:'starter', region:'africa',
    nameEn:'Oil, Gas & Energy',  nameFr:'Pétrole, Gaz & Énergie',
    descEn:'Upstream/downstream, HSE, operations',  descFr:'Amont/aval, HSE, opérations',
    color:'bg-orange-50', textColor:'text-orange-700', borderColor:'border-orange-200',
    companies:['TotalEnergies','SNH','Perenco','Schlumberger','Halliburton','TRADEX'],
    competencies:[
      q('HSE & safety culture','Culture HSE et sécurité'),
      q('Technical operations','Opérations techniques'),
      q('Process engineering','Génie des procédés'),
      q('Project management','Gestion de projet'),
    ],
    questions:[
      q('Describe a time you identified a safety risk and what actions you took.',
        'Décrivez une situation où vous avez identifié un risque de sécurité et les mesures prises.'),
      q('How do you ensure HSE compliance on a large-scale field operation?',
        'Comment assurez-vous la conformité HSE sur une opération de terrain à grande échelle?'),
      q('Explain the difference between upstream and downstream activities.',
        'Expliquez la différence entre les activités en amont et en aval.'),
      q('What experience do you have with production optimisation?',
        'Quelle expérience avez-vous en optimisation de la production?'),
      q('How do you manage contractor relationships on site?',
        'Comment gérez-vous les relations avec les sous-traitants sur le terrain?'),
      q('TotalEnergies values: how do they align with your professional approach?',
        'Valeurs TotalEnergies: comment s\'alignent-elles avec votre approche professionnelle?'),
    ],
    tips:[
      q('Always mention safety first — HSE is non-negotiable in oil & gas.',
        'Mentionnez toujours la sécurité en premier — le HSE est non négociable dans le secteur pétrolier.'),
      q('Know your ISO standards (ISO 14001, OHSAS 18001).',
        'Connaissez vos normes ISO (ISO 14001, OHSAS 18001).'),
      q('Research the company\'s Cameroonian operations before the interview.',
        'Renseignez-vous sur les opérations camerounaises de l\'entreprise avant l\'entretien.'),
    ],
  },

  {
    id:'banking-africa', icon:'🏦', tier:'starter', region:'africa',
    nameEn:'Banking & Financial Services',  nameFr:'Banque & Services Financiers',
    descEn:'Retail, corporate, microfinance, mobile money', descFr:'Retail, corporate, microfinance, mobile money',
    color:'bg-teal-50', textColor:'text-teal-700', borderColor:'border-teal-200',
    companies:['Afriland First Bank','SCB Cameroun','UBA','Ecobank','BICEC','SGBC','CCA Bank','Wave','MTN MoMo'],
    competencies:[
      q('Credit risk analysis','Analyse du risque de crédit'),
      q('KYC & AML compliance','Conformité KYC & LBC/FT'),
      q('Customer relationship management','Gestion de la relation client'),
      q('SYSCOHADA & COBAC regulations','Réglementations SYSCOHADA & COBAC'),
    ],
    questions:[
      q('How would you evaluate the creditworthiness of an SME in Cameroon?',
        'Comment évalueriez-vous la solvabilité d\'une PME au Cameroun?'),
      q('What do you know about COBAC regulations and their impact on lending?',
        'Que savez-vous sur les réglementations COBAC et leur impact sur le crédit?'),
      q('How would you handle a client who is struggling to repay their loan?',
        'Comment géreriez-vous un client ayant des difficultés à rembourser son prêt?'),
      q('Describe your experience with KYC procedures.',
        'Décrivez votre expérience avec les procédures KYC.'),
      q('How is mobile banking transforming financial inclusion in Africa?',
        'Comment la banque mobile transforme-t-elle l\'inclusion financière en Afrique?'),
    ],
    tips:[
      q('Know COBAC, BEAC and OHADA frameworks — Cameroonian interviewers expect this.',
        'Connaissez COBAC, BEAC et OHADA — les recruteurs camerounais l\'attendent.'),
      q('Show awareness of mobile money ecosystems (MTN MoMo, Orange Money).',
        'Montrez votre connaissance des écosystèmes de mobile money (MTN MoMo, Orange Money).'),
    ],
  },

  {
    id:'telecoms-africa', icon:'📡', tier:'starter', region:'africa',
    nameEn:'Telecoms & Digital',  nameFr:'Télécoms & Numérique',
    descEn:'Mobile networks, digital products, customer experience', descFr:'Réseaux mobiles, produits numériques, expérience client',
    color:'bg-yellow-50', textColor:'text-yellow-700', borderColor:'border-yellow-200',
    companies:['MTN Cameroon','Orange Cameroon','Camtel','Nexttel','Canal+'],
    competencies:[
      q('Network infrastructure','Infrastructure réseau'),
      q('KPIs & revenue management','KPIs et gestion des revenus'),
      q('Customer experience','Expérience client'),
      q('Digital transformation','Transformation numérique'),
    ],
    questions:[
      q('How would you improve customer retention for a mobile operator in Cameroon?',
        'Comment amélioreriez-vous la rétention client d\'un opérateur mobile au Cameroun?'),
      q('What challenges does MTN face in expanding rural connectivity in Cameroon?',
        'Quels défis MTN rencontre-t-il pour étendre la connectivité rurale au Cameroun?'),
      q('Describe a campaign or product launch you managed.',
        'Décrivez une campagne ou un lancement de produit que vous avez géré.'),
      q('How do you analyse churn data to identify at-risk customers?',
        'Comment analysez-vous les données de churn pour identifier les clients à risque?'),
      q('What does 5G mean for Cameroon\'s digital economy?',
        'Que représente la 5G pour l\'économie numérique du Cameroun?'),
    ],
    tips:[
      q('Know MTN\'s Ambition 2025 strategy and Orange\'s Engage 2025 plan.',
        'Connaissez la stratégie Ambition 2025 de MTN et le plan Engage 2025 d\'Orange.'),
      q('Demonstrate knowledge of ARPU, NPS, and churn metrics.',
        'Démontrez votre connaissance des métriques ARPU, NPS et churn.'),
    ],
  },

  {
    id:'development-orgs', icon:'🌐', tier:'starter', region:'africa',
    nameEn:'Development Organisations',  nameFr:'Organisations de Développement',
    descEn:'UN agencies, World Bank, AfDB, NGOs', descFr:'Agences ONU, Banque Mondiale, BAD, ONG',
    color:'bg-sky-50', textColor:'text-sky-700', borderColor:'border-sky-200',
    companies:['UNDP','UNICEF','World Bank','AfDB','IMF','FAO','WHO','GIZ','USAID'],
    competencies:[
      q('Results-Based Management (RBM)','Gestion axée sur les résultats (GAR)'),
      q('Project cycle management','Gestion du cycle de projet'),
      q('Report writing & M&E','Rédaction de rapports & S&E'),
      q('UN core values / competencies','Valeurs fondamentales / compétences ONU'),
    ],
    questions:[
      q('Describe a project you managed using a results-based approach.',
        'Décrivez un projet que vous avez géré en utilisant une approche axée sur les résultats.'),
      q('How do you ensure accountability and transparency in programme delivery?',
        'Comment assurez-vous la redevabilité et la transparence dans la mise en œuvre des programmes?'),
      q('What is your experience with monitoring and evaluation frameworks?',
        'Quelle est votre expérience avec les cadres de suivi et d\'évaluation?'),
      q('How would you build relationships with government counterparts in Cameroon?',
        'Comment construiriez-vous des relations avec les homologues gouvernementaux au Cameroun?'),
      q('Describe a situation where you managed a project with limited resources.',
        'Décrivez une situation où vous avez géré un projet avec des ressources limitées.'),
      q('What do you know about the Sustainable Development Goals and their relevance to Cameroon?',
        'Que savez-vous des Objectifs de Développement Durable et leur pertinence pour le Cameroun?'),
    ],
    tips:[
      q('UN interviews are strictly competency-based — every answer must follow STAR.',
        'Les entretiens ONU sont strictement basés sur les compétences — chaque réponse doit suivre STAR.'),
      q('Know the 7 UN core values: integrity, professionalism, respect for diversity...',
        'Connaissez les 7 valeurs fondamentales ONU: intégrité, professionnalisme, respect de la diversité...'),
      q('Prepare concrete examples of project management, monitoring, and reporting.',
        'Préparez des exemples concrets de gestion de projet, de suivi et de reporting.'),
    ],
  },

  {
    id:'civil-service', icon:'🏛️', tier:'starter', region:'africa',
    nameEn:'Civil Service & Public Sector',  nameFr:'Fonction Publique & Secteur Public',
    descEn:'Concours, MINFOPRA, ENAM, state enterprises', descFr:'Concours, MINFOPRA, ENAM, entreprises d\'État',
    color:'bg-slate-50', textColor:'text-slate-700', borderColor:'border-slate-200',
    companies:['MINFOPRA','ENAM','ENSP','CAMWATER','SONATREL','AES-SONEL','CAMTEL'],
    competencies:[
      q('Administrative law & public management','Droit administratif & management public'),
      q('Budget management','Gestion budgétaire'),
      q('Report drafting','Rédaction administrative'),
      q('Public service ethics','Éthique du service public'),
    ],
    questions:[
      q('Why do you want to serve in the Cameroonian civil service?',
        'Pourquoi souhaitez-vous servir dans la fonction publique camerounaise?'),
      q('How do you apply the principle of legality in administrative decision-making?',
        'Comment appliquez-vous le principe de légalité dans la prise de décision administrative?'),
      q('Describe how you would handle a citizen complaint.',
        'Décrivez comment vous traiteriez une réclamation d\'un citoyen.'),
      q('What is your understanding of Cameroon\'s decentralisation policy?',
        'Quelle est votre compréhension de la politique de décentralisation du Cameroun?'),
      q('How would you ensure the execution of a public programme with limited funding?',
        'Comment assureriez-vous l\'exécution d\'un programme public avec un financement limité?'),
    ],
    tips:[
      q('For concours, know the Cameroonian Constitution and key administrative texts.',
        'Pour les concours, connaissez la Constitution camerounaise et les textes administratifs clés.'),
      q('Demonstrate commitment to public service ethics and anti-corruption.',
        'Démontrez votre engagement envers l\'éthique du service public et la lutte contre la corruption.'),
    ],
  },

  {
    id:'mining-agriculture', icon:'⛏️', tier:'starter', region:'africa',
    nameEn:'Mining & Agribusiness',  nameFr:'Mines & Agro-industrie',
    descEn:'Mining operations, agro-industrial production, sustainability', descFr:'Opérations minières, production agro-industrielle, durabilité',
    color:'bg-lime-50', textColor:'text-lime-700', borderColor:'border-lime-200',
    companies:['Sundance Resources','Geovic','CDC','Socapalm','Sodecoton','FERMENCAM'],
    competencies:[
      q('Environmental & social impact','Impact environnemental et social'),
      q('Supply chain management','Gestion de la chaîne d\'approvisionnement'),
      q('Community relations','Relations communautaires'),
      q('HSE in field operations','HSE dans les opérations de terrain'),
    ],
    questions:[
      q('How do you manage environmental and community impacts of a mining operation?',
        'Comment gérez-vous les impacts environnementaux et communautaires d\'une opération minière?'),
      q('Describe your experience managing large field teams.',
        'Décrivez votre expérience dans la gestion de grandes équipes de terrain.'),
      q('What strategies would you use to improve yield in an agro-industrial context?',
        'Quelles stratégies utiliseriez-vous pour améliorer les rendements dans un contexte agro-industriel?'),
      q('How do you ensure product quality from farm to export?',
        'Comment assurez-vous la qualité du produit de la ferme à l\'exportation?'),
    ],
    tips:[
      q('Demonstrate knowledge of local community engagement and FPIC principles.',
        'Démontrez votre connaissance de l\'engagement communautaire local et des principes du CLIP.'),
      q('Know the MINMIDT and MINEPIA regulatory framework in Cameroon.',
        'Connaissez le cadre réglementaire MINMIDT et MINEPIA au Cameroun.'),
    ],
  },

  {
    id:'health-pharma', icon:'🏥', tier:'pro', region:'africa',
    nameEn:'Healthcare & Pharma',  nameFr:'Santé & Pharmacie',
    descEn:'Public health, hospital management, pharmaceutical industry', descFr:'Santé publique, gestion hospitalière, industrie pharmaceutique',
    color:'bg-red-50', textColor:'text-red-700', borderColor:'border-red-200',
    companies:['MSF','WHO','MINSANTE','CENAME','Laquintinie Hospital','Laborex'],
    competencies:[
      q('Public health management','Gestion de la santé publique'),
      q('Pharmacovigilance','Pharmacovigilance'),
      q('Patient care standards','Normes de soins aux patients'),
      q('Healthcare financing','Financement de la santé'),
    ],
    questions:[
      q('How would you improve healthcare access in rural Cameroon?',
        'Comment amélioreriez-vous l\'accès aux soins de santé dans le Cameroun rural?'),
      q('Describe your experience managing a health programme.',
        'Décrivez votre expérience dans la gestion d\'un programme de santé.'),
      q('How do you handle supply chain challenges for essential medicines?',
        'Comment gérez-vous les défis de la chaîne d\'approvisionnement pour les médicaments essentiels?'),
    ],
    tips:[
      q('Know Cameroon\'s Health Sector Strategy and national health priorities.',
        'Connaissez la Stratégie Sectorielle de Santé et les priorités nationales de santé du Cameroun.'),
    ],
  },

  {
    id:'ngos-humanitarian', icon:'🤝', tier:'pro', region:'africa',
    nameEn:'NGOs & Humanitarian',  nameFr:'ONG & Humanitaire',
    descEn:'Field operations, fundraising, advocacy, project implementation', descFr:'Opérations de terrain, collecte de fonds, plaidoyer, mise en œuvre',
    color:'bg-pink-50', textColor:'text-pink-700', borderColor:'border-pink-200',
    companies:['IRC','Oxfam','Save the Children','Plan International','Médecins du Monde','CARITAS'],
    competencies:[
      q('Humanitarian principles','Principes humanitaires'),
      q('Proposal writing','Rédaction de propositions'),
      q('Community mobilisation','Mobilisation communautaire'),
      q('Donor reporting','Rapportage aux donateurs'),
    ],
    questions:[
      q('Why do you want to work in the humanitarian sector?',
        'Pourquoi souhaitez-vous travailler dans le secteur humanitaire?'),
      q('How do you maintain impartiality when working with conflict-affected communities?',
        'Comment maintenez-vous l\'impartialité lorsque vous travaillez avec des communautés touchées par un conflit?'),
      q('Describe how you have written and managed a donor-funded project proposal.',
        'Décrivez comment vous avez rédigé et géré une proposition de projet financé par des donateurs.'),
    ],
    tips:[
      q('Know the Sphere Standards and Core Humanitarian Standard.',
        'Connaissez les Normes Sphère et la Norme humanitaire fondamentale.'),
      q('Demonstrate cultural sensitivity and community-centred approaches.',
        'Démontrez la sensibilité culturelle et les approches centrées sur la communauté.'),
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getSectorById(id: string): SectorPack | undefined {
  return SECTOR_PACKS.find(s => s.id === id);
}

export const FREE_SECTORS  = SECTOR_PACKS.filter(s => s.tier === 'free');
export const PAID_SECTORS  = SECTOR_PACKS.filter(s => s.tier !== 'free');
export const AFRICA_SECTORS = SECTOR_PACKS.filter(s => s.region === 'africa');
