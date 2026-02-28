"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { processesService, type IProcessFilters } from "./service";
import type { ICreateProcessInput, IUpdateProcessInput } from "@/types";
import { toast } from "sonner";
import { extractApiError } from "@/lib/axios";

/** Hook de listagem paginada de processos com filtros dinâmicos (search, status, type, priority, areaId). */
export function useProcesses(filters: IProcessFilters = {}) {
  return useQuery({
    queryKey: queryKeys.processes.list(filters),
    queryFn: () => processesService.getAll(filters),
  });
}

export function useProcess(id: string) {
  return useQuery({
    queryKey: queryKeys.processes.detail(id),
    queryFn: () => processesService.getById(id),
    enabled: !!id,
  });
}

/** Hook para buscar a árvore hierárquica de processos de uma área. Alimenta o React Flow. */
export function useProcessTree(areaId: string) {
  return useQuery({
    queryKey: queryKeys.areas.tree(areaId),
    queryFn: () => processesService.getTree(areaId),
    enabled: !!areaId,
  });
}

/** Mutation de criação de processo. Invalida cache de processos e áreas (trees). */
export function useCreateProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateProcessInput) => processesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.processes.all });
      qc.invalidateQueries({ queryKey: ["areas"] }); // invalidar trees
      toast.success("Processo criado com sucesso!");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });
}

/** Mutation de atualização de processo. Invalida cache de processos e áreas (trees). */
export function useUpdateProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateProcessInput }) =>
      processesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.processes.all });
      qc.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Processo atualizado com sucesso!");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });
}

/** Mutation de exclusão de processo. Invalida cache de processos e áreas (trees). */
export function useDeleteProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => processesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.processes.all });
      qc.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Processo excluído com sucesso!");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });
}
