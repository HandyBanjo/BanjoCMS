'use client';

import { ContentList } from "@/components/content/content-list";

export default function BlogPage() {
    return (
        <ContentList 
            contentType="post" 
            title="Blog Articles" 
            description="Manage your SEO-optimized blog articles."
            basePath="/admin/blog"
        />
    );
}
