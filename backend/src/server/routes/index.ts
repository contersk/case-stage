import { Router } from "express";
import { AreasController } from "../controllers/areas";
import { ProcessesController } from "../controllers/processes";
import { prisma } from "../database";

/**
 * Router principal da aplicação.
 * Centraliza todas as rotas organizadas por domínio:
 * - /areas         → CRUD de áreas organizacionais
 * - /areas/:id/tree → Árvore hierárquica de processos de uma área
 * - /processes     → CRUD de processos com relações
 * - /metadata/*    → Endpoints de metadados visuais (cores, ícones, labels)
 *
 * Cada rota passa por middleware de validação Zod antes de chegar ao controller.
 */
const router = Router();

// Health check
router.get("/", (_req, res) => {
  res.json({ status: "ok", message: "API Case Stage rodando!" });
});

// ==================== AREAS ====================
router.get("/areas", AreasController.getAllValidation, AreasController.getAll);
router.get(
  "/areas/:id",
  AreasController.getByIdValidation,
  AreasController.getById,
);
router.get(
  "/areas/:id/tree",
  ProcessesController.getTreeValidation,
  ProcessesController.getTree,
);
router.post("/areas", AreasController.createValidation, AreasController.Create);
router.put(
  "/areas/:id",
  AreasController.updateByIdValidation,
  AreasController.updateById,
);
router.delete(
  "/areas/:id",
  AreasController.deleteValidation,
  AreasController.deleteById,
);

// ==================== PROCESSES ====================
router.get(
  "/processes",
  ProcessesController.getAllValidation,
  ProcessesController.getAll,
);
router.get(
  "/processes/:id",
  ProcessesController.getByIdValidation,
  ProcessesController.getById,
);
router.post(
  "/processes",
  ProcessesController.createValidation,
  ProcessesController.Create,
);
router.put(
  "/processes/:id",
  ProcessesController.updateByIdValidation,
  ProcessesController.updateById,
);
router.delete(
  "/processes/:id",
  ProcessesController.deleteValidation,
  ProcessesController.deleteById,
);

// ==================== DASHBOARD ====================
// Processes grouped by status (optional ?areaId=X filter)
router.get("/dashboard/by-status", async (req, res, next) => {
  try {
    const areaId = req.query.areaId ? String(req.query.areaId) : null;
    const result = await prisma.process.groupBy({
      by: ["status"],
      _count: true,
      orderBy: { status: "asc" },
      ...(areaId && { where: { areaId } }),
    });
    res.json(result.map((r) => ({ status: r.status, count: r._count })));
  } catch (e) {
    next(e);
  }
});

// Areas ranked by process count (leaderboard)
router.get("/dashboard/by-area", async (_req, res, next) => {
  try {
    const result = await prisma.area.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { processes: true } },
      },
      orderBy: { processes: { _count: "desc" } },
    });
    res.json(
      result.map((r) => ({
        id: r.id,
        name: r.name,
        processCount: r._count.processes,
      })),
    );
  } catch (e) {
    next(e);
  }
});

// Processes grouped by priority (optional ?areaId=X filter)
router.get("/dashboard/by-priority", async (req, res, next) => {
  try {
    const areaId = req.query.areaId ? String(req.query.areaId) : null;
    const result = await prisma.process.groupBy({
      by: ["priority"],
      _count: true,
      orderBy: { priority: "asc" },
      ...(areaId && { where: { areaId } }),
    });
    res.json(result.map((r) => ({ priority: r.priority, count: r._count })));
  } catch (e) {
    next(e);
  }
});

// Processes grouped by type (optional ?areaId=X filter)
router.get("/dashboard/by-type", async (req, res, next) => {
  try {
    const areaId = req.query.areaId ? String(req.query.areaId) : null;
    const result = await prisma.process.groupBy({
      by: ["type"],
      _count: true,
      orderBy: { type: "asc" },
      ...(areaId && { where: { areaId } }),
    });
    res.json(result.map((r) => ({ type: r.type, count: r._count })));
  } catch (e) {
    next(e);
  }
});

// ==================== METADATA ====================
// Status colors — visual intelligence for graph nodes
router.get("/metadata/status-colors", (_req, res) => {
  res.json({
    Planejado: {
      color: "#3B82F6",
      label: "Planejado",
      description: "Processo planejado, ainda não iniciado",
    },
    Em_Andamento: {
      color: "#EAB308",
      label: "Em Andamento",
      description: "Processo em execução — requer atenção",
    },
    Concluido: {
      color: "#22C55E",
      label: "Concluído",
      description: "Processo finalizado com sucesso",
    },
    Cancelado: {
      color: "#EF4444",
      label: "Cancelado",
      description: "Processo cancelado — inativo",
    },
  });
});

// Process type icons — systemic vs manual
router.get("/metadata/process-types", (_req, res) => {
  res.json({
    Sistemico: {
      icon: "cpu",
      label: "Sistêmico",
      description: "Processo automatizado por sistema",
      color: "#8B5CF6",
    },
    Manual: {
      icon: "hand",
      label: "Manual",
      description: "Processo executado manualmente",
      color: "#F97316",
    },
  });
});

// Priority metadata
router.get("/metadata/priorities", (_req, res) => {
  res.json({
    Alta: {
      color: "#EF4444",
      label: "Alta",
      description: "Prioridade alta — requer ação imediata",
    },
    Media: {
      color: "#EAB308",
      label: "Média",
      description: "Prioridade média",
    },
    Baixa: {
      color: "#22C55E",
      label: "Baixa",
      description: "Prioridade baixa",
    },
  });
});

export { router };
