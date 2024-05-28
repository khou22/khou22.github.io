---
title: "Generate Dynamic Images with Next.js and React"
author: "Kevin Hou"
date: 2024-05-10 9:00:00
description: "Using Next.js's ImageResponse to generate dynamic images on the fly with React for use as normal PNG files or website open-graph (OG) preview images."
image: "https://khou22.github.io/media/blog/images/syntax-podcast-cover-photo.jpg"
tags: [coding]
featured: true
---


As a photographer and designer, I've always believed images are a multiplier on a website's engagement. While you can often accomplish what you want to render using normal JS + React + CSS, there a few cases where images are simpler and make more sense.

### Use Case 1: Open-Graph Images

For a site to be successful on socials, Twitter, Slack, iMessage, it's imperative that it have an engaging image preview. These platforms often prioritize the preview image above the site title, description, or URL. It's important that the image not only have a graphic relevant to the page, but also contain the title or some other description of the page so that the user knows what the site is doing.

**iMessage Screenshot**
**Slack Screenshot**
**Twitter Screenshot**
**Arc Screenshot**

As an aside, I do love the emphasis platforms are making on the preview image. While sometimes it can lead to click-bait, assuming the image is thoughtfully designed, it leads to a more beautiful web.

You can get really crafty with it by adding a URL param to allow a user to select from a list of predefined designs.

### Use Case 2: Personalized Membership Cards

If your application has personalization for each user, a great way to help customers feel engaged is to give them someone personal that they can save or share. Images are a great way to create this experience, whether it be for a "Membership Card", "Badge", etc.

Here's an example that I built with Codeium:

**Insert example card**

## How To

## Tips

### Shared, Top-Level React Component

If you use a shared, top-level React component instead of writing all your markup within the `ImageResponse`, you'll be able to re-use this component. This helps on two fronts:

1. It helps you develop your component more efficiently as you can add it to an arbitrary page and utilize hot-refreshes to iterate.
2. You can also use

### Use Percentages

If you use percentages instead of hard coded values, you can use this component more flexibly. The default OG image size is 1200 x 630 which could be too large for your mobile display. If you're embedding this card as a preview as a React Compoennt (see tip on using shared, top-level React component), then you'll want to make sure the component is scalable.

You can also make the text dynamic by using `rem` or doing some rough switch / case math based on the length of the string and size of the card.

### Make a Figma Design

There's two reasons for this:

1. You'll come up with something cleaner and more intentional. These card's are only as successful as their design & information they provide. There is no interaction so you'll want to spend some time to get it right.
2. Using Figma's DevMode feature, you'll be able to access absolute / relative positions which makes the development process significantly easier.
