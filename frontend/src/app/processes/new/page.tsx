"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProcessPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/processes");
  }, [router]);

  return null;
}
