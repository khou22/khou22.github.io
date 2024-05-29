---
title: "Generate Dynamic Images with Next.js and React"
author: "Kevin Hou"
date: 2024-05-10 9:00:00
description: "Using Next.js's ImageResponse to generate dynamic images on the fly with React for use as normal PNG files or website open-graph (OG) preview images."
image: "https://khou22.github.io/media/blog/images/syntax-podcast-cover-photo.jpg"
tags: [coding]
featured: false
---


As a photographer and designer, I've always believed images are a multiplier on a website's engagement. While you can often accomplish what you want to render using normal JS + React + CSS, there a few cases where images are simpler and make more sense.

### Use Case 1: Open-Graph Images

For a site to be successful on socials, Twitter, Slack, iMessage, it's imperative that it have an engaging image preview. These platforms often prioritize the preview image above the site title, description, or URL. Twitter / X even goes so far as to not show the link at all. Instead, it only shows the preview image for you to click.

It's important that the image not only have a graphic relevant to the page, but also contain the title or some other description of the page so that the user knows what the site is doing.

![imessage og image preview](https://khou22.github.io/media/blog/images/dynamic-og-images/imessage-og-image.png)

![slack og image preview](https://khou22.github.io/media/blog/images/dynamic-og-images/slack-og-image.png)

![twitter og image preview](https://khou22.github.io/media/blog/images/dynamic-og-images/twitter-post-with-image.png)

![arc og image preview demo](https://khou22.github.io/media/blog/images/dynamic-og-images/arc-og-image-demo.gif)

As an aside, I do love the emphasis platforms are making on the preview image. While sometimes it can lead to click-bait, assuming the image is thoughtfully designed, it leads to a more beautiful web.

You can get really crafty with it by adding a URL param to allow a user to select from a list of predefined designs.

### Use Case 2: Personalized Membership Cards

If your application has personalization for each user, a great way to help customers feel engaged is to give them someone personal that they can save or share. Images are a great way to create this experience, whether it be for a "Membership Card", "Badge", etc.

Here's an example that I built with Codeium:

[![Codeium membership card example](https://khou22.github.io/media/blog/images/dynamic-og-images/codeium-membership-card.png)](https://codeium.com/profile/kevin)

## How To

### Make a Figma Design

There's two reasons for this:

1. You'll come up with something cleaner and more intentional. These card's are only as successful as their design & information they provide. There is no interaction so you'll want to spend some time to get it right.
2. Using Figma's DevMode feature, you'll be able to access absolute / relative positions which makes the development process significantly easier.

### Create a Shared, Top-Level React Component

If you use a shared, top-level React component instead of writing all your markup within the `ImageResponse`, you'll be able to re-use this component. This helps on two fronts:

1. It helps you develop your component more efficiently as you can add it to an arbitrary page and utilize hot-refreshes to iterate.
2. You can also use it in the `.png` or `.jpg` route endpoint to generate dynamic images on the fly. When you render the image as a cover image, you can simply make a `app/path/to/card.png/route.tsx` file and use that shared component.

Here's an example of a component: [PhotoAlbumCover](https://github.com/khou22/khou22.github.io/blob/a3291bb03df4898c3e3f78606c6d862684b4adc1/src/components/organisms/PhotoAlbumCover/PhotoAlbumCover.tsx#L26).

You'll need to use inline styling since TailwindCSS is still in beta. It's worth noting that you'll need to _explicitly_ specify `display: flex` when using a `<div>`. If not, you'll receive this very obscure error:

```log
⨯ Error: failed to pipe response
    at pipeToNodeResponse (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/pipe-readable.js:126:15)
    at async sendResponse (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/send-response.js:40:13)
    at async doRender (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/base-server.js:1407:25)
    at async cacheEntry.responseCache.get.routeKind (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/base-server.js:1587:40)
    at async DevServer.renderToResponseWithComponentsImpl (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/base-server.js:1507:28)
    at async DevServer.renderPageComponent (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/base-server.js:1924:24)
    at async DevServer.renderToResponseImpl (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/base-server.js:920:25)
    at async NextNodeServer.handleCatchallRenderRequest (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/base-server.js:816:17)
    at async /path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/lib/router-server.js:174:21)
    at async handleRequest (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/lib/router-server.js:353:24)
    at async requestHandlerImpl (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/lib/router-server.js:377:13)
    at async Server.requestListener (/path/to/repo/khou22.github.io/node_modules/.pnpm/next@14.2.3_@babel+core@7.23.6_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/lib/start-server.js:141:13)
```

Your server will disconnect and you'll get no response or error message on the client. The solution is to make sure you always have `display: flex` [like so](https://github.com/khou22/khou22.github.io/blob/a3291bb03df4898c3e3f78606c6d862684b4adc1/src/components/organisms/PhotoAlbumCover/PhotoAlbumCover.tsx#L84).

#### Tip: Use Percentages

If you use percentages instead of hard coded values, you can use this component more flexibly. The default OG image size is 1200 x 630 which could be too large for your mobile display. If you're embedding this card as a preview as a React Compoennt (see tip on using shared, top-level React component), then you'll want to make sure the component is scalable.

You can also make the text dynamic by using `rem` or doing some rough switch / case math based on the length of the string and size of the card.

### Create a NextJS ImageResponse Endpoint

And this is how you would use it as a NextJS image endpoint:

```typescript
export async function GET(_: NextRequest, context: RouteParams) {
    return new ImageResponse(
        <PhotoAlbumCover someProp="Hello, World!"/>,
        {
            width: 1200,
            height: 630,
        },
    );
}
```

Here's a live example: [khou22.github.io/src/app/share/[album_id]/cover.png/route.tsx](https://github.com/khou22/khou22.github.io/blob/a3291bb03df4898c3e3f78606c6d862684b4adc1/src/app/share/%5Balbum_id%5D/cover.png/route.tsx#L15)

Hope this helps!
