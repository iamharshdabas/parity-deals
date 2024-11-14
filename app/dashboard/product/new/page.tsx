import { auth } from "@clerk/nextjs/server";
import NewProduct from "../../_components/form/newProduct";
import BackButton from "@/components/layout/back-button";
import { siteHref } from "@/config/site";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <BackButton backButtonHref={siteHref.dashboard()}>
      <NewProduct clerkId={userId} />
    </BackButton>
  );
}
