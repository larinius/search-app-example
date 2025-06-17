import { DataSource } from "typeorm";

export class ProductService {
  constructor(private db: DataSource) {}

  async search(query: string, limit: number = 100, offset: number = 0) {
    const phrases = query.match(/"[^"]+"|\S+/g) || [query];
    const terms: string[] = [];

    for (const term of phrases) {
      if (term.startsWith('"') && term.endsWith('"')) {
        terms.push(`"${term.slice(1, -1)}"`);
      } else if (/^[A-Z0-9]{3,}$/.test(term)) {
        terms.push(`"${term}"`);
      } else {
        terms.push(`"${term}"*`);
      }
    }

    const ftsQuery = terms.join(" AND ");

    try {
      const [totalCountResult] = await this.db.query(
        `SELECT COUNT(*) as totalCount
         FROM product p
         JOIN product_fts ON product_fts.rowid = p.id
         WHERE product_fts MATCH $1`,
        [ftsQuery],
      );

      const products = await this.db.query(
        `SELECT 
          p.*,
          bm25(product_fts) AS rank
         FROM product p
         JOIN product_fts ON product_fts.rowid = p.id
         WHERE product_fts MATCH $1
         ORDER BY rank ASC, p.createdAt DESC
         LIMIT $2 OFFSET $3`,
        [ftsQuery, limit, offset],
      );

      return {
        totalCount: totalCountResult.totalCount,
        products,
      };
    } catch (error) {
      console.error("FTS5 query failed:", { query, ftsQuery, error });
      throw new Error("Search failed");
    }
  }
}
