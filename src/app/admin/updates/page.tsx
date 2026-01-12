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
import { Plus, Trash2, Edit, Loader2, Rocket, Sparkles, Bug, Wrench } from "lucide-react";

interface UpdatePost {
    _id: string;
    title: string;
    slug: string;
    status: string;
    updateType: string;
    version: string;
    publishedAt?: string;
}

export default function UpdatesPage() {
    const [updates, setUpdates] = useState<UpdatePost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/content?contentType=update&limit=100`);
            const data = await response.json();
            setUpdates(data.content || []);
        } catch (error) {
            console.error('Failed to fetch updates:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUpdate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this update?')) return;

        try {
            await fetch(`/api/content/${id}`, { method: 'DELETE' });
            fetchUpdates();
        } catch (error) {
            console.error('Failed to delete update:', error);
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'feature': return <Badge variant="default" className="gap-1"><Sparkles className="h-3 w-3" /> Feature</Badge>;
            case 'improvement': return <Badge variant="secondary" className="gap-1"><Wrench className="h-3 w-3" /> Improvement</Badge>;
            case 'fix': return <Badge variant="destructive" className="gap-1"><Bug className="h-3 w-3" /> Bug Fix</Badge>;
            default: return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Updates</h1>
                    <p className="text-muted-foreground">Release notes and product announcements.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/updates/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Update
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Changelog</CardTitle>
                    <CardDescription>
                        History of all product updates.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : updates.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                            <p className="text-muted-foreground">No updates found.</p>
                            <Button variant="link" asChild>
                                <Link href="/admin/updates/new">Release your first update</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {updates.map((post) => (
                                    <TableRow key={post._id}>
                                        <TableCell className="font-mono text-sm">
                                            {post.version}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {post.title}
                                        </TableCell>
                                        <TableCell>
                                            {getTypeBadge(post.updateType)}
                                        </TableCell>
                                        <TableCell>
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => deleteUpdate(post._id)}
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
