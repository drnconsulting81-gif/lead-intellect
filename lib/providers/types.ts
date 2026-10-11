export type NormalizedVerificationStatus =
  | "verified"
  | "deliverable"
  | "undeliverable"
  | "risky"
  | "catch_all"
  | "unknown"
  | "not_checked"
  | "stale";

export interface VerificationResult {
  email: string;
  status: NormalizedVerificationStatus;
  confidence: number; // 0 - 100
  provider: string;
  timestamp: string;
  rawStatus?: string;
  isDeliverable: boolean;
  warnings?: string[];
}

export interface ContactEnrichmentRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  companyDomain?: string;
  title?: string;
  currentEmail?: string;
  currentPhone?: string;
  linkedinUrl?: string;
}

export interface EnrichmentResult {
  prospectId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailStatus: NormalizedVerificationStatus;
  emailConfidence: number;
  phone?: string;
  phoneType?: "Direct Dial" | "Mobile" | "Corporate Desk" | "Unknown";
  title?: string;
  company?: string;
  domain?: string;
  linkedin?: string;
  provider: string;
  timestamp: string;
  updatedFields: string[];
}

export interface ProviderHealth {
  id: string;
  name: string;
  capabilities: string[];
  status: "connected" | "available" | "not_connected" | "error";
  description: string;
  lastChecked?: string;
  errorMessage?: string;
}

export interface ProviderAdapter {
  id: string;
  name: string;
  isConfigured(): boolean;
  getHealth(): Promise<ProviderHealth>;
  verifyEmail?(email: string): Promise<VerificationResult>;
  enrichContact?(req: ContactEnrichmentRequest): Promise<EnrichmentResult>;
}
