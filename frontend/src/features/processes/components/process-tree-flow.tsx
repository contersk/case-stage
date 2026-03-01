/**
 * Visualização em grafo da árvore hierárquica de processos.
 *
 * Converte a estrutura `IProcessTreeNode[]` (retornada pelo endpoint
 * `/areas/:id/tree`) em nós e arestas do React Flow.
 *
 * Features:
 * - Layout automático em árvore (horizontal por profundidade)
 * - Arestas animadas com setas
 * - MiniMap e Controls integrados
 * - Clique em nó abre o `ProcessDetailSheet`
 *
 * @see ProcessNode — componente de nó customizado
 * @see ProcessDetailSheet — painel lateral de detalhes
 */
"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { IProcessTreeNode } from "@/types";
import { ProcessNode } from "./process-node";

const nodeTypes = { process: ProcessNode };

/**
 * Converte a árvore recursiva de IProcessTreeNode em estruturas planas de nodes e edges
 * compatíveis com o React Flow.
 *
 * Layout: distribui nós horizontalmente (xGap=320px) e verticalmente por profundidade (yGap=160px).
 * Edges são animadas com setas na ponta (smoothstep + MarkerType.ArrowClosed).
 *
 * @param tree - Array de nós raiz da árvore
 * @param parentId - ID do nó pai (null para raiz)
 * @param depth - Profundidade atual na árvore (eixo Y)
 * @param siblingIndex - Índice acumulado para offset horizontal (eixo X)
 */
function treeToFlow(
  tree: IProcessTreeNode[],
  parentId: string | null = null,
  depth = 0,
  siblingIndex = 0,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const xGap = 320;
  const yGap = 160;

  tree.forEach((node, i) => {
    const x = (siblingIndex + i) * xGap;
    const y = depth * yGap;

    nodes.push({
      id: node.id,
      type: "process",
      position: { x, y },
      data: {
        label: node.title,
        status: node.status,
        type: node.type,
        priority: node.priority,
        description: node.description,
        tools: node.tools,
        responsibles: node.responsibles,
        documents: node.documents,
        childCount: node.children.length,
      },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}->${node.id}`,
        source: parentId,
        target: node.id,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 1.5 },
      });
    }

    if (node.children.length > 0) {
      const childResult = treeToFlow(
        node.children,
        node.id,
        depth + 1,
        siblingIndex + i,
      );
      nodes.push(...childResult.nodes);
      edges.push(...childResult.edges);
    }
  });

  return { nodes, edges };
}

interface ProcessTreeFlowProps {
  tree: IProcessTreeNode[];
  onNodeClick?: (nodeId: string) => void;
}

/**
 * Componente de visualização da árvore de processos usando React Flow.
 * Converte a árvore hierárquica em um grafo interativo com:
 * - Nós customizados (ProcessNode) com indicação visual de status, tipo e contadores
 * - Background com grid, controles de zoom e MiniMap
 * - Callback onNodeClick para abrir detalhes do processo
 */
export function ProcessTreeFlow({ tree, onNodeClick }: ProcessTreeFlowProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => treeToFlow(tree),
    [tree],
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick],
  );

  return (
    <div className="h-150 w-full rounded-lg border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-muted/50!"
        />
      </ReactFlow>
    </div>
  );
}
