import { Button } from "@/components/ui/button";
import { subtitle, title } from "@/config/class-variants";

export default function Page() {
  return (
    <>
      <section className="flex min-h-screen flex-col justify-center py-24 items-center gap-8">
        <h1 className={title()}>Price Smarter, Sell bigger!</h1>
        <h2 className={subtitle({ class: "max-w-prose text-center" })}>
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location-based dynamic pricing
        </h2>
        <div className="flex flex-col w-full sm:w-fit sm:flex-row gap-4">
          <Button variant="outline">Book a demo</Button>
          <Button>Get started for free </Button>
        </div>
      </section>
    </>
  );
}
