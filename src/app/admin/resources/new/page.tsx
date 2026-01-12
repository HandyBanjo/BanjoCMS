'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Send, Plus, X } from "lucide-react";

interface ResourceOption {
    _id: string;
    title: string;
}

export default function NewResourcePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [parents, setParents] = useState<ResourceOption[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        body: '',
        version: '',
        parentId: '',
        categories: '',
        attachments: [] as { name: string; url: string; type: 'file' }[],
    });

    useEffect(() => {
        // Fetch potential parent resources (roots)
        fetch('/api/content?contentType=resource&parentId=root')
            .then(res => res.json())
            .then(data => setParents(data.content || []))
            .catch(console.error);
    }, []);

    const addAttachment = () => {
        setFormData({
            ...formData,
            attachments: [...formData.attachments, { name: '', url: '', type: 'file' }]
        });
    };

    const removeAttachment = (index: number) => {
        const newAttachments = [...formData.attachments];
        newAttachments.splice(index, 1);
        setFormData({ ...formData, attachments: newAttachments });
    };

    const updateAttachment = (index: number, field: 'name' | 'url', value: string) => {
        const newAttachments = [...formData.attachments];
        newAttachments[index] = { ...newAttachments[index], [field]: value };
        setFormData({ ...formData, attachments: newAttachments });
    };

    const handleSubmit = async (status: 'draft' | 'published') => {
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                summary: formData.summary,
                body: formData.body,
                status: status,
                contentType: 'resource',
                version: formData.version,
                parentId: formData.parentId || null,
                attachments: formData.attachments.filter(a => a.url), // Only keep valid attachments
                metadata: {
                    categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
                },
            };

            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create resource');

            router.push('/admin/resources');
        } catch (error) {
            console.error('Failed to create resource:', error);
            alert('Failed to create resource. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/resources">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Resource</h1>
                    <p className="text-muted-foreground">Create a guide, documentation, or downloadable.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Resource Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title & Slug */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Getting Started Guide"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="version">Version</Label>
                                <Input
                                    id="version"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    placeholder="e.g. 1.0.0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="parent">Parent Resource</Label>
                                <select
                                    id="parent"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                >
                                    <option value="">None (Root Level)</option>
                                    {parents.map(p => (
                                        <option key={p._id} value={p._id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="summary">Short Summary</Label>
                            <Textarea
                                id="summary"
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                rows={2}
                                placeholder="Brief description for list view"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="body">Content (Rich Text)</Label>
                            <Textarea
                                id="body"
                                required
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                rows={10}
                                className="font-mono"
                                placeholder="Full content..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="categories">Categories (comma-separated)</Label>
                            <Input
                                id="categories"
                                value={formData.categories}
                                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                                placeholder="Tutorials, API, FAQ"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Attachments</CardTitle>
                        <Button variant="outline" size="sm" onClick={addAttachment}>
                            <Plus className="h-4 w-4 mr-2" /> Add File
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.attachments.map((file, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="grid gap-2 flex-1">
                                    <Input
                                        placeholder="File Name"
                                        value={file.name}
                                        onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2 flex-[2]">
                                    <Input
                                        placeholder="https://..."
                                        value={file.url}
                                        onChange={(e) => updateAttachment(index, 'url', e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {formData.attachments.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No file attachments.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4 sticky bottom-6 bg-background/95 backdrop-blur py-4 border-t z-10">
                    <Button
                        disabled={loading}
                        onClick={() => handleSubmit('published')}
                        className="w-full sm:w-auto"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Publish Resource
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={loading}
                        onClick={() => handleSubmit('draft')}
                        className="w-full sm:w-auto"
                    >
                        Save as Draft
                    </Button>
                </div>
            </div>
        </div>
    );
}
