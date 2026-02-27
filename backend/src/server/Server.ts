import express from "express";
import "dotenv/config";
import { router } from "./routes/index";
import cors from "cors";
import { errorHandler } from "./shared/middleware";

const server = express();

server.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["*"],
  }),
);
server.use(express.json());

server.use(router);

// Global error handler — must be after all routes
server.use(errorHandler as unknown as express.ErrorRequestHandler);

export { server };
