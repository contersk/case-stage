import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes/index";
import { errorHandler } from "./shared/middleware";
import { swaggerSpec } from "./swaggerConfig";

/**
 * Instância principal do Express.
 * Configurações aplicadas:
 * - CORS dinâmico via env CORS_ORIGIN (aceita múltiplas origens separadas por vírgula)
 * - JSON body parsing
 * - Morgan para logging de requisições (desabilitado em NODE_ENV=test)
 * - Swagger UI servido em /api-docs
 * - Router centralizado com todas as rotas da aplicação
 * - Error handler global como último middleware
 */
const server = express();

server.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["*"],
  }),
);
server.use(express.json());

// Request logging (desabilitado em testes para manter console limpo)
if (process.env.NODE_ENV !== "test") {
  server.use(morgan("dev"));
}

// API Documentation
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(router);

// Global error handler — must be after all routes
server.use(errorHandler as unknown as express.ErrorRequestHandler);

export { server };
