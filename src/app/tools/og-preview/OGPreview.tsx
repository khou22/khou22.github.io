"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CopyIcon, DownloadIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

interface OGData {
    title: string;
    description: string;
    siteName: string;
    url: string;
    template: string;
}

const LOCAL_STORAGE_KEY = "ogPreview";

export const OGPreview = () => {
    const [ogData, setOGData] = useState<OGData>({
        title: "Your Amazing Title",
        description: "A compelling description that makes people want to click and share your content.",
        siteName: "Kevin Hou",
        url: "https://khou22.com",
        template: "default",
    });

    const [imageUrl, setImageUrl] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState("facebook");

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored) as OGData;
                setOGData(data);
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    // Save to localStorage when data changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ogData));
    }, [ogData]);

    // Generate image URL with debouncing
    const generateImageUrl = useCallback(() => {
        const params = new URLSearchParams({
            title: ogData.title,
            description: ogData.description,
            siteName: ogData.siteName,
            url: ogData.url,
            template: ogData.template,
        });

        const url = `/tools/og-preview/og-image?${params.toString()}`;
        setImageUrl(url);
    }, [ogData]);

    useEffect(() => {
        const timer = setTimeout(generateImageUrl, 300);
        return () => clearTimeout(timer);
    }, [generateImageUrl]);

    const handleInputChange = (field: keyof OGData, value: string) => {
        setOGData(prev => ({ ...prev, [field]: value }));
    };

    const copyImageUrl = async () => {
        const fullUrl = `${window.location.origin}${imageUrl}`;
        await navigator.clipboard.writeText(fullUrl);
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `og-image-${ogData.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyMetaTags = async () => {
        const fullImageUrl = `${window.location.origin}${imageUrl}`;
        const metaTags = `<meta property="og:title" content="${ogData.title}" />
<meta property="og:description" content="${ogData.description}" />
<meta property="og:image" content="${fullImageUrl}" />
<meta property="og:url" content="${ogData.url}" />
<meta property="og:site_name" content="${ogData.siteName}" />
<meta property="og:type" content="website" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${ogData.title}" />
<meta name="twitter:description" content="${ogData.description}" />
<meta name="twitter:image" content="${fullImageUrl}" />`;

        await navigator.clipboard.writeText(metaTags);
    };

    const clearAll = () => {
        setOGData({
            title: "",
            description: "",
            siteName: "Kevin Hou",
            url: "",
            template: "default",
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    return (
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Input Form */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Content Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={ogData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Enter your page title"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={ogData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter a compelling description"
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                value={ogData.siteName}
                                onChange={(e) => handleInputChange("siteName", e.target.value)}
                                placeholder="Your site name"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                value={ogData.url}
                                onChange={(e) => handleInputChange("url", e.target.value)}
                                placeholder="https://example.com"
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Export Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button onClick={copyImageUrl} variant="outline" className="w-full">
                            <CopyIcon className="mr-2 h-4 w-4" />
                            Copy Image URL
                        </Button>
                        <Button onClick={downloadImage} variant="outline" className="w-full">
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Download Image
                        </Button>
                        <Button onClick={copyMetaTags} variant="outline" className="w-full">
                            <CopyIcon className="mr-2 h-4 w-4" />
                            Copy Meta Tags
                        </Button>
                        <Button onClick={clearAll} variant="destructive" size="sm" className="w-full">
                            Clear All
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Social Media Previews</CardTitle>
                        <p className="text-sm text-gray-600">
                            See how your content will appear across different platforms
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full">
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <Button
                                    variant={activeTab === "facebook" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveTab("facebook")}
                                >
                                    Facebook
                                </Button>
                                <Button
                                    variant={activeTab === "twitter" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveTab("twitter")}
                                >
                                    Twitter
                                </Button>
                                <Button
                                    variant={activeTab === "linkedin" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveTab("linkedin")}
                                >
                                    LinkedIn
                                </Button>
                                <Button
                                    variant={activeTab === "imessage" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveTab("imessage")}
                                >
                                    iMessage
                                </Button>
                            </div>

                            {/* Facebook Preview */}
                            {activeTab === "facebook" && (
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="OG Preview"
                                            className="w-full h-auto"
                                            style={{ aspectRatio: "1200/630" }}
                                        />
                                    )}
                                    <div className="p-3 border-t bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase mb-1">
                                            {ogData.url.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com'}
                                        </div>
                                        <div className="font-semibold text-sm text-gray-900 mb-1">
                                            {ogData.title || 'Title'}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {ogData.description || 'Description'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Twitter Preview */}
                            {activeTab === "twitter" && (
                                <div className="border rounded-2xl overflow-hidden bg-white">
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="Twitter Preview"
                                            className="w-full h-auto"
                                            style={{ aspectRatio: "1200/630" }}
                                        />
                                    )}
                                    <div className="p-3">
                                        <div className="text-sm text-gray-900 font-medium mb-1">
                                            {ogData.title || 'Title'}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            {ogData.description || 'Description'}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <ExternalLinkIcon className="mr-1 h-3 w-3" />
                                            {ogData.url.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LinkedIn Preview */}
                            {activeTab === "linkedin" && (
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="LinkedIn Preview"
                                            className="w-full h-auto"
                                            style={{ aspectRatio: "1200/630" }}
                                        />
                                    )}
                                    <div className="p-4">
                                        <div className="font-semibold text-gray-900 mb-1">
                                            {ogData.title || 'Title'}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            {ogData.description || 'Description'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {ogData.url.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* iMessage Preview */}
                            {activeTab === "imessage" && (
                                <div className="bg-gray-100 p-4 rounded-2xl">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm max-w-sm">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt="iMessage Preview"
                                                className="w-full h-auto"
                                                style={{ aspectRatio: "1200/630" }}
                                            />
                                        )}
                                        <div className="p-3">
                                            <div className="font-medium text-sm text-gray-900 mb-1">
                                                {ogData.title || 'Title'}
                                            </div>
                                            <div className="text-xs text-gray-600 mb-2">
                                                {ogData.description || 'Description'}
                                            </div>
                                            <div className="text-xs text-blue-600">
                                                {ogData.url || 'https://example.com'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
