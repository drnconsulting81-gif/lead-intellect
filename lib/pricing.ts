// Plan pricing definitions matching founder specification:
// Basic: $5; Starter: $29; Growth: $79; Enterprise: Custom
export const PLAN_PRICING: Record<
  string,
  {
    id: string;
    name: string;
    priceUSD: number;
    priceINR: number;
    credits: number;
  }
> = {
  basic: {
    id: "basic",
    name: "Basic (Pilot)",
    priceUSD: 5,
    priceINR: 449,
    credits: 50,
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceUSD: 29,
    priceINR: 2499,
    credits: 100,
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceUSD: 79,
    priceINR: 6799,
    credits: 200,
  },
};
