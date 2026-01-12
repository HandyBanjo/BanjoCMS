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
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";

interface Post {
    _id: string;
    title: string;
    slug: string;
    status: string;
    author: { name: string };
    publishedAt?: string;
    createdAt: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const status = filter === 'all' ? '' : filter;
            const response = await fetch(`/api/content?status=${status}&contentType=post&limit=100`);
            const data = await response.json();
            setPosts(data.content || []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await fetch(`/api/content/${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        published: "default",
        draft: "secondary",
        archived: "destructive",
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Blog</h1>
                    <p className="text-muted-foreground">Create and manage your articles.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Article
                    </Link>
                </Button>
            </div>

            <div className="flex w-full items-center space-x-2">
                {['all', 'published', 'draft', 'archived'].map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(status)}
                        className="capitalize"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>
                        A list of all blog posts in your database.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                            <p className="text-muted-foreground">No articles found.</p>
                            <Button variant="link" asChild>
                                <Link href="/admin/blog/new">Create your first article</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post._id}>
                                        <TableCell className="font-medium">
                                            <div>{post.title}</div>
                                            <div className="text-xs text-muted-foreground">{post.slug}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusColors[post.status] || "outline"}>
                                                {post.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{post.author?.name || 'Unknown'}</TableCell>
                                        <TableCell>
                                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/blog/${post._id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
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
