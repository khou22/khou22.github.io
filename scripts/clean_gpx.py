"""
Script to cleanse the .gpx files in src/data/cycling/ of privacy-sensitive metadata.

Keep only:
- Latitude
- Longitude
- Altitude

Add additional:
- Copyright / ownership metadata

Notably remove:
- Timestamps
- Heartrate
- Metadata
"""

import os
import argparse
import gpxpy
import gpxpy.gpx

parser = argparse.ArgumentParser(description="Cleanse GPX files of sensitive metadata.")
parser.add_argument(
    "--dry-run",
    type=bool,
    default=True,
    action=argparse.BooleanOptionalAction,  # To set to false use --no-dry-run
    help="dry run",
)
parser.add_argument(
    "--target-file",
    type=str,
    help="Optional: target a specific file instead of scanning the directory.",
)

COPYRIGHT_TEXT = "Copyright Kevin Hou"
DATA_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../src/data/cycling/")
)


def clean_gpx_file(file_path: str, dry_run: bool) -> bool:
    """Cleans a single GPX file. Returns True if changes were made/would be made."""
    try:
        with open(file_path, "r") as f:
            gpx = gpxpy.parse(f)
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        return False

    # Clear top-level metadata
    gpx.time = None
    gpx.author_name = COPYRIGHT_TEXT
    gpx.author_email = None
    gpx.author_link = None
    gpx.copyright_author = COPYRIGHT_TEXT
    gpx.keywords = None
    gpx.description = None

    # Iterate through tracks, segments, and points
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                # Remove time
                point.time = None
                # Remove extensions (heartrate, cadence, etc.)
                point.extensions = []
                # Latitude, longitude, and elevation are preserved by default

    if dry_run:
        print(f"[dry run] Would clean {file_path}")
        return True

    # Save the modified GPX data back to the file
    with open(file_path, "w") as f:
        f.write(gpx.to_xml())
    print(f"Cleaned {file_path}")
    return True


def main():
    args = parser.parse_args()
    files_processed = 0

    if args.target_file:
        if os.path.exists(args.target_file) and args.target_file.endswith(".gpx"):
            clean_gpx_file(args.target_file, args.dry_run)
            files_processed += 1
        else:
            print(f"Error: Target file '{args.target_file}' does not exist or is not a .gpx file.")
            return
    else:
        if not os.path.exists(DATA_DIR):
             print(f"Data directory not found: {DATA_DIR}")
             return

        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".gpx"):
                file_path = os.path.join(DATA_DIR, filename)
                clean_gpx_file(file_path, args.dry_run)
                files_processed += 1

    print(f"\nProcessing Complete.")
    print(f"    Mode: {'Dry Run' if args.dry_run else 'Live Run'}")
    print(f"    Files Processed: {files_processed}")


if __name__ == "__main__":
    main()