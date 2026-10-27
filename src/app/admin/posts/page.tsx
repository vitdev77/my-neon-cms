import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import DeletePostButton from "./delete-button";

// Изолированная функция получения данных с использованием нативного кэша Next.js 15
async function getPosts() {
  "use cache";
  try {
    return await db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  } catch (error) {
    console.error("Ошибка получения данных из Neon:", error);
    return [];
  }
}

export default async function AdminPostsPage() {
  const allPosts = await getPosts();

  return (
    <div className="space-y-6">
      {/* Шапка страницы */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Публикации
        </h2>
        <Button
          className="flex items-center gap-2"
          nativeButton={false}
          render={<Link href="/admin/posts/new" />}
        >
          <Plus className="h-4 w-4" />
          Создать пост
        </Button>
      </div>

      {/* Таблица публикаций */}
      <div className="rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Применяем системные пропорции ширины по регламенту */}
              <TableHead className="w-1/4">Заголовок</TableHead>
              <TableHead className="w-1/2">Текст (Контент)</TableHead>
              <TableHead className="w-1/12">Статус</TableHead>
              <TableHead className="w-1/6">Дата изменения</TableHead>
              <TableHead className="text-right w-1/6">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPosts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-500"
                >
                  Статей пока нет. Создайте свою первую публикацию!
                </TableCell>
              </TableRow>
            ) : (
              allPosts.map((post) => (
                <TableRow key={post.id}>
                  {/* Колонка: Заголовок */}
                  <TableCell className="font-medium text-slate-900">
                    <span className="line-clamp-1">{post.title}</span>
                  </TableCell>

                  {/* Новая колонка: Текст статьи (с аккуратным ограничением в 1 строку) */}
                  <TableCell className="text-slate-500">
                    <span className="line-clamp-1">{post.content}</span>
                  </TableCell>

                  {/* Колонка: Статус */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {post.status === "published"
                        ? "Опубликовано"
                        : "Черновик"}
                    </span>
                  </TableCell>

                  {/* Колонка: Дата */}
                  <TableCell className="text-slate-500 whitespace-nowrap">
                    {new Date(post.updatedAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>

                  {/* Колонка: Действия */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                        render={<Link href={`/admin/posts/edit/${post.id}`} />}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Редактировать</span>
                      </Button>

                      <DeletePostButton id={post.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
