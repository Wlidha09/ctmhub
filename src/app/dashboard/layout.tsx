
"use client"

import { useAuth } from "@/hooks/use-auth";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarClock, 
  Wallet, 
  ShieldCheck, 
  Ticket, 
  Settings, 
  LogOut,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['Employee', 'Manager', 'HR', 'Owner', 'Dev'] },
    { name: 'Annuaire Staff', icon: Users, href: '/employees', roles: ['Employee', 'Manager', 'HR', 'Owner', 'Dev'] },
    { name: 'Départements', icon: Building2, href: '/departments', roles: ['Manager', 'HR', 'Owner', 'Dev'] },
    { name: 'Congés', icon: CalendarClock, href: '/leave', roles: ['Employee', 'Manager', 'HR', 'Owner', 'Dev'] },
    { name: 'Disponibilité', icon: CalendarClock, href: '/availability', roles: ['Employee', 'Manager'] },
    { name: 'Paie', icon: Wallet, href: '/payroll', roles: ['Employee', 'HR', 'Owner', 'Dev'] },
    { name: 'Tickets Vouchers', icon: Ticket, href: '/tickets', roles: ['HR', 'Owner', 'Dev'] },
    { name: 'Permissions', icon: ShieldCheck, href: '/permissions', roles: ['Owner', 'Dev'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar className="border-r border-sidebar-border">
          <SidebarHeader className="p-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-headline font-bold text-sidebar-foreground">CTM Hub</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-sidebar-foreground/50">Menu Principal</SidebarGroupLabel>
              <SidebarMenu className="px-3">
                {filteredNav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      className="rounded-xl px-4 py-6 transition-all"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="rounded-xl px-4 py-6">
                  <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className="rounded-xl px-4 py-6 text-red-400 hover:text-red-300">
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="mt-4 flex items-center gap-3 px-2">
              <Avatar className="w-10 h-10 border-2 border-accent">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate text-sidebar-foreground">{user.name}</span>
                <span className="text-xs text-sidebar-foreground/50 uppercase tracking-tighter">{user.role}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
