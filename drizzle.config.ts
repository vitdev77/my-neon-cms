import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Загружаем переменные из .env.local для локальной разработки
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts", // где будет лежать наша схема таблиц
  out: "./src/db/migrations", // куда сохранять файлы миграций SQL
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!, // используем строку подключения от Vercel
  },
});
