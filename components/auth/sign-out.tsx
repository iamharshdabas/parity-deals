"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <ClerkSignOutButton>
      <Button>Sign out</Button>
    </ClerkSignOutButton>
  );
}
