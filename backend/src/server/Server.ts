import express from "express";
import "dotenv/config";
import { router } from "./routes/index";
import cors from "cors";

const server = express();

server.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || [],
  }),
);
server.use(express.json());

server.use(router);

export { server };
