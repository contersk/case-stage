/**
 * @file Hooks de Dashboard — estatísticas agregadas.
 *
 * Consomem o `dashboardService` e permitem filtro opcional
 * por área através do parâmetro `areaId`.
 *
 * @module hooks/useDashboard
 */
import { useQuery } from "@tanstack/react-query";

/** Estatísticas de processos agrupados por status. */
export function useStatsByStatus(areaId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.byStatus(areaId),
    queryFn: () => dashboardService.getByStatus(areaId),
  });
}

export function useStatsByArea() {
  return useQuery({
    queryKey: queryKeys.dashboard.byArea,
    queryFn: () => dashboardService.getByArea(),
  });
}

export function useStatsByPriority(areaId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.byPriority(areaId),
    queryFn: () => dashboardService.getByPriority(areaId),
  });
}

export function useStatsByType(areaId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.byType(areaId),
    queryFn: () => dashboardService.getByType(areaId),
  });
}
