/**
 * @file Hooks de Metadados estáticos.
 *
 * Cacheados com `staleTime: Infinity` pois os dados
 * (cores de status, tipos, prioridades) não mudam em runtime.
 *
 * @module hooks/useMetadata
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { metadataService } from "@/lib/metadataService";

export function useStatusColors() {
  return useQuery({
    queryKey: queryKeys.metadata.statusColors,
    queryFn: metadataService.getStatusColors,
    staleTime: Infinity,
  });
}

export function useProcessTypes() {
  return useQuery({
    queryKey: queryKeys.metadata.processTypes,
    queryFn: metadataService.getProcessTypes,
    staleTime: Infinity,
  });
}

export function usePriorities() {
  return useQuery({
    queryKey: queryKeys.metadata.priorities,
    queryFn: metadataService.getPriorities,
    staleTime: Infinity,
  });
}
