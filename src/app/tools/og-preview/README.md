# OG Image Preview Tool

A comprehensive tool for previewing how your content will appear when shared on social media platforms.

## Features

- **Real-time Preview**: See how your content appears across different social platforms
- **Multiple Platform Support**: Preview for Facebook, Twitter, LinkedIn, and iMessage
- **Dynamic Image Generation**: Programmatically generates OG images using Next.js ImageResponse API
- **Export Options**: Copy image URL, download image, or copy meta tags
- **Persistent Storage**: Form data is saved to localStorage for convenience

## File Structure

```
og-preview/
├── README.md              # This documentation
├── page.tsx              # Main page component (SSR-friendly)
├── OGPreview.tsx         # Interactive client component
└── og-image/
    └── route.ts          # API route for image generation
```

## Components

### `page.tsx`
- Server-side rendered page component
- Uses `PageWrapper` with "wide" maxWidth
- Displays tool description and OG image dimensions (1200×630px)

### `OGPreview.tsx`
- Client-side interactive component
- Form inputs for title, description, site name, and URL
- Button-based navigation for platform previews
- Real-time image generation with debouncing
- Export functionality (copy URL, download, copy meta tags)
- localStorage persistence

### `og-image/route.ts`
- Edge runtime API route
- Uses `ImageResponse` from `next/og` for programmatic image generation
- Accepts query parameters: `title`, `description`, `siteName`, `url`, `template`
- Returns 1200×630px PNG images
- Styled with modern gradient background and clean typography

## Usage

1. Navigate to `/tools/og-preview`
2. Fill in the content details (title, description, site name, URL)
3. Preview how it appears on different social platforms
4. Export the generated image or copy meta tags for your website

## API Endpoint

The image generation API is available at:
```
GET /tools/og-preview/og-image?title=...&description=...&siteName=...&url=...
```

### Parameters
- `title` (required): Page title
- `description` (optional): Page description
- `siteName` (optional): Site name (defaults to "Kevin Hou")
- `url` (optional): Page URL
- `template` (optional): Template style (currently "default")

## Integration

The tool is integrated into the main tools page at `/tools` and uses the routing constant `PAGES.TOOLS.OG_PREVIEW` defined in `/src/utils/pages.ts`.

## Technical Details

- Built with Next.js App Router
- Uses Tailwind CSS for styling
- Leverages shadcn/ui components (Button, Input, Textarea, Card, Label)
- Edge runtime for optimal performance
- TypeScript for type safety
- Responsive design for mobile and desktop
