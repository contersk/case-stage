"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, GitBranch } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useArea } from "@/features/areas";
import { useProcessTree } from "@/features/processes";
import { ProcessTreeFlow } from "@/features/processes/components/process-tree-flow";
import { ProcessDetailSheet } from "@/features/processes/components/process-detail-sheet";

export default function AreaTreePage() {
  const params = useParams<{ id: string }>();
  const areaId = params.id;

  const { data: area, isLoading: areaLoading } = useArea(areaId);
  const {
    data: tree,
    isLoading: treeLoading,
    isError,
    refetch,
  } = useProcessTree(areaId);

  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleNodeClick(nodeId: string) {
    setSelectedProcessId(nodeId);
    setSheetOpen(true);
  }

  const isLoading = areaLoading || treeLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/areas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {areaLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <>
                <GitBranch className="h-5 w-5 text-primary" />
                {area?.name ?? "Área"} — Árvore de Processos
              </>
            )}
          </h2>
          <p className="text-muted-foreground">
            Visualize a hierarquia completa de processos desta área. Clique em
            um nó para ver os detalhes.
          </p>
        </div>
      </div>

      {/* React Flow */}
      {isLoading ? (
        <Skeleton className="h-150 w-full rounded-lg" />
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Erro ao carregar a árvore de processos.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : tree && tree.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GitBranch className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">
              Nenhum processo nesta área
            </h3>
            <p className="text-muted-foreground mb-4">
              Esta área ainda não possui processos mapeados.
            </p>
            <Button asChild>
              <Link href="/processes/new">Criar primeiro processo</Link>
            </Button>
          </CardContent>
        </Card>
      ) : tree ? (
        <ProcessTreeFlow tree={tree} onNodeClick={handleNodeClick} />
      ) : null}

      {/* Sheet de detalhes */}
      <ProcessDetailSheet
        processId={selectedProcessId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
