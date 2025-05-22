import os
from PIL import Image
import argparse

parser = argparse.ArgumentParser(description="Detect and fix images that are too large")
parser.add_argument("--max_kb", type=int, default=3500, help="max KB for image")
parser.add_argument(
    "--buffer_kb",
    type=int,
    default=100,
    help="size buffer in KB to skip recompressing borderline images",
)
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
            if file.endswith((".jpg", ".jpeg")):
                file_paths.append(os.path.join(root, file))
    return file_paths


def bytes_to_human_readable(num_bytes: int) -> str:
    """Convert a number of bytes into a human-readable string with units.

    Args:
        num_bytes (int): The number of bytes.

    Returns:
        str: A human-readable string with the appropriate unit.
    """
    for unit in ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"]:
        if num_bytes < 1024:
            return f"{num_bytes:.2f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.2f} YB"


def get_file_name(file_path: str) -> str:
    return os.path.splitext(os.path.basename(file_path))[0]


def main():
    args = parser.parse_args()

    num_photos = 0
    num_oversized_images = 0
    num_ok_images = 0
    num_images_fixed = 0
    total_bytes_saved = 0

    photo_dir_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../docs"))
    for file in retrieve_photos(photo_dir_path):
        # Get the size of the existing thumbnail
        storage_size = os.path.getsize(file)

        # If the image is significantly over the specified limit, regenerate it.
        if storage_size > (args.max_kb + args.buffer_kb) * 1024:
            num_oversized_images += 1
        else:
            num_ok_images += 1
            continue

        num_photos += 1

        image = Image.open(file)
        original_size = image.size
        original_size_str = f"{original_size[0]}x{original_size[1]}"
        if args.dry_run:
            print(
                f"{'{:<75}'.format(get_file_name(file))}{'{:<20}'.format(bytes_to_human_readable(storage_size))}{'{:<20}'.format(original_size_str)}"
            )
            continue

        # Allow horizontal panoramic images.
        image.thumbnail((15000, 3000))
        image.save(file, "JPEG", optimize=True)

        # Get the new size.
        new_img = Image.open(file)
        new_size_str = f"{new_img.size[0]}x{new_img.size[1]}"
        new_storage_size = os.path.getsize(file)
        size_change = new_storage_size - storage_size
        print(
            f"{'{:<75}'.format(get_file_name(file))}{'{:<20}'.format(bytes_to_human_readable(storage_size))}{'{:<20}'.format(original_size_str)}{'{:<20}'.format(bytes_to_human_readable(new_storage_size))}{'{:<20}'.format(new_size_str)}{'+' if size_change > 0 else '-'}{bytes_to_human_readable(abs(size_change))}"
        )

        num_images_fixed += 1
        total_bytes_saved += size_change

    print(
        f"""
Asset Cleaning Complete:
    ✅ Completed: {num_images_fixed} resizes
    🛠️ Oversized: {num_oversized_images} over {bytes_to_human_readable((args.max_kb + args.buffer_kb) * 1024)}
    ⏭️ Skipped: {num_ok_images} existing
    📷 Total: {num_photos} photos
    🗃️ Saved: {bytes_to_human_readable(abs(total_bytes_saved))}"""
    )


if __name__ == "__main__":
    main()
