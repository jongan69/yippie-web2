import * as React from "react";
import Link from "next/link";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex flex-wrap items-center justify-between md:flex-nowrap md:py-2">
      <Link href="/" className="flex items-center space-x-10">
        <Icons.logo className="size-6" />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex flex-wrap gap-2">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-xs font-medium md:text-sm lg:text-base",
                    item.disabled ? "cursor-not-allowed opacity-80" : "text-muted-foreground hover:text-opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
