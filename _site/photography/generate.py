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
PLACEHOLDER_WIDTH = 500

collectionList = glob.glob('%s/*.json' % JSON_DIRECTORY)

# Collect all image objects
allImageNames = set()
allImages = []

# Store original widths and heights (key: photo name, value: (w, h))
original_dimensions = {}

generateTimestamps = False

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
            if (generateTimestamps):
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

                photoName = photo['name']
                if ('.jpg' not in photoName): photoName = "%s.jpg" % photo['name']
                print("Finding %s" % photoName)

                if manager.exists(photoName):
                    imagePath, placeholderPath, width, height = manager.getSrc(photoName)
                    print("%s already exists in DB" % photoName)
                else:
                    print("Saving %s" % photoName)
                    imagePath, placeholderPath, width, height = manager.create(photoName, photo['url'], MAX_WIDTH, PLACEHOLDER_WIDTH)

                original_dimensions[photoName] = (photo['width'], photo['height'])

                photoObject['name'] = os.path.splitext(photoName)[0]
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

                # Add to master collection
                if photoObject['name'] not in allImageNames:
                    allImageNames.add(photoObject['name'])
                    allImages.append(photo)


            outputFile.write("    ].reverse()\n")
            outputFile.write("  };\n")
            outputFile.write("</script>\n")


################   Generate JS Object with All URLs   ################
allPhotoNames = manager.getAllNames()
with open("allImages.js", 'w') as outputFile:
    outputFile.write("// Autogen via generate.py \n")
    if (generateTimestamps):
        outputFile.write("// %s \n" % datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    outputFile.write("const ALL_DATABASE_PHOTOS = [\n")

    for photoName in allPhotoNames:
        filePath, placeholderFileName, width, height = manager.getSrc(photoName)
        outputFile.write("    {\n")
        outputFile.write("        url: \"/database/%s\",\n" % photoName)
        outputFile.write("        horizontal: %s\n" % str(width > height).lower())
        outputFile.write("    },\n")
    
    outputFile.write("];\n")

################   Generate a Product Page for Each Photo   ################
photography_print_options = [
  [(8, 10), 29],
  [(11, 14), 39],
  [(16, 20), 99],
  [(24, 30), 149],
]
ideal_dpi = 200
default_short_edge = 3000 # Default if no dimension included in Lookbook JSON
found_original_dimensions = 0
missing_original_dimensions = 0

if not os.path.exists('photos'):
    os.makedirs('photos')

for photoName in allPhotoNames:
    photoNameNoExtension = os.path.splitext(photoName)[0]
    photoProductPage = 'photos/%s' % photoNameNoExtension
    if not os.path.exists(photoProductPage):
        os.makedirs(photoProductPage)

    filePath, placeholderFileName, width, height = manager.getSrc(photoName)

    # Get original width and height or use the default fallback.
    if photoName in original_dimensions:
        found_original_dimensions += 1
        original_width, original_height = original_dimensions[photoName]
    else:
        original_width, original_height = (default_short_edge, default_short_edge)
        missing_original_dimensions += 1

    # Filter the size options taking into account DPI.
    min_edge = min(original_width, original_height)
    min_print_edge_inches = min_edge / ideal_dpi
    filtered_print_options = [option for option in photography_print_options if option[0][0] <= min_print_edge_inches]

    # Format into ["print size", price].
    final_print_options = [["%dx%d" % option[0], option[1]] for option in filtered_print_options]

    # Convert into a string to inject into the liquid template.
    final_print_options_str = '[' + ', '.join(["[\"%s\", %d]" % (option[0], option[1]) for option in final_print_options]) + ']'

    with open("%s/index.html" % photoProductPage, 'w') as outputFile:
        outputFile.write("---\n")
        outputFile.write("layout: photo\n")
        outputFile.write("title: \"Print Details - KHou Photography\"\n")
        outputFile.write("photoName: \"%s\"\n" % photoNameNoExtension)
        outputFile.write("source: \"%s\"\n" % filePath[2:])
        outputFile.write("placeholder: \"/database/%s\"\n" % placeholderFileName)
        outputFile.write("width: \"%s\"\n" % width)
        outputFile.write("height: \"%s\"\n" % height)
        outputFile.write("print_options: %s\n" % final_print_options_str)
        outputFile.write("---\n")
        outputFile.write("\n")

        outputFile.write("<!-- Autogen via generate.py -->\n")
        if (generateTimestamps):
            outputFile.write("<!-- %s -->\n" % datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    # Product JSON for Snipcart (allow any size to avoid unexpected bugs)
    for printOption in final_print_options:
        size, price = printOption
        jsonUrl = "%s/%s.json" % (photoProductPage, size)

        id = "%s (%s)" % (photoNameNoExtension, size)
        url = "/photography/photos/%s/%s.json" % (photoNameNoExtension, size)

        with open(jsonUrl, 'w') as outputFile:
            outputFile.write("{\n")
            outputFile.write("\t\"id\": \"%s\",\n" % id)
            outputFile.write("\t\"price\": %.2f,\n" % price)
            outputFile.write("\t\"url\": \"%s\"\n" % url)
            outputFile.write("}\n")

################   Master Collection With All Photos   ################
if not os.path.exists('master'):
    os.makedirs('master')
with open("master/index.html", 'w') as outputFile:
    # Liquid meta
    outputFile.write("---\n")
    outputFile.write("layout: gallery\n")
    outputFile.write("title: \"All Photos | KHou Photography\"\n")
    outputFile.write("layout_style: ROWS\n")
    outputFile.write("spacing: 10\n")
    outputFile.write("shuffle: true\n")
    outputFile.write("columns: 5\n")
    outputFile.write("max_height: 300\n")
    outputFile.write("---\n")
    outputFile.write("\n")

    outputFile.write("<!-- Autogen via generate.py -->\n")
    if (generateTimestamps):
        outputFile.write("<!-- %s -->\n" % datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    outputFile.write("<script>\n")
    outputFile.write("  const GALLERY_IMAGES = {\n")
    outputFile.write("    'All Photos': [\n")

    # For each photo
    for photo in allImages:
        photoObject = {}

        # Check if image has already been downloaded
        imagePath = ''
        placeholderPath = ''

        photoName = photo['name']
        if ('.jpg' not in photoName): photoName = "%s.jpg" % photo['name']
        print("Finding %s" % photoName)

        if manager.exists(photoName):
            imagePath, placeholderPath, width, height = manager.getSrc(photoName)
            print("%s already exists in DB" % photoName)
        else:
            print("Saving %s" % photoName)
            imagePath, placeholderPath, width, height = manager.create(photoName, photo['url'], MAX_WIDTH, PLACEHOLDER_WIDTH)

        photoObject['name'] = os.path.splitext(photoName)[0]
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

print("\n")
print("Found %d out of %d original dimensions" % (found_original_dimensions, missing_original_dimensions))
