"use server";

import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { createSubscription } from "@/server/db/subscription/create";
import { getNotCachedSubscription } from "@/server/db/subscription/get";
import { deleteUser } from "@/server/db/user/delete";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const clerkId = event.data.id;

  if (!clerkId) return null;

  switch (event.type) {
    case "user.created":
      await createSubscription({ clerkId });
      break;
    case "user.deleted":
      const subscription = await getNotCachedSubscription(clerkId);
      if (subscription?.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(subscription?.stripeSubscriptionId);
      }
      await deleteUser(clerkId);
      break;
    default:
      console.error(`Unknown webhook event type: ${event.type}`);
      break;
  }

  return new Response("", { status: 200 });
}
