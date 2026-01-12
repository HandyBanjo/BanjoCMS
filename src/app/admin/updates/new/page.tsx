'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Send, Rocket } from "lucide-react";

export default function NewUpdatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        version: '',
        updateType: 'feature',
        impactLevel: 'minor',
        summary: '',
        body: '',
    });

    const handleSubmit = async (status: 'draft' | 'published') => {
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                // Auto-slug
                slug: `v${formData.version}-${formData.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                contentType: 'update',
                status: status,
                version: formData.version,
                updateType: formData.updateType,
                impactLevel: formData.impactLevel,
                summary: formData.summary,
                body: formData.body,
                metadata: {
                    // updates rarely need seo meta manual override
                }
            };

            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create update');

            router.push('/admin/updates');
        } catch (error) {
            console.error('Failed to create update:', error);
            alert('Failed to create update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/updates">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Update</h1>
                    <p className="text-muted-foreground">Release a new version or changelog entry.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Update Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Update Title</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Dark Mode & Performance Boost"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="version">Version</Label>
                                <Input
                                    id="version"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    placeholder="1.0.1"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="updateType">Type</Label>
                                <select
                                    id="updateType"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.updateType}
                                    onChange={(e) => setFormData({ ...formData, updateType: e.target.value })}
                                >
                                    <option value="feature">Feature</option>
                                    <option value="improvement">Improvement</option>
                                    <option value="fix">Bug Fix</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="impact">Impact</Label>
                                <select
                                    id="impact"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.impactLevel}
                                    onChange={(e) => setFormData({ ...formData, impactLevel: e.target.value })}
                                >
                                    <option value="major">Major</option>
                                    <option value="minor">Minor</option>
                                    <option value="patch">Patch</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                rows={2}
                                placeholder="Brief content for email/notifications"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="body">Full Release Notes (Rich Text)</Label>
                            <Textarea
                                id="body"
                                required
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                rows={10}
                                className="font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4 sticky bottom-6 bg-background/95 backdrop-blur py-4 border-t z-10">
                    <Button
                        disabled={loading}
                        onClick={() => handleSubmit('published')}
                        className="w-full sm:w-auto"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                        Publish Release
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
