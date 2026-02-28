"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Wrench, Users, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAreas } from "@/features/areas";
import { useProcesses } from "@/features/processes";
import type { IProcessDetails } from "@/types";
import {
  PROCESS_STATUS_VALUES,
  PROCESS_PRIORITY_VALUES,
  PROCESS_TYPE_VALUES,
} from "@/types/process";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const processFormSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter no mínimo 3 caracteres.")
    .max(255),
  description: z.string().default(""),
  type: z.enum(PROCESS_TYPE_VALUES).default("Manual"),
  status: z.enum(PROCESS_STATUS_VALUES).default("Planejado"),
  priority: z.enum(PROCESS_PRIORITY_VALUES).default("Media"),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  areaId: z.string().min(1, "Selecione uma área."),
  parentId: z.string().default(""),
  tools: z
    .array(z.object({ name: z.string().min(1, "Nome obrigatório.") }))
    .default([]),
  responsibles: z
    .array(
      z.object({
        name: z.string().min(1, "Nome obrigatório."),
        role: z.string().default(""),
      }),
    )
    .default([]),
  documents: z
    .array(
      z.object({
        title: z.string().min(1, "Título obrigatório."),
        url: z.string().default(""),
      }),
    )
    .default([]),
});

export type ProcessFormValues = z.input<typeof processFormSchema>;
export type ProcessFormOutput = z.infer<typeof processFormSchema>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STATUS_LABELS: Record<string, string> = {
  Planejado: "Planejado",
  Em_Andamento: "Em Andamento",
  Concluido: "Concluído",
  Cancelado: "Cancelado",
};

const PRIORITY_LABELS: Record<string, string> = {
  Alta: "Alta",
  Media: "Média",
  Baixa: "Baixa",
};

const TYPE_LABELS: Record<string, string> = {
  Sistemico: "Sistêmico",
  Manual: "Manual",
};

/** Converte a data ISO para formato local (YYYY-MM-DD) para input type=date */
function isoToDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/** Converte valor do input date para ISO string para o backend */
function dateInputToIso(value: string): string | null {
  if (!value) return null;
  return new Date(value + "T00:00:00.000Z").toISOString();
}

/* ------------------------------------------------------------------ */
/*  Componente                                                         */
/* ------------------------------------------------------------------ */

interface ProcessFormProps {
  /** Dados iniciais para edição; undefined = criação */
  defaultValues?: IProcessDetails;
  /** Disparado ao submeter com dados válidos */
  onSubmit: (values: ProcessFormOutput) => void | Promise<void>;
  /** Se o submit está em progresso */
  isPending?: boolean;
  /** Botões extras / texto do CTA */
  submitLabel?: string;
}

/**
 * Formulário reutilizável para criação e edição de processos.
 * Inclui:
 * - Campos básicos: título, descrição, tipo, status, prioridade, datas
 * - Seleção de área e processo pai (dropdown dinâmico)
 * - Field arrays dinâmicos para ferramentas, responsáveis e documentos
 * - Validação com Zod via React Hook Form
 * - Conversão automática de datas (ISO ↔ input date) para compatibilidade com o backend
 *
 * @param defaultValues - Dados do processo para modo edição (undefined = criação)
 * @param onSubmit - Callback com os dados validados e normalizados
 * @param isPending - Controla estado de loading do botão submit
 * @param submitLabel - Texto do botão (ex: "Criar Processo", "Salvar Alterações")
 */
