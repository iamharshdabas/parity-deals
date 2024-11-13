import { auth } from "@clerk/nextjs/server";
import NewProduct from "../../_components/form/newProduct";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return <NewProduct clerkId={userId} />;
}
