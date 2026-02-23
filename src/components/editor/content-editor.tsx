'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Save, Send, Plus, Trash } from "lucide-react";
import Link from 'next/link';
import { createClient } from "@/lib/supabase/client";
import { Content, ContentType, Platform, UpdateType } from '@/lib/models';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from './error-boundary';

const RichEditor = dynamic(() => import('./rich-editor').then(mod => mod.RichEditor), { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-[400px] rounded-md" />
});

import { CommaSeparatedInput } from "@/components/ui/comma-separated-input";
import { ImageUploader } from "./image-uploader";

interface ContentEditorProps {
    mode: 'create' | 'edit';
    id?: string;
    defaultType?: ContentType;
}

const DEFAULT_FORM_DATA: Partial<Content> = {
    title: '',
    slug: '',
    content_type: 'post',
    status: 'draft',
    body: '',
    excerpt: '',
    featured_image: '',
    platform: undefined,
    version: '',
    update_type: undefined,
    metadata: {
        tags: [],
        categories: [],
        seo: {
            metaTitle: '',
            metaDescription: '',
            schemaType: 'Article',
        },
        geo: {
            region: '',
            placename: '',
        },
        aeo: {
            answerSnippet: '',
        },
        faq: [],
        steps: [],
        changelog: [],
    }
};

