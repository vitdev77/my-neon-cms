import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

// Инициализируем Drizzle с нашей схемой данных
export const db = drizzle(sql, { schema });
