"use server";

import { errorMessage } from "@/config/message";
import { siteHref } from "@/config/site";
import {
  SubscriptionPaidTiersName,
  subscriptionTiers,
} from "@/config/subscription-tier";
import { env } from "@/lib/env";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { getNotCachedSubscription } from "../db/subscription/get";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createCancelSession() {
  const user = await currentUser();
  if (!user) throw new Error(errorMessage.stripe.noUser);

  const subscription = await getNotCachedSubscription(user.id);
  if (!subscription?.stripeCustomerId || !subscription.stripeSubscriptionId) {
    throw new Error(errorMessage.stripe.noSubscription);
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_SITE_URL + siteHref.subscription()}`,
    flow_data: {
      type: "subscription_cancel",
      subscription_cancel: {
        subscription: subscription.stripeSubscriptionId,
      },
    },
  });

  redirect(portalSession.url);
}

export async function createCheckoutSession(tier: SubscriptionPaidTiersName) {
  const user = await currentUser();
  if (!user) throw new Error(errorMessage.stripe.noUser);

  const subscription = await getNotCachedSubscription(user.id);
  if (!subscription) throw new Error(errorMessage.stripe.noSubscription);

  if (!subscription.stripeCustomerId) {
    const url = await getCheckoutSession(tier, user);
    if (!url) throw new Error(errorMessage.stripe.FailedCheckoutSession);
    redirect(url);
  } else {
    const url = await getSubscriptionUpdateSession(tier, subscription);
    if (!url) throw new Error(errorMessage.stripe.FailedCheckoutSession);
    redirect(url);
  }
}

export async function createCustomerProtalSession() {
  const { userId } = await auth();
  if (!userId) throw new Error(errorMessage.stripe.noUser);

  const subscription = await getNotCachedSubscription(userId);
  if (!subscription?.stripeCustomerId)
    throw new Error(errorMessage.stripe.noSubscription);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_SITE_URL + siteHref.subscription()}`,
  });

  redirect(portalSession.url);
}

async function getCheckoutSession(tier: SubscriptionPaidTiersName, user: User) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: { clerk_user_id: user.id },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_SITE_URL + siteHref.subscription()}`,
    cancel_url: `${env.NEXT_PUBLIC_SITE_URL + siteHref.subscription()}`,
  });

  return session.url;
}
async function getSubscriptionUpdateSession(
  tier: SubscriptionPaidTiersName,
  subscription: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeSubscriptionItemId: string | null;
  },
) {
  if (
    !subscription.stripeCustomerId ||
    !subscription.stripeSubscriptionId ||
    !subscription.stripeSubscriptionItemId
  ) {
    throw new Error(errorMessage.stripe.noSubscription);
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_SITE_URL + siteHref.subscription()}`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  });

  return portalSession.url;
}
