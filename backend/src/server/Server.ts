import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes/index";
import { errorHandler } from "./shared/middleware";
import { swaggerSpec } from "./swaggerConfig";

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
