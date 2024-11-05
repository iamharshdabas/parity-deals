"use client";

import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignInButton() {
  return (
    <ClerkSignInButton>
      <Button>Sign In</Button>
    </ClerkSignInButton>
  );
}
