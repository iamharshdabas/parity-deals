import { siteHref } from "@/config/site";
import Link from "next/link";
import { Button } from "../ui/button";

export default function UpgradeAccount() {
  return (
    <Button size="sm" asChild>
      <Link href={siteHref.subscription()}>Upgrade Account</Link>
    </Button>
  );
}
