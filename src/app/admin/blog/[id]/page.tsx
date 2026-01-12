'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [postId, setPostId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        body: '',
        status: 'draft',
        contentType: 'post',
        featuredImage: '',
        tags: '',
        categories: '',
        metaTitle: '',
        metaDescription: '',
    });

    useEffect(() => {
        // Unwrap params
        params.then((resolvedParams) => {
            setPostId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/content/${postId}`);
                if (!response.ok) throw new Error('Failed to fetch post');
                const data = await response.json();

                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    excerpt: data.excerpt || '',
                    body: data.body || '',
                    status: data.status || 'draft',
                    contentType: data.contentType || 'post',
                    featuredImage: data.featuredImage || '',
                    tags: data.metadata?.tags?.join(', ') || '',
                    categories: data.metadata?.categories?.join(', ') || '',
                    metaTitle: data.metadata?.seo?.metaTitle || '',
                    metaDescription: data.metadata?.seo?.metaDescription || '',
                });
            } catch (error) {
                console.error('Failed to fetch post:', error);
                alert('Failed to load post data');
                router.push('/admin/blog');
            } finally {
                setFetching(false);
            }
        };

        fetchPost();
    }, [postId, router]);

    const handleSubmit = async (status: 'draft' | 'published') => {
        if (!postId) return;
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                excerpt: formData.excerpt,
                body: formData.body,
                status: status,
                contentType: formData.contentType,
                featuredImage: formData.featuredImage || undefined,
                metadata: {
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
                    seo: {
                        metaTitle: formData.metaTitle || formData.title,
                        metaDescription: formData.metaDescription || formData.excerpt,
                    },
                },
            };

            const response = await fetch(`/api/content/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to update post');

            router.push('/admin/blog');
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('Failed to update post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
                <p className="text-muted-foreground">Loading article...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/blog">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
                    <p className="text-muted-foreground">Make changes to your article.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Core details of your article.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter article title"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="auto-generated-from-title"
                            />
                            <p className="text-[0.8rem] text-muted-foreground">Leave empty to auto-generate from title</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="excerpt">Excerpt *</Label>
                            <Textarea
                                id="excerpt"
                                required
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={3}
                                placeholder="Brief summary of the article"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="body">Content *</Label>
                            <Textarea
                                id="body"
                                required
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                rows={15}
                                className="font-mono"
                                placeholder="Write your article content here (HTML supported)"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="featuredImage">Featured Image URL</Label>
                            <Input
                                id="featuredImage"
                                type="url"
                                value={formData.featuredImage}
                                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Metadata</CardTitle>
                        <CardDescription>Tags and categories for organization.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="home improvement, DIY, tips"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="categories">Categories (comma-separated)</Label>
                            <Input
                                id="categories"
                                value={formData.categories}
                                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                                placeholder="Guides, Tips, News"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>SEO</CardTitle>
                        <CardDescription>Search engine optimization settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input
                                id="metaTitle"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                placeholder="Leave empty to use article title"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea
                                id="metaDescription"
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                rows={2}
                                placeholder="Leave empty to use excerpt"
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
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Publish Changes
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={loading}
                        onClick={() => handleSubmit('draft')}
                        className="w-full sm:w-auto"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save as Draft
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto ml-auto sm:ml-0">
                        <Link href="/admin/blog">Cancel</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