export function ProcessForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Salvar",
}: ProcessFormProps) {
  const areas = useAreas(1, 200);
  const parentProcesses = useProcesses({ page: 1, limit: 200 });

  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Manual",
      status: "Planejado",
      priority: "Media",
      startDate: "",
      endDate: "",
      areaId: "",
      parentId: "",
      tools: [],
      responsibles: [],
      documents: [],
    },
  });

  const toolsField = useFieldArray({ control: form.control, name: "tools" });
  const responsiblesField = useFieldArray({
    control: form.control,
    name: "responsibles",
  });
  const documentsField = useFieldArray({
    control: form.control,
    name: "documents",
  });

  // Preencher valores quando os dados de edição chegam
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title,
        description: defaultValues.description ?? "",
        type: defaultValues.type,
        status: defaultValues.status,
        priority: defaultValues.priority,
        startDate: isoToDateInput(defaultValues.startDate),
        endDate: isoToDateInput(defaultValues.endDate),
        areaId: defaultValues.areaId,
        parentId: defaultValues.parentId ?? "",
        tools: defaultValues.tools.map((t) => ({ name: t.name })),
        responsibles: defaultValues.responsibles.map((r) => ({
          name: r.name,
          role: r.role ?? "",
        })),
        documents: defaultValues.documents.map((d) => ({
          title: d.title,
          url: d.url ?? "",
        })),
      });
    }
  }, [defaultValues, form]);

  function handleFormSubmit(values: ProcessFormValues) {
    // Converter datas e remover strings vazias para o backend
    const payload = {
      ...values,
      description: values.description || null,
      startDate: dateInputToIso(values.startDate ?? ""),
      endDate: dateInputToIso(values.endDate ?? ""),
      parentId: values.parentId || null,
      tools: (values.tools?.length ?? 0) > 0 ? values.tools : undefined,
      responsibles:
        (values.responsibles?.length ?? 0) > 0
          ? values.responsibles!.map((r) => ({
              name: r.name,
              role: r.role || null,
            }))
          : undefined,
      documents:
        (values.documents?.length ?? 0) > 0
          ? values.documents!.map((d) => ({
              title: d.title,
              url: d.url || null,
            }))
          : undefined,
    };
    onSubmit(payload as unknown as ProcessFormOutput);
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* -------- Informações Básicas -------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ex: Processo de Admissão"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o processo..."
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Tipo / Status / Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROCESS_TYPE_VALUES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROCESS_STATUS_VALUES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROCESS_PRIORITY_VALUES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {PRIORITY_LABELS[p]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>

          {/* Área + Processo Pai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Área */}
            <div className="space-y-2">
              <Label>
                Área <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="areaId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.data?.data.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.areaId && (
                <p className="text-sm text-destructive">
                  {errors.areaId.message}
                </p>
              )}
            </div>

            {/* Processo Pai */}
            <div className="space-y-2">
              <Label>Processo Pai (opcional)</Label>
              <Controller
                control={control}
                name="parentId"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {parentProcesses.data?.data
                        .filter((p) => p.id !== defaultValues?.id)
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* -------- Ferramentas -------- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Ferramentas
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toolsField.append({ name: "" })}
          >
            <Plus className="mr-1 h-3 w-3" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {toolsField.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma ferramenta adicionada.
            </p>
          )}
          {toolsField.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="Nome da ferramenta"
                {...register(`tools.${index}.name`)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toolsField.remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {errors.tools && (
            <p className="text-sm text-destructive">
              Verifique os campos acima.
            </p>
          )}
        </CardContent>
      </Card>

      {/* -------- Responsáveis -------- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Responsáveis
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => responsiblesField.append({ name: "", role: "" })}
          >
            <Plus className="mr-1 h-3 w-3" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {responsiblesField.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum responsável adicionado.
            </p>
          )}
          {responsiblesField.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="Nome"
                {...register(`responsibles.${index}.name`)}
                className="flex-1"
              />
              <Input
                placeholder="Cargo (opcional)"
                {...register(`responsibles.${index}.role`)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => responsiblesField.remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {errors.responsibles && (
            <p className="text-sm text-destructive">
              Verifique os campos acima.
            </p>
          )}
        </CardContent>
      </Card>

      {/* -------- Documentos -------- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => documentsField.append({ title: "", url: "" })}
          >
            <Plus className="mr-1 h-3 w-3" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {documentsField.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum documento adicionado.
            </p>
          )}
          {documentsField.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="Título do documento"
                {...register(`documents.${index}.title`)}
                className="flex-1"
              />
              <Input
                placeholder="URL (opcional)"
                {...register(`documents.${index}.url`)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => documentsField.remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {errors.documents && (
            <p className="text-sm text-destructive">
              Verifique os campos acima.
            </p>
          )}
        </CardContent>
      </Card>

      {/* -------- Submit -------- */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
