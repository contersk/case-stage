"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Cpu, Hand, Users, Wrench, FileText } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  Planejado: "bg-blue-500",
  Em_Andamento: "bg-yellow-500",
  Concluido: "bg-green-500",
  Cancelado: "bg-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  Planejado: "Planejado",
  Em_Andamento: "Em Andamento",
  Concluido: "Concluído",
  Cancelado: "Cancelado",
};

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
  const dotColor = STATUS_COLORS[d.status] ?? "bg-gray-400";

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
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {STATUS_LABELS[d.status] ?? d.status}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {d.priority === "Media" ? "Média" : d.priority}
          </Badge>
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
