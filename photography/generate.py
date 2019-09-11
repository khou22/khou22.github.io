# Get files from `json/`

import calendar
import glob
import io
import json
import os
import time
import urllib
from datetime import datetime

from imageManager import ImageManager

# TODO: Create the small size placeholder and the large size for faster lazy loading

# Options
JSON_DIRECTORY = "json"
MAX_WIDTH = 1600
PLACEHOLDER_WIDTH = 600

collectionList = glob.glob('%s/*.json' % JSON_DIRECTORY)

################   Read JSON   ################

print("%d Collection(s) Found" % len(collectionList))
manager = ImageManager('../database')

################   Create Collection Folder   ################
for collectionSource in collectionList:
    with open(collectionSource) as collectionJson:
        collection = json.load(collectionJson)

        collectionSlug = os.path.splitext(os.path.basename(collectionSource))[0]
        collectionName = collection['name']
        photos = collection['photos']

        if not os.path.exists(collectionSlug):
            os.makedirs(collectionSlug)
        
        with open("%s/index.html" % collectionSlug, 'w') as outputFile:
            # Liquid meta
            outputFile.write("---\n")
            outputFile.write("layout: gallery\n")
            outputFile.write("title: \"%s - KHou Photography\"\n" % collectionName)
            outputFile.write("layout_style: ROWS\n")
            outputFile.write("spacing: 10\n")
            outputFile.write("shuffle: false\n")
            outputFile.write("columns: 4\n")
            outputFile.write("max_height: 400\n")
            outputFile.write("---\n")
            outputFile.write("\n")

            outputFile.write("<!-- Autogen via generate.py -->\n")
            outputFile.write("<!-- %s -->\n" % datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

            outputFile.write("<script>\n")
            outputFile.write("  const GALLERY_IMAGES = {\n")
            outputFile.write("    '%s': [\n" % collectionName)

            # For each photo
            for photo in photos:
                photoObject = {}

                # Check if image has already been downloaded
                imagePath = ''
                placeholderPath = ''
                if manager.exists(photo['name']):
                    imagePath, placeholderPath, width, height = manager.getSrc(photo['name'])
                    print("%s already exists in DB" % photo['name'])
                else:
                    print("Saving %s" % photo['name'])
                    imagePath, placeholderPath, width, height = manager.create(photo['name'], photo['url'], MAX_WIDTH, PLACEHOLDER_WIDTH)

                photoObject['name'] = photo['name']
                photoObject['src'] = imagePath
                photoObject['width'] = width
                photoObject['height'] = height

                # Write out to JS file
                outputFile.write("      {\n")
                outputFile.write("        name: \"%s\",\n" % photoObject['name'])
                outputFile.write("        compressed: true,\n")
                outputFile.write("        path: \"../%s\",\n" % photoObject['src'])
                outputFile.write("        compressed_path: \"../../database/%s\",\n" % placeholderPath)
                outputFile.write("        placeholder_path: \"../%s\",\n" % photoObject['src'])
                outputFile.write("        width: %d,\n" % photoObject['width'])
                outputFile.write("        height: %d,\n" % photoObject['height'])
                outputFile.write("      },\n")


            outputFile.write("    ]\n")
            outputFile.write("  };\n")
            outputFile.write("</script>\n")
