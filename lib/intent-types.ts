/**
 * LeadIntellect Intent Signal & Intelligence Types
 * Defines data structures for Intent Signals, Specialist Agents, and Opportunity Briefs
 */

export type IntentCategory =
  | "job_change"
  | "promotion"
  | "hiring"
  | "funding_growth"
  | "tech_adoption"
  | "g2_buyer_intent"
  | "community_pain_point";

export type CorroborationStatus = "single_source" | "corroborated" | "verified";
export type FreshnessStatus = "real_time" | "fresh" | "historical";
export type AdapterStatus = "live_active" | "verified_cache" | "modeled_telemetry" | "unconfigured" | "error";

export interface IntentSignalRecord {
  id: string;
  companyId: string;
  companyName: string;
  domain: string;
  personId?: string;
  personName?: string;
  personTitle?: string;
  signalCategory: IntentCategory;
  categoryLabel: string;
  eventType: string;
  eventDescription: string;
  eventDate: string; // YYYY-MM-DD
  publicationDate: string; // YYYY-MM-DD
  discoveryDate: string; // ISO
  originalSourceUrl: string;
  sourceProvider: string;
  evidenceText: string;
  confidence: number; // 0-100
  corroborationStatus: CorroborationStatus;
  lastCheckedDate: string; // ISO
  freshnessStatus: FreshnessStatus;
  freshnessDays: number;
  workspaceVisibility: "public" | "organization" | "private";
  whyItMatters: string;
  recommendedAction: string;
  icebreaker: string;
  adapterStatus?: AdapterStatus;
  metadata?: Record<string, any>;
}

export interface IntentSignalFilter {
  companyId?: string;
  companyName?: string;
  domain?: string;
  personId?: string;
  signalCategory?: IntentCategory | "all";
  maxRecencyDays?: number;
  minConfidence?: number;
  limit?: number;
}

export interface ExplainableOpportunityBrief {
  // 1. WHO: Target decision-maker & company profile
  who: {
    personName: string;
    personTitle: string;
    seniority: string;
    department: string;
    companyName: string;
    domain: string;
    industry: string;
    employeeRange: string;
    revenueRange: string;
    location: string;
    buyingAuthorityRole: string;
  };
  // 2. WHY: Clear commercial rationale for reaching out now
  why: {
    commercialRationale: string;
    marketTrigger: string;
    urgencyReason: string;
  };
  // 3. SIGNAL: What happened, when, where, supporting evidence
  signal: {
    id: string;
    headline: string;
    description: string;
    category: IntentCategory;
    categoryLabel: string;
    eventDate: string;
    recencyDays: number;
    freshnessTier: "Real-time (<14d)" | "Fresh (<30d)" | "Recent (<90d)" | "Historical";
    sourceProvider: string;
    sourceName: string;
    sourceUrl: string;
    evidenceQuote: string;
    corroborationStatus: CorroborationStatus;
    adapterStatus: AdapterStatus;
  };
  // 4. PAIN: Probable operational challenge associated with the signal
  pain: {
    operationalChallenge: string;
    businessImpact: string;
    relevanceToOffering: string;
  };
  // 5. FIT: Exact ICP match criteria satisfied and any missing criteria
  fit: {
    icpTier: "Tier 1" | "Tier 2" | "Tier 3";
    matchedCriteria: string[];
    missingCriteria: string[];
    qualificationSummary: string;
  };
  // 6. CONFIDENCE: Independent score dimensions
  confidence: {
    icpScore: number; // 0-100
    intentScore: number; // 0-100
    contactConfidence: number; // 0-100
    signalFreshnessDays: number; // raw days
    emailDeliverabilityStatus: "verified" | "deliverable" | "unverified" | "not_available";
    phoneType: string;
    compositeScore: number; // 0-100 weighted
  };
  // 7. NEXT: Concrete next step and defensible outreach angle
  next: {
    recommendedAction: string;
    defensibleAngle: string;
    aiIcebreaker: string;
    suggestedSubjectLine: string;
    suggestedSequenceAngle: string;
  };
}

export interface InterpretedQueryCriteria {
  rawQuery: string;
  objective: string;
  targetSeniority?: string;
  targetRoles?: string[];
  targetIndustries?: string[];
  targetLocations?: string[];
  targetCompanies?: string[];
  employeeRanges?: string[];
  revenueRanges?: string[];
  intentCategories?: IntentCategory[];
  maxRecencyDays?: number;
  webPlatforms?: string[];
  minIcpScore?: number;
  requiresEmail?: boolean;
  requiresPhone?: boolean;
  explanation: string;
}

export interface AgentExecutionStatus {
  agentName: string;
  status: "idle" | "running" | "completed" | "failed" | "skipped";
  durationMs: number;
  recordsProcessed: number;
  recordsOutput: number;
  notes?: string;
}

export interface OrchestrationResult {
  interpretedCriteria: InterpretedQueryCriteria;
  agents: AgentExecutionStatus[];
  totalCandidatesDiscovered: number;
  totalQualified: number;
  results: {
    prospect: any;
    signal: IntentSignalRecord;
    brief: ExplainableOpportunityBrief;
    scores: {
      icpScore: number;
      intentScore: number;
      contactConfidence: number;
      signalFreshnessDays: number;
      compositeScore: number;
    };
  }[];
  timingMs: number;
}
