"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  StatusBadge,
  PriorityBadge,
  TypeBadge,
} from "@/components/ui/status-badge";
import {
  useProcesses,
  useDeleteProcess,
  useCreateProcess,
} from "@/features/processes";
import { ProcessForm } from "@/features/processes/components/process-form";
import type { ProcessFormOutput } from "@/features/processes/components/process-form";
import type { ICreateProcessInput } from "@/types";
import { useAreas } from "@/features/areas";
import type { IProcessFilters } from "@/features/processes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IProcessWithRelations } from "@/types";
import Link from "next/link";

type SortableColumn = "title" | "status" | "type" | "priority";

export default function ProcessesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<IProcessFilters>({
    page: 1,
    limit: 10,
  });
  const [searchInput, setSearchInput] = useState("");
  const [deleteTarget, setDeleteTarget] =
    useState<IProcessWithRelations | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useProcesses(filters);
  const areas = useAreas(1, 100);
  const deleteMutation = useDeleteProcess();
  const createMutation = useCreateProcess();

  function handleSearch() {
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  }

  function setFilter(key: keyof IProcessFilters, value: string | undefined) {
    setFilters((f) => ({
      ...f,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  }

  async function onDelete() {
    if (deleteTarget) {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  async function onCreateSubmit(values: ProcessFormOutput) {
    await createMutation.mutateAsync(values as unknown as ICreateProcessInput);
    setCreateOpen(false);
  }

  function toggleSort(column: SortableColumn) {
    setFilters((f) => {
      if (f.orderBy === column) {
        if (f.order === "asc") return { ...f, order: "desc" };
        // Already desc → remove sorting
        const { orderBy: _, order: __, ...rest } = f;
        return rest;
      }
      return { ...f, orderBy: column, order: "asc", page: 1 };
    });
  }

  function SortIcon({ column }: { column: SortableColumn }) {
    if (filters.orderBy !== column)
      return <ArrowUpDown className="ml-1 h-3 w-3" />;
    return filters.order === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Processos</h2>
          <p className="text-muted-foreground">
            Lista completa de processos mapeados.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Processo
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por título..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(v) => setFilter("status", v)}
        >
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="Planejado">Planejado</SelectItem>
            <SelectItem value="Em_Andamento">Em Andamento</SelectItem>
            <SelectItem value="Concluido">Concluído</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? "all"}
          onValueChange={(v) => setFilter("type", v)}
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Tipos</SelectItem>
            <SelectItem value="Sistemico">Sistêmico</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority ?? "all"}
          onValueChange={(v) => setFilter("priority", v)}
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Media">Média</SelectItem>
            <SelectItem value="Baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.areaId ?? "all"}
          onValueChange={(v) => setFilter("areaId", v)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Áreas</SelectItem>
            {areas.data?.data.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="secondary" onClick={handleSearch}>
          Buscar
        </Button>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Erro ao carregar os processos.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : data && data.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GitBranch className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">
              Nenhum processo encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.status || filters.type
                ? "Nenhum processo corresponde aos filtros."
                : "Comece criando o primeiro processo."}
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro processo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      type="button"
                      className="inline-flex items-center font-semibold hover:text-foreground"
                      onClick={() => toggleSort("title")}
                    >
                      Título <SortIcon column="title" />
                    </button>
                  </TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="inline-flex items-center font-semibold hover:text-foreground"
                      onClick={() => toggleSort("status")}
                    >
                      Status <SortIcon column="status" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="inline-flex items-center font-semibold hover:text-foreground"
                      onClick={() => toggleSort("type")}
                    >
                      Tipo <SortIcon column="type" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="inline-flex items-center font-semibold hover:text-foreground"
                      onClick={() => toggleSort("priority")}
                    >
                      Prioridade <SortIcon column="priority" />
                    </button>
                  </TableHead>
                  <TableHead className="w-35 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((proc) => (
                  <TableRow key={proc.id}>
                    <TableCell className="font-medium">{proc.title}</TableCell>
                    <TableCell>{proc.area.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={proc.status} />
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={proc.type} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={proc.priority} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/processes/${proc.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/processes/${proc.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(proc)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {data.page} de {data.totalPages} ({data.total} processos)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(filters.page ?? 1) <= 1}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: (f.page ?? 2) - 1 }))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(filters.page ?? 1) >= (data?.totalPages ?? 1)}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialog Excluir */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Processo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o processo{" "}
              <strong>{deleteTarget?.title}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Criar Processo */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Processo</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo processo.
            </DialogDescription>
          </DialogHeader>
          <ProcessForm
            onSubmit={onCreateSubmit}
            isPending={createMutation.isPending}
            submitLabel="Criar Processo"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
