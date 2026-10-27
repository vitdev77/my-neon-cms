import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Eye, MessageSquare } from "lucide-react";
import { db } from "@/db";
import { count } from "drizzle-orm";
import { posts } from "@/db/schema";

// Изолированная функция для получения агрегированной статистики из базы данных Neon
async function getDashboardStats() {
  // Активируем кэширование функции для компилятора Next.js 15
  "use cache";

  try {
    // Выполняем быстрый SQL-запрос SELECT COUNT(*) FROM posts
    const result = await db.select({ value: count() }).from(posts);

    // Возвращаем итоговое число (если таблица пустая, вернется 0)
    return {
      totalPosts: result[0]?.value ?? 0,
    };
  } catch (error) {
    console.error("Ошибка при получении статистики дашборда:", error);
    return {
      totalPosts: 0,
    };
  }
}

export default async function AdminDashboard() {
  // Запрашиваем реальные данные с сервера
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Добро пожаловать!
        </h2>
        <p className="text-sm text-slate-500">
          Оперативная сводка по контенту вашей CMS на базе Neon Postgres
        </p>
      </div>

      {/* Сетка виджетов аналитики */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Карточка: Всего публикаций (ЖИВЫЕ ДАННЫЕ) */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Всего публикаций
            </CardTitle>
            <Layers className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalPosts}
            </div>
            <p className="text-xs text-green-600">Записи в таблице posts</p>
          </CardContent>
        </Card>

        {/* Карточка: Просмотры (Заглушка до интеграции аналитики) */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Просмотры
            </CardTitle>
            <Eye className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">+0</div>
            <p className="text-xs text-slate-500">Будет подключено позже</p>
          </CardContent>
        </Card>

        {/* Карточка: Комментарии (Заглушка до создания таблицы комментариев) */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Комментарии
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-xs text-slate-500">Модерация отключена</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
