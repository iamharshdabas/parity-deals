import { getProductsCount } from "./product/get";
import { getSubscriptionTier } from "./subscription/get";

export async function canRemoveBranding(clerkId: string | null) {
  if (clerkId === null) return false;
  const tier = await getSubscriptionTier(clerkId);

  return tier.canRemoveBranding;
}

export async function canCustomizeBanner(clerkId: string | null) {
  if (clerkId === null) return false;
  const tier = await getSubscriptionTier(clerkId);

  return tier.canCustomizeBanner;
}

export async function canAccessAnalytics(clerkId: string | null) {
  if (clerkId === null) return false;
  const tier = await getSubscriptionTier(clerkId);

  return tier.canAccessAnalytics;
}

export async function canCreateProduct(clerkId: string | null) {
  if (clerkId === null) return false;
  const tier = await getSubscriptionTier(clerkId);

  const count = await getProductsCount(clerkId);

  if (count < tier.maxNumberOfProducts) return true;

  return false;
}
