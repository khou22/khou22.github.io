# An image manager for a local cache of small images
# Can check whether the image exists already before creating

import glob
import os
from io import BytesIO

import requests
from PIL import Image


class ImageManager:

    def __init__(self, directory):
        if not os.path.exists(directory):
            os.makedirs(directory)

        self.directory = directory

        self.images = {}
        imageList = glob.glob('%s/*.jpg' % directory) # TODO: only jpeg images right now
        for imagePath in imageList:
            fileName = os.path.basename(imagePath)
            self.images[fileName] = imagePath

    def exists(self, image):
        return image in self.images.keys()

    def getSrc(self, image):
        filePath = self.images[image]
        img = Image.open(filePath)
        return filePath, img.width, img.height
    
    # Download the file into the image store using the imageName
    def create(self, imageName, src, resizeWidth):
        localPath = "%s/%s" % (self.directory, imageName)

        # Download image
        response = requests.get(src)
        img = Image.open(BytesIO(response.content))

        # Resize to width
        width = resizeWidth
        widthPercent = (width/float(img.size[0]))
        height = int(float(img.size[1]) * float(widthPercent))

        if width > height: # If landscape
            height = width
            heightPercentage = height/float(img.size[1])
            width = int(float(img.size[0] * float(heightPercentage)))

        img = img.resize((width, height), Image.ANTIALIAS)

        # Save to file
        img.save("%s/%s" % (self.directory, imageName), 'JPEG', quality=100)
        print("Saving %s/%s" % (self.directory, imageName))

        # On success, retrun the local path
        return localPath, width, height
