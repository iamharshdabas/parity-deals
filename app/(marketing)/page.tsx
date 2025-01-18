import Section from "@/components/layout/section";
import SubscriptionTiers from "@/components/subscription/tiers";
import { Button } from "@/components/ui/button";
import { subtitle, title } from "@/config/class-variants";
import { siteHref } from "@/config/site";
import { subscriptionData } from "@/config/subscription-tier";
import Link from "next/link";

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
          <Button asChild>
            <Link href={siteHref.dashboard()}>Get started for free</Link>
          </Button>
        </div>
      </Section>

      <Section className="gap-16">
        <h1 className={title({ class: "text-center text-balance" })}>
          {subscriptionData.title}
        </h1>
        <SubscriptionTiers />
      </Section>
    </>
  );
}
