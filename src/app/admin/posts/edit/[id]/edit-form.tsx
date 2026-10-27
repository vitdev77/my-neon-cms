"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { updatePost } from "@/app/admin/posts/actions";
import { toast } from "@/components/ui/toast"; // Используем экспортируемый менеджер

interface EditPostFormProps {
  id: number;
  initialData: {
    title: string;
    slug: string;
    content: string;
    status: string;
  };
}

export default function EditPostForm({ id, initialData }: EditPostFormProps) {
  const router = useRouter();

  const [title, setTitle] = React.useState(initialData.title);
  const [slug, setSlug] = React.useState(initialData.slug);
  const [content, setContent] = React.useState(initialData.content);

  const [isPending, setIsPending] = React.useState(false);

  const generateSlug = (text: string) => {
    const cyrillicToTranslit: { [key: string]: string } = {
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "yo",
      ж: "zh",
      з: "z",
      и: "i",
      й: "y",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "kh",
      ц: "ts",
      ч: "ch",
      ш: "sh",
      щ: "sch",
      ъ: "",
      ы: "y",
      ь: "",
      э: "e",
      ю: "yu",
      я: "ya",
    };
    const lowerText = text.toLowerCase();
    let result = "";
    for (let i = 0; i < lowerText.length; i++) {
      const char = lowerText[i];
      result +=
        cyrillicToTranslit[char] !== undefined
          ? cyrillicToTranslit[char]
          : char;
    }
    return result
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(generateSlug(val));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    try {
      setIsPending(true);
      const formData = new FormData(e.currentTarget);
      const statusValue = (formData.get("status") as string) || "draft";

      const result = await updatePost(id, {
        title,
        slug,
        content,
        status: statusValue,
      });

      if (result?.success) {
        // Заменяем toast.show на toast.open для полного соответствия типам @base-ui
        toast.add({
          title: "Изменения сохранены 👍",
          description: "Статья успешно обновлена в базе Neon.",
          type: "success",
        });
        router.push("/admin/posts");
      }
    } catch (error) {
      console.error(error);
      toast.add({
        title: "Ошибка обновления",
        description: "Не удалось сохранить изменения статьи.",
        type: "error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              nativeButton={false}
              type="button"
              render={<Link href="/admin/posts" />}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Редактирование
              </h2>
              <p className="text-sm text-slate-500">
                Изменение существующей публикации
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              type="button"
            >
              <Eye className="h-4 w-4" />
              Предпросмотр
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Заголовок статьи
              </label>
              <Input
                name="title"
                value={title}
                onChange={handleTitleChange}
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Текст статьи (Контент)
              </label>
              <Textarea
                name="content"
                className="min-h-100 resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Параметры
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  URL-адрес (Slug)
                </label>
                <Input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Статус
                </label>
                <Select name="status" defaultValue={status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Черновик</SelectItem>
                    <SelectItem value="published">Опубликовано</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
