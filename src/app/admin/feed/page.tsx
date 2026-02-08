'use client';

import { ContentList } from "@/components/content/content-list";

export default function FeedPage() {
    return (
        <ContentList 
            contentType="feed" 
            title="Social Feed" 
            description="Manage social media posts and feed content."
            basePath="/admin/feed"
        />
    );
}
