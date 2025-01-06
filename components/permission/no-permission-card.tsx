import { errorMessage } from "@/config/message";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import UpgradeAccount from "./upgrade-account";

export default function NoPermissionCard({
  message = errorMessage.defaultPermission,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{message.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <UpgradeAccount />
      </CardFooter>
    </Card>
  );
}
