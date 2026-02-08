'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from "@/components/ui/button";
import { 
    Bold, Italic, List, ListOrdered, Link as LinkIcon, 
    Heading1, Heading2, Quote, Undo, Redo, Code, Minimize2
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Image from '@tiptap/extension-image';
import { Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { useRef, useState } from "react";

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function RichEditor({ value, onChange }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Image.configure({ inline: true }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'min-h-[400px] max-h-[600px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto prose prose-sm dark:prose-invert max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await uploadImage(file, 'images', 'content');
            editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <div className="flex flex-wrap gap-1 border-b pb-2 mb-2">
                <Toggle 
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle 
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                
                <div className="w-px h-6 bg-border mx-1 self-center" />

                <Toggle 
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle 
                    size="sm"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-border mx-1 self-center" />

                <Toggle 
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle 
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-border mx-1 self-center" />

                <Toggle 
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                <Toggle 
                    size="sm"
                    pressed={editor.isActive('codeBlock')}
                    onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <Code className="h-4 w-4" />
                </Toggle>
                
                <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-muted' : ''}>
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    title="Insert Image"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className={`h-4 w-4 ${uploading ? 'animate-pulse text-muted-foreground' : ''}`} />
                </Button>

                <div className="flex-1" />

                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            
            <EditorContent editor={editor} />
        </div>
    );
}
