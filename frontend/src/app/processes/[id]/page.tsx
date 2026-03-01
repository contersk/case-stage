"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  StatusBadge,
  PriorityBadge,
  TypeBadge,
} from "@/components/ui/status-badge";
import { useProcess, useUpdateProcess } from "@/features/processes";
import { ProcessForm } from "@/features/processes/components/process-form";
import type { ProcessFormOutput } from "@/features/processes/components/process-form";
import type { IUpdateProcessInput } from "@/types";

export default function ProcessDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: process, isLoading, isError, refetch } = useProcess(params.id);
  const [editOpen, setEditOpen] = useState(false);
  const updateMutation = useUpdateProcess();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Erro ao carregar o processo.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!process) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/processes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {process.title}
            </h2>
            <p className="text-muted-foreground">Área: {process.area.name}</p>
          </div>
        </div>
        <Button onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={process.status} />
        <TypeBadge type={process.type} />
        <PriorityBadge priority={process.priority} />
      </div>

      {/* Descrição */}
      {process.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {process.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Datas */}
      {(process.startDate || process.endDate) && (
        <div className="flex gap-6">
          {process.startDate && (
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Início:{" "}
                {new Date(process.startDate).toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}
          {process.endDate && (
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Fim: {new Date(process.endDate).toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Responsáveis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Responsáveis ({process.responsibles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {process.responsibles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum.</p>
            ) : (
              <ul className="space-y-2">
                {process.responsibles.map((r) => (
                  <li
                    key={r.id}
                    className="text-sm flex items-center justify-between"
                  >
                    <span>{r.name}</span>
                    {r.role && (
                      <Badge variant="outline" className="text-xs">
                        {r.role}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Ferramentas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Ferramentas ({process.tools.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {process.tools.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {process.tools.map((t) => (
                  <Badge key={t.id} variant="secondary">
                    {t.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Documentos ({process.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {process.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum.</p>
            ) : (
              <ul className="space-y-1.5">
                {process.documents.map((doc) => (
                  <li key={doc.id} className="text-sm">
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {doc.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span>{doc.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Processo Pai */}
      {process.parent && (
        <>
          <Separator />
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Processo Pai:</span>
            <Link
              href={`/processes/${process.parent.id}`}
              className="text-primary hover:underline"
            >
              {process.parent.title}
            </Link>
          </div>
        </>
      )}

      {/* Subprocessos */}
      {process.children.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Subprocessos ({process.children.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {process.children.map((child) => (
                  <li
                    key={child.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <Link
                      href={`/processes/${child.id}`}
                      className="text-primary hover:underline"
                    >
                      {child.title}
                    </Link>
                    <StatusBadge status={child.status} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialog Editar Processo */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar: {process.title}</DialogTitle>
            <DialogDescription>Altere os dados do processo.</DialogDescription>
          </DialogHeader>
          <ProcessForm
            defaultValues={process}
            onSubmit={async (values: ProcessFormOutput) => {
              await updateMutation.mutateAsync({
                id: params.id,
                data: values as unknown as IUpdateProcessInput,
              });
              setEditOpen(false);
              refetch();
            }}
            isPending={updateMutation.isPending}
            submitLabel="Salvar Alterações"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
