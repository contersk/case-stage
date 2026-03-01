"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCreateProcess } from "@/features/processes";
import { ProcessForm } from "@/features/processes/components/process-form";
import type { ProcessFormOutput } from "@/features/processes/components/process-form";
import type { ICreateProcessInput } from "@/types";

export default function NewProcessPage() {
  const router = useRouter();
  const createMutation = useCreateProcess();

  async function handleSubmit(values: ProcessFormOutput) {
    await createMutation.mutateAsync(values as unknown as ICreateProcessInput);
    router.push("/processes");
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/processes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Novo Processo</h2>
          <p className="text-muted-foreground">
            Preencha os dados para criar um novo processo.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div>
        <ProcessForm
          onSubmit={handleSubmit}
          isPending={createMutation.isPending}
          submitLabel="Criar Processo"
        />
      </div>
    </div>
  );
}
