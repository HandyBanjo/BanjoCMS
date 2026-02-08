'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/upload";

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
}

export function ImageUploader({ value, onChange, folder = 'uploads' }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const url = await uploadImage(file, 'images', folder);
            onChange(url);

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted">
                    <img 
                        src={value} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => onChange('')}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 bg-muted/10 hover:bg-muted/30 transition-colors">
                    <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="p-4 bg-background rounded-full border shadow-sm">
                            {uploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : (
                                <Upload className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-medium text-sm">Click to upload image</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                        </div>
                    </Label>
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </div>
            )}
            
            {/* Fallback to URL input if needed */}
            <div className="flex gap-2 items-center">
                <Input 
                    placeholder="Or enter image URL manualy..." 
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-xs font-mono"
                />
            </div>
        </div>
    );
}
