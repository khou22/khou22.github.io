import os
from PIL import Image
import argparse

parser = argparse.ArgumentParser(description="Generate thumbnails for images")
parser.add_argument("--max_kb", type=int, default=300, help="max KB for thumbnail")
parser.add_argument(
    "--dry-run",
    type=bool,
    default=True,
    action=argparse.BooleanOptionalAction,  # To set to false use --no-dry-run
    help="dry run",
)


def retrieve_photos(path: str) -> list[str]:
    file_paths = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith((".jpg", ".jpeg")) and not file.endswith(
                (".placeholder.jpg", ".placeholder.jpeg")
            ):
                file_paths.append(os.path.join(root, file))
    return file_paths


def main():
    args = parser.parse_args()

    num_photos = 0
    num_oversized_thumbnails = 0
    num_existing_thumbnails = 0
    num_thumbnails_generated = 0

    photo_dir_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../docs/photography")
    )
    for file in retrieve_photos(photo_dir_path):
        # Save the thumbnail with a .placeholder.jpg extension
        thumbnail_path = file.replace(".jpg", ".placeholder.jpg").replace(
            ".jpeg", ".placeholder.jpeg"
        )

        if os.path.exists(thumbnail_path):
            # Get the size of the existing thumbnail
            size = os.path.getsize(thumbnail_path)

            # If the thumbnail is over the specified limit, regenerate it.
            if size > args.max_kb * 1024:
                num_oversized_thumbnails += 1
            else:
                num_existing_thumbnails += 1
                continue

        num_photos += 1

        if args.dry_run:
            print(f"[dry run] Generating thumbnail for {file}")
            continue

        image = Image.open(file)
        image.thumbnail((800, 800))
        image.save(thumbnail_path, "JPEG", optimize=True)
        num_thumbnails_generated += 1

    print(
        f"""
Thumbnail Generation Complete:
    ✅ Completed: {num_thumbnails_generated} generations
    🛠️ Oversized: {num_oversized_thumbnails} over {args.max_kb}KB
    ⏭️ Skipped: {num_existing_thumbnails} existing
    📷 Total: {num_photos} photos"""
    )


if __name__ == "__main__":
    main()
