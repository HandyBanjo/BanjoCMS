import {
    LayoutDashboard,
    BookType,
    Settings,
    Library,
    Share2,
    Rocket,
    Newspaper,
    Rss,
} from "lucide-react";

export const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Platform Updates",
        href: "/admin/updates",
        icon: Rocket,
    },
    {
        title: "Resources",
        href: "/admin/resources",
        icon: Library,
    },
    {
        title: "Press & Media",
        href: "/admin/press",
        icon: Newspaper,
    },
    {
        title: "Social Feed",
        href: "/admin/feed",
        icon: Rss,
    },
    {
        title: "Blog Articles",
        href: "/admin/blog",
        icon: BookType,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];
