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
if not os.path.exists('photos'):
    os.makedirs('photos')

for photoName in allPhotoNames:
    photoNameNoExtension = os.path.splitext(photoName)[0]
    photoProductPage = 'photos/%s' % photoNameNoExtension
    if not os.path.exists(photoProductPage):
        os.makedirs(photoProductPage)

    filePath, placeholderFileName, width, height = manager.getSrc(photoName)
    with open("%s/index.html" % photoProductPage, 'w') as outputFile:
        outputFile.write("---\n")
        outputFile.write("layout: photo\n")
        outputFile.write("title: \"Print Details - KHou Photography\"\n")
        outputFile.write("photoName: \"%s\"\n" % photoNameNoExtension)
        outputFile.write("source: \"../../%s\"\n" % filePath)
        outputFile.write("placeholder: \"../../../database/%s\"\n" % placeholderFileName)
        outputFile.write("width: \"%s\"\n" % width)
        outputFile.write("height: \"%s\"\n" % height)
        outputFile.write("---\n")
        outputFile.write("\n")

        outputFile.write("<!-- Autogen via generate.py -->\n")
        outputFile.write("<!-- %s -->\n" % datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

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
