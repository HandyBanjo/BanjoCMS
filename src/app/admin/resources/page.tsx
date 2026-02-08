'use client';

import { ContentList } from "@/components/content/content-list";

export default function ResourcesPage() {
    return (
        <ContentList 
            contentType="resource" 
            title="Resources" 
            description="Manage documentation, FAQs, and guides."
            basePath="/admin/resources"
        />
    );
}
