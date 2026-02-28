"use client";

import { FolderTree, GitBranch, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAreas } from "@/features/areas";
import { useProcesses } from "@/features/processes";
import Link from "next/link";

export default function DashboardPage() {
  const areas = useAreas(1, 1);
  const processes = useProcesses({ page: 1, limit: 1 });

  const stats = [
    {
      title: "Áreas Cadastradas",
      value: areas.data?.total,
      icon: FolderTree,
      href: "/areas",
      loading: areas.isLoading,
    },
    {
      title: "Processos Mapeados",
      value: processes.data?.total,
      icon: GitBranch,
      href: "/processes",
      loading: processes.isLoading,
    },
    {
      title: "Status da API",
      value: areas.isError ? "Offline" : "Online",
      icon: Activity,
      href: "#",
      loading: areas.isLoading,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do mapeamento de processos organizacionais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value ?? "—"}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
