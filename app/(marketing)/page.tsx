import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subtitle, title } from "@/config/class-variants";
import {
  subscriptionData,
  subscriptionTires,
} from "@/config/subscription-tire";
import { CircleCheck } from "lucide-react";
import numbro from "numbro";

export default function Page() {
  return (
    <>
      <Section>
        <h1 className={title()}>Price Smarter, Sell bigger!</h1>
        <h2 className={subtitle({ class: "max-w-prose text-center" })}>
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location-based dynamic pricing
        </h2>
        <div className="flex flex-col w-full sm:w-fit sm:flex-row gap-4">
          <Button variant="outline">Book a demo</Button>
          <Button>Get started for free </Button>
        </div>
      </Section>

      <Section className="gap-16">
        <h1 className={title({ class: "text-center text-balance" })}>
          {subscriptionData.title}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-16">
          {subscriptionTires.map((tire) => (
            <Card key={tire.name}>
              <CardHeader>
                <CardTitle>{tire.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <h1 className={title({ size: "sm" })}>
                  <span>
                    {numbro(tire.price).formatCurrency({
                      thousandSeparated: true,
                      mantissa: 2,
                      spaceSeparated: true,
                    })}
                  </span>
                  <span className={subtitle()}>/month</span>
                </h1>
                <h2 className={subtitle({ class: "flex gap-2 font-bold" })}>
                  <span>
                    {numbro(tire.maxNumberOfVisits).format({
                      thousandSeparated: true,
                      mantissa: 0,
                      average: true,
                    })}
                  </span>
                  <span> page visits</span>
                </h2>
                <Button className="w-full">Get started</Button>
                <p className={subtitle({ class: "text-primary" })}>
                  {tire.maxNumberOfProducts} product
                  {tire.maxNumberOfProducts !== 1 && "s"}
                </p>
                {tire.canAccessAnalytics && <Feature title="Analytics" />}
                {tire.canCustomizeBanner && <Feature title="Custom banner" />}
                {tire.canRemoveBranding && <Feature title="Remove branding" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
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
