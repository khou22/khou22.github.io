import os
import re
from typing import Dict, NamedTuple
import urllib.parse


class AssetMeta(NamedTuple):
    name: str
    path: str


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

            value = AssetMeta(
                name=file_name, path=urllib.parse.quote(f"{current_path}{file}")
            )

            if os.path.isdir(file_path):
                traverse_directory(file_path, f"{current_path}{file}/")
            else:
                cdn_map[key] = value

    traverse_directory(docs_path)
    return cdn_map


def get_python_dict(map: Dict[str, AssetMeta]):
    entries = [
        f'\t"{key}": {{\n    path: "/{value.path}",\n    name: `{value.name}`,\n  }}'
        for key, value in map.items()
    ]
    return "export const _generatedCdnAssets = {\n" + ",\n".join(entries) + "\n}"


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
