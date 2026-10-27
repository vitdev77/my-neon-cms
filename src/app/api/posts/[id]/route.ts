import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, Number(id)),
    });

    if (!post) {
      return NextResponse.json({ error: "Пост не найден" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
