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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit, Loader2, Link as LinkIcon, Eye } from "lucide-react";
import { Content, ContentType } from "@/lib/models";

interface ContentListProps {
    contentType: ContentType;
    title: string;
    description: string;
    basePath: string;
}

export function ContentList({ contentType, title, description, basePath }: ContentListProps) {
    const [posts, setPosts] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchPosts();
    }, [filter, contentType]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const status = filter === 'all' ? '' : filter;
            const response = await fetch(`/api/content?status=${status}&contentType=${contentType}&limit=100`);
            const data = await response.json();
            setPosts(data.content || []);
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        try {
            await fetch(`/api/content/${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete item:', error);
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
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <Button asChild>
                    <Link href={`${basePath}/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
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
                    <CardTitle>Items</CardTitle>
                    <CardDescription>
                        Managing {posts.length} {contentType}s
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                            <p className="text-muted-foreground">No items found.</p>
                            <Button variant="link" asChild>
                                <Link href={`${basePath}/new`}>Create your first item</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {contentType === 'feed' && <TableHead className="w-[100px]">Preview</TableHead>}
                                    <TableHead>Title / Info</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id}>
                                        {contentType === 'feed' && (
                                            <TableCell>
                                                {post.featured_image ? (
                                                    <div className="w-16 h-16 rounded overflow-hidden">
                                                        <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : <div className="w-16 h-16 bg-muted rounded" />}
                                            </TableCell>
                                        )}
                                        <TableCell className="font-medium">
                                            <Link href={`/api/content/${post.id}`} target="_blank" className="hover:underline flex items-center gap-1">
                                                {post.title}
                                            </Link>
                                            {(post.slug && contentType !== 'feed') && (
                                                <div className="text-xs text-muted-foreground font-mono">{post.slug}</div>
                                            )}
                                            {contentType === 'update' && post.version && (
                                                <Badge variant="outline" className="mt-1 text-xs">{post.version}</Badge>
                                            )}
                                            {contentType === 'feed' && post.platform && (
                                                <Badge variant="outline" className="mt-1 text-xs capitalize">{post.platform}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusColors[post.status] || "outline"}>
                                                {post.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{post.author_name || 'Unknown'}</TableCell>
                                        <TableCell>
                                            {new Date(post.published_at || post.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild title="Preview Content API">
                                                    <Link href={`/api/content/${post.id}`} target="_blank">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild title="Edit Content">
                                                    <Link href={`${basePath}/${post.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete Content"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this article? This action can be undone from Trash.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Move to Trash
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
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
