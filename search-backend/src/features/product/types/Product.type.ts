export const productTypeDefs = `
  type Product {
    id: ID!
    name: String!
    model: String!
    manufacturer: String!
    createdAt: String!
  }

  type ProductSearchResult {
    totalCount: Int!
    products: [Product!]!
  }

  input SearchProductsInput {
    query: String!
    limit: Int
    offset: Int
  }

  type Query {
    searchProducts(input: SearchProductsInput!): ProductSearchResult!
  }
`;
