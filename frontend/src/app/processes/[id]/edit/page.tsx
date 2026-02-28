"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useProcess, useUpdateProcess } from "@/features/processes";
import { ProcessForm } from "@/features/processes/components/process-form";
import type { ProcessFormOutput } from "@/features/processes/components/process-form";
import type { IUpdateProcessInput } from "@/types";

export default function EditProcessPage() {
  const params = useParams<{ id: string }>();
  const processId = params.id;
  const router = useRouter();

  const { data: process, isLoading, isError, refetch } = useProcess(processId);
  const updateMutation = useUpdateProcess();

  async function handleSubmit(values: ProcessFormOutput) {
    await updateMutation.mutateAsync({
      id: processId,
      data: values as unknown as IUpdateProcessInput,
    });
    router.push("/processes");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/processes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isLoading ? (
              <Skeleton className="h-8 w-64 inline-block" />
            ) : (
              `Editar: ${process?.title ?? "Processo"}`
            )}
          </h2>
          <p className="text-muted-foreground">Altere os dados do processo.</p>
        </div>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isError ? (
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
      ) : process ? (
        <div className="max-w-3xl">
          <ProcessForm
            defaultValues={process}
            onSubmit={handleSubmit}
            isPending={updateMutation.isPending}
            submitLabel="Salvar Alterações"
          />
        </div>
      ) : null}
    </div>
  );
}
