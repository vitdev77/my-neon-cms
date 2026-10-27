import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings } from "lucide-react"; // Импортируем иконки

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar className="border-r border-slate-200">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-lg font-bold text-slate-900">
                Neon CMS
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link href="/admin" />}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Главная</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link href="/admin/posts" />}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Все статьи</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-8">
          <header className="flex items-center gap-4 mb-8">
            <SidebarTrigger className="p-2 hover:bg-slate-100 rounded-md" />
            <h1 className="text-xl font-semibold text-slate-800">
              Панель управления
            </h1>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
