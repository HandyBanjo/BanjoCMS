'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";

const PLATFORMS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitter', label: 'Twitter (X)' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'other', label: 'Other' },
];

export default function NewSocialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        platform: 'instagram',
        embedCode: '',
        postUrl: '',
        description: '',
        tags: '',
    });

    const handleSubmit = async (status: 'draft' | 'published') => {
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                // Auto-slug
                slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                contentType: 'social',
                status: status,
                platform: formData.platform,
                embedCode: formData.embedCode || undefined,
                postUrl: formData.postUrl || undefined,
                description: formData.description,
                metadata: {
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                }
            };

            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create repost');

            router.push('/admin/social');
        } catch (error) {
            console.error('Failed to create repost:', error);
            alert('Failed to create repost. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/social">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Repost</h1>
                    <p className="text-muted-foreground">Add a social media post to the archive.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Post Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title / Headline *</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. New Feature Announcement"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="platform">Platform</Label>
                            <select
                                id="platform"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            >
                                {PLATFORMS.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="postUrl">Original Post URL</Label>
                            <Input
                                id="postUrl"
                                type="url"
                                value={formData.postUrl}
                                onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
                                placeholder="https://instagram.com/p/..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="embedCode">Embed Code (HTML)</Label>
                            <Textarea
                                id="embedCode"
                                value={formData.embedCode}
                                onChange={(e) => setFormData({ ...formData, embedCode: e.target.value })}
                                rows={5}
                                className="font-mono text-xs"
                                placeholder="<blockquote...>"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description / Caption</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="updates, promo, life"
                            />
                        </div>

                    </CardContent>
                </Card>

                <Button
                    disabled={loading}
                    onClick={() => handleSubmit('published')}
                    className="w-full"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Publish to Archive
                </Button>
            </div>
        </div>
    );
}
