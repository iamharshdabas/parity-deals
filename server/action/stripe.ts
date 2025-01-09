"use server";

import {
  SubscriptionPaidTiersName,
  subscriptionTiers,
} from "@/config/subscription-tier";
import { currentUser, User } from "@clerk/nextjs/server";
import { getSubscription } from "../db/subscription/get";
import { Stripe } from "stripe";
import { env } from "@/lib/env";
import { siteHref } from "@/config/site";
import { redirect } from "next/navigation";
import { errorMessage } from "@/config/message";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createCancelSession() {}

export async function createCheckoutSession(tier: SubscriptionPaidTiersName) {
  const user = await currentUser();
  if (!user) throw new Error(errorMessage.stripe.noUser);

  const subscription = await getSubscription(user.id);
  if (!subscription) throw new Error(errorMessage.stripe.noSubscription);

  if (!subscription.stripeCustomerId) {
    const url = await getCheckoutSession(tier, user);
    if (!url) throw new Error(errorMessage.stripe.FailedCheckoutSession);
    redirect(url);
  } else {
    // TODO: Handle case where user already has a stripeCustomerId
  }
}

export async function createCustomerProtalSession() {}

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
