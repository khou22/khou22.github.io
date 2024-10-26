import os
import re
from typing import Dict, NamedTuple, Optional
from PIL import Image
import urllib.parse
from datetime import datetime


class AssetMeta(NamedTuple):
    name: str
    path: str
    width: Optional[int] = None
    height: Optional[int] = None


def sanitize_file_key(file_path):
    # Replace all non-alphanumeric characters (excluding slashes) with underscores
    sanitized_path = re.sub(r"[^a-zA-Z0-9/]+", "_", file_path)
    return sanitized_path


def get_asset_map():
    docs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../docs"))
    cdn_map: Dict[str, AssetMeta] = {}

    def traverse_directory(current_dir, current_path=""):
        files = os.listdir(current_dir)

        for file in files:
            file_path = os.path.join(current_dir, file)

            # Ignore DS_Store files
            if file == ".DS_Store":
                continue

            key = sanitize_file_key(f"{current_path}{file}")

            # Remove the extension from the file name
            file_name = os.path.splitext(file)[0]

            # Get the width and height of the image.
            width, height = None, None
            if file.endswith(".jpg") or file.endswith(".jpeg") or file.endswith(".png"):
                image = Image.open(file_path)
                width, height = image.size

            value = AssetMeta(
                name=file_name,
                path=urllib.parse.quote(f"{current_path}{file}"),
                width=width,
                height=height,
            )

            if os.path.isdir(file_path):
                traverse_directory(file_path, f"{current_path}{file}/")
            else:
                cdn_map[key] = value

    traverse_directory(docs_path)
    return cdn_map


def get_python_dict(map: Dict[str, AssetMeta]):
    entries = [
        f'\t"{key}": {{\n    path: "/{value.path}",\n    name: `{value.name}`,\n    dimensions: [{value.width if value.width else "null"}, {value.height if value.height else "null"}],\n  }}'
        for key, value in map.items()
    ]
    return "export const _generatedCdnAssets = {\n" + ",\n".join(entries) + "\n}"


def generate_markdown_catalog(asset_map: Dict[str, AssetMeta]) -> str:
    markdown_lines = ["---\n"]
    markdown_lines.append(f"last_updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    markdown_lines.append("---\n\n")
    markdown_lines.append("# Asset Catalog\n")
    markdown_lines.append("This catalog includes only JPEG and PNG files, excluding placeholders.\n\n")
    base_url = "https://khou22.github.io/"
    
    for key, asset in asset_map.items():
        if not (asset.path.endswith(".jpg") or asset.path.endswith(".jpeg") or asset.path.endswith(".png")):
            continue
        
        # Filter out placeholder images
        if asset.path.endswith(".placeholder.jpg") or asset.path.endswith(".placeholder.jpeg"):
            continue

        public_url = base_url + asset.path
        markdown_lines.append(f"- **{asset.name}**: [{public_url}]({public_url})")
    
    return "\n".join(markdown_lines)


assets = get_asset_map()
object_str = get_python_dict(assets)

# Write to Typescript file.
file_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../src/utils/cdn/cdnAssets.generated.ts")
)

# Make the directory if it doesn't exist.
if not os.path.exists(os.path.dirname(file_path)):
    os.makedirs(os.path.dirname(file_path))

with open(file_path, "w") as f:
    f.write(object_str)


# Generate the Markdown catalog.
markdown_content = generate_markdown_catalog(assets)

# Write to Markdown file.
markdown_file_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../asset-catalog.md")
)

with open(markdown_file_path, "w") as md_file:
    md_file.write(markdown_content)
