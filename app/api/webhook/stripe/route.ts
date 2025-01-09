import { getSubscriptionTierByPriceId } from "@/config/subscription-tier";
import { userSubscriptionTable } from "@/drizzle/schema";
import { env } from "@/lib/env";
import { updateSubscription } from "@/server/db/subscription/update";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { Stripe } from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "customer.subscription.created": {
      handleSubscriptionCreated(event.data.object);
      break;
    }
    case "customer.subscription.updated": {
      handleSubscriptionUpdated(event.data.object);
      break;
    }
    case "customer.subscription.deleted": {
      handleSubscriptionDeleted(event.data.object);
      break;
    }
  }

  return new Response(null, { status: 200 });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const tier = getSubscriptionTierByPriceId(
    subscription.items.data[0].price.id,
  );
  const clerkUserId = subscription.metadata.clerk_user_id;
  if (!tier || !clerkUserId) return new Response(null, { status: 500 });

  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateSubscription(
    eq(userSubscriptionTable.clerkId, clerkUserId),
    {
      clerkId: clerkUserId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionItemId: subscription.items.data[0].id,
    },
  );
}

function handleSubscriptionUpdated(subscription: Stripe.Subscription) {}

function handleSubscriptionDeleted(subscription: Stripe.Subscription) {}
