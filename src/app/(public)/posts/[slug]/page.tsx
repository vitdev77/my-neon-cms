import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { posts } from "@/db/schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, FileText } from "lucide-react";

// Изолированная функция получения конкретного поста по его slug с использованием кэша Next.js 15
async function getPostBySlug(slug: string) {
  // Активируем кэширование функции для компилятора Next.js 15
  "use cache";

  try {
    // Ищем статью, у которой совпадает slug И статус равен 'published'
    const result = await db.query.posts.findFirst({
      where: and(eq(posts.slug, slug), eq(posts.status, "published")),
    });
    return result;
  } catch (error) {
    console.error("Ошибка при получении статьи из Neon:", error);
    return null;
  }
}

// Типизация параметров динамического маршрута Next.js 15
interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicPostPage({ params }: PostPageProps) {
  // В Next.js 15 параметры маршрута params являются промисом, их необходимо развернуть через await
  const { slug } = await params;

  // Запрашиваем статью из базы данных Neon
  const post = await getPostBySlug(slug);

  // Если статья не найдена или это черновик — отдаем стандартную страницу 404 Not Found
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Навигационная панель / Шапка сайта */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-slate-900 flex items-center gap-2"
          >
            <FileText className="h-5 w-5 text-slate-800" />
            <span>Neon Blog</span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin" />}
          >
            В админку
          </Button>
        </div>
      </header>

      {/* Основная область статьи */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="space-y-6">
          {/* Кнопка возврата назад */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 p-0 h-auto hover:bg-transparent"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Назад к публикациям</span>
          </Button>

          {/* Метаданные статьи */}
          <div className="space-y-4 border-b border-slate-200 pb-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.createdAt).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Тело статьи (Контент) */}
          {/* Пока выводим как обычный текст с сохранением переносов строк (whitespace-pre-line) */}
          <div className="text-slate-800 text-lg leading-relaxed whitespace-pre-line prose max-w-none">
            {post.content}
          </div>
        </article>
      </main>
    </div>
  );
}
