/**
 * Nó customizado para o React Flow.
 *
 * Exibe um card compacto com:
 * - Dot colorido indicando o status
 * - Ícone de tipo (Sistêmico/Manual)
 * - Badges de status e prioridade
 * - Contadores de responsáveis, ferramentas, documentos e subprocessos
 *
 * Usado pelo componente `ProcessTreeFlow` na página de árvore.
 *
 * @see ProcessTreeFlow
 */
"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Cpu, Hand, Users, Wrench, FileText } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { STATUS_CONFIG } from "@/lib/statusConfig";
import type { ProcessStatus } from "@/types";

interface ProcessNodeData {
  label: string;
  status: string;
  type: string;
  priority: string;
  description: string | null;
  tools: Array<{ id: string; name: string }>;
  responsibles: Array<{ id: string; name: string; role: string | null }>;
  documents: Array<{ id: string; title: string; url: string | null }>;
  childCount: number;
  [key: string]: unknown;
}

/**
 * Nó customizado do React Flow para representar um processo na árvore.
 * Exibe:
 * - Dot colorido indicando status (azul=Planejado, amarelo=Em Andamento, verde=Concluído, vermelho=Cancelado)
 * - Ícone de tipo (Cpu=Sistêmico, Hand=Manual)
 * - Badges de status e prioridade
 * - Contadores de responsáveis, ferramentas, documentos e subprocessos
 *
 * Memoizado com React.memo para evitar re-renders desnecessários no grafo.
 */
function ProcessNodeComponent({ data }: NodeProps) {
  const d = data as ProcessNodeData;
  const statusCfg = STATUS_CONFIG[d.status as ProcessStatus];
  const dotColor = statusCfg?.dotColor ?? "bg-gray-400";

  return (
    <>
      <Handle type="target" position={Position.Top} className="bg-primary!" />
      <div className="min-w-55 max-w-70 rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor}`} />
            <span className="font-medium text-sm truncate">{d.label}</span>
          </div>
          {d.type === "Sistemico" ? (
            <Cpu className="h-3.5 w-3.5 text-violet-500 shrink-0" />
          ) : (
            <Hand className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          )}
        </div>

        {/* Status + Priority */}
        <div className="flex items-center gap-1.5 mb-2">
          <StatusBadge status={d.status} className="text-[10px] px-1.5 py-0" />
          <PriorityBadge
            priority={d.priority}
            className="text-[10px] px-1.5 py-0"
          />
        </div>

        {/* Counters */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          {d.responsibles.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              {d.responsibles.length}
            </span>
          )}
          {d.tools.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Wrench className="h-3 w-3" />
              {d.tools.length}
            </span>
          )}
          {d.documents.length > 0 && (
            <span className="flex items-center gap-0.5">
              <FileText className="h-3 w-3" />
              {d.documents.length}
            </span>
          )}
          {d.childCount > 0 && (
            <span className="ml-auto text-primary font-medium">
              {d.childCount} sub
            </span>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-primary!"
      />
    </>
  );
}

export const ProcessNode = memo(ProcessNodeComponent);
