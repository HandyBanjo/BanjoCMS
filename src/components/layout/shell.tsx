"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface ShellProps {
    children: React.ReactNode;
}

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Shell({ children }: ShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
            <div className={cn("flex flex-col min-h-screen transition-all duration-300", isCollapsed ? "pl-16" : "pl-64")}>
                <Header />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
