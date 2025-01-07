import PageWrapper from "@/components/layout/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { subtitle, title } from "@/config/class-variants";
import { formatNumber } from "@/lib/utils";
import {
  getProductsCount,
  getProductsViewCount,
} from "@/server/db/product/get";
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
              <span className={subtitle()}>visits per month</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={productsViewCount / tier.maxNumberOfVisits} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {formatNumber(productsCount)}/
              {formatNumber(tier.maxNumberOfProducts)}&nbsp;
              <span className={subtitle()}>number of products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={productsCount / tier.maxNumberOfProducts} />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
