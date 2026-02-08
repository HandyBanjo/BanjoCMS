'use client';

import { ContentList } from "@/components/content/content-list";

export default function PressPage() {
    return (
        <ContentList 
            contentType="press" 
            title="Press & Media" 
            description="Manage press releases and external media links."
            basePath="/admin/press"
        />
    );
}
