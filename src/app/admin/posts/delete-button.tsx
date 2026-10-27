"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deletePost } from "@/app/admin/posts/actions";
import { toast } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeletePostButtonProps {
  id: number;
}

export default function DeletePostButton({ id }: DeletePostButtonProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    try {
      setIsPending(true);
      // Вызываем Server Action удаления
      await deletePost(id);

      toast.add({
        title: "Удалено 🗑️",
        description: "Публикация успешно стерта из базы данных Neon.",
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.add({
        title: "Ошибка",
        description: "Не удалось удалить статью.",
        type: "error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* 
        Заменяем asChild на свойство render в соответствии с синтаксисом @base-ui.
        Передаем компонент Button внутрь свойства render.
      */}
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-destructive hover:text-destructive/90 hover:bg-destructive/5"
            disabled={isPending}
          />
        }
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        <span>Удалить</span>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <form onSubmit={handleDelete}>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Статья будет безвозвратно удалена из
              вашей облачной базы данных Neon Postgres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Удаление..." : "Да, удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
