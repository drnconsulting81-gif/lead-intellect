import {
  ProviderAdapter,
  ProviderHealth,
  VerificationResult,
  ContactEnrichmentRequest,
  EnrichmentResult,
  NormalizedVerificationStatus,
} from "./types";

export class XMagnetAdapter implements ProviderAdapter {
  id = "xmagnet";
  name = "XMagnet Intelligence & Delivery Gateway";

  private apiKey = process.env.XMAGNET_API_KEY || "";
  private baseUrl = process.env.XMAGNET_BASE_URL || "https://api.xmagnet.io/v1";

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async getHealth(): Promise<ProviderHealth> {
    const configured = this.isConfigured();
    if (!configured) {
      return {
        id: this.id,
        name: this.name,
        capabilities: [
          "Email Deliverability Verification",
          "Bulk Verification",
          "Contact Enrichment",
          "Domain MX Auditing",
        ],
        status: "not_connected",
        description: "Provider adapter configured. Awaiting commercial API Key in production settings.",
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (res.ok) {
        return {
          id: this.id,
          name: this.name,
          capabilities: [
            "Email Deliverability Verification",
            "Bulk Verification",
            "Contact Enrichment",
            "Domain MX Auditing",
          ],
          status: "connected",
          description: "Operational and verified.",
          lastChecked: new Date().toISOString(),
        };
      }

      return {
        id: this.id,
        name: this.name,
        capabilities: ["Email Deliverability Verification", "Contact Enrichment"],
        status: "error",
        description: `API responded with HTTP ${res.status}`,
        lastChecked: new Date().toISOString(),
        errorMessage: `Connection failed: ${res.statusText}`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      return {
        id: this.id,
        name: this.name,
        capabilities: ["Email Deliverability Verification", "Contact Enrichment"],
        status: "error",
        description: "Network timeout or unreachable endpoint",
        lastChecked: new Date().toISOString(),
        errorMessage: msg,
      };
    }
  }

  async verifyEmail(email: string): Promise<VerificationResult> {
    const timestamp = new Date().toISOString();
    if (!this.isConfigured()) {
      return {
        email,
        status: "unknown",
        confidence: 0,
        provider: this.name,
        timestamp,
        isDeliverable: false,
        warnings: ["XMagnet API key is not configured. Live verification is currently offline."],
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/verify/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        return {
          email,
          status: "unknown",
          confidence: 0,
          provider: this.name,
          timestamp,
          isDeliverable: false,
          warnings: [`Provider error: HTTP ${res.status}`],
        };
      }

      const data = await res.json();
      let status: NormalizedVerificationStatus = "unknown";
      let confidence = 50;

      const raw = (data.status || "").toLowerCase();
      if (raw === "valid" || raw === "deliverable" || raw === "verified") {
        status = "verified";
        confidence = 98;
      } else if (raw === "catch_all" || raw === "risky") {
        status = "catch_all";
        confidence = 70;
      } else if (raw === "invalid" || raw === "bounced") {
        status = "undeliverable";
        confidence = 0;
      }

      return {
        email,
        status,
        confidence,
        provider: this.name,
        timestamp,
        rawStatus: data.status,
        isDeliverable: status === "verified",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification request failed.";
      return {
        email,
        status: "unknown",
        confidence: 0,
        provider: this.name,
        timestamp,
        isDeliverable: false,
        warnings: [msg],
      };
    }
  }

  async enrichContact(req: ContactEnrichmentRequest): Promise<EnrichmentResult> {
    const timestamp = new Date().toISOString();
    if (!this.isConfigured()) {
      return {
        firstName: req.firstName,
        lastName: req.lastName,
        company: req.companyName,
        email: req.currentEmail,
        emailStatus: "unknown",
        emailConfidence: 0,
        phone: req.currentPhone,
        title: req.title,
        linkedin: req.linkedinUrl,
        provider: this.name,
        timestamp,
        updatedFields: [],
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/enrich/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        throw new Error(`Enrichment failed with status ${res.status}`);
      }

      const data = await res.json();
      const updatedFields: string[] = [];
      if (data.email && data.email !== req.currentEmail) updatedFields.push("email");
      if (data.phone && data.phone !== req.currentPhone) updatedFields.push("phone");
      if (data.title && data.title !== req.title) updatedFields.push("title");

      return {
        firstName: req.firstName,
        lastName: req.lastName,
        company: req.companyName,
        email: data.email || req.currentEmail,
        emailStatus: data.emailVerified ? "verified" : "deliverable",
        emailConfidence: data.emailVerified ? 95 : 75,
        phone: data.phone || req.currentPhone,
        phoneType: data.phoneType || "Direct Dial",
        title: data.title || req.title,
        linkedin: data.linkedinUrl || req.linkedinUrl,
        provider: this.name,
        timestamp,
        updatedFields,
      };
    } catch {
      return {
        firstName: req.firstName,
        lastName: req.lastName,
        company: req.companyName,
        email: req.currentEmail,
        emailStatus: "unknown",
        emailConfidence: 0,
        phone: req.currentPhone,
        title: req.title,
        linkedin: req.linkedinUrl,
        provider: this.name,
        timestamp,
        updatedFields: [],
      };
    }
  }
}
