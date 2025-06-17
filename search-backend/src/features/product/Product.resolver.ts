import { GraphQLError } from "graphql";
import { ProductService } from "./Product.service";
import type { GraphQLContext } from "src/types/env.d.ts";
import { DataSource } from "typeorm";
export const createProductResolvers = (db: DataSource) => {
  const productService = new ProductService(db);

  return {
    Query: {
      searchProducts: async (
        _: unknown,
        { input }: { input: { query: string; limit?: number; offset?: number } },
        context: GraphQLContext,
      ) => {
        try {
          const { query, limit = 100, offset = 0 } = input;
          return await productService.search(query, limit, offset);
        } catch (error) {
          throw new GraphQLError("Search failed");
        }
      },
    },
  };
};
