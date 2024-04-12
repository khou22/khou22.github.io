# Kevin Hou's Personal Website and Blog

[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com?repo_name=khou22%2Fkhou22.github.io) [![streak](https://codeium.com/badges/v2/user/kevin/streak)](https://codeium.com/profile/kevin)

Site is live on: [khou22.com](https://khou22.com?referrer=github&referrer_id=khou22.github.io)

[![khou22.com screenshot](https://khou22.github.io/media/programming/thumbnails/personal-website.png)](https://khou22.com?referrer=github&referrer_id=khou22.github.io)

## Usage Documentation

```bash
# Start the CDN to mimic GitHub pages.
pnpm start:cdn

# Start the NextJS dev server.
pnpm dev
```

### Deployment

1. Static assets will be on GitHub pages. I'm going to leverage the `docs/` subdirectory as my CDN.
2. The main site will be a NextJS app that I will deploy from Vercel

### Design

Color palette:

```txt
blue: #3286A8
red: #D5491F
orange: #DA8D0F
green: #80A454
gray: #9DB7C1
```

### Image Cleaning

I created helper scrips to compress images and create thumbnails. I use these when uploading new photos:

```sh
# Compress images.
pnpm clean-images --max_kb 2100 --no-dry-run

# Update Typescript objects.
pnpm generate:assets

# Generate thumbnails.
pnpm generate:thumbnails --no-dry-run

# Regenerate Typescript objects with thumbnails.
pnpm generate:assets
```

Then you can go to the [admin page](http://localhost:3000/admin/photos) and set the tags appropriately.
