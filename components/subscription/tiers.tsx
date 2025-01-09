import { subtitle, title } from "@/config/class-variants";
import {
  subscriptionData,
  SubscriptionPaidTiersName,
  SubscriptionTier,
  subscriptionTiers,
} from "@/config/subscription-tier";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  createCancelSession,
  createCheckoutSession,
} from "@/server/action/stripe";
import { CircleCheck } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  manageable?: boolean;
  currentTier?: SubscriptionTier;
};

export default function SubscriptionTiers({
  manageable = false,
  currentTier,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-16">
      {subscriptionData.tiers.map((tier) => (
        <Card key={tier.name}>
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <h1 className={title({ size: "sm", class: "pt-4 pb-2" })}>
              <span>{formatCurrency(tier.price)}</span>
              <span className={subtitle()}>/month</span>
            </h1>
            <h2 className={subtitle({ class: "flex gap-2 font-bold" })}>
              <span>{formatNumber(tier.maxNumberOfProducts)}</span>
              <span> page visits</span>
            </h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {manageable ? (
              <form
                action={
                  tier?.name === subscriptionTiers.Free.name
                    ? createCancelSession
                    : createCheckoutSession.bind(
                        null,
                        tier.name as SubscriptionPaidTiersName,
                      )
                }
              >
                <Button
                  className="w-full"
                  disabled={currentTier?.name === tier.name}
                >
                  {currentTier?.name === tier.name ? "Current" : "Swap"}
                </Button>
              </form>
            ) : (
              <Button className="w-full">Get started</Button>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <p className={subtitle({ class: "text-primary" })}>
              {tier.maxNumberOfProducts} product
              {tier.maxNumberOfProducts !== 1 && "s"}
            </p>
            {tier.canAccessAnalytics && <Feature title="Analytics" />}
            {tier.canCustomizeBanner && <Feature title="Custom banner" />}
            {tier.canRemoveBranding && <Feature title="Remove branding" />}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function Feature({ title }: { title: string }) {
  return (
    <div className="flex gap-2">
      <CircleCheck className="stroke-primary bg-primary/25 rounded-full" />
      {title}
    </div>
  );
}
