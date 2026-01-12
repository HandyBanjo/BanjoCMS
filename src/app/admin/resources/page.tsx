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
import { Plus, Trash2, Edit, Loader2, FileText } from "lucide-react";

interface Resource {
    _id: string;
    title: string;
    slug: string;
    status: string;
    version?: string;
    updatedAt: string;
    metadata?: {
        categories?: string[];
    }
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/content?contentType=resource&limit=100`);
            const data = await response.json();
            setResources(data.content || []);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteResource = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            await fetch(`/api/content/${id}`, { method: 'DELETE' });
            fetchResources();
        } catch (error) {
            console.error('Failed to delete resource:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Resources & Docs</h1>
                    <p className="text-muted-foreground">Manage guides, documentation, and downloads.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/resources/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Resource
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Library</CardTitle>
                    <CardDescription>
                        All documentation and resource files.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                            <p className="text-muted-foreground">No resources found.</p>
                            <Button variant="link" asChild>
                                <Link href="/admin/resources/new">Add your first resource</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Categories</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.map((res) => (
                                    <TableRow key={res._id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <div>{res.title}</div>
                                                    <div className="text-xs text-muted-foreground">{res.slug}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {res.version ? <Badge variant="outline">v{res.version}</Badge> : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {res.metadata?.categories?.slice(0, 2).map(cat => (
                                                    <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(res.updatedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/resources/${res._id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => deleteResource(res._id)}
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
