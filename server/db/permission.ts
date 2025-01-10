import { startOfMonth } from "date-fns";
import { getProductsCount } from "./product/get";
import { getSubscriptionTier } from "./subscription/get";
import { getProductsViewCount } from "./productViews/get";

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

  return count < tier.maxNumberOfProducts;
}

export async function canShowBanner(clerkId: string | null) {
  if (clerkId === null) return false;
  const tier = await getSubscriptionTier(clerkId);
  const count = await getProductsViewCount(clerkId, startOfMonth(new Date()));

  return count < tier.maxNumberOfVisits;
}
