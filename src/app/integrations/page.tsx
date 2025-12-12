"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  CheckCircle2,
  XCircle,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([
    {
      id: "azure-1",
      platform: "Azure",
      name: "Development Azure",
      region: "eastus",
      status: "connected",
      subscriptionId: "abc-123-def-456",
      lastSync: "5 minutes ago",
      services: ["OpenAI Service"],
      color: "from-blue-500 to-blue-600",
      category: "cloud",
    },
    {
      id: "aws-1",
      platform: "AWS",
      name: "Production AWS Account",
      region: "us-east-1",
      status: "connected",
      accountId: "123456789012",
      lastSync: "2 minutes ago",
      services: ["Bedrock", "SageMaker"],
      color: "from-orange-500 to-orange-600",
      category: "cloud",
    },
    {
      id: "gcp-1",
      platform: "GCP",
      name: "Analytics GCP Project",
      region: "us-central1",
      status: "disconnected",
      projectId: "my-project-123",
      lastSync: "2 days ago",
      services: ["Vertex AI"],
      color: "from-red-500 to-yellow-500",
      category: "cloud",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const platformLogos = {
    AWS: "☁️",
    Azure: "🔷",
    GCP: "🔴",
    ServiceNow: "🔧",
    Slack: "💬",
    Jira: "📋",
  };

  const getStatusBadge = (status: string) => {
    return status === "connected" ? (
      <Badge variant="default" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Connected
      </Badge>
    ) : (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Disconnected
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Platform Integrations
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Connect to AWS, Azure, GCP and other cloud platforms
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Integrations
            </CardTitle>
            <Cloud className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connected
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter((i) => i.status === "connected").length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AWS
            </CardTitle>
            <span className="text-2xl">☁️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter((i) => i.platform === "AWS").length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Azure + GCP
            </CardTitle>
            <span className="text-2xl">🔷</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                integrations.filter(
                  (i) => i.platform === "Azure" || i.platform === "GCP"
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="hover-lift overflow-hidden relative group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {platformLogos[integration.platform as keyof typeof platformLogos]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {integration.platform}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {integration.name}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(integration.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Region</span>
                  <Badge variant="outline">{integration.region}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="text-sm">{integration.lastSync}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Services</p>
                <div className="flex flex-wrap gap-2">
                  {integration.services.map((service, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {integration.status === "connected" ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <RefreshCw className="h-3 w-3" />
                      Sync
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Button variant="default" size="sm" className="flex-1">
                    Reconnect
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Integration Card */}
        <Card className="hover-lift border-dashed border-2 cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Add New Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect to AWS, Azure, GCP or other platforms
            </p>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Available Platforms</CardTitle>
          <CardDescription>
            Connect to cloud platforms, enterprise tools, and communication services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Cloud Platforms */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Cloud Platforms
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-4xl">☁️</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Amazon Web Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Bedrock, SageMaker
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-4xl">🔷</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Microsoft Azure</h4>
                    <p className="text-sm text-muted-foreground">
                      OpenAI Service, ML
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-4xl">🔴</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Google Cloud</h4>
                    <p className="text-sm text-muted-foreground">
                      Vertex AI, PaLM
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
          <CardDescription>
            Follow these steps to connect your cloud platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Create API Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  Generate API keys or service account credentials in your cloud
                  platform console
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Configure Permissions</h4>
                <p className="text-sm text-muted-foreground">
                  Grant read access to LLM services and monitoring APIs
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Add Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Add Integration" and enter your credentials to connect
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
