"use client";

import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Calendar,
  FolderTree,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useArea, useUpdateArea } from "@/features/areas";
import type { IAreaFormData } from "@/types";

const areaSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres.").max(255),
});

export default function AreaDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: area, isLoading, isError, refetch } = useArea(params.id);
  const updateMutation = useUpdateArea();
  const [editOpen, setEditOpen] = useState(false);

  const form = useForm<IAreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: { name: "" },
  });

  function openEdit() {
    if (area) {
      form.reset({ name: area.name });
      setEditOpen(true);
    }
  }

  async function onSubmit(values: IAreaFormData) {
    if (area) {
      await updateMutation.mutateAsync({ id: area.id, data: values });
      setEditOpen(false);
      refetch();
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">Erro ao carregar a área.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!area) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/areas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FolderTree className="h-6 w-6 text-primary" />
              {area.name}
            </h2>
            <p className="text-muted-foreground">
              Detalhes da área organizacional
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/areas/${area.id}/tree`}>
              <GitBranch className="mr-2 h-4 w-4" />
              Árvore de Processos
            </Link>
          </Button>
          <Button onClick={openEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {area.processCount ?? 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              processos vinculados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Criado em</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-lg font-medium">
                {new Date(area.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Última atualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-lg font-medium">
                {new Date(area.updatedAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Área</DialogTitle>
            <DialogDescription>
              Altere o nome da área organizacional.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: Recursos Humanos"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
