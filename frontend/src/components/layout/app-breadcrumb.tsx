"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/** Mapeamento de segmentos de URL para labels legíveis */
const segmentLabels: Record<string, string> = {
  areas: "Áreas",
  processes: "Processos",
  new: "Novo",
  edit: "Editar",
  tree: "Árvore de Processos",
};

interface BreadcrumbEntry {
  label: string;
  href: string;
}

export function AppBreadcrumb() {
  const pathname = usePathname();

  // Build breadcrumb entries from pathname segments
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbEntry[] = [{ label: "Dashboard", href: "/" }];

  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // If it's a dynamic ID segment (UUID or number), show generic label
    const isId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment,
      ) || /^\d+$/.test(segment);

    if (isId) {
      crumbs.push({ label: "Detalhes", href: currentPath });
    } else {
      crumbs.push({
        label: segmentLabels[segment] || segment,
        href: currentPath,
      });
    }
  }

  // If on root, just show "Dashboard" as the current page
  if (crumbs.length === 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <BreadcrumbItem key={crumb.href}>
              {!isLast ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