export function ContentEditor({ mode, id, defaultType = 'post' }: ContentEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(mode === 'edit');
    const [formData, setFormData] = useState<Partial<Content>>({
        ...DEFAULT_FORM_DATA,
        content_type: defaultType,
    });

    // Fetch existing data for edit mode
    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchPost = async () => {
                try {
                    const response = await fetch(`/api/content/${id}`);
                    if (!response.ok) throw new Error('Failed to fetch content');
                    const data = await response.json();
                    
                    // Merge with default structure to prevent undefined errors
                    setFormData({
                        ...DEFAULT_FORM_DATA,
                        ...data,
                        metadata: {
                            ...DEFAULT_FORM_DATA.metadata,
                            ...data.metadata,
                            seo: { ...DEFAULT_FORM_DATA.metadata?.seo, ...data.metadata?.seo },
                            geo: { ...DEFAULT_FORM_DATA.metadata?.geo, ...data.metadata?.geo },
                            aeo: { ...DEFAULT_FORM_DATA.metadata?.aeo, ...data.metadata?.aeo },
                        }
                    });
                } catch (error) {
                    console.error('Failed to load content:', error);
                    alert('Failed to load content data');
                } finally {
                    setFetching(false);
                }
            };
            fetchPost();
        }
    }, [mode, id]);

    const handleChange = (field: keyof Content, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMetadataChange = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [section]: {
                    ...prev.metadata?.[section],
                    [field]: value
                }
            }
        }));
    };

    const handleArrayMetadata = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [key]: value.split(',').map(s => s.trim()).filter(Boolean)
            }
        }));
    };

    const handleSubmit = async (status: 'draft' | 'published') => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            const payload = {
                ...formData,
                status,
                slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                author_id: user?.id, // Will be handled by API if not present but good to have
            };

            const url = mode === 'create' ? '/api/content' : `/api/content/${id}`;
            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save content');

            const redirectMap: Record<ContentType, string> = {
                post: '/admin/blog',
                update: '/admin/updates',
                resource: '/admin/resources',
                press: '/admin/press',
                feed: '/admin/feed',
            };

            const redirectPath = redirectMap[formData.content_type?.toLowerCase() as ContentType] || '/admin/blog';
            router.push(redirectPath);
        } catch (error) {
            console.error('Failed to save content:', error);
            alert('Failed to save content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center">Loading editor...</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => {
                    const redirectMap: Record<ContentType, string> = {
                        post: '/admin/blog',
                        update: '/admin/updates',
                        resource: '/admin/resources',
                        press: '/admin/press',
                        feed: '/admin/feed',
                    };
                    const redirectPath = redirectMap[formData.content_type?.toLowerCase() as ContentType] || '/admin/blog';
                    router.push(redirectPath);
                }}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {mode === 'create' ? 'Create New Content' : 'Edit Content'}
                    </h1>
                    <p className="text-muted-foreground">Manage your content across all platforms.</p>
                </div>
            </div>

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata & Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO & GEO</TabsTrigger>
                </TabsList>

                {/* TAB: CONTENT */}
                <TabsContent value="content" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.content_type !== 'feed' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Slug</Label>
                                        <Input 
                                            value={formData.slug} 
                                            onChange={e => handleChange('slug', e.target.value)}
                                            placeholder="auto-generated" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input 
                                            value={formData.title} 
                                            onChange={e => handleChange('title', e.target.value)}
                                            placeholder="Enter title..." 
                                        />
                                    </div>
                                </>
                            ) : (
                                /* FEED SPECIFIC UI */
                                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border-dashed border-2">
                                    <div className="col-span-2 flex items-center justify-between">
                                        <Label className="text-lg font-semibold">Social Media Post</Label>
                                    </div>
                                    
                                    <div className="col-span-2 md:col-span-1 space-y-4">
                                        <div className="space-y-2">
                                            <Label>Platform</Label>
                                            <Select 
                                                value={formData.platform} 
                                                onValueChange={v => handleChange('platform', v)}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Platform" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="twitter">Twitter / X</SelectItem>
                                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                    <SelectItem value="instagram">Instagram</SelectItem>
                                                    <SelectItem value="facebook">Facebook</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Image (Upload or URL)</Label>
                                            <ImageUploader 
                                                value={formData.featured_image}
                                                onChange={url => handleChange('featured_image', url)}
                                                folder="feed"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1 space-y-2">
                                        <Label>Caption / Excerpt</Label>
                                        <Textarea 
                                            rows={12} 
                                            className="resize-none"
                                            value={formData.excerpt}
                                            onChange={e => {
                                                handleChange('excerpt', e.target.value);
                                                // Also set title automatically for reference
                                                handleChange('title', `Social Post - ${new Date().toLocaleDateString()}`);
                                            }}
                                            placeholder="Write your caption here..."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Fields based on Type (Updates) */}
                            {formData.content_type === 'update' && (
                                <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-md">
                                    <div className="space-y-2">
                                        <Label>Version</Label>
                                        <Input 
                                            value={formData.version || ''} 
                                            onChange={e => handleChange('version', e.target.value)}
                                            placeholder="v1.0.0" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Update Type</Label>
                                        <Select 
                                            value={formData.update_type} 
                                            onValueChange={v => handleChange('update_type', v)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="feature">New Feature</SelectItem>
                                                <SelectItem value="improvement">Improvement</SelectItem>
                                                <SelectItem value="fix">Bug Fix</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {/* Standard Fields for Non-Feed */}
                            {formData.content_type !== 'feed' && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Excerpt / Summary</Label>
                                        <Textarea 
                                            rows={3} 
                                            value={formData.excerpt}
                                            onChange={e => handleChange('excerpt', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Main Content (HTML/Markdown)</Label>
                                        <ErrorBoundary>
                                            <RichEditor 
                                                value={formData.body || ''}
                                                onChange={value => handleChange('body', value)}
                                            />
                                        </ErrorBoundary>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB: METADATA */}
                <TabsContent value="metadata" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader><CardTitle>Organization & Media</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Featured Image</Label>
                                <ImageUploader 
                                    value={formData.featured_image}
                                    onChange={url => handleChange('featured_image', url)}
                                    folder="blog"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tags (comma separated)</Label>
                                    <CommaSeparatedInput 
                                        value={formData.metadata?.tags || []}
                                        onChange={val => handleChange('metadata', { ...formData.metadata, tags: val })}
                                        placeholder="news, tech, update"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Categories (comma separated)</Label>
                                    <CommaSeparatedInput 
                                        value={formData.metadata?.categories || []}
                                        onChange={val => handleChange('metadata', { ...formData.metadata, categories: val })}
                                        placeholder="Announcements, Resources"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FAQ Builder for Resources */}
                    {formData.content_type === 'resource' && (
                        <Card>
                            <CardHeader><CardTitle>FAQ Builder</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {(formData.metadata?.faq || []).map((item: any, i: number) => (
                                    <div key={i} className="flex gap-2 items-start border p-2 rounded">
                                        <div className="grid gap-2 flex-1">
                                            <Input 
                                                placeholder="Question" 
                                                value={item.question}
                                                onChange={e => {
                                                    const newFaq = [...(formData.metadata?.faq || [])];
                                                    newFaq[i].question = e.target.value;
                                                    handleChange('metadata', { ...formData.metadata, faq: newFaq });
                                                }}
                                            />
                                            <Textarea 
                                                placeholder="Answer" 
                                                value={item.answer}
                                                onChange={e => {
                                                    const newFaq = [...(formData.metadata?.faq || [])];
                                                    newFaq[i].answer = e.target.value;
                                                    handleChange('metadata', { ...formData.metadata, faq: newFaq });
                                                }}
                                            />
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => {
                                                const newFaq = formData.metadata?.faq?.filter((_: any, idx: number) => idx !== i);
                                                handleChange('metadata', { ...formData.metadata, faq: newFaq });
                                            }}
                                        >
                                            <Trash className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        const newFaq = [...(formData.metadata?.faq || []), { question: '', answer: '' }];
                                        handleChange('metadata', { ...formData.metadata, faq: newFaq });
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add FAQ
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* TAB: SEO */}
                <TabsContent value="seo" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader><CardTitle>Advanced SEO & Schema</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Meta Title</Label>
                                    <Input 
                                        value={formData.metadata?.seo?.metaTitle || ''}
                                        onChange={e => handleMetadataChange('seo', 'metaTitle', e.target.value)}
                                        placeholder="Specific title for search engines"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Schema Type</Label>
                                    <Select 
                                        value={formData.metadata?.seo?.schemaType || 'Article'}
                                        onValueChange={v => handleMetadataChange('seo', 'schemaType', v)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Article">Article</SelectItem>
                                            <SelectItem value="NewsArticle">News Article</SelectItem>
                                            <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                                            <SelectItem value="TechArticle">Tech Article</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea 
                                    value={formData.metadata?.seo?.metaDescription || ''}
                                    onChange={e => handleMetadataChange('seo', 'metaDescription', e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>AEO (Answer Engine Optimization)</CardTitle>
                            <CardDescription>Target voice search and featured snippets.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Direct Answer Snippet (40-60 words)</Label>
                                <Textarea 
                                    className="bg-yellow-50 dark:bg-yellow-900/10"
                                    placeholder="A concise answer to the main question of this page..."
                                    value={formData.metadata?.aeo?.answerSnippet || ''}
                                    onChange={e => handleMetadataChange('aeo', 'answerSnippet', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">This content is specifically structured for voice assistants.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>GEO (Local SEO)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Target Region</Label>
                                    <Input 
                                        placeholder="e.g. US-CA" 
                                        value={formData.metadata?.geo?.region || ''}
                                        onChange={e => handleMetadataChange('geo', 'region', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Placename</Label>
                                    <Input 
                                        placeholder="e.g. San Francisco" 
                                        value={formData.metadata?.geo?.placename || ''}
                                        onChange={e => handleMetadataChange('geo', 'placename', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Footer Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-4 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => {
                        const redirectMap: Record<ContentType, string> = {
                            post: '/admin/blog',
                            update: '/admin/updates',
                            resource: '/admin/resources',
                            press: '/admin/press',
                            feed: '/admin/feed',
                        };
                        const redirectPath = redirectMap[formData.content_type?.toLowerCase() as ContentType] || '/admin/blog';
                        router.push(redirectPath);
                    }}>
                        Cancel
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick={() => handleSubmit('draft')} 
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Draft
                    </Button>
                    <Button 
                        onClick={() => handleSubmit('published')} 
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                        Publish Content
                    </Button>
                </div>
            </div>
        </div>
    );
}
