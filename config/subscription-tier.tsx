import { env } from "@/lib/env";

export type SubscriptionTier = {
  name: string;
  price: number;
  maxNumberOfProducts: number;
  maxNumberOfVisits: number;
  canAccessAnalytics: boolean;
  canCustomizeBanner: boolean;
  canRemoveBranding: boolean;
  stripePriceId?: string;
};

const free: SubscriptionTier = {
  name: "Free",
  price: 0,
  maxNumberOfProducts: 1,
  maxNumberOfVisits: 5000,
  canAccessAnalytics: false,
  canCustomizeBanner: false,
  canRemoveBranding: false,
};
const basic: SubscriptionTier = {
  name: "Basic",
  price: 19,
  maxNumberOfProducts: 10,
  maxNumberOfVisits: 10000,
  canAccessAnalytics: true,
  canCustomizeBanner: false,
  canRemoveBranding: false,
  stripePriceId: env.STRIPE_BASIC_PRICE,
};
const standard: SubscriptionTier = {
  name: "Standard",
  price: 49,
  maxNumberOfProducts: 25,
  maxNumberOfVisits: 100000,
  canAccessAnalytics: true,
  canCustomizeBanner: true,
  canRemoveBranding: false,
  stripePriceId: env.STRIPE_STANDARD_PRICE,
};
const premium: SubscriptionTier = {
  name: "Premium",
  price: 99,
  maxNumberOfProducts: 50,
  maxNumberOfVisits: 1000000,
  canAccessAnalytics: true,
  canCustomizeBanner: true,
  canRemoveBranding: true,
  stripePriceId: env.STRIPE_PREMIUM_PRICE,
};

export const subscriptionTiers = {
  Free: free,
  Basic: basic,
  Standard: standard,
  Premium: premium,
};

export type SubscriptionTiersName = keyof typeof subscriptionTiers;
export type SubscriptionPaidTiersName = Exclude<SubscriptionTiersName, "Free">;

export const subscriptionData = {
  title: "Pricing software which pays for itself 20x over",
  tiers: [free, basic, standard, premium],
};
