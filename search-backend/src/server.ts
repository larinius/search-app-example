import { getDb } from "@/config/db";
import { envConfig } from "@/config/envConfig";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express, { type Express } from "express";
import playground from "graphql-playground-middleware-express";
import helmet from "helmet";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { createApolloServer } from "./apolloServer";

export async function createApp() {
  const app: Express = express();
  const httpServer = createServer(app);
  const db = await getDb();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: envConfig.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const server = await createApolloServer(httpServer, wsServer, db);

  app.use("/playground", playground({ endpoint: "/graphql" }));
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({}), // Empty context
    }),
  );

  return { app, httpServer };
}

export async function initializeServer() {
  const { app, httpServer } = await createApp();
  return { app, httpServer };
}
