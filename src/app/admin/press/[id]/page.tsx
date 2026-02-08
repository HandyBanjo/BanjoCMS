'use client';

import { ContentEditor } from "@/components/editor/content-editor";
import { use } from 'react';

export default function EditPressPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <ContentEditor mode="edit" id={id} />;
}
