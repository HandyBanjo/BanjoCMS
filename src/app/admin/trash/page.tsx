'use client';

import { useState, useEffect } from 'react';
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
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import { Content } from "@/lib/models";
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

export default function TrashPage() {
    const [posts, setPosts] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeletedPosts();
    }, []);

    const fetchDeletedPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/content/trash`);
            const data = await response.json();
            setPosts(data.content || []);
        } catch (error) {
            console.error('Failed to fetch deleted content:', error);
        } finally {
            setLoading(false);
        }
    };

    const restorePost = async (id: string) => {
        try {
            await fetch(`/api/content/trash/${id}`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'restore' })
            });
            fetchDeletedPosts();
        } catch (error) {
            console.error('Failed to restore item:', error);
        }
    };

    const permanentlyDeletePost = async (id: string) => {
        try {
            await fetch(`/api/content/trash/${id}`, { method: 'DELETE' });
            fetchDeletedPosts();
        } catch (error) {
            console.error('Failed to permanently delete item:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trash</h1>
                    <p className="text-muted-foreground">Manage deleted items. Items here can be restored or permanently removed.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Deleted Items</CardTitle>
                    <CardDescription>
                        {posts.length} items in trash
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                            <p className="text-muted-foreground">The trash is empty.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Deleted On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post: any) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">
                                            <div>{post.title}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{post.slug}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {post.content_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {post.deleted_at ? new Date(post.deleted_at).toLocaleDateString() : 'Unknown'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => restorePost(post.id)}
                                                    title="Restore Content"
                                                >
                                                    <RotateCcw className="h-4 w-4 mr-2" />
                                                    Restore
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Forever
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the content "{post.title}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => permanentlyDeletePost(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Delete Forever
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
