# Kevin Hou's Personal Website and Blog

[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com?repo_name=khou22%2Fkhou22.github.io)

Site is live on: [khou22.com](https://khou22.com?referrer=github&referrer_id=khou22.github.io)

[![khou22.com screenshot](https://khou22.github.io/media/programming/thumbnails/personal-website.png)](https://khou22.com?referrer=github&referrer_id=khou22.github.io)

## Usage Documentation

```bash
# Start the CDN to mimic GitHub pages.
pnpm start:cdn

# Start the NextJS dev server.
pnpm dev
```

Make sure run the following before committing:

```bash
pnpm lint
pnpm prettier
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

### Photo Catalog CLI

Everything above (and everything in the admin UI) is also available from `pnpm photos`. Run `pnpm photos --help` for all commands and options. Photos can be referenced by ID, path, file name, or a unique substring; tags by full value, name, slug, or short name (ie. `landscape`, `san-francisco`, `drone`).

```sh
# Compress -> generate assets -> thumbnails -> generate assets in one step.
pnpm photos ingest docs/photography/new_folder

# Browse and search.
pnpm photos list --untagged
pnpm photos list --tag landscape --tag tahoe --min-rating 4 --for-sale
pnpm photos show "Golden Gate"
pnpm photos tags
pnpm photos subdirs

# Edit metadata (all accept multiple photos).
pnpm photos tag <photo>... --add featured,drone --remove panerama
pnpm photos category <photo>... --set landscape,city
pnpm photos location san-francisco <photo>...
pnpm photos sell off <photo>...
pnpm photos rate 5 <photo>...

# Files (moves/deletes keep the DB, thumbnail, and asset map in sync).
pnpm photos move <photo> "photography/san_francisco/New Name.jpg"
pnpm photos delete <photo>...

# Image processing and maintenance (dry run unless --no-dry-run).
pnpm photos clean --max-kb 2100 --no-dry-run
pnpm photos thumbnails --no-dry-run
pnpm photos resize <file|photo>... --max 2000 [--out dir]
pnpm photos assets
pnpm photos clean-db --no-dry-run
```

Bulk edits compose with `--ids`, ie. `pnpm photos list --subdir events --ids | xargs pnpm photos sell off`.

The CLI lives in `scripts/photo-cli/`: `commands/` holds one module per command group (browse, metadata, files, images, db) and `lib/` holds the shared logic (argument parsing, photo/tag resolution, catalog queries, image processing). Tests run against a temporary DB and docs folder (`PHOTO_DB_PATH` / `PHOTO_DOCS_DIR`) with a fixture asset map, so they never touch real photos: `pnpm test scripts/photo-cli src/data/photos`.

### To Do

- [ ] Add a whitelist of blog images that don't need to be compressed. (ie. `docs/media/blog/images/mintlify-feature/mintlify-founder-mode-blog-post.jpeg`)
- [ ] Add a buffer to the clean image script so that we don't repeatedly compress the same images that are borderline.
