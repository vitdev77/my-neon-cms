import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Neon CMS Admin</CardTitle>
          <CardDescription>
            Каркас Next.js + shadcn/ui успешно настроен.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Компоненты готовы к сборке дашборда и таблиц контента.
          </p>
          <Button className="w-full">Войти в панель управления</Button>
        </CardContent>
      </Card>
    </div>
  );
}
