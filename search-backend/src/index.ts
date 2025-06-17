import "reflect-metadata";
import { envConfig } from "@/config/envConfig";
import { initializeServer } from "@/server";

async function startServer() {
  const { httpServer } = await initializeServer();
  const { NODE_ENV, HOST, PORT } = envConfig;

  const server = httpServer.listen(PORT, () => {
    console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
    console.log(`GraphQL endpoint: http://${HOST}:${PORT}/graphql`);
  });

  const onCloseSignal = () => {
    console.log("sigint received, shutting down");
    server.close(() => {
      console.log("server closed");
      process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGINT", onCloseSignal);
  process.on("SIGTERM", onCloseSignal);
}

startServer().catch((err) => {
  console.log(err);
  process.exit(1);
});
