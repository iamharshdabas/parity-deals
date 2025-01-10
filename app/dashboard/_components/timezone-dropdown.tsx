"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createURL, siteHref } from "@/config/site";
import Link from "next/link";

export function TimezoneDropdown({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <DropdownMenuItem asChild>
      <Link
        href={createURL(siteHref.analytics(), searchParams, {
          timezone: userTimezone,
        })}
      >
        {userTimezone}
      </Link>
    </DropdownMenuItem>
  );
}
