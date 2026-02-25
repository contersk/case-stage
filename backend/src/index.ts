import { server } from "./server/Server";
import "dotenv/config";

//inicialização e verificação de porta do servidor
console.log("iniciando server...");

const startServer = () => {
  server
    .listen(parseInt(process.env.PORT || "3333"), "::", () => {
      console.log(`server rodando na porta numero: ${process.env.PORT}`);
    })
    .on("error", (err: Error) => {
      console.log(
        `falha ao iniciar o server em: ${process.env.PORT}`,
        err.message,
      );
    });
};

startServer();
