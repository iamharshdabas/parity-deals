import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { siteHref } from "@/config/site";

export default function NoPermissionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Denied</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          You don&apos;t have permission to perform this action. Please upgrade
          your account to access this feature.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={siteHref.subscription()}>Upgrade Account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
