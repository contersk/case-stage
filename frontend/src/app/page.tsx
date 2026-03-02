"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  FolderTree,
  GitBranch,
  Trophy,
  BarChart3,
  PieChartIcon,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAreas } from "@/features/areas";
import { useProcesses } from "@/features/processes";
import {
  useStatsByStatus,
  useStatsByArea,
  useStatsByPriority,
  useStatsByType,
} from "@/hooks/useDashboard";
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
} from "@/lib/statusConfig";
import type { ProcessStatus, ProcessPriority, ProcessType } from "@/types";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [areaFilter, setAreaFilter] = useState<string | undefined>(undefined);
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === "dark" ? "#e2e8f0" : "#1e293b";

  const areas = useAreas(1, 1);
  const allAreas = useAreas(1, 100);
  const processes = useProcesses({ page: 1, limit: 1 });

  const statsByStatus = useStatsByStatus(areaFilter);
  const statsByArea = useStatsByArea();
  const statsByPriority = useStatsByPriority(areaFilter);
  const statsByType = useStatsByType(areaFilter);

  // Prepare chart data
  const statusData = (statsByStatus.data ?? []).map((item) => {
    const config = STATUS_CONFIG[item.status as ProcessStatus];
    return {
      name: config?.label ?? item.status,
      value: item.count,
      fill: config?.hex ?? "#94a3b8",
    };
  });

  const priorityData = (statsByPriority.data ?? []).map((item) => {
    const config = PRIORITY_CONFIG[item.priority as ProcessPriority];
    return {
      name: config?.label ?? item.priority,
      value: item.count,
      fill: config?.hex ?? "#94a3b8",
    };
  });

  const typeData = (statsByType.data ?? []).map((item) => {
    const config = TYPE_CONFIG[item.type as ProcessType];
    return {
      name: config?.label ?? item.type,
      value: item.count,
      fill: config?.hex ?? "#94a3b8",
    };
  });

  const leaderboardData = statsByArea.data ?? [];
  const maxProcessCount = Math.max(
    ...leaderboardData.map((a) => a.processCount),
    1,
  );

  const totalProcessos = statusData.reduce((sum, d) => sum + d.value, 0);

  const stats = [
    {
      title: "Áreas Cadastradas",
      value: areas.data?.total,
      icon: FolderTree,
      href: "/areas",
      loading: areas.isLoading,
      accent: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Processos Mapeados",
      value: processes.data?.total,
      icon: GitBranch,
      href: "/processes",
      loading: processes.isLoading,
      accent: "text-violet-600 dark:text-violet-400",
    },
  ];

  // pagina dashboard com filtros e gráficos usando os hooks de dashboard para obter os dados agregados, e componentes de UI para exibir as informações de forma visual e interativa.

  return (
    <div className="space-y-8">
      {/* Header + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do mapeamento de processos organizacionais.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={areaFilter ?? "all"}
            onValueChange={(v) => setAreaFilter(v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filtrar por área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {allAreas.data?.data.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.accent}`} />
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

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie Chart - Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Processos por Status</CardTitle>
            </div>
            <CardDescription>
              Distribuição de {totalProcessos} processos por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsByStatus.isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
            ) : statusData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Nenhum dado disponível
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`status-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      backgroundColor: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                    formatter={(value) => {
                      const v = Number(value) || 0;
                      const pct = totalProcessos
                        ? ((v / totalProcessos) * 100).toFixed(0)
                        : 0;
                      return [`${v} (${pct}%)`, "Qtd"];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Priority */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">
                Processos por Prioridade
              </CardTitle>
            </div>
            <CardDescription>
              Distribuição de processos por nível de prioridade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsByPriority.isLoading ? (
              <div className="space-y-4 pt-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : priorityData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Nenhum dado disponível
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={priorityData}
                  layout="vertical"
                  margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{
                      fill: axisColor,
                      fontSize: 12,
                    }}
                    stroke={axisColor}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={70}
                    tick={{
                      fill: axisColor,
                      fontSize: 12,
                    }}
                    stroke={axisColor}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      backgroundColor: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                    cursor={false}
                    formatter={(value) => [`${value}`, "Processos"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`priority-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart - Type */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Processos por Tipo</CardTitle>
            </div>
            <CardDescription>Sistêmicos vs Manuais</CardDescription>
          </CardHeader>
          <CardContent>
            {statsByType.isLoading ? (
              <div className="space-y-4 pt-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : typeData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Nenhum dado disponível
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={typeData}
                  layout="vertical"
                  margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{
                      fill: axisColor,
                      fontSize: 12,
                    }}
                    stroke={axisColor}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{
                      fill: axisColor,
                      fontSize: 12,
                    }}
                    stroke={axisColor}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      backgroundColor: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                    cursor={false}
                    formatter={(value) => [`${value}`, "Processos"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                    {typeData.map((entry, index) => (
                      <Cell key={`type-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard - Areas by process count */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <CardTitle className="text-base">Ranking de Áreas</CardTitle>
            </div>
            <CardDescription>
              Áreas com maior volume de processos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsByArea.isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Nenhuma área cadastrada
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboardData.map((area, index) => {
                  const percentage =
                    (area.processCount / maxProcessCount) * 100;
                  const medals = ["🥇", "🥈", "🥉"];
                  const medal = medals[index];

                  return (
                    <Link
                      key={area.id}
                      href={`/areas/${area.id}/tree`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 rounded-lg p-2 transition-colors">
                        <span className="text-lg w-8 text-center shrink-0">
                          {medal ?? (
                            <span className="text-sm text-muted-foreground font-medium">
                              {index + 1}º
                            </span>
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">
                              {area.name}
                            </span>
                            <span className="text-sm font-bold text-muted-foreground ml-2 shrink-0">
                              {area.processCount}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
