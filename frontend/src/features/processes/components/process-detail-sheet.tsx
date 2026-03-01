"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StatusBadge,
  PriorityBadge,
  TypeBadge,
} from "@/components/ui/status-badge";
import { useProcess } from "@/features/processes";
import { Users, Wrench, FileText, Calendar, ExternalLink } from "lucide-react";

interface ProcessDetailSheetProps {
  processId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Sheet lateral (slide-over) que exibe os detalhes completos de um processo.
 * Acionado ao clicar em um nó na árvore de processos (AreaTreePage).
 * Carrega os dados via useProcess() e exibe: status, tipo, prioridade, descrição,
 * datas, responsáveis, ferramentas, documentos e processo pai.
 */
export function ProcessDetailSheet({
  processId,
  open,
  onOpenChange,
}: ProcessDetailSheetProps) {
  const { data: process, isLoading } = useProcess(processId ?? "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-100 sm:w-135 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              (process?.title ?? "Detalhes do Processo")
            )}
          </SheetTitle>
          <SheetDescription>
            {process?.area?.name
              ? `Área: ${process.area.name}`
              : "Carregando..."}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 mt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : process ? (
          <div className="space-y-6 mt-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={process.status} />
              <TypeBadge type={process.type} />
              <PriorityBadge priority={process.priority} />
            </div>

            {/* Descrição */}
            {process.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Descrição</h4>
                <p className="text-sm text-muted-foreground">
                  {process.description}
                </p>
              </div>
            )}

            {/* Datas */}
            {(process.startDate || process.endDate) && (
              <div className="flex gap-4">
                {process.startDate && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      Início:{" "}
                      {new Date(process.startDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}
                {process.endDate && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      Fim:{" "}
                      {new Date(process.endDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Responsáveis */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Responsáveis ({process.responsibles.length})
              </h4>
              {process.responsibles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum responsável atribuído.
                </p>
              ) : (
                <ul className="space-y-1">
                  {process.responsibles.map((r) => (
                    <li
                      key={r.id}
                      className="text-sm flex items-center justify-between"
                    >
                      <span>{r.name}</span>
                      {r.role && (
                        <Badge variant="outline" className="text-[10px]">
                          {r.role}
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Separator />

            {/* Ferramentas */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Wrench className="h-4 w-4" />
                Ferramentas ({process.tools.length})
              </h4>
              {process.tools.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma ferramenta vinculada.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {process.tools.map((t) => (
                    <Badge key={t.id} variant="secondary">
                      {t.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Documentos */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Documentos ({process.documents.length})
              </h4>
              {process.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum documento anexado.
                </p>
              ) : (
                <ul className="space-y-1">
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
            </div>

            {/* Processo pai */}
            {process.parent && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Processo Pai</h4>
                  <p className="text-sm text-muted-foreground">
                    {process.parent.title}
                  </p>
                </div>
              </>
            )}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
