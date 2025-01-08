export type SubscriptionTier = {
  name: string;
  price: number;
  maxNumberOfProducts: number;
  maxNumberOfVisits: number;
  canAccessAnalytics: boolean;
  canCustomizeBanner: boolean;
  canRemoveBranding: boolean;
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
};

const standard: SubscriptionTier = {
  name: "Standard",
  price: 49,
  maxNumberOfProducts: 25,
  maxNumberOfVisits: 100000,
  canAccessAnalytics: true,
  canCustomizeBanner: true,
  canRemoveBranding: false,
};

const premium: SubscriptionTier = {
  name: "Premium",
  price: 99,
  maxNumberOfProducts: 50,
  maxNumberOfVisits: 1000000,
  canAccessAnalytics: true,
  canCustomizeBanner: true,
  canRemoveBranding: true,
};

export const subscriptionTiers = {
  Free: free,
  Basic: basic,
  Standard: standard,
  Premium: premium,
};
export const subscriptionData = {
  title: "Pricing software which pays for itself 20x over",
  tiers: [free, basic, standard, premium],
};
