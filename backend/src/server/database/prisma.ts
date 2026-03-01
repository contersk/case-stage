/**
 * @file Singleton do PrismaClient.
 *
 * Exporta uma instância única do `PrismaClient` que é reutilizada
 * em toda a aplicação, evitando conexões desnecessárias ao banco.
 *
 * @module prisma
 */
import { PrismaClient } from "@prisma/client";

/** Instância singleton do Prisma para acesso ao PostgreSQL. */
export const prisma = new PrismaClient();
