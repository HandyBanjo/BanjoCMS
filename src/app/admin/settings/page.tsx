"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [siteConfig, setSiteConfig] = useState({
        siteName: "Handy Banjo",
        siteDescription: "The ultimate resource for banjo enthusiasts.",
        contactEmail: "admin@handybanjo.com",
        footerText: "© 2024 Handy Banjo. All rights reserved.",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSiteConfig((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert("Settings saved successfully!");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your site settings and preferences.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>General Site Information</CardTitle>
                        <CardDescription>
                            Configure the basic details of your website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                name="siteName"
                                value={siteConfig.siteName}
                                onChange={handleChange}
                                placeholder="My Awesome Website"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="siteDescription">Site Description</Label>
                            <Textarea
                                id="siteDescription"
                                name="siteDescription"
                                value={siteConfig.siteDescription}
                                onChange={handleChange}
                                placeholder="A brief description of your site."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                value={siteConfig.contactEmail}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="footerText">Footer Text</Label>
                            <Input
                                id="footerText"
                                name="footerText"
                                value={siteConfig.footerText}
                                onChange={handleChange}
                                placeholder="Copyright text"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
