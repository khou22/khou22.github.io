#!/usr/bin/python
from PIL import Image
import os, sys

pathToDirectory = '../../media/store/'
dirs = os.listdir(pathToDirectory)

width = 600 # Reduced width

for item in dirs:
    filePath = pathToDirectory + item
    if os.path.isfile(filePath):
        if ".DS_Store" in filePath: continue # Skip

        img = Image.open(filePath)
        f, e = os.path.splitext(filePath)

        widthPercent = (width/float(img.size[0]))
        height = int((float(img.size[1]) * float(widthPercent)))

        img = img.resize((width, height), Image.ANTIALIAS)

        img.save(f + '.jpg', 'JPEG', quality=90)
