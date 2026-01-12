import {
    LayoutDashboard,
    BookType,
    Settings,
    Library,
    Share2,
    Rocket,
} from "lucide-react";

export const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Blog",
        href: "/admin/blog",
        icon: BookType,
    },
    {
        title: "Resources",
        href: "/admin/resources",
        icon: Library,
    },
    {
        title: "Social Reposts",
        href: "/admin/social",
        icon: Share2,
    },
    {
        title: "Platform Updates",
        href: "/admin/updates",
        icon: Rocket,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];
