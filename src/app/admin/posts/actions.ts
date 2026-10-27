"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

// 1. Создание статьи
export async function createPost(formData: {
  title: string;
  slug: string;
  content: string;
  status: string;
}) {
  await db.insert(posts).values({
    title: formData.title,
    slug: formData.slug,
    content: formData.content,
    status: formData.status,
  });

  revalidatePath("/admin/posts");
  revalidatePath("/");

  // Возвращаем статус успешного выполнения вместо прямого редиректа
  return { success: true };
}

// 2. Обновление существующей статьи
export async function updatePost(
  id: number,
  formData: { title: string; slug: string; content: string; status: string },
) {
  await db
    .update(posts)
    .set({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      status: formData.status,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath(`/posts/${formData.slug}`);

  // Возвращаем статус успешного выполнения на клиент
  return { success: true };
}

// 3. Удаление статьи
export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/admin/posts");
  revalidatePath("/");
}
