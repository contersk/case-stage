import {
  Clock,
  Loader,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Minus,
  ArrowDown,
  Cpu,
  Hand,
  type LucideIcon,
} from "lucide-react";
import type { ProcessStatus, ProcessPriority, ProcessType } from "@/types";

// ==================== STATUS ====================
export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  color: string; // Tailwind bg class
  textColor: string; // Tailwind text class
  dotColor: string; // Tailwind bg class for dots
  hex: string; // Hex color for charts
}

export const STATUS_CONFIG: Record<ProcessStatus, StatusConfig> = {
  Planejado: {
    label: "Planejado",
    icon: Clock,
    color: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-700 dark:text-blue-300",
    dotColor: "bg-blue-500",
    hex: "#3B82F6",
  },
  Em_Andamento: {
    label: "Em Andamento",
    icon: Loader,
    color: "bg-yellow-100 dark:bg-yellow-950",
    textColor: "text-yellow-700 dark:text-yellow-300",
    dotColor: "bg-yellow-500",
    hex: "#EAB308",
  },
  Concluido: {
    label: "Concluído",
    icon: CheckCircle,
    color: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300",
    dotColor: "bg-green-500",
    hex: "#22C55E",
  },
  Cancelado: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300",
    dotColor: "bg-red-500",
    hex: "#EF4444",
  },
};

// ==================== PRIORITY ====================
export interface PriorityConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  hex: string;
}

export const PRIORITY_CONFIG: Record<ProcessPriority, PriorityConfig> = {
  Alta: {
    label: "Alta",
    icon: AlertTriangle,
    color: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300",
    hex: "#EF4444",
  },
  Media: {
    label: "Média",
    icon: Minus,
    color: "bg-yellow-100 dark:bg-yellow-950",
    textColor: "text-yellow-700 dark:text-yellow-300",
    hex: "#EAB308",
  },
  Baixa: {
    label: "Baixa",
    icon: ArrowDown,
    color: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300",
    hex: "#22C55E",
  },
};

// ==================== TYPE ====================
export interface TypeConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  hex: string;
}

export const TYPE_CONFIG: Record<ProcessType, TypeConfig> = {
  Sistemico: {
    label: "Sistêmico",
    icon: Cpu,
    color: "bg-violet-100 dark:bg-violet-950",
    textColor: "text-violet-700 dark:text-violet-300",
    hex: "#8B5CF6",
  },
  Manual: {
    label: "Manual",
    icon: Hand,
    color: "bg-orange-100 dark:bg-orange-950",
    textColor: "text-orange-700 dark:text-orange-300",
    hex: "#F97316",
  },
};
