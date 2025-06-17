import { DataSource } from "typeorm";
import { Product } from "@/features/product/Product.entity";
import { envConfig } from "./envConfig";

let dataSource: DataSource;

export async function getDb() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      database: envConfig.SQLITE_DB_PATH || "./db.sqlite",
      entities: [Product],
      synchronize: true,
      logging: envConfig.NODE_ENV === "development",
    });

    await dataSource.initialize();

    await dataSource.transaction(async (manager) => {
      await manager.query(`
        CREATE VIRTUAL TABLE IF NOT EXISTS product_fts 
        USING fts5(
          name, 
          model, 
          manufacturer,
          tokenize='unicode61',
          content='product',
          content_rowid='id'
        )
      `);

      await manager.query(`
        CREATE TABLE IF NOT EXISTS product_fts_data(
          id INTEGER PRIMARY KEY,
          block BLOB
        )
      `);

      await manager.query(`
        INSERT OR IGNORE INTO product_fts(rowid, name, model, manufacturer)
        SELECT id, name, model, manufacturer FROM product
      `);

      await manager.query(`
        CREATE TRIGGER IF NOT EXISTS product_ai AFTER INSERT ON product BEGIN
          INSERT INTO product_fts(rowid, name, model, manufacturer)
          VALUES (new.id, new.name, new.model, new.manufacturer);
        END;
      `);

      await manager.query(`
        CREATE TRIGGER IF NOT EXISTS product_au AFTER UPDATE ON product BEGIN
          UPDATE product_fts 
          SET name = new.name, model = new.model, manufacturer = new.manufacturer
          WHERE rowid = old.id;
        END;
      `);

      await manager.query(`
        CREATE TRIGGER IF NOT EXISTS product_ad AFTER DELETE ON product BEGIN
          DELETE FROM product_fts WHERE rowid = old.id;
        END;
      `);
    });

    console.log("SQLite FTS5 setup complete with BM25 support");
  }
  return dataSource;
}
