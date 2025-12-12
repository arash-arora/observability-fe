"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  List,
  History,
  Terminal,
  Database,
  BarChart,
  Box,
  Settings,
  BookOpen,
  LifeBuoy,
  CheckSquare,
  Cloud,
  Bell,
  FileText,
  Shield,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const allSidebarItems = [
  { id: "dashboard", name: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "traces", name: "Traces", href: "/traces", icon: List },
  { id: "watchtower", name: "AI Insights Tower", href: "/insightstower", icon: Eye },
  { id: "evaluations", name: "Evaluations", href: "/evaluations", icon: CheckSquare },
  { id: "promptops", name: "PromptOps", href: "/promptops", icon: FileText },
  { id: "mcp", name: "MCP & Tools", href: "/mcp", icon: Database },
  { id: "integrations", name: "Integrations", href: "/integrations", icon: Cloud },
];

const allBottomItems = [
  { id: "notifications", name: "Notifications", href: "/notifications", icon: Bell },
  { id: "settings", name: "Settings", href: "/settings", icon: Settings },
  { id: "admin", name: "Admin", href: "/admin", icon: Shield },
  { id: "documentation", name: "Documentation", href: "#", icon: BookOpen },
  { id: "support", name: "Support", href: "#", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();
  const [sidebarItems, setSidebarItems] = useState(allSidebarItems);
  const [bottomItems, setBottomItems] = useState(allBottomItems);

  useEffect(() => {
    const updateVisibility = () => {
      const saved = localStorage.getItem("pageConfigs");
      if (saved) {
        try {
          const configs = JSON.parse(saved);
          
          // Filter main navigation items
          const visibleMainItems = allSidebarItems.filter((item) => {
            const config = configs.find((c: any) => c.id === item.id);
            return config ? config.visible : true;
          });
          
          // Filter bottom navigation items
          const visibleBottomItems = allBottomItems.filter((item) => {
            const config = configs.find((c: any) => c.id === item.id);
            return config ? config.visible : true;
          });
          
          setSidebarItems(visibleMainItems);
          setBottomItems(visibleBottomItems);
        } catch (error) {
          console.error("Error parsing page configs:", error);
        }
      }
    };

    // Initial load
    updateVisibility();

    // Listen for config updates
    const handleConfigUpdate = () => {
      updateVisibility();
    };

    window.addEventListener("pageConfigUpdated", handleConfigUpdate);
    window.addEventListener("storage", updateVisibility);

    return () => {
      window.removeEventListener("pageConfigUpdated", handleConfigUpdate);
      window.removeEventListener("storage", updateVisibility);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r bg-gradient-to-b from-muted/30 to-background text-foreground overflow-x-hidden shadow-sm">
      <div className="flex h-14 items-center border-b px-4 font-bold text-xl bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <BarChart className="h-5 w-5 text-white" />
          </div> */}
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Observability Tool
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {pathname === item.href && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn(
                "h-4 w-4 transition-transform duration-200",
                pathname === item.href && "scale-110"
              )} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4 bg-muted/20 backdrop-blur-sm">
        <nav className="grid gap-1">
          {bottomItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
