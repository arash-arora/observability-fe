"use client";

import { Bell, HelpCircle, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header({ title }: { title?: string }) {
  // For now render a static project name. In future this will come from
  // the API; keep the `title` prop available to override if needed.
  const pageTitle = title ?? "Agents Experiments";

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
          title="Help & Documentation"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <Link
          href="/notifications"
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 group"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full animate-pulse" />
        </Link>
        <Link
          href="/settings"
          className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-all duration-200 cursor-pointer group"
        >
          <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
        </Link>
      </div>
    </header>
  );
}
