'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit, Loader2, Share2, Instagram, Linkedin, Youtube, Twitter, Facebook } from "lucide-react";

interface SocialPost {
    _id: string;
    title: string;
    slug: string;
    status: string;
    platform: string;
    publishedAt?: string;
}

export default function SocialPage() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/content?contentType=social&limit=100`);
            const data = await response.json();
            setPosts(data.content || []);
        } catch (error) {
            console.error('Failed to fetch social posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Are you sure you want to delete this repost?')) return;

        try {
            await fetch(`/api/content/${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return <Instagram className="h-4 w-4" />;
            case 'linkedin': return <Linkedin className="h-4 w-4" />;
            case 'youtube': return <Youtube className="h-4 w-4" />;
            case 'twitter': return <Twitter className="h-4 w-4" />;
            case 'facebook': return <Facebook className="h-4 w-4" />;
            default: return <Share2 className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Social Media Reposts</h1>
                    <p className="text-muted-foreground">Archive and display content from your social channels.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/social/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Repost
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Archive</CardTitle>
                    <CardDescription>
                        All social media content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                            <p className="text-muted-foreground">No reposts found.</p>
                            <Button variant="link" asChild>
                                <Link href="/admin/social/new">Add your first repost</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post._id}>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize gap-1">
                                                {getPlatformIcon(post.platform)}
                                                {post.platform}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {post.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                                {post.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Edit support could be added later, simplified actions for now */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => deletePost(post._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
