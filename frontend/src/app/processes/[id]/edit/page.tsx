"use client";

import { useParams, redirect } from "next/navigation";

/**
 * Página de edição legada — redireciona para a página de detalhes,
 * onde a edição agora acontece via modal.
 */
export default function EditProcessPage() {
  const params = useParams<{ id: string }>();
  redirect(`/processes/${params.id}`);
}
