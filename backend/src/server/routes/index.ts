import { Router } from "express";
import { AreasController } from "../controllers/areas";
import { ProcessesController } from "../controllers/processes";

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
