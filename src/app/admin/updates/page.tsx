'use client';

import { ContentList } from "@/components/content/content-list";

export default function UpdatesPage() {
    return (
        <ContentList 
            contentType="update" 
            title="Platform Updates" 
            description="Manage version releases and changelogs."
            basePath="/admin/updates"
        />
    );
}
