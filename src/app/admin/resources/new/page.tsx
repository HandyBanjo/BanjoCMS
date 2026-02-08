'use client';

import { ContentEditor } from "@/components/editor/content-editor";

export default function NewResourcePage() {
    return <ContentEditor mode="create" defaultType="resource" />;
}
