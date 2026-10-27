import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditPostForm from "./edit-form";

// Освобождаем этот динамический сегмент от валидации статического пререндеринга.
// Страница будет компилироваться и рендериться строго при запросе (request-time).
// Это на 100% устраняет ошибку "encountered runtime data during prerendering".
export const instant = false;

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Изолированная функция получения данных статьи с использованием нативного кэша Next.js 15/16
async function getPostById(id: number) {
  "use cache";

  try {
    return await db.query.posts.findFirst({
      where: eq(posts.id, id),
    });
  } catch (error) {
    console.error("Ошибка при получении статьи из Neon:", error);
    return null;
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // Теперь безопасное разворачивание параметров не вызывает ошибок компилятора
  const { id } = await params;
  const postId = Number(id);

  // Запрашиваем статью из базы данных Neon
  const post = await getPostById(postId);

  // Если статья не найдена в базе данных — отдаем стандартную страницу 404
  if (!post) {
    notFound();
  }

  // Передаем чистые данные в клиентскую форму
  return (
    <EditPostForm
      id={postId}
      initialData={{
        title: post.title,
        slug: post.slug,
        content: post.content,
        status: post.status,
      }}
    />
  );
}
