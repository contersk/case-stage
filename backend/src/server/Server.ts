import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes/index";
import { errorHandler } from "./shared/middleware";
import { swaggerSpec } from "./swaggerConfig";

/**
 * Origens permitidas para CORS.
 * - Em produção, utiliza CORS_ORIGIN do .env (separadas por vírgula)
 * - Qualquer deploy de preview do Vercel (*.vercel.app) é aceito automaticamente
 * - Requisições sem origin (curl, Postman, mobile) são liberadas
 */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

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
    origin(origin, callback) {
      // Permite requisições sem origin (curl, Postman, apps mobile)
      if (!origin) return callback(null, true);

      // Verifica lista explícita ou wildcard
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      // Aceita qualquer deploy Vercel (preview + production)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
