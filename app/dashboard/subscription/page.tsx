import PageWrapper from "@/components/layout/page-wrapper";
import SubscriptionTiers from "@/components/subscription/tiers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { subtitle, title } from "@/config/class-variants";
import { subscriptionTiers } from "@/config/subscription-tier";
import { formatNumber } from "@/lib/utils";
import { createCustomerProtalSession } from "@/server/action/stripe";
import { getProductsCount } from "@/server/db/product/get";
import { getProductsViewCount } from "@/server/db/productViews/get";
import { getSubscriptionTier } from "@/server/db/subscription/get";
import { auth } from "@clerk/nextjs/server";
import { startOfMonth } from "date-fns";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const tier = await getSubscriptionTier(userId);
  const productsCount = await getProductsCount(userId);
  const productsViewCount = await getProductsViewCount(
    userId,
    startOfMonth(new Date()),
  );

  return (
    <PageWrapper>
      <h1 className={title({ size: "sm", class: "py-4" })}>
        Your subscription
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {formatNumber(productsViewCount)}/
              {formatNumber(tier.maxNumberOfVisits)}&nbsp;
              <span className={subtitle()}>pricing page visits this month</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={(productsViewCount / tier.maxNumberOfVisits) * 100}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {formatNumber(productsCount)}/
              {formatNumber(tier.maxNumberOfProducts)}&nbsp;
              <span className={subtitle()}>products created</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={(productsCount / tier.maxNumberOfProducts) * 100}
            />
          </CardContent>
        </Card>
      </div>
      {tier !== subscriptionTiers.Free && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>You are currently on the {tier.name} plan </CardTitle>
            <CardDescription>
              If you would like to upgrade, cancel or change your payment
              method. Use the button below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerProtalSession}>
              <Button>Manage subscription</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="my-8">
        <SubscriptionTiers manageable currentTier={tier} />
      </div>
    </PageWrapper>
  );
}
