import { server } from "./server/Server";
import "dotenv/config";

//inicialização e verificação de porta do servidor
console.log("iniciando server...");

const startServer = () => {
  server
    .listen(parseInt(process.env.PORT || "3333"), "::", () => {
      console.log(`server rodando em http://localhost:${process.env.PORT}`);
      console.log(`swagger em http://localhost:${process.env.PORT}/api-docs`);
    })
    .on("error", (err: Error) => {
      console.log(
        `falha ao iniciar o server em: ${process.env.PORT}`,
        err.message,
      );
    });
};

startServer();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promise rejeitada não tratada:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Exceção não capturada:", error);
  process.exit(1);
});
