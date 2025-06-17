import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { makeExecutableSchema } from "@graphql-tools/schema";
import depthLimit from "graphql-depth-limit";
import { GraphQLUpload } from "graphql-upload-ts";
import { createComplexityLimitRule } from "graphql-validation-complexity";
import type { Server } from "node:http";
import type { DataSource } from "typeorm";
import type { WebSocketServer } from "ws";
import { createResolvers, typeDefs } from "./service";

export async function createApolloServer(httpServer: Server, wsServer: WebSocketServer, db: DataSource) {
  const schema = makeExecutableSchema({
    typeDefs: ["scalar Upload", typeDefs],
    resolvers: {
      ...createResolvers(db),
      Upload: GraphQLUpload,
    },
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await new Promise<void>((resolve) => {
                wsServer.close(() => resolve());
              });
            },
          };
        },
      },
    ],
    csrfPrevention: true,
    validationRules: [
      depthLimit(10),
      createComplexityLimitRule(1000, {
        onCost: (cost) => console.log(`Query cost: ${cost}`),
      }),
    ],
  });

  await server.start();
  return server;
}
