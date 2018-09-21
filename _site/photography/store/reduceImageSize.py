#!/usr/bin/python
from PIL import Image
import os, sys

pathToDirectory = '../../media/store/'
dirs = os.listdir(pathToDirectory)

SET_WIDTH = 600 # Reduced width

numSkipped = 0
numProcessed = 0

for item in dirs:
    filePath = pathToDirectory + item
    if os.path.isfile(filePath):
        if ".DS_Store" in filePath: continue # Skip

        img = Image.open(filePath)
        f, e = os.path.splitext(filePath)

        if (int(img.size[0]) == SET_WIDTH or int(img.size[1]) == SET_WIDTH):
            numSkipped += 1
            continue # Skip ones that have already been resized

        width = SET_WIDTH
        widthPercent = (width/float(img.size[0]))
        height = int(float(img.size[1]) * float(widthPercent))

        if width > height: # If landscape
            height = width
            heightPercentage = height/float(img.size[1])
            width = int(float(img.size[0] * float(heightPercentage)))

        img = img.resize((width, height), Image.ANTIALIAS)
        # print("Resized to: %d x %d" % (width, height))

        img.save(f + '.jpg', 'JPEG', quality=90)
        numProcessed += 1
        print("Finished %s.jpg" % f)

print("Skipped %d files" % numSkipped)
print("Processed %d files" % numProcessed)
