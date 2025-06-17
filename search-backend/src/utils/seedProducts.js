const sqlite3 = require("sqlite3").verbose();
const Chance = require("chance");
const chance = new Chance();

const PRODUCT_COUNT = 15000;

const PRODUCT_TYPES = {
  feminine: ["пилорама", "бензопила", "дрель", "болгарка", "пила", "машина", "установка", "лампа", "тепловая пушка"],
  masculine: [
    "станок",
    "компрессор",
    "генератор",
    "перфоратор",
    "лобзик",
    "дровокол",
    "бетоносмеситель",
    "аппарат",
    "молоток",
    "инструмент",
  ],
  neuter: ["оборудование", "устройство", "приспособление", "лезвие"],
};

const ADJECTIVES = {
  feminine: ["профессиональная", "промышленная", "мощная", "компактная", "универсальная", "тяжелая", "армейская", "заводская"],
  masculine: ["профессиональный", "промышленный", "мощный", "компактный", "универсальный", "тяжелый", "армейский", "заводской"],
  neuter: ["профессиональное", "промышленное", "мощное", "компактное", "универсальное", "тяжелое", "армейское", "заводское"],
};

function generateRussianProductName(manufacturer, model) {
  const gender = chance.pickone(["feminine", "masculine", "neuter"]);

  const adjective = chance.pickone(ADJECTIVES[gender]);
  const productType = chance.pickone(PRODUCT_TYPES[gender]);

  return `${chance.capitalize(adjective)} ${productType} ${manufacturer} ${model}`;
}

const MANUFACTURERS = ["Wood-Mizer", "Husqvarna", "Stihl", "Makita", "DeWalt", "Вихрь", "Зубр", "Интерскол", "Русский Мотор", "БалтТех"];

const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const stmt = db.prepare(`INSERT INTO product 
    (name, model, manufacturer, createdAt) 
    VALUES (?, ?, ?, ?)`);

  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const manufacturer = chance.pickone(MANUFACTURERS);
    const model = `${chance.string({ pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", length: 3 })}${chance.integer({ min: 10, max: 99 })}`;
    const name = generateRussianProductName(manufacturer, model);

    stmt.run(name, model, manufacturer, chance.date({ year: 2023 }).toISOString());
  }

  stmt.finalize(() => {
    console.log(`Inserted ${PRODUCT_COUNT} products`);
    db.close();
  });
});
