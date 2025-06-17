import { gql } from "@apollo/client";

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $limit: Int, $offset: Int) {
    searchProducts(input: { query: $query, limit: $limit, offset: $offset }) {
      totalCount
      products {
        id
        name
        model
      }
    }
  }
`;
