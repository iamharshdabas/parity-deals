import {
  getSubscriptionTierByPriceId,
  subscriptionTiers,
} from "@/config/subscription-tier";
import { userSubscriptionTable } from "@/drizzle/schema";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { updateSubscription } from "@/server/db/subscription/update";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { Stripe } from "stripe";

export async function POST(request: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    env.STRIPE_WEBHOOK_SECRET,
  );

  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("POST event: %s", event.type); // __AUTO_GENERATED_PRINT_VAR_END__

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

  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleSubscriptionCreated tier: %s", tier); // __AUTO_GENERATED_PRINT_VAR_END__
  const clerkUserId = subscription.metadata.clerk_user_id;
  if (!tier || !clerkUserId) return new Response(null, { status: 500 });

  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleSubscriptionCreated clerkUserId: %s", clerkUserId); // __AUTO_GENERATED_PRINT_VAR_END__
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;
  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleSubscriptionCreated customerId: %s", customerId); // __AUTO_GENERATED_PRINT_VAR_END__
  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleSubscriptionCreated customer: %s", customer); // __AUTO_GENERATED_PRINT_VAR_END__

  return await updateSubscription(
    eq(userSubscriptionTable.clerkId, clerkUserId),
    {
      tier: tier.name,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionItemId: subscription.items.data[0].id,
    },
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const tier = getSubscriptionTierByPriceId(
    subscription.items.data[0].price.id,
  );
  if (!tier) return new Response(null, { status: 500 });

  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleSubscriptionUpdated tier: %s", tier); // __AUTO_GENERATED_PRINT_VAR_END__

  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;
  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleSubscriptionUpdated customerId: %s", customerId); // __AUTO_GENERATED_PRINT_VAR_END__

  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("handleSubscriptionUpdated customer: %s", customer); // __AUTO_GENERATED_PRINT_VAR_END__

  return await updateSubscription(
    eq(userSubscriptionTable.stripeCustomerId, customerId),
    {
      tier: tier.name,
    },
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateSubscription(
    eq(userSubscriptionTable.stripeCustomerId, customerId),
    {
      tier: subscriptionTiers.Free.name,
      stripeSubscriptionId: null,
      stripeSubscriptionItemId: null,
    },
  );
}
