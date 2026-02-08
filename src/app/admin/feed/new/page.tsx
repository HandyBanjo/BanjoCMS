'use client';

import { ContentEditor } from "@/components/editor/content-editor";

export default function NewFeedPage() {
    return <ContentEditor mode="create" defaultType="feed" />;
}
