"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { areasService } from "./service";
import type { IAreaFormData } from "@/types";
import { toast } from "sonner";
import { extractApiError } from "@/lib/axios";

/** Hook de listagem paginada de áreas com filtro opcional por nome. */
export function useAreas(page = 1, limit = 20, filter?: string) {
  return useQuery({
    queryKey: queryKeys.areas.list(page, limit, filter),
    queryFn: () => areasService.getAll(page, limit, filter),
  });
}

export function useArea(id: string) {
  return useQuery({
    queryKey: queryKeys.areas.detail(id),
    queryFn: () => areasService.getById(id),
    enabled: !!id,
  });
}

/** Mutation para criação de área. Invalida cache de listagem e exibe toast de sucesso/erro. */
export function useCreateArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: IAreaFormData) => areasService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.areas.all });
      toast.success("Área criada com sucesso!");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });
}

/** Mutation para atualização de área. Invalida cache e exibe toast. */
export function useUpdateArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IAreaFormData> }) =>
      areasService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.areas.all });
      toast.success("Área atualizada com sucesso!");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });
}

/** Mutation para exclusão de área. Invalida cache e exibe toast. */
export function useDeleteArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => areasService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.areas.all });
      toast.success("Área excluída com sucesso!");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });
}
