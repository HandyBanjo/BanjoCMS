"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LogOut,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { sidebarItems } from "@/config/site-config";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn("fixed left-0 top-0 z-40 h-screen border-r bg-card hidden lg:block transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
            <div className={cn("flex h-16 items-center border-b px-4", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span>🪕</span>
                        <span>BanjoCMS</span>
                    </Link>
                )}
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <Menu className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex flex-col gap-2 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname.startsWith(item.href) && item.href !== '/admin'
                        ? true
                        : pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                isActive
                                    ? "bg-secondary text-primary"
                                    : "text-muted-foreground hover:bg-secondary/50",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <item.icon className="h-4 w-4" />
                            {!isCollapsed && item.title}
                        </Link>
                    );
                })}
            </div>
            <div className="absolute bottom-4 left-0 w-full px-4">
                <Button variant="ghost" className={cn("w-full gap-2 text-muted-foreground hover:text-destructive", isCollapsed ? "justify-center px-0" : "justify-start")}>
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && "Sign Out"}
                </Button>
            </div>
        </aside>
    );
}
