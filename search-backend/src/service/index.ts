import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { DataSource } from "typeorm";

import { createProductResolvers } from "../features/product/Product.resolver";
import { productTypeDefs } from "@/features/product/types/Product.type";

export const createResolvers = (db: DataSource) => {
  return mergeResolvers([createProductResolvers(db)]);
};

export const typeDefs = mergeTypeDefs([productTypeDefs]);
