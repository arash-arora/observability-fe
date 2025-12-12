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
  Server,
  Database,
  FileCode,
  Globe,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Terminal,
} from "lucide-react";

export default function MCPPage() {
  interface MCPServer {
    id: string;
    name: string;
    type: string;
    status: string;
    details: string;
    lastSync: string;
    icon: React.ReactNode;
  }

  const [mcpServers, setMcpServers] = useState<MCPServer[]>([
    // {
    //   id: "mcp-fs",
    //   name: "Filesystem Server",
    //   type: "stdio",
    //   status: "connected",
    //   details: "Access local files safely",
    //   lastSync: "1 min ago",
    //   icon: <FileCode className="h-5 w-5" />,
    // },
    // {
    //   id: "mcp-pg",
    //   name: "PostgreSQL Adapter",
    //   type: "sse",
    //   status: "connected",
    //   details: "Read/Write to production DB",
    //   lastSync: "5 mins ago",
    //   icon: <Database className="h-5 w-5" />,
    // },
    // {
    //   id: "mcp-gh",
    //   name: "GitHub MCP",
    //   type: "stdio",
    //   status: "disconnected",
    //   details: "Repository search & management",
    //   lastSync: "2 days ago",
    //   icon: <Globe className="h-5 w-5" />,
    // },
  ]);

  const [integrations, setIntegrations] = useState([
    {
      id: "servicenow-1",
      platform: "ServiceNow",
      name: "IT Service Management",
      status: "connected",
      category: "enterprise",
      lastSync: "10 mins ago",
      icon: "🔧",
      color: "from-green-600 to-teal-600",
    },
    {
      id: "slack-1",
      platform: "Slack",
      name: "Team Workspace",
      status: "connected",
      category: "communication",
      lastSync: "1 min ago",
      icon: "💬",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "jira-1",
      platform: "Jira",
      name: "Project Management",
      status: "connected",
      category: "enterprise",
      lastSync: "30 mins ago",
      icon: "📋",
      color: "from-blue-600 to-blue-700",
    },
  ]);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            MCP & Integrations
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage Model Context Protocol servers and external tool integrations
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Server
        </Button>
      </div>

      {/* MCP Servers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Active MCP Servers
          </h3>
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Protocol v1.0
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {mcpServers.map((server) => (
            <Card key={server?.id} className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {server.name}
                </CardTitle>
                <div className="p-2 bg-muted rounded-md">{server.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {server.details}
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={server.status === "connected" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {server.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {server.type.toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="hover-lift border-dashed border-2 cursor-pointer group flex flex-col items-center justify-center p-6 text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium text-sm">Connect New Server</span>
          </Card>
        </div>
      </div>

      {/* Legacy Integrations Section (Moved from Integrations) */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          External Tools
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card
              key={integration.id}
              className="hover-lift overflow-hidden relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-base">
                      {integration.platform}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {integration.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Synced {integration.lastSync}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Terminal View for Debugging */}
      <Card className="bg-slate-950 text-slate-50 border-slate-800">
        <CardHeader className="py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-mono font-medium">MCP Debug Console</span>
          </div>
        </CardHeader>
        <CardContent className="py-4 font-mono text-xs space-y-1 opacity-80">
          <div className="flex gap-2">
            <span className="text-slate-500">[12:01:45]</span>
            <span className="text-emerald-400">INFO</span>
            <span>mcp-fs: Connection established (stdio)</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500">[12:01:46]</span>
            <span className="text-emerald-400">INFO</span>
            <span>mcp-pg: Listening on SSE channel /events</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500">[12:02:10]</span>
            <span className="text-blue-400">DEBUG</span>
            <span>slack-1: Webhook received - event_id: ev_889900</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
