import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { posts } from "@/db/schema";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight } from "lucide-react";

// Изолированная функция получения данных с использованием нативного кэша Next.js 15
async function getPublishedPosts() {
  // Активируем кэширование функции для компилятора Next.js 15
  "use cache";
  const tags = ["public-posts"];

  try {
    return await db.query.posts.findMany({
      where: eq(posts.status, "published"),
      orderBy: [desc(posts.createdAt)],
    });
  } catch (error) {
    console.error("Ошибка при получении публичных постов:", error);
    return [];
  }
}

export default async function PublicBlogPage() {
  const publishedPosts = await getPublishedPosts();

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

      {/* Основной контент */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Последние публикации
            </h1>
            <p className="text-lg text-slate-500">
              Читайте самые свежие статьи, созданные на базе Next.js, Shadcn и
              Neon Serverless.
            </p>
          </div>

          {/* Сетка статей */}
          {publishedPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white shadow-sm">
              <FileText className="h-10 w-10 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Публикаций пока нет
              </h3>
              <p className="text-slate-500 text-sm">
                Администратор еще не опубликовал ни одной статьи.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {publishedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow bg-white border-slate-200"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 hover:text-slate-800">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-slate-600 pt-2 text-base">
                      {post.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-slate-900 font-semibold flex items-center gap-1 hover:no-underline"
                      nativeButton={false}
                      render={<Link href={`/posts/${post.slug}`} />}
                    >
                      <span>Читать далее</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
