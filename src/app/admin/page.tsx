"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Settings,
  Users,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface PageConfig {
  id: string;
  name: string;
  path: string;
  icon: string;
  visible: boolean;
  category: "main" | "bottom";
  description: string;
}

export default function AdminPage() {
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/",
      icon: "LayoutDashboard",
      visible: true,
      category: "main",
      description: "Main analytics dashboard with LLMOps and AgentOps metrics",
    },
    {
      id: "traces",
      name: "Traces",
      path: "/traces",
      icon: "List",
      visible: true,
      category: "main",
      description: "View and analyze all traces and observations",
    },
    {
      id: "watchtower",
      name: "Watch Tower",
      path: "/watchtower",
      icon: "Eye",
      visible: true,
      category: "main",
      description: "Real-time monitoring, diagnosis, resolution, and feedback management",
    },
    {
      id: "evaluations",
      name: "Evaluations",
      path: "/evaluations",
      icon: "CheckSquare",
      visible: true,
      category: "main",
      description: "Evaluate and score traces for quality, performance, and cost",
    },
    {
      id: "promptops",
      name: "PromptOps",
      path: "/promptops",
      icon: "FileText",
      visible: true,
      category: "main",
      description: "Monitor prompt usage, effectiveness, and performance",
    },
    {
      id: "integrations",
      name: "Integrations",
      path: "/integrations",
      icon: "Cloud",
      visible: true,
      category: "main",
      description: "Connect to AWS, Azure, GCP, ServiceNow, and other platforms",
    },
    {
      id: "notifications",
      name: "Notifications",
      path: "/notifications",
      icon: "Bell",
      visible: true,
      category: "bottom",
      description: "View and manage system notifications and alerts",
    },
    {
      id: "settings",
      name: "Settings",
      path: "/settings",
      icon: "Settings",
      visible: true,
      category: "bottom",
      description: "Configure account and application preferences",
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load saved configuration from localStorage
    const saved = localStorage.getItem("pageConfigs");
    if (saved) {
      setPageConfigs(JSON.parse(saved));
    }
  }, []);

  const togglePageVisibility = (id: string) => {
    setPageConfigs((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, visible: !page.visible } : page
      )
    );
    setHasChanges(true);
  };

  const saveConfiguration = () => {
    localStorage.setItem("pageConfigs", JSON.stringify(pageConfigs));
    setHasChanges(false);
    // Trigger a custom event to notify the sidebar
    window.dispatchEvent(new CustomEvent("pageConfigUpdated"));
    alert("Configuration saved successfully!");
  };

  const resetConfiguration = () => {
    const defaultConfigs = pageConfigs.map((page) => ({
      ...page,
      visible: true,
    }));
    setPageConfigs(defaultConfigs);
    setHasChanges(true);
  };

  const visibleCount = pageConfigs.filter((p) => p.visible).length;
  const hiddenCount = pageConfigs.length - visibleCount;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Admin Console
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage page visibility and application settings
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="default" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={resetConfiguration}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
          <Button
            size="sm"
            onClick={saveConfiguration}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-600 dark:text-yellow-500">
                Admin Access Required
              </h4>
              <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
                This page is only accessible to administrators. Changes made here
                will affect all users' navigation experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pages
            </CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageConfigs.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Visible
            </CardTitle>
            <Eye className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visibleCount}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hidden
            </CardTitle>
            <EyeOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hiddenCount}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admin Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Page Visibility Management */}
      <Card>
        <CardHeader>
          <CardTitle>Page Visibility Management</CardTitle>
          <CardDescription>
            Control which pages are visible in the navigation sidebar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Navigation Pages */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Main Navigation
              </h3>
              <div className="space-y-2">
                {pageConfigs
                  .filter((page) => page.category === "main")
                  .map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              page.visible
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {page.visible ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{page.name}</h4>
                              <Badge
                                variant={page.visible ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {page.visible ? "Visible" : "Hidden"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {page.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                              {page.path}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={page.visible ? "outline" : "default"}
                        size="sm"
                        onClick={() => togglePageVisibility(page.id)}
                        className="gap-2"
                      >
                        {page.visible ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Show
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bottom Navigation Pages */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Bottom Navigation
              </h3>
              <div className="space-y-2">
                {pageConfigs
                  .filter((page) => page.category === "bottom")
                  .map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              page.visible
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {page.visible ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{page.name}</h4>
                              <Badge
                                variant={page.visible ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {page.visible ? "Visible" : "Hidden"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {page.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                              {page.path}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={page.visible ? "outline" : "default"}
                        size="sm"
                        onClick={() => togglePageVisibility(page.id)}
                        className="gap-2"
                      >
                        {page.visible ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Show
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest admin actions and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Configuration saved</p>
                <p className="text-xs text-muted-foreground">
                  Page visibility settings updated
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin console accessed</p>
                <p className="text-xs text-muted-foreground">
                  User: admin@example.com
                </p>
              </div>
              <span className="text-xs text-muted-foreground">5 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
